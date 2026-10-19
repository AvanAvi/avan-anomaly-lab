import Reveal from "@/components/ui/Reveal";

/**
 * One top-level section of a paper page: an anchor target for the
 * contents list, a mono index, and a display heading. scroll-mt keeps
 * the heading clear of the viewport edge when jumped to.
 */
export default function PaperSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-20 scroll-mt-8 border-t border-line pt-10">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.2em] text-signal/60">{index}</p>
        <h2 id={`${id}-heading`} className="mt-3 font-display text-3xl text-white md:text-4xl">
          {title}
        </h2>
      </Reveal>
      <div className="mt-6 space-y-5 font-sans text-base leading-relaxed text-white/70">{children}</div>
    </section>
  );
}
