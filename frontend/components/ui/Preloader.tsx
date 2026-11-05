'use client';

import { useEffect, useState } from 'react';
import { setScrollLocked } from '@/lib/scroll';

const WORDS = ['KAREEM', 'ULLAH'] as const;

// Entrance timing. Keep in sync with the animation-delay on the letters (see globals.css).
const FIRST_DELAY_MS = 250;
const STAGGER_MS = 75;
const LETTER_MS = 900;
const LETTER_COUNT = WORDS.join('').length;
const ENTRANCE_MS = FIRST_DELAY_MS + (LETTER_COUNT - 1) * STAGGER_MS + LETTER_MS + 250;
const REDUCED_ENTRANCE_MS = 500;

// Hard limits so the loader can never trap a visitor.
const MAX_WAIT_MS = 4000; // force completion no matter what is still loading
const LEAVE_MS = 1000; // curtain duration (matches the CSS transition)

export const PRELOADER_STORAGE_KEY = 'kp-preloaded';

type Phase = 'visible' | 'leaving' | 'gone';

export function Preloader() {
  const [phase, setPhase] = useState<Phase>('visible');

  useEffect(() => {
    const doc = document.documentElement;
    // The inline script in the root layout marks the first visit of a session as "active". Anything
    // else (repeat visit, script blocked) means CSS keeps the overlay at display:none, so there is nothing to do.
    if (doc.dataset.preloader !== 'active') return;

    let cancelled = false;
    let finished = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // The page is ready once the first background frame has decoded and fonts are in.
    const ready = { fonts: !document.fonts, frames: doc.dataset.framesReady === '1' };
    let entranceDone = false;

    // Keep the page behind the overlay out of reach of keyboard and assistive tech while it is up.
    const behind = Array.from(document.querySelectorAll<HTMLElement>('header, main, footer'));
    behind.forEach((el) => el.setAttribute('inert', ''));
    setScrollLocked(true);

    const release = () => {
      behind.forEach((el) => el.removeAttribute('inert'));
      setScrollLocked(false);
    };

    const finish = () => {
      if (finished || cancelled) return;
      finished = true;
      doc.dataset.preloader = 'leaving';
      release();
      // Lets the hero entrance (Reveal) start as the curtain lifts.
      window.dispatchEvent(new Event('preloader:reveal'));
      try {
        sessionStorage.setItem(PRELOADER_STORAGE_KEY, '1');
      } catch {
        /* storage unavailable: the loader simply shows again next visit */
      }
      setPhase('leaving');
      later(
        () => {
          doc.dataset.preloader = 'done';
          setPhase('gone');
        },
        reduced ? 350 : LEAVE_MS,
      );
    };

    const check = () => {
      if (entranceDone && ready.fonts && ready.frames) finish();
    };

    const onFrames = () => {
      ready.frames = true;
      check();
    };
    if (ready.frames) onFrames();
    else window.addEventListener('frames:ready', onFrames, { once: true });
    document.fonts?.ready.then(
      () => {
        ready.fonts = true;
        check();
      },
      () => {
        ready.fonts = true;
        check();
      },
    );

    later(
      () => {
        entranceDone = true;
        check();
      },
      reduced ? REDUCED_ENTRANCE_MS : ENTRANCE_MS,
    );
    // Guaranteed completion, even if frames or fonts never report in.
    later(finish, MAX_WAIT_MS);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener('frames:ready', onFrames);
      if (!finished) release();
    };
  }, []);

  if (phase === 'gone') return null;

  let letterIndex = 0;
  return (
    <div
      className="preloader"
      data-state={phase}
      role="status"
      aria-busy={phase === 'visible'}
      aria-label="Loading Kareem Ullah’s portfolio"
    >
      <div className="preloader-inner">
        <p className="preloader-label">Independent developer</p>

        <p className="preloader-name" aria-hidden="true">
          {WORDS.map((word, w) => (
            <span key={word} className="preloader-word" data-word={w}>
              {word.split('').map((char) => {
                const i = letterIndex++;
                return (
                  <span
                    key={`${word}-${i}`}
                    className="kp-letter"
                    style={{ animationDelay: `${FIRST_DELAY_MS + i * STAGGER_MS}ms` }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </p>

        <p className="preloader-meta" aria-hidden="true">
          Crafting digital experiences
        </p>
      </div>
    </div>
  );
}
