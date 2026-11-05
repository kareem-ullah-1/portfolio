import { buildWhatsAppUrl, normalizePkMobile } from './whatsapp';

const whatsappMessage = 'Hi Kareem, I visited your portfolio and would like to discuss a project.';
// Single source of truth for the phone/WhatsApp number. Validated as a Pakistani mobile and converted to
// international digits (923187006295); an invalid value hides the phone row and every WhatsApp button.
const phoneDisplay = '0318 7006295';
const whatsappNumber = normalizePkMobile(phoneDisplay);

export const site = {
  name: 'Kareem Ullah',
  title: 'Full-Stack Web Developer',
  tagline: 'MERN & Next.js',
  location: 'Faisalabad, Pakistan',
  description:
    'Full-stack web developer in Faisalabad, Pakistan, building production-grade ecommerce platforms and web applications with React, Next.js, Node.js and TypeScript. Open to job opportunities and freelance projects.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'kareemniazi47@gmail.com',
  // Hero only renders the button if this file actually exists (see lib/resume.ts).
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL ?? '/Kareem-Ullah-Resume.pdf',
  phone: whatsappNumber ? { display: phoneDisplay, tel: `+${whatsappNumber}` } : null,
  whatsappUrl: buildWhatsAppUrl(whatsappNumber, whatsappMessage),
  // Only links that are actually configured are rendered.
  socials: [
    { id: 'github', label: 'GitHub', href: process.env.NEXT_PUBLIC_GITHUB_URL },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    },
    { id: 'gitlab', label: 'GitLab', href: process.env.NEXT_PUBLIC_GITLAB_URL },
  ].filter((s): s is { id: string; label: string; href: string } => /^https?:\/\/\S+$/i.test(s.href ?? '')),
} as const;

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
] as const;
