"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Philosopher data
const philosophers = [
  {
    id: "kafka",
    name: "Franz Kafka",
    title: "Professor of Bureaucratic Nightmares",
    color: "neon-cyan",
    glowColor: "#00ffff",
    doorStyle: "border-neon-cyan",
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
    color: "terminal-amber",
    glowColor: "#ffb000",
    doorStyle: "border-terminal-amber",
    icon: "🪨",
    quotes: [
      "One must imagine Avan happy... debugging at 3 AM. The absurd hero pushes his commits uphill, eternally.",
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
    color: "neon-pink",
    glowColor: "#ff006e",
    doorStyle: "border-neon-pink",
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
    color: "terminal-green",
    glowColor: "#00ff41",
    doorStyle: "border-terminal-green",
    icon: "🚬",
    quotes: [
      "Avan is condemned to be free... to choose between tabs and spaces. Hell is other people's code reviews.",
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
    color: "purple-400",
    glowColor: "#c084fc",
    doorStyle: "border-purple-400",
    icon: "🛢️",
    quotes: [
      "I am still searching for an honest developer who writes comments. Avan comes close, but his documentation still lies.",
      "Avan lives in a Docker container. I live in a barrel. We're not so different.",
      "Throw away your framework! Write raw assembly! Return to MONKE—I mean, return to first principles!",
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
    name: "Schrödinger",
    title: "Quantum Uncertainty Specialist",
    color: "neon-cyan",
    glowColor: "#00d9ff",
    doorStyle: "border-neon-cyan",
    icon: "🐱",
    quotes: [
      "Avan's code exists in superposition—both working and broken until observed by production users.",
      "The cat is neither alive nor dead until you check the logs. Then it's definitely dead.",
      "Is the bug in the code, or in our observation of the code? Yes.",
    ],
    articles: [
      {
        title: "Schrödinger's Deploy",
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
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDoorClick = (id: string) => {
    setIsTransitioning(true);
    setSelectedPhilosopher(id);
    setCurrentQuote(0);

    // Wait for state update, then scroll with smooth transition
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Remove transition effect after scroll
      setTimeout(() => setIsTransitioning(false), 800);
    }, 100);
  };

  const handleNextQuote = () => {
    const philosopher = philosophers.find((p) => p.id === selectedPhilosopher);
    if (philosopher) {
      setCurrentQuote((prev) => (prev + 1) % philosopher.quotes.length);
    }
  };

  const selectedPhil = philosophers.find((p) => p.id === selectedPhilosopher);

  return (
    <div className="min-h-screen bg-dark-900 px-4 py-20 md:px-8">
      {/* Transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-dark-900/80 backdrop-blur-sm transition-opacity duration-500">
          <div className="flex h-full items-center justify-center">
            <p className="font-mono text-2xl text-neon-pink animate-pulse">
              Entering {selectedPhil?.name}'s classroom...
            </p>
          </div>
        </div>
      )}

      {/* Back Button */}
      <Link
        href="/"
        className="group mb-12 inline-flex items-center gap-2 border border-neon-pink/30 bg-dark-800/50 px-4 py-2 font-mono text-neon-pink transition-all hover:border-neon-pink hover:bg-neon-pink/10"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span>
        EXIT THE INSTITUTE
      </Link>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1
            className="mb-4 font-mono text-6xl font-bold text-white md:text-8xl"
          >
            THE ANOMALY INSTITUTE
          </h1>
          <p className="font-mono text-xl text-terminal-green md:text-2xl">
            <span className="text-neon-cyan">"</span>
            Questioning Everything, Answering Nothing
            <span className="text-neon-cyan">"</span>
          </p>
          <p
            className="mt-6 font-mono text-2xl font-bold text-terminal-amber md:text-3xl"
          >
            ⚡ Choose Your Professor ⚡
          </p>
          <p className="mt-2 font-mono text-lg text-neon-pink animate-pulse">
            Embrace the Existential Roast
          </p>
        </div>

        {/* Hallway with Doors */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {philosophers.map((phil, index) => (
              <button
                key={phil.id}
                onClick={() => handleDoorClick(phil.id)}
                className={`group relative h-80 border-4 ${phil.doorStyle} bg-dark-800/80 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  boxShadow: selectedPhilosopher === phil.id 
                    ? `0 0 40px ${phil.glowColor}, 0 0 80px ${phil.glowColor}` 
                    : 'none',
                }}
              >
                {/* Door Icon */}
                <div className="absolute left-1/2 top-8 -translate-x-1/2 text-6xl transition-transform group-hover:scale-110">
                  {phil.icon}
                </div>

                {/* Door Name Plate */}
                <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-6 text-center">
                  <h3
                    className="mb-3 font-mono text-2xl font-bold"
                    style={{
                      color: phil.glowColor,
                    }}
                  >
                    {phil.name}
                  </h3>
                  <p
                    className="font-mono text-sm font-bold text-white"
                  >
                    {phil.title}
                  </p>
                </div>

                {/* Door Handle */}
                <div className="absolute bottom-12 left-1/2 h-12 w-2 -translate-x-1/2 bg-terminal-amber transition-all group-hover:bg-neon-cyan group-hover:shadow-lg group-hover:shadow-neon-cyan" />

                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    boxShadow: `inset 0 0 60px ${phil.glowColor}20`,
                  }}
                />

                {/* Corner brackets */}
                <div className="absolute left-2 top-2 h-8 w-8 border-l-2 border-t-2 border-white/40 transition-colors group-hover:border-white" />
                <div className="absolute right-2 top-2 h-8 w-8 border-r-2 border-t-2 border-white/40 transition-colors group-hover:border-white" />
                <div className="absolute bottom-2 left-2 h-8 w-8 border-b-2 border-l-2 border-white/40 transition-colors group-hover:border-white" />
                <div className="absolute bottom-2 right-2 h-8 w-8 border-b-2 border-r-2 border-white/40 transition-colors group-hover:border-white" />
              </button>
            ))}
          </div>
        </div>

        {/* Philosopher Content Section */}
        <div ref={contentRef}>
          {selectedPhil && (
            <div 
              className="mt-16 border-4 bg-dark-800/95 p-8 backdrop-blur-sm"
              style={{
                borderColor: selectedPhil.glowColor,
                boxShadow: `0 0 40px ${selectedPhil.glowColor}40`,
                animation: 'fadeInUp 0.6s ease-out',
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedPhilosopher(null)}
                className="float-right font-mono text-2xl text-neon-pink transition-all hover:text-terminal-amber hover:rotate-90"
              >
                ✕
              </button>

              {/* Philosopher Header */}
              <div className="mb-8 flex items-center gap-6">
                <span className="text-8xl">{selectedPhil.icon}</span>
                <div>
                  <h2
                    className="font-mono text-4xl font-bold"
                    style={{
                      color: selectedPhil.glowColor,
                    }}
                  >
                    {selectedPhil.name}
                  </h2>
                  <p
                    className="font-mono text-xl font-bold text-terminal-green"
                  >
                    {selectedPhil.title}
                  </p>
                </div>
              </div>

              {/* Quote Display */}
              <div 
                className="mb-8 border-l-4 bg-dark-900/50 p-6"
                style={{
                  borderColor: selectedPhil.glowColor,
                }}
              >
                <p className="font-mono text-xl leading-relaxed text-white">
                  <span className="text-neon-cyan text-3xl">"</span>
                  {selectedPhil.quotes[currentQuote]}
                  <span className="text-neon-cyan text-3xl">"</span>
                </p>
                <button
                  onClick={handleNextQuote}
                  className="mt-4 font-mono text-sm text-terminal-amber transition-all hover:text-neon-cyan hover:translate-x-2"
                >
                  → Next roast ({currentQuote + 1}/{selectedPhil.quotes.length})
                </button>
              </div>

              {/* Articles */}
              <div>
                <h3 className="mb-4 font-mono text-2xl font-bold text-terminal-green">
                  📚 Teachings from this School:
                </h3>
                <div className="space-y-4">
                  {selectedPhil.articles.map((article, i) => (
                    <div
                      key={i}
                      className="border-2 border-terminal-green/30 bg-dark-900/50 p-4 transition-all hover:border-terminal-green hover:shadow-lg hover:shadow-terminal-green/20"
                    >
                      <h4 className="mb-2 font-mono text-xl font-bold text-terminal-green">
                        {article.title}
                      </h4>
                      <p className="mb-3 font-mono text-sm text-terminal-green">
                        {article.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="border border-terminal-green/30 bg-terminal-green/5 px-2 py-1 font-mono text-xs text-terminal-green"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Quote */}
        {!selectedPhilosopher && (
          <div className="mt-16 border border-terminal-green/30 bg-dark-800/30 p-8 text-center">
            <p className="font-mono text-lg text-terminal-green/90">
              <span className="text-neon-cyan">"</span>
              Each door leads to wisdom. Each wisdom leads to more questions.
              Each question leads to... well, you get the idea.
              <span className="text-neon-cyan">"</span>
            </p>
            <p className="mt-4 font-mono text-sm text-terminal-green/60">
              — The Anomaly Institute Mission Statement
            </p>
          </div>
        )}
      </div>
    </div>
  );
}