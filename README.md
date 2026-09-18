# storyobjectmodel.dev

An unofficial visual guide to the **Story Object Model 1.0** — the open standard for story context in
content production. The standard itself lives at [storyobjectmodel.com](https://storyobjectmodel.com)
and [github.com/storyobjectmodel/som](https://github.com/storyobjectmodel/som).

Built as a static site: Vite + React + TypeScript, no backend, no CMS.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # → dist/
npm run preview    # serve the built output
npm run typecheck  # tsc, no emit
```

## SEO

Every route is **prerendered to static HTML** at build time — `vite build --ssr` produces a
server bundle, `scripts/prerender.mjs` renders each route with `renderToString`, rewrites the
head, and writes the file. The browser then hydrates it.

That buys the things a plain SPA cannot have:

- a real `<title>`, description and **canonical** per page. Before this, every route shipped
  the home page's canonical, which tells a crawler the other pages are duplicates and should
  not be indexed.
- content in the HTML source, so nothing depends on a crawler executing JavaScript.
- a **200** on every route. The old SPA fallback answered deep links with a 404 status on
  static hosts.
- JSON-LD per page: `WebSite`, a `DefinedTerm` for SOM itself, `WebPage`, `BreadcrumbList` on
  subpages, and `FAQPage` on the home page.

Each route is written twice — `bus.html` and `bus/index.html` — because hosts disagree about
how they resolve an extensionless path. Netlify and Cloudflare serve the first, GitHub Pages
and S3-style hosts the second, so the canonical URL resolves on all of them.

`scripts/prerender.mjs` also emits `sitemap.xml`, `robots.txt` and `llms.txt` (the
[llmstxt.org](https://llmstxt.org) convention — a markdown summary telling a model what the
site is and where the substance lives). All three are generated from the same data the app
renders, so they cannot drift. Route titles and descriptions live in `src/data/seo.ts`.

Client-side navigation updates title, description and canonical by hand, since the document
never reloads.

## Languages

The guide ships in English (the source), Portuguese, Spanish and German. English keeps the
root URLs; each translation lives under its own prefix — `/pt`, `/es`, `/de` — so every
language is a separate, crawlable set of prerendered pages. The locale comes from the URL
alone, so prerendered HTML and the hydrating client always agree; there is no browser-language
redirect.

- `src/i18n/locales.ts` — the locale list and the path helpers (`localizePath`, `stripLocale`).
- `src/i18n/ui.ts` — strings for the shared chrome: header, footer, language switcher, the
  field explorer and the loop diagram.
- `src/data/seo.ts` — titles and descriptions per route, per language.
- `src/locales/<lang>/pages/` and `src/locales/<lang>/data/` — the translated pages and the
  prose of the data files. Non-prose data (enums, URLs, name lists) is re-exported from
  `src/data/`, so it has one home.
- `src/locales/index.ts` — the registry the router and the prerenderer read.

The prerenderer writes every route in every language, with `<html lang>`, `hreflang`
alternates (plus `x-default` → English), `og:locale`, per-language JSON-LD, and a sitemap that
lists each language version with its siblings.

**Changing content:** edit the English page first, then carry the change into each
`src/locales/<lang>/` copy. The translations mirror the English structure element for element
— same ids, same classes — so a diff of the English file is a checklist for the other three.

## Structure

```
src/
  pages/        one component per route (Home, Concepts, Envelope, Bus, Skills, GetStarted) — English
  locales/      pt/, es/, de/ — translated pages and data prose; index.ts is the registry
  i18n/         locale list, path helpers, shared UI strings, useLocale hooks
  components/   Layout (header/footer/theme), LoopDiagram, FieldExplorer, Bits (shared UI)
  data/         envelope.ts (envelope + warning fields, the seven families), skills.ts (the
                skill library), faq.ts, reading.ts (sources, principles), consortium.ts
                (credits, official URLs, demos), seo.ts
  styles/       site.css — design tokens in :root, dark theme under [data-theme="dark"]
```

Content lives in `src/data/` wherever it is tabular, so the reference tables and the
interactive explorers stay in sync with a single edit.

## Share images

`scripts/make-share-images.py` draws the social cards from the same tokens as the site, on
the light ground that is the site's default, so a WhatsApp or Slack preview matches the page
it links to. Re-run it after any brand change:

```bash
python3 scripts/make-share-images.py
```

It writes `public/og.png` (1200×630, the `og:image`), `public/og-square.png` (1000×1000, for
places that crop to a square), `public/apple-touch-icon.png` (180×180), and the favicons Google
Search picks up — `public/favicon.ico` (16/32/48) and `public/icon-192.png` / `icon-512.png` —
on the solid light ground, since Google wants a square of at least 48px and shows it on both
light and dark result pages.

## Logos

`public/logos/` holds the marks of four of the fourteen champion organisations — AP,
NBCUniversal, ITN and the BBC. All four are the SVG versions published on Wikimedia Commons
and tagged there as public domain (simple shapes / text logos). They are used nominatively and
rendered greyscale in the credit row.

The full roster — 14 champions and 17 participants — lives in `src/data/consortium.ts`,
transcribed from `CONTRIBUTORS.md` in the specification repository.

## Content sources

**storyobjectmodel.com is the source of truth**, together with the repository it links as the
specification, [`storyobjectmodel/som`](https://github.com/storyobjectmodel/som): the seven
schemas under `schema/`, `spec/` (introduction, conformance, compatibility policy, migration from
v0.3.2, open register, version history), `skills/` (som-skill-library 0.2.2), `examples/`,
`GOVERNANCE.md` and `CONTRIBUTORS.md`. The prose here summarises them in its own words; the
specification prose is CC BY 4.0 and the schemas, examples, tools and skills Apache 2.0.

The site was first written against the pre-1.0 hackathon starter (v0.3.2). It was rewritten
for SOM 1.0: the central executor, staging/approval topics and built-in rule types described
then are not part of the standard and have been removed.

The secondary articles in the "Further reading" section are listed in `src/data/reading.ts`.

**The published JSON Schemas are the source of truth.** Where this site and a schema disagree,
the schema is right.
