import { useUi } from '../i18n/useLocale';

type NodeKey = 'storyOwner' | 'mediaStore' | 'executorTool' | 'rundown' | 'playout' | 'standardsDesk';

interface Node {
  x: number;
  y: number;
  /** Key into the localized diagram labels. */
  key: NodeKey;
  sub: string;
  accent?: boolean;
}

const W = 190;
const H = 52;
const BUS_Y = 158;

/** Top row publishes onto the bus; bottom row reads the story and publishes in turn. */
const NODES: Node[] = [
  { x: 40, y: 34, key: 'storyOwner', sub: 'story.context' },
  { x: 331, y: 34, key: 'mediaStore', sub: 'delivery.media_available' },
  { x: 622, y: 34, key: 'executorTool', sub: 'skill.warning.raised' },
  { x: 40, y: 250, key: 'rundown', sub: 'som.link.*' },
  { x: 331, y: 250, key: 'playout', sub: 'som.telling.*' },
  { x: 622, y: 250, key: 'standardsDesk', sub: 'som.system.audit', accent: true },
];

const centre = (n: Node) => n.x + W / 2;

const EDGES = NODES.map((n, i) => {
  const top = n.y < BUS_Y;
  const x = centre(n);
  return {
    id: `e${i}`,
    // Every edge points at the bus: each participant publishes its own family.
    d: top ? `M${x},${n.y + H} V${BUS_Y - 14}` : `M${x},${n.y} V${BUS_Y + 14}`,
  };
});

const DUR = '4s';

/** Tools talk to a shared description of the story, not to each other. */
export default function LoopDiagram() {
  const t = useUi().loop;
  return (
    <div className="loop">
      <svg
        viewBox="0 20 852 300"
        role="img"
        aria-label={t.aria}
      >
        <defs>
          <marker id="arw" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="currentColor" style={{ color: 'var(--line-2)' }} />
          </marker>
        </defs>

        <rect className="node-box accent" x={20} y={BUS_Y - 12} width={812} height={24} rx={12} />
        <text className="node-sub" x={426} y={BUS_Y + 4} textAnchor="middle">
          {t.bus}
        </text>
        <path id="bus" d={`M40,${BUS_Y} H812`} fill="none" stroke="none" />

        {NODES.map((n) => (
          <g key={n.key}>
            {n.accent && <rect className="gate" x={n.x - 6} y={n.y - 6} width={W + 12} height={H + 12} rx={12} />}
            <rect className="node-box" x={n.x} y={n.y} width={W} height={H} rx={9} />
            <text className="node-label" x={centre(n)} y={n.y + 22} textAnchor="middle">
              {t[n.key]}
            </text>
            <text className="node-sub" x={centre(n)} y={n.y + 39} textAnchor="middle">
              {n.sub}
            </text>
          </g>
        ))}

        <g markerEnd="url(#arw)">
          {EDGES.map((e) => (
            <path key={e.id} className="edge" id={e.id} d={e.d} />
          ))}
        </g>

        <g>
          {EDGES.map((e, i) => (
            <circle key={e.id} className={i === 2 ? 'packet warn' : 'packet'} r={3.5} opacity={0}>
              <animateMotion dur={DUR} repeatCount="indefinite" begin={`${i * 0.6}s`}>
                <mpath href={`#${e.id}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;.05;.18;.24"
                dur={DUR}
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
          <circle className="packet" r={3} opacity={0}>
            <animateMotion dur={DUR} repeatCount="indefinite" begin="0.4s">
              <mpath href="#bus" />
            </animateMotion>
            <animate attributeName="opacity" values="0;.7;.7;0" keyTimes="0;.1;.9;1" dur={DUR} begin="0.4s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}
