"use client";

import Link from "next/link";

export default function ReadingPage() {
  const books = [
    {
      id: 1,
      title: "Neuromancer",
      author: "William Gibson",
      status: "Completed",
      date: "2024-11-28",
      genre: "Sci-Fi",
      rating: "⭐⭐⭐⭐⭐",
      thoughts: "The book that predicted cyberspace before the internet existed. Gibson's vision of AI, virtual reality, and corporate dystopia feels more relevant than ever. Required reading for anyone who types '$ sudo' into a terminal.",
      tags: ["Cyberpunk", "AI", "Classic", "Mind-Bending"],
    },
    {
      id: 2,
      title: "Being and Nothingness",
      author: "Jean-Paul Sartre",
      status: "In Progress",
      date: "Started 2024-10-15",
      genre: "Philosophy",
      rating: "⭐⭐⭐⭐",
      thoughts: "800 pages of Sartre telling me I'm responsible for my own existence. Thanks, Jean-Paul. Very reassuring. Currently stuck on page 342, questioning both my life choices and whether 'being-for-itself' is just anxiety with extra steps.",
      tags: ["Existentialism", "Dense", "Freedom", "Suffering"],
    },
    {
      id: 3,
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      status: "Re-reading",
      date: "2024-09-20",
      genre: "Tech",
      rating: "⭐⭐⭐⭐⭐",
      thoughts: "The software engineering bible. Every time I revisit this, I find something new to apply. DRY, KISS, and the broken window theory—principles that keep my code (mostly) from becoming a dumpster fire. Read it once, apply it forever.",
      tags: ["Programming", "Best Practices", "Career", "Timeless"],
    },
    {
      id: 4,
      title: "1984",
      author: "George Orwell",
      status: "Completed",
      date: "2024-08-05",
      genre: "Dystopia",
      rating: "⭐⭐⭐⭐⭐",
      thoughts: "Written in 1949, feels like it was written yesterday. Big Brother, doublethink, thoughtcrime—Orwell predicted surveillance capitalism and authoritarian tech with terrifying accuracy. Read this, then check your privacy settings.",
      tags: ["Classic", "Dystopia", "Political", "Prophetic"],
    },
    {
      id: 5,
      title: "Gödel, Escher, Bach",
      author: "Douglas Hofstadter",
      status: "Wishlist",
      date: "TBD",
      genre: "Philosophy/Math",
      rating: "Pending",
      thoughts: "On my reading list. Allegedly the ultimate exploration of consciousness, recursion, and strange loops. Everyone says it's mind-blowing. I'm scared. But I'll read it... eventually... after I finish Sartre... maybe.",
      tags: ["Consciousness", "Recursion", "Math", "Legendary"],
    },
    {
      id: 6,
      title: "Snow Crash",
      author: "Neal Stephenson",
      status: "Completed",
      date: "2024-07-12",
      genre: "Sci-Fi",
      rating: "⭐⭐⭐⭐⭐",
      thoughts: "Pizza delivery protagonist. Skateboard sword fights. The Metaverse before Facebook stole the name. Stephenson's world is absurd, brilliant, and somehow prophetic. Also features the best opening line in sci-fi history.",
      tags: ["Cyberpunk", "Satire", "Metaverse", "Wild"],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "terminal-green";
      case "In Progress":
        return "terminal-amber";
      case "Wishlist":
        return "neon-pink";
      case "Re-reading":
        return "neon-cyan";
      default:
        return "terminal-green";
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 px-4 py-20 md:px-8">
      {/* Back Button */}
      <Link
        href="/"
        className="group mb-12 inline-flex items-center gap-2 border border-terminal-amber/30 bg-dark-800/50 px-4 py-2 font-mono text-terminal-amber transition-all hover:border-terminal-amber hover:bg-terminal-amber/10"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span>
        BACK TO LAB
      </Link>

      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 border-l-4 border-terminal-amber pl-6">
          <h2 className="mb-2 font-mono text-sm text-terminal-amber/60">
            {">"} READING_VAULT
          </h2>
          <h1 className="font-mono text-5xl font-bold text-terminal-amber md:text-7xl">
            The Library
          </h1>
          <p className="mt-4 font-mono text-lg text-terminal-green/70">
            // Books I'm reading, have read, or pretend to understand
          </p>
        </div>

        {/* Books Grid */}
        <div className="space-y-8">
          {books.map((book, index) => (
            <article
              key={book.id}
              className="group relative border-2 border-terminal-amber/30 bg-dark-800/50 p-6 transition-all hover:border-terminal-amber hover:shadow-lg hover:shadow-terminal-amber/20"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Corner accents */}
              <div className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-terminal-amber opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute -right-1 -bottom-1 h-4 w-4 border-b-2 border-r-2 border-terminal-amber opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Status Badge & Genre */}
              <div className="mb-3 flex items-center gap-4 font-mono text-xs">
                <span
                  className={`border px-3 py-1 font-bold text-${getStatusColor(book.status)} border-${getStatusColor(book.status)}/40 bg-${getStatusColor(book.status)}/10`}
                >
                  {book.status}
                </span>
                <span className="text-terminal-amber/60">{book.genre}</span>
                <span className="text-terminal-amber/60">•</span>
                <span className="text-terminal-amber/60">{book.date}</span>
              </div>

              {/* Book Title & Author */}
              <h2 className="mb-2 font-mono text-2xl font-bold text-terminal-amber transition-colors group-hover:text-neon-cyan">
                {book.title}
              </h2>
              <p className="mb-3 font-mono text-lg text-terminal-green/70">
                by {book.author}
              </p>

              {/* Rating */}
              <div className="mb-4 font-mono text-sm text-terminal-amber">
                {book.rating}
              </div>

              {/* Thoughts */}
              <p className="mb-4 font-mono text-base leading-relaxed text-terminal-green/80">
                {book.thoughts}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-terminal-amber/30 bg-terminal-amber/5 px-3 py-1 font-mono text-xs text-terminal-amber/80 transition-colors group-hover:border-terminal-amber group-hover:bg-terminal-amber/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Currently Reading Callout */}
        <div className="mt-16 border-2 border-neon-cyan/40 bg-neon-cyan/5 p-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl">📖</span>
            <div>
              <h3 className="mb-2 font-mono text-xl font-bold text-neon-cyan">
                Currently Reading
              </h3>
              <p className="mb-3 font-mono text-base text-terminal-green/80">
                Being and Nothingness by Jean-Paul Sartre
              </p>
              <p className="font-mono text-sm text-terminal-green/60">
                Progress: ~40% | Status: Existentially confused but committed
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 border border-terminal-green/30 bg-dark-800/30 p-8 text-center">
          <p className="font-mono text-lg text-terminal-green/90">
            <span className="text-terminal-amber">"</span>
            A reader lives a thousand lives before he dies. The man who never reads lives only one.
            <span className="text-terminal-amber">"</span>
          </p>
          <p className="mt-4 font-mono text-sm text-terminal-green/60">
            — George R.R. Martin (probably should read more and write faster, George)
          </p>
        </div>
      </div>
    </div>
  );
}
