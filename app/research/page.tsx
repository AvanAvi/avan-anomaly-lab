"use client";

import BackLink from "@/components/ui/BackLink";
import FieldBackground from "@/components/effects/FieldBackground";
import Reveal from "@/components/ui/Reveal";
import ResearchCard from "@/components/research/ResearchCard";
import PenNameNote from "@/components/research/PenNameNote";
import { PROJECTS } from "@/lib/research";

export default function ResearchIndexPage() {
  return (
    <div className="relative min-h-screen">
      <FieldBackground />
      <div className="relative px-6 py-20 md:px-12 lg:px-20">
        <BackLink label="Exit the archive" />

        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-signal/70">RESEARCH</p>
            <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">
              An <span className="italic text-signal">archive</span>, not a journal
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-white/50">
              Working theses, open questions, and half-finished models. Some of it will
              stay unfinished on purpose. Pick a project to see where the thinking
              currently stands.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((project) => (
                <ResearchCard key={project.slug} project={project} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-16 max-w-xl border-t border-line pt-8">
              <PenNameNote />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
