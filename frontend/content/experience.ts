export interface ExperienceEntry {
  kind: 'learning' | 'work';
  /** Small badge above the title, e.g. "Learning" or "Work experience". */
  label: string;
  title: string;
  org: string;
  summary: string;
  points?: string[];
  stack?: string[];
}

/*
 * Only facts supplied by the site owner are included:
 *   - Edify: 7 months
 *   - Aiksol: 1 year
 * Independent projects live in content/projects.ts, not here.
 *
 * CONFIRM AND FILL IN (leave a field out until it is verified; empty fields are simply not shown):
 *   Edify → what was studied, any certificate (do not imply a qualification unless you hold one)
 *   Aiksol  → job title, start/end dates, responsibilities, technologies used
 * Entries run oldest first, which assumes the Edify learning came before the Aiksol work. Reorder if not.
 */
export const experience: ExperienceEntry[] = [
  {
    kind: 'learning',
    label: 'Learning',
    title: 'Learning through Edify',
    org: 'Edify',
    summary: 'Seven months of structured learning through Edify.',
    // points: [],   // CONFIRM: topics studied
    // stack: [],    // CONFIRM: technologies covered
  },
  {
    kind: 'work',
    label: 'Work experience',
    title: 'Work experience at Aiksol',
    org: 'Aiksol',
    summary: 'One year of professional work experience at Aiksol.',
    // points: [],   // CONFIRM: responsibilities
    // stack: [],    // CONFIRM: technologies used
  },
];
