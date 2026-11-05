import gsap from 'gsap';

/**
 * Scroll-scrubbed canvas frame sequence.
 *
 * - Frame 1 is shown the moment it is decoded; the rest stream in nearest-first.
 * - Compressed frames (~20 KB each) are kept in memory; only a small sliding window
 *   around the playhead is decoded to bitmaps, so memory stays bounded.
 * - If the exact frame is not decoded yet, the nearest decoded frame is drawn,
 *   so the canvas never goes blank or flashes.
 */

interface Drawable {
  src: CanvasImageSource;
  w: number;
  h: number;
  release: () => void;
}

export interface FrameSequenceOptions {
  canvas: HTMLCanvasElement;
  frameCount: number;
  /** 0-based frame index -> URL */
  getUrl: (index: number) => string;
  /** 0..1 page scroll progress */
  getProgress: () => number;
  reducedMotion: boolean;
  /** Max decoded bitmaps kept alive (besides frame 1). */
  maxDecoded: number;
  maxFetches: number;
  onFirstFrame?: () => void;
}

const MAX_CONCURRENT_DECODES = 2;
const MAX_FETCH_ATTEMPTS = 3;

// Horizontal position (0..1) of the subject across the sequence, used to keep him in view on portrait screens.
const SUBJECT_X: ReadonlyArray<readonly [number, number]> = [
  [0, 0.79],
  [0.25, 0.66],
  [0.5, 0.52],
  [0.75, 0.49],
  [1, 0.6],
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function subjectX(progress: number): number {
  for (let i = 1; i < SUBJECT_X.length; i++) {
    const [p1, x1] = SUBJECT_X[i];
    if (progress <= p1) {
      const [p0, x0] = SUBJECT_X[i - 1];
      return lerp(x0, x1, (progress - p0) / (p1 - p0));
    }
  }
  return SUBJECT_X[SUBJECT_X.length - 1][1];
}

export class FrameSequence {
  private readonly o: FrameSequenceOptions;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly blobs: (Blob | undefined)[];
  private readonly drawables: (Drawable | undefined)[];
  private readonly attempts: number[];
  private readonly fetching = new Set<number>();
  private readonly decoding = new Set<number>();
  private readonly abort = new AbortController();
  private readonly resizeObserver: ResizeObserver;
  /** Decode window around the playhead, derived from maxDecoded so the window always fits the cache. */
  private readonly decodeAhead: number;
  private readonly decodeBehind: number;
  private current = 0;
  private direction = 1;
  private lastDrawn = -1;
  private decodedCount = 0;
  private loadedCount = 0;
  private destroyed = false;
  private ticking = false;

  constructor(options: FrameSequenceOptions) {
    this.o = options;
    const ctx = options.canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('2D canvas is not supported');
    this.ctx = ctx;
    this.blobs = new Array(options.frameCount);
    this.drawables = new Array(options.frameCount);
    this.attempts = new Array(options.frameCount).fill(0);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.decodeAhead = Math.max(2, Math.ceil(options.maxDecoded * 0.55));
    this.decodeBehind = Math.max(1, Math.floor(options.maxDecoded * 0.3));
  }

  async start(): Promise<void> {
    this.resizeObserver.observe(this.o.canvas);
    this.resize();

    await this.loadFirstFrame();
    if (this.destroyed) return;
    this.o.onFirstFrame?.();

    if (this.o.reducedMotion) return; // static poster only
    gsap.ticker.add(this.tick);
    this.ticking = true;
    this.pump();
  }

  destroy(): void {
    this.destroyed = true;
    this.abort.abort();
    if (this.ticking) gsap.ticker.remove(this.tick);
    this.resizeObserver.disconnect();
    this.drawables.forEach((d, i) => {
      if (i !== 0) d?.release();
    });
    this.drawables.length = 0;
  }

  // ---------------------------------------------------------------- loading

  private async loadFirstFrame(): Promise<void> {
    // An <img> is used for frame 1 so it matches the <link rel="preload" as="image"> in the document head.
    const img = new Image();
    img.decoding = 'async';
    img.src = this.o.getUrl(0);
    try {
      await img.decode();
    } catch {
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    }
    if (this.destroyed || !img.naturalWidth) return;
    this.drawables[0] = { src: img, w: img.naturalWidth, h: img.naturalHeight, release: () => {} };
    this.loadedCount = 1;
    this.draw(true);
  }

  private nextToFetch(): number {
    const c = Math.round(this.current);
    let best = -1;
    let bestScore = Infinity;
    for (let i = 1; i < this.o.frameCount; i++) {
      if (this.blobs[i] || this.fetching.has(i) || this.attempts[i] >= MAX_FETCH_ATTEMPTS) continue;
      const d = i - c;
      const score = d >= 0 ? d : -d * 2.5; // frames ahead of the playhead matter more
      if (score < bestScore) {
        best = i;
        bestScore = score;
      }
    }
    return best;
  }

  private pump(): void {
    if (this.destroyed) return;
    while (this.fetching.size < this.o.maxFetches) {
      const next = this.nextToFetch();
      if (next < 0) break;
      void this.fetchFrame(next);
    }
  }

  private async fetchFrame(i: number): Promise<void> {
    this.fetching.add(i);
    this.attempts[i]++;
    try {
      const res = await fetch(this.o.getUrl(i), { signal: this.abort.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.blobs[i] = await res.blob();
      this.loadedCount++;
      if (this.loadedCount % 10 === 0 || this.loadedCount === this.o.frameCount) {
        this.o.canvas.dataset.loaded = String(this.loadedCount);
      }
    } catch {
      if (!this.destroyed && this.attempts[i] < MAX_FETCH_ATTEMPTS) {
        const delay = 600 * 2 ** (this.attempts[i] - 1);
        setTimeout(() => this.pump(), delay);
      }
    } finally {
      this.fetching.delete(i);
      this.pump();
    }
  }

  // --------------------------------------------------------------- decoding

  private async decode(i: number): Promise<void> {
    const blob = this.blobs[i];
    if (!blob || this.drawables[i] || this.decoding.has(i)) return;
    this.decoding.add(i);
    try {
      let drawable: Drawable;
      if (typeof createImageBitmap === 'function') {
        const bitmap = await createImageBitmap(blob);
        drawable = { src: bitmap, w: bitmap.width, h: bitmap.height, release: () => bitmap.close() };
      } else {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        await img.decode();
        URL.revokeObjectURL(url);
        drawable = { src: img, w: img.naturalWidth, h: img.naturalHeight, release: () => {} };
      }
      if (this.destroyed) {
        drawable.release();
        return;
      }
      this.drawables[i] = drawable;
      this.decodedCount++;
      this.evict();
    } catch {
      /* a failed decode is retried on a later tick */
    } finally {
      this.decoding.delete(i);
    }
  }

  private ensureDecoded(): void {
    if (this.decoding.size >= MAX_CONCURRENT_DECODES) return;
    const c = Math.round(this.current);
    const ahead = this.direction >= 0 ? this.decodeAhead : this.decodeBehind;
    const behind = this.direction >= 0 ? this.decodeBehind : this.decodeAhead;
    for (let d = 0; d <= Math.max(ahead, behind); d++) {
      for (const idx of d === 0 ? [c] : [c + d, c - d]) {
        const within = idx > c ? idx - c <= ahead : c - idx <= behind;
        if (!within || idx < 1 || idx >= this.o.frameCount) continue;
        if (this.blobs[idx] && !this.drawables[idx] && !this.decoding.has(idx)) {
          void this.decode(idx);
          if (this.decoding.size >= MAX_CONCURRENT_DECODES) return;
        }
      }
    }
  }

  private evict(): void {
    const c = Math.round(this.current);
    while (this.decodedCount > this.o.maxDecoded) {
      let farthest = -1;
      let farthestDistance = -1;
      for (let i = 1; i < this.drawables.length; i++) {
        if (!this.drawables[i]) continue;
        const dist = Math.abs(i - c);
        if (dist > farthestDistance) {
          farthest = i;
          farthestDistance = dist;
        }
      }
      if (farthest < 0) return;
      this.drawables[farthest]?.release();
      this.drawables[farthest] = undefined;
      this.decodedCount--;
    }
  }

  // -------------------------------------------------------------- rendering

  /** Lenis already smooths the scroll position, so the canvas tracks it directly (no second easing layer). */
  private tick = (): void => {
    const target = clamp(this.o.getProgress(), 0, 1) * (this.o.frameCount - 1);
    if (target !== this.current) this.direction = target > this.current ? 1 : -1;
    this.current = target;
    this.ensureDecoded();
    this.draw(false);
  };

  private nearestAvailable(index: number): number {
    for (let d = 0; d < this.o.frameCount; d++) {
      if (this.drawables[index - d]) return index - d;
      if (this.drawables[index + d]) return index + d;
    }
    return -1;
  }

  private draw(force: boolean): void {
    const wanted = clamp(Math.round(this.current), 0, this.o.frameCount - 1);
    const index = this.nearestAvailable(wanted);
    if (index < 0) return;
    if (!force && index === this.lastDrawn) return;
    const frame = this.drawables[index];
    if (!frame) return;

    const { canvas } = this.o;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / frame.w, ch / frame.h); // "cover", same as the original
    const dw = frame.w * scale;
    const dh = frame.h * scale;

    let dx = (cw - dw) / 2;
    if (dw > cw + 1) {
      // Narrow (portrait) screens crop the sides: pan toward the subject instead of dead centre.
      const portrait = clamp((1.25 - cw / ch) / 0.55, 0, 1);
      if (portrait > 0) {
        const sx = subjectX(index / (this.o.frameCount - 1));
        const align = clamp((cw / 2 - sx * dw) / (cw - dw), 0, 1);
        dx = (cw - dw) * lerp(0.5, align, portrait);
      }
    }
    this.ctx.drawImage(frame.src, dx, (ch - dh) / 2, dw, dh);
    this.lastDrawn = index;
    canvas.dataset.frame = String(index + 1);
  }

  private resize(): void {
    const { canvas } = this.o;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    // The source frames are only 1276x720, so extra device pixels add cost without detail.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = Math.round(rect.width * dpr);
    let h = Math.round(rect.height * dpr);
    const maxPixels = 2560 * 1440;
    if (w * h > maxPixels) {
      const s = Math.sqrt(maxPixels / (w * h));
      w = Math.round(w * s);
      h = Math.round(h * s);
    }
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w; // clears the canvas...
    canvas.height = h;
    this.ctx.imageSmoothingQuality = 'high';
    this.draw(true); // ...so repaint in the same task, before the browser can present a blank frame
  }
}
