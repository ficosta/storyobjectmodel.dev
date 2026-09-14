import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Faq } from '../data/faq';

/**
 * Scrolls to the element named by the URL hash once the page has rendered, or
 * to the top when there is no hash. The delay lets fonts and the sticky header
 * settle first — measuring on the same frame lands short.
 */
export function useHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
}

export function PageHead({
  eyebrow,
  title,
  lede,
  toc,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  toc?: { href: string; label: string }[];
}) {
  return (
    <div className="pagehead">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{lede}</p>
        {toc && (
          <div className="toc">
            {toc.map((t) => (
              <a key={t.href} href={t.href}>
                {t.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Accordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="acc">
      {items.map((item, i) => (
        <details
          key={item.q}
          open={open === i}
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) setOpen(i);
            else if (open === i) setOpen(null);
          }}
        >
          <summary>{item.q}</summary>
          <div className="acc-body">
            <p dangerouslySetInnerHTML={{ __html: item.a }} />
          </div>
        </details>
      ))}
    </div>
  );
}

export interface Phase {
  key: string;
  name: string;
  title: string;
  body: React.ReactNode;
}

export function PhaseStepper({ phases }: { phases: Phase[] }) {
  const [active, setActive] = useState(phases[0].key);
  const current = phases.find((p) => p.key === active) ?? phases[0];

  return (
    <div>
      <div className="phases" role="tablist">
        {phases.map((p) => (
          <button
            key={p.key}
            className="phase-btn"
            role="tab"
            aria-selected={p.key === active}
            onClick={() => setActive(p.key)}
          >
            <b>{p.name}</b>
            lifecycle.phase
          </button>
        ))}
      </div>
      <div className="phase-body">
        <h3>{current.title}</h3>
        {current.body}
      </div>
    </div>
  );
}
