import Link from "next/link";
import { ResearchProject, STATUS_COPY, THEME_LABEL } from "@/lib/research";
import StatusBadge from "@/components/ui/StatusBadge";

/**
 * The index card for one research project. Deliberately understated:
 * a theme, a thesis, a status. A project with a working paper says so,
 * but still not as a finished publication.
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

      <h2 className="font-display text-2xl text-white">{project.title}</h2>

      <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-white/50">{project.thesis}</p>

      {project.paper && (
        <p className="mt-5 border-t border-line pt-4 font-mono text-[11px] leading-relaxed tracking-wide text-white/45">
          {project.paper.kind.toUpperCase()} · {project.paper.date.toUpperCase()}
        </p>
      )}

      <p className="mt-6 font-mono text-xs text-signal/70 transition-all duration-300 group-hover:translate-x-1">
        {project.paper ? "Read the paper →" : "Enter the archive →"}
      </p>
    </Link>
  );
}
