# storyobjectmodel.dev

A visual guide to the **Story Object Model** — the open JSON pub/sub standard for sharing
editorial story context across newsroom systems.

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

## Structure

```
src/
  pages/        one component per route (Home, Concepts, Envelope, Bus, Skills, GetStarted)
  components/   Layout (header/footer/theme), LoopDiagram, FieldExplorer, Bits (shared UI)
  data/         envelope.ts (field docs), topics.ts (topics, rule types, FAQ)
  styles/       site.css — design tokens in :root, light theme under [data-theme="light"]
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
places that crop to a square) and `public/apple-touch-icon.png` (180×180).

## Logos

`public/logos/` holds the marks of the organisations that proposed the standard — AP,
NBCUniversal, ITN and the BBC. All four are the SVG versions published on Wikimedia Commons
and tagged there as public domain (simple shapes / text logos). They are used nominatively,
to identify the bodies behind the specification, and rendered greyscale in the credit row.

The full consortium roster — 14 champions and 16 technology participants — lives in
`src/data/consortium.ts`, transcribed from the IBC Accelerator project page.

## Content sources

Written from the SOM hackathon starter documentation —
[`som-hackathon-starter-dotnet/docs`](https://github.com/google/virtual-broadcast-production-assistant/tree/main/som-hackathon-starter-dotnet/docs)
— covering the envelope reference, message contracts, distribution-layer contracts,
architecture, skill validation and the user guide.

Context on the standard itself — the four ideas it rests on, the Story Agent, the SOM/Skills
boundary, the consortium and the timeline — comes from the project's own public writing, all
of it linked from the "Further reading" section on the home page and listed in
`src/data/reading.ts`: the TVBEurope interviews with Octopus Newsroom and Moments Lab, AP
Workflow Solutions on the coordination problem, the Octopus interview with Milan Varga, the
Trint pre-show piece, and the IBC Accelerator project page.

**The vendored JSON Schemas are the source of truth.** Where this site and a schema disagree,
the schema is right.
