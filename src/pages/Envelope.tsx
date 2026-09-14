import { Link } from 'react-router-dom';
import FieldExplorer from '../components/FieldExplorer';
import { PageHead, useHashScroll } from '../components/Bits';
import { ENVELOPE_FIELDS, WARNING_FIELDS } from '../data/envelope';
import { SCHEMA_BASE_URL, repoFile } from '../data/consortium';

const ENVELOPE_SAMPLES: Record<string, string> = {
  som_version: '"1.0.0"',
  message_id: '"0199a1c4-7a2e-7b31-8c55-4d2f9e6a1b07"',
  correlation_id: '"0199a1c4-0000-7000-8000-000000000911"',
  causation_id: '"0199a1c4-7a2e-7b31-8c55-4d2f9e6a1b06"',
  message_type: '"story.context"',
  timestamp: '"2026-09-11T16:41:00.000000Z"',
  originating_system: '{ "system_id": "ncs-nyc-01", "system_type": "ncs", … }',
  topic: '"som.story.context.hurricane-2026-0911"',
  modification_header: '{ "story_version": 7, "modified_by": "producer-7" }',
  _actors: '{ … }',
  '@context': 'null',
  extensions: '{ "com.example.desk": "news" }',
  payload: '{ "story_id": "hurricane-2026-0911", … }',
};

const WARNING_SAMPLES: Record<string, string> = {
  warning_id: '"0190a000-0000-7000-8000-00000000000a"',
  skill_id: '"smart-stories/hold-while-flagged"',
  skill_version: '"0.2.2"',
  story_id: '"story-verdict-0412"',
  scope: '"story:story-verdict-0412"',
  severity: '"hold"',
  rule_id: '"house-reporting-restriction-hold"',
  non_overridable: 'true',
  affected_fields: '["editorial_gates[].status"]',
  detail: '"Held off air. … Clears on a clearance at story scope by legal or above."',
  blocks: '["air:story-verdict-0412"]',
  skill_warning_ref: '"swr-0001"',
  content_type: '"sync.ai.banner"',
  message_type: '"skill.warning.raised"',
};

const RETIRED: [string, React.ReactNode][] = [
  ['source (envelope)', <><code>originating_system</code> — the old field is hard-rejected</>],
  ['signature (envelope)', <>Hard-rejected. There is no signature field.</>],
  ['sources[]', <><code>editorial_source[]</code> — credibility <code>TRUSTED</code> | <code>VERIFIED</code> | <code>ENDORSED</code> | <code>UNVERIFIED</code></>],
  ['skills_config.broadcaster', <><code>skills_config.newsroom</code> (the old key is rejected)</>],
  ['broadcaster_id', <>Hard-rejected. <code>newsroom_id</code> is optional at 1.0, derived from <code>skills_config.newsroom</code> if absent</>],
  ['collaboration.version', <><code>collaboration.editing_version</code></>],
  ['content_ref (singular)', <><code>content_refs[]</code></>],
  ['instances[]', <><b>Hard-rejected.</b> Distribution is modelled by links and tellings</>],
  ['instance_ref (warning)', <><b>Hard-rejected.</b> Outputs scope through <code>scope</code>: <code>link:</code>, <code>asset:</code> or <code>story:</code></>],
  ['ai_enrichments[]', <><b>Hard-rejected</b> since v0.3.2. Generative output that publishes is an <code>assets[]</code> entry with <code>provenance</code>; claims about content are <code>assertions[]</code></>],
  ['media_refs[].flow_id', <><code>source</code> (<code>tams://store/id</code>) + <code>time_range</code>, or a <code>locator</code></>],
  ['editorial_gates[].blocks as strings', <>Deprecated. Use <code>&#123; "kind": "ASSET" | "PHASE", "ref": … &#125;</code></>],
];

const WITHDRAWN: [string, string][] = [
  ['assets[].voice_count', 'An optional integer carrying an editorial classification rule that was never settled.'],
  ['assets[].status → FINALIZING', 'An enum member proposed for a derived output still finishing; never ratified.'],
  ['transforms[].transform_id', 'An optional stable audit handle for a single transform; still under discussion.'],
];

export default function Envelope() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Reference · SOM 1.0"
        title="The envelope"
        lede="One wrapper, shared by every message in every family. It is a closed object: unknown top-level fields fail validation, and the legacy source and signature fields are rejected outright."
        toc={[
          { href: '#fields', label: 'Fields' },
          { href: '#rules', label: 'Conformance rules' },
          { href: '#warning', label: 'skill.warning.raised' },
          { href: '#migration', label: 'From v0.3.2' },
          { href: '#retired', label: 'Renamed & retired' },
          { href: '#extensions', label: 'Extensions' },
        ]}
      />

      <section id="fields">
        <div className="wrap">
          <p className="eyebrow">Anatomy</p>
          <h2>Every field, one at a time</h2>
          <p className="lede" style={{ marginBottom: 28 }}>
            Click a key to read what it carries and where it trips people up. Sample values follow beat 6 of the
            specification’s worked hurricane run.
          </p>
          <FieldExplorer fields={ENVELOPE_FIELDS} samples={ENVELOPE_SAMPLES} />
          <p className="small muted" style={{ marginTop: 16 }}>
            Schema:{' '}
            <a href={`${SCHEMA_BASE_URL}/envelope.schema.json`} target="_blank" rel="noreferrer">
              <code className="url">{`${SCHEMA_BASE_URL}/envelope.schema.json`}</code> ↗
            </a>
          </p>
        </div>
      </section>

      <section id="rules">
        <div className="wrap">
          <p className="eyebrow">Conformance</p>
          <h2>The floor is lower than you think</h2>
          <p className="lede">
            A system is SOM 1.0 conformant if every message it publishes is a valid envelope, every payload validates
            against the schema for its declared <code>message_type</code>, and it ignores what it doesn’t recognise.
            A planning system that only publishes <code>story.context</code> and only reads warnings is fully
            conformant.
          </p>

          <div className="grid g2" style={{ marginTop: 26 }}>
            <div className="card">
              <span className="kicker">01</span>
              <h3>
                Emit <code>"1.0.0"</code>, never branch on it
              </h3>
              <p className="small mb0">
                Producers emit the pack version they conform to; a future 1.1 producer emits <code>"1.1.0"</code>.
                Consumers must not switch behaviour on <code>som_version</code> — that breaks at 1.1 by definition. And{' '}
                <code>"0.3.2"</code> is not SOM 1.0: the schema leaves the field open, so a conformant consumer has to
                apply this rule itself.
              </p>
            </div>
            <div className="card">
              <span className="kicker">02</span>
              <h3>
                <code>message_type</code> is the only discriminator
              </h3>
              <p className="small mb0">
                Select the payload schema from it. Not from the topic, a filename, the publisher’s identity or the
                shape of the payload.
              </p>
            </div>
            <div className="card">
              <span className="kicker">03</span>
              <h3>
                Assert <code>format</code>
              </h3>
              <p className="small mb0">
                JSON Schema treats <code>format</code> as an annotation, so most validators accept{' '}
                <code>"message_id": "NOT-A-UUID"</code> with zero errors. Conformance requires assertion for{' '}
                <code>uuid</code> and <code>date-time</code> — in Node, <code>ajv/dist/2020</code> plus{' '}
                <code>ajv-formats</code>; in Python, a <code>format_checker</code> and <code>rfc3339-validator</code>.
              </p>
            </div>
            <div className="card">
              <span className="kicker">04</span>
              <h3>Ignore what you don’t recognise</h3>
              <p className="small mb0">
                Unknown <code>extensions</code> keys are ignored, never grounds for rejection. A{' '}
                <code>message_type</code> you don’t handle is ignored too — which is what lets 1.x add families without
                breaking anyone.
              </p>
            </div>
            <div className="card">
              <span className="kicker">05</span>
              <h3>
                <code>correlation_id</code> and <code>topic</code> are required
              </h3>
              <p className="small mb0">
                <code>correlation_id</code> links every message about one story lifecycle. <code>topic</code> must begin{' '}
                <code>som.</code> — beyond that, topic layout is yours.
              </p>
            </div>
            <div className="card">
              <span className="kicker">+</span>
              <h3>Say what you produce and consume</h3>
              <p className="small mb0">
                Implementations should state which families they publish and which they read. That statement, not the
                size of the implementation, is what an integrator needs.{' '}
                <a href={repoFile('spec/conformance.md')} target="_blank" rel="noreferrer">
                  spec/conformance.md ↗
                </a>
              </p>
            </div>
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
            What a skill declared about a story, put on the bus by the executor in the tool that recalled it. Twelve
            required fields, a closed object, and two fields explicitly forbidden.
          </p>

          <FieldExplorer fields={WARNING_FIELDS} samples={WARNING_SAMPLES} />

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Scope is the firing level</span>
              <p className="small">
                <code>link:&#123;link_id&#125;</code> for a destination-specific skill, <code>asset:&#123;asset_id&#125;</code>{' '}
                for one asset, <code>story:&#123;story_id&#125;</code> for the whole story.
              </p>
              <p className="small mb0">
                A clearance only counts at the scope the hold was declared at: a <code>link</code> clearance never lifts
                a <code>story</code> hold.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Timestamps live on the envelope</span>
              <p className="small mb0">
                The warning payload rejects both <code>timestamp</code> and the retired <code>instance_ref</code>. When
                the warning was raised is the envelope’s <code>timestamp</code>; what caused it is the envelope’s{' '}
                <code>causation_id</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="migration">
        <div className="wrap">
          <p className="eyebrow">Migration</p>
          <h2>Coming from v0.3.2</h2>
          <p className="lede">
            1.0 is a clean break, and a small one: stop emitting three withdrawn fields, emit{' '}
            <code>som_version: "1.0.0"</code>, and turn on format assertion. Every other field, type, enum and
            constraint is unchanged.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Withdrawn at 1.0</th>
                  <th>What it was</th>
                </tr>
              </thead>
              <tbody>
                {WITHDRAWN.map(([field, why]) => (
                  <tr key={field}>
                    <td>
                      <code>{field}</code>
                    </td>
                    <td className="small">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid g2" style={{ marginTop: 22, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Identifiers moved</span>
              <p className="small mb0">
                Every schema <code>$id</code> is now a resolvable URL that serves the file, such as{' '}
                <code className="url">{`${SCHEMA_BASE_URL}/story-context.schema.json`}</code>, stable for the life of 1.x. The old{' '}
                <code>som.spec/schema/v0.3…</code> identifiers were never resolvable.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Layout is flat</span>
              <p className="small mb0">
                The three version directories are gone: one file per family, no version in the filename. Anything that
                dispatched on <code>"v0.3.2"</code> in a schema path must select on the family instead.{' '}
                <code>authenticity_credential</code>, proposed in v0.3.2, ships in 1.0 as normative.
              </p>
            </div>
          </div>

          <p className="small muted" style={{ marginTop: 18 }}>
            <a href={repoFile('spec/migration-from-v0.3.2.md')} target="_blank" rel="noreferrer">
              spec/migration-from-v0.3.2.md ↗
            </a>{' '}
            ·{' '}
            <a href={repoFile('spec/compatibility-policy.md')} target="_blank" rel="noreferrer">
              spec/compatibility-policy.md ↗
            </a>
          </p>
        </div>
      </section>

      <section id="retired">
        <div className="wrap">
          <p className="eyebrow">Renamed &amp; retired</p>
          <h2>Old paths that no longer validate</h2>
          <p className="lede">
            If a producer or configuration predates the v0.3 envelope lock, these have moved — or are rejected by the
            1.0 schemas.
          </p>
          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Old</th>
                  <th>Now</th>
                </tr>
              </thead>
              <tbody>
                {RETIRED.map(([oldPath, now]) => (
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
          <h2>The defined place for what the standard doesn’t carry</h2>
          <p>
            Envelope, story and every event family accept an <code>extensions</code> object whose keys must match{' '}
            <code>com.&#123;vendor&#125;.</code> — anything else fails validation. Consumers ignore keys they don’t
            recognise.
          </p>
          <pre>{`{
  "warning_id":  "0190a000-0000-7000-8000-00000000000a",
  "skill_id":    "nbcu/editorial-standards",
  "scope":       "link:l1",
  "severity":    "flag",
  "detail":      "Informal term 'cops' in headline.",
  "extensions": {
    "com.nbcu.rationale": "Style guide proscribes informal register in headlines."
  }
}`}</pre>
          <ul className="clean">
            <li>
              Vendor <em>enum values</em> use a different convention: <code>x-</code> plus a lowercase token —{' '}
              <code>x-graphics_pack</code>. It applies to the governed-but-extensible registries such as{' '}
              <code>asset_type</code>, <code>source_type</code> and <code>transform_type</code>.
            </li>
            <li>
              Tags have their own vendor scheme: <code>com.&#123;vendor&#125;.&#123;name&#125;</code> alongside{' '}
              <code>newsroom</code> and <code>iptc-mediatopic</code>.
            </li>
          </ul>
          <p className="mb0">
            <Link to="/bus">Next: the seven families these messages belong to →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
