import 'server-only';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { site } from './site';

/** Returns the résumé URL only if it is usable, so the button never links to a 404. */
export function getResumeUrl(): string | null {
  const url = site.resumeUrl;
  if (!url) return null;
  if (!url.startsWith('/')) return url;
  return existsSync(path.join(process.cwd(), 'public', url)) ? url : null;
}
