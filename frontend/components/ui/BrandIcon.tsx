import {
  siCloudflare, siCss, siDocker, siExpress, siFramer, siGit, siGitlab, siGithub, siGreensock, siHtml5,
  siJavascript, siJsonwebtokens, siMongodb, siNestjs, siNextdotjs, siNodedotjs, siOpenapiinitiative,
  siPostgresql, siPrisma, siReact, siRedis, siSwagger, siTailwindcss, siTypescript, siZod,
  type SimpleIcon,
} from 'simple-icons';

const ICONS: Record<string, SimpleIcon> = {
  React: siReact, 'Next.js': siNextdotjs, TypeScript: siTypescript, JavaScript: siJavascript, HTML5: siHtml5,
  CSS: siCss, 'Tailwind CSS': siTailwindcss, 'Node.js': siNodedotjs, Express: siExpress, NestJS: siNestjs,
  'REST / OpenAPI': siOpenapiinitiative, JWT: siJsonwebtokens, Zod: siZod, PostgreSQL: siPostgresql,
  MongoDB: siMongodb, Prisma: siPrisma, Redis: siRedis, Docker: siDocker, Git: siGit, GitLab: siGitlab,
  GitHub: siGithub, 'Cloudflare R2': siCloudflare, Swagger: siSwagger, GSAP: siGreensock, 'Framer Motion': siFramer,
};

/** Very dark brand colours (Next.js, Express...) would vanish on the dark background, so lighten them. */
function visibleColor(hex: string): string {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.25 ? '#ece8ea' : `#${hex}`;
}

export function BrandIcon({ name, className = 'size-5' }: { name: string; className?: string }) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" fill={visibleColor(icon.hex)} className={className} aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  );
}
