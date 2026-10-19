import RichText from "@/components/research/paper/RichText";

/**
 * A data table from the paper. Cells accept RichText markup so units
 * and symbols render as math. Scrolls horizontally inside its own box
 * on narrow screens instead of widening the page.
 */
export default function PaperTable({
  caption,
  headers,
  rows,
  highlightRow,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
  highlightRow?: number;
}) {
  return (
    <div className="my-8">
      <div className="overflow-x-auto border border-line" tabIndex={0} role="region" aria-label={caption}>
        <table className="w-full min-w-[32rem] border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line-strong bg-ink-900/60">
              {headers.map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-mono text-[11px] font-medium tracking-wide text-white/45">
                  <RichText>{h}</RichText>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-line last:border-b-0 ${i === highlightRow ? "bg-signal/[0.06]" : ""}`}
              >
                {row.map((cell, j) =>
                  j === 0 ? (
                    <th key={j} scope="row" className="px-4 py-3 align-top font-sans text-sm font-normal text-white/80">
                      <RichText>{cell}</RichText>
                    </th>
                  ) : (
                    <td key={j} className="px-4 py-3 align-top font-sans text-sm text-white/60">
                      <RichText>{cell}</RichText>
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-sans text-sm leading-relaxed text-white/45">{caption}</p>
    </div>
  );
}
