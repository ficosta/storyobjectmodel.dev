import { Link } from 'react-router-dom';
import AccentWord from '../components/AccentWord';
import LoopDiagram from '../components/LoopDiagram';
import FieldExplorer from '../components/FieldExplorer';
import { Accordion, useHashScroll } from '../components/Bits';
import { ENVELOPE_FIELDS } from '../data/envelope';
import { FAQS } from '../data/faq';
import {
  AUTHORS,
  CHAMPIONS,
  CHAMPION_MARKS,
  CONTACT_EMAIL,
  DEMOS,
  DEMOS_URL,
  EMULATOR_URL,
  INVOLVED_FORM_URL,
  OFFICIAL_URL,
  PARTICIPANTS,
  SPEC_REPO_URL,
} from '../data/consortium';
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
  payload: 'validated against the schema for message_type',
};

export default function Home() {
  useHashScroll();

  return (
    <>
      <div className="hero">
        <div className="wrap">
          <p className="eyebrow">SOM 1.0 · published at IBC 2026</p>
          <h1>
            One bus for <AccentWord>story context</AccentWord>.
            <br />
            Every tool on it.
          </h1>
          <p className="lede">
            The Story Object Model is an open standard for story context in content production — a layer under the
            tools you already run, carrying what is true about a story right now and how that changed. Tools stop
            talking to each other and read one shared, live description of the story instead.
          </p>
          <div className="btn-row">
            <Link className="btn primary" to="/get-started">
              Start here
            </Link>
            <Link className="btn" to="/concepts">
              SOM in ten minutes
            </Link>
          </div>
        </div>
      </div>

      <div className="credits">
        <div className="wrap">
          <p>Among the fourteen champion organisations</p>
          <ul>
            {CHAMPION_MARKS.map((o) => (
              <li key={o.name}>
                <img src={o.logo} alt={o.name} style={{ height: o.height }} />
              </li>
            ))}
          </ul>
          <p className="co">
            Developed through the IBC Accelerator Media Innovation Programme 2026 as the project SMART STORIES, with
            fourteen champions and seventeen participants.
          </p>
        </div>
      </div>

      <section id="gap">
        <div className="wrap">
          <p className="eyebrow">The gap</p>
          <h2>Every system holds a fragment. None holds the story.</h2>
          <p className="lede">
            Each tool in a newsroom is accurate about its own slice. The decisions that shape the story — a hold on
            a figure, which script is current, what has been cleared — travel by chat, phone and a word across the
            desk, and they rarely survive the next shift.
          </p>

          <div className="scenario" style={{ marginTop: 30 }}>
            <div>
              <span className="kicker">Today</span>
              <p>
                Late on a breaking story, the duty editor holds an unconfirmed casualty figure. The rundown hears
                about it; graphics gets a rebrief and misreads it; the web desk saw the group chat and the social
                desk didn’t; nobody told the ticker.
              </p>
              <p className="mb0">
                The figure is held on one output and live on another, and by tomorrow the only trail is people’s
                memory. The context was never missing — it was stranded where no system could read it.
              </p>
            </div>
            <div>
              <span className="kicker">With SOM</span>
              <p>
                The editor makes the same call in the tool they already use, and it is written to the story. Every
                subscribed tool sees it at once and applies the rules its newsroom gave it: the clip can’t run, the
                graphic doesn’t play, the ticker drops the figure.
              </p>
              <p className="mb0">
                The decision, who made it, when and why are on the record — and so is what each tool did about it.
                The person was not replaced; they stopped carrying state and went back to making the call.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="idea">
        <div className="wrap">
          <p className="eyebrow">The idea</p>
          <h2>Tools talk to the story, not to each other</h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            SOM is a small set of JSON message families on an ordinary publish/subscribe bus. Nothing sits above the
            tools: no orchestrator, no central application. Each participant reads the story, decides for itself,
            and publishes what it did in its own family.
          </p>

          <LoopDiagram />

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <span className="kicker">story.context</span>
              <h3>Story</h3>
              <p className="mb0 small">
                The thing happening in the world: what it is about, its sources and how far they are trusted,
                lifecycle and priority, the premise the newsroom expects, and the claims being made with their review
                state.
              </p>
            </div>
            <div className="card">
              <span className="kicker">assets[]</span>
              <h3>Asset</h3>
              <p className="mb0 small">
                What the newsroom gathers and makes to tell it — video, audio, scripts, graphics, transcripts. By
                reference only: media never travels the bus. Each asset carries its provenance and evidential
                position.
              </p>
            </div>
            <div className="card">
              <span className="kicker">telling.*</span>
              <h3>Telling</h3>
              <p className="mb0 small">
                The moment an asset meets an audience through a destination. One story, a pool of assets, any number
                of tellings — and the compliance position belongs to the telling, not the media.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Transcribed, not invented.</b> The three nouns came out of Story Archaeology sessions — tracing how a
              real story’s context moved between people and systems after transmission. The model is small because
              the vocabulary newsrooms already use is small. <Link to="/concepts#nouns">The three nouns in depth →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="start">
        <div className="wrap">
          <p className="eyebrow">Start here</p>
          <h2>Three ways onto the bus</h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            A conformant system implements the envelope plus only the families it has something to say about. What
            that means depends on the role you play.
          </p>

          <div className="grid g3">
            <Link className="card" to="/envelope">
              <div className="lane-icon">▤</div>
              <h3>You own stories</h3>
              <p className="small">
                A planning system or NCS. You mint the story and publish <code>story.context</code> snapshots: an
                immutable <code>story_id</code>, a rising <code>sequence_number</code>, and every field every time —
                omission means absent.
              </p>
              <span className="more">The envelope, field by field →</span>
            </Link>
            <Link className="card" to="/skills">
              <div className="lane-icon">◈</div>
              <h3>Your tool acts on rules</h3>
              <p className="small">
                A rundown, MAM, CMS, playout or graphics system. Your executor recalls skills from the shared library,
                publishes <code>skill.warning.raised</code>, and decides what your tool withholds.
              </p>
              <span className="more">Skills and the library →</span>
            </Link>
            <Link className="card" to="/bus">
              <div className="lane-icon">⇄</div>
              <h3>You move media or output</h3>
              <p className="small">
                A TAMS store or MAM announces <code>delivery.media_available</code>; a committing system publishes{' '}
                <code>som.link.*</code>; playout and social publish <code>som.telling.*</code>.
              </p>
              <span className="more">The seven message families →</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="rulebook">
        <div className="wrap">
          <p className="eyebrow">The rulebook</p>
          <h2>SOM carries context. Skills carry knowledge.</h2>
          <p className="lede">
            Editorial rules are written once, by the newsroom, in the open agentskills.io shape, where every tool can
            read them. A skill is passive: it declares what is true, and the tool that owns the executor acts on it.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">As a standards desk would say it</span>
              <p className="small mb0">
                Don’t broadcast a casualty figure until two named, independent sources confirm it, or there is an
                official statement. Until then, hold the figure on every output and send it to the standards desk.
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
              <b>One copy, one author.</b> Nobody translates the rule into six vendor products, and no vendor needs a
              copy of your policy to work for you. If a rule can’t be evaluated, the output it guards stays held and a
              person decides. <Link to="/skills">How skills are recalled →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="demos">
        <div className="wrap">
          <p className="eyebrow">Watch it happen</p>
          <h2>Two breaking-news scenarios, one story bus</h2>
          <p className="lede">
            At IBC 2026 the consortium ran two scenarios with different stories and different vendors, all reading and
            writing the same story with real production tools. In neither does anything send a command to anything
            else.
          </p>

          <div className="grid g2" style={{ marginTop: 28, alignItems: 'start' }}>
            {DEMOS.map((d, i) => (
              <a className="card" key={d.title} href={`${DEMOS_URL}#${d.anchor}`} target="_blank" rel="noreferrer">
                <span className="kicker">Scenario {String(i + 1).padStart(2, '0')}</span>
                <h3>{d.title} ↗</h3>
                <p className="small">{d.summary}</p>
                <p className="small muted mb0">{d.vendors.join(' · ')}</p>
              </a>
            ))}
          </div>

          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <a className="btn" href={DEMOS_URL} target="_blank" rel="noreferrer">
              Watch the demos ↗
            </a>
            <a className="btn" href={EMULATOR_URL} target="_blank" rel="noreferrer">
              Open the live bus emulator ↗
            </a>
          </div>
        </div>
      </section>

      <section id="fits">
        <div className="wrap">
          <p className="eyebrow">It replaces nothing</p>
          <h2>One new standard, plus smart junctions</h2>
          <p className="lede">
            Hardware had GPI; software had MOS, built by broadcasters and vendors for their industry and owned by
            nobody. SOM is the equivalent for the era of intelligent tools, and it meets the standards that already
            work where they stand.
          </p>

          <div className="table-scroll" style={{ marginTop: 26 }}>
            <table>
              <thead>
                <tr>
                  <th>Layer</th>
                  <th>What it owns</th>
                  <th>SOM’s relationship</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>NCS / planning</b>
                  </td>
                  <td>Minting and authoring the story</td>
                  <td>
                    The story owner. Publishes <code>story.context</code> and owns its sequence. The rundown is one view
                    of a story; SOM carries the story it is a view of.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>MOS</b>
                  </td>
                  <td>Device control, running-order items</td>
                  <td>MOS lines stay, with a bridge that makes them aware of the story context.</td>
                </tr>
                <tr>
                  <td>
                    <b>TAMS</b>
                    <br />
                    <span className="muted small">BBC R&amp;D Time Addressable Media Store</span>
                  </td>
                  <td>The frames</td>
                  <td>
                    SOM holds what the frames mean to the story. A hold pins to the exact frames it blocks by{' '}
                    <code>tams://</code> Source and time range; a quote knows its in and out points; which frames
                    reached which audience becomes a query.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>MAM / other stores</b>
                  </td>
                  <td>Essence, renditions, retrieval</td>
                  <td>
                    The same pattern through a <code>locator</code> (<code>store</code> + <code>ref</code>). Media in
                    SOM is any media, not just TAMS.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Agents &amp; MCP</b>
                  </td>
                  <td>Whatever you have built</td>
                  <td>
                    Stays. Generative output that publishes is an <code>assets[]</code> entry with authorship{' '}
                    <code>provenance</code>; claims about content are <code>assertions[]</code> with a review state.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>What SOM is not:</b> the media, the rundown, a MAM, a product, software, a replacement for anything
              you run, or owned by any vendor. As the project puts it, a standard owned by one vendor is a product; one
              owned by an industry is infrastructure.
            </p>
          </div>
        </div>
      </section>

      <section id="envelope">
        <div className="wrap">
          <p className="eyebrow">The envelope</p>
          <h2>Every message shares one wrapper</h2>
          <p className="lede" style={{ marginBottom: 28 }}>
            A closed object — unknown top-level fields fail validation. Click any key to read what it means.
          </p>

          <FieldExplorer fields={ENVELOPE_FIELDS} samples={ENVELOPE_SAMPLES} comments={ENVELOPE_COMMENTS} />

          <div className="note" style={{ marginTop: 24 }}>
            <p>
              <b>The rules that bite.</b> Emit <code>som_version: "1.0.0"</code> and never branch on it.{' '}
              <code>message_type</code> is the only discriminator. <code>correlation_id</code> is required.{' '}
              <code>topic</code> begins with <code>som.</code> Assert <code>format</code> — most validators silently
              accept a <code>message_id</code> that isn’t a UUID. <Link to="/envelope">Full envelope reference →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="numbers">
        <div className="wrap">
          <p className="eyebrow">By the numbers</p>
          <h2 className="mb0">The shape of the standard</h2>
          <div className="grid g4" style={{ marginTop: 30 }}>
            <div className="stat">
              <b>7</b>
              <span>message families, each a JSON Schema at a URL that won’t change for the life of 1.x</span>
            </div>
            <div className="stat">
              <b>3</b>
              <span>nouns — Story, Asset, Telling — transcribed from how newsrooms already work</span>
            </div>
            <div className="stat">
              <b>10</b>
              <span>published reference skills, plus one proposed, in the shared library</span>
            </div>
            <div className="stat">
              <b>14 + 17</b>
              <span>champion organisations and technology participants in SMART STORIES</span>
            </div>
          </div>
        </div>
      </section>

      <section id="who">
        <div className="wrap">
          <p className="eyebrow">Credits</p>
          <h2>Built by the industry, published for the industry</h2>
          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <p>
                SOM was argued into shape in the open — two hackathons, a weekly working group, and six months from
                kick-off to a working bus — and published as <b>version 1.0 on 12 September 2026</b> at IBC in
                Amsterdam.
              </p>
              <p>
                Its authors are {AUTHORS.slice(0, -1).join(', ')} and {AUTHORS[AUTHORS.length - 1]}. Jon Roberts,
                Morag McIntosh and Alex Bassett conceived the model and led the project, alongside Brian Hopman of AP;
                John Boucklos co-wrote the specification, led the schema to 1.0, and built the validators and the
                repository.
              </p>
              <p className="mb0">
                BBC R&amp;D worked on the TAMS junction. Google Cloud was title sponsor of the Accelerator project;
                Amazon Web Services provided the reference bus, dashboard and TAMS store; The Associated Press and The
                Weather Company provided data.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Open and unowned</span>
              <p className="small">
                No fee and nothing to sign. Schemas, examples, tools and skills are licensed Apache 2.0; the
                specification prose is CC BY 4.0. Those licences are the whole of the terms.
              </p>
              <p className="small">
                The Accelerator has ended; the working group has not. It is open to anyone implementing the model or
                affected by it, and every change arrives as a pull request anyone may open.
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
              <h4>Participants · 17</h4>
              <ul>
                {PARTICIPANTS.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <p className="small muted mb0">
              Roster as recorded in the specification’s{' '}
              <a href={`${SPEC_REPO_URL}/blob/main/CONTRIBUTORS.md`} target="_blank" rel="noreferrer">
                CONTRIBUTORS.md ↗
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap narrow">
          <p className="eyebrow">Common questions</p>
          <h2 style={{ marginBottom: 28 }}>Before you ask</h2>
          <Accordion items={FAQS} />
        </div>
      </section>

      <section id="reading">
        <div className="wrap">
          <p className="eyebrow">Further reading</p>
          <h2>Straight from the source</h2>
          <p className="lede">
            This site is an unofficial, secondary guide. These are the primary sources — the first three are the
            standard itself.
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
          <h2>Read it. Build against it. Tell them what breaks.</h2>
          <p className="lede" style={{ margin: '0 auto 26px' }}>
            The specification is published and free to implement. To build against it, write skills, run a Story
            Archaeology session or join the working group, get in touch with the project directly.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link className="btn primary" to="/get-started">
              Get started →
            </Link>
            <a className="btn" href={INVOLVED_FORM_URL} target="_blank" rel="noreferrer">
              Get involved ↗
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
