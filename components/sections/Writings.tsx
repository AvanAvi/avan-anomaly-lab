"use client";

import { useTransition } from "@/app/transition-provider";
import Reveal from "@/components/ui/Reveal";

interface WritingCategory {
  glyph: string;
  title: string;
  description: string;
  topics: string[];
  cta: string;
  destination: string;
  transitionType: "science" | "philosophy" | "reading";
}

const CATEGORIES: WritingCategory[] = [
  {
    glyph: "⚛",
    title: "Science & Tech",
    description:
      "Notes on building systems that need to actually work: safety-critical software, security, and the case for testing things twice.",
    topics: ["Spring Boot", "Security", "CI/CD", "Systems"],
    cta: "Read the notes",
    destination: "/science",
    transitionType: "science",
  },
  {
    glyph: "ψ",
    title: "Philosophy",
    description:
      "Questions about consciousness, ethics, and what it means to build things that might outlast the reasons we built them.",
    topics: ["Consciousness", "AI Ethics", "Free Will", "Meaning"],
    cta: "Enter the school",
    destination: "/philosophy",
    transitionType: "philosophy",
  },
  {
    glyph: "¶",
    title: "Reading List",
    description:
      "Science fiction that got uncomfortably close, philosophy that explains the confusion, and the occasional book that is not depressing.",
    topics: ["Sci-Fi", "Philosophy", "Essays", "Dystopia"],
    cta: "Browse the shelf",
    destination: "/reading",
    transitionType: "reading",
  },
];

export default function Writings() {
  const { startTransition } = useTransition();

  return (
    <section className="relative px-6 py-28 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-signal/70">WRITING</p>
          <h2 className="mt-4 font-display text-5xl text-white md:text-6xl">
            What I <span className="italic text-signal">Create</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <Reveal key={category.title} delay={index * 0.1}>
              <button
                onClick={() => startTransition(category.destination, category.transitionType)}
                className="group flex h-full w-full flex-col border border-line p-7 text-left transition-colors duration-500 ease-instrument hover:border-signal/40 focus-visible:border-signal/40 focus-visible:outline-none"
              >
                <span className="font-display text-3xl text-signal">{category.glyph}</span>

                <h3 className="mt-6 font-display text-2xl text-white">{category.title}</h3>

                <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-white/50">
                  {category.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {category.topics.map((topic) => (
                    <span
                      key={topic}
                      className="border border-line px-2 py-1 font-mono text-[11px] text-white/40"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 font-mono text-xs text-signal/70 group-hover:text-signal">
                  {category.cta}
                  <span className="transition-transform duration-300 ease-instrument group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mx-auto mt-20 max-w-2xl text-center">
            <p className="font-display text-xl italic leading-relaxed text-white/70 md:text-2xl">
              I write to understand what I think. I code to understand what I write.
              I read to forget I am doing both.
            </p>
            <p className="mt-4 font-mono text-xs text-white/30">Avan, probably around 3 AM</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
