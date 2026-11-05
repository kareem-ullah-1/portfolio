import path from 'node:path';
import type { NextConfig } from 'next';

// NEXT_PUBLIC_* values are baked in at build time, so warn while building for production without them.
if (process.env.NODE_ENV === 'production') {
  const isLocal = (v?: string) => !v || /localhost|127\.0\.0\.1/.test(v);
  if (isLocal(process.env.NEXT_PUBLIC_SITE_URL)) {
    console.warn('[config] NEXT_PUBLIC_SITE_URL is unset or points at localhost: canonical URL, sitemap and OG image will be wrong.');
  }
}

const immutable =[{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: path.resolve(process.cwd()) },
  async headers() {
    return [
      // Frame filenames never change, so they can be cached forever.
      { source: '/frames/:file*', headers: immutable },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

export default nextConfig;
