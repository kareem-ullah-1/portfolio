export interface ProjectPreviewImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  title: string;
  kicker: string;
  description: string;
  /** Leave empty until the technologies are confirmed; nothing is rendered for an empty list. */
  stack: string[];
  status?: string;
  /** Draft projects are kept in this file but not shown. Remove the flag once the details are real. */
  draft?: boolean;
  /** Optional. Rendered as "My contribution" only when set, so nothing unverified is shown. */
  contribution?: string;
  /** Optional cover artwork. Pair with `concept: true` when it is NOT a screenshot of a built product. */
  image?: { src: string; alt: string };
  /** Optional desktop + phone preview pair for a built, live product. Renders the showcase card. */
  preview?: { desktop: ProjectPreviewImage; mobile?: ProjectPreviewImage };
  /** Marks the card as a design concept, shown with a visible label. */
  concept?: boolean;
  /** Optional label for the preview badge (defaults to "Live"). */
  badge?: string;
  /** Add real URLs here; buttons only render when a link is set. */
  liveUrl?: string;
  repoUrl?: string;
}

/*
 * CONFIRM AND FILL IN per project (empty fields are simply not shown):
 *   contribution, liveUrl, repoUrl, and a real screenshot (add `image`, without `concept`).
 *   Noor Fabrics: technologies and features are not yet supplied, so only the basics are shown.
 */
export const projects: Project[] = [
  {
    title: 'So Eezee – E-commerce Website',
    kicker: 'Ecommerce · Live website',
    description:
      'The live storefront for So Eezee, a spices and foods brand: shop, value bundles, cart and order tracking, built with Next.js on a TypeScript, Express and PostgreSQL API.',
    stack: ['Next.js', 'Node.js', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL', 'Zod', 'Cloudflare R2'],
    liveUrl: 'https://soeezee.com',
    preview: {
      desktop: {
        src: '/projects/so-eezee-desktop.webp',
        alt: 'So Eezee homepage with a hero banner of boxed spice powders: red chilli, turmeric, coriander, garlic and ginger',
        width: 1600,
        height: 713,
      },
      mobile: {
        src: '/projects/so-eezee-mobile.webp',
        alt: 'Close-up of the So Eezee homepage banner showing a coriander powder box, in a phone frame',
        width: 760,
        height: 1376,
      },
    },
  },
  {
    title: 'VYRON',
    kicker: 'POS · Business management',
    description:
      'A responsive point-of-sale and business management interface built with Next.js and TypeScript, designed to work across desktop and mobile screens. The live demo runs on sample data.',
    stack: ['Next.js', 'React', 'TypeScript'],
    liveUrl: 'https://vyron-kdoh.vercel.app/',
    badge: 'Demo',
    preview: {
      desktop: {
        src: '/projects/vyron-desktop.webp',
        alt: 'VYRON admin dashboard showing a welcome banner, sales and customer totals, a sales and purchase chart and a recent sales list',
        width: 1600,
        height: 738,
      },
    },
  },
  {
    title: 'NTM Fabrics',
    kicker: 'Ecommerce · Live website',
    description:
      'A storefront for premium unstitched Pakistani fabric (wash & wear, cotton, boski and latha), with nationwide delivery, cash on delivery, WhatsApp ordering and an admin dashboard.',
    stack: [],
    liveUrl: 'https://ntm-hnc8.vercel.app/',
    preview: {
      desktop: {
        src: '/projects/ntm-fabrics-desktop.webp',
        alt: 'NTM Fabrics homepage with the headline "Crafted for the Modern Man" over a close-up photo of fabric, with a Shop Now button',
        width: 1600,
        height: 737,
      },
      mobile: {
        src: '/projects/ntm-fabrics-mobile.webp',
        alt: 'NTM Fabrics mobile homepage with the headline "Crafted for the Modern Man" over dark draped fabric',
        width: 247,
        height: 487,
      },
    },
  },
  {
    title: 'Aikdemy',
    kicker: 'School management · Live website',
    description:
      'An institute management platform for schools and academies in Pakistan, with admin, management and parent portals, same-day absence SMS, result cards, automated fee challans, biometric staff attendance and payroll, and exam datesheets.',
    stack: [],
    liveUrl: 'https://aikdemy.pro/',
    preview: {
      desktop: {
        src: '/projects/aikdemy-desktop.webp',
        alt: 'Aikdemy homepage headline "Upgrade your Institute into a smart Digital Network" beside a dashboard mockup',
        width: 1600,
        height: 739,
      },
      mobile: {
        src: '/projects/aikdemy-mobile.webp',
        alt: 'Aikdemy mobile homepage with the institute management system headline, feature list and dashboard mockup',
        width: 247,
        height: 540,
      },
    },
  },
  {
    title: 'Noor Fabrics',
    kicker: 'Ecommerce',
    // TODO: replace with a real description, technologies and contribution, then delete `draft`.
    description: '',
    stack: [],
    draft: true,
  },
];
