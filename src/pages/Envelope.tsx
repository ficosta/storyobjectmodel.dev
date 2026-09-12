import { Link } from 'react-router-dom';
import FieldExplorer from '../components/FieldExplorer';
import { PageHead, useHashScroll } from '../components/Bits';
import { ENVELOPE_FIELDS, WARNING_FIELDS } from '../data/envelope';

const ENVELOPE_SAMPLES: Record<string, string> = {
  som_version: '"0.3.2"',
  message_id: '"0190a000-…-7000-aaa1"',
  correlation_id: '"0190a000-…-7000-0c14"',
  causation_id: '"0190a000-…-7000-91ff"',
  message_type: '"story.context"',
  timestamp: '"2026-06-12T09:30:00.000000Z"',
  originating_system: '{ "system_id": "enps-lon-01", "system_type": "ncs", … }',
  topic: '"som.story.context"',
  modification_header: '{ "story_version": 7, "modified_by": "ed1" }',
  _actors: '{ "ed1": { "name": "A. Editor", … } }',
  '@context': 'null',
  extensions: '{ "com.nbcu.desk": "news" }',
  payload: '{ … }',
};

const WARNING_SAMPLES: Record<string, string> = {
  warning_id: '"wrn-019536b1-0001"',
  skill_id: '"nbcu/editorial-standards"',
  skill_version: '"0.1.0"',
  story_id: '"story-2026-0612-001"',
  scope: '"story"',
  severity: '"flag"',
  rule_id: '"nbcu-style-001"',
  non_overridable: 'false',
  affected_fields: '["headline"]',
  detail: '"Informal term \'cops\' in headline."',
  blocks: '[]',
  skill_warning_ref: '"wrn-ref-019536b1"',
  instance_ref: '"inst-nbcnews-web-001"',
};

const RENAMES: [string, React.ReactNode][] = [
  ['sources[]', <><code>editorial_source[]</code> — credibility enum <code>TRUSTED</code> | <code>VERIFIED</code> | <code>ENDORSED</code> | <code>UNVERIFIED</code></>],
  ['skills_config.broadcaster', <><code>skills_config.newsroom</code></>],
  ['collaboration.version', <><code>collaboration.editing_version</code></>],
  ['instances[]', <><b>Hard-rejected</b> since v0.3 — links and tellings model distribution instead</>],
  ['ai_enrichments[]', <><b>Hard-rejected</b> since v0.3.2 — generative output that publishes is an <code>assets[]</code> entry with <code>provenance</code>; claims about content are <code>assertions[]</code></>],
];

export default function Envelope() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Reference"
        title="The envelope"
        lede="One wrapper, shared by every message on every topic. It is a closed object: unknown top-level fields fail validation, and the legacy source and signature fields are hard-rejected."
        toc={[
          { href: '#fields', label: 'Fields' },
          { href: '#rules', label: 'Five rules' },
          { href: '#paths', label: 'Field paths' },
          { href: '#warning', label: 'skill.warning.raised' },
          { href: '#renames', label: 'Renames' },
          { href: '#extensions', label: 'Extensions' },
        ]}
      />

      <section id="fields">
        <div className="wrap">
          <p className="eyebrow">Anatomy</p>
          <h2>Every field, one at a time</h2>
          <p className="lede" style={{ marginBottom: 28 }}>
            Click a key to read what it carries and where it trips people up.
          </p>
          <FieldExplorer fields={ENVELOPE_FIELDS} samples={ENVELOPE_SAMPLES} />
        </div>
      </section>

      <section id="rules">
        <div className="wrap">
          <p className="eyebrow">Integration</p>
          <h2>The five rules that bite</h2>
          <p className="lede">
            Nearly every integration problem reported against SOM comes back to one of these.
          </p>

          <div className="grid g2" style={{ marginTop: 26 }}>
            <div className="card">
              <span className="kicker">01</span>
              <h3>
                <code>som_version</code> is informative
              </h3>
              <p className="small mb0">
                It carries the <b>schema pack version</b> the payload conforms to — <code>"0.3.2"</code> today.
                Don’t gate on it, don’t branch on it. <code>message_type</code> is what identifies the payload
                family. Traffic recorded before 12 Aug 2026 reads <code>0.2.0</code>: that was a wire freeze,
                since retired, and readers who took it for the payload shape concluded they were on the wrong
                schema.
              </p>
            </div>
            <div className="card">
              <span className="kicker">02</span>
              <h3>
                <code>correlation_id</code> is required
              </h3>
              <p className="small mb0">
                Thread it end-to-end. A downstream event must be traceable back to the story or action that caused
                it. Skill outputs echo the inbound envelope’s id; republished story versions keep theirs.
              </p>
            </div>
            <div className="card">
              <span className="kicker">03</span>
              <h3>
                <code>timestamp</code> lives on the envelope
              </h3>
              <p className="small mb0">
                Never inside the payload. There is no <code>signature</code> field either — both settled in the
                same design decision.
              </p>
            </div>
            <div className="card">
              <span className="kicker">04</span>
              <h3>
                <code>originating_system</code>, not <code>source</code>
              </h3>
              <p className="small mb0">
                Renamed at v0.3; the old field is hard-rejected. <code>system_id</code> and <code>system_type</code>{' '}
                are required. The newsroom system value is <code>ncs</code> — there is no <code>newsroom</code>{' '}
                value in the enum.
              </p>
            </div>
            <div className="card">
              <span className="kicker">05</span>
              <h3>Message types are suffixed</h3>
              <p className="small mb0">
                On the wire it is <code>skill.warning.raised</code>, not <code>skill.warning</code>;{' '}
                <code>telling.started</code>, not <code>telling</code>. Consumers parse the suffixed form for
                routing.
              </p>
            </div>
            <div className="card">
              <span className="kicker">+</span>
              <h3>Validate before you publish</h3>
              <p className="small mb0">
                The vendored JSON Schemas are the source of truth — not any prose description, including this page.
                Drop your candidate payload next to the shipped examples and run the repo’s validator.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="paths">
        <div className="wrap">
          <p className="eyebrow">Addressing</p>
          <h2>Field paths are relative to the payload</h2>
          <p className="lede">
            Skill rules address fields by dot-notation path. The executor walks the path against the{' '}
            <code>payload</code> object — never the envelope.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Rule config <code>field</code></th>
                  <th>Resolves to</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>headline</code></td><td><code>payload.headline</code> — string</td></tr>
                <tr><td><code>lifecycle.phase</code></td><td><code>payload.lifecycle.phase</code> — string</td></tr>
                <tr><td><code>compliance</code></td><td><code>payload.compliance</code> — array, checked for empty/present</td></tr>
                <tr><td><code>priority.level</code></td><td><code>payload.priority.level</code> — string</td></tr>
                <tr><td><code>premise.premise_changed</code></td><td><code>payload.premise.premise_changed</code> — boolean</td></tr>
                <tr><td><code>assets[].acquisition_state</code></td><td>One array wildcard, supported by <code>field_changed</code> only</td></tr>
              </tbody>
            </table>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              Most rule types check an array field for presence or absence <em>as a whole</em>. The{' '}
              <code>field_changed</code> type additionally supports <b>one</b> <code>[]</code> wildcard, matching
              elements across story versions by their <code>asset_id</code> / <code>source_id</code> /{' '}
              <code>flag_id</code> / <code>id</code>. Anything more selective — “any compliance flag of type X” —
              means a custom rule type in the executor.
            </p>
          </div>
        </div>
      </section>

      <section id="warning">
        <div className="wrap">
          <p className="eyebrow">Payload</p>
          <h2>
            <code>skill.warning.raised</code>
          </h2>
          <p className="lede" style={{ marginBottom: 28 }}>
            The most common outbound payload: an editorial warning raised by a skill against a story, or against
            one surface of it. Twelve normative fields, plus the optional instance binding.
          </p>

          <FieldExplorer fields={WARNING_FIELDS} samples={WARNING_SAMPLES} />

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Severity semantics</span>
              <p className="small">
                <b>hold</b> — the executor must withhold all output on the affected fields until resolved, and
                subscribers must not use held content.
              </p>
              <p className="small">
                <b>flag</b> — mark output as requiring review; a subscriber may show a visual warning.
              </p>
              <p className="small mb0">
                <b>inform</b> — advisory only. No blocking action, no mandatory response.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Instance scoping</span>
              <p className="small">
                A story can air on several surfaces at once. When a warning applies to one of them, set{' '}
                <code>instance_ref</code> to that <code>instance_id</code>. Omit it for story-wide warnings.
              </p>
              <p className="small">
                It is <b>singular</b> on purpose: one warning, one pending row, one approve/reject per surface. Two
                surfaces means two warnings with two ids.
              </p>
              <p className="small mb0 muted">
                A warning referencing an <code>instance_id</code> that doesn’t exist should be rejected by the
                consumer — fail closed.
              </p>
            </div>
          </div>

          <div className="note warn" style={{ marginTop: 22 }}>
            <p className="mb0">
              Instance scoping rides <b>in the payload</b>, never in the topic name. Do not split skill warnings
              across <code>som.skills.staging.&#123;instance&#125;</code>-style topics.
            </p>
          </div>
        </div>
      </section>

      <section id="renames">
        <div className="wrap">
          <p className="eyebrow">Migration</p>
          <h2>Renames that break old configs</h2>
          <p className="lede">
            If a rule config or producer predates the v0.3.x migration, these paths have moved — or gone.
          </p>
          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Old path</th>
                  <th>Now</th>
                </tr>
              </thead>
              <tbody>
                {RENAMES.map(([oldPath, now]) => (
                  <tr key={oldPath}>
                    <td>
                      <code>{oldPath}</code>
                    </td>
                    <td>{now}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="extensions">
        <div className="wrap narrow">
          <p className="eyebrow">Extensions</p>
          <h2>The sanctioned escape hatch</h2>
          <p>
            Anything outside the canonical schema rides under{' '}
            <code>payload.extensions["com.&#123;vendor&#125;.&#123;field&#125;"]</code>, where{' '}
            <code>&#123;vendor&#125;</code> is the reverse-DNS short form of the broadcaster or skill author. The
            namespace prevents collisions and keeps a clean upgrade path: anything promoted into the spec drops its
            prefix.
          </p>
          <pre>{`{
  "warning_id": "wrn-019536b1-0001",
  "skill_id":   "nbcu/editorial-standards",
  "severity":   "flag",
  "detail":     "Informal term 'cops' in headline.",
  "extensions": {
    "com.nbcu.citations": [
      { "source_id": "nbcu-style-guide-2026",
        "quote": "Use 'police' or 'officers'. Avoid 'cops' in headlines." }
    ],
    "com.nbcu.rationale": "Term is on the Standards informal-terms list."
  }
}`}</pre>
          <ul className="clean">
            <li>Consumers that don’t recognise an extension key <b>must ignore it silently</b>.</li>
            <li>
              Vendor-specific <em>enum values</em> follow a different convention: <code>x-</code> plus the lowercase
              token, underscores preserved — <code>x-graphics_pack</code>, never <code>x-GRAPHICS_PACK</code>.
            </li>
            <li>
              The reference implementation uses the hatch itself, for{' '}
              <code>com.ibc-poc.capture_complete</code> on delivery events.
            </li>
          </ul>
          <p className="mb0">
            <Link to="/bus">Next: the topics these messages travel on →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
