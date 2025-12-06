"use client";

import Link from "next/link";

export default function SciencePage() {
  // Sample articles
  const articles = [
    {
      id: 1,
      title: "The EM Drive Paradox: When Physics Gets Weird",
      excerpt: "Exploring impossible propulsion systems and why they shouldn't work (but maybe do).",
      date: "2024-11-15",
      readTime: "8 min",
      tags: ["Physics", "Propulsion", "Anomalies"],
    },
    {
      id: 2,
      title: "Quantum Computing: Hype vs. Reality",
      excerpt: "Separating the science from the sci-fi in quantum tech.",
      date: "2024-10-22",
      readTime: "12 min",
      tags: ["Quantum", "Computing", "Future"],
    },
    {
      id: 3,
      title: "AI Alignment: The Philosophy Problem",
      excerpt: "Why making AI 'good' is harder than you think.",
      date: "2024-09-30",
      readTime: "15 min",
      tags: ["AI", "Ethics", "Philosophy"],
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900 px-4 py-20 md:px-8">
      {/* Back Button */}
      <Link
        href="/"
        className="group mb-12 inline-flex items-center gap-2 border border-neon-cyan/30 bg-dark-800/50 px-4 py-2 font-mono text-neon-cyan transition-all hover:border-neon-cyan hover:bg-neon-cyan/10"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span>
        RETURN TO LAB
      </Link>

      {/* Header */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h1
            className="mb-4 font-mono text-6xl font-bold text-neon-cyan md:text-8xl"
            style={{
              textShadow: '0 0 40px #00d9ff, 0 0 80px #00d9ff',
            }}
          >
            SCIENCE & TECH
          </h1>
          <p className="font-mono text-xl text-terminal-green md:text-2xl">
            Where curiosity meets questionable experiments
          </p>
        </div>

        {/* Articles Grid */}
        <div className="space-y-8">
          {articles.map((article, index) => (
            <article
              key={article.id}
              className="group relative border-2 border-neon-cyan/30 bg-dark-800/50 p-6 transition-all hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/20"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Corner accents */}
              <div className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-neon-cyan opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute -right-1 -bottom-1 h-4 w-4 border-b-2 border-r-2 border-neon-cyan opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Date & Read Time */}
              <div className="mb-3 flex items-center gap-4 font-mono text-xs text-neon-cyan/60">
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.readTime} read</span>
              </div>

              {/* Title */}
              <h2 className="mb-3 font-mono text-2xl font-bold text-neon-cyan transition-colors group-hover:text-terminal-amber">
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="mb-4 font-mono text-base leading-relaxed text-terminal-green/80">
                {article.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-1 font-mono text-xs text-neon-cyan/80 transition-colors group-hover:border-neon-cyan group-hover:bg-neon-cyan/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Read More Link */}
              <button className="mt-4 font-mono text-sm text-neon-cyan transition-all group-hover:translate-x-2">
                Read More →
              </button>
            </article>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="mt-16 border border-terminal-green/30 bg-dark-800/30 p-8 text-center">
          <p className="font-mono text-lg text-terminal-green/70">
            <span className="text-terminal-amber">Status:</span> More writings loading...
          </p>
          <p className="mt-2 font-mono text-sm text-terminal-green/50">
            // Check back soon for more technical adventures
          </p>
        </div>
      </div>
    </div>
  );
}