import type { Metadata } from "next";
import { getProject, PROJECTS } from "@/lib/research";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

// Only the projects listed in lib/research.ts exist; anything else 404s.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getProject(params.slug);

  if (!project) {
    return { title: "Research" };
  }

  const title = project.paper ? project.paper.shortTitle : project.title;
  const description = project.paper ? project.paper.summary : project.thesis;

  return {
    title,
    description,
    alternates: {
      canonical: `/research/${project.slug}`,
    },
    openGraph: {
      type: project.paper ? "article" : "website",
      url: `/research/${project.slug}`,
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default function ResearchProjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
