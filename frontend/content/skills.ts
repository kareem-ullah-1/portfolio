export interface SkillGroup {
  title: string;
  blurb: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    blurb: 'Fast, accessible interfaces.',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS', 'GSAP', 'Framer Motion'],
  },
  { title: 'Backend', blurb: 'Secure, consistent APIs.', items: ['Node.js', 'Express', 'NestJS', 'REST / OpenAPI', 'JWT', 'Zod', 'Swagger'] },
  { title: 'Database', blurb: 'Integrity first.', items: ['PostgreSQL', 'Prisma', 'MongoDB', 'Redis'] },
  { title: 'Tools and Workflow', blurb: 'Repeatable shipping.', items: ['Docker', 'Git', 'GitLab', 'Cloudflare R2'] },
];
