/**
 * The small bordered label used for topic/tech tags across every
 * card-with-tags pattern on the site (Reading, Science, Philosophy,
 * Projects). Shared so the four pages can't visually drift from
 * each other one restyle at a time.
 */
export default function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-line px-2 py-1 font-mono text-[11px] text-white/40">
      {children}
    </span>
  );
}
