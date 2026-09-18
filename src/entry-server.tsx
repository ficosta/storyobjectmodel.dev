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
export { ROUTES, routesFor, SITE_NAME, SITE_URL } from './data/seo';
export { READING } from './data/reading';
export { LOCALES, localizePath } from './i18n/locales';

import { getBundle, registerBundle } from './locales';
import pt from './locales/pt';
import es from './locales/es';
import de from './locales/de';
import type { Locale } from './i18n/locales';
import type { Faq } from './data/faq';

// The browser fetches one language at a time; the prerenderer needs them all.
registerBundle('pt', pt);
registerBundle('es', es);
registerBundle('de', de);

export const FAQS_BY_LOCALE: Record<Locale, Faq[]> = {
  en: getBundle('en')!.faqs,
  pt: pt.faqs,
  es: es.faqs,
  de: de.faqs,
};
