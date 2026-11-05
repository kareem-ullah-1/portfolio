import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name (at least 2 characters).').max(80, 'Name is too long (80 characters max).'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .max(254, 'Email is too long.')
    .pipe(z.email('Enter a valid email address.')),
  subject: z.string().trim().max(120, 'Subject is too long (120 characters max).').optional(),
  message: z.string().trim().min(10, 'Please write at least 10 characters.').max(2000, 'Message is too long (2000 characters max).'),
});

/** Server-side request shape: the same fields plus the `website` honeypot, with the email normalized. */
export const contactRequestSchema = contactSchema.extend({
  email: contactSchema.shape.email.transform((value) => value.toLowerCase()),
  website: z.string().max(500).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export function validateContact(values: Record<string, string>): { data?: ContactInput; errors: ContactErrors } {
  const result = contactSchema.safeParse(values);
  if (result.success) return { data: result.data, errors: {} };
  const errors: ContactErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ContactInput;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { errors };
}
