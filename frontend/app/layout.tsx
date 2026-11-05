import type { Metadata, Viewport } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import localFont from 'next/font/local';
import { FrameBackground } from '@/components/scroll/FrameBackground';
import { SmoothScroll } from '@/components/scroll/SmoothScroll';
import { Preloader } from '@/components/ui/Preloader';
import { skillGroups } from '@/content/skills';
import { site } from '@/lib/site';
import './globals.css';

const instrument = localFont({
  src: [
    { path: './fonts/instrument-serif-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/instrument-serif-latin-400-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-instrument',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} | ${site.title} · ${site.tagline}`,
  description: site.description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name }],
  keywords: [
    'Kareem Ullah',
    'Full-Stack Web Developer',
    'MERN developer',
    'Next.js developer',
    'React developer',
    'Node.js developer',
    'TypeScript developer',
    'ecommerce website development',
    'web developer Faisalabad',
    'web developer Pakistan',
    'freelance web developer',
  ],
  category: 'technology',
  creator: site.name,
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined },
  openGraph: {
    type: 'website',
    url: '/',
    locale: 'en_US',
    title: `${site.name} | ${site.title}`,
    description: site.description,
    siteName: `${site.name} Portfolio`,
  },
  twitter: { card: 'summary_large_image', title: `${site.name} | ${site.title}`, description: site.description },
};

// Only facts already shown on the page.
const personJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${site.url}/#person`,
      name: site.name,
      jobTitle: site.title,
      description: site.description,
      email: `mailto:${site.email}`,
      url: site.url,
      address: { '@type': 'PostalAddress', addressLocality: 'Faisalabad', addressCountry: 'PK' },
      knowsAbout: skillGroups.flatMap((g) => g.items),
      sameAs: site.socials.map((s) => s.href),
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: `${site.name} Portfolio`,
      description: site.description,
      inLanguage: 'en',
      publisher: { '@id': `${site.url}/#person` },
    },
  ],
}).replace(/</g, '\\u003c');

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

// Runs before first paint: enables reveal styles only when motion is allowed,
// and removes them again if the animation bundle never initialises.
const motionGate = `(function(){try{var d=document.documentElement;if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion-ok');setTimeout(function(){if(!d.dataset.motionReady)d.classList.remove('motion-ok')},5000)}}catch(e){}})()`;

// First visit of a session: marks the page "active" before first paint so the server-rendered overlay shows
// with no flash of content. Without JS (or if this never runs) the overlay stays hidden by CSS, and a
// timeout releases it even if the Preloader component never hydrates.
const preloaderGate = `(function(){try{var d=document.documentElement;if(!sessionStorage.getItem('kp-preloaded')){d.dataset.preloader='active';setTimeout(function(){if(d.dataset.preloader==='active')d.dataset.preloader='done'},9000)}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionGate }} />
        <script dangerouslySetInnerHTML={{ __html: preloaderGate }} />
        <link rel="preload" as="image" href="/frames/frame-001.webp" type="image/webp" fetchPriority="high" />
      </head>
      <body suppressHydrationWarning>
        <FrameBackground />
        <SmoothScroll />
        <Preloader />
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
      </body>
    </html>
  );
}
