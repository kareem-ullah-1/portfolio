import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const { sendMail, createTransport } = vi.hoisted(() => {
  const sendMail = vi.fn();
  return { sendMail, createTransport: vi.fn(() => ({ sendMail })) };
});
vi.mock('nodemailer', () => ({ default: { createTransport } }));

import { POST } from '@/app/api/contact/route';

const smtpEnv = {
  SMTP_HOST: 'smtp.test',
  SMTP_PORT: '587',
  SMTP_USER: 'sender@test.dev',
  SMTP_PASS: 'secret-pass',
  CONTACT_TO_EMAIL: 'owner@test.dev',
};
const SMTP_KEYS = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO_EMAIL', 'MAIL_FROM'];

const valid = { name: 'Ada Lovelace', email: 'Ada@Example.com', subject: 'Project', message: 'Hello, I would like to talk.' };

function post(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  SMTP_KEYS.forEach((k) => delete process.env[k]);
  Object.assign(process.env, smtpEnv);
  sendMail.mockReset().mockResolvedValue({});
  createTransport.mockClear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => vi.restoreAllMocks());

describe('POST /api/contact', () => {
  it('sends an email and returns 201 for a valid submission', async () => {
    const res = await post({ ...valid, website: '' });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ success: true, message: 'Thanks! Your message has been received.' });
    expect(createTransport).toHaveBeenCalledWith({
      host: 'smtp.test',
      port: 587,
      secure: false,
      auth: { user: 'sender@test.dev', pass: 'secret-pass' },
    });
    const mail = sendMail.mock.calls[0][0];
    expect(mail.to).toBe('owner@test.dev');
    expect(mail.from).toBe('sender@test.dev');
    expect(mail.replyTo).toEqual({ name: 'Ada Lovelace', address: 'ada@example.com' });
    expect(mail.subject).toBe('Portfolio contact: Project');
    expect(mail.text).toContain('Hello, I would like to talk.');
    expect(mail.text).not.toContain('website');
  });

  it('uses MAIL_FROM when configured', async () => {
    process.env.MAIL_FROM = 'Portfolio <noreply@test.dev>';
    await post(valid);
    expect(sendMail.mock.calls[0][0].from).toBe('Portfolio <noreply@test.dev>');
  });

  it('strips CR/LF from name and subject', async () => {
    await post({ ...valid, name: 'Ada\r\nBcc: x@y.z', subject: 'Hi\nthere' });
    const mail = sendMail.mock.calls[0][0];
    expect(mail.replyTo.name).not.toMatch(/[\r\n]/);
    expect(mail.subject).toBe('Portfolio contact: Hi there');
  });

  it.each([
    ['short name', { ...valid, name: 'A' }],
    ['bad email', { ...valid, email: 'nope' }],
    ['short message', { ...valid, message: 'short' }],
    ['long subject', { ...valid, subject: 'x'.repeat(121) }],
  ])('rejects invalid input (%s) with 400 and sends nothing', async (_label, body) => {
    const res = await post(body);
    expect(res.status).toBe(400);
    expect((await res.json()).success).toBe(false);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON, non-JSON content types and oversized bodies', async () => {
    expect((await post('{not json')).status).toBe(400);
    expect((await post(valid, { 'Content-Type': 'text/plain' })).status).toBe(415);
    expect((await post({ ...valid, message: 'x'.repeat(20_000) })).status).toBe(413);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('returns a generic success for a filled honeypot without sending email', async () => {
    const res = await post({ ...valid, website: 'http://spam.example' });
    expect(res.status).toBe(201);
    expect((await res.json()).success).toBe(true);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('returns 503 when SMTP is not configured', async () => {
    delete process.env.SMTP_HOST;
    const res = await post(valid);
    expect(res.status).toBe(503);
    expect((await res.json()).success).toBe(false);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('returns 502 without leaking internals when SMTP delivery fails', async () => {
    sendMail.mockRejectedValueOnce(new Error('535 auth failed for secret-pass'));
    const res = await post(valid);
    expect(res.status).toBe(502);
    const text = JSON.stringify(await res.json());
    expect(text).not.toContain('secret-pass');
    expect(text).not.toContain('535');
    expect(JSON.stringify((console.error as unknown as { mock: { calls: unknown[] } }).mock.calls)).not.toContain('secret-pass');
  });
});
