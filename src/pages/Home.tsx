import { Link } from 'react-router-dom';
import AccentWord from '../components/AccentWord';
import LoopDiagram from '../components/LoopDiagram';
import FieldExplorer from '../components/FieldExplorer';
import { Accordion, useHashScroll } from '../components/Bits';
import { ENVELOPE_FIELDS } from '../data/envelope';
import { FAQS } from '../data/topics';

const ENVELOPE_SAMPLES: Record<string, string> = {
  som_version: '"0.3.2"',
  message_id: '"0190a000-…-aaa1"',
  correlation_id: '"0190a000-…-0c14"',
  causation_id: '"0190a000-…-91ff"',
  message_type: '"story.context"',
  timestamp: '"2026-06-12T09:30:00Z"',
  originating_system: '{ "system_id": "enps-lon-01", … }',
  topic: '"som.story.context"',
  modification_header: '{ "story_version": 7, … }',
  _actors: '{ "ed1": { … } }',
  '@context': 'null',
  extensions: '{ "com.nbcu.desk": "news" }',
  payload: '{ … }',
};

const ENVELOPE_COMMENTS: Record<string, string> = {
  payload: 'the typed, schema-validated payload',
};

/** The organisations that proposed the standard. Heights are tuned per mark so
 *  wildly different aspect ratios read at the same optical weight. */
const PROPOSERS: { name: string; logo: string; height: number }[] = [
  { name: 'Associated Press', logo: '/logos/ap.svg', height: 42 },
  { name: 'NBCUniversal', logo: '/logos/nbcu.svg', height: 22 },
  { name: 'ITN', logo: '/logos/itn.svg', height: 40 },
  { name: 'BBC', logo: '/logos/bbc.svg', height: 26 },
];

const REPO =
  'https://github.com/google/virtual-broadcast-production-assistant/tree/main/som-hackathon-starter-dotnet';

export default function Home() {
  useHashScroll();

  return (
    <>
      <div className="hero">
        <div className="wrap">
          <h1>
            One bus for <AccentWord>story context</AccentWord>.
            <br />
            Every tool on it.
          </h1>
          <p className="lede">
            The Story Object Model is an open standard for sharing editorial story context between newsroom
            systems. No point-to-point integrations, no vendor lock-in — one set of typed messages every tool can
            read and write.
          </p>
          <div className="btn-row">
            <Link className="btn primary" to="/get-started">
              Start here
            </Link>
            <Link className="btn" to="/concepts">
              SOM in five minutes
            </Link>
          </div>
        </div>
      </div>

      <div className="credits">
        <div className="wrap">
          <p>Proposed by these newsroom organisations</p>
          <ul>
            {PROPOSERS.map((o) => (
              <li key={o.name}>
                <img src={o.logo} alt={o.name} style={{ height: o.height }} />
              </li>
            ))}
          </ul>
          <p className="co">
            Co-championed by Channel 4, Al Jazeera, The Washington Post, Sky and ITV, as the SMART STORIES IBC
            Accelerator project.
          </p>
        </div>
      </div>

      <section id="loop">
        <div className="wrap">
          <p className="eyebrow">The core loop</p>
          <h2>A story lands. Skills react. A human decides.</h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            Every SOM deployment runs the same shape. A story is published as a full snapshot, skills evaluate it,
            their outputs wait in staging, and nothing reaches the production bus without an editorial decision.
          </p>

          <LoopDiagram />

          <div className="grid g4" style={{ marginTop: 26 }}>
            <div className="card">
              <span className="kicker">01 · Snapshot</span>
              <p className="mb0 small">
                A story is republished <b>in full</b> on every change. <code>sequence_number</code> increments;
                there are no deltas. Consumers keep the latest version per <code>story_id</code>.
              </p>
            </div>
            <div className="card">
              <span className="kicker">02 · Recall</span>
              <p className="mb0 small">
                The executor matches each story against every skill’s <b>advert</b> — a machine-readable claim of
                what it reads, fires on, and produces. Deterministic, not guessed.
              </p>
            </div>
            <div className="card">
              <span className="kicker">03 · Staging</span>
              <p className="mb0 small">
                Skill outputs never go straight to production. They land on <code>som.skills.staging</code> and
                wait.
              </p>
            </div>
            <div className="card">
              <span className="kicker">04 · Decision</span>
              <p className="mb0 small">
                An editor approves or rejects. Either way the decision is republished in a fresh attributed
                envelope and recorded on <code>som.system.audit</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="start">
        <div className="wrap">
          <p className="eyebrow">Start here</p>
          <h2>Three ways onto the bus</h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            Anything that speaks JSON over a message bus can join. What you implement depends on the role you play.
          </p>

          <div className="grid g3">
            <Link className="card" to="/envelope">
              <div className="lane-icon">▤</div>
              <h3>You publish stories</h3>
              <p className="small">
                An NRCS, a wire service, a rundown system. You produce <code>story.context</code> snapshots: stable{' '}
                <code>story_id</code>, incrementing <code>sequence_number</code>, fresh <code>message_id</code> per
                publish, one <code>correlation_id</code> per story lifecycle.
              </p>
              <span className="more">The envelope, field by field →</span>
            </Link>
            <Link className="card" to="/skills">
              <div className="lane-icon">◈</div>
              <h3>You build a skill</h3>
              <p className="small">
                A compliance check, a style check, an enrichment. A skill is <b>data, not code</b> — one JSON file
                of rules, interpreted by the executor. Outputs ride the approval gate like everything else.
              </p>
              <span className="more">Skill anatomy &amp; rule types →</span>
            </Link>
            <Link className="card" to="/bus">
              <div className="lane-icon">⇄</div>
              <h3>You move media</h3>
              <p className="small">
                A MAM, a TAMS store, a transcription service. You announce availability with{' '}
                <code>delivery.media_available</code> and resolve stories stream-first through <code>asset_id</code>.
              </p>
              <span className="more">Topics &amp; distribution layer →</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="why">
        <div className="wrap">
          <p className="eyebrow">Why SOM matters</p>
          <h2>What changes when story context is shared</h2>

          <div className="grid g3" style={{ marginTop: 28 }}>
            <div className="card">
              <h3>n×n becomes n</h3>
              <p className="small">
                Every newsroom integration project starts by wiring one system to another, then another. SOM
                replaces that mesh with a bus: you implement the standard once and every other participant is
                reachable.
              </p>
            </div>
            <div className="card">
              <h3>Automation without loss of control</h3>
              <p className="small">
                Skills are passive and data-driven — they observe and advise, they never act unilaterally. The
                staging topic plus a human gate is the core safety pattern, and it is part of the standard, not an
                afterthought.
              </p>
            </div>
            <div className="card">
              <h3>Everything is on the record</h3>
              <p className="small">
                Runs, decisions, non-actions. A <b>safe-state stop</b> — when the correct action is unclear, do
                nothing and <em>record</em> the non-action as <code>WITHHELD</code> — is a first-class outcome, not
                a silent failure.
              </p>
            </div>
            <div className="card">
              <h3>Vendor-neutral by construction</h3>
              <p className="small">
                Typed messages, a closed envelope, schema-validated payloads. Anything the spec doesn’t cover yet
                rides under <code>extensions["com.&#123;vendor&#125;.&#123;field&#125;"]</code> — a sanctioned
                namespace with a clean promotion path.
              </p>
            </div>
            <div className="card">
              <h3>Media stays where media lives</h3>
              <p className="small">
                SOM carries metadata and references — never bytes. An asset points at a TAMS Source URI; the store
                announces arrival; retrieval happens below the SOM boundary. SOM never proxies media and never
                queries the MAM.
              </p>
            </div>
            <div className="card">
              <h3>Stream-first, no query API</h3>
              <p className="small">
                There is no “fetch me story X” endpoint. Stories republish in full on every change, so a
                late-joining consumer replays from the earliest retained offset and keeps the latest version per
                story. Resolution is by design a stream concern.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="who">
        <div className="wrap">
          <p className="eyebrow">Who’s behind it</p>
          <h2>An industry specification, written by editors</h2>
          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <p>
                SOM is being specified by <b>SMART STORIES</b>, an IBC Accelerator project proposed by the
                Associated Press, NBCUniversal, ITN and the BBC, with co-champions including Channel 4, Al Jazeera,
                The Washington Post, Sky and ITV, and technology participants spanning newsroom, media and cloud
                vendors.
              </p>
              <p>
                The distinguishing choice is who holds the pen: the specification is written by working editors,
                not only by architects. The deliverables are the spec itself, a reference architecture, a reference
                implementation, an integration guide and live multi-vendor demonstrations.
              </p>
              <p className="mb0">
                The four ideas it rests on: a shared story structure that carries editorial context{' '}
                <em>without interpreting it</em>; story agents that track change across tools; processing that
                stays decentralised inside each vendor’s own software; and a Skills reference architecture that
                makes editorial rules portable.
              </p>
            </div>
            <div className="card">
              <span className="kicker">The problem, stated plainly</span>
              <p className="small">
                Story state, verification status, compliance sign-offs and the links between stories already exist
                in a newsroom — but they live in people’s heads and in conversations. They never got written down
                in a form a system could carry, so they never moved between systems.
              </p>
              <p className="small mb0">
                Which matters more the more automation is in the building: a tool with no access to editorial
                context doesn’t decline to answer. It fills the gap with an assumption, and the assumption looks
                exactly like a fact.{' '}
                <a
                  href="https://www.octopus-news.com/writing-an-open-standard-for-story-context-an-interview-with-milan-varga/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Background interview ↗
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="fits">
        <div className="wrap">
          <p className="eyebrow">Where SOM fits in</p>
          <h2>SOM isn’t here to replace your systems</h2>
          <p className="lede">
            It sits between them. Your NRCS stays your NRCS; your MAM stays your MAM. SOM is the shared vocabulary
            they use to talk about the same story.
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
                    <b>NRCS / rundown</b>
                    <br />
                    <span className="muted small">ENPS, iNEWS, Octopus…</span>
                  </td>
                  <td>Authoring, rundowns, editorial truth</td>
                  <td>
                    Publishes <code>story.context</code> snapshots onto the bus. SOM does not author.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>MAM / TAMS store</b>
                  </td>
                  <td>Essence, renditions, retrieval</td>
                  <td>
                    Announces <code>delivery.media_available</code>. SOM references Sources, never Flows, and never
                    moves bytes.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>MOS</b>
                  </td>
                  <td>Device control, playlist item state</td>
                  <td>
                    Complementary. MOS moves items to devices; SOM shares the editorial context around the story.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Graphics &amp; playout</b>
                    <br />
                    <span className="muted small">
                      incl. <a href="https://ograf.dev">OGraf</a>
                    </span>
                  </td>
                  <td>Rendering and on-air execution</td>
                  <td>
                    Consumes story context and on-air <b>Telling</b> events. SOM describes what is happening; the
                    renderer does it.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>AI / ML tooling</b>
                  </td>
                  <td>Transcription, summarisation, checks</td>
                  <td>
                    Joins as a skill or an external executor. Generative output that publishes is an{' '}
                    <code>assets[]</code> entry with <code>provenance</code>; claims about content are{' '}
                    <code>assertions[]</code>.
                  </td>
                </tr>
              </tbody>
            </table>
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
              <b>Five rules that bite integrators.</b> <code>som_version</code> is informative — never gate on it.{' '}
              <code>correlation_id</code> is required and must be threaded end-to-end. <code>timestamp</code> lives
              on the envelope, never in the payload. <code>originating_system</code> replaced <code>source</code> at
              v0.3 and the old field is hard-rejected. Message-type names are <b>suffixed</b> on the wire.{' '}
              <Link to="/envelope">Full envelope reference →</Link>
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
              <b>9</b>
              <span>topic families on the bus — 5 in the core skill loop, 4 in the distribution layer</span>
            </div>
            <div className="stat">
              <b>12</b>
              <span>
                fields in the normative <code>skill.warning.raised</code> payload
              </span>
            </div>
            <div className="stat">
              <b>7</b>
              <span>built-in rule types — enough for most editorial logic without writing code</span>
            </div>
            <div className="stat">
              <b>3</b>
              <span>validation layers before a skill goes live: static, dry-run, AI review</span>
            </div>
          </div>
        </div>
      </section>

      <section id="learn">
        <div className="wrap">
          <p className="eyebrow">Learn by building</p>
          <h2>Four things worth doing first</h2>
          <div className="grid g2" style={{ marginTop: 26 }}>
            <Link className="card" to="/get-started#quickstart">
              <span className="kicker">15 minutes · beginner</span>
              <h3>Run the loop end to end</h3>
              <p className="small">
                Bring up the bus and the reference dashboard, publish a seed story, watch two style warnings
                appear, approve one and reject the other.
              </p>
              <span className="more">Quick start →</span>
            </Link>
            <Link className="card" to="/skills#anatomy">
              <span className="kicker">30 minutes · beginner</span>
              <h3>Write your first skill</h3>
              <p className="small">
                One JSON file: an <code>advert</code>, a couple of rules, a <code>detail_template</code>. Register
                it, dry-run it against the seed stories, then go live.
              </p>
              <span className="more">Skill anatomy →</span>
            </Link>
            <Link className="card" to="/bus#delivery">
              <span className="kicker">45 minutes · intermediate</span>
              <h3>Wire up the TAMS junction</h3>
              <p className="small">
                Emit a rolling media arrival, then a capture-complete one, and watch an asset flip{' '}
                <code>CAPTURING → CAPTURED</code> and the skills re-run against the new snapshot.
              </p>
              <span className="more">Distribution layer →</span>
            </Link>
            <Link className="card" to="/bus#safestate">
              <span className="kicker">20 minutes · intermediate</span>
              <h3>Trigger a safe-state stop</h3>
              <p className="small">
                Announce media that matches no story. Nothing is created, nothing is guessed — a{' '}
                <code>WITHHELD</code> record lands on the audit topic. That is the system working.
              </p>
              <span className="more">Governance trail →</span>
            </Link>
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

      <section id="cta">
        <div className="wrap center">
          <h2>Put something on the bus</h2>
          <p className="lede" style={{ margin: '0 auto 26px' }}>
            Bring up the reference stack, publish a seed story, and watch the loop run.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link className="btn primary" to="/get-started">
              Get started →
            </Link>
            <a className="btn" href={REPO} target="_blank" rel="noreferrer">
              Reference implementation ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
