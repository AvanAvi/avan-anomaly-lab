"use client";

import { useTransition } from "@/app/transition-provider";
import Reveal from "@/components/ui/Reveal";
import SignalButton from "@/components/ui/SignalButton";

export default function Hero() {
  const { startTransition } = useTransition();

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const openPhilosophy = () => {
    startTransition("/philosophy", "philosophy");
  };

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-20 md:px-12 lg:px-20">
      <div className="relative z-10 max-w-2xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-signal/70">
            AVAN · ANOMALY LAB
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-6 font-display text-6xl leading-[1.05] text-white sm:text-7xl lg:text-8xl">
            Engineering,
            <br />
            <span className="italic text-signal">examined.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-lg font-sans text-lg leading-relaxed text-white/60">
            Software engineering, applied philosophy, and the occasional
            experiment that should not work. This is where I test all three.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <SignalButton variant="primary" onClick={scrollToProjects}>
              View the work
            </SignalButton>
            <SignalButton variant="ghost" onClick={openPhilosophy}>
              Read the philosophy
            </SignalButton>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-16 flex items-center gap-2.5 font-mono text-xs text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_rgba(110,231,192,0.8)]" />
            STATUS · OPERATIONAL
          </div>
        </Reveal>
      </div>

      {/* Instrument frame ticks, restrained corner marks rather than full borders */}
      <div className="pointer-events-none absolute left-6 top-20 h-8 w-px bg-line-strong md:left-12" />
      <div className="pointer-events-none absolute left-6 top-20 h-px w-8 bg-line-strong md:left-12" />
      <div className="pointer-events-none absolute bottom-10 right-6 h-8 w-px bg-line-strong md:right-12" />
      <div className="pointer-events-none absolute bottom-10 right-6 h-px w-8 bg-line-strong md:right-12" />

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-10 left-6 hidden items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-white/30 md:left-12 lg:flex">
        <span className="h-8 w-px animate-pulse bg-white/20" />
        SCROLL
      </div>
    </section>
  );
}
