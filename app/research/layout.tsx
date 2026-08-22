import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description:
    "An archive of research and writing on unconventional propulsion, long-term human survival, and resource systems. Some of it runs under a separate name.",
  alternates: {
    canonical: "/research",
  },
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
