import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Static hosts that know nothing about client-side routing serve 404.html for
 * an unknown path. Shipping a copy of the shell there makes a hard refresh on
 * /concepts work on GitHub Pages without a server rewrite rule.
 */
function spaFallback(): Plugin {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const out = resolve(__dirname, 'dist');
      copyFileSync(resolve(out, 'index.html'), resolve(out, '404.html'));
    },
  };
}

export default defineConfig({
  plugins: [react(), spaFallback()],
  build: { outDir: 'dist' },
});
