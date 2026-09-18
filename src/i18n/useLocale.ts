import { useLocation } from 'react-router-dom';
import { localeFromPath, localizePath, type Locale } from './locales';
import { UI, type UiStrings } from './ui';

/** The locale comes from the URL alone, so the prerendered HTML and the
 *  hydrating client always agree on it. */
export function useLocale(): Locale {
  return localeFromPath(useLocation().pathname);
}

/** Shared chrome strings for the current locale. */
export function useUi(): UiStrings {
  return UI[useLocale()];
}

/** Prefixes an English path for the current locale: lp('/concepts') → '/pt/concepts'. */
export function useLocalePath(): (path: string) => string {
  const locale = useLocale();
  return (path) => localizePath(path, locale);
}
