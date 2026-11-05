import { SectionHeading } from '@/components/ui/SectionHeading';
import { TechChip } from '@/components/ui/TechChip';
import { experience } from '@/content/experience';

export function Experience() {
  return (
    <section id="experience" className="py-28 md:py-36">
      <div className="section-shell">
        <SectionHeading
          eyebrow="03 — Experience"
          title="Where I’ve"
          accent="learned & worked."
          description="Learning and professional experience."
        />
        <ol className="relative mt-14 space-y-6 pl-7 md:pl-12">
          <span
            className="absolute top-2 bottom-2 left-0 w-px bg-gradient-to-b from-crimson/60 via-line to-violet/50"
            aria-hidden="true"
          />
          {experience.map((entry) => (
            <li key={entry.title} className="relative" data-reveal>
              <span
                className="absolute top-9 -left-[calc(1.75rem+5px)] size-2.5 rounded-full bg-crimson ring-4 ring-bg md:-left-[calc(3rem+5px)]"
                aria-hidden="true"
              >
                <span className="absolute -inset-1.5 rounded-full border border-crimson/40" />
              </span>
              <div className="glass glass-hover rounded-3xl p-7 md:p-9">
                <span className="glass-chip rounded-full px-3 py-1 font-mono text-[0.7rem] tracking-wide text-fg/85 uppercase">
                  {entry.label}
                </span>
                <h3 className="mt-5 font-display text-3xl md:text-4xl">{entry.title}</h3>
                <p className="mt-4 max-w-2xl text-fg/75">{entry.summary}</p>
                <dl className="mt-6 flex flex-wrap gap-x-12 gap-y-4 border-t border-line pt-5">
                  <div>
                    <dt className="eyebrow">Organisation</dt>
                    <dd className="mt-1.5 text-fg">{entry.org}</dd>
                  </div>
                </dl>
                {entry.points && entry.points.length > 0 && (
                  <ul className="mt-5 space-y-2.5 text-sm text-fg/80">
                    {entry.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-violet" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                {entry.stack && entry.stack.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {entry.stack.map((s) => (
                      <li key={s}>
                        <TechChip name={s} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
