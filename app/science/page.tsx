"use client";

import BackLink from "@/components/ui/BackLink";
import FieldBackground from "@/components/effects/FieldBackground";
import Reveal from "@/components/ui/Reveal";
import TagChip from "@/components/ui/TagChip";

// Placeholder entries. Swap in real writing when it exists; until then
// each card is marked so nothing here reads as a published article.
const DRAFT_ARTICLES = [
  {
    id: 1,
    title: "The EM Drive Paradox: When Physics Gets Weird",
    excerpt: "Exploring impossible propulsion systems and why they should not work, but maybe do.",
    tags: ["Physics", "Propulsion", "Anomalies"],
  },
  {
    id: 2,
    title: "Quantum Computing: Hype vs. Reality",
    excerpt: "Separating the science from the science fiction in quantum tech.",
    tags: ["Quantum", "Computing", "Future"],
  },
  {
    id: 3,
    title: "AI Alignment: The Philosophy Problem",
    excerpt: "Why making AI good is harder than you think.",
    tags: ["AI", "Ethics", "Philosophy"],
  },
];

export default function SciencePage() {
  return (
    <div className="relative min-h-screen">
      <FieldBackground />
      <div className="relative px-6 py-20 md:px-12 lg:px-20">
        <BackLink />

        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-signal/70">SCIENCE AND TECH</p>
            <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">
              Where curiosity meets <span className="italic text-signal">questionable</span> experiments
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-white/50">
              Long-form notes on systems, security, and physics that occasionally refuses to
              behave. Most of it is still a draft.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 space-y-6">
              {DRAFT_ARTICLES.map((article, index) => (
                <article
                  key={article.id}
                  className="border border-line p-6 transition-colors duration-300 hover:border-line-strong md:p-8"
                >
                  <div className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-wide text-terminal-amber/70">
                    <span className="border border-terminal-amber/30 px-2 py-0.5">DRAFT</span>
                    <span>Not yet published</span>
                  </div>
                  <h2 className="font-display text-2xl text-white md:text-3xl">{article.title}</h2>
                  <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-white/50">
                    {article.excerpt}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <TagChip key={tag}>{tag}</TagChip>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-16 border border-line p-8 text-center">
              <p className="font-mono text-sm text-white/40">
                More writing lands here as it is finished.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
