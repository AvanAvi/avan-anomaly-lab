import Image from "next/image";
import type { PaperFigureData } from "@/lib/papers/hypersonic-tps";

/**
 * A figure reproduced from the paper. The source plots have white
 * backgrounds, so they sit on a light plate rather than being inverted,
 * which would misrepresent their colors. "Open full size" matters on
 * phones, where the wide figures are hard to read inline.
 */
export default function PaperFigure({ figure }: { figure: PaperFigureData }) {
  return (
    <figure className="my-10">
      <div className="border border-line bg-white p-2 md:p-3">
        <Image
          src={figure.src}
          width={figure.width}
          height={figure.height}
          alt={figure.alt}
          unoptimized
          className="h-auto w-full"
          sizes="(min-width: 1024px) 896px, 100vw"
        />
      </div>
      <figcaption className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <p className="font-sans text-sm leading-relaxed text-white/55">
          <span className="font-mono text-xs tracking-wide text-signal/70">FIGURE {figure.number}.</span>{" "}
          {figure.caption}
        </p>
        <a
          href={figure.src}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-mono text-xs text-white/40 underline-offset-2 transition-colors hover:text-signal hover:underline"
        >
          Open full size ↗
        </a>
      </figcaption>
    </figure>
  );
}
