/**
 * Turns the SPA build into real static pages.
 *
 * For every route in every language it renders the React tree to HTML,
 * rewrites the head with that page's own title, description, canonical,
 * hreflang alternates and social tags, injects JSON-LD, and writes
 * dist/<route>/index.html. English lives at the root; each translation under
 * its prefix (/pt, /es, /de). Then it emits sitemap.xml and robots.txt.
 *
 * Why it matters: without this, every route served the same <title>, the same
 * description and — worse — a canonical pointing at the home page, which tells
 * a crawler the other pages are duplicates and should not be indexed. On a
 * static host the SPA fallback also answered deep links with a 404 status.
 *
 * Run by `npm run build`, after `vite build` and `vite build --ssr`.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

// The SSR bundle lives outside dist so it never ships with the site.
const { render, ROUTES, routesFor, SITE_NAME, SITE_URL, FAQS_BY_LOCALE, READING, LOCALES, localizePath } =
  await import(join(ROOT, '.ssr-build', 'entry-server.js'));

const template = readFileSync(join(DIST, 'index.html'), 'utf8');
const OG_IMAGE = `${SITE_URL}/og.png`;

/** Absolute URL for an English path in a given locale. */
function urlFor(path, locale) {
  const p = localizePath(path, locale);
  return p === '/' ? `${SITE_URL}/` : `${SITE_URL}${p}`;
}

/** <link rel="alternate" hreflang> for every language, plus x-default → English. */
function alternateLinks(path) {
  return [
    ...LOCALES.map((l) => `<link rel="alternate" hreflang="${l.htmlLang}" href="${urlFor(path, l.code)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${urlFor(path, 'en')}" />`,
  ];
}

/** Replace the content of a meta/link tag matched by attribute. */
function setTag(html, selectorAttr, value, contentAttr = 'content') {
  const re = new RegExp(
    `(<(?:meta|link)[^>]*${selectorAttr}[^>]*${contentAttr}=")[^"]*(")`,
    'i',
  );
  return html.replace(re, `$1${escapeAttr(value)}$2`);
}

/** JSON-LD wants plain text, and the FAQ answers carry inline markup. */
function stripTags(html) {
  return String(html)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function jsonLd(route, locale) {
  const url = urlFor(route.path, locale.code);
  const home = routesFor(locale.code)[0];

  const webPage = {
    '@type': 'WebPage',
    '@id': url,
    url,
    name: route.title,
    description: route.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    inLanguage: locale.htmlLang,
    about: { '@id': `${SITE_URL}/#som` },
  };

  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description:
        'An unofficial visual guide to the Story Object Model 1.0, the open standard for story context in content production.',
      inLanguage: LOCALES.map((l) => l.htmlLang),
    },
    {
      '@type': 'DefinedTerm',
      '@id': `${SITE_URL}/#som`,
      name: 'Story Object Model',
      alternateName: 'SOM',
      description:
        'An open standard for story context in content production: seven JSON message families on a publish/subscribe bus, so every tool reads the same live description of a story.',
      url: 'https://storyobjectmodel.com/',
    },
    webPage,
  ];

  if (route.path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: home.label, item: urlFor('/', locale.code) },
        { '@type': 'ListItem', position: 2, name: route.label, item: url },
      ],
    });
    webPage.breadcrumb = { '@id': `${url}#breadcrumb` };
  }

  // The home page carries the FAQ, so it gets the FAQPage markup.
  if (route.path === '/') {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: FAQS_BY_LOCALE[locale.code].map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) },
      })),
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function buildPage(route, locale) {
  const url = urlFor(route.path, locale.code);
  let html = template;

  html = html.replace(/<html lang="[^"]*">/i, `<html lang="${locale.htmlLang}">`);
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(route.title)}</title>`);
  html = setTag(html, 'name="description"', route.description);
  html = setTag(html, 'rel="canonical"', url, 'href');
  html = setTag(html, 'property="og:title"', route.title);
  html = setTag(html, 'property="og:description"', route.description);
  html = setTag(html, 'property="og:url"', url);
  html = setTag(html, 'property="og:image"', OG_IMAGE);
  html = setTag(html, 'name="twitter:title"', route.title);
  html = setTag(html, 'name="twitter:description"', route.description);
  html = setTag(html, 'name="twitter:image"', OG_IMAGE);

  const head = [
    ...alternateLinks(route.path),
    `<meta property="og:locale" content="${locale.ogLocale}" />`,
    ...LOCALES.filter((l) => l.code !== locale.code).map(
      (l) => `<meta property="og:locale:alternate" content="${l.ogLocale}" />`,
    ),
    `<script type="application/ld+json">${jsonLd(route, locale)}</script>`,
  ];
  html = html.replace('</head>', `${head.map((h) => `  ${h}`).join('\n')}\n  </head>`);

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${render(localizePath(route.path, locale.code))}</div>`,
  );

  return html;
}

// --- pages ---------------------------------------------------------------

for (const locale of LOCALES) {
  for (const route of routesFor(locale.code)) {
    const html = buildPage(route, locale);
    const path = localizePath(route.path, locale.code);

    if (path === '/') {
      writeFileSync(join(DIST, 'index.html'), html);
    } else {
      const name = path.slice(1);
      // Both spellings, because hosts disagree about how they resolve an
      // extensionless path: Netlify and Cloudflare serve <name>.html, GitHub
      // Pages and S3-style hosts want <name>/index.html. Writing both means the
      // canonical URL (no trailing slash) resolves everywhere.
      mkdirSync(join(DIST, name), { recursive: true });
      writeFileSync(join(DIST, `${name}.html`), html);
      writeFileSync(join(DIST, name, 'index.html'), html);
    }
    console.log(`prerendered ${path}`);
  }
}

// The SPA fallback for anything not in the route table. Left un-prerendered so
// a host that serves it for unknown paths still returns the shell.
writeFileSync(
  join(DIST, '404.html'),
  template.replace(/<title>[^<]*<\/title>/i, '<title>Page not found — storyobjectmodel.dev</title>')
    .replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>'),
);
console.log('wrote 404.html');

// --- sitemap -------------------------------------------------------------

const today = new Date().toISOString().slice(0, 10);
// Every language version is its own <url>, and each lists all its siblings —
// Google wants the alternates repeated on every entry, including itself.
const entries = LOCALES.flatMap((l) =>
  ROUTES.map((r) => {
    const alternates = [
      ...LOCALES.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.htmlLang}" href="${urlFor(r.path, a.code)}" />`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(r.path, 'en')}" />`,
    ].join('\n');
    return `  <url>
    <loc>${urlFor(r.path, l.code)}</loc>
${alternates}
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`;
  }),
);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
console.log(`wrote sitemap.xml (${entries.length} urls)`);

// --- robots --------------------------------------------------------------

writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
);
console.log('wrote robots.txt');

// --- llms.txt ------------------------------------------------------------
// The llmstxt.org convention: one markdown file at the root telling a model
// what this site is and where the substance lives, without making it crawl.

const llms = `# ${SITE_NAME}

> An unofficial visual guide to the Story Object Model (SOM) 1.0: the open standard for story context in content production. The standard's official home is https://storyobjectmodel.com and its normative schemas live in https://github.com/storyobjectmodel/som.

SOM 1.0 was published on 12 September 2026 at IBC in Amsterdam, developed through the IBC Accelerator Media Innovation Programme 2026 as the project SMART STORIES (fourteen champions, seventeen participants). It is open and unowned: schemas, examples, tools and skills are Apache 2.0; specification prose is CC BY 4.0.

What SOM is: seven JSON message families carried on an ordinary publish/subscribe bus — the envelope, story.context, som.telling.*, som.link.*, delivery.media_available, som.system.audit and skill.warning.raised. Each schema is served at https://storyobjectmodel.com/schema/1.0/<family>.schema.json, a URL stable for the life of 1.x.

Key distinctions a reader should get right:
- Three nouns: a Story is the happening, an Asset is what the newsroom gathers and makes (by reference; media never travels the bus), a Telling is the moment an asset meets an audience.
- Nothing sits in charge. There is no orchestrator; each tool reads the story and decides for itself.
- SOM carries context; Skills carry knowledge. A skill declares; the tool that owns the executor acts. Holds combine by conjunction and fail closed.
- story.context is a full snapshot, never a delta. Omission means absent. One writer — the publisher's story management system — mints the story and owns its sequence.
- som_version is "1.0.0"; "0.3.2" is not conformant. message_type is the only parsing discriminator. Implementations must assert JSON Schema format.
- SOM replaces nothing: not the media, the rundown, a MAM or a product. MOS stays; TAMS holds the frames.

Where this guide and a published schema disagree, the schema is right.

## Pages

${ROUTES.map((r) => `- [${r.label}](${r.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${r.path}`}): ${r.description}`).join('\n')}

## Translations

The guide is also available in ${LOCALES.filter((l) => l.code !== 'en').map((l) => `${l.name} (${urlFor('/', l.code)})`).join(', ')}. English is the source text.

## Primary sources

${READING.map((r) => `- [${r.title}](${r.url}): ${r.source}. ${r.why}`).join('\n')}
`;

writeFileSync(join(DIST, 'llms.txt'), llms);
console.log('wrote llms.txt');
