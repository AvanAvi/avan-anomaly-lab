"use client";

import { useState } from "react";
import BackLink from "@/components/ui/BackLink";
import FieldBackground from "@/components/effects/FieldBackground";
import Reveal from "@/components/ui/Reveal";
import StatusBadge from "@/components/ui/StatusBadge";
import StatsRow from "@/components/ui/StatsRow";
import TagChip from "@/components/ui/TagChip";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  status: "completed" | "in-progress" | "experimental";
  github?: string;
  demo?: string;
  /** True for entries that stand in for a future real project. */
  sample?: boolean;
}

// Everything but the first entry is sample data (see the "sample" flag).
// Swap in real projects, same shape, links included, whenever they exist.
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "AvanAnomalyLab.net",
    description:
      "This portfolio, the one you are reading right now. Built with Next.js, Three.js for the transition effects, and a fair amount of trial and error on the color palette.",
    tags: ["Next.js", "React", "Three.js", "Tailwind"],
    status: "in-progress",
  },
  {
    id: 2,
    title: "Neural Network Playground",
    description:
      "Interactive visualization of neural networks. Watch neurons fire, adjust weights in real time, and finally understand what backpropagation actually does.",
    tags: ["Python", "TensorFlow", "WebGL", "D3.js"],
    status: "completed",
    sample: true,
  },
  {
    id: 3,
    title: "Terminal Portfolio CLI",
    description:
      "For browsing a portfolio from the command line. Supports vim keybindings, because that is the kind of person who would build this.",
    tags: ["Rust", "CLI", "TUI", "Cross-platform"],
    status: "completed",
    sample: true,
  },
  {
    id: 4,
    title: "Quantum Random Generator",
    description:
      "Harvesting true randomness from quantum fluctuations. Or pretending to, while using Math.random with extra steps.",
    tags: ["Quantum", "API", "Node.js", "Redis"],
    status: "experimental",
    sample: true,
  },
  {
    id: 5,
    title: "GitFlow Automator",
    description:
      "Automates git workflows so there is more time for writing code and less time resolving merge conflicts. Handles rebasing without the existential dread.",
    tags: ["Go", "Git", "DevOps", "CLI"],
    status: "completed",
    sample: true,
  },
  {
    id: 6,
    title: "Anomaly Detector AI",
    description:
      "A machine learning system that detects anomalies in time-series data. Currently being trained to detect poor life decisions before they happen.",
    tags: ["Python", "PyTorch", "FastAPI", "Docker"],
    status: "in-progress",
    sample: true,
  },
];

// Derived once from the module-level PROJECTS constant, not on every render.
const ALL_TAGS = Array.from(new Set(PROJECTS.flatMap((p) => p.tags)));
const STATS = [
  { value: PROJECTS.length, label: "Total builds" },
  { value: PROJECTS.filter((p) => p.status === "completed").length, label: "Deployed" },
  { value: PROJECTS.filter((p) => p.status === "in-progress").length, label: "In progress" },
  { value: PROJECTS.filter((p) => p.status === "experimental").length, label: "Experimental" },
];

const STATUS_LABELS: Record<Project["status"], { label: string; tone: "positive" | "active" | "neutral" }> = {
  completed: { label: "Deployed", tone: "positive" },
  "in-progress": { label: "Building", tone: "active" },
  experimental: { label: "Experimental", tone: "neutral" },
};

function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_LABELS[project.status];

  return (
    <div className="group flex h-full flex-col border border-line p-6 transition-colors duration-300 hover:border-signal/40">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="font-display text-xl text-white">{project.title}</h2>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </div>

      {project.sample && (
        <span className="mb-3 inline-block w-fit border border-line-strong px-2 py-0.5 font-mono text-[10px] tracking-wide text-white/30">
          SAMPLE
        </span>
      )}

      <p className="mb-4 flex-1 font-sans text-sm leading-relaxed text-white/50">
        {project.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <TagChip key={tag}>{tag}</TagChip>
        ))}
      </div>

      {(project.github || project.demo) && (
        <div className="flex gap-4 border-t border-line pt-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-signal/70 transition-colors hover:text-signal"
            >
              GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-signal/70 transition-colors hover:text-signal"
            >
              Live demo
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`border px-3 py-1 font-mono text-xs transition-colors ${
        active
          ? "border-signal/50 bg-signal/10 text-signal"
          : "border-line text-white/50 hover:border-line-strong hover:text-white/80"
      }`}
    >
      {children}
    </button>
  );
}

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredProjects = activeFilter
    ? PROJECTS.filter((p) => p.tags.includes(activeFilter))
    : PROJECTS;

  return (
    <div className="relative min-h-screen">
      <FieldBackground />
      <div className="relative px-6 py-20 md:px-12 lg:px-20">
        <BackLink label="Exit the workshop" />

        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-signal/70">WORKSHOP</p>
            <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">
              Where ideas become <span className="italic text-signal">code</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-white/50">
              A running log of builds, from shipped and stable to still catching fire.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center gap-2 border border-line p-4">
              <span className="font-mono text-xs text-white/40">Filter:</span>
              <FilterPill active={activeFilter === null} onClick={() => setActiveFilter(null)}>
                All
              </FilterPill>
              {ALL_TAGS.map((tag) => (
                <FilterPill
                  key={tag}
                  active={activeFilter === tag}
                  onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
                >
                  {tag}
                </FilterPill>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Reveal>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-mono text-sm text-white/40">No projects match this filter.</p>
              <button
                onClick={() => setActiveFilter(null)}
                className="mt-4 font-mono text-xs text-signal hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          <Reveal delay={0.2} className="mt-16">
            <StatsRow stats={STATS} />
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-16 text-center">
              <p className="mb-4 font-mono text-sm text-white/50">
                Want to collaborate, or just have questions.
              </p>
              <a
                href="https://github.com/AvanAvi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-line-strong px-6 py-3 font-mono text-sm text-white/70 transition-colors hover:border-signal/40 hover:text-signal"
              >
                Find me on GitHub →
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
