"use client";

import BackLink from "@/components/ui/BackLink";

// Rendered for any uncaught error below the root layout. The error itself
// is never shown to the visitor; details stay in the server logs.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="relative min-h-screen px-6 py-20 md:px-12 lg:px-20">
      <BackLink />
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs tracking-[0.3em] text-signal/70">500 / ANOMALY</p>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">Something went wrong</h1>
        <p className="mt-6 text-white/60">An unexpected error interrupted this page. Try again in a moment.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 border border-line-strong px-4 py-2 font-mono text-xs tracking-wide text-white/60 transition-colors duration-300 hover:border-signal/40 hover:text-signal"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
