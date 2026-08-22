import type { Metadata } from "next";
import { getProject } from "@/lib/research";

export function generateStaticParams() {
  return [
    { slug: "unconventional-propulsion" },
    { slug: "minimum-viable-population" },
    { slug: "resource-balancing" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getProject(params.slug);

  if (!project) {
    return { title: "Research" };
  }

  return {
    title: project.title,
    description: project.thesis,
    alternates: {
      canonical: `/research/${project.slug}`,
    },
  };
}

export default function ResearchProjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
