import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../../../components/Bits';
import {
  CONTACT_EMAIL,
  DEMOS_URL,
  EMULATOR_URL,
  INVOLVED_FORM_URL,
  SCHEMA_BASE_URL,
  SPEC_REPO_URL,
  repoDir,
  repoFile,
} from '../../../data/consortium';

export default function GetStarted() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Bauen"
        title="Erste Schritte"
        lede="Lesen Sie die kurzen Dokumente, lassen Sie das Konformitätskorpus laufen, validieren Sie Ihre eigene Nachricht mit eingeschalteter Format-Assertion und veröffentlichen Sie sie. Dann wählen Sie eine Stufe und sprechen mit der Arbeitsgruppe."
        toc={[
          { href: '#read', label: 'Zuerst lesen' },
          { href: '#corpus', label: 'Das Korpus ausführen' },
          { href: '#validate', label: 'In TypeScript validieren' },
          { href: '#publish', label: 'Eine Story veröffentlichen' },
          { href: '#tiers', label: 'Integrationsstufen' },
          { href: '#involved', label: 'Mitmachen' },
        ]}
      />

      <section id="read">
        <div className="wrap">
          <p className="eyebrow">Schritt 1</p>
          <h2>Vier Dinge lesen, in dieser Reihenfolge</h2>
          <div className="grid g4" style={{ marginTop: 26 }}>
            <a className="card" href={repoFile('spec/introduction.md')} target="_blank" rel="noreferrer">
              <span className="kicker">01 · für alle</span>
              <h3>Einführung ↗</h3>
              <p className="small mb0">Warum es SOM gibt, die drei Substantive und die sechs Prinzipien.</p>
            </a>
            <a className="card" href={repoFile('spec/conformance.md')} target="_blank" rel="noreferrer">
              <span className="kicker">02 · für Implementierer</span>
              <h3>Konformität ↗</h3>
              <p className="small mb0">Was es heißt, konform mit SOM 1.0 zu sein — kürzer, als Sie erwarten.</p>
            </a>
            <a className="card" href={repoDir('examples/hurricane-run')} target="_blank" rel="noreferrer">
              <span className="kicker">03 · das klarste Bild</span>
              <h3>Das Hurrikan-Beispiel ↗</h3>
              <p className="small mb0">Eine Story, erzählt über sieben Snapshots.</p>
            </a>
            <a className="card" href={`${SCHEMA_BASE_URL}/story-context.schema.json`} target="_blank" rel="noreferrer">
              <span className="kicker">04 · Ihre erste Familie</span>
              <h3>story-context-Schema ↗</h3>
              <p className="small mb0">Die Familie, die Sie mit ziemlicher Sicherheit zuerst implementieren.</p>
            </a>
          </div>
        </div>
      </section>

      <section id="corpus">
        <div className="wrap">
          <p className="eyebrow">Schritt 2</p>
          <h2>Das Konformitätskorpus ausführen</h2>
          <p className="lede">
            Das Repository der Spezifikation liefert durchgerechnete Beispiele, die validieren müssen, zwanzig
            Negativfälle, die abgewiesen werden müssen, und reine Python-Tools, die beides prüfen.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div>
              <pre>{`git clone ${SPEC_REPO_URL}.git
cd som
pip install jsonschema rfc3339-validator

python3 tools/validate.py            # every example is legal
python3 tools/validate_negative.py   # every negative case is rejected
python3 tools/som_lint.py schema     # schemas agree with their own claims
python3 tools/validate_sequence.py examples/hurricane-run
                                     # a story over time holds together`}</pre>
            </div>
            <div className="card">
              <span className="kicker">Vier verschiedene Fragen</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  Ist diese Nachricht gültig? — <code>validate.py</code>
                </li>
                <li>
                  Schränken die Schemas tatsächlich ein? — <code>validate_negative.py</code>. Neunzehn Fälle scheitern an
                  den Schemas; der zwanzigste, <code>som_version: "0.3.2"</code>, scheitert an der Regel zur
                  Wire-Version, die Ihre Implementierung selbst anwenden muss.
                </li>
                <li>
                  Stimmt das Schema mit dem überein, was es über sich selbst sagt? — <code>som_lint.py</code>
                </li>
                <li>
                  Hält eine Folge von Snapshots zusammen? — <code>validate_sequence.py</code>, dort, wo die teuren Bugs
                  wohnen.
                </li>
              </ul>
            </div>
          </div>

          <div className="note warn" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Installieren Sie <code>rfc3339-validator</code>.</b> Ohne ihn akzeptiert Pythons{' '}
              <code>jsonschema</code> stillschweigend einen fehlerhaften <code>timestamp</code>. Das Negativkorpus
              enthält genau diesen Fall, damit die Prüfung laut scheitert, wenn das Paket fehlt.
            </p>
          </div>
        </div>
      </section>

      <section id="validate">
        <div className="wrap">
          <p className="eyebrow">Schritt 3</p>
          <h2>Im eigenen Stack validieren — mit durchgesetzten Formaten</h2>
          <p className="lede">
            Zwei Implementierungen, die sich uneinig sind, ob <code>message_id</code> eine UUID sein muss, sind nicht
            interoperabel. In Node heißt das: der 2020-12-Build von Ajv plus <code>ajv-formats</code>.
          </p>
          <pre style={{ marginTop: 22 }}>{`// npm i ajv ajv-formats
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

const BASE = '${SCHEMA_BASE_URL}';
const FAMILY_SCHEMA: Record<string, string> = {
  'story.context': 'story-context',
  'skill.warning.raised': 'skill-warning',
  'delivery.media_available': 'delivery-media-available',
  'link.committed': 'link-event', 'link.gate_changed': 'link-event', 'link.withdrawn': 'link-event',
  'telling.started': 'telling-event', 'telling.ended': 'telling-event', 'telling.exposed': 'telling-event',
  'system.audit': 'system-audit',
};

const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv); // conformance §4: uuid and date-time MUST be asserted

const load = async (name: string) => (await fetch(\`\${BASE}/\${name}.schema.json\`)).json();

export async function validateMessage(msg: { som_version?: string; message_type?: string; payload?: unknown }) {
  const envelope = ajv.compile(await load('envelope'));
  if (!envelope(msg)) return { ok: false, errors: envelope.errors };

  // §3: 0.3.2 is not SOM 1.0 — and never branch on the version otherwise.
  if (msg.som_version?.startsWith('0.')) return { ok: false, errors: ['pre-1.0 som_version'] };

  // §2 and §5: dispatch on message_type only; ignore families you don't handle.
  const family = FAMILY_SCHEMA[msg.message_type ?? ''];
  if (!family) return { ok: true, ignored: true };

  const payload = ajv.compile(await load(family));
  return payload(msg.payload) ? { ok: true } : { ok: false, errors: payload.errors };
}`}</pre>
          <p className="small muted mb0">
            Zur Veranschaulichung, keine Referenzimplementierung — cachen Sie kompilierte Validatoren, statt pro
            Nachricht nachzuladen. Die Schemas werden unter der URL in ihrer eigenen <code>$id</code> ausgeliefert, die
            Auflösung per Identifier funktioniert also ebenfalls.
          </p>
        </div>
      </section>

      <section id="publish">
        <div className="wrap">
          <p className="eyebrow">Schritt 4</p>
          <h2>Einen konformen Story-Snapshot veröffentlichen</h2>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div>
              <pre>{`{
  "som_version": "1.0.0",
  "message_id": "0199a1c4-7a2e-7b31-8c55-4d2f9e6a1b07",
  "correlation_id": "0199a1c4-0000-7000-8000-000000000911",
  "message_type": "story.context",
  "timestamp": "2026-09-11T16:41:00.000000Z",
  "originating_system": {
    "system_id": "ncs-nyc-01", "system_type": "ncs"
  },
  "topic": "som.story.context.hurricane-2026-0911",
  "payload": {
    "story_id": "hurricane-2026-0911",
    "slug": "HURRICANE-LANDFALL",
    "headline": "Hurricane makes Cat 4 landfall",
    "story_type": "ACTIVE",
    "lifecycle": { "phase": "BREAKING",
                   "phase_entered_at": "2026-09-11T14:00:00Z" },
    "sequence_number": 7,
    "updated_at": "2026-09-11T16:41:00Z"
  }
}`}</pre>
            </div>
            <div className="card">
              <span className="kicker">Checkliste für jeden Snapshot</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  Eine neue UUID als <code>message_id</code> (v7 empfohlen); dieselbe <code>correlation_id</code> für
                  den gesamten Lebenszyklus der Story.
                </li>
                <li>
                  Dieselbe <code>story_id</code>, eine höhere <code>sequence_number</code>, ein späteres{' '}
                  <code>updated_at</code>.
                </li>
                <li>
                  <b>Jedes Feld</b>, auch die, die andere Systeme beigesteuert haben. Weglassen heißt: nicht vorhanden.
                </li>
                <li>
                  <code>lifecycle</code> genau dann vorhanden, wenn <code>story_type</code> gleich <code>ACTIVE</code>{' '}
                  ist.
                </li>
                <li>
                  Ihr eigenes <code>originating_system</code>, bei jeder Veröffentlichung neu gestempelt.
                </li>
                <li>
                  Alles, was der Standard nicht trägt, gehört unter{' '}
                  <code>extensions["com.&#123;vendor&#125;.…"]</code>.
                </li>
              </ul>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Sehen Sie es auf einem laufenden Bus.</b> Der{' '}
              <a href={EMULATOR_URL} target="_blank" rel="noreferrer">
                Emulator ↗
              </a>{' '}
              des Projekts ist ein Dashboard auf einem laufenden Bus, das Sie selbst nutzen können, und die{' '}
              <a href={DEMOS_URL} target="_blank" rel="noreferrer">
                IBC-Demos ↗
              </a>{' '}
              zeigen zwei vollständige Szenarien von Anfang bis Ende. Eine .NET-Referenzimplementierung folgt in einem
              separaten Repository; das Hackathon-Starterkit aus der Zeit vor 1.0 sendet <code>0.3.2</code> und ist
              kein 1.0-Traffic.
            </p>
          </div>
        </div>
      </section>

      <section id="tiers">
        <div className="wrap">
          <p className="eyebrow">Einstieg</p>
          <h2>Nichts über Ihr Produkt muss offengelegt werden</h2>
          <p className="lede">Ein System reicht für den Anfang. Integrationen werden in drei Stufen beschrieben.</p>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <div className="lane-icon">1</div>
              <h3>Abonnieren und veröffentlichen</h3>
              <p className="small mb0">
                Lesen Sie die Story und legen Sie Ihre eigene Familie auf den Bus. Das Projekt schätzt den Aufwand
                auf Tage, nicht Monate.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">2</div>
              <h3>Kontext in beide Richtungen</h3>
              <p className="small mb0">
                Ihr Tool konsumiert strukturierten Kontext und steuert ihn auch bei — Assertions, Herkunft, Links,
                Tellings.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">3</div>
              <h3>Anhand der Story entscheiden</h3>
              <p className="small mb0">
                Ihr Tool handelt eigenständig auf Grundlage dessen, was es liest — über einen Executor, der die Skills
                des Hauses anwendet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="involved">
        <div className="wrap">
          <p className="eyebrow">Mitmachen</p>
          <h2>Die Arbeitsgruppe ist offen</h2>
          <div className="grid g3" style={{ marginTop: 26 }}>
            <a className="card" href={INVOLVED_FORM_URL} target="_blank" rel="noreferrer">
              <h3>Interesse anmelden ↗</h3>
              <p className="small">
                Dagegen entwickeln, Skills schreiben, eine Story-Archaeology-Session durchführen, der Arbeitsgruppe
                beitreten oder die Arbeit einfach verfolgen — das offizielle Formular fragt, wer Sie sind und was Sie
                vorhaben.
              </p>
              <span className="more">Formular auf storyobjectmodel.com →</span>
            </a>
            <a className="card" href={repoFile('GOVERNANCE.md')} target="_blank" rel="noreferrer">
              <h3>Eine Änderung vorschlagen ↗</h3>
              <p className="small">
                Jede Änderung kommt als Pull Request, und jeder darf einen eröffnen. Schema-Änderungen unterliegen der
                Kompatibilitätsrichtlinie; offene Fragen stehen im offenen Register.
              </p>
              <span className="more">GOVERNANCE · CONTRIBUTING →</span>
            </a>
            <a className="card" href={`mailto:${CONTACT_EMAIL}`}>
              <h3>Eine Integration durchsprechen</h3>
              <p className="small">
                Für alles, was das README des Repositorys nicht beantwortet, schreiben Sie an das Projekt.
              </p>
              <span className="more">{CONTACT_EMAIL} →</span>
            </a>
          </div>

          <div className="note" style={{ marginTop: 26 }}>
            <p className="mb0">
              <b>Die Schemas haben recht.</b> Wenn irgendein Text — diese Website eingeschlossen — einem veröffentlichten
              Schema widerspricht, gilt das Schema. <Link to="/de/bus">Die sieben Familien ansehen →</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
