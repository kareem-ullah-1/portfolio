import { NextResponse } from 'next/server';
import { getSmtpConfig, sendContactEmail } from '@/lib/mail';
import { contactRequestSchema } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024;

type Body = { success: true; message: string } | { success: false; message: string };

const reply = (status: number, body: Body) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return reply(415, { success: false, message: 'Content-Type must be application/json.' });
  }

  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return reply(413, { success: false, message: 'Request body is too large.' });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return reply(400, { success: false, message: 'Invalid request body.' });
  }
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    return reply(413, { success: false, message: 'Request body is too large.' });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return reply(400, { success: false, message: 'Request body must be valid JSON.' });
  }
  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    return reply(400, { success: false, message: 'Request body must be a JSON object.' });
  }

  // Same generic success as a real submission, so bots learn nothing. Nothing is sent.
  const honeypot = (json as Record<string, unknown>).website;
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return reply(201, { success: true, message: 'Thanks! Your message has been received.' });
  }

  const parsed = contactRequestSchema.safeParse(json);
  if (!parsed.success) {
    return reply(400, {
      success: false,
      message: parsed.error.issues.map((issue) => issue.message).join(' '),
    });
  }

  const config = getSmtpConfig();
  if (!config) {
    console.error('[contact] SMTP is not configured (SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL).');
    return reply(503, { success: false, message: 'Messages cannot be delivered right now.' });
  }

  const { name, email, subject, message } = parsed.data;
  try {
    await sendContactEmail(config, { name, email, subject: subject || undefined, message });
  } catch (error) {
    console.error('[contact] SMTP delivery failed:', error instanceof Error ? error.name : 'unknown error');
    return reply(502, { success: false, message: 'Your message could not be delivered. Please try again later.' });
  }

  return reply(201, { success: true, message: 'Thanks! Your message has been received.' });
}
