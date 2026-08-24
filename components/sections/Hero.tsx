"use client";

import dynamic from "next/dynamic";
import { useTransition } from "@/app/transition-provider";
import Reveal from "@/components/ui/Reveal";
import SignalButton from "@/components/ui/SignalButton";

// WebGL/R3F only ever runs client-side; ssr: false keeps it out of the
// server-rendered HTML entirely rather than relying on a Suspense boundary
// to paper over a component that can't render on the server at all. No
// loading placeholder: the region has no visible boundary to fill while
// waiting, and the simulation's own ~1.6s startup sequence (structure,
// then field, then plasma) is the intended way it appears.
const TokamakSimulation = dynamic(() => import("@/components/effects/TokamakSimulation"), {
  ssr: false,
  loading: () => null,
});

interface HeroContentProps {
  onScrollToProjects: () => void;
  onOpenPhilosophy: () => void;
}

/** The primary information hierarchy: eyebrow, headline, description, actions, status. */
function HeroContent({ onScrollToProjects, onOpenPhilosophy }: HeroContentProps) {
  return (
    <div className="w-full max-w-2xl lg:w-auto lg:shrink-0">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.3em] text-signal/70">AVAN · ANOMALY LAB</p>
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
          <SignalButton variant="primary" onClick={onScrollToProjects}>
            View the work
          </SignalButton>
          <SignalButton variant="ghost" onClick={onOpenPhilosophy}>
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
  );
}

/**
 * The right side of the hero: no card, no border, no panel. The tokamak
 * sits directly in the page's own visual field (the same dark background
 * and drafting grid FieldBackground paints sitewide, showing straight
 * through since the canvas itself is transparent) and its own edges fade
 * out under a soft radial mask instead of stopping at a hard rectangle.
 * A visitor should notice the reactor before noticing a boundary around it.
 */
function HeroVisualization() {
  return (
    <Reveal delay={0.25} className="relative w-full lg:flex-1">
      <div
        className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-[480px]"
        style={{
          maskImage: "radial-gradient(ellipse 62% 62% at 50% 48%, black 40%, transparent 82%)",
          WebkitMaskImage: "radial-gradient(ellipse 62% 62% at 50% 48%, black 40%, transparent 82%)",
        }}
      >
        <TokamakSimulation />
      </div>

      {/* One ambient instrument label, low enough opacity to read as
          atmosphere rather than a UI element sitting on top of the scene. */}
      <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] text-signal/25 lg:left-0 lg:translate-x-0">
        TOKAMAK · PLASMA CONFINED
      </p>
    </Reveal>
  );
}

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
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
        <HeroContent onScrollToProjects={scrollToProjects} onOpenPhilosophy={openPhilosophy} />
        <HeroVisualization />
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
