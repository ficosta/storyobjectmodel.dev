import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../components/Bits';
import { RULE_TYPES } from '../data/topics';

export default function Skills() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Reference"
        title="Skills"
        lede="A skill is data, not code: one JSON file the executor interprets. It declares what it operates on, states its rules, and proposes — it never acts."
        toc={[
          { href: '#anatomy', label: 'Anatomy' },
          { href: '#rules', label: 'Rule types' },
          { href: '#validation', label: 'Validation' },
          { href: '#loop', label: 'Iteration loop' },
          { href: '#pitfalls', label: 'Pitfalls' },
        ]}
      />

      <section id="anatomy">
        <div className="wrap">
          <p className="eyebrow">Anatomy</p>
          <h2>One file, four parts</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <pre>{`{
  "id": "acme/my-skill",
  "version": "0.1.0",
  "name": "Acme Example Skill",
  "description": "What it checks and why.",
  "skill_type": "VENDOR",
  "disclosure_level": "L2",
  "migration_policy": "GATED",

  "reads":    ["headline", "assets"],
  "produces": ["skill.warning.raised",
               "skill.run.completed"],

  "advert": {
    "role": "compliance check",
    "operates_on": ["story.context"],
    "produces": ["skill.warning.raised"],
    "fires_on": ["headline",
                 "assets[].acquisition_state"]
  },

  "rules": [
    {
      "rule_id": "acme-style-001",
      "type": "term_match",
      "config": {
        "field": "headline",
        "terms": ["cops", "slammed"]
      },
      "default_severity": "flag",
      "affected_fields": ["headline"],
      "detail_template":
        "Informal term '{term}' in {field}."
    }
  ]
}`}</pre>
            </div>
            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">1 · Identity</span>
                <p className="small mb0">
                  <code>id</code> in <code>vendor/skill-name</code> form, a semver <code>version</code>, and the
                  governance triple: <code>skill_type</code>, <code>disclosure_level</code>,{' '}
                  <code>migration_policy</code>.
                </p>
              </div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">2 · Advert</span>
                <p className="small mb0">
                  The machine-readable claim. <b>If <code>operates_on</code> doesn’t include{' '}
                  <code>story.context</code>, the executor skips your skill entirely</b> — and logs exactly that,
                  once, at information level. Check the app log before debugging anything else.
                </p>
              </div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">3 · Rules</span>
                <p className="small mb0">
                  Each has a <code>rule_id</code>, a <code>type</code>, a <code>config</code>, a{' '}
                  <code>default_severity</code>, its <code>affected_fields</code>, and a{' '}
                  <code>detail_template</code> with <code>&#123;placeholder&#125;</code> substitutions.
                </p>
              </div>
              <div className="card">
                <span className="kicker">4 · Severity</span>
                <p className="small mb0">
                  <code>hold</code> / <code>flag</code> / <code>inform</code>, lower-case. One of only two
                  deliberate exceptions to SOM’s UPPER_SNAKE enum convention — the other being <code>x-</code> and{' '}
                  <code>com.&#123;vendor&#125;</code> extension values.
                </p>
              </div>
            </div>
          </div>

          <div className="note" style={{ marginTop: 24 }}>
            <p className="mb0">
              Most vendors never write code. A skill file plus, optionally, a test scenario is the whole
              touchpoint — the bus topology, approval gate, audit trail and validation pipeline stay untouched. A
              custom rule type in the executor is the escape hatch when the seven built-ins genuinely can’t express
              the logic.
            </p>
          </div>
        </div>
      </section>

      <section id="rules">
        <div className="wrap">
          <p className="eyebrow">Rule types</p>
          <h2>Seven built-ins</h2>
          <p className="lede">
            <code>field</code> is always a dotted path relative to the payload root. Static validation checks that
            the required config keys are present and that any regex compiles.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Config</th>
                  <th>Fires when</th>
                  <th>Substitutions</th>
                </tr>
              </thead>
              <tbody>
                {RULE_TYPES.map((r) => (
                  <tr key={r.type}>
                    <td>
                      <code>{r.type}</code>
                    </td>
                    <td className="small">
                      <code>{r.config}</code>
                    </td>
                    <td className="small">{r.fires}</td>
                    <td className="small">
                      <code>{r.subs}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid g2" style={{ marginTop: 22, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">field_changed is special</span>
              <p className="small">
                It is the only type that looks across versions, and the only one that supports an array wildcard —
                exactly one <code>[]</code>, as in <code>assets[].acquisition_state</code>. Elements are matched
                between versions by <code>asset_id</code> / <code>source_id</code> / <code>flag_id</code> /{' '}
                <code>id</code>.
              </p>
              <p className="small mb0">
                It stays quiet on the first sighting of a story, because there is nothing to compare against — and
                “first sighting” includes the first story after a restart.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Arrays otherwise</span>
              <p className="small mb0">
                Every other rule type treats an array field — <code>compliance</code>, <code>assets</code> — as a
                whole, checking presence or absence. Per-element logic such as “any compliance flag of type X”
                means writing a custom rule type in the executor.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="validation">
        <div className="wrap">
          <p className="eyebrow">Validation</p>
          <h2>Three layers before you go live</h2>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <div className="lane-icon">1</div>
              <h3>Static</h3>
              <p className="small">
                Schema and config-key checks, run automatically on every register or update. Unknown rule types,
                missing config keys and bad regexes come back as structured errors before anything reaches the bus.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">2</div>
              <h3>Dry-run</h3>
              <p className="small">
                Evaluates your rules against every seed story <b>without publishing</b>. You see precisely which
                stories fire which rules.
              </p>
              <p className="small mb0 muted">
                Dry-run has no “previous version”, so <code>field_changed</code> rules can never fire here. Test
                those live.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">3</div>
              <h3>AI review</h3>
              <p className="small mb0">
                Optional. Ships the skill, the seeds and the dry-run result to an LLM for structured editorial
                feedback — a second opinion on the rule’s wording and intent, not a gate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="loop">
        <div className="wrap narrow">
          <p className="eyebrow">Iteration</p>
          <h2>The loop you’ll actually run</h2>
          <ul className="clean">
            <li>
              <b>Register</b> the skill — static validation runs on the spot.
            </li>
            <li>
              <b>Dry-run</b> it against the seed stories and read which rules fired where.
            </li>
            <li>
              <b>Review</b> (optional) with the AI pass for a sanity check on wording and intent.
            </li>
            <li>
              <b>Go live</b>: publish seeds or run a scenario, and watch your run records and staged outputs appear.
            </li>
            <li>
              For a <code>field_changed</code> rule, <b>mutate a story</b> so there is an actual transition to
              detect — advance a phase, or drive a media arrival to completion.
            </li>
          </ul>
          <p className="mb0">
            Your outputs then ride the same gate as everything else: staged → human decision →{' '}
            <code>som.skills.events</code> or <code>som.skills.rejected</code>, republished in a fresh
            gate-attributed envelope with the reviewer stamped in <code>payload.extensions</code> and the decision
            recorded on <code>som.system.audit</code>.
          </p>
        </div>
      </section>

      <section id="pitfalls">
        <div className="wrap">
          <p className="eyebrow">Pitfalls</p>
          <h2>Why it isn’t working</h2>
          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Symptom</th>
                  <th>Cause</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>My skill never runs, but dry-run fires</td>
                  <td className="small">
                    The advert’s <code>operates_on</code> doesn’t cover <code>story.context</code>. The executor
                    logs this once per skill when the next story arrives.
                  </td>
                </tr>
                <tr>
                  <td>
                    A <code>field_changed</code> rule never fires
                  </td>
                  <td className="small">
                    No previous version this session — first sighting, or a restart. Republish once to establish a
                    baseline, then trigger the transition. Dry-run can never fire change rules.
                  </td>
                </tr>
                <tr>
                  <td>Rule paths resolve to nothing</td>
                  <td className="small">
                    The config predates the v0.3.x renames: <code>sources[]</code> is now{' '}
                    <code>editorial_source[]</code>, <code>skills_config.broadcaster</code> is now{' '}
                    <code>skills_config.newsroom</code>. See <Link to="/envelope#renames">the rename table</Link>.
                  </td>
                </tr>
                <tr>
                  <td>Rule fires but the detail reads wrong</td>
                  <td className="small">
                    The <code>detail_template</code> uses a substitution the rule type doesn’t provide. Each type
                    offers a fixed set — check the table above.
                  </td>
                </tr>
                <tr>
                  <td>Nothing appears for a warning I emitted externally</td>
                  <td className="small">
                    Message-type names are suffixed on the wire. Consumers route on{' '}
                    <code>skill.warning.raised</code>, not <code>skill.warning</code>.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 24 }}>
            <Link to="/get-started">Next: run the whole thing locally →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
