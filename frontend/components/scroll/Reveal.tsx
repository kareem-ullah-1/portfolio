'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animates every [data-reveal] element in as it enters the viewport and plays the hero entrance.
 * CSS only hides these elements when `html.motion-ok` is set, so with reduced motion
 * (or if this never runs) all content stays visible.
 *
 * ScrollTrigger handles the normal staggered case. An IntersectionObserver backs it up for
 * instant jumps (hash links, scrollbar drag, scroll restoration), where batch triggers can be skipped.
 */
export function Reveal() {
  useEffect(() => {
    const doc = document.documentElement;
    if (!doc.classList.contains('motion-ok')) return;

    const reveal = (els: Element[]) => {
      const fresh = els.filter((el) => !(el as HTMLElement).dataset.revealed);
      if (!fresh.length) return;
      fresh.forEach((el) => ((el as HTMLElement).dataset.revealed = '1'));
      // After an instant jump a batch can hold every element above the viewport too. Only what is on
      // screen is animated (staggered); everything else is shown immediately so it never delays the rest.
      const onScreen = fresh.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight;
      });
      // Once `data-revealed` is set the CSS hidden state stops applying, so clearing inline props
      // returns the element to its natural position (and lets CSS hover transforms work).
      if (onScreen.length) {
        gsap.fromTo(
          onScreen,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09, clearProps: 'opacity,transform' },
        );
      }
    };

    let releaseHero = () => {};
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('[data-reveal]', { start: 'top 88%', once: true, onEnter: (els) => reveal(els) });
      const hero = gsap.utils.toArray<HTMLElement>('[data-hero]');
      // While the preloader is up, hold the hero entrance until the curtain starts to lift. A timeout
      // guarantees it still plays if that event never arrives.
      const holdForPreloader = doc.dataset.preloader === 'active';
      const heroTween = gsap.fromTo(
        hero,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.12,
          delay: 0.15,
          clearProps: 'opacity,transform',
          paused: holdForPreloader,
        },
      );
      hero.forEach((el) => (el.dataset.revealed = '1'));
      if (holdForPreloader) {
        const play = () => heroTween.play();
        window.addEventListener('preloader:reveal', play, { once: true });
        const fallback = window.setTimeout(play, 10000);
        releaseHero = () => {
          window.removeEventListener('preloader:reveal', play);
          window.clearTimeout(fallback);
        };
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const hits = entries.filter((e) => e.isIntersecting).map((e) => e.target);
        if (!hits.length) return;
        hits.forEach((el) => observer.unobserve(el));
        reveal(hits);
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      releaseHero();
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return null;
}
