/**
 * Turns the SPA build into real static pages.
 *
 * For every route it renders the React tree to HTML, rewrites the head with
 * that page's own title, description, canonical and social tags, injects
 * JSON-LD, and writes dist/<route>/index.html. Then it emits sitemap.xml and
 * robots.txt.
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
const { render, ROUTES, SITE_NAME, SITE_URL, FAQS, READING } = await import(
  join(ROOT, '.ssr-build', 'entry-server.js')
);

const template = readFileSync(join(DIST, 'index.html'), 'utf8');
const OG_IMAGE = `${SITE_URL}/og.png`;

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

function jsonLd(route) {
  const url = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;

  const webPage = {
    '@type': 'WebPage',
    '@id': url,
    url,
    name: route.title,
    description: route.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    inLanguage: 'en',
    about: { '@id': `${SITE_URL}/#som` },
  };

  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description:
        'A visual guide to the Story Object Model, the open standard for sharing editorial story context between newsroom systems.',
      inLanguage: 'en',
    },
    {
      '@type': 'DefinedTerm',
      '@id': `${SITE_URL}/#som`,
      name: 'Story Object Model',
      alternateName: 'SOM',
      description:
        'An open standard describing the editorial context of a news story in a structured form, so that context can move between newsroom, production and AI tools built by different vendors.',
      url: `${SITE_URL}/`,
    },
    webPage,
  ];

  if (route.path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
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
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) },
      })),
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function buildPage(route) {
  const url = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
  let html = template;

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

  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">${jsonLd(route)}</script>\n  </head>`,
  );

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${render(route.path)}</div>`,
  );

  return html;
}

// --- pages ---------------------------------------------------------------

for (const route of ROUTES) {
  const html = buildPage(route);

  if (route.path === '/') {
    writeFileSync(join(DIST, 'index.html'), html);
  } else {
    const name = route.path.slice(1);
    // Both spellings, because hosts disagree about how they resolve an
    // extensionless path: Netlify and Cloudflare serve <name>.html, GitHub
    // Pages and S3-style hosts want <name>/index.html. Writing both means the
    // canonical URL (no trailing slash) resolves everywhere.
    writeFileSync(join(DIST, `${name}.html`), html);
    mkdirSync(join(DIST, name), { recursive: true });
    writeFileSync(join(DIST, name, 'index.html'), html);
  }
  console.log(`prerendered ${route.path}`);
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
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => {
  const loc = r.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${r.path}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`;
}).join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
console.log(`wrote sitemap.xml (${ROUTES.length} urls)`);

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

> A guide to the Story Object Model (SOM): an open standard describing the editorial context of a news story in a structured form, so that context can move between newsroom, production and AI tools built by different vendors.

SOM is being specified by SMART STORIES, a 2026 IBC Accelerator project proposed by the Associated Press, NBCUniversal, ITN and the BBC. The public draft specification is due at IBC in September 2026, so treat the model as moving, and the vendored JSON Schemas in the reference implementation as the source of truth.

The core loop: a story is published as a full \`story.context\` snapshot on a bus; an executor runs data-driven skills against it; skill outputs go to a staging topic and reach production only after a human approves them; every decision, including a refusal, is recorded on an audit topic.

Key distinctions a reader should get right:
- SOM is the shared structure and contains no intelligence. The intelligence stays inside each vendor's tools.
- SOM defines the common shape; Skills define the per-newsroom logic (editorial standards, compliance rules, show formats).
- SOM is complementary to MOS, not a replacement. MOS moves data; SOM moves the story's current meaning.
- Stories are republished in full on every change. There are no deltas and no query API.

This site is a secondary source, written by the community and not by the consortium.

## Pages

${ROUTES.map((r) => `- [${r.label}](${r.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${r.path}`}): ${r.description}`).join('\n')}

## Primary sources

${READING.map((r) => `- [${r.title}](${r.url}): ${r.source}. ${r.why}`).join('\n')}

## Reference implementation

- [SOM hackathon starter (.NET)](https://github.com/google/virtual-broadcast-production-assistant/tree/main/som-hackathon-starter-dotnet): executor, dashboard, simulator and the vendored JSON Schemas.
`;

writeFileSync(join(DIST, 'llms.txt'), llms);
console.log('wrote llms.txt');
