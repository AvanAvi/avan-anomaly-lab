"use client";

import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { useTransition } from "@/app/transition-provider";

export default function Writings() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { startTransition } = useTransition();

  const handleScienceClick = () => {
    startTransition("/science", "science");
  };

  const handlePhilosophyClick = () => {
    startTransition("/philosophy", "philosophy");
  };

  const handleReadingClick = () => {
    startTransition("/reading", "reading");
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen px-4 py-20 md:px-8 lg:px-16"
    >
      {/* Section Header */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 border-l-4 border-terminal-green pl-6">
          <h2 className="mb-2 font-mono text-sm text-terminal-green/60">
            {">"} OUTPUT_STREAM
          </h2>
          <h1 className="font-mono text-4xl font-bold text-terminal-green md:text-6xl">
            What I Create
          </h1>
          <p className="mt-4 font-mono text-base text-terminal-green">
            // Words, thoughts, and occasionally coherent sentences
          </p>
        </div>

        {/* Three Writing Categories */}
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
          
          {/* Science & Tech Writing - CLICKABLE */}
          <div
            className={`group relative cursor-pointer transition-all duration-700 ${
              isInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
            onMouseEnter={() => setHoveredCard("science")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handleScienceClick}
          >
            <div className="relative h-full border-2 border-neon-cyan/30 bg-dark-800/50 p-6 backdrop-blur-sm transition-all hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/20">
              {/* Corner accents */}
              <div className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-neon-cyan" />
              <div className="absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-neon-cyan" />
              
              {/* Icon */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center border border-neon-cyan/50 bg-neon-cyan/10">
                <span className="font-mono text-3xl text-neon-cyan">⚛</span>
              </div>

              {/* Title */}
              <h3 className="mb-3 font-mono text-2xl font-bold text-neon-cyan">
                Science & Tech
              </h3>

              {/* Description */}
              <div className="mb-6 space-y-3 font-mono text-sm leading-relaxed text-terminal-green">
                <p>
                  I write about the things that make computers do computer things.
                </p>
                <p className="text-neon-cyan">
                  TDD, CI/CD, nuclear safety systems, Java sorcery, breaking things securely (pen testing), and why Docker containers are basically digital Tupperware.
                </p>
                <p className="italic text-terminal-green">
                  "If it compiles, ship it." — Ancient Developer Proverb
                </p>
              </div>

              {/* Topics list */}
              <div className="space-y-2 border-t border-neon-cyan/20 pt-4">
                <p className="font-mono text-xs text-neon-cyan/60">TOPICS:</p>
                <div className="flex flex-wrap gap-2">
                  {["Spring Boot", "Security", "CI/CD", "Testing", "Nuclear Tech"].map((topic) => (
                    <span
                      key={topic}
                      className="border border-neon-cyan/30 bg-neon-cyan/5 px-2 py-1 font-mono text-xs text-neon-cyan"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Click indicator */}
              <div className="mt-4 flex items-center gap-2 font-mono text-xs text-neon-cyan/60 group-hover:text-neon-cyan">
                <span>Click to explore</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>

              {/* Hover effect particles */}
              {hoveredCard === "science" && (
                <div className="pointer-events-none absolute inset-0">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-1 w-1 animate-pulse rounded-full bg-neon-cyan"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Philosophy - CLICKABLE */}
          <div
            className={`group relative cursor-pointer transition-all duration-700 delay-200 ${
              isInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
            onMouseEnter={() => setHoveredCard("philosophy")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handlePhilosophyClick}
          >
            <div className="relative h-full border-2 border-neon-pink/30 bg-dark-800/50 p-6 backdrop-blur-sm transition-all hover:border-neon-pink hover:shadow-lg hover:shadow-neon-pink/20">
              {/* Corner accents */}
              <div className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-neon-pink" />
              <div className="absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-neon-pink" />
              
              {/* Icon */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center border border-neon-pink/50 bg-neon-pink/10">
                <span className="font-mono text-3xl text-neon-pink">ψ</span>
              </div>

              {/* Title */}
              <h3 className="mb-3 font-mono text-2xl font-bold text-neon-pink">
                Philosophy
              </h3>

              {/* Description */}
              <div className="mb-6 space-y-3 font-mono text-sm leading-relaxed text-terminal-green">
                <p>
                  Where I pretend to understand existence while my coffee gets cold.
                </p>
                <p className="text-neon-pink">
                  Questions about consciousness, free will, the ethics of AI, why we build things that might replace us, and whether Schrödinger's cat filed a workplace complaint.
                </p>
                <p className="italic text-terminal-green">
                  "I think, therefore I debug." — Probably Descartes
                </p>
              </div>

              {/* Topics list */}
              <div className="space-y-2 border-t border-neon-pink/20 pt-4">
                <p className="font-mono text-xs text-neon-pink/60">MUSINGS:</p>
                <div className="flex flex-wrap gap-2">
                  {["Existential Code", "AI Ethics", "Free Will.exe", "Meaning++", "¯\\_(ツ)_/¯"].map((topic) => (
                    <span
                      key={topic}
                      className="border border-neon-pink/30 bg-neon-pink/5 px-2 py-1 font-mono text-xs text-neon-pink"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Click indicator */}
              <div className="mt-4 flex items-center gap-2 font-mono text-xs text-neon-pink/60 group-hover:text-neon-pink">
                <span>Enter the School</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>

              {/* Glitch effect on hover */}
              {hoveredCard === "philosophy" && (
                <div className="pointer-events-none absolute inset-0 animate-pulse bg-neon-pink/5" />
              )}
            </div>
          </div>

          {/* Reading - NOW CLICKABLE */}
          <div
            className={`group relative cursor-pointer transition-all duration-700 delay-400 ${
              isInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
            onMouseEnter={() => setHoveredCard("reading")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handleReadingClick}
          >
            <div className="relative h-full border-2 border-terminal-amber/30 bg-dark-800/50 p-6 backdrop-blur-sm transition-all hover:border-terminal-amber hover:shadow-lg hover:shadow-terminal-amber/20">
              {/* Corner accents */}
              <div className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-terminal-amber" />
              <div className="absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-terminal-amber" />
              
              {/* Icon */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center border border-terminal-amber/50 bg-terminal-amber/10">
                <span className="font-mono text-3xl text-terminal-amber">📚</span>
              </div>

              {/* Title */}
              <h3 className="mb-3 font-mono text-2xl font-bold text-terminal-amber">
                Reading List
              </h3>

              {/* Description */}
              <div className="mb-6 space-y-3 font-mono text-sm leading-relaxed text-terminal-green">
                <p>
                  Books I'm reading, have read, or pretend to have read at parties.
                </p>
                <p className="text-terminal-amber">
                  Sci-fi that predicted our dystopia, philosophy that explains why we're confused, tech books that become obsolete before I finish them, and occasionally something that isn't depressing.
                </p>
                <p className="italic text-terminal-green">
                  "So many books, so little RAM." — Every developer ever
                </p>
              </div>

              {/* Current reads */}
              <div className="space-y-2 border-t border-terminal-amber/20 pt-4">
                <p className="font-mono text-xs text-terminal-amber/60">GENRES:</p>
                <div className="flex flex-wrap gap-2">
                  {["Sci-Fi", "Philosophy", "Tech", "Dystopia", "Essays"].map((topic) => (
                    <span
                      key={topic}
                      className="border border-terminal-amber/30 bg-terminal-amber/5 px-2 py-1 font-mono text-xs text-terminal-amber"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Click indicator */}
              <div className="mt-4 flex items-center gap-2 font-mono text-xs text-terminal-amber/60 group-hover:text-terminal-amber">
                <span>Browse the Vault</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>

              {/* Floating books effect */}
              {hoveredCard === "reading" && (
                <div className="pointer-events-none absolute inset-0">
                  {["📖", "📕", "📗", "📘"].map((book, i) => (
                    <div
                      key={i}
                      className="absolute animate-bounce text-2xl opacity-50"
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${30 + i * 10}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: "2s",
                      }}
                    >
                      {book}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div
          className={`mx-auto mt-16 max-w-3xl transition-all duration-1000 delay-600 ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <div className="border border-terminal-green/30 bg-dark-800/30 p-8 text-center backdrop-blur-sm">
            <p className="font-mono text-lg leading-relaxed text-terminal-green">
              <span className="text-neon-cyan">"</span>
              I write to understand what I think. I code to understand what I write.
              I read to forget I'm doing both.
              <span className="text-neon-cyan">"</span>
            </p>
            <p className="mt-4 font-mono text-sm text-terminal-green">
              — Avan, probably around 3 AM
            </p>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="pointer-events-none absolute right-12 top-20 h-32 w-32 border-r-2 border-t-2 border-terminal-green/10" />
      <div className="pointer-events-none absolute bottom-20 left-12 h-32 w-32 border-b-2 border-l-2 border-terminal-green/10" />
    </section>
  );
}