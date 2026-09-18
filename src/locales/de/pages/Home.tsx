import { Link } from 'react-router-dom';
import AccentWord from '../../../components/AccentWord';
import LoopDiagram from '../../../components/LoopDiagram';
import FieldExplorer from '../../../components/FieldExplorer';
import { Accordion, useHashScroll } from '../../../components/Bits';
import { ENVELOPE_FIELDS } from '../data/envelope';
import { FAQS } from '../data/faq';
import {
  AUTHORS,
  CHAMPIONS,
  CHAMPION_MARKS,
  CONTACT_EMAIL,
  DEMOS_URL,
  EMULATOR_URL,
  INVOLVED_FORM_URL,
  OFFICIAL_URL,
  PARTICIPANTS,
  SPEC_REPO_URL,
} from '../../../data/consortium';
import { DEMOS } from '../data/consortium';
import { READING } from '../data/reading';

const ENVELOPE_SAMPLES: Record<string, string> = {
  som_version: '"1.0.0"',
  message_id: '"0199a1c4-7a2e-7b31-…"',
  correlation_id: '"0199a1c4-0000-7000-…"',
  causation_id: '"0199a1c4-7a2e-7b31-…"',
  message_type: '"story.context"',
  timestamp: '"2026-09-11T16:41:00.000000Z"',
  originating_system: '{ "system_id": "ncs-nyc-01", "system_type": "ncs" }',
  topic: '"som.story.context.hurricane-2026-0911"',
  modification_header: '{ "story_version": 7, … }',
  _actors: '{ … }',
  '@context': 'null',
  extensions: '{ "com.example.desk": "news" }',
  payload: '{ … }',
};

const ENVELOPE_COMMENTS: Record<string, string> = {
  payload: 'gegen das Schema des message_type validiert',
};

export default function Home() {
  useHashScroll();

  return (
    <>
      <div className="hero">
        <div className="wrap">
          <p className="eyebrow">SOM 1.0 · veröffentlicht auf der IBC 2026</p>
          <h1>
            Ein Bus für den <AccentWord>Story-Kontext</AccentWord>.
            <br />
            Jedes Tool daran.
          </h1>
          <p className="lede">
            Das Story Object Model ist ein offener Standard für den Story-Kontext in der Content-Produktion – eine
            Schicht unter den Tools, die Sie bereits betreiben. Sie trägt, was gerade über eine Story wahr ist und wie
            sich das verändert hat. Die Tools reden nicht mehr miteinander, sondern lesen stattdessen eine gemeinsame,
            laufend aktuelle Beschreibung der Story.
          </p>
          <div className="btn-row">
            <Link className="btn primary" to="/de/get-started">
              Hier anfangen
            </Link>
            <Link className="btn" to="/de/concepts">
              SOM in zehn Minuten
            </Link>
          </div>
        </div>
      </div>

      <div className="credits">
        <div className="wrap">
          <p>Unter den vierzehn Champion-Organisationen</p>
          <ul>
            {CHAMPION_MARKS.map((o) => (
              <li key={o.name}>
                <img src={o.logo} alt={o.name} style={{ height: o.height }} />
              </li>
            ))}
          </ul>
          <p className="co">
            Entwickelt im IBC Accelerator Media Innovation Programme 2026 als Projekt SMART STORIES, mit vierzehn
            Champions und siebzehn Teilnehmern.
          </p>
        </div>
      </div>

      <section id="gap">
        <div className="wrap">
          <p className="eyebrow">Die Lücke</p>
          <h2>Jedes System hält ein Fragment. Keines hält die Story.</h2>
          <p className="lede">
            Jedes Tool in einer Redaktion ist in seinem eigenen Ausschnitt genau. Die Entscheidungen, die die Story
            prägen – ein Hold auf eine Zahl, welches Skript aktuell ist, was freigegeben wurde –, wandern per Chat,
            Telefon und Zuruf über den Tisch, und die nächste Schicht überleben sie selten.
          </p>

          <div className="scenario" style={{ marginTop: 30 }}>
            <div>
              <span className="kicker">Heute</span>
              <p>
                Spät in einer Breaking Story hält der Chef vom Dienst eine unbestätigte Opferzahl zurück. Der Rundown
                erfährt davon; die Grafik bekommt ein Rebriefing und versteht es falsch; der Online-Desk hat den
                Gruppenchat gesehen, der Social-Desk nicht; dem Ticker hat niemand Bescheid gesagt.
              </p>
              <p className="mb0">
                Die Zahl ist auf einem Ausspielweg zurückgehalten und auf einem anderen live, und morgen ist die einzige
                Spur das Gedächtnis der Beteiligten. Der Kontext hat nie gefehlt – er saß dort fest, wo kein System ihn
                lesen konnte.
              </p>
            </div>
            <div>
              <span className="kicker">Mit SOM</span>
              <p>
                Der Chef vom Dienst trifft dieselbe Entscheidung in dem Tool, das er ohnehin benutzt, und sie wird in
                die Story geschrieben. Jedes abonnierte Tool sieht sie sofort und wendet die Regeln an, die seine
                Redaktion ihm mitgegeben hat: Der Clip darf nicht laufen, die Grafik wird nicht ausgespielt, der Ticker
                lässt die Zahl weg.
              </p>
              <p className="mb0">
                Die Entscheidung, wer sie getroffen hat, wann und warum, ist dokumentiert – ebenso, was jedes Tool
                daraufhin getan hat. Der Mensch wurde nicht ersetzt; er trägt keinen Zustand mehr herum und trifft
                wieder die Entscheidung.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="idea">
        <div className="wrap">
          <p className="eyebrow">Die Idee</p>
          <h2>Tools sprechen mit der Story, nicht miteinander</h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            SOM ist eine kleine Menge von JSON-Nachrichtenfamilien auf einem gewöhnlichen Publish/Subscribe-Bus. Über
            den Tools sitzt nichts: kein Orchestrator, keine zentrale Anwendung. Jeder Teilnehmer liest die Story,
            entscheidet selbst und veröffentlicht in seiner eigenen Familie, was er getan hat.
          </p>

          <LoopDiagram />

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <span className="kicker">story.context</span>
              <h3>Story</h3>
              <p className="mb0 small">
                Das, was in der Welt geschieht: worum es geht, seine Quellen und wie weit man ihnen traut, Lifecycle und
                Priorität, die Prämisse, die die Redaktion erwartet, und die aufgestellten Behauptungen samt ihrem
                Prüfstatus.
              </p>
            </div>
            <div className="card">
              <span className="kicker">assets[]</span>
              <h3>Asset</h3>
              <p className="mb0 small">
                Was die Redaktion sammelt und produziert, um sie zu erzählen – Video, Audio, Skripte, Grafiken,
                Transkripte. Nur als Referenz: Medien laufen nie über den Bus. Jedes Asset trägt seine Provenienz und
                seine Beweisposition.
              </p>
            </div>
            <div className="card">
              <span className="kicker">telling.*</span>
              <h3>Telling</h3>
              <p className="mb0 small">
                Der Moment, in dem ein Asset über ein Ziel ein Publikum erreicht. Eine Story, ein Pool von Assets,
                beliebig viele Tellings – und der Compliance-Status gehört zum Telling, nicht zum Medium.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Abgeschrieben, nicht erfunden.</b> Die drei Substantive stammen aus Story-Archaeology-Sitzungen – bei
              denen nach der Ausstrahlung nachverfolgt wurde, wie der Kontext einer echten Story zwischen Menschen und
              Systemen wanderte. Das Modell ist klein, weil das Vokabular, das Redaktionen ohnehin benutzen, klein ist.{' '}
              <Link to="/de/concepts#nouns">Die drei Substantive im Detail →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="start">
        <div className="wrap">
          <p className="eyebrow">Hier anfangen</p>
          <h2>Drei Wege auf den Bus</h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            Ein konformes System implementiert das Envelope und nur die Familien, zu denen es etwas zu sagen hat. Was
            das bedeutet, hängt von Ihrer Rolle ab.
          </p>

          <div className="grid g3">
            <Link className="card" to="/de/envelope">
              <div className="lane-icon">▤</div>
              <h3>Sie besitzen Storys</h3>
              <p className="small">
                Ein Planungssystem oder NCS. Sie legen die Story an und veröffentlichen <code>story.context</code>
                -Snapshots: eine unveränderliche <code>story_id</code>, eine steigende <code>sequence_number</code> und
                jedes Mal jedes Feld – Weglassen bedeutet nicht vorhanden.
              </p>
              <span className="more">Das Envelope, Feld für Feld →</span>
            </Link>
            <Link className="card" to="/de/skills">
              <div className="lane-icon">◈</div>
              <h3>Ihr Tool handelt nach Regeln</h3>
              <p className="small">
                Ein Rundown-, MAM-, CMS-, Playout- oder Grafiksystem. Ihr Executor ruft Skills aus der gemeinsamen
                Bibliothek ab, veröffentlicht <code>skill.warning.raised</code> und entscheidet, was Ihr Tool
                zurückhält.
              </p>
              <span className="more">Skills und die Bibliothek →</span>
            </Link>
            <Link className="card" to="/de/bus">
              <div className="lane-icon">⇄</div>
              <h3>Sie bewegen Medien oder Ausspielungen</h3>
              <p className="small">
                Ein TAMS-Speicher oder MAM kündigt <code>delivery.media_available</code> an; ein bindendes System
                veröffentlicht <code>som.link.*</code>; Playout und Social veröffentlichen <code>som.telling.*</code>.
              </p>
              <span className="more">Die sieben Nachrichtenfamilien →</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="rulebook">
        <div className="wrap">
          <p className="eyebrow">Das Regelwerk</p>
          <h2>SOM trägt den Kontext. Skills tragen das Wissen.</h2>
          <p className="lede">
            Redaktionelle Regeln werden einmal geschrieben, von der Redaktion, im offenen agentskills.io-Format, wo
            jedes Tool sie lesen kann. Ein Skill ist passiv: Er deklariert, was wahr ist, und das Tool, dem der
            Executor gehört, handelt danach.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">So würde es ein Standards-Desk sagen</span>
              <p className="small mb0">
                Senden Sie keine Opferzahl, bevor zwei namentlich genannte, unabhängige Quellen sie bestätigen oder es
                eine offizielle Stellungnahme gibt. Bis dahin halten Sie die Zahl auf jedem Ausspielweg zurück und
                leiten sie an den Standards-Desk weiter.
              </p>
            </div>
            <div>
              <pre>{`# illustrative — the same rule, once, for every tool
skill:       casualty-figure-hold
declares:    GATE
scope:       story.context.editorial_gates
when:        confirming_sources < 2 and no official_statement
then:        hold · route: standards_desk
authored_by: standards desk
silence:     valid`}</pre>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Eine Kopie, ein Autor.</b> Niemand übersetzt die Regel in sechs Herstellerprodukte, und kein Hersteller
              braucht eine Kopie Ihrer Richtlinien, um für Sie zu arbeiten. Lässt sich eine Regel nicht auswerten, bleibt
              die Ausgabe, die sie schützt, zurückgehalten, und ein Mensch entscheidet.{' '}
              <Link to="/de/skills">Wie Skills abgerufen werden →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="demos">
        <div className="wrap">
          <p className="eyebrow">In Aktion sehen</p>
          <h2>Zwei Breaking-News-Szenarien, ein Story-Bus</h2>
          <p className="lede">
            Auf der IBC 2026 spielte das Konsortium zwei Szenarien mit unterschiedlichen Storys und unterschiedlichen
            Herstellern durch – alle lasen und schrieben dieselbe Story mit echten Produktionstools. In keinem der
            beiden schickt irgendetwas einen Befehl an irgendetwas anderes.
          </p>

          <div className="grid g2" style={{ marginTop: 28, alignItems: 'start' }}>
            {DEMOS.map((d, i) => (
              <a className="card" key={d.title} href={`${DEMOS_URL}#${d.anchor}`} target="_blank" rel="noreferrer">
                <span className="kicker">Szenario {String(i + 1).padStart(2, '0')}</span>
                <h3>{d.title} ↗</h3>
                <p className="small">{d.summary}</p>
                <p className="small muted mb0">{d.vendors.join(' · ')}</p>
              </a>
            ))}
          </div>

          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <a className="btn" href={DEMOS_URL} target="_blank" rel="noreferrer">
              Die Demos ansehen ↗
            </a>
            <a className="btn" href={EMULATOR_URL} target="_blank" rel="noreferrer">
              Den Live-Bus-Emulator öffnen ↗
            </a>
          </div>
        </div>
      </section>

      <section id="fits">
        <div className="wrap">
          <p className="eyebrow">Es ersetzt nichts</p>
          <h2>Ein neuer Standard, dazu intelligente Schnittstellen</h2>
          <p className="lede">
            Hardware hatte GPI; Software hatte MOS, von Sendern und Herstellern für ihre Branche gebaut und im Besitz
            von niemandem. SOM ist das Gegenstück für die Ära intelligenter Tools, und es trifft die Standards, die
            bereits funktionieren, dort, wo sie stehen.
          </p>

          <div className="table-scroll" style={{ marginTop: 26 }}>
            <table>
              <thead>
                <tr>
                  <th>Schicht</th>
                  <th>Wofür sie zuständig ist</th>
                  <th>Verhältnis zu SOM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>NCS / Planung</b>
                  </td>
                  <td>Anlegen und Verfassen der Story</td>
                  <td>
                    Der Story-Eigentümer. Veröffentlicht <code>story.context</code> und besitzt dessen Sequenz. Der
                    Rundown ist eine Ansicht einer Story; SOM trägt die Story, von der er eine Ansicht ist.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>MOS</b>
                  </td>
                  <td>Gerätesteuerung, Rundown-Elemente</td>
                  <td>MOS-Verbindungen bleiben, mit einer Bridge, die sie mit dem Story-Kontext vertraut macht.</td>
                </tr>
                <tr>
                  <td>
                    <b>TAMS</b>
                    <br />
                    <span className="muted small">BBC R&amp;D Time Addressable Media Store</span>
                  </td>
                  <td>Die Frames</td>
                  <td>
                    SOM hält fest, was die Frames für die Story bedeuten. Ein Hold heftet sich über{' '}
                    <code>tams://</code>-Source und Zeitbereich an genau die Frames, die er blockiert; ein Zitat kennt
                    seine In- und Out-Punkte; welche Frames welches Publikum erreicht haben, wird zu einer Abfrage.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>MAM / andere Speicher</b>
                  </td>
                  <td>Essenz, Renditions, Abruf</td>
                  <td>
                    Dasselbe Muster über einen <code>locator</code> (<code>store</code> + <code>ref</code>). Medien in
                    SOM sind beliebige Medien, nicht nur TAMS.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Agents &amp; MCP</b>
                  </td>
                  <td>Was auch immer Sie gebaut haben</td>
                  <td>
                    Bleibt. Generative Ausgaben, die veröffentlicht werden, sind ein <code>assets[]</code>-Eintrag mit
                    Urheberschafts-<code>provenance</code>; Behauptungen über Inhalte sind <code>assertions[]</code> mit
                    einem Review-Status.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Was SOM nicht ist:</b> die Medien, der Rundown, ein MAM, ein Produkt, Software, ein Ersatz für
              irgendetwas, das Sie betreiben, oder Eigentum eines Herstellers. Wie das Projekt es formuliert: Ein
              Standard, der einem Hersteller gehört, ist ein Produkt; einer, der einer Branche gehört, ist Infrastruktur.
            </p>
          </div>
        </div>
      </section>

      <section id="envelope">
        <div className="wrap">
          <p className="eyebrow">Das Envelope</p>
          <h2>Jede Nachricht teilt sich eine Hülle</h2>
          <p className="lede" style={{ marginBottom: 28 }}>
            Ein geschlossenes Objekt – unbekannte Felder auf oberster Ebene scheitern an der Validierung. Klicken Sie
            auf einen Schlüssel, um zu lesen, was er bedeutet.
          </p>

          <FieldExplorer fields={ENVELOPE_FIELDS} samples={ENVELOPE_SAMPLES} comments={ENVELOPE_COMMENTS} />

          <div className="note" style={{ marginTop: 24 }}>
            <p>
              <b>Die Regeln, die wehtun.</b> Senden Sie <code>som_version: "1.0.0"</code> und verzweigen Sie nie
              danach. <code>message_type</code> ist das einzige Unterscheidungsmerkmal. <code>correlation_id</code> ist
              Pflicht. <code>topic</code> beginnt mit <code>som.</code> Schalten Sie die Format-Assertion (
              <code>format</code>) ein – die meisten Validatoren akzeptieren stillschweigend eine{' '}
              <code>message_id</code>, die keine UUID ist. <Link to="/de/envelope">Vollständige Envelope-Referenz →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="numbers">
        <div className="wrap">
          <p className="eyebrow">In Zahlen</p>
          <h2 className="mb0">Die Gestalt des Standards</h2>
          <div className="grid g4" style={{ marginTop: 30 }}>
            <div className="stat">
              <b>7</b>
              <span>Nachrichtenfamilien, jede ein JSON Schema unter einer URL, die sich während 1.x nicht ändert</span>
            </div>
            <div className="stat">
              <b>3</b>
              <span>Substantive – Story, Asset, Telling – abgeschrieben von der Art, wie Redaktionen ohnehin arbeiten</span>
            </div>
            <div className="stat">
              <b>10</b>
              <span>veröffentlichte Referenz-Skills, plus einer im Vorschlag, in der gemeinsamen Bibliothek</span>
            </div>
            <div className="stat">
              <b>14 + 17</b>
              <span>Champion-Organisationen und Technologie-Teilnehmer bei SMART STORIES</span>
            </div>
          </div>
        </div>
      </section>

      <section id="who">
        <div className="wrap">
          <p className="eyebrow">Mitwirkende</p>
          <h2>Von der Branche gebaut, für die Branche veröffentlicht</h2>
          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <p>
                SOM wurde öffentlich in Form gestritten – zwei Hackathons, eine wöchentliche Arbeitsgruppe und sechs
                Monate vom Kick-off bis zum funktionierenden Bus – und als <b>Version 1.0 am 12. September 2026</b> auf
                der IBC in Amsterdam veröffentlicht.
              </p>
              <p>
                Die Autoren sind {AUTHORS.slice(0, -1).join(', ')} und {AUTHORS[AUTHORS.length - 1]}. Jon Roberts,
                Morag McIntosh und Alex Bassett haben das Modell konzipiert und das Projekt geleitet, gemeinsam mit
                Brian Hopman von AP; John Boucklos hat die Spezifikation mitverfasst, das Schema bis 1.0 geführt und die
                Validatoren sowie das Repository gebaut.
              </p>
              <p className="mb0">
                BBC R&amp;D arbeitete an der TAMS-Schnittstelle. Google Cloud war Titelsponsor des Accelerator-Projekts;
                Amazon Web Services stellte den Referenz-Bus, das Dashboard und den TAMS-Speicher bereit; The Associated
                Press und The Weather Company lieferten Daten.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Offen und herrenlos</span>
              <p className="small">
                Keine Gebühr und nichts zu unterschreiben. Schemas, Beispiele, Tools und Skills stehen unter Apache
                2.0; der Spezifikationstext unter CC BY 4.0. Diese Lizenzen sind die gesamten Bedingungen.
              </p>
              <p className="small">
                Der Accelerator ist vorbei; die Arbeitsgruppe nicht. Sie steht allen offen, die das Modell
                implementieren oder davon betroffen sind, und jede Änderung kommt als Pull Request, den jeder eröffnen
                kann.
              </p>
              <p className="small mb0">
                <a href={SPEC_REPO_URL} target="_blank" rel="noreferrer">
                  github.com/storyobjectmodel/som ↗
                </a>{' '}
                ·{' '}
                <a href={OFFICIAL_URL} target="_blank" rel="noreferrer">
                  storyobjectmodel.com ↗
                </a>
              </p>
            </div>
          </div>

          <div className="roster">
            <div>
              <h4>Champions · 14</h4>
              <ul>
                {CHAMPIONS.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Teilnehmer · 17</h4>
              <ul>
                {PARTICIPANTS.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <p className="small muted mb0">
              Liste wie verzeichnet in der{' '}
              <a href={`${SPEC_REPO_URL}/blob/main/CONTRIBUTORS.md`} target="_blank" rel="noreferrer">
                CONTRIBUTORS.md ↗
              </a>{' '}
              der Spezifikation.
            </p>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap narrow">
          <p className="eyebrow">Häufige Fragen</p>
          <h2 style={{ marginBottom: 28 }}>Bevor Sie fragen</h2>
          <Accordion items={FAQS} />
        </div>
      </section>

      <section id="reading">
        <div className="wrap">
          <p className="eyebrow">Weiterlesen</p>
          <h2>Direkt aus der Quelle</h2>
          <p className="lede">
            Diese Website ist ein inoffizieller, sekundärer Leitfaden. Dies sind die Primärquellen – die ersten drei
            sind der Standard selbst.
          </p>

          <div className="reading" style={{ marginTop: 28 }}>
            {READING.map((r) => (
              <a className="card" href={r.url} target="_blank" rel="noreferrer" key={r.url}>
                <span className="kicker">
                  {r.source} · {r.date}
                </span>
                <h3>{r.title} ↗</h3>
                <p className="small mb0">{r.why}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="cta">
        <div className="wrap center">
          <h2>Lesen Sie es. Bauen Sie dagegen. Sagen Sie, was bricht.</h2>
          <p className="lede" style={{ margin: '0 auto 26px' }}>
            Die Spezifikation ist veröffentlicht und frei implementierbar. Wenn Sie dagegen entwickeln, Skills schreiben,
            eine Story-Archaeology-Sitzung durchführen oder der Arbeitsgruppe beitreten möchten, wenden Sie sich direkt
            an das Projekt.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link className="btn primary" to="/de/get-started">
              Loslegen →
            </Link>
            <a className="btn" href={INVOLVED_FORM_URL} target="_blank" rel="noreferrer">
              Mitmachen ↗
            </a>
            <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
