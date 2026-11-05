'use client';

import { scrollToId } from '@/lib/scroll';

/** Anchor that smooth-scrolls via Lenis, but still works as a normal #hash link without JS. */
export function ScrollLink({
  target,
  className,
  children,
}: {
  target: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`#${target}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        scrollToId(target);
      }}
    >
      {children}
    </a>
  );
}
