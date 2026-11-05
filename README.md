# Kareem Ullah — Cinematic Portfolio

A single Next.js 16 app (App Router, TypeScript, Tailwind v4). The background is a 240-frame canvas sequence scrubbed by page scroll (Lenis + GSAP ticker). The contact form is a Next.js Route Handler that emails the owner over SMTP. There is no separate backend and no database.

```
frontend/   the whole app (deploy this directory)
```

## Requirements
Node.js 20.9+ (Node 22 LTS recommended) and npm 10+.

## Local setup
```bash
cd frontend
npm install
cp .env.example .env.local     # fill in the SMTP_* values to test the contact form
npm run dev                    # http://localhost:3000
```

## Scripts (run from `frontend/`)
```bash
npm run typecheck
npm run lint
npm test            # contact route tests (SMTP transport is mocked; no real email is sent)
npm run build
npm start
```

## Contact API
`POST /api/contact` (`app/api/contact/route.ts`, Node.js runtime, same-origin, so no CORS config).

- JSON only, 16 KB body limit, validated with the shared Zod schema (name 2–80, email ≤254, optional subject ≤120, message 10–2000).
- Honeypot field `website`: if filled, the response looks like a normal success but no email is sent.
- Sends one SMTP email to `CONTACT_TO_EMAIL` via Nodemailer. The visitor goes in `Reply-To`; `From` and the recipient are never visitor-controlled; CR/LF is stripped from name and subject.
- Responses: `201` success, `400` invalid input, `413` too large, `415` wrong content type, `503` SMTP not configured, `502` delivery failed. All are `{ success, message }`. Credentials and raw errors are never returned.
- Messages are **not stored**. They exist only as email in the owner's inbox.

### Spam protection (what is actually active)
Honeypot, strict validation and the body-size limit. There is **no rate limiting**: a per-instance in-memory limiter does not work on serverless hosts like Vercel. If abuse becomes a problem, add a managed limiter (e.g. Upstash Ratelimit) or Cloudflare Turnstile; neither is configured today.

## Environment variables
Public (inlined at build time, rebuild after changing): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_GITLAB_URL`, `NEXT_PUBLIC_RESUME_URL`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.

Server-only (never `NEXT_PUBLIC_`): `SMTP_HOST`, `SMTP_PORT` (default 587), `SMTP_SECURE` (default true only for port 465), `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL`, `MAIL_FROM` (optional, defaults to `SMTP_USER`). `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` and `CONTACT_TO_EMAIL` are required; without them the form returns an error instead of pretending to deliver. Gmail needs an App Password.

## Deployment (Vercel)
Import the repo, set **Root Directory** to `frontend`, add the variables above, deploy. `next build` warns if `NEXT_PUBLIC_SITE_URL` is unset or points at localhost.

## Content
- **Résumé**: put the PDF at `frontend/public/Kareem-Ullah-Resume.pdf`; the button only appears if it exists at build time.
- **Social links**: set the `NEXT_PUBLIC_*_URL` variables; icons stay hidden until set.
- **Projects / experience**: edit `frontend/content/*.ts`. Projects marked `draft: true` are not rendered.

## Animation notes
Frames live in `frontend/public/frames/` (WebP, 1276×720, ~20 KB each). Frame 1 is preloaded, the rest stream in nearest-first, and only a small window (12 frames desktop, 8 constrained devices) is decoded at once. The nearest decoded frame is drawn if the exact one isn't ready, so the canvas never blanks. One Lenis instance (`lerp: 0.1`) is driven by the GSAP ticker; the canvas follows its scroll position directly with no second easing layer. `prefers-reduced-motion` shows a static first frame with no smooth scrolling or reveals.

If the background still looks soft, the cause is the source frames, not CSS: re-export the sequence at 1600×900 or 1920×1080 WebP.
