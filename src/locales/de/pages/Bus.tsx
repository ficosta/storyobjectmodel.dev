import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../../../components/Bits';
import { FAMILIES } from '../data/envelope';
import { SCHEMA_BASE_URL } from '../../../data/consortium';

export default function Bus() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Referenz · SOM 1.0"
        title="Die sieben Nachrichtenfamilien"
        lede="Alles Normative an SOM sind sieben JSON Schemas: das Envelope, die Story und fünf Familien für Links, Tellings, eintreffende Medien, Audit und Skill-Warnungen. Jedes liegt unter einer URL, die sich während der gesamten Lebensdauer von 1.x nicht ändert."
        toc={[
          { href: '#families', label: 'Die Familien' },
          { href: '#story', label: 'story.context' },
          { href: '#delivery', label: 'Eintreffende Medien' },
          { href: '#linktelling', label: 'Links & Tellings' },
          { href: '#audit', label: 'Audit' },
          { href: '#roles', label: 'Was Sie implementieren' },
        ]}
      />

      <section id="families">
        <div className="wrap">
          <p className="eyebrow">Schemas</p>
          <h2>Alles, was über die Leitung geht</h2>
          <p className="lede">
            Die meisten Familien sind optional: Implementieren Sie das Envelope und die Familien, zu denen Sie etwas zu
            sagen haben. Die Benennung der Topics liegt bei Ihnen — einzige Regel ist das Präfix <code>som.</code>, und
            Consumer verteilen nach <code>message_type</code>, nie nach dem Topic.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Familie</th>
                  <th>message_type</th>
                  <th>Veröffentlicht von</th>
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
          <p className="eyebrow">Die Familie, die Sie zuerst implementieren</p>
          <h2>
            <code>story.context</code>
          </h2>
          <p className="lede">
            Der vollständige Zustand einer Story zu einem Zeitpunkt. Pflicht: <code>story_id</code>, <code>slug</code>,{' '}
            <code>headline</code>, <code>story_type</code>, <code>sequence_number</code>, <code>updated_at</code> —
            dazu <code>lifecycle</code>, wenn die Story <code>ACTIVE</code> ist. Alles andere ist optional, und das
            Objekt ist geschlossen.
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
              <span className="kicker">Was eine Story sonst noch tragen kann</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  <code>tags[]</code> — <em>worum</em> es in der Story geht. Geordnet (das erste ist das primäre) und
                  mit Schema qualifiziert: <code>newsroom</code>, <code>iptc-mediatopic</code> oder{' '}
                  <code>com.&#123;vendor&#125;.&#123;name&#125;</code>.
                </li>
                <li>
                  <code>priority</code>, <code>premise</code> (erwarteter Ausgang, Konfidenz, ob er sich geändert hat
                  und welche Assets das betrifft), <code>story_meaning</code> (ein begrenzter 5W1H-Kern).
                </li>
                <li>
                  <code>assets[]</code> mit <code>media_refs[]</code>, <code>provenance</code>,{' '}
                  <code>standards_clearance</code>, <code>authenticity_credential</code> und dem Rückindex{' '}
                  <code>usage[]</code>.
                </li>
                <li>
                  <code>assertions[]</code>, <code>compliance[]</code>-Flags (mit optionalem <code>media_range</code>,
                  der die eingeschränkten Frames festlegt) und <code>editorial_gates[]</code>.
                </li>
                <li>
                  <code>government_approval</code> — ein Veröffentlichungs-Gate, über das der Executor nicht
                  hinweg veröffentlichen darf, solange es blockiert.
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
          <p className="eyebrow">Eintreffende Medien</p>
          <h2>
            <code>delivery.media_available</code>
          </h2>
          <p className="lede">
            Ein Speicher meldet, dass Medien eingetroffen sind. Mehr tut die Nachricht nicht: keine Bytes, keine
            Zugangsdaten und bewusst keine <code>story_id</code> — Sie lösen <code>asset_id → Asset → Story</code> über
            den Story-Stream auf.
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
              <span className="kicker">Die Regeln</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  Eines von <code>source</code> oder <code>locator</code> ist Pflicht. Eine <code>source</code> ist
                  eine vollqualifizierte TAMS-Source-URI, <code>tams://store/id</code> — Sources, niemals Flows.
                </li>
                <li>
                  <code>time_range</code> ist eine TAMS-Timerange: Grenzen in Klammern als{' '}
                  <code>seconds:nanoseconds</code>, offener Anfang oder offenes Ende erlaubt — ein Feed, der noch
                  aufzeichnet, ist <code>[0:0_)</code>.
                </li>
                <li>
                  Bei einem Locator zählt ein Bereich ab dem eigenen Nullpunkt der gespeicherten Datei, nie ab einem
                  eingebetteten Quell-Timecode.
                </li>
                <li>
                  Medien werden beim redaktionellen Akt an eine Story gebunden, nie beim Ingest. Ein Clip, der zu
                  keiner Story passt, wird in einer <code>ORPHAN</code>-Hüllen-Story gehalten, bis ein vorgeschlagener
                  Treffer bestätigt ist.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="linktelling">
        <div className="wrap">
          <p className="eyebrow">Distribution</p>
          <h2>Links und Tellings</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">som.link.*</span>
              <h3>Asset ↔ Ziel</h3>
              <p className="small">
                <code>link.committed</code>, <code>link.gate_changed</code>, <code>link.withdrawn</code>. Jedes Event
                trägt <code>link_id</code>, <code>asset_id</code>, <code>destination_id</code> und einen{' '}
                <code>compliance_gate_status</code> von <code>PENDING</code>, <code>CLEARED</code> oder{' '}
                <code>BLOCKED</code>. Ein Commit nennt wer und wann; ein Rückzug nennt wer, wann und warum.
              </p>
              <p className="small mb0">
                Das Gate gilt <b>pro Ziel</b>, sodass ein Asset zugleich für Digital freigegeben und für Broadcast
                blockiert sein kann. <code>assets[].usage[]</code> der Story wird allein aus diesen Events gepflegt —
                nur was committet ist, und fail-closed.
              </p>
            </div>
            <div className="card">
              <span className="kicker">som.telling.*</span>
              <h3>Exposure</h3>
              <p className="small">
                <code>telling.started</code> (verlangt <code>exposure_start</code>, verbietet{' '}
                <code>exposure_end</code>), <code>telling.ended</code> und <code>telling.exposed</code> für eine
                augenblickliche Exposure, die beides trägt. Exposure-Zeiten sind unveränderlich;{' '}
                <code>scheduled_start</code> ist veränderlich und wird nie zur Ableitung des On-Air-Zustands genutzt.
              </p>
              <p className="small mb0">
                <code>transforms[]</code> hält Umformungen am Rand fest — <code>CROP</code>, <code>TRIM</code>,{' '}
                <code>CAPTION_BURN</code> oder einen <code>x-</code>-Herstellerwert — in Anwendungsreihenfolge, nur
                anhängend. Eine Transformation hebt nie einen Hold aus <code>compliance[].media_range</code> auf.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="audit">
        <div className="wrap narrow">
          <p className="eyebrow">Governance</p>
          <h2>
            <code>som.system.audit</code> — die Spur
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
              <code>action</code> ist eines von <code>CLEARED</code>, <code>SUPPRESSED</code>, <code>WITHHELD</code>,{' '}
              <code>OVERRIDDEN</code>; <code>target.kind</code> ist <code>LINK</code>, <code>ASSET</code> oder{' '}
              <code>TELLING</code>.
            </li>
            <li>
              Der Akteur ist ein Objekt, nie ein flacher String. Eine Unterdrückung zielt auf das zurückgehaltene Asset
              — der Zweig, der nie gesendet wird, bekommt nie einen Link.
            </li>
            <li>
              Getrennt von den Ausführungsprotokollen der Skills. Es hält Governance fest: Freigaben, Unterdrückungen,
              Zurückhaltungen und Übersteuerungen, mit wer und warum.
            </li>
          </ul>
        </div>
      </section>

      <section id="roles">
        <div className="wrap">
          <p className="eyebrow">Integration</p>
          <h2>Was Sie implementieren, nach Rolle</h2>
          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Sie sind…</th>
                  <th>Veröffentlichen</th>
                  <th>Lesen</th>
                  <th>Achten Sie auf</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>Eigentümer der Story</b>
                    <br />
                    <span className="muted small">NCS, Planung</span>
                  </td>
                  <td>
                    <code>story.context</code>
                  </td>
                  <td>
                    <code>skill.warning.raised</code>, Assertions von anderen
                  </td>
                  <td className="small">
                    Jedes Feld in jedem Snapshot. Unveränderliche <code>story_id</code>, steigende{' '}
                    <code>sequence_number</code>, neu gestempeltes <code>originating_system</code>.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Tool mit Executor</b>
                    <br />
                    <span className="muted small">Rundown, MAM, CMS, Playout, Grafik</span>
                  </td>
                  <td>
                    <code>skill.warning.raised</code>
                  </td>
                  <td>
                    <code>story.context</code>
                  </td>
                  <td className="small">
                    Ihr Tool entscheidet, was es zurückhält. Bearbeiten Sie nie Inhalte, um einen Hold aufzuheben, und
                    stellen Sie einen Hold nie als Banner mit einem Button „trotzdem veröffentlichen“ dar.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Medienspeicher</b>
                    <br />
                    <span className="muted small">TAMS, MAM</span>
                  </td>
                  <td>
                    <code>delivery.media_available</code>
                  </td>
                  <td>—</td>
                  <td className="small">
                    Source-URIs, keine Flow-IDs — oder ein Locator. Melden Sie erneut mit wachsender{' '}
                    <code>time_range</code>, solange die Aufnahme läuft.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Festschreibendes / ausspielendes System</b>
                    <br />
                    <span className="muted small">CMS, Playout, Social</span>
                  </td>
                  <td>
                    <code>som.link.*</code>, <code>som.telling.*</code>
                  </td>
                  <td>
                    <code>story.context</code>
                  </td>
                  <td className="small">
                    Gate-Status pro Ziel. Exposure-Zeiten werden per Event gestempelt und sind unveränderlich.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Governance-Akteur</b>
                    <br />
                    <span className="muted small">Standards, Recht, Automation</span>
                  </td>
                  <td>
                    <code>som.system.audit</code>
                  </td>
                  <td>alles Relevante</td>
                  <td className="small">Akteure sind Objekte. Halten Sie den Grund fest.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 24 }}>
            <Link to="/de/skills">Weiter: wie ein Skill per Recall geladen wird →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
