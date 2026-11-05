'use client';

import { useEffect } from 'react';
import { initScroll } from '@/lib/scroll';

/** Mounts Lenis + the GSAP ticker once for the whole app. Renders nothing. */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return initScroll(reduced);
  }, []);
  return null;
}
