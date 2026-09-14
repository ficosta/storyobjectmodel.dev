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
    title: 'Story Object Model 1.0 — a visual guide to the story context standard',
    description:
      'SOM 1.0 is the open standard for story context in content production: seven JSON message families on a pub/sub bus, so every newsroom tool reads the same live story.',
    priority: 1.0,
  },
  {
    path: '/concepts',
    label: 'Concepts',
    title: 'SOM concepts — Story, Asset, Telling, and how the model behaves',
    description:
      'The Story Object Model in ten minutes: the three nouns, snapshots, lifecycle, editorial gates and audit, skills that declare while executors act, and the principles behind it.',
    priority: 0.9,
  },
  {
    path: '/envelope',
    label: 'Envelope',
    title: 'The SOM 1.0 envelope — every field, and the conformance rules',
    description:
      'Field-by-field reference for the SOM 1.0 envelope and the skill.warning.raised payload: the wire version, format assertion, extensions, and what changed from v0.3.2.',
    priority: 0.8,
  },
  {
    path: '/bus',
    label: 'Messages',
    title: 'SOM 1.0 message families — story, link, telling, delivery, audit, warning',
    description:
      'The seven message families of SOM 1.0 and their schemas: story.context, som.link.*, som.telling.*, delivery.media_available, som.system.audit and skill.warning.raised.',
    priority: 0.8,
  },
  {
    path: '/skills',
    label: 'Skills',
    title: 'SOM skills — the library, recall adverts, and declare-not-act',
    description:
      'SOM carries context; Skills carry knowledge. The ten-skill reference library, how an executor recalls a skill, configured instances, conjunction of holds, and fail-closed.',
    priority: 0.8,
  },
  {
    path: '/get-started',
    label: 'Get started',
    title: 'Get started with SOM 1.0 — validate, publish, join',
    description:
      'Validate messages against the SOM 1.0 schemas with format assertion, publish a conformant story.context, pick an integration tier, and join the open working group.',
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
