import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { loadBundle } from './locales';
import { localeFromPath } from './i18n/locales';
import './styles/site.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root container #root not found');

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Load the page's language before hydrating, so the first client render
// matches the prerendered HTML instead of rendering an empty frame.
// If the chunk cannot be fetched, the prerendered HTML stays as it is:
// readable, just not interactive.
loadBundle(localeFromPath(window.location.pathname)).then(
  () => {
    // Every route ships as prerendered HTML, so the usual path is hydration.
    // createRoot is the fallback for a shell that was served empty.
    if (container.hasChildNodes()) {
      hydrateRoot(container, app);
    } else {
      createRoot(container).render(app);
    }
  },
  (err: unknown) => console.error('Could not load this language; showing the static page.', err),
);
