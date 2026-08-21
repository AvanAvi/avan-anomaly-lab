"use client";

import { useTransition } from "@/app/transition-provider";
import Reveal from "@/components/ui/Reveal";
import SignalButton from "@/components/ui/SignalButton";
import StatsRow from "@/components/ui/StatsRow";

const STATS = [
  { value: "12+", label: "Projects" },
  { value: "8", label: "Tech Stacks" },
  { value: "∞", label: "Bugs Fixed" },
];

export default function Projects() {
  const { startTransition } = useTransition();

  return (
    <section className="relative px-6 py-28 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-signal/70">PROJECTS</p>
          <h2 className="mt-4 font-display text-5xl text-white md:text-6xl">
            What I <span className="italic text-signal">Build</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl font-display text-2xl italic leading-relaxed text-white/80 md:text-3xl">
            Every project starts as an anomaly: something that should not work,
            until it does.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-14">
          <StatsRow stats={STATS} />
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12">
            <SignalButton variant="primary" onClick={() => startTransition("/projects", "projects")}>
              Enter the workshop
            </SignalButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
