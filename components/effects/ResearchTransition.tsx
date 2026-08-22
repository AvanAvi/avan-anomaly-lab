"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const INDEX_LINES = [
  { path: "propulsion/", note: "reading" },
  { path: "population/", note: "reading" },
  { path: "resources/", note: "reading" },
  { path: "archive.index", note: "ok" },
];

interface ResearchTransitionProps {
  onComplete: () => void;
}

export default function ResearchTransition({ onComplete }: ResearchTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(0);
  const [stage, setStage] = useState<0 | 1>(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(onComplete, 350);
      return () => clearTimeout(timer);
    }

    const lineInterval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= INDEX_LINES.length) {
          clearInterval(lineInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 160);

    const timers = [
      setTimeout(() => setStage(1), 1250),
      setTimeout(() => setFadeOut(true), 2050),
      setTimeout(() => onComplete(), 2450),
    ];
    return () => {
      clearInterval(lineInterval);
      timers.forEach(clearTimeout);
    };
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950">
        <p className="font-mono text-sm tracking-[0.2em] text-signal/70">ENTERING THE ARCHIVE</p>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[100] bg-ink-950 transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <div className="flex h-full items-center justify-center px-8">
        {stage === 0 ? (
          <div className="w-full max-w-md border border-line bg-ink-900/50 p-6 font-mono text-sm leading-relaxed">
            <p className="text-white/40">$ archive --index</p>
            {INDEX_LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="mt-1 flex items-center justify-between text-white/70">
                <span>{line.path}</span>
                <span className={i === INDEX_LINES.length - 1 ? "text-signal" : "text-white/30"}>
                  [{line.note}]
                </span>
              </div>
            ))}
            <span className="mt-2 inline-block h-4 w-2 animate-flicker bg-signal align-middle" />
          </div>
        ) : (
          <div className="text-center">
            <p className="font-mono text-xs tracking-[0.3em] text-signal/70">RESEARCH</p>
            <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">
              An <span className="italic text-signal">archive</span>, not a journal
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
