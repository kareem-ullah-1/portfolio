import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

let lenis: Lenis | null = null;
let maxScroll = 0;
let measured = false;
let probe: HTMLDivElement | null = null;
let reducedMotion = false;

gsap.registerPlugin(ScrollTrigger);

/** Total scrollable distance. Uses the *large* viewport height so mobile URL-bar changes never shift progress. */
function measure(): void {
  const viewport = probe?.offsetHeight || window.innerHeight;
  maxScroll = Math.max(0, document.documentElement.scrollHeight - viewport);
  measured = true;
}

/** 0 at the very top of the page, 1 at the very bottom (same mapping as the original animation). */
export function getScrollProgress(): number {
  if (!measured) measure();
  return maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
}

export function scrollToTop(): void {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
}

/** Locks page scrolling (used by the mobile menu). */
export function setScrollLocked(locked: boolean): void {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

/** Starts Lenis (unless reduced motion) and wires it to GSAP's ticker. Returns a cleanup function. */
export function initScroll(reduced: boolean): () => void {
  reducedMotion = reduced;
  ScrollTrigger.config({ ignoreMobileResize: true });

  probe = document.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);
  measure();

  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(document.body);
  ScrollTrigger.addEventListener('refresh', measure);

  let tick: ((time: number) => void) | null = null;
  if (!reduced) {
    const instance = new Lenis({
      lerp: 0.1,
      autoRaf: false,
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenis = instance;
    instance.on('scroll', ScrollTrigger.update);
    tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  }

  document.documentElement.dataset.motionReady = '1';

  return () => {
    if (tick) {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
    }
    lenis?.destroy();
    lenis = null;
    resizeObserver.disconnect();
    ScrollTrigger.removeEventListener('refresh', measure);
    probe?.remove();
    probe = null;
    measured = false;
    delete document.documentElement.dataset.motionReady;
  };
}
