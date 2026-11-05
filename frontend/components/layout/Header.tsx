'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import { navItems, site } from '@/lib/site';
import { scrollToId, scrollToTop, setScrollLocked } from '@/lib/scroll';

const ctaClass =
  'inline-flex h-10 items-center justify-center rounded-full bg-fg px-5 text-sm font-medium text-bg transition-transform hover:scale-[1.04] active:scale-[0.98]';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      // Back in the hero (above the first section): nothing is "current".
      if (window.scrollY < 200) setActive('');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setScrollLocked(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    // Rotating a tablet / widening the window past the breakpoint must not leave scrolling locked.
    const mq = window.matchMedia('(min-width: 768px)');
    const onMq = () => mq.matches && close();
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) close();
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
      mq.removeEventListener('change', onMq);
    };
  }, [open, close]);

  useEffect(() => () => setScrollLocked(false), []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    close();
    scrollToId(id);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
        scrolled || open
          ? `glass-bar bar-hairline border-b ${open ? 'glass-bar-strong' : ''}`
          : 'border-b border-transparent'
      }`}
    >
      <div className="section-shell flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            close();
            scrollToTop();
          }}
          className="font-display text-2xl tracking-tight"
          aria-label={`${site.name} — back to top`}
        >
          Kareem<span className="text-crimson">.</span>
        </a>

        <div className="hidden items-center gap-2 md:flex lg:gap-4">
          <nav aria-label="Primary" className="flex items-center">
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={go(id)}
                aria-current={active === id ? 'location' : undefined}
                className={`nav-link relative px-2.5 py-2 text-sm transition-colors lg:px-3.5 ${
                  active === id ? 'text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
          <a href="#contact" onClick={go('contact')} className={ctaClass}>
            Let’s talk
          </a>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center glass-pill rounded-full md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => {
            setScrollLocked(!open);
            setOpen(!open);
          }}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100dvh - 4rem)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-x-hidden overflow-y-auto overscroll-contain md:hidden"
          >
            <ul className="section-shell flex flex-col gap-1 pt-4">
              {navItems.map(({ id, label }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                >
                  <a
                    href={`#${id}`}
                    onClick={go(id)}
                    aria-current={active === id ? 'location' : undefined}
                    className={`flex items-center justify-between border-b border-line py-3.5 font-display text-4xl ${
                      active === id ? 'text-fg' : 'text-fg/85'
                    }`}
                  >
                    {label}
                    {active === id && <span className="size-2 rounded-full bg-crimson" aria-hidden="true" />}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="section-shell flex flex-wrap gap-3 pt-6 pb-10">
              <a href="#contact" onClick={go('contact')} className={`${ctaClass} h-12 px-7`}>
                Let’s talk
              </a>
              <WhatsAppLink className="inline-flex h-12 items-center gap-2 rounded-full glass-pill px-5 text-sm">
                WhatsApp
              </WhatsAppLink>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
