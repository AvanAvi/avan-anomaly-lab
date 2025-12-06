"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [text, setText] = useState("");
  const fullText = "Avan's Anomaly Lab";
  const [showCursor, setShowCursor] = useState(true);

  // Typing effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff4110_1px,transparent_1px),linear-gradient(to_bottom,#00ff4110_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Main Title */}
        <h1 className="mb-6 font-mono text-5xl font-bold text-terminal-green md:text-7xl lg:text-8xl">
          <span className="inline-block" data-text={text}>
            {text}
          </span>
          {showCursor && (
            <span className="inline-block animate-flicker text-terminal-green">
              ▋
            </span>
          )}
        </h1>

        {/* Subtitle */}
        <div className="mb-8 space-y-2 font-mono text-lg text-terminal-green md:text-xl">
          <p className="animate-pulse">
            {">"} [████░░░░] Engineer | [████████░] Philosopher | [████░░░░] ¯\_(ツ)_/¯
          </p>
          <p className="text-terminal-amber">
            {">"} Breaking the fourth wall of conventional science
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="group relative overflow-hidden border-2 border-terminal-green bg-transparent px-8 py-3 font-mono text-terminal-green transition-all hover:bg-terminal-green hover:text-dark-900">
            <span className="relative z-10">Explore Projects</span>
            <div className="absolute inset-0 -translate-x-full bg-terminal-green transition-transform group-hover:translate-x-0" />
          </button>

          <button className="border-2 border-neon-pink bg-transparent px-8 py-3 font-mono text-neon-pink transition-all hover:bg-neon-pink hover:text-dark-900">
            Read Philosophy
          </button>
        </div>

        {/* Status indicator */}
        <div className="mt-12 flex items-center justify-center gap-2 font-mono text-sm text-terminal-green/60">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-terminal-green" />
          <span>System Status: OPERATIONAL</span>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="pointer-events-none absolute left-4 top-4 h-16 w-16 border-l-2 border-t-2 border-terminal-green opacity-50" />
      <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 border-r-2 border-t-2 border-terminal-green opacity-50" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-16 w-16 border-b-2 border-l-2 border-terminal-green opacity-50" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-16 w-16 border-b-2 border-r-2 border-terminal-green opacity-50" />
    </section>
  );
}