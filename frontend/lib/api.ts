import { site } from './site';
import type { ContactInput } from './validation';

export type ContactResult =
  | { ok: true }
  | { ok: false; kind: 'validation' | 'rate-limit' | 'server' | 'network'; message: string };

export async function sendContact(input: ContactInput & { website?: string }): Promise<ContactResult> {
  let res: Response;
  try {
    res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  } catch {
    return { ok: false, kind: 'network', message: `Couldn't reach the server. Check your connection, or email me at ${site.email}.` };
  }
  if (res.ok) return { ok: true };
  if (res.status === 429) {
    return { ok: false, kind: 'rate-limit', message: 'Too many messages in a short time. Please try again in a few minutes.' };
  }
  if (res.status === 400) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const text = Array.isArray(body?.message) ? body.message.join(' ') : body?.message;
    return { ok: false, kind: 'validation', message: text ?? 'Some fields are invalid. Please check and try again.' };
  }
  return { ok: false, kind: 'server', message: `Something went wrong on my side. Please try again, or email me at ${site.email}.` };
}
