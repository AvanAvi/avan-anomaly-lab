// Ambient background for the instrument design system: a faint coordinate
// grid plus a sparse field of drifting signal points. Pure CSS, no canvas or
// WebGL, so it costs nothing on the main thread and never blocks paint.
// Positions are fixed (not random) to avoid server/client hydration
// mismatches and to keep the composition intentional rather than noisy.

interface SignalPoint {
  left: string;
  top: string;
  size: number;
  delay: string;
  driftX: string;
  driftY: string;
  dim?: boolean;
}

const SIGNAL_POINTS: SignalPoint[] = [
  { left: "8%", top: "22%", size: 3, delay: "0s", driftX: "10px", driftY: "-6px" },
  { left: "18%", top: "68%", size: 2, delay: "-4s", driftX: "-8px", driftY: "10px", dim: true },
  { left: "27%", top: "40%", size: 2, delay: "-9s", driftX: "6px", driftY: "8px", dim: true },
  { left: "39%", top: "14%", size: 3, delay: "-2s", driftX: "-10px", driftY: "-8px" },
  { left: "52%", top: "78%", size: 2, delay: "-12s", driftX: "8px", driftY: "-10px", dim: true },
  { left: "63%", top: "31%", size: 3, delay: "-6s", driftX: "-6px", driftY: "12px" },
  { left: "74%", top: "58%", size: 2, delay: "-15s", driftX: "10px", driftY: "6px", dim: true },
  { left: "83%", top: "20%", size: 2, delay: "-8s", driftX: "-8px", driftY: "-10px", dim: true },
  { left: "91%", top: "72%", size: 3, delay: "-3s", driftX: "6px", driftY: "-8px" },
  { left: "47%", top: "48%", size: 2, delay: "-11s", driftX: "-10px", driftY: "6px", dim: true },
  { left: "12%", top: "88%", size: 2, delay: "-17s", driftX: "8px", driftY: "-6px", dim: true },
  { left: "68%", top: "90%", size: 2, delay: "-5s", driftX: "-6px", driftY: "-10px", dim: true },
];

export default function FieldBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      {/* Drafting grid: fine lines every 2rem, reinforced every 8rem */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(110,231,192,0.05) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(110,231,192,0.05) 1px, transparent 1px)," +
            "linear-gradient(to right, rgba(110,231,192,0.09) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(110,231,192,0.09) 1px, transparent 1px)",
          backgroundSize: "2rem 2rem, 2rem 2rem, 8rem 8rem, 8rem 8rem",
        }}
      />

      {/* Instrument dial ring, half off-canvas for depth without symmetry */}
      <div className="absolute -right-[22vw] -top-[22vw] h-[48vw] w-[48vw] rounded-full border border-signal/[0.06]" />
      <div className="absolute -bottom-[30vw] -left-[18vw] h-[38vw] w-[38vw] rounded-full border border-signal/[0.04]" />

      {/* Signal points */}
      {SIGNAL_POINTS.map((point, i) => (
        <span
          key={i}
          className="absolute animate-drift rounded-full bg-signal"
          style={
            {
              left: point.left,
              top: point.top,
              width: point.size,
              height: point.size,
              opacity: point.dim ? 0.25 : 0.5,
              boxShadow: `0 0 ${point.size * 3}px rgba(110,231,192,0.5)`,
              animationDelay: point.delay,
              "--drift-x": point.driftX,
              "--drift-y": point.driftY,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Vignette for depth and to keep foreground text legible */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,9,10,0.6)_75%)]" />
    </div>
  );
}
