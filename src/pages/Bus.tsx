import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../components/Bits';
import { STATUS_LABEL, TOPICS } from '../data/topics';
import type { TopicLayer } from '../data/topics';

type Filter = 'all' | TopicLayer;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All topics' },
  { key: 'core', label: 'Core skill loop' },
  { key: 'distribution', label: 'Distribution layer' },
];

const STATUS_CLASS: Record<string, string> = {
  live: 'live',
  mock: 'mock',
  planned: 'soon',
};

export default function Bus() {
  useHashScroll();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const rows = useMemo(
    () =>
      TOPICS.filter((t) => filter === 'all' || t.layer === filter).filter((t) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (t.name + t.messageTypes.join(' ') + t.purpose + t.producer + t.consumer).toLowerCase().includes(q);
      }),
    [filter, query],
  );

  return (
    <>
      <PageHead
        eyebrow="Reference"
        title="The bus"
        lede="Nine topic families. Five carry the core skill loop; four carry the distribution layer — media arrivals, asset-to-destination links, on-air state, and the governance trail."
        toc={[
          { href: '#topics', label: 'Topic reference' },
          { href: '#delivery', label: 'The TAMS junction' },
          { href: '#linktelling', label: 'Links & tellings' },
          { href: '#safestate', label: 'Audit & safe-state' },
          { href: '#roles', label: 'What to implement' },
        ]}
      />

      <section id="topics">
        <div className="wrap">
          <p className="eyebrow">Topic reference</p>
          <h2>Everything on the wire</h2>
          <p className="lede">
            Topic names carry the <code>som.</code> prefix. Status reflects the reference implementation — the
            contract is stable regardless, so integrate against the schema.
          </p>

          <div
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', margin: '24px 0 16px' }}
          >
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className="phase-btn"
                style={{ flex: '0 0 auto' }}
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter…"
              aria-label="Filter topics"
              style={{
                flex: '1 1 160px',
                background: 'var(--bg-2)',
                border: '1px solid var(--line)',
                borderRadius: 9,
                color: 'var(--fg)',
                padding: '11px 14px',
                fontFamily: 'var(--mono)',
                fontSize: '.82rem',
              }}
            />
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Message types</th>
                  <th>Producer → consumer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.name}>
                    <td>
                      <code>{t.name}</code>
                      <div className="small muted" style={{ marginTop: 4 }}>
                        {t.purpose}
                      </div>
                    </td>
                    <td>
                      {t.messageTypes.map((m) => (
                        <div key={m}>
                          <code>{m}</code>
                        </div>
                      ))}
                    </td>
                    <td className="small">
                      {t.producer}
                      <br />
                      <span className="muted">→ {t.consumer}</span>
                    </td>
                    <td>
                      <span className={`tag ${STATUS_CLASS[t.status]}`}>{STATUS_LABEL[t.status]}</span>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="muted small">
                      No topics match that filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="delivery">
        <div className="wrap">
          <p className="eyebrow">Distribution layer</p>
          <h2>The TAMS junction</h2>
          <p className="lede">
            <code>som.delivery.media_available</code> announces that media has arrived in — or is growing inside —
            a store. That is all it does. SOM never queries the MAM and never moves bytes.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div>
              <pre>{`{
  "message_type": "delivery.media_available",
  "delivery_id":  "0190a000-0000-7000-8000-00000000aaa1",
  "asset_id":     "a2",
  "source":       "tams://tams-gcp-store/9f2e7c1a",
  "time_range":   "[0:0_134:0)",
  "arrived_in":   "tams-gcp-store",
  "arrived_at":   "2026-06-12T09:30:00Z"
}`}</pre>
              <ul className="clean">
                <li>
                  <code>source</code> must be a fully-qualified TAMS Source URI, and it resolves to the same Source
                  the asset references in <code>assets[].media_refs[].source</code>.
                </li>
                <li>
                  <code>time_range</code> is a TAMS timerange: bracketed <code>seconds:nanoseconds</code> bounds.
                  Open-ended start or end is permitted — a feed still recording is addressable as{' '}
                  <code>[0:0_)</code>.
                </li>
                <li>
                  There is deliberately <b>no <code>story_id</code></b>. You resolve <code>asset_id → Asset →
                  Story</code> from <code>story.context</code>.
                </li>
              </ul>
            </div>
            <div className="card">
              <span className="kicker">How a consumer reacts</span>
              <table style={{ minWidth: 0, fontSize: '.85rem' }}>
                <tbody>
                  <tr>
                    <td>
                      <b>Known asset, rolling range</b>
                    </td>
                    <td>Noted. No story change — consumers take what exists so far.</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capture complete</b>
                    </td>
                    <td>
                      Story republished: the asset flips <code>CAPTURING → CAPTURED</code> and the range is
                      bounded. Skills re-run against the new snapshot.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Matches no story</b>
                    </td>
                    <td>
                      Safe-state stop: a <code>WITHHELD</code> record on <code>som.system.audit</code>. A story is
                      never created by default.
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="small muted" style={{ marginTop: 14, marginBottom: 0 }}>
                “Capture finished” isn’t a first-class delivery field, so the reference implementation carries it
                exactly the way partners are told to carry their own unratified concepts:{' '}
                <code>extensions: &#123; "com.ibc-poc.capture_complete": true &#125;</code>.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 24 }}>
            <p className="mb0">
              <b>Cold consumers.</b> A consumer that joins late and has no cached story has three options, in
              preference order: replay <code>som.story.context</code> from the earliest retained offset and keep
              the latest version per story; hold the arrival briefly, since stories republish in full on every
              change and the next version is rarely far away; or after a bounded wait, treat it as unmatched and
              record the non-action. There is no story query API — resolution is stream-first by design.
            </p>
          </div>

          <div className="note warn" style={{ marginTop: 16 }}>
            <p className="mb0">
              <b>Not a carrier for a livestream URL.</b> A public stream you want to transcribe is a <i>live ingest
              source</i>, not arrived TAMS media. Carry an ingest URL as a vendor extension instead — and remember
              the delivery event carries no credentials and no bytes. Retrieval is a store concern below the SOM
              boundary.
            </p>
          </div>
        </div>
      </section>

      <section id="linktelling">
        <div className="wrap">
          <p className="eyebrow">Distribution layer</p>
          <h2>Links and Tellings</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">som.link.*</span>
              <h3>Asset ↔ Destination</h3>
              <p className="small">
                A <b>link</b> is the commitment between an asset and a destination. The story’s{' '}
                <code>assets[].usage[]</code> is maintained <em>only</em> from these events, under idempotent-upsert
                rules: committed-only, fail-closed.
              </p>
              <p className="small mb0">
                <code>compliance_gate_status</code> is <b>per destination</b>. The same asset can be{' '}
                <code>CLEARED</code> on a digital link and <code>BLOCKED</code> on a broadcast link at the same
                time — which is exactly how compliance actually works, and why gate state does not live on the
                asset.
              </p>
            </div>
            <div className="card">
              <span className="kicker">som.telling.*</span>
              <h3>On-air exposure</h3>
              <p className="small">
                A <b>telling</b> is an exposure event: <code>started</code>, <code>ended</code>,{' '}
                <code>exposed</code>. On-air state is <em>derived</em> from the telling stream and never stored on
                the asset.
              </p>
              <p className="small mb0">
                The reason is the same one that drives links: one asset can be on air in several places at once,
                so “is it on air?” is only answerable per destination, from events.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="safestate">
        <div className="wrap narrow">
          <p className="eyebrow">Governance</p>
          <h2>
            <code>som.system.audit</code> — the trail
          </h2>
          <p>
            One topic, two vocabularies of outcome. <code>CLEARED</code> records a positive decision;{' '}
            <code>WITHHELD</code> records a non-action — whether it came from a person rejecting a warning or from
            a machine declining to guess.
          </p>
          <ul className="clean">
            <li>
              <b>Human gate decisions.</b> Approve → <code>CLEARED</code>. Reject → <code>WITHHELD</code>, with the
              reviewer stamped into <code>payload.extensions</code>.
            </li>
            <li>
              <b>Coordinator non-actions.</b> A media arrival matching no story → <code>WITHHELD</code>. Nothing is
              created; nothing is silently dropped.
            </li>
          </ul>
          <p className="mb0">
            That symmetry is the point. An automated newsroom in which refusal is invisible is indistinguishable
            from one that is broken.
          </p>
        </div>
      </section>

      <section id="roles">
        <div className="wrap">
          <p className="eyebrow">Integrating</p>
          <h2>What you implement, by role</h2>
          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>You are…</th>
                  <th>Consume</th>
                  <th>Produce</th>
                  <th>Watch out for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>NRCS / story source</b>
                  </td>
                  <td>—</td>
                  <td>
                    <code>story.context</code> on <code>som.story.context</code>
                  </td>
                  <td className="small">
                    Keep <code>story_id</code> stable, bump <code>sequence_number</code> per change, fresh{' '}
                    <code>message_id</code>/<code>timestamp</code> per publish, same <code>correlation_id</code> for
                    the story’s lifecycle.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Skill vendor (external executor)</b>
                  </td>
                  <td>
                    <code>som.story.context</code>
                  </td>
                  <td>
                    <code>skill.warning.raised</code> on <code>som.skills.staging</code>, plus{' '}
                    <code>skill.run.completed</code>
                  </td>
                  <td className="small">
                    The approval gate reads staging regardless of which language produced the output. Never publish
                    to the production topic yourself.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>MAM / media store</b>
                  </td>
                  <td>—</td>
                  <td>
                    <code>delivery.media_available</code>
                  </td>
                  <td className="small">
                    Source URIs, not Flow ids. Emit repeatedly with a growing <code>time_range</code> while a
                    recording is still being captured.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Media-hungry tool</b>
                    <br />
                    <span className="muted small">transcription, ML</span>
                  </td>
                  <td>
                    <code>som.story.context</code> +{' '}
                    <code>som.delivery.media_available</code>
                  </td>
                  <td>Your outputs, via staging or your own topic</td>
                  <td className="small">
                    The delivery event tells you <em>when</em> the essence is reachable and <em>where</em>. It does
                    not hand you bytes.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 24 }}>
            <Link to="/skills">Next: how a skill is written →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
