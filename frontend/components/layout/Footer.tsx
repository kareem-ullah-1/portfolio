import { ArrowUp, Mail, Phone } from 'lucide-react';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { BackToTop } from '@/components/ui/BackToTop';
import { CurrentYear } from '@/components/ui/CurrentYear';
import { ScrollLink } from '@/components/ui/ScrollLink';
import { navItems, site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="glass-bar bar-hairline-top relative border-t">
      <div className="section-shell grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_1.1fr] lg:gap-16 lg:py-16">
        <div className="max-w-sm">
          <p className="font-display text-4xl">
            Kareem<span className="text-crimson">.</span>
          </p>
          <p className="eyebrow mt-3">KAREEM ULLAH · {site.title}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Production-grade ecommerce platforms and web applications, from the database schema to the interface. Based in{' '}
            {site.location}. Open to job opportunities and freelance projects.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow">Navigate</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <ScrollLink target={id} className="inline-block py-1.5 text-muted transition-colors hover:text-fg">
                  {label}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Get in touch</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-3 flex min-h-10 items-center gap-3 break-all text-sm text-fg/90 transition-colors hover:text-fg"
          >
            <Mail className="size-5 shrink-0" aria-hidden="true" />
            {site.email}
          </a>
          {site.phone && (
            <a
              href={`tel:${site.phone.tel}`}
              className="flex min-h-10 items-center gap-3 text-sm text-fg/90 transition-colors hover:text-fg"
            >
              <Phone className="size-5 shrink-0" aria-hidden="true" />
              <span className="tabular-nums">{site.phone.display}</span>
            </a>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {site.socials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.label} (opens in a new tab)`}
                className="grid size-12 place-items-center rounded-full glass-pill text-fg/80 hover:text-fg"
              >
                <SocialIcon id={s.id} className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="section-shell flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-xs text-muted">
        <p>
          © <CurrentYear /> {site.name}. All rights reserved.
        </p>
        <BackToTop className="inline-flex h-11 items-center gap-2 rounded-full glass-pill px-4 text-sm text-fg/80 hover:text-fg">
          Back to top <ArrowUp className="size-4" aria-hidden="true" />
        </BackToTop>
      </div>
    </footer>
  );
}
