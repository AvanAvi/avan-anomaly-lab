import Reveal from "@/components/ui/Reveal";

interface Credential {
  index: string;
  kind: string;
  title: string;
  description: string;
  note?: string;
}

const CREDENTIALS: Credential[] = [
  {
    index: "01",
    kind: "Bachelor's",
    title: "B.Tech, Computer Science and Engineering",
    description:
      "Where zeros and ones started building worlds, and algorithms started reading like poetry.",
  },
  {
    index: "02",
    kind: "Master's",
    title: "MSc (Research), Informatics",
    description:
      "Where questions became more valuable than answers, and research turned out to be organized curiosity.",
  },
  {
    index: "03",
    kind: "Doctorate",
    title: "Engineering Doctorate",
    description:
      '"Nothing really matters." But if it did, this is where theory met reality.',
    note: "Title acquired. Ego optional.",
  },
];

export default function About() {
  return (
    <section className="relative px-6 py-28 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-signal/70">PROFILE</p>
          <h2 className="mt-4 font-display text-5xl text-white md:text-6xl">
            The <span className="italic text-signal">Anomaly</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl font-display text-2xl italic leading-relaxed text-white/80 md:text-3xl">
            I&apos;m an engineer who thinks too much, and a philosopher who codes.
            Most people call it Computer Science. I call it the art of teaching
            sand to think.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-20 border-t border-line">
            {CREDENTIALS.map((credential) => (
              <div
                key={credential.index}
                className="grid gap-3 border-b border-line py-8 sm:grid-cols-[5rem_10rem_1fr] sm:gap-8"
              >
                <span className="font-mono text-sm text-white/30">{credential.index}</span>
                <span className="font-mono text-xs uppercase tracking-wide text-signal/70">
                  {credential.kind}
                </span>
                <div>
                  <h3 className="font-display text-xl text-white md:text-2xl">
                    {credential.title}
                  </h3>
                  <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-white/50">
                    {credential.description}
                  </p>
                  {credential.note && (
                    <p className="mt-2 font-mono text-xs text-white/30">{credential.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-12 font-mono text-xs tracking-wide text-white/40">
            25% ENGINEER <span className="text-signal/50">·</span> 50% PHILOSOPHER{" "}
            <span className="text-signal/50">·</span> 25% UNDEFINED
          </p>
        </Reveal>
      </div>
    </section>
  );
}
