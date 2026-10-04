import BackLink from "@/components/ui/BackLink";

export default function NotFound() {
  return (
    <div className="relative min-h-screen px-6 py-20 md:px-12 lg:px-20">
      <BackLink />
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs tracking-[0.3em] text-signal/70">404 / NO SIGNAL</p>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">Nothing at these coordinates</h1>
        <p className="mt-6 text-white/60">The page you were looking for does not exist, or it moved.</p>
      </div>
    </div>
  );
}
