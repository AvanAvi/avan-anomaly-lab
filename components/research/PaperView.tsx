import BackLink from "@/components/ui/BackLink";
import Reveal from "@/components/ui/Reveal";
import StatusBadge from "@/components/ui/StatusBadge";
import ResponseForm from "@/components/research/ResponseForm";
import { ResearchPaper, ResearchProject, STATUS_COPY, THEME_LABEL } from "@/lib/research";

interface ContentsEntry {
  id: string;
  label: string;
}

interface GlanceItem {
  value: string;
  label: string;
  detail: string;
}

/**
 * Layout for a research project that has a written paper: paper
 * metadata, a short at-a-glance readout, a contents list, the paper
 * body, then the wider project thread and the response form the
 * generic project page also has.
 */
export default function PaperView({
  project,
  paper,
  contents,
  glance,
  children,
}: {
  project: ResearchProject;
  paper: ResearchPaper;
  contents: ContentsEntry[];
  glance: GlanceItem[];
  children: React.ReactNode;
}) {
  const status = STATUS_COPY[project.status];

  return (
    <div className="relative px-6 py-20 md:px-12 lg:px-20">
      <BackLink label="Back to the archive" href="/research" />

      <article className="mx-auto max-w-4xl">
        <header>
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-xs tracking-[0.3em] text-signal/70">
                {THEME_LABEL[project.theme].toUpperCase()} · {paper.kind.toUpperCase()}
              </p>
              <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
            </div>
            <h1 className="mt-5 font-display text-3xl leading-tight text-white sm:text-4xl md:text-5xl">{paper.title}</h1>
            {paper.subtitle && (
              <p className="mt-4 font-display text-xl italic text-white/70 md:text-2xl">{paper.subtitle}</p>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-10 grid gap-x-8 gap-y-4 border-y border-line py-6 sm:grid-cols-2">
              {[
                ["Status", paper.status],
                ["Date", paper.date],
                ["Type", paper.kind],
                ["Approach", paper.approach],
              ].map(([term, value]) => (
                <div key={term}>
                  <dt className="font-mono text-[11px] tracking-[0.2em] text-white/40">{term.toUpperCase()}</dt>
                  <dd className="mt-1 font-sans text-sm text-white/75">{value}</dd>
                </div>
              ))}
            </dl>
            {paper.pdfUrl && (
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 border border-signal/40 px-4 py-2 font-mono text-xs tracking-wide text-signal transition-colors hover:bg-signal/10"
              >
                Read the full paper (PDF) ↗
              </a>
            )}
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-10 font-sans text-lg leading-relaxed text-white/75">{paper.summary}</p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2">
              {glance.map((g) => (
                <div key={g.label} className="bg-ink-950 p-5">
                  <p className="font-display text-3xl text-signal">{g.value}</p>
                  <p className="mt-1 font-mono text-[11px] tracking-[0.15em] text-white/50">{g.label.toUpperCase()}</p>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-white/50">{g.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 border-l-2 border-terminal-amber/50 pl-4 font-sans text-sm leading-relaxed text-white/60">
              A model-based study built entirely from public literature. It does not establish that Mach 25 cruise
              is achievable, let alone Mach 30. Its results hold for one fixed reference vehicle at a constant
              30 km cruise altitude under steady-state heating, and the propulsion performance it assumes has not
              been demonstrated.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <nav aria-label="Paper contents" className="mt-12">
              <p className="font-mono text-xs tracking-[0.2em] text-white/40">CONTENTS</p>
              <ol className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                {contents.map((c, i) => (
                  <li key={c.id}>
                    <a
                      href={`#${c.id}`}
                      className="group inline-flex items-baseline gap-2 py-1 font-sans text-sm text-white/60 transition-colors hover:text-signal"
                    >
                      <span className="font-mono text-[11px] text-signal/50">{String(i + 1).padStart(2, "0")}</span>
                      {c.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        </header>

        {children}

        {/* The wider research thread this paper belongs to */}
        <section aria-labelledby="thread-heading" className="mt-24 border-t border-line-strong pt-10">
          <p className="font-mono text-xs tracking-[0.2em] text-white/40">THE WIDER THREAD</p>
          <h2 id="thread-heading" className="mt-3 font-display text-3xl text-white">
            {project.title}
          </h2>
          <p className="mt-4 max-w-3xl font-sans text-base leading-relaxed text-white/60">{project.abstract}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {project.keyIdeas.map((idea) => (
              <div key={idea.label} className="border border-line p-5">
                <h3 className="font-display text-lg text-white">{idea.label}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-white/50">{idea.detail}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 font-mono text-xs tracking-[0.2em] text-white/40">OPEN QUESTIONS</p>
          <ol className="mt-4 space-y-4">
            {project.questions.map((q, i) => (
              <li key={i} className="flex gap-4 border-l-2 border-signal/30 pl-5">
                <span className="font-mono text-xs text-signal/50">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-sans text-sm leading-relaxed text-white/70">{q}</p>
              </li>
            ))}
          </ol>

          {project.writing.length > 0 && (
            <>
              <p className="mt-10 font-mono text-xs tracking-[0.2em] text-white/40">RELATED WRITING</p>
              <div className="mt-4 space-y-3">
                {project.writing.map((piece) => (
                  <div key={piece.title} className="border border-line p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-lg text-white">{piece.title}</h3>
                      {piece.penName && (
                        <span className="border border-signal/30 px-2 py-0.5 font-mono text-[10px] tracking-wide text-signal/60">
                          PEN NAME
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-white/50">{piece.excerpt}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section aria-labelledby="perspective-heading" className="mt-14 border border-line-strong p-6 md:p-8">
          <h2 id="perspective-heading" className="font-mono text-xs font-normal tracking-[0.2em] text-white/40">
            ADD A PERSPECTIVE
          </h2>
          <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-white/50">
            If you see an error in this analysis, a source it should be using, or a better way to frame the
            problem, this is the place for it. Not a comment section, and there is no promise of a reply.
          </p>
          <div className="mt-6">
            <ResponseForm projectSlug={project.slug} />
          </div>
        </section>

        <p className="mt-12 text-center">
          <a href="#top" className="font-mono text-xs text-white/40 transition-colors hover:text-signal">
            ↑ Back to top
          </a>
        </p>
      </article>
    </div>
  );
}
