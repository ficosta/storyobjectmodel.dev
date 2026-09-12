import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/site.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root container #root not found');

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Every route ships as prerendered HTML, so the usual path is hydration.
// createRoot is the fallback for a shell that was served empty.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
