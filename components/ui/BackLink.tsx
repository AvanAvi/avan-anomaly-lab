import Link from "next/link";

/**
 * Return-to-home link used at the top of every standalone page
 * (/philosophy, /reading, /science, /projects).
 */
export default function BackLink({ label = "Back to the lab" }: { label?: string }) {
  return (
    <Link
      href="/"
      className="group mb-16 inline-flex items-center gap-2 border border-line-strong px-4 py-2 font-mono text-xs tracking-wide text-white/60 transition-colors duration-300 hover:border-signal/40 hover:text-signal"
    >
      <span className="transition-transform duration-300 ease-instrument group-hover:-translate-x-1">
        ←
      </span>
      {label}
    </Link>
  );
}
