import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { getBundle, loadBundle } from './locales';
import { localizePath } from './i18n/locales';
import { useLocale } from './i18n/useLocale';
import type { LocaleBundle, PageSet } from './locales/types';

/** English path → the page that renders it, in any language. */
const PAGE_FOR_PATH: [string, keyof PageSet][] = [
  ['/', 'Home'],
  ['/concepts', 'Concepts'],
  ['/envelope', 'Envelope'],
  ['/bus', 'Bus'],
  ['/skills', 'Skills'],
  ['/get-started', 'GetStarted'],
];

/** The current language's bundle. main.tsx loads it before hydrating, so this
 *  is normally synchronous; the effect only covers a client-side hop into a
 *  language that has not been fetched yet. */
function useBundle(): LocaleBundle | undefined {
  const locale = useLocale();
  const [, setTick] = useState(0);
  const bundle = getBundle(locale);

  useEffect(() => {
    if (bundle) return;
    let alive = true;
    loadBundle(locale).then(
      () => alive && setTick((t) => t + 1),
      () => window.location.reload(),
    );
    return () => {
      alive = false;
    };
  }, [locale, bundle]);

  return bundle;
}

/** The route table, shared by the browser entry and the prerenderer. Only the
 *  current language's routes are mounted; the URL prefix picks the language. */
export function AppRoutes() {
  const locale = useLocale();
  const bundle = useBundle();

  return (
    <Layout>
      {bundle && (
        <Routes>
          {PAGE_FOR_PATH.map(([path, page]) => {
            const Page = bundle.pages[page];
            return <Route key={path} path={localizePath(path, locale)} element={<Page />} />;
          })}
          <Route path="*" element={<bundle.pages.NotFound />} />
        </Routes>
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
