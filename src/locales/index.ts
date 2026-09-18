import type { Locale } from '../i18n/locales';
import type { LocaleBundle } from './types';
import { FAQS } from '../data/faq';
import Home from '../pages/Home';
import Concepts from '../pages/Concepts';
import Envelope from '../pages/Envelope';
import Bus from '../pages/Bus';
import Skills from '../pages/Skills';
import GetStarted from '../pages/GetStarted';
import NotFound from '../pages/NotFound';

const en: LocaleBundle = {
  pages: { Home, Concepts, Envelope, Bus, Skills, GetStarted, NotFound },
  faqs: FAQS,
};

/** Translations are split into their own chunks, so a reader downloads only
 *  the language they are reading. English, the source, ships in the main bundle. */
const LOADERS: Record<Exclude<Locale, 'en'>, () => Promise<{ default: LocaleBundle }>> = {
  pt: () => import('./pt'),
  es: () => import('./es'),
  de: () => import('./de'),
};

const loaded: Partial<Record<Locale, LocaleBundle>> = { en };

/** The bundle for a locale if it is already in memory. */
export function getBundle(locale: Locale): LocaleBundle | undefined {
  return loaded[locale];
}

/** Fetches a locale's chunk once; later calls resolve from memory. */
export async function loadBundle(locale: Locale): Promise<LocaleBundle> {
  const cached = loaded[locale];
  if (cached) return cached;
  const bundle = (await LOADERS[locale as Exclude<Locale, 'en'>]()).default;
  loaded[locale] = bundle;
  return bundle;
}

/** The prerenderer imports every language eagerly and registers it here. */
export function registerBundle(locale: Locale, bundle: LocaleBundle): void {
  loaded[locale] = bundle;
}
