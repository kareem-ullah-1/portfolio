import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page not found | Kareem Ullah',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-[100svh] items-center py-24">
      <div className="section-shell">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-6 font-display text-[clamp(5rem,20vw,14rem)] leading-[0.85] tracking-tight [text-shadow:0_2px_24px_rgb(0_0_0/0.5)]">
          4<em className="text-gradient pr-1">0</em>4
        </h1>
        <h2 className="mt-6 font-display text-3xl sm:text-5xl">This page doesn&apos;t exist.</h2>
        <p className="mt-4 max-w-md text-fg/75">
          The link may be broken or the page may have moved. Head back to the portfolio.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-bg transition-transform duration-300 hover:scale-[1.04] active:scale-100"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
          <Link href="/#projects" className="inline-flex h-12 items-center rounded-full glass-pill px-6 text-sm font-medium">
            View projects
          </Link>
        </div>
      </div>
    </main>
  );
}
