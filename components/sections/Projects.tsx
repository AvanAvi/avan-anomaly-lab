"use client";

import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { useTransition } from "@/app/transition-provider";

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredUnit, setHoveredUnit] = useState<number | null>(null);
  const { startTransition } = useTransition();

  const handleEnterWorkshop = () => {
    startTransition("/projects", "projects");
  };

  // Preview project units (pixel art style blocks)
  const previewUnits = [
    { id: 1, color: "neon-cyan", label: "WEB" },
    { id: 2, color: "neon-pink", label: "API" },
    { id: 3, color: "terminal-amber", label: "CLI" },
    { id: 4, color: "neon-purple", label: "AI" },
  ];

  return (
    <section
      ref={ref}
      id="projects"
      className="relative min-h-screen px-4 py-20 md:px-8 lg:px-16"
    >
      {/* Section Header */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 border-l-4 border-neon-purple pl-6">
          <h2 className="mb-2 font-mono text-sm text-neon-purple/60">
            {">"} ASSEMBLY_BAY
          </h2>
          <h1 className="font-mono text-4xl font-bold text-neon-purple md:text-6xl">
            What I Build
          </h1>
          <p className="mt-4 font-mono text-base text-terminal-green">
            // Projects assembled in the anomaly workshop
          </p>
        </div>

        {/* Main Workshop Preview Container */}
        <div
          className={`relative mx-auto max-w-4xl transition-all duration-1000 ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          {/* Industrial frame */}
          <div className="relative border-2 border-neon-purple/30 bg-dark-800/80 p-8 backdrop-blur-sm">
            {/* Corner accents */}
            <div className="absolute -left-1 -top-1 h-6 w-6 border-l-2 border-t-2 border-neon-purple" />
            <div className="absolute -right-1 -top-1 h-6 w-6 border-r-2 border-t-2 border-neon-purple" />
            <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-2 border-l-2 border-neon-purple" />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-2 border-r-2 border-neon-purple" />

            {/* Top bar with controls */}
            <div className="mb-8 flex items-center justify-between border-b border-neon-purple/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-terminal-green shadow-[0_0_8px_rgba(0,255,65,0.6)]" />
                <span className="font-mono text-xs text-terminal-green/60">
                  WORKSHOP ONLINE
                </span>
              </div>
              
              {/* Theme dots (decorative) */}
              <div className="flex gap-2">
                <div className="h-4 w-8 rounded-full bg-gradient-to-r from-dark-900 via-neon-purple to-dark-700 opacity-60" />
                <div className="h-4 w-8 rounded-full bg-gradient-to-r from-dark-900 via-terminal-green to-dark-700 opacity-40" />
                <div className="h-4 w-8 rounded-full bg-gradient-to-r from-neon-pink via-dark-700 to-neon-cyan opacity-40" />
              </div>
            </div>

            {/* Project Units Grid (Preview) */}
            <div className="mb-8 flex justify-center gap-4">
              {previewUnits.map((unit, index) => (
                <div
                  key={unit.id}
                  className={`group relative cursor-pointer transition-all duration-500 ${
                    isInView
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onMouseEnter={() => setHoveredUnit(unit.id)}
                  onMouseLeave={() => setHoveredUnit(null)}
                >
                  {/* Unit block - 5x6 pixel grid representation */}
                  <div
                    className={`relative grid grid-cols-5 gap-[2px] rounded-sm p-1 transition-all duration-300 ${
                      hoveredUnit === unit.id
                        ? "scale-110 shadow-lg"
                        : "scale-100"
                    }`}
                    style={{
                      boxShadow:
                        hoveredUnit === unit.id
                          ? `0 0 20px var(--color-${unit.color})`
                          : "none",
                    }}
                  >
                    {/* Generate pixel blocks */}
                    {[...Array(30)].map((_, i) => {
                      const row = Math.floor(i / 5);
                      const col = i % 5;
                      // Create a simple pattern based on unit id
                      const isFilled =
                        (unit.id === 1 && (row < 2 || col === 2)) ||
                        (unit.id === 2 && (row === 0 || row === 2 || row === 5 || col === 0 || col === 4)) ||
                        (unit.id === 3 && (col === 0 || row === 0 || row === 5)) ||
                        (unit.id === 4 && (row <= 2 || col === 2));

                      return (
                        <div
                          key={i}
                          className={`h-2 w-2 transition-all duration-200 ${
                            isFilled
                              ? `bg-${unit.color} ${
                                  hoveredUnit === unit.id ? "opacity-100" : "opacity-70"
                                }`
                              : "bg-dark-900/50"
                          }`}
                          style={{
                            borderRadius: hoveredUnit === unit.id ? "0" : "1px",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Label */}
                  <div
                    className={`mt-2 text-center font-mono text-xs transition-all duration-300 ${
                      hoveredUnit === unit.id
                        ? `text-${unit.color}`
                        : "text-terminal-green/40"
                    }`}
                  >
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats bar */}
            <div className="mb-8 grid grid-cols-3 gap-4 border-y border-neon-purple/20 py-4">
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-neon-purple">12+</div>
                <div className="font-mono text-xs text-terminal-green/60">PROJECTS</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-neon-cyan">8</div>
                <div className="font-mono text-xs text-terminal-green/60">TECH STACKS</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-terminal-amber">∞</div>
                <div className="font-mono text-xs text-terminal-green/60">BUGS FIXED</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 text-center">
              <p className="font-mono text-base leading-relaxed text-terminal-green/80">
                From full-stack applications to CLI tools, each project is a new experiment
                in the lab. Click below to enter the workshop and explore the builds.
              </p>
            </div>

            {/* Enter Workshop Button */}
            <div className="flex justify-center">
              <button
                onClick={handleEnterWorkshop}
                className="group relative overflow-hidden border-2 border-neon-purple bg-dark-900/50 px-8 py-4 font-mono text-lg text-neon-purple transition-all duration-300 hover:border-neon-purple hover:bg-neon-purple/10 hover:shadow-[0_0_30px_rgba(131,56,236,0.4)]"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                
                <span className="relative flex items-center gap-3">
                  <span className="text-xl">⚙</span>
                  ENTER THE WORKSHOP
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </button>
            </div>

            {/* Bottom vent decoration */}
            <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-1 rounded-b bg-dark-700"
                  style={{
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* LED text bar (side decoration) */}
          <div
            className={`absolute -right-4 top-1/2 hidden h-48 w-5 -translate-y-1/2 overflow-hidden rounded bg-dark-900 lg:block ${
              isInView ? "opacity-100" : "opacity-0"
            }`}
            style={{
              boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.5)",
              transition: "opacity 1s ease-out 0.5s",
            }}
          >
            <div className="animate-scroll-text whitespace-nowrap font-mono text-[10px] text-terminal-green [writing-mode:vertical-lr]">
              PROJECTS • BUILDS • EXPERIMENTS • CODE •
            </div>
          </div>

          {/* Electrode effect decoration */}
          <div className="pointer-events-none absolute -left-8 top-0 hidden h-full w-8 opacity-30 lg:block">
            <div className="h-full w-full bg-gradient-to-b from-transparent via-neon-purple/20 to-transparent" />
          </div>
        </div>

        {/* Bottom Quote */}
        <div
          className={`mx-auto mt-16 max-w-3xl transition-all duration-1000 delay-500 ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="border border-neon-purple/30 bg-dark-800/30 p-6 text-center backdrop-blur-sm">
            <p className="font-mono text-base leading-relaxed text-terminal-green/80">
              <span className="text-neon-purple">"</span>
              Every project starts as an anomaly — something that shouldn't work,
              until it does.
              <span className="text-neon-purple">"</span>
            </p>
            <p className="mt-3 font-mono text-sm text-terminal-green/50">
              — Workshop Philosophy #42
            </p>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="pointer-events-none absolute right-8 top-20 h-32 w-32 border-r-2 border-t-2 border-neon-purple/10" />
      <div className="pointer-events-none absolute bottom-20 left-8 h-32 w-32 border-b-2 border-l-2 border-neon-purple/10" />

      {/* Keyframes for scrolling text */}
      <style jsx>{`
        @keyframes scroll-text {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(-100%);
          }
        }
        .animate-scroll-text {
          animation: scroll-text 8s linear infinite;
        }
      `}</style>
    </section>
  );
}