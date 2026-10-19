import TeX from "@/components/research/paper/TeX";

/**
 * A numbered display equation with a plain-language gloss underneath.
 * The number matches the order equations appear on this page, not the
 * LaTeX source, since the web version presents a subset.
 */
export default function Equation({
  tex,
  number,
  label,
  children,
}: {
  tex: string;
  number: number;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <figure className="my-8 border border-line bg-ink-900/50" aria-label={`Equation ${number}: ${label}`}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2">
        <p className="font-mono text-[11px] tracking-[0.15em] text-white/40">{label.toUpperCase()}</p>
        <p className="font-mono text-[11px] text-signal/60">({number})</p>
      </div>
      <div className="px-4 py-4 text-lg text-white md:px-6">
        <TeX tex={tex} display />
      </div>
      {children && (
        <figcaption className="border-t border-line px-4 py-3 font-sans text-sm leading-relaxed text-white/55 md:px-6">
          {children}
        </figcaption>
      )}
    </figure>
  );
}
