import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../components/Bits';
import {
  CONTACT_EMAIL,
  DEMOS_URL,
  EMULATOR_URL,
  INVOLVED_FORM_URL,
  SCHEMA_BASE_URL,
  SPEC_REPO_URL,
  repoDir,
  repoFile,
} from '../data/consortium';

export default function GetStarted() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Build"
        title="Get started"
        lede="Read the short documents, run the conformance corpus, validate your own message with format assertion on, and publish it. Then pick a tier and talk to the working group."
        toc={[
          { href: '#read', label: 'Read first' },
          { href: '#corpus', label: 'Run the corpus' },
          { href: '#validate', label: 'Validate in TypeScript' },
          { href: '#publish', label: 'Publish a story' },
          { href: '#tiers', label: 'Integration tiers' },
          { href: '#involved', label: 'Get involved' },
        ]}
      />

      <section id="read">
        <div className="wrap">
          <p className="eyebrow">Step 1</p>
          <h2>Read four things, in this order</h2>
          <div className="grid g4" style={{ marginTop: 26 }}>
            <a className="card" href={repoFile('spec/introduction.md')} target="_blank" rel="noreferrer">
              <span className="kicker">01 · for everyone</span>
              <h3>Introduction ↗</h3>
              <p className="small mb0">Why SOM exists, the three nouns, and the six principles.</p>
            </a>
            <a className="card" href={repoFile('spec/conformance.md')} target="_blank" rel="noreferrer">
              <span className="kicker">02 · for implementers</span>
              <h3>Conformance ↗</h3>
              <p className="small mb0">What it means to be SOM 1.0 conformant — shorter than you expect.</p>
            </a>
            <a className="card" href={repoDir('examples/hurricane-run')} target="_blank" rel="noreferrer">
              <span className="kicker">03 · the clearest picture</span>
              <h3>The hurricane run ↗</h3>
              <p className="small mb0">One story told across seven snapshots.</p>
            </a>
            <a className="card" href={`${SCHEMA_BASE_URL}/story-context.schema.json`} target="_blank" rel="noreferrer">
              <span className="kicker">04 · your first family</span>
              <h3>story-context schema ↗</h3>
              <p className="small mb0">The family you will almost certainly implement first.</p>
            </a>
          </div>
        </div>
      </section>

      <section id="corpus">
        <div className="wrap">
          <p className="eyebrow">Step 2</p>
          <h2>Run the conformance corpus</h2>
          <p className="lede">
            The specification repository ships worked examples that must validate, twenty negative cases that must be
            rejected, and pure-Python tools that check both.
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
              <span className="kicker">Four different questions</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  Is this message legal? — <code>validate.py</code>
                </li>
                <li>
                  Do the schemas actually constrain? — <code>validate_negative.py</code>. Nineteen cases fail on the
                  schemas; the twentieth, <code>som_version: "0.3.2"</code>, fails on the wire-version rule, which your
                  implementation must apply itself.
                </li>
                <li>
                  Does the schema match what it says about itself? — <code>som_lint.py</code>
                </li>
                <li>
                  Does a run of snapshots hold together? — <code>validate_sequence.py</code>, where the expensive bugs
                  live.
                </li>
              </ul>
            </div>
          </div>

          <div className="note warn" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Install <code>rfc3339-validator</code>.</b> Without it, Python’s <code>jsonschema</code> quietly accepts
              a malformed <code>timestamp</code>. The negative corpus includes that case precisely so the check fails
              loudly when the package is missing.
            </p>
          </div>
        </div>
      </section>

      <section id="validate">
        <div className="wrap">
          <p className="eyebrow">Step 3</p>
          <h2>Validate in your own stack — with formats asserted</h2>
          <p className="lede">
            Two implementations that disagree about whether <code>message_id</code> must be a UUID are not
            interoperable. In Node that means Ajv’s 2020-12 build plus <code>ajv-formats</code>.
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
            Illustrative, not a reference implementation — cache compiled validators rather than fetching per message.
            The schemas are served at the URL in their own <code>$id</code>, so resolving by identifier works too.
          </p>
        </div>
      </section>

      <section id="publish">
        <div className="wrap">
          <p className="eyebrow">Step 4</p>
          <h2>Publish a conformant story snapshot</h2>

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
              <span className="kicker">Checklist for every snapshot</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  A fresh UUID <code>message_id</code> (v7 recommended); the same <code>correlation_id</code> for the
                  story’s lifecycle.
                </li>
                <li>
                  The same <code>story_id</code>, a higher <code>sequence_number</code>, a later{' '}
                  <code>updated_at</code>.
                </li>
                <li>
                  <b>Every field</b>, including the ones other systems contributed. Omission means absent.
                </li>
                <li>
                  <code>lifecycle</code> present if and only if <code>story_type</code> is <code>ACTIVE</code>.
                </li>
                <li>
                  Your own <code>originating_system</code>, re-stamped on every publish.
                </li>
                <li>
                  Anything the standard doesn’t carry goes under <code>extensions["com.&#123;vendor&#125;.…"]</code>.
                </li>
              </ul>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>See it on a live bus.</b> The project’s{' '}
              <a href={EMULATOR_URL} target="_blank" rel="noreferrer">
                emulator ↗
              </a>{' '}
              is a dashboard on a running bus you can use yourself, and the{' '}
              <a href={DEMOS_URL} target="_blank" rel="noreferrer">
                IBC demos ↗
              </a>{' '}
              show two full scenarios end to end. A .NET reference implementation is to follow in a separate repository;
              the pre-1.0 hackathon starter emits <code>0.3.2</code> and is not 1.0 traffic.
            </p>
          </div>
        </div>
      </section>

      <section id="tiers">
        <div className="wrap">
          <p className="eyebrow">Joining</p>
          <h2>Nothing about your product has to come out</h2>
          <p className="lede">One system is enough to start. Integrations are described in three tiers.</p>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <div className="lane-icon">1</div>
              <h3>Subscribe and publish</h3>
              <p className="small mb0">
                Read the story and put your own family on the bus. The project estimates this in days, not months.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">2</div>
              <h3>Bidirectional context</h3>
              <p className="small mb0">
                Your tool both consumes and contributes structured context — assertions, provenance, links, tellings.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">3</div>
              <h3>Decide against the story</h3>
              <p className="small mb0">
                Your tool acts autonomously on what it reads, through an executor applying the house’s skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="involved">
        <div className="wrap">
          <p className="eyebrow">Get involved</p>
          <h2>The working group is open</h2>
          <div className="grid g3" style={{ marginTop: 26 }}>
            <a className="card" href={INVOLVED_FORM_URL} target="_blank" rel="noreferrer">
              <h3>Register interest ↗</h3>
              <p className="small">
                Build against it, write skills, run a Story Archaeology session, join the working group, or just follow
                the work — the official form asks who you are and what you want to do.
              </p>
              <span className="more">storyobjectmodel.com form →</span>
            </a>
            <a className="card" href={repoFile('GOVERNANCE.md')} target="_blank" rel="noreferrer">
              <h3>Propose a change ↗</h3>
              <p className="small">
                Every change arrives as a pull request, and anyone may open one. Schema changes are bound by the
                compatibility policy; open questions live in the open register.
              </p>
              <span className="more">GOVERNANCE · CONTRIBUTING →</span>
            </a>
            <a className="card" href={`mailto:${CONTACT_EMAIL}`}>
              <h3>Talk an integration through</h3>
              <p className="small">
                For anything the repository README doesn’t answer, write to the project.
              </p>
              <span className="more">{CONTACT_EMAIL} →</span>
            </a>
          </div>

          <div className="note" style={{ marginTop: 26 }}>
            <p className="mb0">
              <b>The schemas win.</b> When any prose — this site included — disagrees with a published schema, the schema
              is right. <Link to="/bus">Browse the seven families →</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
