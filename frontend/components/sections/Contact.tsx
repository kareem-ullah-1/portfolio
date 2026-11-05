import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { site } from '@/lib/site';

export function Contact() {
  return (
    <section id="contact" className="py-28 md:py-36">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="06 — Contact"
            title="Let's build"
            accent="something."
            description="Have a role, a project or an idea? Reach out directly, or send a message with the form."
          />
          <ul className="mt-10 space-y-4" data-reveal>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex items-center gap-3 text-fg/90 transition-colors hover:text-fg"
              >
                <span className="grid size-11 place-items-center glass-pill rounded-full group-hover:border-white/30">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                {site.email}
              </a>
            </li>
            {site.phone && (
              <li>
                <a
                  href={`tel:${site.phone.tel}`}
                  className="group inline-flex items-center gap-3 text-fg/90 transition-colors hover:text-fg"
                >
                  <span className="grid size-11 place-items-center glass-pill rounded-full group-hover:border-white/30">
                    <Phone className="size-5" aria-hidden="true" />
                  </span>
                  <span className="tabular-nums">{site.phone.display}</span>
                </a>
              </li>
            )}
            <li className="inline-flex items-center gap-3 text-fg/90">
              <span className="grid size-11 place-items-center glass-pill rounded-full">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              {site.location}
            </li>
            {site.socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 text-fg/90 transition-colors hover:text-fg"
                >
                  <span className="grid size-11 place-items-center glass-pill rounded-full group-hover:border-white/30">
                    <SocialIcon id={s.id} className="size-5" />
                  </span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative" data-reveal>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
