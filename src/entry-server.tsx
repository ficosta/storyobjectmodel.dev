import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppRoutes } from './App';

/** Render one route to HTML. Called by scripts/prerender.mjs at build time. */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  );
}

// Re-exported so the prerenderer reads the same data the app does, rather than
// a second copy that can drift.
export { ROUTES, SITE_NAME, SITE_URL } from './data/seo';
export { FAQS } from './data/topics';
export { READING } from './data/reading';
