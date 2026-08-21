"use client";

import BackLink from "@/components/ui/BackLink";
import FieldBackground from "@/components/effects/FieldBackground";
import Reveal from "@/components/ui/Reveal";
import StatusBadge from "@/components/ui/StatusBadge";
import TagChip from "@/components/ui/TagChip";

interface Book {
  id: number;
  title: string;
  author: string;
  status: "Completed" | "In Progress" | "Re-reading" | "Wishlist";
  date: string;
  genre: string;
  rating: number | null;
  thoughts: string;
  tags: string[];
}

const BOOKS: Book[] = [
  {
    id: 1,
    title: "Neuromancer",
    author: "William Gibson",
    status: "Completed",
    date: "2024-11-28",
    genre: "Sci-Fi",
    rating: 5,
    thoughts:
      "The book that predicted cyberspace before the internet existed. Gibson's vision of AI, virtual reality, and corporate dystopia feels more relevant than ever. Required reading for anyone who types sudo into a terminal.",
    tags: ["Cyberpunk", "AI", "Classic", "Mind-Bending"],
  },
  {
    id: 2,
    title: "Being and Nothingness",
    author: "Jean-Paul Sartre",
    status: "In Progress",
    date: "Started 2024-10-15",
    genre: "Philosophy",
    rating: 4,
    thoughts:
      "800 pages of Sartre telling me I'm responsible for my own existence. Thanks, Jean-Paul. Very reassuring. Currently stuck on page 342, questioning both my life choices and whether being for itself is just anxiety with extra steps.",
    tags: ["Existentialism", "Dense", "Freedom", "Suffering"],
  },
  {
    id: 3,
    title: "The Pragmatic Programmer",
    author: "David Thomas and Andrew Hunt",
    status: "Re-reading",
    date: "2024-09-20",
    genre: "Tech",
    rating: 5,
    thoughts:
      "The software engineering bible. Every time I revisit this, I find something new to apply. DRY, KISS, and the broken window theory: principles that keep my code (mostly) from becoming a dumpster fire. Read it once, apply it forever.",
    tags: ["Programming", "Best Practices", "Career", "Timeless"],
  },
  {
    id: 4,
    title: "1984",
    author: "George Orwell",
    status: "Completed",
    date: "2024-08-05",
    genre: "Dystopia",
    rating: 5,
    thoughts:
      "Written in 1949, feels like it was written yesterday. Big Brother, doublethink, thoughtcrime: Orwell predicted surveillance capitalism and authoritarian tech with terrifying accuracy. Read this, then check your privacy settings.",
    tags: ["Classic", "Dystopia", "Political", "Prophetic"],
  },
  {
    id: 5,
    title: "Godel, Escher, Bach",
    author: "Douglas Hofstadter",
    status: "Wishlist",
    date: "TBD",
    genre: "Philosophy / Math",
    rating: null,
    thoughts:
      "On my reading list. Allegedly the ultimate exploration of consciousness, recursion, and strange loops. Everyone says it's mind-blowing. I'm scared. But I'll read it, eventually, after I finish Sartre, maybe.",
    tags: ["Consciousness", "Recursion", "Math", "Legendary"],
  },
  {
    id: 6,
    title: "Snow Crash",
    author: "Neal Stephenson",
    status: "Completed",
    date: "2024-07-12",
    genre: "Sci-Fi",
    rating: 5,
    thoughts:
      "Pizza delivery protagonist. Skateboard sword fights. The Metaverse before Facebook stole the name. Stephenson's world is absurd, brilliant, and somehow prophetic. Also features one of the best opening lines in science fiction.",
    tags: ["Cyberpunk", "Satire", "Metaverse", "Wild"],
  },
];

const STATUS_TONE: Record<Book["status"], "positive" | "active" | "neutral"> = {
  Completed: "positive",
  "In Progress": "active",
  "Re-reading": "active",
  Wishlist: "neutral",
};

function Rating({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="font-mono text-xs text-white/30">Pending</span>;
  }
  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5`}>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i < value ? "bg-signal" : "bg-line-strong"}`}
        />
      ))}
    </div>
  );
}

export default function ReadingPage() {
  return (
    <div className="relative min-h-screen">
      <FieldBackground />
      <div className="relative px-6 py-20 md:px-12 lg:px-20">
        <BackLink />

        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-signal/70">LIBRARY</p>
            <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">
              The <span className="italic text-signal">Library</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-white/50">
              Books I am reading, have read, or pretend to have finished at parties.
            </p>
          </Reveal>

          <div className="mt-16 space-y-6">
            {BOOKS.map((book, index) => (
              <Reveal key={book.id} delay={Math.min(index * 0.06, 0.3)}>
                <article className="border border-line p-6 transition-colors duration-300 hover:border-line-strong md:p-8">
                  <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs">
                    <StatusBadge tone={STATUS_TONE[book.status]}>{book.status}</StatusBadge>
                    <span className="text-white/40">{book.genre}</span>
                    <span className="text-white/20">·</span>
                    <span className="text-white/40">{book.date}</span>
                  </div>

                  <h2 className="font-display text-2xl text-white md:text-3xl">{book.title}</h2>
                  <p className="mt-1 font-sans text-sm text-white/50">by {book.author}</p>

                  <div className="mt-4">
                    <Rating value={book.rating} />
                  </div>

                  <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-white/60">
                    {book.thoughts}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <TagChip key={tag}>{tag}</TagChip>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-16 border border-signal/30 bg-signal/5 p-6 md:p-8">
              <p className="font-mono text-xs tracking-[0.2em] text-signal/70">CURRENTLY READING</p>
              <h3 className="mt-2 font-display text-2xl text-white">Being and Nothingness</h3>
              <p className="mt-1 font-sans text-sm text-white/50">by Jean-Paul Sartre</p>
              <p className="mt-3 font-mono text-xs text-white/40">
                Progress: about 40 percent. Status: existentially confused but committed.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mx-auto mt-16 max-w-2xl text-center">
              <p className="font-display text-xl italic leading-relaxed text-white/70 md:text-2xl">
                A reader lives a thousand lives before he dies. The man who never reads lives only
                one.
              </p>
              <p className="mt-4 font-mono text-xs text-white/30">
                George R. R. Martin, probably should read more and write faster
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
