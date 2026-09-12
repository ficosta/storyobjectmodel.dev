import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const THEME_KEY = 'som-theme';

function readTheme(): 'dark' | 'light' {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(readTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* private mode — the in-memory theme still applies */
    }
  }, [theme]);

  return (
    <button
      className="icon-btn"
      onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {theme === 'light' ? '☾' : '☀'}
    </button>
  );
}

const NAV = [
  { to: '/concepts', label: 'Concepts' },
  { to: '/envelope', label: 'Envelope' },
  { to: '/bus', label: 'The bus' },
  { to: '/skills', label: 'Skills' },
  { to: '/get-started', label: 'Get started' },
];

const REPO =
  'https://github.com/google/virtual-broadcast-production-assistant/tree/main/som-hackathon-starter-dotnet';

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site">
      <div className="nav">
        <Link className="brand" to="/">
          <span className="dot" /> Story Object Model
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
          <a href={REPO} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <ThemeToggle />
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
              <span className="dot" /> Story Object Model
            </Link>
            <p className="small muted" style={{ maxWidth: '34ch' }}>
              An open JSON pub/sub standard for sharing story context across the newsroom.
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
                <Link to="/bus">Topics</Link>
              </li>
              <li>
                <Link to="/skills">Skills &amp; rules</Link>
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
                <a href={REPO} target="_blank" rel="noreferrer">
                  Reference impl ↗
                </a>
              </li>
              <li>
                <a href={`${REPO}/schema`} target="_blank" rel="noreferrer">
                  JSON Schemas ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© {new Date().getFullYear()} — an unofficial community guide to the Story Object Model.</span>
          <span>Summarised from the SOM starter docs. The schemas are the source of truth.</span>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
