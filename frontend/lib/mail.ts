import 'server-only';
import nodemailer from 'nodemailer';

export interface ContactMail {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
}

const singleLine = (value: string) => value.replace(/[\r\n\u2028\u2029]+/g, ' ').trim();

/** Reads SMTP settings from server-only environment variables. Returns null when anything required is missing. */
export function getSmtpConfig(env: NodeJS.ProcessEnv = process.env): SmtpConfig | null {
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS;
  const to = env.CONTACT_TO_EMAIL?.trim();
  if (!host || !user || !pass || !to) return null;

  const port = Number(env.SMTP_PORT?.trim() || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return null;

  const secureFlag = env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureFlag ? secureFlag === 'true' : port === 465;
  return { host, port, secure, user, pass, from: env.MAIL_FROM?.trim() || user, to };
}

/** Emails the site owner. The visitor's address goes in Reply-To only; From and recipient are never visitor-controlled. */
export async function sendContactEmail(config: SmtpConfig, mail: ContactMail): Promise<void> {
  const name = singleLine(mail.name);
  const subject = mail.subject ? singleLine(mail.subject) : '';
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });
  await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: { name, address: mail.email },
    subject: `Portfolio contact: ${subject || `message from ${name}`}`,
    text: [`Name: ${name}`, `Email: ${mail.email}`, subject ? `Subject: ${subject}` : null, '', mail.message]
      .filter((line): line is string => line !== null)
      .join('\n'),
  });
}
