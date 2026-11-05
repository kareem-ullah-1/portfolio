import { Layers, Monitor, Server, ShoppingCart, type LucideIcon } from 'lucide-react';

export interface Service {
  title: string;
  description: string;
  points: string[];
  icon: LucideIcon;
}

export const services: Service[] = [
  {
    title: 'Frontend Development',
    description: 'Fast, accessible, responsive interfaces with considered motion and no layout jank.',
    points: ['React and Next.js App Router', 'Tailwind CSS design systems', 'Performance, accessibility and animation'],
    icon: Monitor,
  },
  {
    title: 'Full-Stack Web Development',
    description: 'One developer from database to deploy: schema, API and interface designed to fit together.',
    points: ['Data modelling with PostgreSQL and Prisma', 'Typed APIs and React / Next.js frontends', 'Docker-ready, documented delivery'],
    icon: Layers,
  },
  {
    title: 'Backend and API Development',
    description: 'Secure REST APIs with clear contracts, validation and predictable error handling.',
    points: ['Node.js with Express or NestJS', 'JWT auth, Zod / DTO validation', 'Swagger / OpenAPI documentation'],
    icon: Server,
  },
  {
    title: 'Ecommerce Website Development',
    description: 'Online stores and admin dashboards built around how your business actually sells.',
    points: ['Ecommerce APIs on PostgreSQL and Prisma', 'Admin dashboards and POS interfaces', 'File storage and caching integrations'],
    icon: ShoppingCart,
  },
];
