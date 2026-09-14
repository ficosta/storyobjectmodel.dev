import { Link } from 'react-router-dom';
import { PageHead, PhaseStepper, useHashScroll } from '../components/Bits';
import type { Phase } from '../components/Bits';
import { BEHAVIOURS, PRINCIPLES } from '../data/reading';
import { repoFile } from '../data/consortium';

const PHASES: Phase[] = [
  {
    key: 'dev',
    name: 'DEVELOPING',
    title: 'DEVELOPING',
    body: (
      <>
        <p>
          The story exists and is being worked. Fields arrive over successive snapshots: a <code>premise</code> with a
          confidence, early <code>editorial_source[]</code> entries, the first assets and assertions.
        </p>
        <p className="small muted mb0">
          Each change is a new full snapshot with a higher <code>sequence_number</code>. Tools reading the story
          re-evaluate against every one.
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
          The story is considered fit to go out. Whatever still has to be settled first is expressed as{' '}
          <code>editorial_gates[]</code> entries whose <code>blocks[]</code> name what they hold — an asset, or a
          lifecycle phase.
        </p>
        <p className="small muted mb0">
          A gate is <code>PENDING</code>, <code>APPROVED</code> or <code>REJECTED</code>. Gates combine by
          conjunction: every binding gate must permit.
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
          The story is live and moving fast — exactly when figures are unconfirmed and holds matter most. Speed comes
          from every tool seeing the same state at once, not from skipping a gate.
        </p>
        <p className="small muted mb0">
          Priority is separate from phase: <code>priority.level</code> runs <code>ROUTINE</code>,{' '}
          <code>STANDARD</code>, <code>HIGH</code>, <code>URGENT</code>, <code>FLASH</code>.
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
          The story has gone out, and it keeps moving: corrections, new media arrivals and distribution events all
          produce new snapshots and events.
        </p>
        <p className="small muted mb0">
          After publication the distribution families carry the weight: links commit assets to destinations, tellings
          record exposure, and the audit family keeps the trail.
        </p>
      </>
    ),
  },
];

const GLOSSARY: [string, React.ReactNode][] = [
  ['Story', <>The happening in the world, held as a context its publisher owns and asserts. Published as full <code>story.context</code> snapshots keyed by an immutable <code>story_id</code>.</>],
  ['Asset', <>A discrete piece of media or editorial work on a story, classified by evidential position (<code>PRIMARY</code> / <code>SECONDARY</code> / <code>TERTIARY</code>). Exists whether or not anything is published from it.</>],
  ['Telling', <>The moment an asset meets an audience through a destination, with immutable <code>exposure_start</code> / <code>exposure_end</code>. On-air state is derived from tellings.</>],
  ['Link', <>An asset committed to a destination, with a compliance gate per destination (<code>PENDING</code> / <code>CLEARED</code> / <code>BLOCKED</code>).</>],
  ['Source (TAMS)', <>Media addressed as <code>tams://store/id</code> plus an optional time range. SOM references Sources, never Flows.</>],
  ['Locator', <>A non-TAMS media reference: <code>store</code> + <code>ref</code>. A MAM path, an object key, a CMS id.</>],
  ['Assertion', <>A claim about a story, asset, link or telling — <code>FACT_CHECK</code>, <code>DETECTION</code> or <code>MATCH</code> — with provenance and a review state. The authoritative home of a confirmed fact.</>],
  ['Provenance', <>Who or what authored an output: <code>HUMAN</code> or <code>MODEL</code>. Authorship-general, never AI-keyed.</>],
  ['Editorial gate', <>Something that must be settled before an asset or phase proceeds. <code>PENDING</code> / <code>APPROVED</code> / <code>REJECTED</code>.</>],
  ['Orphan', <>A minimal shell story (<code>story_type: ORPHAN</code>) minted to hold a clip that arrived with no story, until a proposed match is confirmed.</>],
  ['Skill', <>A passive rule file in the agentskills.io shape. It declares; it never acts, and never changes content.</>],
  ['Executor', <>The part of a vendor tool that recalls skills, publishes their warnings and decides what the tool withholds. Tools have executors; newsrooms do not have a central one.</>],
  ['Configured instance', <>One generic skill file with one house’s values loaded, watching one condition. A house runs several off the same file.</>],
  ['Story Archaeology', <>The method behind the model: trace one real story after transmission and record how its context actually moved.</>],
  ['Extension', <><code>extensions["com.&#123;vendor&#125;.&#123;field&#125;"]</code> — the defined place for fields the standard doesn’t carry. Unknown keys are ignored.</>],
];

export default function Concepts() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Concepts"
        title="SOM in ten minutes"
        lede="Three nouns, one snapshot, and a handful of rules about who writes and who decides. Learn these and the schemas read themselves."
        toc={[
          { href: '#nouns', label: 'Story · Asset · Telling' },
          { href: '#snapshots', label: 'Snapshots' },
          { href: '#lifecycle', label: 'Lifecycle' },
          { href: '#evidence', label: 'Evidence & claims' },
          { href: '#gates', label: 'Gates & audit' },
          { href: '#skills', label: 'Declare, then act' },
          { href: '#principles', label: 'Principles' },
          { href: '#glossary', label: 'Glossary' },
        ]}
      />

      <section id="nouns">
        <div className="wrap">
          <p className="eyebrow">The three nouns</p>
          <h2>Story, Asset, Telling</h2>
          <p className="lede">
            A story is a real-world event: it grows, splits and changes direction, and nobody knows its shape until
            it’s over. Mapping that onto a schema came down to three words journalists already use.
          </p>

          <div className="grid g3" style={{ marginTop: 28 }}>
            <div className="card">
              <div className="lane-icon">S</div>
              <h3>Story</h3>
              <p className="small">
                The happening. What it is about (<code>tags[]</code>, <code>story_meaning</code>), where it has got to
                (<code>lifecycle</code>, <code>priority</code>), what the newsroom expects (<code>premise</code>), its
                sources and their credibility, and the gates and compliance flags standing on it.
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
                What the newsroom gathers and makes: <code>VIDEO</code>, <code>SCRIPT</code>, <code>GRAPHIC</code>,{' '}
                <code>TRANSCRIPT</code>, and generative outputs such as <code>SUMMARY</code> and{' '}
                <code>SOCIAL_POST</code>. References only — media stays in its store.
              </p>
              <p className="small muted mb0">
                <code>status</code> is editorial only: <code>READY</code>, <code>IN_PRODUCTION</code>,{' '}
                <code>PREPARED</code>, <code>INVALIDATED</code>. “Live” and “aired” are never stored here.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">T</div>
              <h3>Telling</h3>
              <p className="small">
                An asset meeting an audience through a destination. It follows a <b>link</b> — the commitment of that
                asset to that destination — and records when exposure started and ended.
              </p>
              <p className="small muted mb0">
                The compliance position belongs to the telling. The same asset can be cleared on one link and blocked
                on another at the same moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="snapshots">
        <div className="wrap">
          <p className="eyebrow">Snapshots, never deltas</p>
          <h2>A story is published whole, every time</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <ul className="clean">
                <li>
                  <code>story_id</code> is immutable. A revision is the next snapshot, not a new story.
                </li>
                <li>
                  <code>sequence_number</code> MUST increase and <code>updated_at</code> MUST move forward.
                </li>
                <li>
                  Whoever publishes re-stamps <code>originating_system</code>, so a correction is attributed to the
                  corrector, not to whoever first minted the story.
                </li>
                <li>
                  One writer mints: the publisher’s story management system owns the story and its sequence — never the
                  wire, even on a flash.
                </li>
                <li>
                  A tool that joins late, restarts or reconnects after an outage reads one object and is current.
                </li>
              </ul>
            </div>
            <div className="card">
              <span className="kicker">The most damaging error</span>
              <h3>Omission means absent, not unchanged</h3>
              <p className="small">
                A producer MUST NOT leave out fields it didn’t modify. A writer that sends only its own fields silently
                erases every other system’s work on the story.
              </p>
              <p className="small mb0">
                The specification ships <code>tools/validate_sequence.py</code> to check a run of snapshots for exactly
                these properties — the bugs no single message can reveal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="lifecycle">
        <div className="wrap">
          <p className="eyebrow">Story lifecycle</p>
          <h2>Four phases, only on active stories</h2>
          <p className="lede" style={{ marginBottom: 26 }}>
            A <code>lifecycle</code> block is required when <code>story_type</code> is <code>ACTIVE</code> and
            forbidden otherwise — a schema rule, not a convention. Select a phase.
          </p>

          <PhaseStepper phases={PHASES} />

          <div className="note" style={{ marginTop: 24 }}>
            <p className="mb0">
              <b>Orphans.</b> A clip that arrives with no story gets a minimal <code>ORPHAN</code> shell story to hold
              it, carrying a <code>MATCH</code> assertion that proposes the real story. On confirmation the clip moves —
              same <code>asset_id</code>, original timestamps — and the shell always retires to <code>ARCHIVED</code>.
              It is never deleted, and consumers filter orphans out with one <code>story_type</code> predicate.
            </p>
          </div>
        </div>
      </section>

      <section id="evidence">
        <div className="wrap">
          <p className="eyebrow">Evidence &amp; claims</p>
          <h2>Where things came from, and what is being claimed</h2>

          <div className="grid g3" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">editorial_source[]</span>
              <h3>Sources and credibility</h3>
              <p className="small mb0">
                Each source carries a type (<code>WIRE</code>, <code>OFFICIAL</code>, <code>USER_GENERATED</code>, …)
                and a declared <code>credibility</code>: <code>TRUSTED</code>, <code>VERIFIED</code>,{' '}
                <code>ENDORSED</code> or <code>UNVERIFIED</code>. Credibility is a different axis from media
                authenticity.
              </p>
            </div>
            <div className="card">
              <span className="kicker">assets[].provenance</span>
              <h3>Authorship</h3>
              <p className="small mb0">
                <code>HUMAN</code> or <code>MODEL</code>, with model and version only for models. A C2PA{' '}
                <code>authenticity_credential</code> records <code>present: false</code> rather than hiding its
                absence. Confidence is optional — don’t invent one for free text.
              </p>
            </div>
            <div className="card">
              <span className="kicker">assertions[]</span>
              <h3>Claims under review</h3>
              <p className="small mb0">
                <code>FACT_CHECK</code> (a metric and value), <code>DETECTION</code> or <code>MATCH</code>, each with a{' '}
                <code>review</code> of <code>PENDING</code>, <code>CONFIRMED</code> or <code>REJECTED</code>. Rejected
                entries are marked, never deleted. On any disagreement, the assertion wins.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="gates">
        <div className="wrap">
          <p className="eyebrow">Gates &amp; audit</p>
          <h2>Nothing reaches an audience without an editorial gate</h2>
          <p className="lede">
            A skill declares, the tool that owns the executor decides, and a person approves. A clearance is granted to
            a version of the words, so a rewrite reopens the gate rather than inheriting the approval.
          </p>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card sev hold">
              <h3>hold</h3>
              <p className="small mb0">
                The executor MUST withhold output on the affected fields. Released only by a clearance on the same
                scope — not by time passing, and not by the flag vanishing from a later snapshot.
              </p>
            </div>
            <div className="card sev flag">
              <h3>flag</h3>
              <p className="small mb0">Mark for review. A tool may show it; nothing is withheld because of it alone.</p>
            </div>
            <div className="card sev inform">
              <h3>inform</h3>
              <p className="small mb0">Advisory only. No blocking action and no mandatory response.</p>
            </div>
          </div>

          <div className="grid g2" style={{ marginTop: 22, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Conjunction</span>
              <p className="small mb0">
                Where several gates bind the same fact on the same telling, it is served only when <b>every</b> gate
                permits — any one hold means held. “Most restrictive wins” and “story owner takes precedence” were
                withdrawn in favour of this. Compliance fails closed, and a transform — trim, crop, caption burn —
                never lifts a hold.
              </p>
            </div>
            <div className="card">
              <span className="kicker">som.system.audit</span>
              <p className="small mb0">
                The governance trail. An <code>action</code> of <code>CLEARED</code>, <code>SUPPRESSED</code>,{' '}
                <code>WITHHELD</code> or <code>OVERRIDDEN</code>, against a <code>LINK</code>, <code>ASSET</code> or{' '}
                <code>TELLING</code>, with an actor and a reason. A suppression targets the held asset, because the
                branch that never airs never gets a link.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="wrap">
          <p className="eyebrow">Declare, then act</p>
          <h2>SOM carries context. Skills carry knowledge.</h2>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">The standard — shared</span>
              <p className="small mb0">
                What a story is, what state it’s in, what’s held and what’s cleared, where material came from. The same
                everywhere, and carrying no judgement of its own.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Skills — the house’s</span>
              <p className="small mb0">
                Editorial standards, compliance rules, institutional practice: what legitimately differs from one
                newsroom to the next. The framework is open; your workflow stays yours, and no vendor needs a copy of
                your policy.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Silence is a valid outcome.</b> A skill that finds nothing to declare says nothing, and a tool proves it
              read the story only by publishing in its turn. That is also why the audit trail is a by-product of how
              writes work rather than a feature somebody bolted on. <Link to="/skills">How recall works →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="principles">
        <div className="wrap">
          <p className="eyebrow">Principles</p>
          <h2>Why SOM is shaped the way it is</h2>
          <p className="lede">
            Six working principles open the specification, and they are the test any future change must pass.
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

          <h3 style={{ marginTop: 40, textAlign: 'center' }}>How it behaves</h3>
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
              <b>Where the standard stops.</b> SOM describes one story and everything true about it, and nothing more.
              What each newsroom does with what it reads is its own business. 1.0 is a commitment to stability, not a
              claim of completeness: what isn’t settled is written down in the{' '}
              <a href={repoFile('spec/open-register.md')} target="_blank" rel="noreferrer">
                open register ↗
              </a>
              .
            </p>
          </div>
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
          <p className="small muted" style={{ marginTop: 16 }}>
            The full glossary lives in the specification:{' '}
            <a href={repoFile('spec/glossary.md')} target="_blank" rel="noreferrer">
              spec/glossary.md ↗
            </a>
          </p>
        </div>
      </section>

      <section>
        <div className="wrap center">
          <h2>Next: the wire format</h2>
          <p className="lede" style={{ margin: '0 auto 24px' }}>
            Every message shares one envelope. Here is every field, and what conformance asks of it.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link className="btn primary" to="/envelope">
              The envelope →
            </Link>
            <Link className="btn" to="/bus">
              The seven families
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
