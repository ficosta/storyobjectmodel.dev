/**
 * The languages the guide ships in. English lives at the root and keeps every
 * URL it has always had; each translation lives under its own prefix
 * (/pt, /es, /de), so each language is a separate, crawlable set of pages.
 */
export type Locale = 'en' | 'pt' | 'es' | 'de';

export interface LocaleInfo {
  code: Locale;
  /** Value for <html lang> and hreflang. */
  htmlLang: string;
  /** og:locale. */
  ogLocale: string;
  /** Name of the language in that language, for the switcher. */
  name: string;
  /** Short label for the switcher button. */
  short: string;
}

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALES: LocaleInfo[] = [
  { code: 'en', htmlLang: 'en', ogLocale: 'en_GB', name: 'English', short: 'EN' },
  { code: 'pt', htmlLang: 'pt-BR', ogLocale: 'pt_BR', name: 'Português', short: 'PT' },
  { code: 'es', htmlLang: 'es', ogLocale: 'es_ES', name: 'Español', short: 'ES' },
  { code: 'de', htmlLang: 'de', ogLocale: 'de_DE', name: 'Deutsch', short: 'DE' },
];

export const LOCALE_INFO: Record<Locale, LocaleInfo> = Object.fromEntries(
  LOCALES.map((l) => [l.code, l]),
) as Record<Locale, LocaleInfo>;

const PREFIXED = LOCALES.filter((l) => l.code !== DEFAULT_LOCALE).map((l) => l.code);

/** The locale a path belongs to: its first segment, or English. */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/')[1] ?? '';
  return (PREFIXED as string[]).includes(first) ? (first as Locale) : DEFAULT_LOCALE;
}

/** '/pt/concepts' → '/concepts'; '/pt' → '/'. English paths come back as-is. */
export function stripLocale(pathname: string): string {
  const locale = localeFromPath(pathname);
  if (locale === DEFAULT_LOCALE) return pathname || '/';
  const rest = pathname.slice(locale.length + 1);
  return rest === '' ? '/' : rest;
}

/** ('/concepts', 'pt') → '/pt/concepts'; ('/', 'pt') → '/pt'. Keeps any hash. */
export function localizePath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === '/') return `/${locale}`;
  if (path.startsWith('/#')) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}
