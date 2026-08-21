type Tone = "positive" | "active" | "neutral";

const TONE_STYLES: Record<Tone, string> = {
  positive: "border-signal/40 bg-signal/5 text-signal",
  active: "border-terminal-amber/40 bg-terminal-amber/5 text-terminal-amber",
  neutral: "border-line-strong text-white/50",
};

/**
 * Shared status pill used wherever a page tracks an item's state
 * (a book's reading status, a project's shipping status). Callers map
 * their own domain-specific status to one of three tones so the actual
 * color treatment lives in one place.
 */
export default function StatusBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`border px-2.5 py-1 font-mono text-xs font-medium ${TONE_STYLES[tone]}`}>
      {children}
    </span>
  );
}
