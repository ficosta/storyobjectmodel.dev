import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../../../components/Bits';
import { CATEGORY_X, GUARANTEES, LIBRARY, LIBRARY_VERSION } from '../data/skills';
import { AGENTSKILLS_URL, repoDir, repoFile } from '../../../data/consortium';

export default function Skills() {
  useHashScroll();

  const published = LIBRARY.filter((s) => !s.proposed);
  const proposed = LIBRARY.filter((s) => s.proposed);

  return (
    <>
      <PageHead
        eyebrow="Referenz · som-skill-library"
        title="Skills"
        lede="SOM trägt Kontext; Skills tragen Wissen. Ein Skill ist eine Regel, einmal von der Redaktion geschrieben und von jedem Tool lesbar. Er deklariert, was wahr ist — handeln tut allein das Tool, dem der Executor gehört."
        toc={[
          { href: '#model', label: 'Deklarieren, nicht handeln' },
          { href: '#anatomy', label: 'Anatomie' },
          { href: '#library', label: 'Die Bibliothek' },
          { href: '#combine', label: 'Holds kombinieren' },
          { href: '#checks', label: 'Validierung' },
          { href: '#open', label: 'Was offen ist' },
        ]}
      />

      <section id="model">
        <div className="wrap">
          <p className="eyebrow">Das Modell</p>
          <h2>Skills deklarieren. Executors handeln.</h2>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <div className="lane-icon">1</div>
              <h3>Der Skill deklariert</h3>
              <p className="small mb0">
                Eine Skill-Datei nennt eine Bedingung und was wahr ist, wenn sie zutrifft — ein Flag besteht, ein Hold
                greift, eine Anreicherung ist angebracht. Sie führt nie etwas aus, schreibt nie Story-Zustand und
                ändert nie Inhalte.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">2</div>
              <h3>Der Executor lädt per Recall</h3>
              <p className="small mb0">
                Executors leben in den Tools der Hersteller. Jeder gleicht eingehende Nachrichten mit den{' '}
                <b>adverts</b> der Skills ab — dem maschinenlesbaren <code>recall</code>-Block — und veröffentlicht, was
                der Skill deklariert, als <code>skill.warning.raised</code>.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">3</div>
              <h3>Das Tool handelt</h3>
              <p className="small mb0">
                Das MAM lässt ein zurückgehaltenes Asset nicht festschreiben, das Playout verweigert den Take, das CMS
                hält einen Pfad an. Jedes auf seine Weise, und jedes entscheidet selbst. Niemand bekommt einen Befehl.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Offene Form, Hauspolitik.</b> Skills folgen dem offenen Format von{' '}
              <a href={AGENTSKILLS_URL} target="_blank" rel="noreferrer">
                agentskills.io ↗
              </a>
              : eine Markdown-Datei mit YAML-Frontmatter. Die gemeinsame Bibliothek ist generisch; eine
              Redaktion lädt ihre eigenen Werte dagegen. Ihre Richtlinien bleiben Ihre, und eine Redaktion kann SOM 1.0
              vollständig implementieren, ohne die Bibliothek überhaupt zu nutzen.
            </p>
          </div>
        </div>
      </section>

      <section id="anatomy">
        <div className="wrap">
          <p className="eyebrow">Anatomie</p>
          <h2>Eine Datei: Frontmatter für Maschinen, Prosa für Menschen</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <pre>{`---
skill_id: smart-stories/hold-while-flagged
skill_version: ${LIBRARY_VERSION}
som_schema_version: ["1.0.0"]
skill_type: REFERENCE
category: compliance
lifecycle: draft

recall:                      # the advert
  target_system_type: [mam, playout, rundown,
                       cms, compliance_hub]
  conditions:
    - kind: field
      path: editorial_gates[].gate_type
      op: equals
      value: "{{ config.gate_type }}"
    - kind: field
      path: editorial_gates[].status
      op: equals
      value: PENDING
  recall_on: ["story.context", …]
  state_path: editorial_gates[].status

output_messages: ["skill.warning.raised"]
severity_range: [hold]
auto_change_content: false
fail_closed: true
migration_policy: GATED
disclosure_level: L2
depends: []
---
# hold-while-flagged
…what it is, config surface, runtime loop,
 output contract, worked configurations,
 eval set, open items, vendor build notes`}</pre>
            </div>
            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">Identität</span>
                <p className="small mb0">
                  <code>skill_id</code> als <code>publisher/name</code>, eine <code>skill_version</code> nach Semver, die
                  SOM-Schema-Versionen, gegen die er aufgelöst wird, eine <code>category</code> und ein{' '}
                  <code>lifecycle</code>.
                </p>
              </div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">Das advert</span>
                <p className="small mb0">
                  <code>recall</code> nennt, welche Tool-Typen den Skill aufgreifen dürfen, die Bedingungen über
                  Story-Pfade (<code>field</code> und <code>field_change</code>) und welche Nachrichten einen Blick
                  auslösen. Pfade sind literal und werden gegen das veröffentlichte Schema geprüft; Werte können aus der
                  Konfiguration des Hauses per Template befüllt werden.
                </p>
              </div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">Konfigurierte Instanz</span>
                <p className="small mb0">
                  Eine generische Datei, geladen mit den Werten eines Hauses, die eine Bedingung beobachtet. Ein Haus
                  betreibt mehrere aus derselben Datei — eine gerichtliche Einschränkung mit <code>story</code>-Scope,
                  eine unbestätigte Zahl mit <code>link</code>-Scope — und registriert pro konfigurierter Instanz eine
                  advert-Zeile.
                </p>
              </div>
              <div className="card">
                <span className="kicker">Severity</span>
                <p className="small mb0">
                  <code>hold</code> / <code>flag</code> / <code>inform</code>, dauerhaft kleingeschrieben. Ein Skill
                  deklariert in <code>severity_range</code>, welche davon er erzeugen kann.
                </p>
              </div>
            </div>
          </div>

          <div className="table-scroll" style={{ marginTop: 26 }}>
            <table>
              <thead>
                <tr>
                  <th>Garantie</th>
                  <th>Wert</th>
                  <th>Was sie bedeutet</th>
                </tr>
              </thead>
              <tbody>
                {GUARANTEES.map((g) => (
                  <tr key={g.field}>
                    <td>
                      <code>{g.field}</code>
                    </td>
                    <td>
                      <code>{g.value}</code>
                    </td>
                    <td className="small">{g.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="library">
        <div className="wrap">
          <p className="eyebrow">som-skill-library {LIBRARY_VERSION}</p>
          <h2>Zehn Referenz-Skills, einer vorgeschlagen</h2>
          <p className="lede">
            Alle <code>lifecycle: draft</code>, <code>origin: reference</code>, aufgelöst gegen SOM 1.0. Suchen Sie
            Ihren Tool-Typ in der Lookup-Tabelle, lesen Sie die Skills in dieser Zeile und konfigurieren Sie sie für Ihr
            Haus.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Deklariert</th>
                  <th>Kategorie</th>
                  <th>Severity</th>
                  <th>Per Recall geladen von</th>
                </tr>
              </thead>
              <tbody>
                {[...published, ...proposed].map((s) => (
                  <tr key={s.name}>
                    <td>
                      <a href={repoFile(`skills/skills/${s.name}.md`)} target="_blank" rel="noreferrer">
                        <code>{s.name}</code>
                      </a>
                      {s.proposed && (
                        <div style={{ marginTop: 4 }}>
                          <span className="tag soon">vorgeschlagen</span>
                        </div>
                      )}
                    </td>
                    <td className="small" style={{ minWidth: 280 }}>
                      {s.declares}
                    </td>
                    <td className="small">
                      {s.category} <span className="muted">· X={CATEGORY_X[s.category]}</span>
                    </td>
                    <td>
                      {s.severities.map((sev) => (
                        <span key={sev} className={`tag ${sev}`} style={{ marginRight: 4 }}>
                          {sev}
                        </span>
                      ))}
                    </td>
                    <td className="small" style={{ minWidth: 150 }}>
                      {s.targets.map((t) => (
                        <div key={t}>
                          <code>{t}</code>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="small muted" style={{ marginTop: 16 }}>
            <a href={repoFile('skills/docs/LOOKUP-TABLE.md')} target="_blank" rel="noreferrer">
              Lookup-Tabelle ↗
            </a>{' '}
            ·{' '}
            <a href={repoFile('skills/docs/CONVENTIONS.md')} target="_blank" rel="noreferrer">
              Konventionen ↗
            </a>{' '}
            ·{' '}
            <a href={repoDir('skills/skills')} target="_blank" rel="noreferrer">
              Alle Skill-Dateien ↗
            </a>
          </p>
        </div>
      </section>

      <section id="combine">
        <div className="wrap">
          <p className="eyebrow">Wenn Skills aufeinandertreffen</p>
          <h2>Holds verbinden sich per Konjunktion</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Ein einziger Hold heißt: zurückgehalten</span>
              <p className="small">
                Wo mehrere Gates denselben Sachverhalt im selben Telling binden, wird er nur ausgespielt, wenn jedes
                davon es erlaubt. „Das Restriktivste gewinnt“ und „Der Eigentümer der Story hat Vorrang“ wurden am
                29. Juli 2026 formell zurückgezogen.
              </p>
              <p className="small mb0">
                Der Vorrang zwischen zwei Skills, die bei derselben Aktion kollidieren, ist eine eigene Frage, geordnet
                nach <b>X</b> (Kategorie: compliance 1, editorial 2, workflow 3), <b>Y</b> (Herkunft — jeder Skill der
                Bibliothek hat 5) und <b>Z</b>, das allein das veröffentlichende Haus festlegt.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Verkettung über den Bus</span>
              <p className="small">
                Ein Skill, der zugleich einen Zustand deklariert und etwas zurückhält, säße an zwei Positionen
                gleichzeitig. Darum ist „Flag und Hold“ zwei Skills: <code>flag-on-mismatch</code> deklariert das Flag,
                und <code>hold-while-flagged</code> bezieht sich per advert auf den Flag-Zustand — gleich, wer das Flag
                gesetzt hat, ein Skill oder eine Juristin.
              </p>
              <p className="small mb0">
                Deshalb ist <code>depends</code> überall leer: Eine deklarierte Abhängigkeit würde die Richtung umkehren
                und beim ersten Versionswechsel einen Zyklus erzeugen.
              </p>
            </div>
          </div>

          <div className="grid g2" style={{ marginTop: 18, alignItems: 'start' }}>
            <div className="note warn">
              <p className="mb0">
                <b>Fail-closed.</b> Ein unlesbarer Konfigurations- oder Story-Wert gilt so, als ob die Bedingung
                zutrifft, mit der lautesten Severity, die der Skill hat, und <code>detail</code> nennt, was nicht
                gelesen werden konnte. Lässt sich eine Regel nicht auswerten, bleibt die Ausgabe, die sie schützt,
                zurückgehalten, und ein Mensch entscheidet.
              </p>
            </div>
            <div className="note">
              <p className="mb0">
                <b>Was einen Hold nicht aufhebt:</b> verstrichene Zeit, ein Flag, das in einem späteren Snapshot
                einfach fehlt, eine Freigabe auf einem anderen Scope, eine niedrigere Autorität, ein Neustart des
                Executors oder das Aufheben eines anderen Flags. Einen Hold aufzuheben ist nie eine Anweisung, das Asset
                freizugeben.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="checks">
        <div className="wrap">
          <p className="eyebrow">Validierung</p>
          <h2>Die Bibliothek prüft sich selbst</h2>
          <p className="lede">
            Fünf Skripte werden mit der Bibliothek ausgeliefert, und jedes stellt eine andere Frage — auch, ob die
            Dokumente mit den Dateien übereinstimmen, die sie beschreiben.
          </p>
          <pre style={{ marginTop: 22 }}>{`cd som/skills
python3 scripts/validate_som_skill.py skills/<name>.md   # one skill file is legal
python3 scripts/check_library.py skills/                  # the library holds together
python3 scripts/check_paths.py skills/                    # every path resolves against
                                                          #   ../schema/story-context.schema.json
python3 scripts/build_lookup_table.py . --check           # the table matches the adverts
python3 scripts/check_cover_claims.py .                   # the docs match the files`}</pre>
          <p className="small muted">
            Eine Lücke wird benannt statt versteckt: <code>check_paths.py</code> löst nur literale Pfade auf. Ein
            Wert <code>{'{{ config.* }}'}</code> ist unbekannt, bis ein Haus ihn konfiguriert — einen fehlerhaften
            konfigurierten Pfad abzufangen, ist daher Arbeit des Hauses bei der Registrierung.
          </p>
        </div>
      </section>

      <section id="open">
        <div className="wrap narrow">
          <p className="eyebrow">Ehrlich offen</p>
          <h2>Was die Bibliothek nicht zu klären beansprucht</h2>
          <ul className="clean">
            <li>
              <b>Wie Autorität verglichen wird.</b> „Freigegeben durch gleiche oder höhere Autorität auf demselben
              Scope“ ist die Arbeitsposition der Bibliothek; die Rangfolge liefert jedes Haus als{' '}
              <code>authority_scale</code>. Keine Gruppe hat das ratifiziert.
            </li>
            <li>
              <b>Wer eine ausgelöste Warnung in Gate-Zustand überführt.</b> Ein auslösender Skill veröffentlicht nur
              eine Warnung; ein Hold-Skill liest <code>editorial_gates[]</code>. Was das eine ins andere überführt, ist
              noch nicht definiert.
            </li>
            <li>
              <b>Tag-Abgleich mit Schema-Qualifizierung.</b> Skills gleichen <code>tags[].value</code> heute ohne
              Rücksicht auf das Schema ab; ob <code>newsroom:sport</code> statt <code>sport</code> abgeglichen werden
              soll, ist offen.
            </li>
            <li>
              <b>Demo-Konfiguration.</b> Die konfigurierten Instanzen aus dem IBC-Walkthrough nennen einzelne
              Hersteller und werden in 1.0 nicht veröffentlicht, bis jeder Hersteller zugestimmt hat.
            </li>
          </ul>
          <p className="mb0">
            <Link to="/de/get-started">Weiter: die erste Nachricht validieren und veröffentlichen →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
