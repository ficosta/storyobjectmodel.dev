import { Link } from 'react-router-dom';
import { PageHead, PhaseStepper, useHashScroll } from '../components/Bits';
import type { Phase } from '../components/Bits';

const PHASES: Phase[] = [
  {
    key: 'dev',
    name: 'DEVELOPING',
    title: 'DEVELOPING',
    body: (
      <>
        <p>
          The story exists and is being worked. Fields arrive incrementally: a premise with a confidence score,
          early editorial sources, the first assets.
        </p>
        <p className="small muted mb0">
          Every field that arrives is another full republish, and every republish re-runs the skills. This is the
          phase where enrichment and advisory <code>inform</code> warnings do most of their work.
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
          The story is considered fit to go out. This is where completeness checks earn their keep — the{' '}
          <code>phase_with_missing_field</code> rule type exists precisely to say “the story is in <em>this</em>{' '}
          phase and <em>that</em> field is still empty”.
        </p>
        <p className="small muted mb0">
          Editorial gates (<code>editorial_gates[]</code>) such as an <code>EDITORIAL_HOLD</code> are the mechanism
          for holding a story here deliberately.
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
          The story is live and moving fast — and it is where the safety properties of the model matter most. A
          missing <code>compliance</code> block on a story at <code>priority.level: URGENT</code> is exactly the
          shape one of the reference seed scenarios is built to expose.
        </p>
        <p className="small muted mb0">
          Nothing about “breaking” loosens the approval gate. Speed comes from skills surfacing the right thing
          quickly, not from skipping the human.
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
          The story has gone out. It does not stop moving — corrections, new media arrivals and distribution events
          keep producing republishes, and skills keep re-running against each one.
        </p>
        <p className="small muted mb0">
          Post-publication is where the distribution layer carries the weight: Links commit assets to destinations,
          Tellings record on-air exposure, and the audit topic keeps the trail.
        </p>
      </>
    ),
  },
];

const GLOSSARY: [string, React.ReactNode][] = [
  ['Story', <>The editorial unit; published as full <code>story.context</code> snapshots, keyed by <code>story_id</code>.</>],
  ['Asset', <>A piece of content on a story (video, script, graphic) with editorial <code>status</code> and, for media, <code>media_refs[]</code> + <code>acquisition_state</code>.</>],
  ['Source (TAMS)', <>The stable editorial idea of a piece of media (<code>tams://store/id</code>); a Flow is one technical rendition of it. SOM references Sources, never Flows.</>],
  ['Delivery', <>The availability handshake: media became reachable in a store (<code>delivery.media_available</code>).</>],
  ['Link', <>An Asset-to-Destination commitment, with a per-destination compliance gate.</>],
  ['Telling', <>An on-air exposure event; on-air state is derived from Tellings, never stored on the asset.</>],
  ['Skill', <>A passive, data-driven newsroom automation; the executor runs it.</>],
  ['Story Agent', <>One agent per story, persistent from tip-off through distribution: it follows the story across tools, tracks change, and records interactions to an auditable trail.</>],
  ['Executor', <>The process that watches the bus, decides which skills apply, and runs their rules against each snapshot.</>],
  ['Advert', <>A skill’s machine-readable declaration of what it operates on, fires on, and produces.</>],
  ['Recall', <>The executor’s deterministic advert-matching step — deciding which skills run.</>],
  ['Staging', <>The pre-approval topic; nothing reaches the production bus without a human decision.</>],
  ['Safe-state stop', <>When the correct action is unclear, do nothing and record the non-action (<code>WITHHELD</code> on <code>som.system.audit</code>).</>],
  ['Envelope', <>The outer wrapper every SOM message shares; the payload inside is what schemas validate.</>],
  ['Extension', <><code>payload.extensions["com.&#123;vendor&#125;.&#123;field&#125;"]</code> — the sanctioned place for not-yet-ratified fields.</>],
  ['Instance', <>One surface a story airs on — linear newscast, web live-blog, social card — identified by <code>instance_id</code>.</>],
];

export default function Concepts() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Concepts"
        title="SOM in five minutes"
        lede="The whole model is four ideas: stories are snapshots, skills are data, decisions are human, and non-actions are recorded."
        toc={[
          { href: '#objects', label: 'The objects' },
          { href: '#snapshots', label: 'Snapshots' },
          { href: '#lifecycle', label: 'Lifecycle' },
          { href: '#skills', label: 'Skills & recall' },
          { href: '#boundary', label: 'The boundary' },
          { href: '#gate', label: 'The gate' },
          { href: '#safestate', label: 'Safe-state' },
          { href: '#glossary', label: 'Glossary' },
        ]}
      />

      <section id="objects">
        <div className="wrap">
          <p className="eyebrow">The objects</p>
          <h2>What SOM actually models</h2>
          <p className="lede">
            Seven nouns carry almost everything. Learn these and the message contracts read themselves.
          </p>

          <div className="grid g3" style={{ marginTop: 28 }}>
            <div className="card">
              <div className="lane-icon">S</div>
              <h3>Story</h3>
              <p className="small">
                The editorial unit, keyed by a stable <code>story_id</code>. Published as full{' '}
                <code>story.context</code> snapshots carrying headline, lifecycle phase, compliance flags,
                editorial sources, assets and gates.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">A</div>
              <h3>Asset</h3>
              <p className="small">
                A piece of content on a story — video, script, graphic — with an editorial <code>status</code> and,
                for media, <code>media_refs[]</code> plus an <code>acquisition_state</code>.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">◉</div>
              <h3>Source (TAMS)</h3>
              <p className="small">
                The stable editorial idea of a piece of media, addressed as <code>tams://store/id</code>. A{' '}
                <em>Flow</em> is one technical rendition of it — SOM references Sources, never Flows.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">⚙</div>
              <h3>Skill</h3>
              <p className="small">
                A passive, data-driven newsroom automation. It declares what it operates on, the executor decides
                when it runs, and its outputs are proposals — never actions.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">◎</div>
              <h3>Story Agent</h3>
              <p className="small">
                One per story, persistent from tip-off through distribution. It follows the story across every tool
                it touches, tracks what changed, asks the rest of the stack what is happening, and records every
                interaction to an auditable trail.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">→</div>
              <h3>Link</h3>
              <p className="small">
                An Asset-to-Destination commitment, with a compliance gate evaluated <b>per destination</b>. The
                same asset can be cleared for digital and blocked for broadcast at the same moment.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">◐</div>
              <h3>Telling</h3>
              <p className="small">
                An on-air exposure event. On-air state is <em>derived</em> from Tellings and never stored on the
                asset — because the same asset can be on air in more than one place at once.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="snapshots">
        <div className="wrap">
          <p className="eyebrow">Snapshots, not deltas</p>
          <h2>A story is republished in full, every time it changes</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <ul className="clean">
                <li>
                  <code>sequence_number</code> increments and <code>updated_at</code> moves on every republish.
                </li>
                <li>
                  Consumers keep the <b>latest version per <code>story_id</code></b>. There are no deltas to apply
                  and no ordering puzzle to solve.
                </li>
                <li>
                  Each republish gets a fresh <code>message_id</code> and <code>timestamp</code>, but keeps the same{' '}
                  <code>correlation_id</code>.
                </li>
                <li>Skills re-run on <b>every</b> new version — which is what makes change detection possible.</li>
                <li>
                  A consumer that joins late replays the story topic from the earliest retained offset. There is no
                  story query API; resolution is stream-first by design.
                </li>
              </ul>
            </div>
            <div className="card">
              <span className="kicker">Consequence</span>
              <h3>Change rules stay quiet on first sighting</h3>
              <p className="small">
                A rule of type <code>field_changed</code> compares the new snapshot against the previous version
                the executor saw. On the first sighting of a story — including right after a restart — there is
                nothing to compare against, so it does not fire.
              </p>
              <p className="small mb0">
                This trips people up constantly. If a change rule “never fires”, republish the story once so there
                is a baseline, then trigger the transition.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="lifecycle">
        <div className="wrap">
          <p className="eyebrow">Story lifecycle</p>
          <h2>Four phases, one direction</h2>
          <p className="lede" style={{ marginBottom: 26 }}>
            Only stories with <code>story_type: ACTIVE</code> carry a <code>lifecycle</code> block — that is a
            schema rule, not a convention. Select a phase to see what it means on the bus.
          </p>

          <PhaseStepper phases={PHASES} />

          <div className="note" style={{ marginTop: 24 }}>
            <p className="mb0">
              <b>Threading it together.</b> <code>correlation_id</code> ties every message about one story lifecycle
              — inbound snapshots, skill runs, staged warnings, decisions, audit records. Follow one id through the
              bus and you have the complete history of that story, in order, across every participant.
            </p>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="wrap">
          <p className="eyebrow">Skills &amp; recall</p>
          <h2>The executor decides what runs — deterministically</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Advert</span>
              <h3>A skill declares itself</h3>
              <p className="small">
                Every skill ships a machine-readable <b>advert</b>: what it <code>operates_on</code>, what it{' '}
                <code>fires_on</code>, and what it <code>produces</code>. It is a claim, and the executor holds you
                to it.
              </p>
              <pre>{`"advert": {
  "role": "compliance check",
  "operates_on": ["story.context"],
  "produces": ["skill.warning.raised"],
  "fires_on": ["headline", "assets[].acquisition_state"]
}`}</pre>
              <p className="small mb0 muted">
                If <code>operates_on</code> doesn’t include <code>story.context</code>, the executor skips the skill
                entirely — and says so in the log, once. That is the single most common reason a new skill “never
                runs”.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Recall</span>
              <h3>Matching, not guessing</h3>
              <p className="small">
                <b>Recall</b> is the executor’s step of deciding which skills apply to an incoming message. It is
                deterministic advert matching — no model, no heuristics, no ranking.
              </p>
              <p className="small">
                That matters for a newsroom: the set of checks that ran against a story is reproducible,
                explainable and auditable after the fact. Each execution produces a <code>skill.run.completed</code>{' '}
                record with latency, what it read, and what it emitted.
              </p>
              <p className="small mb0">
                A skill is <b>passive</b>. It observes a snapshot and proposes. It cannot mutate the story, and it
                cannot reach the production bus.
              </p>
            </div>
          </div>
          <p style={{ marginTop: 22 }}>
            <Link to="/skills">The seven rule types, skill anatomy and the validation layers →</Link>
          </p>
        </div>
      </section>

      <section id="boundary">
        <div className="wrap">
          <p className="eyebrow">The boundary</p>
          <h2>What belongs in SOM, and what doesn’t</h2>
          <p className="lede">
            This is the live argument in the standard, and the one worth understanding before you model anything.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">SOM — the common shape</span>
              <p className="small">
                The structure that can travel across organisations, vendors and story types. What a story is, what
                changed, what state it is in, how things relate.
              </p>
              <p className="small mb0">
                It carries editorial context and <b>interprets none of it</b>. SOM holds no intelligence — the
                intelligence stays inside each vendor’s own tools.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Skills — the logic</span>
              <p className="small">
                Editorial standards, compliance rules, show formats, institutional practice. The things that
                legitimately differ between one newsroom and the next.
              </p>
              <p className="small mb0">
                A broadcaster’s election coverage and an entertainment show can use the same model and apply it
                very differently. Written once, as portable configuration that agents in different systems can
                read.
              </p>
            </div>
          </div>

          <div className="note warn" style={{ marginTop: 24 }}>
            <p className="mb0">
              <b>Why the line is hard.</b> Draw it too broadly and the standard becomes rigid — every newsroom’s
              particular habits baked into something meant to be shared. Draw it too narrowly and it becomes too
              thin to be worth adopting. The project’s own working view is that the shared layer may end up{' '}
              <i>smaller</i> than people expect, and that this is fine: a useful common model doesn’t have to
              capture everything, only the right things.
            </p>
          </div>

          <div className="note" style={{ marginTop: 16 }}>
            <p className="mb0">
              <b>Status, honestly.</b> The line being drawn today may move once vendors start building against it.
              The public draft specification is due at IBC in September 2026; what this site documents is the
              schema pack and reference implementation as they stand, not a ratified standard. Treat the vendored
              schemas as the source of truth and expect the model to keep moving.
            </p>
          </div>
        </div>
      </section>

      <section id="gate">
        <div className="wrap">
          <p className="eyebrow">The approval gate</p>
          <h2>Nothing reaches production without a decision</h2>
          <p className="lede">
            This is the core safety pattern of the standard, and it is structural — an executor has no path to the
            production topic at all.
          </p>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card sev hold">
              <h3>hold</h3>
              <p className="small">
                The executor must withhold all output on the affected fields until the warning is resolved;
                subscribers must not use held content.
              </p>
              <p className="small mb0 muted">
                In the reference dashboard, <code>hold</code> lands red and cannot be cleared with a single click.
              </p>
            </div>
            <div className="card sev flag">
              <h3>flag</h3>
              <p className="small">Output is marked as requiring review. Subscribers may display a visual warning.</p>
              <p className="small mb0 muted">Lands yellow with a standard approve / reject.</p>
            </div>
            <div className="card sev inform">
              <h3>inform</h3>
              <p className="small">
                Advisory only — no blocking action, no mandatory response from any subscriber.
              </p>
              <p className="small mb0 muted">Lands blue and auto-clears once acknowledged.</p>
            </div>
          </div>

          <div className="grid g2" style={{ marginTop: 22, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">On approve</span>
              <p className="small mb0">
                The payload is republished to <code>som.skills.events</code> in a <b>fresh, gate-attributed
                envelope</b> — new <code>message_id</code> and <code>timestamp</code>, <code>causation_id</code>{' '}
                pointing at the staged message. The reviewer and time ride in <code>payload.extensions</code>, and a{' '}
                <code>CLEARED</code> record lands on <code>som.system.audit</code>.
              </p>
            </div>
            <div className="card">
              <span className="kicker">On reject</span>
              <p className="small mb0">
                Same shape, to <code>som.skills.rejected</code>, with the rejecting reviewer in extensions and a{' '}
                <code>WITHHELD</code> audit record. A reject is not a deletion — it is a terminal non-action,
                recorded as one.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="safestate">
        <div className="wrap narrow">
          <p className="eyebrow">Safe-state stop</p>
          <h2>Doing nothing is a result, and it gets written down</h2>
          <p>
            When the correct action is unclear, a SOM participant does nothing — and <em>records</em> the
            non-action as <code>WITHHELD</code> on <code>som.system.audit</code>. This is the rule that keeps an
            automated newsroom honest: silence and refusal look identical from the outside unless refusal is
            logged.
          </p>
          <div className="note warn">
            <p className="mb0">
              <b>The canonical example.</b> A media store announces that a clip has arrived, and the clip’s{' '}
              <code>asset_id</code> matches no story on the bus. The reference coordinator re-checks for about a
              second, then stops: it does <b>not</b> invent a story, and it does <b>not</b> drop the event
              silently. It writes a <code>WITHHELD</code> audit record and moves on. Creating a story from
              unmatched media is a separate, explicitly opt-in preview lane.
            </p>
          </div>
          <p className="mb0">
            The same vocabulary covers human decisions: an editor’s reject is a <code>WITHHELD</code> too. One audit
            topic, one grammar, whether the non-action came from a machine or a person.
          </p>
        </div>
      </section>

      <section id="glossary">
        <div className="wrap">
          <p className="eyebrow">Glossary</p>
          <h2>The vocabulary</h2>
          <div className="table-scroll" style={{ marginTop: 22 }}>
            <table>
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Meaning</th>
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
        </div>
      </section>

      <section>
        <div className="wrap center">
          <h2>Next: the wire format</h2>
          <p className="lede" style={{ margin: '0 auto 24px' }}>
            Every message shares one envelope. Here is every field in it, and the five rules that bite integrators.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link className="btn primary" to="/envelope">
              The envelope →
            </Link>
            <Link className="btn" to="/bus">
              Topics &amp; the bus
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
