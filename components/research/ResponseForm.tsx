"use client";

import { useState } from "react";
import SignalButton from "@/components/ui/SignalButton";

type Status = "idle" | "submitting" | "success" | "error";

const MIN_LENGTH = 20;
const MAX_LENGTH = 3000;

/**
 * The "Add a Perspective" form embedded at the bottom of each research
 * project page. Deliberately not a comment section: one field for the
 * actual thinking, an optional way to identify yourself, and honest
 * feedback about what happens next.
 */
export default function ResponseForm({ projectSlug }: { projectSlug: string }) {
  const [perspective, setPerspective] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const trimmedLength = perspective.trim().length;
  const tooShort = trimmedLength > 0 && trimmedLength < MIN_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmedLength < MIN_LENGTH || status === "submitting") return;

    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch("/api/research/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug,
          perspective: perspective.trim(),
          respondentName: name.trim() || null,
          respondentEmail: email.trim() || null,
          honeypot,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong. Try again in a moment.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setPerspective("");
      setName("");
      setEmail("");
    } catch {
      setError("Could not reach the server. Try again in a moment.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-signal/40 bg-signal/5 p-6 text-center md:p-8">
        <p className="font-display text-lg italic text-white/90">Received.</p>
        <p className="mt-2 font-sans text-sm leading-relaxed text-white/50">
          If this changes or improves the thinking behind this project, it may become
          part of the research itself. No promises beyond that, but it is read.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot: hidden from real visitors, catches basic bots */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="perspective" className="font-mono text-xs tracking-wide text-white/40">
          Where does this argument break, or what is it missing
        </label>
        <textarea
          id="perspective"
          value={perspective}
          onChange={(e) => setPerspective(e.target.value)}
          maxLength={MAX_LENGTH}
          rows={5}
          placeholder="A counterargument, a question this should be asking, a hole in the reasoning..."
          className="mt-2 w-full border border-line bg-ink-950/60 p-4 font-sans text-sm text-white/80 placeholder:text-white/25 transition-colors duration-300 focus:border-signal/50 focus:outline-none"
        />
        <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-white/25">
          <span className={tooShort ? "text-terminal-amber/70" : ""}>
            {tooShort ? `${MIN_LENGTH - trimmedLength} more characters` : " "}
          </span>
          <span>
            {perspective.length}/{MAX_LENGTH}
          </span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="respondent-name" className="font-mono text-xs tracking-wide text-white/40">
            Name or handle, optional
          </label>
          <input
            id="respondent-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            placeholder="Stay anonymous, or don't"
            className="mt-2 w-full border border-line bg-ink-950/60 p-3 font-sans text-sm text-white/80 placeholder:text-white/25 transition-colors duration-300 focus:border-signal/50 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="respondent-email" className="font-mono text-xs tracking-wide text-white/40">
            Email, optional
          </label>
          <input
            id="respondent-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
            placeholder="Only if you want a reply"
            className="mt-2 w-full border border-line bg-ink-950/60 p-3 font-sans text-sm text-white/80 placeholder:text-white/25 transition-colors duration-300 focus:border-signal/50 focus:outline-none"
          />
        </div>
      </div>

      {error && <p className="font-mono text-xs text-alert">{error}</p>}

      <SignalButton
        type="submit"
        variant="primary"
        disabled={trimmedLength < MIN_LENGTH || status === "submitting"}
        className="disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "submitting" ? "Sending" : "Add this perspective"}
      </SignalButton>
    </form>
  );
}
