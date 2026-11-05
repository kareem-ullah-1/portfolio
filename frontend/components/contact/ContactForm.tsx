'use client';

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlert, CircleCheck, LoaderCircle, Send } from 'lucide-react';
import { sendContact } from '@/lib/api';
import { validateContact, type ContactErrors } from '@/lib/validation';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'success' } | { kind: 'error'; message: string };
type Values = { name: string; email: string; subject: string; message: string };

const empty: Values = { name: '', email: '', subject: '', message: '' };

const inputClass =
  'glass-field w-full rounded-xl px-4 py-3 text-base text-fg placeholder:text-muted/70 outline-none disabled:opacity-60';

function FieldLabel({ id, label, optional }: { id: string; label: string; optional?: boolean }) {
  return (
    <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-medium">
      {label}
      {optional && <span className="font-mono text-xs font-normal text-muted">optional</span>}
    </label>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? (
    <p id={`${id}-error`} className="mt-1.5 text-sm text-[#ff7a8d]">
      {error}
    </p>
  ) : null;
}

export function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const honeypot = useRef<HTMLInputElement>(null);
  const sending = status.kind === 'sending';

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (status.kind !== 'idle' && status.kind !== 'sending') setStatus({ kind: 'idle' });
  };

  const blur = (key: keyof Values) => () => {
    const { errors: found } = validateContact({ ...values });
    setErrors((prev) => ({ ...prev, [key]: values[key] || key !== 'subject' ? found[key] : undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const { data, errors: found } = validateContact({ ...values });
    if (!data) {
      setErrors(found);
      document.getElementById(`${uid}-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setErrors({});
    setStatus({ kind: 'sending' });
    const result = await sendContact({
      ...data,
      subject: data.subject || undefined,
      website: honeypot.current?.value ?? '',
    });
    if (result.ok) {
      setValues(empty);
      setStatus({ kind: 'success' });
    } else {
      setStatus({ kind: 'error', message: result.message });
    }
  }

  const fieldProps = (key: keyof Values) => {
    const id = `${uid}-${key}`;
    const error = errors[key];
    return {
      id,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `${id}-error` : undefined,
      disabled: sending,
      className: `${inputClass} ${error ? 'border-[#ff7a8d]/70!' : ''}`,
    };
  };
  const idOf = (key: keyof Values) => `${uid}-${key}`;

  return (
    <form onSubmit={onSubmit} noValidate className="glass rounded-3xl p-6 sm:p-9" aria-busy={sending}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel id={idOf('name')} label="Name" />
          <input {...fieldProps('name')} name="name" type="text" autoComplete="name" placeholder="Your name" value={values.name} onChange={set('name')} onBlur={blur('name')} />
          <FieldError id={idOf('name')} error={errors.name} />
        </div>
        <div>
          <FieldLabel id={idOf('email')} label="Email" />
          <input {...fieldProps('email')} name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" value={values.email} onChange={set('email')} onBlur={blur('email')} />
          <FieldError id={idOf('email')} error={errors.email} />
        </div>
      </div>
      <div className="mt-5">
        <FieldLabel id={idOf('subject')} label="Subject" optional />
        <input {...fieldProps('subject')} name="subject" type="text" placeholder="What's this about?" value={values.subject} onChange={set('subject')} onBlur={blur('subject')} />
        <FieldError id={idOf('subject')} error={errors.subject} />
      </div>
      <div className="mt-5">
        <FieldLabel id={idOf('message')} label="Message" />
        <textarea {...fieldProps('message')} name="message" rows={6} placeholder="Tell me about your project, role or idea…" value={values.message} onChange={set('message')} onBlur={blur('message')} />
        <div className="flex items-start justify-between gap-4">
          <FieldError id={idOf('message')} error={errors.message} />
          <span className="ml-auto pt-1.5 font-mono text-xs text-muted">{values.message.length}/2000</span>
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive tech, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-12 min-w-40 items-center justify-center gap-2 rounded-full bg-fg px-7 text-sm font-medium text-bg transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
        >
          {sending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send message <Send className="size-4" aria-hidden="true" />
            </>
          )}
        </button>

        <div role="status" aria-live="polite" className="min-h-6 flex-1 text-sm">
          <AnimatePresence mode="wait">
            {status.kind === 'success' && (
              <motion.p key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-300">
                <CircleCheck className="size-4 shrink-0" aria-hidden="true" /> Thanks! Your message has been received.
              </motion.p>
            )}
            {status.kind === 'error' && (
              <motion.p key="err" role="alert" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 text-[#ff7a8d]">
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {status.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}
