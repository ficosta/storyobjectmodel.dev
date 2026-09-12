import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../components/Bits';

const REPO =
  'https://github.com/google/virtual-broadcast-production-assistant/tree/main/som-hackathon-starter-dotnet';

export default function GetStarted() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Build"
        title="Get started"
        lede="Bring up a bus, publish a story, watch skills fire, approve one warning and reject another. Fifteen minutes, end to end."
        toc={[
          { href: '#quickstart', label: 'Quick start' },
          { href: '#verify', label: 'Verify in 60s' },
          { href: '#curl', label: 'The loop from a shell' },
          { href: '#media', label: 'Media arrivals' },
          { href: '#next', label: 'Where next' },
        ]}
      />

      <section id="quickstart">
        <div className="wrap">
          <p className="eyebrow">Quick start</p>
          <h2>Two commands</h2>
          <p className="lede">
            The reference starter is a single .NET process hosting an executor, a dashboard and a story simulator,
            with a bundled broker alongside it.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div>
              <pre>{`cd som-hackathon-starter-dotnet

# 1. the bus (plus a broker UI on :8080)
docker compose up -d

# 2. executor + dashboard on :5050
dotnet run`}</pre>
              <p className="small muted">
                Prerequisites: the .NET 10 SDK and Docker. Topics auto-create on first publish in local mode.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Then</span>
              <ul className="clean" style={{ marginBottom: 0 }}>
                <li>
                  Open <code>http://localhost:5050</code> — the websocket pill, top right, should read{' '}
                  <b>connected</b>.
                </li>
                <li>Click a seed-story button in the header to publish a <code>story.context</code> event.</li>
                <li>Watch the four lanes: stories → skill runs → pending approval → decisions.</li>
                <li>
                  Approve or reject each staged warning to push it to <code>som.skills.events</code> or{' '}
                  <code>som.skills.rejected</code>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="verify">
        <div className="wrap">
          <p className="eyebrow">Verify</p>
          <h2>Sixty seconds to know it works</h2>
          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <div className="lane-icon">1</div>
              <h3>Connect</h3>
              <p className="small mb0">
                The dashboard’s websocket pill says <b>connected</b>. If it says reconnecting, the app is down —
                the page will re-attach itself once it’s back.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">2</div>
              <h3>Publish</h3>
              <p className="small mb0">
                Click the <b>Informal</b> seed. A story lands in <i>Stories on Bus</i> and two style warnings
                appear in <i>Pending Approval</i> within a second or two.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">3</div>
              <h3>Decide</h3>
              <p className="small mb0">
                Approve one and reject the other. Both show up in <i>Decisions</i>, and the bus event log at the
                bottom shows the full message trail.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 24 }}>
            <p className="mb0">
              The six seed stories each exercise a different combination of fields — a full compliance and gates
              set, a story with the <code>compliance</code> key absent at <code>URGENT</code> priority, informal
              headline terms, a clean story that should fire nothing at all, an election story on{' '}
              <code>EDITORIAL_HOLD</code>, and a hurricane story whose live feed transitions{' '}
              <code>CAPTURING → CAPTURED</code>.
            </p>
          </div>
        </div>
      </section>

      <section id="curl">
        <div className="wrap">
          <p className="eyebrow">Shell</p>
          <h2>The whole loop without the UI</h2>
          <pre>{`B=http://localhost:5050

# publish a story (a live feed, still CAPTURING, open-ended range)
curl -X POST $B/api/publish/hurricane

# see what's waiting on the gate
curl $B/api/pending

# decide
curl -X POST $B/api/decision/<warning_id> \\
  -H 'Content-Type: application/json' \\
  -d '{"decision":"approve","reviewer":"me"}'`}</pre>
          <p className="small muted mb0">
            Endpoint paths belong to the reference implementation, not to SOM itself — the standard defines
            messages, not an HTTP API. Check the starter’s README for the current list.
          </p>
        </div>
      </section>

      <section id="media">
        <div className="wrap">
          <p className="eyebrow">Media</p>
          <h2>Drive a TAMS arrival</h2>
          <p className="lede">
            The mock MAM plays the store; the media coordinator plays the consuming participant. Two arrivals show
            both halves of the contract.
          </p>
          <pre>{`# a rolling arrival — noted, no story change
curl -X POST $B/api/mam/emit/landfall-feed-01 \\
  -H 'Content-Type: application/json' -d '{"timeRange":"[0:0_30:0)"}'

# the final one — the asset flips CAPTURING → CAPTURED,
# skills re-run, and an inform lands in Pending Approval
curl -X POST $B/api/mam/emit/landfall-feed-01 \\
  -H 'Content-Type: application/json' -d '{"captureComplete":true}'

# the safe-state path — media no story references
curl -X POST $B/api/mam/emit/ugc-flood-77aa41b0   # → WITHHELD on som.system.audit`}</pre>

          <div className="grid g2" style={{ marginTop: 20, alignItems: 'start' }}>
            <div className="note warn">
              <p className="mb0">
                <b>“I emitted the clip and nothing happened.”</b> If it matched no story, that <em>is</em> the
                result — look for the <code>WITHHELD</code> record on the audit topic. By design, no story is
                created.
              </p>
            </div>
            <div className="note warn">
              <p className="mb0">
                <b>“The final emit didn’t flip the asset.”</b> Either the story isn’t on the bus yet — publish the
                seed first, since the coordinator only re-checks for about a second — or the asset is already{' '}
                <code>CAPTURED</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="next">
        <div className="wrap">
          <p className="eyebrow">Where next</p>
          <h2>Pick your path</h2>
          <div className="grid g3" style={{ marginTop: 26 }}>
            <Link className="card" to="/skills#anatomy">
              <h3>Write a skill</h3>
              <p className="small">
                One JSON file, seven rule types, three validation layers. No C# required.
              </p>
              <span className="more">Skill anatomy →</span>
            </Link>
            <Link className="card" to="/envelope">
              <h3>Publish stories</h3>
              <p className="small">
                Copy a seed envelope and keep the five envelope rules. It is the exact wire shape.
              </p>
              <span className="more">Envelope reference →</span>
            </Link>
            <Link className="card" to="/bus#roles">
              <h3>Join as a consumer</h3>
              <p className="small">
                Anything that speaks the bus and JSON can participate — in any language, in its own process.
              </p>
              <span className="more">Roles &amp; topics →</span>
            </Link>
          </div>

          <div className="note" style={{ marginTop: 26 }}>
            <p className="mb0">
              <b>The schemas win.</b> When any prose — this site included — disagrees with a vendored JSON Schema,
              the schema is right. Validate candidate payloads against the shipped examples before you publish
              them.{' '}
              <a href={`${REPO}/schema`} target="_blank" rel="noreferrer">
                Browse the schema pack ↗
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
