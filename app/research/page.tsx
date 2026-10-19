"use client";

import BackLink from "@/components/ui/BackLink";
import FieldBackground from "@/components/effects/FieldBackground";
import Reveal from "@/components/ui/Reveal";
import ResearchCard from "@/components/research/ResearchCard";
import PenNameNote from "@/components/research/PenNameNote";
import Link from "next/link";
import { PROJECTS, THEME_LABEL } from "@/lib/research";

export default function ResearchIndexPage() {
  const featured = PROJECTS.find((p) => p.paper);

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

          {featured?.paper && (
            <Reveal delay={0.05}>
              <section aria-labelledby="featured-paper-heading" className="mt-14 border border-line-strong bg-ink-900/40 p-6 md:p-10">
                <p className="font-mono text-[11px] tracking-[0.25em] text-signal/70">
                  LATEST WORKING PAPER · {THEME_LABEL[featured.theme].toUpperCase()}
                </p>
                <h2 id="featured-paper-heading" className="mt-4 max-w-3xl font-display text-3xl leading-tight text-white md:text-4xl">
                  {featured.paper.title}
                </h2>
                <p className="mt-5 max-w-3xl font-sans text-base leading-relaxed text-white/60">{featured.paper.summary}</p>
                <p className="mt-5 font-mono text-xs text-white/40">
                  {featured.paper.subtitle} · {featured.paper.date} · {featured.paper.status}
                </p>
                <Link
                  href={`/research/${featured.slug}`}
                  className="group mt-8 inline-flex items-center gap-2 border border-signal/40 px-4 py-2 font-mono text-xs tracking-wide text-signal transition-colors duration-300 hover:bg-signal/10"
                >
                  Read the paper
                  <span className="transition-transform duration-300 ease-instrument group-hover:translate-x-1">→</span>
                </Link>
              </section>
            </Reveal>
          )}

          <Reveal delay={0.1}>
            <p className="mt-16 font-mono text-xs tracking-[0.2em] text-white/40">ALL PROJECTS</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
