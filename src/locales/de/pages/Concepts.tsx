import { Link } from 'react-router-dom';
import { PageHead, PhaseStepper, useHashScroll } from '../../../components/Bits';
import type { Phase } from '../../../components/Bits';
import { BEHAVIOURS, PRINCIPLES } from '../data/reading';
import { repoFile } from '../../../data/consortium';

const PHASES: Phase[] = [
  {
    key: 'dev',
    name: 'DEVELOPING',
    title: 'DEVELOPING',
    body: (
      <>
        <p>
          Die Story existiert und wird bearbeitet. Felder kommen über aufeinanderfolgende Snapshots hinzu: eine{' '}
          <code>premise</code> mit einer Konfidenz, erste <code>editorial_source[]</code>-Einträge, die ersten Assets
          und Assertions.
        </p>
        <p className="small muted mb0">
          Jede Änderung ist ein neuer vollständiger Snapshot mit höherer <code>sequence_number</code>. Tools, die die
          Story lesen, werten jeden einzelnen neu aus.
        </p>
      </>
    ),
  },
  {
    key: 'ready',
    name: 'READY_TO_AIR',
    title: 'READY_TO_AIR',
    body: (
      <>
        <p>
          Die Story gilt als sendefähig. Was vorher noch geklärt werden muss, wird als{' '}
          <code>editorial_gates[]</code>-Einträge ausgedrückt, deren <code>blocks[]</code> benennen, was sie
          zurückhalten – ein Asset oder eine Lifecycle-Phase.
        </p>
        <p className="small muted mb0">
          Ein Gate ist <code>PENDING</code>, <code>APPROVED</code> oder <code>REJECTED</code>. Gates verbinden sich per
          Konjunktion: Jedes bindende Gate muss zustimmen.
        </p>
      </>
    ),
  },
  {
    key: 'breaking',
    name: 'BREAKING',
    title: 'BREAKING',
    body: (
      <>
        <p>
          Die Story ist live und entwickelt sich schnell – genau dann, wenn Zahlen unbestätigt sind und Holds am
          meisten zählen. Tempo entsteht dadurch, dass jedes Tool gleichzeitig denselben Zustand sieht, nicht durch das
          Überspringen eines Gates.
        </p>
        <p className="small muted mb0">
          Priorität ist unabhängig von der Phase: <code>priority.level</code> reicht von <code>ROUTINE</code> über{' '}
          <code>STANDARD</code>, <code>HIGH</code> und <code>URGENT</code> bis <code>FLASH</code>.
        </p>
      </>
    ),
  },
  {
    key: 'published',
    name: 'PUBLISHED',
    title: 'PUBLISHED',
    body: (
      <>
        <p>
          Die Story ist draußen und bleibt in Bewegung: Korrekturen, neu eintreffende Medien und
          Distributionsereignisse erzeugen neue Snapshots und Events.
        </p>
        <p className="small muted mb0">
          Nach der Veröffentlichung tragen die Distributionsfamilien die Last: Links binden Assets an Ziele, Tellings
          zeichnen die Ausspielung auf, und die Audit-Familie hält die Spur fest.
        </p>
      </>
    ),
  },
];

const GLOSSARY: [string, React.ReactNode][] = [
  ['Story', <>Das Geschehen in der Welt, gehalten als Kontext, den sein Publisher besitzt und verbürgt. Veröffentlicht als vollständige <code>story.context</code>-Snapshots, identifiziert über eine unveränderliche <code>story_id</code>.</>],
  ['Asset', <>Ein abgegrenztes Stück Medium oder redaktioneller Arbeit zu einer Story, eingeordnet nach seiner Beweisposition (<code>PRIMARY</code> / <code>SECONDARY</code> / <code>TERTIARY</code>). Existiert unabhängig davon, ob daraus etwas veröffentlicht wird.</>],
  ['Telling', <>Der Moment, in dem ein Asset über ein Ziel ein Publikum erreicht, mit unveränderlichem <code>exposure_start</code> / <code>exposure_end</code>. Der On-Air-Zustand wird aus Tellings abgeleitet.</>],
  ['Link', <>Ein Asset, das an ein Ziel gebunden ist, mit einem Compliance-Gate pro Ziel (<code>PENDING</code> / <code>CLEARED</code> / <code>BLOCKED</code>).</>],
  ['Source (TAMS)', <>Medien, adressiert als <code>tams://store/id</code> plus optionalem Zeitbereich. SOM referenziert Sources, niemals Flows.</>],
  ['Locator', <>Eine Medienreferenz außerhalb von TAMS: <code>store</code> + <code>ref</code>. Ein MAM-Pfad, ein Object Key, eine CMS-ID.</>],
  ['Assertion', <>Eine Behauptung über eine Story, ein Asset, einen Link oder ein Telling – <code>FACT_CHECK</code>, <code>DETECTION</code> oder <code>MATCH</code> – mit Provenienz und Review-Status. Der maßgebliche Ort für eine bestätigte Tatsache.</>],
  ['Provenienz', <>Wer oder was eine Ausgabe verfasst hat: <code>HUMAN</code> oder <code>MODEL</code>. Allgemein auf Urheberschaft bezogen, nie speziell auf KI.</>],
  ['Redaktionelles Gate', <>Etwas, das geklärt sein muss, bevor ein Asset oder eine Phase weitergeht. <code>PENDING</code> / <code>APPROVED</code> / <code>REJECTED</code>.</>],
  ['Orphan', <>Eine minimale Hüllen-Story (<code>story_type: ORPHAN</code>), angelegt für einen Clip, der ohne Story eintraf, bis ein vorgeschlagener Match bestätigt ist.</>],
  ['Skill', <>Eine passive Regeldatei im agentskills.io-Format. Sie deklariert; sie handelt nie und verändert nie Inhalte.</>],
  ['Executor', <>Der Teil eines Hersteller-Tools, der Skills abruft, ihre Warnungen veröffentlicht und entscheidet, was das Tool zurückhält. Tools haben Executors; Redaktionen haben keinen zentralen.</>],
  ['Konfigurierte Instanz', <>Eine generische Skill-Datei mit den Werten eines Hauses, die eine einzige Bedingung überwacht. Ein Haus betreibt mehrere aus derselben Datei.</>],
  ['Story Archaeology', <>Die Methode hinter dem Modell: eine echte Story nach der Ausstrahlung zurückverfolgen und festhalten, wie ihr Kontext tatsächlich wanderte.</>],
  ['Extension', <><code>extensions["com.&#123;vendor&#125;.&#123;field&#125;"]</code> – der vorgesehene Ort für Felder, die der Standard nicht enthält. Unbekannte Schlüssel werden ignoriert.</>],
];

export default function Concepts() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Konzepte"
        title="SOM in zehn Minuten"
        lede="Drei Substantive, ein Snapshot und eine Handvoll Regeln dazu, wer schreibt und wer entscheidet. Wer diese kennt, liest die Schemas wie von selbst."
        toc={[
          { href: '#nouns', label: 'Story · Asset · Telling' },
          { href: '#snapshots', label: 'Snapshots' },
          { href: '#lifecycle', label: 'Lifecycle' },
          { href: '#evidence', label: 'Belege & Behauptungen' },
          { href: '#gates', label: 'Gates & Audit' },
          { href: '#skills', label: 'Erst deklarieren, dann handeln' },
          { href: '#principles', label: 'Prinzipien' },
          { href: '#glossary', label: 'Glossar' },
        ]}
      />

      <section id="nouns">
        <div className="wrap">
          <p className="eyebrow">Die drei Substantive</p>
          <h2>Story, Asset, Telling</h2>
          <p className="lede">
            Eine Story ist ein reales Ereignis: Sie wächst, verzweigt sich und schlägt neue Richtungen ein, und niemand
            kennt ihre Form, bevor sie vorbei ist. Das auf ein Schema abzubilden, lief auf drei Wörter hinaus, die
            Journalisten ohnehin benutzen.
          </p>

          <div className="grid g3" style={{ marginTop: 28 }}>
            <div className="card">
              <div className="lane-icon">S</div>
              <h3>Story</h3>
              <p className="small">
                Das Geschehen. Worum es geht (<code>tags[]</code>, <code>story_meaning</code>), wie weit es ist (
                <code>lifecycle</code>, <code>priority</code>), was die Redaktion erwartet (<code>premise</code>),
                seine Quellen und deren Glaubwürdigkeit sowie die Gates und Compliance-Flags, die darauf liegen.
              </p>
              <p className="small muted mb0">
                <code>story_type</code>: <code>PLANNED</code>, <code>ACTIVE</code>, <code>KILLED</code>,{' '}
                <code>SPIKED</code>, <code>ARCHIVED</code>, <code>ORPHAN</code>.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">A</div>
              <h3>Asset</h3>
              <p className="small">
                Was die Redaktion sammelt und produziert: <code>VIDEO</code>, <code>SCRIPT</code>, <code>GRAPHIC</code>,{' '}
                <code>TRANSCRIPT</code> und generative Ausgaben wie <code>SUMMARY</code> und{' '}
                <code>SOCIAL_POST</code>. Nur Referenzen – die Medien bleiben in ihrem Speicher.
              </p>
              <p className="small muted mb0">
                <code>status</code> ist rein redaktionell: <code>READY</code>, <code>IN_PRODUCTION</code>,{' '}
                <code>PREPARED</code>, <code>INVALIDATED</code>. „Live“ und „gesendet“ werden hier nie gespeichert.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">T</div>
              <h3>Telling</h3>
              <p className="small">
                Ein Asset, das über ein Ziel ein Publikum erreicht. Es folgt auf einen <b>Link</b> – die Bindung dieses
                Assets an dieses Ziel – und hält fest, wann die Ausspielung begann und endete.
              </p>
              <p className="small muted mb0">
                Der Compliance-Status gehört zum Telling. Dasselbe Asset kann im selben Moment auf einem Link
                freigegeben und auf einem anderen blockiert sein.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="snapshots">
        <div className="wrap">
          <p className="eyebrow">Snapshots, niemals Deltas</p>
          <h2>Eine Story wird jedes Mal vollständig veröffentlicht</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <ul className="clean">
                <li>
                  <code>story_id</code> ist unveränderlich. Eine Überarbeitung ist der nächste Snapshot, keine neue
                  Story.
                </li>
                <li>
                  <code>sequence_number</code> MUSS steigen, und <code>updated_at</code> MUSS vorrücken.
                </li>
                <li>
                  Wer veröffentlicht, stempelt <code>originating_system</code> neu, sodass eine Korrektur dem
                  Korrigierenden zugeordnet wird, nicht dem, der die Story ursprünglich angelegt hat.
                </li>
                <li>
                  Ein Schreiber legt an: Das Story-Management-System des Publishers besitzt die Story und ihre Sequenz –
                  niemals die Agentur, nicht einmal bei einem Flash.
                </li>
                <li>
                  Ein Tool, das spät dazukommt, neu startet oder sich nach einem Ausfall wieder verbindet, liest ein
                  Objekt und ist auf dem aktuellen Stand.
                </li>
              </ul>
            </div>
            <div className="card">
              <span className="kicker">Der folgenschwerste Fehler</span>
              <h3>Weglassen heißt nicht vorhanden, nicht unverändert</h3>
              <p className="small">
                Ein Producer DARF Felder, die er nicht geändert hat, NICHT weglassen. Ein Schreiber, der nur seine
                eigenen Felder sendet, löscht stillschweigend die Arbeit aller anderen Systeme an der Story.
              </p>
              <p className="small mb0">
                Die Spezifikation liefert <code>tools/validate_sequence.py</code> mit, um eine Folge von Snapshots auf
                genau diese Eigenschaften zu prüfen – die Fehler, die keine einzelne Nachricht aufdecken kann.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="lifecycle">
        <div className="wrap">
          <p className="eyebrow">Story-Lifecycle</p>
          <h2>Vier Phasen, nur bei aktiven Storys</h2>
          <p className="lede" style={{ marginBottom: 26 }}>
            Ein <code>lifecycle</code>-Block ist Pflicht, wenn <code>story_type</code> den Wert <code>ACTIVE</code> hat,
            und sonst verboten – eine Schemaregel, keine Konvention. Wählen Sie eine Phase.
          </p>

          <PhaseStepper phases={PHASES} />

          <div className="note" style={{ marginTop: 24 }}>
            <p className="mb0">
              <b>Orphans.</b> Ein Clip, der ohne Story eintrifft, bekommt eine minimale <code>ORPHAN</code>-Hüllen-Story,
              die ihn aufnimmt, mit einer <code>MATCH</code>-Assertion, die die echte Story vorschlägt. Nach der
              Bestätigung wandert der Clip – gleiche <code>asset_id</code>, ursprüngliche Zeitstempel –, und die Hülle
              wird immer nach <code>ARCHIVED</code> überführt. Sie wird nie gelöscht, und Consumer filtern Orphans mit
              einem einzigen <code>story_type</code>-Prädikat heraus.
            </p>
          </div>
        </div>
      </section>

      <section id="evidence">
        <div className="wrap">
          <p className="eyebrow">Belege &amp; Behauptungen</p>
          <h2>Woher etwas kommt und was behauptet wird</h2>

          <div className="grid g3" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">editorial_source[]</span>
              <h3>Quellen und Glaubwürdigkeit</h3>
              <p className="small mb0">
                Jede Quelle hat einen Typ (<code>WIRE</code>, <code>OFFICIAL</code>, <code>USER_GENERATED</code>, …)
                und eine deklarierte <code>credibility</code>: <code>TRUSTED</code>, <code>VERIFIED</code>,{' '}
                <code>ENDORSED</code> oder <code>UNVERIFIED</code>. Glaubwürdigkeit ist eine andere Achse als die
                Echtheit von Medien.
              </p>
            </div>
            <div className="card">
              <span className="kicker">assets[].provenance</span>
              <h3>Urheberschaft</h3>
              <p className="small mb0">
                <code>HUMAN</code> oder <code>MODEL</code>, mit Modell und Version nur bei Modellen. Ein C2PA-
                <code>authenticity_credential</code> verzeichnet <code>present: false</code>, statt sein Fehlen zu
                verbergen. Eine Konfidenz ist optional – erfinden Sie keine für Freitext.
              </p>
            </div>
            <div className="card">
              <span className="kicker">assertions[]</span>
              <h3>Behauptungen in Prüfung</h3>
              <p className="small mb0">
                <code>FACT_CHECK</code> (eine Kennzahl und ein Wert), <code>DETECTION</code> oder <code>MATCH</code>,
                jeweils mit einem <code>review</code> von <code>PENDING</code>, <code>CONFIRMED</code> oder{' '}
                <code>REJECTED</code>. Abgelehnte Einträge werden markiert, nie gelöscht. Bei jedem Widerspruch gewinnt
                die Assertion.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="gates">
        <div className="wrap">
          <p className="eyebrow">Gates &amp; Audit</p>
          <h2>Nichts erreicht ein Publikum ohne redaktionelles Gate</h2>
          <p className="lede">
            Ein Skill deklariert, das Tool, dem der Executor gehört, entscheidet, und ein Mensch gibt frei. Eine
            Freigabe gilt für eine Fassung des Textes – eine Überarbeitung öffnet das Gate also wieder, statt die
            Freigabe zu erben.
          </p>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card sev hold">
              <h3>hold</h3>
              <p className="small mb0">
                Der Executor MUSS die Ausgabe der betroffenen Felder zurückhalten. Aufgehoben nur durch eine Freigabe
                im selben Geltungsbereich – nicht durch Zeitablauf und nicht dadurch, dass das Flag in einem späteren
                Snapshot fehlt.
              </p>
            </div>
            <div className="card sev flag">
              <h3>flag</h3>
              <p className="small mb0">
                Zur Prüfung markieren. Ein Tool kann es anzeigen; allein deswegen wird nichts zurückgehalten.
              </p>
            </div>
            <div className="card sev inform">
              <h3>inform</h3>
              <p className="small mb0">Nur ein Hinweis. Keine blockierende Aktion und keine Reaktionspflicht.</p>
            </div>
          </div>

          <div className="grid g2" style={{ marginTop: 22, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Konjunktion</span>
              <p className="small mb0">
                Wo mehrere Gates dieselbe Tatsache im selben Telling binden, wird sie nur ausgespielt, wenn <b>jedes</b>{' '}
                Gate zustimmt – ein einziger Hold heißt: zurückgehalten. „Das Restriktivste gewinnt“ und „Der
                Story-Eigentümer hat Vorrang“ wurden zugunsten dieser Regel zurückgezogen. Compliance ist fail-closed,
                und eine Transformation – Trimmen, Zuschneiden, eingebrannte Untertitel – hebt niemals einen Hold auf.
              </p>
            </div>
            <div className="card">
              <span className="kicker">som.system.audit</span>
              <p className="small mb0">
                Die Governance-Spur. Eine <code>action</code> vom Typ <code>CLEARED</code>, <code>SUPPRESSED</code>,{' '}
                <code>WITHHELD</code> oder <code>OVERRIDDEN</code>, bezogen auf einen <code>LINK</code>, ein{' '}
                <code>ASSET</code> oder ein <code>TELLING</code>, mit einem Akteur und einer Begründung. Eine
                Unterdrückung zielt auf das zurückgehaltene Asset, denn der Zweig, der nie gesendet wird, bekommt nie
                einen Link.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="wrap">
          <p className="eyebrow">Erst deklarieren, dann handeln</p>
          <h2>SOM trägt den Kontext. Skills tragen das Wissen.</h2>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Der Standard – gemeinsam</span>
              <p className="small mb0">
                Was eine Story ist, in welchem Zustand sie ist, was zurückgehalten und was freigegeben ist, woher das
                Material stammt. Überall gleich, und ohne eigenes Urteil.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Skills – die des Hauses</span>
              <p className="small mb0">
                Redaktionelle Standards, Compliance-Regeln, gelebte Praxis: das, was sich von Redaktion zu Redaktion zu
                Recht unterscheidet. Das Framework ist offen; Ihr Workflow bleibt Ihrer, und kein Hersteller braucht
                eine Kopie Ihrer Richtlinien.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Schweigen ist ein gültiges Ergebnis.</b> Ein Skill, der nichts zu deklarieren findet, sagt nichts, und
              ein Tool beweist nur dadurch, dass es die Story gelesen hat, dass es seinerseits veröffentlicht. Deshalb ist
              der Audit-Trail auch ein Nebenprodukt der Art, wie Schreibvorgänge funktionieren, und kein nachträglich
              angeschraubtes Feature. <Link to="/de/skills">Wie der Recall funktioniert →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="principles">
        <div className="wrap">
          <p className="eyebrow">Prinzipien</p>
          <h2>Warum SOM so geformt ist, wie es ist</h2>
          <p className="lede">
            Sechs Arbeitsprinzipien eröffnen die Spezifikation, und sie sind der Test, den jede künftige Änderung
            bestehen muss.
          </p>

          <div className="grid g3" style={{ marginTop: 28 }}>
            {PRINCIPLES.map((p, i) => (
              <div className="card" key={p.title}>
                <span className="kicker">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p className="small mb0">{p.body}</p>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: 40, textAlign: 'center' }}>Wie es sich verhält</h3>
          <div className="grid g4" style={{ marginTop: 18 }}>
            {BEHAVIOURS.map((b) => (
              <div className="card" key={b.title}>
                <h3>{b.title}</h3>
                <p className="small mb0">{b.body}</p>
              </div>
            ))}
          </div>

          <div className="note" style={{ marginTop: 24 }}>
            <p className="mb0">
              <b>Wo der Standard aufhört.</b> SOM beschreibt eine Story und alles, was über sie wahr ist, und nichts
              darüber hinaus. Was jede Redaktion mit dem Gelesenen macht, ist ihre eigene Sache. 1.0 ist ein
              Bekenntnis zur Stabilität, kein Anspruch auf Vollständigkeit: Was noch nicht geklärt ist, steht im{' '}
              <a href={repoFile('spec/open-register.md')} target="_blank" rel="noreferrer">
                Open Register ↗
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section id="glossary">
        <div className="wrap">
          <p className="eyebrow">Glossar</p>
          <h2>Das Vokabular</h2>
          <div className="table-scroll" style={{ marginTop: 22 }}>
            <table>
              <thead>
                <tr>
                  <th>Begriff</th>
                  <th>Bedeutung</th>
                </tr>
              </thead>
              <tbody>
                {GLOSSARY.map(([term, meaning]) => (
                  <tr key={term}>
                    <td>
                      <b>{term}</b>
                    </td>
                    <td>{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: 16 }}>
            Das vollständige Glossar steht in der Spezifikation:{' '}
            <a href={repoFile('spec/glossary.md')} target="_blank" rel="noreferrer">
              spec/glossary.md ↗
            </a>
          </p>
        </div>
      </section>

      <section>
        <div className="wrap center">
          <h2>Weiter: das Wire-Format</h2>
          <p className="lede" style={{ margin: '0 auto 24px' }}>
            Jede Nachricht teilt sich ein Envelope. Hier ist jedes Feld – und was die Konformität von ihm verlangt.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link className="btn primary" to="/de/envelope">
              Das Envelope →
            </Link>
            <Link className="btn" to="/de/bus">
              Die sieben Familien
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
