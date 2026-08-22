import Link from "next/link";
import { ResearchProject, STATUS_COPY, THEME_LABEL } from "@/lib/research";
import StatusBadge from "@/components/ui/StatusBadge";

/**
 * The index card for one research project. Deliberately understated:
 * a theme, a thesis, a status, nothing that reads as a finished paper.
 */
export default function ResearchCard({ project }: { project: ResearchProject }) {
  const status = STATUS_COPY[project.status];

  return (
    <Link
      href={`/research/${project.slug}`}
      className="group flex h-full flex-col border border-line p-6 transition-colors duration-300 hover:border-signal/40"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.2em] text-signal/60">
          {THEME_LABEL[project.theme].toUpperCase()}
        </p>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </div>

      <h3 className="font-display text-2xl text-white">{project.title}</h3>

      <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-white/50">{project.thesis}</p>

      <p className="mt-6 font-mono text-xs text-signal/70 transition-all duration-300 group-hover:translate-x-1">
        Enter the archive →
      </p>
    </Link>
  );
}
