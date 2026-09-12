interface Node {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub: string;
  accent?: boolean;
}

const NODES: Node[] = [
  { x: 4, y: 106, w: 120, h: 52, label: 'NRCS / AP', sub: 'story source' },
  { x: 148, y: 106, w: 120, h: 52, label: 'story.context', sub: 'som.story.context' },
  { x: 292, y: 106, w: 120, h: 52, label: 'Executor', sub: 'runs the skills' },
  { x: 436, y: 106, w: 120, h: 52, label: 'Staging', sub: 'som.skills.staging' },
  { x: 580, y: 106, w: 120, h: 52, label: 'Human gate', sub: 'approve / reject', accent: true },
  { x: 724, y: 44, w: 120, h: 52, label: 'Production', sub: 'som.skills.events' },
  { x: 724, y: 164, w: 120, h: 52, label: 'Rejected', sub: 'som.skills.rejected' },
  { x: 292, y: 212, w: 120, h: 46, label: 'Audit', sub: 'som.skills.runs' },
];

const EDGES: { id: string; d: string }[] = [
  { id: 'g1', d: 'M124,132 H144' },
  { id: 'g2', d: 'M268,132 H288' },
  { id: 'g3', d: 'M412,132 H432' },
  { id: 'g4', d: 'M556,132 H576' },
  { id: 'g5', d: 'M706,128 C716,126 716,96 722,80' },
  { id: 'g6', d: 'M706,136 C716,138 716,168 722,184' },
  { id: 'g7', d: 'M352,162 V208' },
];

interface Packet {
  path: string;
  begin: string;
  warn?: boolean;
  faint?: boolean;
}

const PACKETS: Packet[] = [
  { path: '#g1', begin: '0s' },
  { path: '#g2', begin: '0.5s' },
  { path: '#g3', begin: '1s', warn: true },
  { path: '#g4', begin: '1.5s', warn: true },
  { path: '#g5', begin: '2.2s' },
  { path: '#g7', begin: '1.1s', faint: true },
];

const DUR = '3.4s';

/** The core SOM loop, with messages animating along the bus. */
export default function LoopDiagram() {
  return (
    <div className="loop">
      <svg
        viewBox="0 30 852 248"
        role="img"
        aria-label="A story.context message flows from a story source onto som.story.context, is consumed by the executor which writes an audit record to som.skills.runs and staged outputs to som.skills.staging, which the human approval gate routes to either som.skills.events or som.skills.rejected."
      >
        <defs>
          <marker id="arw" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="currentColor" style={{ color: 'var(--line-2)' }} />
          </marker>
        </defs>

        <g>
          {NODES.map((n) => (
            <g key={n.label}>
              {n.accent && (
                <rect className="gate" x={n.x - 6} y={n.y - 6} width={n.w + 12} height={n.h + 12} rx={12} />
              )}
              <rect
                className={n.accent ? 'node-box accent' : 'node-box'}
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx={9}
              />
              <text className="node-label" x={n.x + n.w / 2} y={n.y + 22} textAnchor="middle">
                {n.label}
              </text>
              <text className="node-sub" x={n.x + n.w / 2} y={n.y + 39} textAnchor="middle">
                {n.sub}
              </text>
            </g>
          ))}
        </g>

        <g markerEnd="url(#arw)">
          {EDGES.map((e) => (
            <path key={e.id} className="edge" id={e.id} d={e.d} />
          ))}
        </g>

        <g>
          {PACKETS.map((p) => (
            <circle
              key={p.path + p.begin}
              className={p.warn ? 'packet warn' : 'packet'}
              r={p.faint ? 3 : 3.5}
              opacity={0}
            >
              <animateMotion dur={DUR} repeatCount="indefinite" begin={p.begin}>
                <mpath href={p.path} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values={p.faint ? '0;.6;.6;0' : '0;1;1;0'}
                keyTimes="0;.08;.24;.32"
                dur={DUR}
                begin={p.begin}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      </svg>
    </div>
  );
}
