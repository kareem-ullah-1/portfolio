import { BrandIcon } from '@/components/ui/BrandIcon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { skillGroups } from '@/content/skills';

export function Skills() {
  return (
    <section id="skills" className="py-28 md:py-36">
      <div className="section-shell">
        <SectionHeading
          eyebrow="02 — Skills"
          title="The stack I ship with,"
          accent="every day."
          description="Grouped by the layer of the product they serve."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {skillGroups.map((group) => (
            <article
              key={group.title}
              className="glass glass-hover glass-lift rounded-3xl p-7 lg:col-span-3"
              data-reveal
            >
              <header className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-3xl">{group.title}</h3>
                <p className="hidden text-sm text-muted sm:block">{group.blurb}</p>
              </header>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {group.items.map((name) => (
                  <li
                    key={name}
                    className="inline-flex items-center gap-2.5 glass-chip rounded-xl py-2 pr-3.5 pl-2.5 text-sm"
                  >
                    <BrandIcon name={name} className="size-[1.15rem]" />
                    {name}
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
