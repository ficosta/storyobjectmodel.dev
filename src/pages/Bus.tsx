import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../components/Bits';
import { FAMILIES } from '../data/envelope';
import { SCHEMA_BASE_URL } from '../data/consortium';

export default function Bus() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Reference · SOM 1.0"
        title="The seven message families"
        lede="Everything normative in SOM is seven JSON Schemas: the envelope, the story, and five families for links, tellings, media arrivals, audit and skill warnings. Each is served at a URL that won’t change for the life of 1.x."
        toc={[
          { href: '#families', label: 'The families' },
          { href: '#story', label: 'story.context' },
          { href: '#delivery', label: 'Media arrivals' },
          { href: '#linktelling', label: 'Links & tellings' },
          { href: '#audit', label: 'Audit' },
          { href: '#roles', label: 'What to implement' },
        ]}
      />

      <section id="families">
        <div className="wrap">
          <p className="eyebrow">Schemas</p>
          <h2>Everything on the wire</h2>
          <p className="lede">
            Most families are opt-in: implement the envelope and whichever families you have something to say about.
            Topic names are yours to lay out — the only rule is the <code>som.</code> prefix, and consumers dispatch on{' '}
            <code>message_type</code>, never on the topic.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Family</th>
                  <th>message_type</th>
                  <th>Published by</th>
                  <th>Schema</th>
                </tr>
              </thead>
              <tbody>
                {FAMILIES.map((f) => (
                  <tr key={f.name}>
                    <td>
                      <code>{f.name}</code>
                      <div className="small muted" style={{ marginTop: 4 }}>
                        {f.purpose}
                      </div>
                    </td>
                    <td>
                      {f.messageTypes.map((m) => (
                        <div key={m}>
                          <code>{m}</code>
                        </div>
                      ))}
                    </td>
                    <td className="small">{f.publishedBy}</td>
                    <td className="small">
                      <a href={`${SCHEMA_BASE_URL}/${f.schema}`} target="_blank" rel="noreferrer">
                        <code>{f.schema}</code> ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <pre style={{ marginTop: 22 }}>{`# check one message from the command line
pip install jsonschema rfc3339-validator
curl -sO ${SCHEMA_BASE_URL}/story-context.schema.json`}</pre>
        </div>
      </section>

      <section id="story">
        <div className="wrap">
          <p className="eyebrow">The family you implement first</p>
          <h2>
            <code>story.context</code>
          </h2>
          <p className="lede">
            The complete state of one story at one moment. Required: <code>story_id</code>, <code>slug</code>,{' '}
            <code>headline</code>, <code>story_type</code>, <code>sequence_number</code>, <code>updated_at</code> —
            plus <code>lifecycle</code> when the story is <code>ACTIVE</code>. Everything else is optional, and the
            object is closed.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div>
              <pre>{`{
  "story_id": "hurricane-2026-0911",
  "slug": "HURRICANE-GULF",
  "headline": "Hurricane upgraded to Cat 4 after landfall",
  "story_type": "ACTIVE",
  "lifecycle": { "phase": "BREAKING",
                 "phase_entered_at": "2026-09-11T16:24:00Z" },
  "sequence_number": 4,
  "updated_at": "2026-09-11T16:26:00Z",
  "tags": [
    { "scheme": "iptc-mediatopic", "value": "17000000",
      "label": "weather" },
    { "scheme": "newsroom", "value": "us-desk" }
  ],
  "editorial_source": [ { "source_id": "src-ap-wire",
    "source_type": "WIRE", "provider": "AP",
    "credibility": "TRUSTED", "received_at": "…" } ]
}`}</pre>
            </div>
            <div className="card">
              <span className="kicker">What else a story can carry</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  <code>tags[]</code> — what the story is <em>about</em>. Ordered (the first is primary) and
                  scheme-qualified: <code>newsroom</code>, <code>iptc-mediatopic</code> or{' '}
                  <code>com.&#123;vendor&#125;.&#123;name&#125;</code>.
                </li>
                <li>
                  <code>priority</code>, <code>premise</code> (expected outcome, confidence, whether it changed and
                  which assets that affects), <code>story_meaning</code> (a capped 5W1H kernel).
                </li>
                <li>
                  <code>assets[]</code> with <code>media_refs[]</code>, <code>provenance</code>,{' '}
                  <code>standards_clearance</code>, <code>authenticity_credential</code> and the{' '}
                  <code>usage[]</code> back-index.
                </li>
                <li>
                  <code>assertions[]</code>, <code>compliance[]</code> flags (with an optional <code>media_range</code>{' '}
                  pinning the restricted frames) and <code>editorial_gates[]</code>.
                </li>
                <li>
                  <code>government_approval</code> — a publication gate the executor must not publish past while it
                  blocks.
                </li>
                <li>
                  <code>skills_config</code>, <code>content_refs[]</code>, <code>relations[]</code>,{' '}
                  <code>collaboration</code>, <code>extensions</code>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="delivery">
        <div className="wrap">
          <p className="eyebrow">Media arrivals</p>
          <h2>
            <code>delivery.media_available</code>
          </h2>
          <p className="lede">
            A store announcing that media has arrived. That is all it does: no bytes, no credentials and deliberately
            no <code>story_id</code> — you resolve <code>asset_id → Asset → Story</code> from the story stream.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div>
              <pre>{`// a TAMS store
{
  "message_type": "delivery.media_available",
  "delivery_id":  "0190a000-0000-7000-8000-00000000aaa1",
  "asset_id":     "asset-presser-feed",
  "source":       "tams://tams-gcp-store/9f2e7c1a",
  "time_range":   "[0:0_1260:0)",
  "arrived_in":   "tams-gcp-store",
  "arrived_at":   "2026-09-11T16:30:00Z"
}

// any other store
{
  "message_type": "delivery.media_available",
  "delivery_id":  "0190a000-0000-7000-8000-00000000ccc1",
  "asset_id":     "asset-still-embassy",
  "locator": { "store": "image-mam",
               "ref":   "stills/2026/07/embassy-front-04.jpg" },
  "arrived_in":   "image-mam",
  "arrived_at":   "2026-07-09T15:00:00Z"
}`}</pre>
            </div>
            <div className="card">
              <span className="kicker">The rules</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  One of <code>source</code> or <code>locator</code> is required. A <code>source</code> is a
                  fully-qualified TAMS Source URI, <code>tams://store/id</code> — Sources, never Flows.
                </li>
                <li>
                  <code>time_range</code> is a TAMS timerange: bracketed <code>seconds:nanoseconds</code> bounds, with
                  an open start or end permitted — a feed still recording is <code>[0:0_)</code>.
                </li>
                <li>
                  Against a locator, a range is offset from the stored file’s own zero, never from embedded source
                  timecode.
                </li>
                <li>
                  Binding media to a story happens at the editorial act, never at ingest. A clip that matches no story
                  is held in an <code>ORPHAN</code> shell story until a proposed match is confirmed.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="linktelling">
        <div className="wrap">
          <p className="eyebrow">Distribution</p>
          <h2>Links and tellings</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">som.link.*</span>
              <h3>Asset ↔ destination</h3>
              <p className="small">
                <code>link.committed</code>, <code>link.gate_changed</code>, <code>link.withdrawn</code>. Every event
                carries <code>link_id</code>, <code>asset_id</code>, <code>destination_id</code> and a{' '}
                <code>compliance_gate_status</code> of <code>PENDING</code>, <code>CLEARED</code> or{' '}
                <code>BLOCKED</code>. A commit names who and when; a withdrawal names who, when and why.
              </p>
              <p className="small mb0">
                The gate is <b>per destination</b>, so one asset can be cleared for digital and blocked for broadcast at
                once. The story’s <code>assets[].usage[]</code> is maintained from these events alone — committed-only
                and fail-closed.
              </p>
            </div>
            <div className="card">
              <span className="kicker">som.telling.*</span>
              <h3>Exposure</h3>
              <p className="small">
                <code>telling.started</code> (needs <code>exposure_start</code>, forbids <code>exposure_end</code>),{' '}
                <code>telling.ended</code>, and <code>telling.exposed</code> for an instantaneous exposure carrying
                both. Exposure times are immutable; <code>scheduled_start</code> is mutable and never used to derive
                on-air state.
              </p>
              <p className="small mb0">
                <code>transforms[]</code> records reshapes at the edge — <code>CROP</code>, <code>TRIM</code>,{' '}
                <code>CAPTION_BURN</code> or an <code>x-</code> vendor value — in application order, append-only. A
                transform never lifts a <code>compliance[].media_range</code> hold.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="audit">
        <div className="wrap narrow">
          <p className="eyebrow">Governance</p>
          <h2>
            <code>som.system.audit</code> — the trail
          </h2>
          <pre>{`{
  "audit_id":    "0190e000-0008-7000-8000-0000000000f3",
  "action":      "SUPPRESSED",
  "target":      { "kind": "ASSET", "id": "pkg-acquit" },
  "actor":       { "actor_id": "automation-01", "actor_type": "system" },
  "reason":      "Acquit package suppressed; never linked to air",
  "recorded_at": "2026-06-23T14:30:02.000000Z"
}`}</pre>
          <ul className="clean">
            <li>
              <code>action</code> is one of <code>CLEARED</code>, <code>SUPPRESSED</code>, <code>WITHHELD</code>,{' '}
              <code>OVERRIDDEN</code>; <code>target.kind</code> is <code>LINK</code>, <code>ASSET</code> or{' '}
              <code>TELLING</code>.
            </li>
            <li>
              The actor is an object, never a flat string. A suppression targets the held asset — the branch that never
              airs never gets a link.
            </li>
            <li>
              Distinct from skill execution records. It records governance: clearances, suppressions, withholdings and
              overrides, with who and why.
            </li>
          </ul>
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
                  <th>Publish</th>
                  <th>Read</th>
                  <th>Watch out for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>Story owner</b>
                    <br />
                    <span className="muted small">NCS, planning</span>
                  </td>
                  <td>
                    <code>story.context</code>
                  </td>
                  <td>
                    <code>skill.warning.raised</code>, assertions from others
                  </td>
                  <td className="small">
                    Every field on every snapshot. Immutable <code>story_id</code>, rising <code>sequence_number</code>,
                    re-stamped <code>originating_system</code>.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Tool with an executor</b>
                    <br />
                    <span className="muted small">rundown, MAM, CMS, playout, graphics</span>
                  </td>
                  <td>
                    <code>skill.warning.raised</code>
                  </td>
                  <td>
                    <code>story.context</code>
                  </td>
                  <td className="small">
                    Your tool decides what it withholds. Never edit content to release a hold, and never render a hold
                    as a banner with a “publish anyway” button.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Media store</b>
                    <br />
                    <span className="muted small">TAMS, MAM</span>
                  </td>
                  <td>
                    <code>delivery.media_available</code>
                  </td>
                  <td>—</td>
                  <td className="small">
                    Source URIs, not Flow ids — or a locator. Re-announce with a growing <code>time_range</code> while
                    capture continues.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Committing / exposing system</b>
                    <br />
                    <span className="muted small">CMS, playout, social</span>
                  </td>
                  <td>
                    <code>som.link.*</code>, <code>som.telling.*</code>
                  </td>
                  <td>
                    <code>story.context</code>
                  </td>
                  <td className="small">
                    Gate status per destination. Exposure times are event-stamped and immutable.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Governance actor</b>
                    <br />
                    <span className="muted small">standards, legal, automation</span>
                  </td>
                  <td>
                    <code>som.system.audit</code>
                  </td>
                  <td>everything relevant</td>
                  <td className="small">Actors are objects. Record the reason.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 24 }}>
            <Link to="/skills">Next: how a skill is recalled →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
