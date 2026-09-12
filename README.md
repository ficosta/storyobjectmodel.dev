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

The build copies `index.html` to `dist/404.html` so client-side routes survive a hard refresh
on GitHub Pages; `public/_redirects` does the same job on Netlify.

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
