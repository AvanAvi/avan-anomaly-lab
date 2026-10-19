import TeX from "@/components/research/paper/TeX";
import { REFERENCE_BY_KEY } from "@/lib/papers/hypersonic-tps";

const TOKEN = /(\$[^$]+\$|\[\[[^\]]+\]\])/g;

/**
 * Paper prose with two inline markups: `$...$` for TeX math and
 * `[[Key]]` (or `[[KeyA,KeyB]]`) for a citation that links to the
 * reference list. Unknown citation keys throw, so a broken reference
 * fails the build rather than shipping.
 */
export default function RichText({ children }: { children: string }) {
  const parts = children.split(TOKEN).filter(Boolean);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          return <TeX key={i} tex={part.slice(1, -1)} />;
        }
        if (part.startsWith("[[") && part.endsWith("]]")) {
          const keys = part.slice(2, -2).split(",").map((k) => k.trim());
          return (
            <span key={i}>
              {keys.map((key, j) => {
                const ref = REFERENCE_BY_KEY[key];
                if (!ref) throw new Error(`Unknown citation key: ${key}`);
                return (
                  <span key={key}>
                    {j > 0 && "; "}
                    <a
                      href={`#ref-${key}`}
                      className="text-signal/80 underline decoration-signal/30 underline-offset-2 transition-colors hover:text-signal hover:decoration-signal"
                    >
                      {ref.label}
                    </a>
                  </span>
                );
              })}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
