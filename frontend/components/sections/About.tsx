import { Gauge, Layers, ShieldCheck, Wrench } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const highlights = [
  { icon: Layers, title: 'End-to-end ownership', text: 'Database schema, API and interface designed together so the pieces actually fit.' },
  { icon: ShieldCheck, title: 'Security & integrity', text: 'Validation at the boundary, careful auth, and data that stays consistent.' },
  { icon: Gauge, title: 'Performance-minded', text: 'Fewer queries, lighter payloads, and animation that never costs smoothness.' },
  { icon: Wrench, title: 'Maintainable by default', text: 'Small, correct changes that extend what exists instead of rewriting it.' },
];

export function About() {
  return (
    <section id="about" className="py-28 md:py-36">
      <div className="section-shell grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="01 — About" title="Building the whole product," accent="not just a layer." />
          <div className="mt-8 space-y-5 text-lg text-fg/75">
            <p data-reveal>
              I&apos;m Kareem, a full-stack developer working across the MERN ecosystem and Next.js. I build production ecommerce
              backends, dashboards and point-of-sale interfaces in TypeScript, backed by PostgreSQL and Prisma.
            </p>
            <p data-reveal>
              I care about the unglamorous parts that decide whether software survives contact with real users: consistent APIs,
              validated input, sensible error handling, and code the next developer can change with confidence.
            </p>
            <p data-reveal>I&apos;m open to full-time roles and freelance projects.</p>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:self-end">
          {highlights.map(({ icon: Icon, title, text }) => (
            <li key={title} className="glass glass-hover glass-lift rounded-2xl p-6" data-reveal>
              <span className="grid size-10 place-items-center glass-chip rounded-xl text-crimson">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-base font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
