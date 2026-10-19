import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  // A plain string here would stop the root layout's title template from
  // reaching /research/[slug], so the template is restated.
  title: {
    default: "Research",
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "An archive of research and writing on unconventional propulsion, long-term human survival, and resource systems. Some of it runs under a separate name.",
  alternates: {
    canonical: "/research",
  },
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
