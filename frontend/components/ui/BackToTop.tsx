'use client';

import { scrollToTop } from '@/lib/scroll';

export function BackToTop({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={className ?? 'grid size-11 place-items-center rounded-full glass-pill text-fg/80 hover:text-fg'}
    >
      {children}
    </button>
  );
}
