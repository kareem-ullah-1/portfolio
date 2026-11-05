'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { TechChip } from '@/components/ui/TechChip';
import { projects as allProjects, type Project } from '@/content/projects';

gsap.registerPlugin(ScrollTrigger);

const projects = allProjects.filter((p) => !p.draft);

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [pinned, setPinned] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [progress, setProgress] = useState(0);
  const drag = useRef({ active: false, x: 0, left: 0, moved: false });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
    setProgress(max > 0 ? el.scrollLeft / max : 1);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  // Desktop with motion allowed: pin the section and let vertical scroll drive the track sideways.
  // Phones and reduced-motion keep the native swipe / drag / arrows behaviour.
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const max = () => Math.max(0, track.scrollWidth - track.clientWidth);
      track.style.scrollSnapType = 'none';
      setPinned(true);
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${max()}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          track.scrollLeft = self.progress * max();
        },
      });
      return () => {
        track.style.scrollSnapType = '';
        setPinned(false);
      };
    });
    return () => mm.revert();
  }, []);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('li');
    const amount = (card?.getBoundingClientRect().width ?? 360) + 20;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-28 md:flex md:min-h-[100svh] md:flex-col md:justify-center md:py-20"
    >
      <div className="section-shell flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="04 — Projects"
          title="Selected"
          accent="work."
          description={pinned ? 'Keep scrolling and the projects slide across.' : 'Drag, swipe or use the arrows.'}
        />
        <div className={`gap-2 ${pinned ? 'hidden' : 'hidden sm:flex'}`} data-reveal>
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={edges.start}
            aria-label="Previous project"
            className="grid size-12 place-items-center glass-pill rounded-full disabled:opacity-30"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={edges.end}
            aria-label="Next project"
            className="grid size-12 place-items-center glass-pill rounded-full disabled:opacity-30"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        onScroll={update}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || pinned) return;
          const el = trackRef.current;
          if (!el) return;
          drag.current = {
            active: true,
            x: e.clientX,
            left: el.scrollLeft,
            moved: false,
          };
        }}
        onPointerMove={(e) => {
          const el = trackRef.current;
          if (!drag.current.active || !el) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 4) drag.current.moved = true;
          el.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => (drag.current.active = false)}
        onPointerLeave={() => (drag.current.active = false)}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        tabIndex={0}
        aria-label="Projects, scrollable"
        className="hide-scrollbar mt-12 flex cursor-grab items-start snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-[max(1.25rem,calc((100vw-76rem)/2+3rem))] pb-4 active:cursor-grabbing md:snap-proximity"
        style={{
          scrollPaddingInline: 'max(1.25rem, calc((100vw - 76rem) / 2 + 3rem))',
        }}
      >
        {projects.map((project, i) => (
          <li
            key={project.title}
            className={`shrink-0 snap-start ${
              project.preview || project.image
                ? 'w-[88vw] max-w-[40rem] sm:w-[40rem]'
                : 'w-[84vw] max-w-[26rem] sm:w-[26rem]'
            }`}
            data-reveal={i === 0 ? '' : undefined}
          >
            {project.preview ? (
              <ShowcaseCard project={project} index={i} />
            ) : project.image ? (
              <ImageCard project={project} index={i} />
            ) : (
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="glass glass-hover group relative flex h-full min-h-[25rem] flex-col overflow-hidden rounded-3xl p-7 select-none sm:min-h-[26rem]"
              >
                <div
                  className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(closest-side, rgb(255 46 77 / 0.35), transparent)',
                  }}
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between">
                  <p className="eyebrow">{project.kicker}</p>
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-8 font-display text-4xl leading-tight">{project.title}</h3>
                <p className="mt-4 text-sm text-fg/75">{project.description}</p>
                {project.contribution && (
                  <p className="mt-4 text-sm text-fg/75">
                    <span className="font-mono text-xs tracking-wide text-muted uppercase">My contribution · </span>
                    {project.contribution}
                  </p>
                )}
                {project.stack.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <li key={s}>
                        <TechChip name={s} />
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto flex items-center gap-3 pt-8">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg"
                    >
                      Live demo <ExternalLink className="size-3.5" />
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center gap-2 glass-chip rounded-full px-4 text-sm"
                    >
                      <SocialIcon id="github" className="size-4" /> Code
                    </a>
                  )}
                  {!project.liveUrl && !project.repoUrl && project.status && (
                    <span className="font-mono text-xs text-muted">{project.status}</span>
                  )}
                </div>
              </motion.article>
            )}
          </li>
        ))}
      </ul>

      <div className="section-shell mt-6" aria-hidden="true">
        <div className="h-px w-full bg-line">
          <div
            className="h-px origin-left bg-gradient-to-r from-crimson to-violet"
            style={{ transform: `scaleX(${Math.max(progress, 0.08)})` }}
          />
        </div>
      </div>
    </section>
  );
}

function ImageCard({ project, index }: { project: Project; index: number }) {
  const image = project.image!;
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      tabIndex={0}
      className="glass-frame group relative isolate h-full min-h-[25rem] bg-[#09060a] sm:bg-transparent overflow-hidden rounded-3xl select-none focus-visible:outline-offset-4 sm:min-h-[26rem]"
    >
      {/* Phones: the whole artwork sits in a 16:10 block above the text. sm and up: it fills the card. */}
      <div className="absolute inset-x-0 top-0 aspect-[8/5] overflow-hidden sm:inset-0 sm:aspect-auto">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 640px) 640px, 88vw"
          draggable={false}
          className="object-cover transition-transform duration-[1200ms] ease-out motion-safe:group-hover:scale-[1.05]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#09060a] via-transparent to-transparent sm:from-black/80 sm:via-black/20 sm:to-transparent"
          aria-hidden="true"
        />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <p className="eyebrow">{project.kicker}</p>
          <div className="flex items-center gap-3">
            {project.concept && (
              <span className="glass-chip rounded-full px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-fg/90 uppercase">
                Concept · Illustrative
              </span>
            )}
            <span className="font-mono text-xs text-fg/70">{String(index + 1).padStart(2, '0')}</span>
          </div>
        </div>
        <div className="mt-32 sm:mt-16">
          <h3 className="font-display text-4xl leading-tight [text-shadow:0_2px_18px_rgb(0_0_0/0.6)] sm:text-5xl">
            {project.title}
          </h3>
          <p className="mt-3 max-w-lg text-sm text-fg/85">{project.description}</p>
          {project.contribution && (
            <p className="mt-3 max-w-lg text-sm text-fg/85">
              <span className="font-mono text-xs tracking-wide text-fg/70 uppercase">My contribution · </span>
              {project.contribution}
            </p>
          )}
          <div>
            {project.stack.length > 0 && (
              <ul className="flex flex-wrap gap-2 pt-5">
                {project.stack.map((s) => (
                  <li key={s}>
                    <TechChip name={s} />
                  </li>
                ))}
              </ul>
            )}
            {project.status && <p className="pt-4 font-mono text-xs text-fg/70">{project.status}</p>}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ShowcaseCard({ project, index }: { project: Project; index: number }) {
  const { desktop, mobile } = project.preview!;
  const [open, setOpen] = useState(false);
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      tabIndex={0}
      onPointerUp={(e) => {
        if (e.pointerType !== 'mouse') setOpen((v) => !v);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      data-open={open}
      className="glass-frame group relative isolate h-full min-h-[25rem] overflow-hidden rounded-3xl bg-[#09060a] select-none focus-visible:outline-offset-4 sm:min-h-[26rem]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(60% 70% at 15% 10%, rgb(255 46 77 / 0.28), transparent 70%), radial-gradient(55% 65% at 90% 95%, rgb(162 89 255 / 0.28), transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div
          className={`absolute top-[12%] overflow-hidden rounded-xl border border-white/15 bg-[#0d0a0f] shadow-[0_24px_60px_-18px_rgb(0_0_0/0.8)] ${
            mobile ? 'left-[4%] w-[86%] sm:left-[5%] sm:w-[84%]' : 'left-[6%] w-[88%] sm:left-[7%] sm:w-[86%]'
          }`}
        >
          <div className="flex h-6 items-center gap-1.5 border-b border-white/10 bg-white/[0.05] px-3 sm:h-7">
            <span className="size-1.5 rounded-full bg-white/25" aria-hidden="true" />
            <span className="size-1.5 rounded-full bg-white/25" aria-hidden="true" />
            <span className="size-1.5 rounded-full bg-white/25" aria-hidden="true" />
            <span className="mx-auto rounded-full bg-black/40 px-3 py-px font-mono text-[0.6rem] text-fg/60 sm:text-[0.65rem]">
              {project.liveUrl ? new URL(project.liveUrl).hostname : ''}
            </span>
            <span className="w-[1.4rem]" aria-hidden="true" />
          </div>
          <Image
            src={desktop.src}
            alt={desktop.alt}
            width={desktop.width}
            height={desktop.height}
            sizes="(min-width: 640px) 540px, 78vw"
            priority={index === 0}
            draggable={false}
            className="h-auto w-full transition-transform duration-[1200ms] ease-out motion-safe:group-hover:scale-[1.06]"
          />
        </div>

        {mobile && (
          <div className="absolute right-[4%] bottom-[8%] w-[24%] rounded-[1.1rem] border border-white/20 bg-[#0d0a0f] p-[3px] shadow-[0_24px_50px_-12px_rgb(0_0_0/0.9)] sm:w-[19%] sm:rounded-[1.4rem] sm:p-1">
            <div className="overflow-hidden rounded-[0.9rem] sm:rounded-[1.15rem]">
              <Image
                src={mobile.src}
                alt={mobile.alt}
                width={mobile.width}
                height={mobile.height}
                sizes="(min-width: 640px) 130px, 90px"
                draggable={false}
                className="h-auto w-full"
              />
            </div>
          </div>
        )}
      </div>

      <span className="glass-chip absolute top-4 right-4 z-10 inline-flex items-center gap-2 rounded-full px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-fg/90 uppercase transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0 group-data-[open=true]:opacity-0">
        <span className="relative flex size-1.5" aria-hidden="true">
          <span className="absolute inline-flex size-full rounded-full bg-emerald-400/70 motion-safe:animate-ping" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
        </span>
        {project.badge ?? 'Live'}
      </span>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#09060a] to-transparent px-6 pt-16 pb-5 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0 group-data-[open=true]:opacity-0 sm:px-7"
        aria-hidden="true"
      >
        <h3 className="font-display text-2xl leading-tight sm:text-3xl">{project.title}</h3>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex translate-y-2 flex-col justify-between bg-gradient-to-t from-[#09060a] via-[#09060a]/90 to-[#09060a]/60 p-6 opacity-0 transition-all duration-500 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-data-[open=true]:pointer-events-auto group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <p className="eyebrow">{project.kicker}</p>
          <span className="font-mono text-xs text-fg/70">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div>
          <h3 className="font-display text-4xl leading-tight sm:text-5xl">{project.title}</h3>
          <p className="mt-3 max-w-lg text-sm text-fg/85">{project.description}</p>
          {project.contribution && (
            <p className="mt-3 max-w-lg text-sm text-fg/85">
              <span className="font-mono text-xs tracking-wide text-fg/70 uppercase">My contribution · </span>
              {project.contribution}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-4">
            {project.stack.length > 0 && (
              <ul className="flex min-w-0 flex-1 basis-64 flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li key={s}>
                    <TechChip name={s} />
                  </li>
                ))}
              </ul>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo of ${project.title} (opens in a new tab)`}
                className="group/cta inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg transition-transform duration-300 hover:scale-[1.04] active:scale-100"
              >
                Live demo{' '}
                <ExternalLink className="size-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
