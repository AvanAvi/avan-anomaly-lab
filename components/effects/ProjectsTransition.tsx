"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const CODE_LINES = [
  "import { Workshop } from '@anomaly/core';",
  "",
  "export default function build(idea) {",
  "  const draft = sketch(idea);",
  "  const shipped = compile(draft);",
  "  return deploy(shipped);",
  "}",
];

function highlight(line: string) {
  return line
    .replace(/(import|export|default|function|const|return|from)/g, '<span class="text-signal">$1</span>')
    .replace(/('[@\w/.]+')/g, '<span class="text-terminal-amber">$1</span>')
    .replace(/(\{|\}|\(|\)|;)/g, '<span class="text-white/30">$1</span>');
}

interface ProjectsTransitionProps {
  onComplete: () => void;
}

export default function ProjectsTransition({ onComplete }: ProjectsTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(0);
  const [stage, setStage] = useState<0 | 1>(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(onComplete, 350);
      return () => clearTimeout(timer);
    }

    const typingInterval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= CODE_LINES.length) {
          clearInterval(typingInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 110);

    const timers = [
      setTimeout(() => setStage(1), 1300),
      setTimeout(() => setFadeOut(true), 2100),
      setTimeout(() => onComplete(), 2500),
    ];
    return () => {
      clearInterval(typingInterval);
      timers.forEach(clearTimeout);
    };
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950">
        <p className="font-mono text-sm tracking-[0.2em] text-signal/70">ENTERING THE WORKSHOP</p>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[100] bg-ink-950 transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <div className="flex h-full items-center justify-center px-8">
        {stage === 0 ? (
          <div className="w-full max-w-lg border border-line bg-ink-900/50 p-6 font-mono text-sm leading-relaxed">
            {CODE_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className="text-white/70"
                dangerouslySetInnerHTML={{ __html: highlight(line) || "&nbsp;" }}
              />
            ))}
            <span className="inline-block h-4 w-2 animate-flicker bg-signal align-middle" />
          </div>
        ) : (
          <div className="text-center">
            <p className="font-mono text-xs tracking-[0.3em] text-signal/70">WORKSHOP</p>
            <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">
              Where ideas become <span className="italic text-signal">code</span>
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
