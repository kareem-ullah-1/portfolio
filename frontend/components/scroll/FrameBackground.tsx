'use client';

import { useEffect, useRef } from 'react';
import { FrameSequence } from '@/lib/frame-sequence';
import { getScrollProgress } from '@/lib/scroll';

const FRAME_COUNT = 240;
const frameUrl = (index: number) => `/frames/frame-${String(index + 1).padStart(3, '0')}.webp`;

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

export function FrameBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const nav = navigator as NavigatorWithHints;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const constrained =
      window.matchMedia('(max-width: 767px)').matches ||
      (nav.deviceMemory ?? 8) <= 4 ||
      Boolean(nav.connection?.saveData) ||
      /(^|-)2g$/.test(nav.connection?.effectiveType ?? '');

    const sequence = new FrameSequence({
      canvas,
      frameCount: FRAME_COUNT,
      getUrl: frameUrl,
      getProgress: getScrollProgress,
      reducedMotion,
      maxDecoded: constrained ? 8 : 12,
      maxFetches: constrained ? 3 : 4,
      onFirstFrame: () => {
        canvas.dataset.ready = 'true';
        document.documentElement.dataset.framesReady = '1';
        window.dispatchEvent(new Event('frames:ready'));
      },
    });
    void sequence.start();
    return () => sequence.destroy();
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-0 w-full bg-bg opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100"
        style={{ height: '100lvh' }}
      />
      {/* Static legibility scrim: keeps text readable over any frame without touching the canvas.
          Defined in globals.css (.legibility-scrim) so narrow viewports can get a less directional,
          slightly stronger wash — on mobile the layout stacks to one full-width column instead of a
          left-text/right-subject split, so the desktop left-to-right bias alone isn't always enough. */}
      <div
        aria-hidden="true"
        className="legibility-scrim pointer-events-none fixed top-0 left-0 z-0 w-full"
        style={{ height: '100lvh' }}
      />
    </>
  );
}
