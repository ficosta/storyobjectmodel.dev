import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { metaForPath, SITE_URL } from '../data/seo';
import { Logo } from './Logo';
import { EMULATOR_URL, OFFICIAL_URL, SCHEMA_BASE_URL, SPEC_REPO_URL } from '../data/consortium';
import { LOCALES, LOCALE_INFO, localizePath, stripLocale } from '../i18n/locales';
import { useLocale, useLocalePath, useUi } from '../i18n/useLocale';

const THEME_KEY = 'som-theme';

function readTheme(): 'dark' | 'light' {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function ThemeToggle() {
  const ui = useUi();
  // Starts null so the prerendered HTML and the first client render agree;
  // the stored preference is read once, after mount. The inline script in
  // index.html has already painted the right theme, so nothing flashes.
  const [theme, setTheme] = useState<'dark' | 'light' | null>(null);

  useEffect(() => setTheme(readTheme()), []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* private mode — the in-memory theme still applies */
    }
  }, [theme]);

  const current = theme ?? 'light';

  return (
    <button
      className="icon-btn"
      onClick={() => setTheme(current === 'light' ? 'dark' : 'light')}
      aria-label={current === 'light' ? ui.themeToDark : ui.themeToLight}
    >
      {current === 'light' ? '☾' : '☀'}
    </button>
  );
}

/** Links to the page you are on, in each of the other languages. */
function LangSwitch() {
  const { pathname, hash } = useLocation();
  const locale = useLocale();
  const ui = useUi();
  const bare = stripLocale(pathname);

  return (
    <div className="lang" role="group" aria-label={ui.language}>
      {LOCALES.map((l) => (
        <Link
          key={l.code}
          to={localizePath(bare, l.code) + hash}
          hrefLang={l.htmlLang}
          lang={l.htmlLang}
          title={l.name}
          aria-current={l.code === locale ? 'true' : undefined}
          className={l.code === locale ? 'active' : ''}
        >
          {l.short}
        </Link>
      ))}
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const ui = useUi();
  const lp = useLocalePath();
  const nav = [
    { to: '/concepts', label: ui.nav.concepts },
    { to: '/envelope', label: ui.nav.envelope },
    { to: '/bus', label: ui.nav.messages },
    { to: '/skills', label: ui.nav.skills },
  ];

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site">
      <div className="nav">
        <Link className="brand" to={lp('/')}>
          <Logo size={26} />
          <span>
            storyobjectmodel<span className="tld">.dev</span>
          </span>
        </Link>
        <button className="icon-btn" id="navToggle" aria-label={ui.toggleNav} onClick={() => setOpen((o) => !o)}>
          ☰
        </button>
        <nav className={open ? 'open' : ''}>
          {nav.map((item) => (
            <NavLink key={item.to} to={lp(item.to)} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
          <a href={SPEC_REPO_URL} target="_blank" rel="noreferrer">
            {ui.nav.spec} ↗
          </a>
          <LangSwitch />
          <ThemeToggle />
          <Link className="nav-cta" to={lp('/get-started')}>
            {ui.nav.getStarted}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const ui = useUi();
  const t = ui.footer;
  const lp = useLocalePath();
  return (
    <footer className="site">
      <div className="wrap">
        <div className="cols">
          <div>
            <Link className="brand" to={lp('/')} style={{ marginBottom: 12 }}>
              <Logo size={24} />
              <span>
                storyobjectmodel<span className="tld">.dev</span>
              </span>
            </Link>
            <p className="small muted" style={{ maxWidth: '34ch' }}>
              {t.tagline}
            </p>
          </div>
          <div>
            <h4>{t.learn}</h4>
            <ul>
              <li>
                <Link to={lp('/concepts')}>{ui.nav.concepts}</Link>
              </li>
              <li>
                <Link to={lp('/concepts#lifecycle')}>{t.storyLifecycle}</Link>
              </li>
              <li>
                <Link to={lp('/concepts#glossary')}>{t.glossary}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>{t.reference}</h4>
            <ul>
              <li>
                <Link to={lp('/envelope')}>{ui.nav.envelope}</Link>
              </li>
              <li>
                <Link to={lp('/bus')}>{t.messageFamilies}</Link>
              </li>
              <li>
                <Link to={lp('/skills')}>{ui.nav.skills}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>{t.build}</h4>
            <ul>
              <li>
                <Link to={lp('/get-started')}>{ui.nav.getStarted}</Link>
              </li>
              <li>
                <a href={OFFICIAL_URL} target="_blank" rel="noreferrer">
                  storyobjectmodel.com ↗
                </a>
              </li>
              <li>
                <a href={SPEC_REPO_URL} target="_blank" rel="noreferrer">
                  {t.specification} ↗
                </a>
              </li>
              <li>
                <a href={`${SCHEMA_BASE_URL}/`} target="_blank" rel="noreferrer">
                  {t.schemas} ↗
                </a>
              </li>
              <li>
                <a href={EMULATOR_URL} target="_blank" rel="noreferrer">
                  {t.emulator} ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>
            © {new Date().getFullYear()} {t.legalBefore} <a href={OFFICIAL_URL}>storyobjectmodel.com</a>
            {t.legalAfter}
          </span>
          <span className="craft">
            {t.craftBefore}{' '}
            <a href="https://github.com/ficosta" target="_blank" rel="noreferrer">
              ficosta
            </a>{' '}
            {t.craftAfter}
          </span>
        </div>
      </div>
    </footer>
  );
}

function canonicalUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** Client-side navigation doesn't reload the document, so the head has to be
 *  updated by hand. The prerendered HTML already carries the right tags for a
 *  cold load; this keeps them right once the router takes over. */
function useDocumentMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = metaForPath(pathname);
    document.documentElement.lang = LOCALE_INFO[meta.locale].htmlLang;
    document.title = meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', meta.description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', canonicalUrl(localizePath(meta.path, meta.locale)));
  }, [pathname]);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  useDocumentMeta();
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
