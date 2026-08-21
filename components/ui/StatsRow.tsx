interface Stat {
  value: string | number;
  label: string;
}

/**
 * The mono readout row used for simple stat counts (project counts,
 * shipping status counts). Shared between the homepage Projects teaser
 * and the full /projects page so both move together if the treatment
 * changes.
 */
export default function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-12 gap-y-6 border-y border-line py-8">
      {stats.map((stat) => (
        <div key={stat.label}>
          <div className="font-display text-3xl text-signal">{stat.value}</div>
          <div className="mt-1 font-mono text-xs tracking-wide text-white/40">
            {stat.label.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
}
