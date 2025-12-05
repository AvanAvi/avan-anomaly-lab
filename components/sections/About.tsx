"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen px-4 py-20 md:px-8 lg:px-16"
    >
      {/* Section Header */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 border-l-4 border-terminal-green pl-6">
          <h2 className="mb-2 font-mono text-sm text-terminal-green/60">
            {">"} SYSTEM_INFO
          </h2>
          <h1 className="font-mono text-4xl font-bold text-terminal-green md:text-6xl">
            The Anomaly
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
          {/* Left Column - Philosophical Intro */}
          <div
            className={`space-y-6 transition-all duration-1000 ${
              isInView ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
            }`}
          >
            <div className="group relative border border-terminal-green/30 bg-dark-800/50 p-6 backdrop-blur-sm transition-all hover:border-terminal-green">
              <div className="absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-terminal-green" />
              <div className="absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-terminal-green" />
              
              <p className="font-mono text-lg leading-relaxed text-terminal-green/90">
                They call me <span className="text-terminal-amber">Dr.</span> — 
                though as Queen once said,{" "}
                <span className="italic text-neon-pink">"nothing really matters."</span>
              </p>
              
              <p className="mt-4 font-mono text-base leading-relaxed text-terminal-green/80">
                Just titles. Prefixes. Symbols we attach to make sense of the chaos.
              </p>
            </div>

            <div className="space-y-4 border-l-2 border-terminal-green/30 pl-6">
              <p className="font-mono text-base leading-relaxed text-terminal-green/80">
                I'm an engineer who thinks too much.
                <br />A philosopher who codes.
                <br />A scientist (maybe) who questions most of it, if not all of it—
                <br />maybe some of it—depends on how drunk I am.
                <br />
                <span className="text-xs text-terminal-green/50">(Don't tell my mom I've started drinking again, hehe)</span>
              </p>

              <p className="font-mono text-base leading-relaxed text-terminal-green/80">
                Some call it <span className="text-neon-cyan">Computer Science</span>.
                I call it the art of teaching sand to think.
              </p>
            </div>
          </div>

          {/* Right Column - Academic Journey */}
          <div
            className={`space-y-6 transition-all duration-1000 delay-300 ${
              isInView ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
            }`}
          >
            {/* Bachelor's */}
            <div className="group relative border border-terminal-green/30 bg-dark-800/50 p-6 backdrop-blur-sm transition-all hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/20">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-neon-cyan">BACHELOR_DEGREE</span>
                <div className="h-px flex-1 bg-neon-cyan/30" />
              </div>
              <h3 className="mb-3 font-mono text-xl font-bold text-terminal-green">
                Technology in Computer Science & Engineering
              </h3>
              <p className="font-mono text-sm leading-relaxed text-terminal-green/70">
                Where I learned that zeros and ones could build worlds.
                That logic gates were portals. That algorithms were poetry.
              </p>
            </div>

            {/* Master's */}
            <div className="group relative border border-terminal-green/30 bg-dark-800/50 p-6 backdrop-blur-sm transition-all hover:border-neon-pink hover:shadow-lg hover:shadow-neon-pink/20">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-neon-pink">MASTER_DEGREE</span>
                <div className="h-px flex-1 bg-neon-pink/30" />
              </div>
              <h3 className="mb-3 font-mono text-xl font-bold text-terminal-green">
                Science (Research) in Informatics
              </h3>
              <p className="font-mono text-sm leading-relaxed text-terminal-green/70">
                Where questions became more valuable than answers.
                Where I learned that research is just organized curiosity—
                and sometimes, beautiful chaos.
              </p>
            </div>

            {/* Doctorate (cryptic) */}
            <div className="group relative border border-terminal-green/30 bg-dark-800/50 p-6 backdrop-blur-sm transition-all hover:border-terminal-amber hover:shadow-lg hover:shadow-terminal-amber/20">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-terminal-amber">DOCTORATE_LEVEL</span>
                <div className="h-px flex-1 bg-terminal-amber/30" />
              </div>
              <h3 className="mb-3 font-mono text-xl font-bold text-terminal-green">
                Engineering Doctorate
              </h3>
              <p className="font-mono text-sm italic leading-relaxed text-terminal-green/70">
                "Nothing really matters." <br />
                But if it did, this would be where theory met reality.
                Where I became both the question and the answer.
              </p>
              <p className="mt-2 font-mono text-xs text-terminal-amber/60">
                * Title acquired. Ego optional.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div
          className={`mx-auto mt-16 max-w-3xl transition-all duration-1000 delay-500 ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <div className="border-y border-terminal-green/30 py-8 text-center">
            <p className="font-mono text-xl leading-relaxed text-terminal-green/90 md:text-2xl">
              <span className="text-terminal-amber">[</span>
              <span className="text-neon-pink">25%</span> Engineer{" "}
              <span className="text-terminal-green">|</span>{" "}
              <span className="text-neon-cyan">50%</span> Philosopher{" "}
              <span className="text-terminal-green">|</span>{" "}
              <span className="text-terminal-amber">25%</span> ¯\_(ツ)_/¯
              <span className="text-terminal-amber">]</span>
            </p>
            <p className="mt-4 font-mono text-sm text-terminal-green/60">
              // Breaking the fourth wall of conventional science, one anomaly at a time.
            </p>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="pointer-events-none absolute right-8 top-8 h-24 w-24 border-r-2 border-t-2 border-terminal-green/20" />
        <div className="pointer-events-none absolute bottom-8 left-8 h-24 w-24 border-b-2 border-l-2 border-terminal-green/20" />
      </div>
    </section>
  );
}