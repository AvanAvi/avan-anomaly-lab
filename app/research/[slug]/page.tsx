import "katex/dist/katex.min.css";
import { notFound } from "next/navigation";
import BackLink from "@/components/ui/BackLink";
import FieldBackground from "@/components/effects/FieldBackground";
import Reveal from "@/components/ui/Reveal";
import StatusBadge from "@/components/ui/StatusBadge";
import PaperView from "@/components/research/PaperView";
import ResearchDiagram from "@/components/research/ResearchDiagram";
import ResponseForm from "@/components/research/ResponseForm";
import HypersonicTpsPaper, {
  AT_A_GLANCE as HYPERSONIC_TPS_GLANCE,
  CONTENTS as HYPERSONIC_TPS_CONTENTS,
} from "@/components/research/papers/HypersonicTpsPaper";
import { getProject, STATUS_COPY, THEME_LABEL } from "@/lib/research";

// Rendered on the server so paper equations are typeset at build time
// and no math runtime ships to the browser. Interactive pieces (Reveal,
// ResponseForm) are client components nested inside.

/** Paper bodies keyed by project slug. */
const PAPER_BODIES: Record<
  string,
  { Body: () => JSX.Element; contents: typeof HYPERSONIC_TPS_CONTENTS; glance: typeof HYPERSONIC_TPS_GLANCE }
> = {
  "unconventional-propulsion": {
    Body: HypersonicTpsPaper,
    contents: HYPERSONIC_TPS_CONTENTS,
    glance: HYPERSONIC_TPS_GLANCE,
  },
};

export default function ResearchProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);

  if (!project) notFound();

  const paperBody = project.paper ? PAPER_BODIES[project.slug] : undefined;

  if (project.paper && paperBody) {
    const { Body, contents, glance } = paperBody;
    return (
      <div id="top" className="relative min-h-screen">
        <FieldBackground />
        <PaperView project={project} paper={project.paper} contents={contents} glance={glance}>
          <Body />
        </PaperView>
      </div>
    );
  }

  const status = STATUS_COPY[project.status];

  return (
    <div className="relative min-h-screen">
      <FieldBackground />
      <div className="relative px-6 py-20 md:px-12 lg:px-20">
        <BackLink label="Back to the archive" href="/research" />

        <div className="mx-auto max-w-4xl">
          {/* Overview */}
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-xs tracking-[0.3em] text-signal/70">
                {THEME_LABEL[project.theme].toUpperCase()}
              </p>
              <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
            </div>
            <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">{project.title}</h1>
            <p className="mt-6 font-display text-xl italic leading-relaxed text-white/80 md:text-2xl">
              {project.thesis}
            </p>
            <p className="mt-2 font-mono text-xs text-white/30">{project.statusNote}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-10 max-w-3xl font-sans text-base leading-relaxed text-white/60">
              {project.abstract}
            </p>
          </Reveal>

          {/* Key ideas */}
          <Reveal delay={0.15}>
            <div className="mt-14">
              <p className="font-mono text-xs tracking-[0.2em] text-white/40">KEY IDEAS</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {project.keyIdeas.map((idea) => (
                  <div key={idea.label} className="border border-line p-5">
                    <h2 className="font-display text-lg text-white">{idea.label}</h2>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-white/50">{idea.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Questions */}
          <Reveal delay={0.2}>
            <div className="mt-14">
              <p className="font-mono text-xs tracking-[0.2em] text-white/40">OPEN QUESTIONS</p>
              <ol className="mt-4 space-y-4">
                {project.questions.map((q, i) => (
                  <li key={i} className="flex gap-4 border-l-2 border-signal/30 pl-5">
                    <span className="font-mono text-xs text-signal/50">{String(i + 1).padStart(2, "0")}</span>
                    <p className="font-sans text-sm leading-relaxed text-white/70">{q}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          {/* Visual / model */}
          <Reveal delay={0.25}>
            <div className="mt-14">
              <p className="font-mono text-xs tracking-[0.2em] text-white/40">VISUAL / MODEL</p>
              <div className="mt-4">
                <ResearchDiagram theme={project.theme} />
              </div>
            </div>
          </Reveal>

          {/* Methodology */}
          <Reveal delay={0.3}>
            <div className="mt-14">
              <p className="font-mono text-xs tracking-[0.2em] text-white/40">METHOD</p>
              <ul className="mt-4 space-y-2">
                {project.methodology.map((m, i) => (
                  <li key={i} className="font-sans text-sm leading-relaxed text-white/50">
                    · {m}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Writing */}
          <Reveal delay={0.35}>
            <div className="mt-14">
              <p className="font-mono text-xs tracking-[0.2em] text-white/40">WRITING</p>
              <div className="mt-4 space-y-3">
                {project.writing.map((piece) => (
                  <div key={piece.title} className="border border-line p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-lg text-white">{piece.title}</h2>
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
            </div>
          </Reveal>

          {/* Response */}
          <Reveal delay={0.4}>
            <div className="mt-14 border border-line-strong p-6 md:p-8">
              <p className="font-mono text-xs tracking-[0.2em] text-white/40">ADD A PERSPECTIVE</p>
              <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-white/50">
                If you see a hole in this thinking, a question it should be asking, or a
                genuinely different way to frame it, this is the place for it. Not a
                comment section, and there is no promise of a reply.
              </p>
              <div className="mt-6">
                <ResponseForm projectSlug={project.slug} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
