import { ArrowDown, Download, MapPin } from 'lucide-react';
import { getResumeUrl } from '@/lib/resume';
import { site } from '@/lib/site';

export function Hero() {
  const resumeUrl = getResumeUrl();
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center pt-24 pb-20">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="eyebrow inline-flex items-center gap-2" data-hero>
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-crimson/70" />
              <span className="relative inline-flex size-2 rounded-full bg-crimson" />
            </span>
            Open to job opportunities &amp; freelance projects
          </p>
          <h1 className="mt-6 font-display text-[clamp(3.5rem,11vw,7.5rem)] leading-[0.92] tracking-tight [text-shadow:0_2px_24px_rgb(0_0_0/0.5)]" data-hero>
            Kareem <em className="text-gradient pr-2">Ullah</em>
            <span className="sr-only"> — {site.title}, {site.tagline}, {site.location}</span>
          </h1>
          <p className="mt-5 font-mono text-sm tracking-wide text-fg/90 sm:text-base" data-hero>
            {site.title} <span className="text-crimson">/</span> {site.tagline}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-muted sm:text-sm" data-hero>
            <MapPin className="size-3.5 text-crimson" aria-hidden="true" />
            {site.location}
          </p>
          <p className="mt-6 max-w-xl text-lg text-fg/75" data-hero>
            I build production-grade ecommerce platforms and web applications with React, Next.js, Node.js and TypeScript,
            from the PostgreSQL schema and REST API to the interface people actually use.
          </p>
          {resumeUrl && (
            <div className="mt-9" data-hero>
              <a
                href={resumeUrl}
                download
                className="inline-flex h-12 items-center gap-2 rounded-full glass-pill px-6 text-sm font-medium"
              >
                <Download className="size-4" />
                Résumé
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex" aria-hidden="true">
        <span className="eyebrow">Scroll</span>
        <span className="scroll-cue relative block h-10 w-px overflow-hidden bg-white/20" />
        <ArrowDown className="size-3.5 text-muted" />
      </div>
    </section>
  );
}
