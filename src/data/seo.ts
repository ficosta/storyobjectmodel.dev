export interface RouteMeta {
  /** Path, always with a leading slash and no trailing slash (except "/"). */
  path: string;
  /** <title>. Keep under ~60 characters before the site suffix. */
  title: string;
  /** <meta name="description">. Aim for 140–160 characters. */
  description: string;
  /** Short label used in breadcrumbs and in-page navigation. */
  label: string;
  /** Relative priority in the sitemap. */
  priority: number;
}

export const SITE_URL = 'https://storyobjectmodel.dev';
export const SITE_NAME = 'storyobjectmodel.dev';

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    label: 'Home',
    title: 'Story Object Model — the open story-context standard for newsrooms',
    description:
      'SOM is an open standard for sharing editorial story context between newsroom systems — NRCS, MAM, graphics, compliance, playout. One bus, typed messages, no point-to-point integrations.',
    priority: 1.0,
  },
  {
    path: '/concepts',
    label: 'Concepts',
    title: 'SOM concepts — stories, skills, the approval gate',
    description:
      'The Story Object Model in five minutes: stories as full snapshots, skills as data, the SOM/Skills boundary, the human approval gate, safe-state stops, and the full glossary.',
    priority: 0.9,
  },
  {
    path: '/envelope',
    label: 'Envelope',
    title: 'The SOM envelope — every field, and the five rules that bite',
    description:
      'Field-by-field reference for the SOM message envelope and the skill.warning.raised payload, the v0.3.x renames, dot-notation field paths, and the vendor extension namespace.',
    priority: 0.8,
  },
  {
    path: '/bus',
    label: 'The bus',
    title: 'SOM topics — the core loop and the distribution layer',
    description:
      'All nine SOM topic families: story context, staging, events, rejected and runs, plus delivery, link, telling and the system audit trail. With the TAMS media-arrival junction.',
    priority: 0.8,
  },
  {
    path: '/skills',
    label: 'Skills',
    title: 'SOM skills — anatomy, the seven rule types, validation',
    description:
      'A SOM skill is data, not code: one JSON file with an advert and rules. The seven built-in rule types, the three validation layers, the iteration loop, and the usual pitfalls.',
    priority: 0.8,
  },
  {
    path: '/get-started',
    label: 'Get started',
    title: 'Get started with SOM — run the loop end to end',
    description:
      'Bring up a SOM bus and the reference dashboard, publish a seed story, watch skills fire, approve one warning and reject another. Plus the curl cookbook and TAMS media arrivals.',
    priority: 0.9,
  },
];

export const ROUTE_BY_PATH: Record<string, RouteMeta> = Object.fromEntries(
  ROUTES.map((r) => [r.path, r]),
);

const FALLBACK: RouteMeta = {
  path: '/404',
  label: 'Not found',
  title: 'Page not found — storyobjectmodel.dev',
  description: 'That page is not on the bus.',
  priority: 0,
};

export function metaForPath(pathname: string): RouteMeta {
  const clean = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return ROUTE_BY_PATH[clean] ?? FALLBACK;
}
