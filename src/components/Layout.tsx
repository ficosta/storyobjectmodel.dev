import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { metaForPath } from '../data/seo';
import { Logo } from './Logo';
import { EMULATOR_URL, OFFICIAL_URL, SCHEMA_BASE_URL, SPEC_REPO_URL } from '../data/consortium';

const THEME_KEY = 'som-theme';

function readTheme(): 'dark' | 'light' {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function ThemeToggle() {
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
      aria-label={current === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {current === 'light' ? '☾' : '☀'}
    </button>
  );
}

const NAV = [
  { to: '/concepts', label: 'Concepts' },
  { to: '/envelope', label: 'Envelope' },
  { to: '/bus', label: 'Messages' },
  { to: '/skills', label: 'Skills' },
];

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site">
      <div className="nav">
        <Link className="brand" to="/">
          <Logo size={26} />
          <span>
            storyobjectmodel<span className="tld">.dev</span>
          </span>
        </Link>
        <button className="icon-btn" id="navToggle" aria-label="Toggle navigation" onClick={() => setOpen((o) => !o)}>
          ☰
        </button>
        <nav className={open ? 'open' : ''}>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
          <a href={SPEC_REPO_URL} target="_blank" rel="noreferrer">
            Spec ↗
          </a>
          <ThemeToggle />
          <Link className="nav-cta" to="/get-started">
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="cols">
          <div>
            <Link className="brand" to="/" style={{ marginBottom: 12 }}>
              <Logo size={24} />
              <span>
                storyobjectmodel<span className="tld">.dev</span>
              </span>
            </Link>
            <p className="small muted" style={{ maxWidth: '34ch' }}>
              A visual guide to SOM 1.0, the open standard for story context in content production.
            </p>
          </div>
          <div>
            <h4>Learn</h4>
            <ul>
              <li>
                <Link to="/concepts">Concepts</Link>
              </li>
              <li>
                <Link to="/concepts#lifecycle">Story lifecycle</Link>
              </li>
              <li>
                <Link to="/concepts#glossary">Glossary</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Reference</h4>
            <ul>
              <li>
                <Link to="/envelope">Envelope</Link>
              </li>
              <li>
                <Link to="/bus">Message families</Link>
              </li>
              <li>
                <Link to="/skills">Skills</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Build</h4>
            <ul>
              <li>
                <Link to="/get-started">Get started</Link>
              </li>
              <li>
                <a href={OFFICIAL_URL} target="_blank" rel="noreferrer">
                  storyobjectmodel.com ↗
                </a>
              </li>
              <li>
                <a href={SPEC_REPO_URL} target="_blank" rel="noreferrer">
                  Specification ↗
                </a>
              </li>
              <li>
                <a href={`${SCHEMA_BASE_URL}/`} target="_blank" rel="noreferrer">
                  Schemas 1.0 ↗
                </a>
              </li>
              <li>
                <a href={EMULATOR_URL} target="_blank" rel="noreferrer">
                  Emulator ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>
            © {new Date().getFullYear()} — an unofficial community guide to the Story Object Model. The standard lives
            at <a href={OFFICIAL_URL}>storyobjectmodel.com</a>; its specification prose is CC BY 4.0 and its schemas
            Apache 2.0, and where this guide and a schema disagree, the schema is right.
          </span>
          <span className="craft">
            Crafted with some agents love and{' '}
            <a href="https://github.com/ficosta" target="_blank" rel="noreferrer">
              ficosta
            </a>{' '}
            for the community
          </span>
        </div>
      </div>
    </footer>
  );
}

/** Client-side navigation doesn't reload the document, so the head has to be
 *  updated by hand. The prerendered HTML already carries the right tags for a
 *  cold load; this keeps them right once the router takes over. */
function useDocumentMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = metaForPath(pathname);
    document.title = meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', meta.description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', `https://storyobjectmodel.dev${meta.path === '/' ? '/' : meta.path}`);
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
