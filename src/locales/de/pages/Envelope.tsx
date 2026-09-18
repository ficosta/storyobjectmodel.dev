import { Link } from 'react-router-dom';
import FieldExplorer from '../../../components/FieldExplorer';
import { PageHead, useHashScroll } from '../../../components/Bits';
import { ENVELOPE_FIELDS, WARNING_FIELDS } from '../data/envelope';
import { SCHEMA_BASE_URL, repoFile } from '../../../data/consortium';

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
  ['source (envelope)', <><code>originating_system</code> — das alte Feld wird hart abgewiesen</>],
  ['signature (envelope)', <>Hart abgewiesen. Ein Feld signature gibt es nicht.</>],
  ['sources[]', <><code>editorial_source[]</code> — Glaubwürdigkeit <code>TRUSTED</code> | <code>VERIFIED</code> | <code>ENDORSED</code> | <code>UNVERIFIED</code></>],
  ['skills_config.broadcaster', <><code>skills_config.newsroom</code> (der alte Schlüssel wird abgewiesen)</>],
  ['broadcaster_id', <>Hart abgewiesen. <code>newsroom_id</code> ist in 1.0 optional und wird, falls es fehlt, aus <code>skills_config.newsroom</code> abgeleitet</>],
  ['collaboration.version', <><code>collaboration.editing_version</code></>],
  ['content_ref (singular)', <><code>content_refs[]</code></>],
  ['instances[]', <><b>Hart abgewiesen.</b> Distribution wird über Links und Tellings modelliert</>],
  ['instance_ref (warning)', <><b>Hart abgewiesen.</b> Ausgaben erhalten ihren Scope über <code>scope</code>: <code>link:</code>, <code>asset:</code> oder <code>story:</code></>],
  ['ai_enrichments[]', <><b>Hart abgewiesen</b> seit v0.3.2. Generierte Ausgabe, die veröffentlicht wird, ist ein Eintrag in <code>assets[]</code> mit <code>provenance</code>; Aussagen über Inhalte sind <code>assertions[]</code></>],
  ['media_refs[].flow_id', <><code>source</code> (<code>tams://store/id</code>) + <code>time_range</code> oder ein <code>locator</code></>],
  ['editorial_gates[].blocks as strings', <>Veraltet. Verwenden Sie <code>&#123; "kind": "ASSET" | "PHASE", "ref": … &#125;</code></>],
];

const WITHDRAWN: [string, string][] = [
  ['assets[].voice_count', 'Ein optionaler Integer für eine redaktionelle Klassifizierungsregel, die nie abschließend geklärt wurde.'],
  ['assets[].status → FINALIZING', 'Ein Enum-Wert, vorgeschlagen für eine abgeleitete Ausgabe, die noch fertiggestellt wird; nie ratifiziert.'],
  ['transforms[].transform_id', 'Ein optionaler, stabiler Audit-Handle für eine einzelne Transformation; noch in Diskussion.'],
];

export default function Envelope() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Referenz · SOM 1.0"
        title="Das Envelope"
        lede="Eine Hülle für alle Nachrichten aller Familien. Sie ist ein geschlossenes Objekt: Unbekannte Felder auf oberster Ebene fallen bei der Validierung durch, und die Altfelder source und signature werden rundweg abgewiesen."
        toc={[
          { href: '#fields', label: 'Felder' },
          { href: '#rules', label: 'Konformitätsregeln' },
          { href: '#warning', label: 'skill.warning.raised' },
          { href: '#migration', label: 'Von v0.3.2' },
          { href: '#retired', label: 'Umbenannt & ausgemustert' },
          { href: '#extensions', label: 'Extensions' },
        ]}
      />

      <section id="fields">
        <div className="wrap">
          <p className="eyebrow">Anatomie</p>
          <h2>Jedes Feld, eins nach dem anderen</h2>
          <p className="lede" style={{ marginBottom: 28 }}>
            Klicken Sie auf einen Schlüssel, um zu lesen, was er trägt und wo man darüber stolpert. Die Beispielwerte
            folgen Beat 6 des durchgerechneten Hurrikan-Beispiels aus der Spezifikation.
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
          <p className="eyebrow">Konformität</p>
          <h2>Die Hürde liegt niedriger, als Sie denken</h2>
          <p className="lede">
            Ein System ist konform mit SOM 1.0, wenn jede Nachricht, die es veröffentlicht, ein gültiges Envelope ist,
            jedes Payload gegen das Schema seines angegebenen <code>message_type</code> validiert und es ignoriert, was
            es nicht kennt. Ein Planungssystem, das nur <code>story.context</code> veröffentlicht und nur Warnungen
            liest, ist vollständig konform.
          </p>

          <div className="grid g2" style={{ marginTop: 26 }}>
            <div className="card">
              <span className="kicker">01</span>
              <h3>
                <code>"1.0.0"</code> senden, nie danach verzweigen
              </h3>
              <p className="small mb0">
                Producer senden die Paketversion, der sie entsprechen; ein künftiger 1.1-Producer sendet{' '}
                <code>"1.1.0"</code>. Consumer dürfen ihr Verhalten nicht an <code>som_version</code> festmachen — das
                bricht per Definition mit 1.1. Und <code>"0.3.2"</code> ist nicht SOM 1.0: Das Schema lässt das Feld
                offen, ein konformer Consumer muss diese Regel also selbst anwenden.
              </p>
            </div>
            <div className="card">
              <span className="kicker">02</span>
              <h3>
                <code>message_type</code> ist der einzige Diskriminator
              </h3>
              <p className="small mb0">
                Wählen Sie das Payload-Schema danach aus. Nicht nach dem Topic, einem Dateinamen, der Identität des
                Publishers oder der Form des Payloads.
              </p>
            </div>
            <div className="card">
              <span className="kicker">03</span>
              <h3>
                <code>format</code> durchsetzen
              </h3>
              <p className="small mb0">
                JSON Schema behandelt <code>format</code> als Annotation, deshalb akzeptieren die meisten Validatoren{' '}
                <code>"message_id": "NOT-A-UUID"</code> ohne einen einzigen Fehler. Konformität verlangt die Assertion
                für <code>uuid</code> und <code>date-time</code> — in Node mit <code>ajv/dist/2020</code> plus{' '}
                <code>ajv-formats</code>; in Python mit einem <code>format_checker</code> und{' '}
                <code>rfc3339-validator</code>.
              </p>
            </div>
            <div className="card">
              <span className="kicker">04</span>
              <h3>Ignorieren, was Sie nicht kennen</h3>
              <p className="small mb0">
                Unbekannte Schlüssel in <code>extensions</code> werden ignoriert, nie als Grund zur Abweisung. Ein{' '}
                <code>message_type</code>, den Sie nicht verarbeiten, wird ebenfalls ignoriert — genau das erlaubt es
                1.x, Familien hinzuzufügen, ohne jemanden zu brechen.
              </p>
            </div>
            <div className="card">
              <span className="kicker">05</span>
              <h3>
                <code>correlation_id</code> und <code>topic</code> sind Pflicht
              </h3>
              <p className="small mb0">
                <code>correlation_id</code> verbindet alle Nachrichten zum Lebenszyklus einer Story. <code>topic</code>{' '}
                muss mit <code>som.</code> beginnen — darüber hinaus ist die Topic-Struktur Ihre Sache.
              </p>
            </div>
            <div className="card">
              <span className="kicker">+</span>
              <h3>Sagen Sie, was Sie produzieren und konsumieren</h3>
              <p className="small mb0">
                Implementierungen sollten angeben, welche Familien sie veröffentlichen und welche sie lesen. Diese
                Angabe, nicht der Umfang der Implementierung, ist das, was ein Integrator braucht.{' '}
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
            Was ein Skill über eine Story deklariert hat, auf den Bus gelegt vom Executor in dem Tool, das ihn per
            Recall geladen hat. Zwölf Pflichtfelder, ein geschlossenes Objekt und zwei ausdrücklich verbotene Felder.
          </p>

          <FieldExplorer fields={WARNING_FIELDS} samples={WARNING_SAMPLES} />

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Scope ist die auslösende Ebene</span>
              <p className="small">
                <code>link:&#123;link_id&#125;</code> für einen zielspezifischen Skill, <code>asset:&#123;asset_id&#125;</code>{' '}
                für ein einzelnes Asset, <code>story:&#123;story_id&#125;</code> für die ganze Story.
              </p>
              <p className="small mb0">
                Eine Freigabe zählt nur auf dem Scope, auf dem der Hold deklariert wurde: Eine <code>link</code>-Freigabe
                hebt nie einen <code>story</code>-Hold auf.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Zeitstempel stehen im Envelope</span>
              <p className="small mb0">
                Das Warnungs-Payload weist sowohl <code>timestamp</code> als auch das ausgemusterte{' '}
                <code>instance_ref</code> ab. Wann die Warnung ausgelöst wurde, sagt der <code>timestamp</code> des
                Envelopes; was sie verursacht hat, dessen <code>causation_id</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="migration">
        <div className="wrap">
          <p className="eyebrow">Migration</p>
          <h2>Umstieg von v0.3.2</h2>
          <p className="lede">
            1.0 ist ein sauberer Bruch, und ein kleiner: Senden Sie drei zurückgezogene Felder nicht mehr, senden Sie{' '}
            <code>som_version: "1.0.0"</code> und schalten Sie die Format-Assertion ein. Alle anderen Felder, Typen,
            Enums und Constraints bleiben unverändert.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Zurückgezogen in 1.0</th>
                  <th>Was es war</th>
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
              <span className="kicker">Identifier sind umgezogen</span>
              <p className="small mb0">
                Jede Schema-<code>$id</code> ist jetzt eine auflösbare URL, die die Datei ausliefert, etwa{' '}
                <code className="url">{`${SCHEMA_BASE_URL}/story-context.schema.json`}</code>, stabil für die gesamte
                Lebensdauer von 1.x. Die alten <code>som.spec/schema/v0.3…</code>-Identifier waren nie auflösbar.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Flache Struktur</span>
              <p className="small mb0">
                Die drei Versionsverzeichnisse sind weg: eine Datei pro Familie, keine Version im Dateinamen. Alles, was
                anhand von <code>"v0.3.2"</code> in einem Schema-Pfad verzweigt hat, muss stattdessen nach der Familie
                auswählen. <code>authenticity_credential</code>, in v0.3.2 vorgeschlagen, ist in 1.0 normativ.
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
          <p className="eyebrow">Umbenannt &amp; ausgemustert</p>
          <h2>Alte Pfade, die nicht mehr validieren</h2>
          <p className="lede">
            Stammt ein Producer oder eine Konfiguration aus der Zeit vor dem Envelope-Lock in v0.3, dann sind diese
            Felder umgezogen — oder werden von den 1.0-Schemas abgewiesen.
          </p>
          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Alt</th>
                  <th>Jetzt</th>
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
          <h2>Der vorgesehene Ort für alles, was der Standard nicht trägt</h2>
          <p>
            Envelope, Story und jede Event-Familie akzeptieren ein <code>extensions</code>-Objekt, dessen Schlüssel auf{' '}
            <code>com.&#123;vendor&#125;.</code> passen müssen — alles andere fällt bei der Validierung durch. Consumer
            ignorieren Schlüssel, die sie nicht kennen.
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
              Für herstellereigene <em>Enum-Werte</em> gilt eine andere Konvention: <code>x-</code> plus ein
              kleingeschriebenes Token — <code>x-graphics_pack</code>. Sie gilt für die geregelten, aber erweiterbaren
              Register wie <code>asset_type</code>, <code>source_type</code> und <code>transform_type</code>.
            </li>
            <li>
              Tags haben ein eigenes Herstellerschema: <code>com.&#123;vendor&#125;.&#123;name&#125;</code> neben{' '}
              <code>newsroom</code> und <code>iptc-mediatopic</code>.
            </li>
          </ul>
          <p className="mb0">
            <Link to="/de/bus">Weiter: die sieben Familien, zu denen diese Nachrichten gehören →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
