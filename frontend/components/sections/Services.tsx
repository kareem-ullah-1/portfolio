import { Check } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { services } from '@/content/services';

export function Services() {
  return (
    <section id="services" className="py-28 md:py-36">
      <div className="section-shell">
        <SectionHeading
          eyebrow="05 — Services"
          title="How I can"
          accent="help."
          description="Available for full-time roles and freelance engagements."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {services.map(({ title, description, points, icon: Icon }) => (
            <article
              key={title}
              className="glass glass-subtle glass-hover glass-lift group rounded-3xl p-8"
              data-reveal
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-crimson/25 to-violet/25 text-fg">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-3xl">{title}</h3>
              <p className="mt-3 text-fg/75">{description}</p>
              <ul className="mt-6 space-y-2.5 text-sm text-fg/80">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-crimson" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
