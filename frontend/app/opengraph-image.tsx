import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 96px',
          background: 'linear-gradient(135deg, #050505 0%, #12060a 100%)',
          color: '#f4f0f1',
        }}
      >
        <div style={{ display: 'flex', fontSize: 24, letterSpacing: 8, color: '#ff2e4d' }}>INDEPENDENT DEVELOPER</div>
        <div style={{ display: 'flex', marginTop: 28, fontSize: 132, fontWeight: 700, letterSpacing: -2 }}>KAREEM ULLAH</div>
        <div style={{ display: 'flex', marginTop: 12, fontSize: 40, color: '#c9c3c5' }}>{site.title}</div>
        <div style={{ display: 'flex', marginTop: 56, height: 3, width: 220, background: '#ff2e4d' }} />
        <div style={{ display: 'flex', marginTop: 28, fontSize: 26, color: '#8f888b' }}>
          React · Next.js · Node.js · TypeScript — {site.location}
        </div>
      </div>
    ),
    size,
  );
}
