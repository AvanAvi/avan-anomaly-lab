import { ResearchTheme } from "@/lib/research";

/**
 * The one technical visual per research theme. Pure inline SVG, no
 * charting library: each diagram is small enough to hand-author and
 * this keeps the bundle from growing for three static illustrations.
 * The subtle draw-in animation is CSS only and disabled under
 * `prefers-reduced-motion` via the motion-reduce: variant.
 */
export default function ResearchDiagram({ theme }: { theme: ResearchTheme }) {
  return (
    <div className="border border-line bg-ink-900/40 p-6">
      {theme === "propulsion" && <PropulsionDiagram />}
      {theme === "population" && <PopulationDiagram />}
      {theme === "resources" && <ResourcesDiagram />}
    </div>
  );
}

const LINE = "rgba(110,231,192,0.35)";
const LINE_STRONG = "rgba(110,231,192,0.75)";
const GRID = "rgba(255,255,255,0.06)";

function PropulsionDiagram() {
  return (
    <svg viewBox="0 0 400 220" className="w-full" role="img" aria-labelledby="propulsion-diagram-title">
      <title id="propulsion-diagram-title">
        Flight envelope chart plotting thermal load against Mach number, with a marked limit near Mach 30
      </title>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={40} y1={20 + i * 40} x2={380} y2={20 + i * 40} stroke={GRID} strokeWidth={1} />
      ))}
      <line x1={40} y1={20} x2={40} y2={180} stroke={LINE} strokeWidth={1} />
      <line x1={40} y1={180} x2={380} y2={180} stroke={LINE} strokeWidth={1} />

      {/* Rising thermal load curve, drawn in on mount */}
      <path
        d="M 40 175 C 140 170, 220 140, 280 90 S 350 30, 375 15"
        fill="none"
        stroke={LINE_STRONG}
        strokeWidth={1.5}
        strokeDasharray={480}
        strokeDashoffset={480}
        className="motion-safe:animate-draw"
      />

      {/* Mach 30 threshold marker */}
      <line x1={290} y1={20} x2={290} y2={180} stroke="rgba(229,72,77,0.4)" strokeWidth={1} strokeDasharray="4 4" />
      <text x={294} y={32} fontFamily="var(--font-mono)" fontSize={10} fill="rgba(229,72,77,0.7)">
        M30
      </text>

      <text x={40} y={200} fontFamily="var(--font-mono)" fontSize={10} fill="rgba(255,255,255,0.35)">
        MACH NUMBER
      </text>
      <text
        x={16}
        y={100}
        fontFamily="var(--font-mono)"
        fontSize={10}
        fill="rgba(255,255,255,0.35)"
        transform="rotate(-90 16 100)"
      >
        THERMAL LOAD
      </text>
    </svg>
  );
}

function PopulationDiagram() {
  const nodes = [
    { label: "GENETICS", x: 200, y: 40 },
    { label: "RESOURCES", x: 340, y: 110 },
    { label: "SOCIAL STRUCTURE", x: 280, y: 190 },
    { label: "TECHNOLOGY", x: 120, y: 190 },
    { label: "RESILIENCE", x: 60, y: 110 },
  ];
  const center = { x: 200, y: 115 };

  return (
    <svg viewBox="0 0 400 220" className="w-full" role="img" aria-labelledby="population-diagram-title">
      <title id="population-diagram-title">
        Network diagram of a viable population node connected to genetics, resources, social structure,
        technology, and resilience
      </title>
      {nodes.map((n) => (
        <line
          key={n.label}
          x1={center.x}
          y1={center.y}
          x2={n.x}
          y2={n.y}
          stroke={LINE}
          strokeWidth={1}
          strokeDasharray={n.label === "RESILIENCE" ? "3 3" : undefined}
        />
      ))}

      <circle cx={center.x} cy={center.y} r={20} fill="rgba(110,231,192,0.08)" stroke={LINE_STRONG} strokeWidth={1.5} />
      <text
        x={center.x}
        y={center.y + 3}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={8}
        fill="rgba(110,231,192,0.9)"
      >
        MVP
      </text>

      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r={4} fill="rgba(7,9,10,1)" stroke={LINE_STRONG} strokeWidth={1.5} />
          <text
            x={n.x}
            y={n.y + (n.y < center.y ? -12 : 18)}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="rgba(255,255,255,0.4)"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ResourcesDiagram() {
  return (
    <svg viewBox="0 0 400 220" className="w-full" role="img" aria-labelledby="resources-diagram-title">
      <title id="resources-diagram-title">
        Two resource nodes connected by a flow loop, balanced around a central equilibrium line
      </title>
      <line x1={40} y1={110} x2={360} y2={110} stroke={GRID} strokeWidth={1} strokeDasharray="2 6" />
      <text x={362} y={114} fontFamily="var(--font-mono)" fontSize={9} fill="rgba(255,255,255,0.3)">
        EQ
      </text>

      <circle cx={90} cy={80} r={26} fill="none" stroke={LINE_STRONG} strokeWidth={1.5} />
      <text x={90} y={84} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="rgba(255,255,255,0.55)">
        NODE A
      </text>

      <circle cx={310} cy={150} r={26} fill="none" stroke={LINE_STRONG} strokeWidth={1.5} />
      <text x={310} y={154} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="rgba(255,255,255,0.55)">
        NODE B
      </text>

      <path
        d="M 112 66 C 200 20, 260 40, 292 130"
        fill="none"
        stroke={LINE}
        strokeWidth={1.2}
        markerEnd="url(#arrow)"
        strokeDasharray={300}
        strokeDashoffset={300}
        className="motion-safe:animate-draw"
      />
      <path
        d="M 288 168 C 200 210, 140 190, 108 96"
        fill="none"
        stroke={LINE}
        strokeWidth={1.2}
        markerEnd="url(#arrow)"
        strokeDasharray={300}
        strokeDashoffset={300}
        className="motion-safe:animate-draw motion-safe:[animation-delay:300ms]"
      />

      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={LINE_STRONG} />
        </marker>
      </defs>
    </svg>
  );
}
