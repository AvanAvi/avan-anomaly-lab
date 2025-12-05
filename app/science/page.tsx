"use client";

import Link from "next/link";

export default function SciencePage() {
  const writings = [
    {
      id: 1,
      title: "Test-Driven Development: A Love Story",
      date: "2024-11-15",
      excerpt: "How I learned to stop worrying and love the red-green-refactor cycle. Featuring 100% code coverage and questionable life choices.",
      tags: ["TDD", "Spring Boot", "Testing"],
      readTime: "8 min",
    },
    {
      id: 2,
      title: "Docker: Digital Tupperware for Your Code",
      date: "2024-10-22",
      excerpt: "Containers, images, and why your app works on your machine but nowhere else. A tale as old as time.",
      tags: ["Docker", "DevOps", "Containers"],
      readTime: "6 min",
    },
    {
      id: 3,
      title: "CI/CD for Nuclear Safety: No Pressure",
      date: "2024-09-30",
      excerpt: "Building continuous integration pipelines for safety-critical systems. What could possibly go wrong?",
      tags: ["CI/CD", "Nuclear", "Safety"],
      readTime: "12 min",
    },
    {
      id: 4,
      title: "Breaking Things Securely: A Pen Tester's Guide",
      date: "2024-08-18",
      excerpt: "Ethical hacking, vulnerability assessments, and why 'password123' is still too common in 2024.",
      tags: ["Security", "Penetration Testing", "Hacking"],
      readTime: "10 min",
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
        BACK TO LAB
      </Link>

      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 border-l-4 border-neon-cyan pl-6">
          <h2 className="mb-2 font-mono text-sm text-neon-cyan/60">
            {">"} SCIENCE_&_TECH_WRITINGS
          </h2>
          <h1 className="font-mono text-5xl font-bold text-neon-cyan md:text-7xl">
            Tech Chronicles
          </h1>
          <p className="mt-4 font-mono text-lg text-terminal-green/70">
            // Making computers do computer things, one bug at a time
          </p>
        </div>

        {/* Writings List */}
        <div className="space-y-8">
          {writings.map((article, index) => (
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