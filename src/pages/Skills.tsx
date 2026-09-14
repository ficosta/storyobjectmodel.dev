import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../components/Bits';
import { CATEGORY_X, GUARANTEES, LIBRARY, LIBRARY_VERSION } from '../data/skills';
import { AGENTSKILLS_URL, repoDir, repoFile } from '../data/consortium';

export default function Skills() {
  useHashScroll();

  const published = LIBRARY.filter((s) => !s.proposed);
  const proposed = LIBRARY.filter((s) => s.proposed);

  return (
    <>
      <PageHead
        eyebrow="Reference · som-skill-library"
        title="Skills"
        lede="SOM carries context; Skills carry knowledge. A skill is a rule written once, by editorial, readable by every tool. It declares what is true — the tool that owns the executor is the only thing that acts."
        toc={[
          { href: '#model', label: 'Declare, not act' },
          { href: '#anatomy', label: 'Anatomy' },
          { href: '#library', label: 'The library' },
          { href: '#combine', label: 'Combining holds' },
          { href: '#checks', label: 'Validation' },
          { href: '#open', label: 'What’s open' },
        ]}
      />

      <section id="model">
        <div className="wrap">
          <p className="eyebrow">The model</p>
          <h2>Skills declare. Executors act.</h2>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <div className="lane-icon">1</div>
              <h3>The skill declares</h3>
              <p className="small mb0">
                A skill file states a condition and what is true when it holds — a flag stands, a hold applies, an
                enrichment is warranted. It never runs anything, never writes story state, and never changes content.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">2</div>
              <h3>The executor recalls</h3>
              <p className="small mb0">
                Executors live inside vendor tools. Each matches incoming messages against skill <b>adverts</b> — the
                machine-read <code>recall</code> block — and publishes what the skill declares as{' '}
                <code>skill.warning.raised</code>.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">3</div>
              <h3>The tool acts</h3>
              <p className="small mb0">
                The MAM keeps a held asset uncommittable, playout refuses the take, the CMS holds one path. Each in its
                own way, and each deciding for itself. Nothing is sent a command.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Open shape, house policy.</b> Skills follow the open{' '}
              <a href={AGENTSKILLS_URL} target="_blank" rel="noreferrer">
                agentskills.io ↗
              </a>{' '}
              format: a markdown file with YAML frontmatter. The shared library is generic; a newsroom loads its own
              values against it. Your policy stays yours, and a newsroom can implement SOM 1.0 completely without using
              the library at all.
            </p>
          </div>
        </div>
      </section>

      <section id="anatomy">
        <div className="wrap">
          <p className="eyebrow">Anatomy</p>
          <h2>One file: frontmatter for machines, prose for people</h2>

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
                <span className="kicker">Identity</span>
                <p className="small mb0">
                  <code>skill_id</code> as <code>publisher/name</code>, a semver <code>skill_version</code>, the SOM
                  schema versions it resolves against, a <code>category</code> and a <code>lifecycle</code>.
                </p>
              </div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">The advert</span>
                <p className="small mb0">
                  <code>recall</code> names which tool types may pick the skill up, the conditions over story paths
                  (<code>field</code> and <code>field_change</code>), and which messages cause a look. Paths are
                  literal and checked against the published schema; values can be templated from the house’s
                  configuration.
                </p>
              </div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">Configured instance</span>
                <p className="small mb0">
                  One generic file with one house’s values loaded, watching one condition. A house runs several off the
                  same file — a court restriction at <code>story</code> scope, an unconfirmed figure at{' '}
                  <code>link</code> scope — and registers one advert row per configured instance.
                </p>
              </div>
              <div className="card">
                <span className="kicker">Severity</span>
                <p className="small mb0">
                  <code>hold</code> / <code>flag</code> / <code>inform</code>, lower-case permanently. A skill declares
                  which of them it can produce in <code>severity_range</code>.
                </p>
              </div>
            </div>
          </div>

          <div className="table-scroll" style={{ marginTop: 26 }}>
            <table>
              <thead>
                <tr>
                  <th>Guarantee</th>
                  <th>Value</th>
                  <th>What it means</th>
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
          <h2>Ten reference skills, one proposed</h2>
          <p className="lede">
            All <code>lifecycle: draft</code>, <code>origin: reference</code>, resolving against SOM 1.0. Find your tool
            type in the lookup table, read the skills in that row, and configure them for your house.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Declares</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>Recalled by</th>
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
                          <span className="tag soon">proposed</span>
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
              Lookup table ↗
            </a>{' '}
            ·{' '}
            <a href={repoFile('skills/docs/CONVENTIONS.md')} target="_blank" rel="noreferrer">
              Conventions ↗
            </a>{' '}
            ·{' '}
            <a href={repoDir('skills/skills')} target="_blank" rel="noreferrer">
              All skill files ↗
            </a>
          </p>
        </div>
      </section>

      <section id="combine">
        <div className="wrap">
          <p className="eyebrow">When skills meet</p>
          <h2>Holds combine by conjunction</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Any one hold means held</span>
              <p className="small">
                Where several gates bind the same fact on the same telling, it is served only when every one permits.
                “Most restrictive wins” and “story owner takes precedence” were formally withdrawn on 29 July 2026.
              </p>
              <p className="small mb0">
                Precedence between two skills that clash on the same action is a separate question, ordered by{' '}
                <b>X</b> (category: compliance 1, editorial 2, workflow 3), <b>Y</b> (origin — every library skill is 5)
                and <b>Z</b>, which only the publishing house sets.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Chaining over the bus</span>
              <p className="small">
                A skill that both declared a state and withheld something would sit in two positions at once. So
                “flag and hold” is two skills: <code>flag-on-mismatch</code> declares the flag, and{' '}
                <code>hold-while-flagged</code> advertises against flag state — whoever raised it, a skill or a lawyer.
              </p>
              <p className="small mb0">
                That is why <code>depends</code> is empty everywhere: declaring a dependency would invert it and create
                a cycle at the first version change.
              </p>
            </div>
          </div>

          <div className="grid g2" style={{ marginTop: 18, alignItems: 'start' }}>
            <div className="note warn">
              <p className="mb0">
                <b>Fail closed.</b> An unreadable configuration or story value is treated as the condition holding, at
                the loudest severity the skill has, and <code>detail</code> names what couldn’t be read. If a rule
                can’t be evaluated, the output it guards stays held and a person decides.
              </p>
            </div>
            <div className="note">
              <p className="mb0">
                <b>What doesn’t clear a hold:</b> time passing, the flag simply missing from a later snapshot, a
                clearance at a different scope, a lower authority, an executor restart, or clearing a different flag.
                Releasing a hold is never an instruction to release the asset.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="checks">
        <div className="wrap">
          <p className="eyebrow">Validation</p>
          <h2>The library checks itself</h2>
          <p className="lede">
            Five scripts ship with the library, and each asks a different question — including whether the documents
            agree with the files they describe.
          </p>
          <pre style={{ marginTop: 22 }}>{`cd som/skills
python3 scripts/validate_som_skill.py skills/<name>.md   # one skill file is legal
python3 scripts/check_library.py skills/                  # the library holds together
python3 scripts/check_paths.py skills/                    # every path resolves against
                                                          #   ../schema/story-context.schema.json
python3 scripts/build_lookup_table.py . --check           # the table matches the adverts
python3 scripts/check_cover_claims.py .                   # the docs match the files`}</pre>
          <p className="small muted">
            One gap is named rather than hidden: <code>check_paths.py</code> resolves literal paths only. A{' '}
            <code>{'{{ config.* }}'}</code> value is unknowable until a house configures it, so catching a bad configured
            path is registration-time work for the house.
          </p>
        </div>
      </section>

      <section id="open">
        <div className="wrap narrow">
          <p className="eyebrow">Honestly open</p>
          <h2>What the library doesn’t claim to settle</h2>
          <ul className="clean">
            <li>
              <b>How authority is compared.</b> “Cleared by equal or higher authority on the same scope” is the library’s
              working position, with the ordering supplied by each house as <code>authority_scale</code>. No group has
              ratified it.
            </li>
            <li>
              <b>Who turns a raised warning into gate state.</b> A raise skill only publishes a warning; a hold skill
              reads <code>editorial_gates[]</code>. What materialises one into the other is not yet defined.
            </li>
            <li>
              <b>Scheme-qualified tag matching.</b> Skills match <code>tags[].value</code> regardless of scheme today;
              whether to match <code>newsroom:sport</code> rather than <code>sport</code> is open.
            </li>
            <li>
              <b>Demo configuration.</b> The configured instances used in the IBC walkthrough name individual vendors and
              are not published in 1.0, pending each vendor’s sign-off.
            </li>
          </ul>
          <p className="mb0">
            <Link to="/get-started">Next: validate and publish your first message →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
