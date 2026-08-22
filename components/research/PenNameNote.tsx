import { PEN_NAME_LABEL } from "@/lib/research";

/**
 * The understated disclosure that some writing here runs under a pen
 * name. Reads through PEN_NAME_LABEL in lib/research.ts, so setting
 * the real name is a one-line change there, not here.
 */
export default function PenNameNote() {
  return (
    <p className="font-mono text-xs leading-relaxed text-white/35">
      Some of the writing in this archive is published under {PEN_NAME_LABEL}. Pieces marked{" "}
      <span className="text-signal/60">pen name</span> are that work, kept separate on purpose.
    </p>
  );
}
