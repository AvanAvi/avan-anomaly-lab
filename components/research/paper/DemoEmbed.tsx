"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Strips the standalone page chrome (outer margins, page background,
// the demo's own "Fig 1" label) so the figure sits flush in the paper.
// Applied from here rather than edited into the file, so the HTML stays
// byte-identical to the one built in V2_latex/interactive/.
const EMBED_CSS = `
html, body { background: transparent !important; margin: 0 !important; }
.iso-page { width: 100% !important; margin: 0 !important; }
.iso-figure { margin: 0 !important; }
[data-corner="fig"] { visibility: hidden; }
/* Six readouts: an even 6, 3, or 2 columns, never a ragged last row. */
.hv-stats { grid-template-columns: repeat(2, 1fr) !important; }
@media (min-width: 640px) { .hv-stats { grid-template-columns: repeat(3, 1fr) !important; } }
@media (min-width: 1000px) { .hv-stats { grid-template-columns: repeat(6, 1fr) !important; } }
`;

/**
 * A same-origin, self-contained HTML demonstration shown inline. The
 * iframe is sized to its content height, so the drawing keeps its own
 * aspect ratio at every width and nothing is cropped or left blank.
 */
export default function DemoEmbed({ src, title }: { src: string; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  const attach = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    // A lazy frame reports a loaded about:blank before the real page.
    if (!doc?.body || doc.URL === "about:blank") return;

    if (!doc.getElementById("embed-css")) {
      const style = doc.createElement("style");
      style.id = "embed-css";
      style.textContent = EMBED_CSS;
      doc.head.appendChild(style);
    }

    const measure = () => setHeight(Math.ceil(doc.documentElement.scrollHeight));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(doc.body);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let detach: (() => void) | undefined;
    const frame = frameRef.current;
    const onLoad = () => {
      detach?.();
      detach = attach();
    };
    frame?.addEventListener("load", onLoad);
    // The frame may already have loaded before hydration.
    if (frame?.contentDocument?.readyState === "complete") onLoad();
    return () => {
      frame?.removeEventListener("load", onLoad);
      detach?.();
    };
  }, [attach]);

  return (
    <iframe
      ref={frameRef}
      src={src}
      title={title}
      loading="lazy"
      // Until measured, reserve roughly the figure's height so the page does not jump far.
      style={{ height: height ?? undefined }}
      className={`block w-full border-0 ${height === null ? "h-[clamp(36rem,75vw,52rem)]" : ""}`}
    />
  );
}
