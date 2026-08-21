"use client";

import { useState, useRef } from "react";
import BackLink from "@/components/ui/BackLink";
import FieldBackground from "@/components/effects/FieldBackground";
import Reveal from "@/components/ui/Reveal";
import TagChip from "@/components/ui/TagChip";

interface Philosopher {
  id: string;
  name: string;
  title: string;
  icon: string;
  quotes: string[];
  articles: { title: string; excerpt: string; tags: string[] }[];
}

const PHILOSOPHERS: Philosopher[] = [
  {
    id: "kafka",
    name: "Franz Kafka",
    title: "Professor of Bureaucratic Nightmares",
    icon: "📜",
    quotes: [
      "Just like me not sending letters to Milena, Avan has also written letters to [REDACTED] which he hasn't sent. We suffer together in the postal void.",
      "Avan's pull requests sit in review limbo, just like my manuscripts. At least his compile.",
      "The bug isn't in the code. The bug is existence itself. But Avan keeps coding anyway.",
    ],
    articles: [
      {
        title: "Letters I'll Never Push to Production",
        excerpt: "On unmerged branches and unsent feelings",
        tags: ["Bureaucracy", "Regret", "Git"],
      },
      {
        title: "The Metamorphosis of a Junior Dev",
        excerpt: "Waking up one day to find you've become a senior",
        tags: ["Career", "Identity", "Impostor Syndrome"],
      },
    ],
  },
  {
    id: "camus",
    name: "Albert Camus",
    title: "Master of Beautiful Meaninglessness",
    icon: "🪨",
    quotes: [
      "One must imagine Avan happy, debugging at 3 AM. The absurd hero pushes his commits uphill, eternally.",
      "The only serious philosophical question is whether to use tabs or spaces. Everything else is commentary.",
      "Avan revolts against the meaninglessness of life by writing meaningful code. How delightfully absurd.",
    ],
    articles: [
      {
        title: "The Myth of Sisyphus && The Infinite Loop",
        excerpt: "On finding meaning in recursive despair",
        tags: ["Absurdism", "Loops", "Meaning"],
      },
      {
        title: "The Stranger in the Codebase",
        excerpt: "Who wrote this? Why does it work? Does it matter?",
        tags: ["Legacy Code", "Existentialism"],
      },
    ],
  },
  {
    id: "nietzsche",
    name: "Friedrich Nietzsche",
    title: "Chancellor of Dangerous Thinking",
    icon: "⚡",
    quotes: [
      "Avan gazes into the codebase, and the codebase gazes back. He who fights with bugs should see that he himself does not become a bug.",
      "God is dead, and we have killed him with npm packages. What water will wash away this dependency hell?",
      "What doesn't kill your CI/CD pipeline makes it stronger. Or crashes it. Usually crashes it.",
    ],
    articles: [
      {
        title: "Thus Spoke the Programmer",
        excerpt: "On becoming the developer you were meant to be",
        tags: ["Will to Power", "Self-Overcoming", "Stack Overflow"],
      },
      {
        title: "Beyond Good && Evil Code",
        excerpt: "There are no clean codebases, only interpretations",
        tags: ["Morality", "Code Review", "Philosophy"],
      },
    ],
  },
  {
    id: "sartre",
    name: "Jean-Paul Sartre",
    title: "Dean of Radical Freedom",
    icon: "🚬",
    quotes: [
      "Avan is condemned to be free, to choose between tabs and spaces. Hell is other people's code reviews.",
      "Existence precedes essence, but documentation comes never. Avan exists without a README.",
      "We are our choices. Avan chose JavaScript. He must live with that now.",
    ],
    articles: [
      {
        title: "Being && Nothingness.js",
        excerpt: "On the void at the heart of async/await",
        tags: ["Existentialism", "JavaScript", "Void"],
      },
      {
        title: "No Exit from Vim",
        excerpt: "Hell is being trapped in an editor you don't understand",
        tags: ["Vim", "Suffering", "Freedom"],
      },
    ],
  },
  {
    id: "diogenes",
    name: "Diogenes",
    title: "The Barrel-Dwelling Truth Seeker",
    icon: "🛢️",
    quotes: [
      "I am still searching for an honest developer who writes comments. Avan comes close, but his documentation still lies.",
      "Avan lives in a Docker container. I live in a barrel. We're not so different.",
      "Throw away your framework. Write raw assembly. Return to first principles.",
    ],
    articles: [
      {
        title: "Living in a Container",
        excerpt: "On minimalism and Docker philosophy",
        tags: ["Cynicism", "Minimalism", "DevOps"],
      },
      {
        title: "In Search of an Honest Stack",
        excerpt: "Rejecting complexity for brutal simplicity",
        tags: ["Philosophy", "Simplicity", "Truth"],
      },
    ],
  },
  {
    id: "schrodinger",
    name: "Schrodinger",
    title: "Quantum Uncertainty Specialist",
    icon: "🐱",
    quotes: [
      "Avan's code exists in superposition, both working and broken until observed by production users.",
      "The cat is neither alive nor dead until you check the logs. Then it's definitely dead.",
      "Is the bug in the code, or in our observation of the code? Yes.",
    ],
    articles: [
      {
        title: "Schrodinger's Deploy",
        excerpt: "On quantum uncertainty in production",
        tags: ["Quantum", "DevOps", "Uncertainty"],
      },
      {
        title: "The Cat Paradox && Test Coverage",
        excerpt: "If tests pass but users crash, did you really test?",
        tags: ["Testing", "Philosophy", "Cats"],
      },
    ],
  },
];

export default function PhilosophyPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const selected = PHILOSOPHERS.find((p) => p.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setCurrentQuote(0);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleNextQuote = () => {
    if (selected) {
      setCurrentQuote((prev) => (prev + 1) % selected.quotes.length);
    }
  };

  return (
    <div className="relative min-h-screen">
      <FieldBackground />
      <div className="relative px-6 py-20 md:px-12 lg:px-20">
        <BackLink label="Exit the institute" />

        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-signal/70">PHILOSOPHY</p>
            <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">
              The Anomaly <span className="italic text-signal">Institute</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-white/50">
              Questioning everything, answering nothing. Pick a professor, get roasted.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PHILOSOPHERS.map((phil, index) => (
              <Reveal key={phil.id} delay={Math.min(index * 0.08, 0.3)}>
                <button
                  onClick={() => handleSelect(phil.id)}
                  className={`group flex h-full w-full flex-col items-center border p-8 text-center transition-colors duration-300 ${
                    selectedId === phil.id
                      ? "border-signal/60 bg-signal/5"
                      : "border-line hover:border-signal/40"
                  }`}
                >
                  <span className="text-4xl">{phil.icon}</span>
                  <h2 className="mt-5 font-display text-2xl text-white">{phil.name}</h2>
                  <p className="mt-2 font-mono text-xs text-white/40">{phil.title}</p>
                </button>
              </Reveal>
            ))}
          </div>

          <div ref={contentRef}>
            {selected && (
              <Reveal className="mt-16 border border-signal/40 bg-ink-900/60 p-8 md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <span className="text-5xl">{selected.icon}</span>
                    <div>
                      <h2 className="font-display text-3xl text-white">{selected.name}</h2>
                      <p className="mt-1 font-mono text-sm text-signal/70">{selected.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    aria-label="Close"
                    className="font-mono text-lg text-white/40 transition-colors hover:text-signal"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-8 border-l-2 border-signal/40 bg-ink-950/40 p-6">
                  <p className="font-display text-xl italic leading-relaxed text-white/90 md:text-2xl">
                    {selected.quotes[currentQuote]}
                  </p>
                  <button
                    onClick={handleNextQuote}
                    className="mt-4 font-mono text-xs text-signal/70 transition-all hover:translate-x-1 hover:text-signal"
                  >
                    Next roast ({currentQuote + 1}/{selected.quotes.length}) →
                  </button>
                </div>

                <div className="mt-8">
                  <p className="font-mono text-xs tracking-[0.2em] text-white/40">
                    TEACHINGS FROM THIS SCHOOL
                  </p>
                  <div className="mt-4 space-y-3">
                    {selected.articles.map((article, i) => (
                      <div key={i} className="border border-line p-5">
                        <h3 className="font-display text-lg text-white">{article.title}</h3>
                        <p className="mt-1 font-sans text-sm text-white/50">{article.excerpt}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <TagChip key={tag}>{tag}</TagChip>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {!selected && (
            <Reveal delay={0.2} className="mx-auto mt-16 max-w-2xl text-center">
              <p className="font-display text-xl italic leading-relaxed text-white/70 md:text-2xl">
                Each door leads to wisdom. Each wisdom leads to more questions. Each question
                leads to, well, you get the idea.
              </p>
              <p className="mt-4 font-mono text-xs text-white/30">
                The Anomaly Institute mission statement
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
