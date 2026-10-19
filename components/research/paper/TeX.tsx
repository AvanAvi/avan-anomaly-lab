import katex from "katex";

/**
 * Renders a TeX string to static KaTeX markup on the server, so no math
 * runtime ships to the browser. throwOnError is on deliberately: a typo
 * in an equation fails the build instead of rendering red error text.
 */
export default function TeX({ tex, display = false }: { tex: string; display?: boolean }) {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: true,
    output: "htmlAndMathml",
  });

  const Tag = display ? "div" : "span";
  return <Tag className={display ? "overflow-x-auto overflow-y-hidden py-1" : undefined} dangerouslySetInnerHTML={{ __html: html }} />;
}
