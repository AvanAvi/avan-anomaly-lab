"use client";

import { useTransition } from "@/app/transition-provider";
import Reveal from "@/components/ui/Reveal";
import SignalButton from "@/components/ui/SignalButton";
import PenNameNote from "@/components/research/PenNameNote";
import { PROJECTS, THEME_LABEL } from "@/lib/research";

export default function Research() {
  const { startTransition } = useTransition();

  return (
    <section className="relative px-6 py-28 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-signal/70">RESEARCH</p>
          <h2 className="mt-4 font-display text-5xl text-white md:text-6xl">
            What I <span className="italic text-signal">Question</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl font-display text-2xl italic leading-relaxed text-white/80 md:text-3xl">
            A working archive of theses, open questions, and half-finished models,
            not a publication list.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-12">
          <div className="grid gap-3 border-y border-line py-6 sm:grid-cols-3">
            {PROJECTS.map((project) => (
              <div key={project.slug}>
                <p className="font-mono text-[11px] tracking-wide text-white/40">
                  {THEME_LABEL[project.theme]}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.25} className="mt-8 max-w-xl">
          <PenNameNote />
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10">
            <SignalButton variant="primary" onClick={() => startTransition("/research", "research")}>
              Enter the archive
            </SignalButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
