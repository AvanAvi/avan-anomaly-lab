"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ============================================
// ELECTRODE CANVAS BACKGROUND
// ============================================
function ElectrodeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();

    interface Particle {
      x: number;
      y: number;
      direction: string;
      path: Array<{ x: number; y: number }>;
      birthTime: number;
      opacity: number;
      color: string;
    }

    const particles: Particle[] = [];
    const maxParticles = 8;
    const particleLifespan = 4000;
    const particleSpeed = 60;
    const turnProbability = 0.02;
    const colors = ["#00ffff", "#00ff41", "#ff006e", "#ffb000"];

    const directions: Record<string, { x: number; y: number }> = {
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };

    let lastTime = Date.now();
    let lastSpawn = Date.now();
    const spawnInterval = particleLifespan / maxParticles;

    function createParticle(): Particle {
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * canvas!.width,
        y: 0,
        direction: "down",
        path: [{ x: Math.random() * canvas!.width, y: 0 }],
        birthTime: Date.now(),
        opacity: 1,
        color,
      };
    }

    function animate() {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      ctx!.fillStyle = "rgba(10, 14, 39, 0.08)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      if (now - lastSpawn >= spawnInterval && particles.length < maxParticles) {
        particles.push(createParticle());
        lastSpawn = now;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (Math.random() < turnProbability) {
          const turns = ["left", "right", "down"];
          if (p.direction === "left") {
            p.direction = turns.filter((d) => d !== "right")[Math.floor(Math.random() * 2)];
          } else if (p.direction === "right") {
            p.direction = turns.filter((d) => d !== "left")[Math.floor(Math.random() * 2)];
          } else {
            p.direction = turns[Math.floor(Math.random() * 3)];
          }
        }

        const distance = particleSpeed * (deltaTime / 1000);
        p.x += directions[p.direction].x * distance;
        p.y += directions[p.direction].y * distance;

        p.x = Math.max(0, Math.min(p.x, canvas!.width));
        p.y = Math.min(p.y, canvas!.height);

        p.path.push({ x: p.x, y: p.y });
        if (p.path.length > 200) p.path.shift();

        const age = now - p.birthTime;
        if (age >= particleLifespan) {
          particles.splice(i, 1);
          continue;
        }
        p.opacity = 1 - age / particleLifespan;

        if (p.path.length >= 2) {
          for (let j = 1; j < p.path.length; j++) {
            const segmentOpacity = p.opacity * (j / p.path.length) * 0.6;
            ctx!.strokeStyle = p.color + Math.floor(segmentOpacity * 255).toString(16).padStart(2, "0");
            ctx!.lineWidth = 1.5;
            ctx!.beginPath();
            ctx!.moveTo(p.path[j - 1].x, p.path[j - 1].y);
            ctx!.lineTo(p.path[j].x, p.path[j].y);
            ctx!.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

// ============================================
// PROJECT CARD COMPONENT
// ============================================
interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  status: "completed" | "in-progress" | "experimental";
  github?: string;
  demo?: string;
  accent: "cyan" | "green" | "pink" | "amber";
  pixelPattern: string;
}

function ProjectCard({ project, index, isSharp }: { project: Project; index: number; isSharp: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  const accentColors = {
    cyan: {
      border: "border-neon-cyan",
      borderDim: "border-neon-cyan/30",
      text: "text-neon-cyan",
      bg: "bg-neon-cyan",
      bgDim: "bg-neon-cyan/10",
      shadow: "shadow-neon-cyan/30",
      glow: "0 0 30px rgba(0, 255, 255, 0.4)",
    },
    green: {
      border: "border-terminal-green",
      borderDim: "border-terminal-green/30",
      text: "text-terminal-green",
      bg: "bg-terminal-green",
      bgDim: "bg-terminal-green/10",
      shadow: "shadow-terminal-green/30",
      glow: "0 0 30px rgba(0, 255, 65, 0.4)",
    },
    pink: {
      border: "border-neon-pink",
      borderDim: "border-neon-pink/30",
      text: "text-neon-pink",
      bg: "bg-neon-pink",
      bgDim: "bg-neon-pink/10",
      shadow: "shadow-neon-pink/30",
      glow: "0 0 30px rgba(255, 0, 110, 0.4)",
    },
    amber: {
      border: "border-terminal-amber",
      borderDim: "border-terminal-amber/30",
      text: "text-terminal-amber",
      bg: "bg-terminal-amber",
      bgDim: "bg-terminal-amber/10",
      shadow: "shadow-terminal-amber/30",
      glow: "0 0 30px rgba(255, 176, 0, 0.4)",
    },
  };

  const colors = accentColors[project.accent];

  const statusConfig = {
    completed: { color: "text-terminal-green", bg: "bg-terminal-green", label: "DEPLOYED" },
    "in-progress": { color: "text-terminal-amber", bg: "bg-terminal-amber", label: "BUILDING" },
    experimental: { color: "text-neon-pink", bg: "bg-neon-pink", label: "EXPERIMENTAL" },
  };

  const status = statusConfig[project.status];
  const pixels = project.pixelPattern.split("").map((c) => c === "X");

  return (
    <div
      className="group relative"
      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative h-full border-2 bg-dark-800/90 p-6 backdrop-blur-sm transition-all duration-300 ${
          isHovered ? colors.border : colors.borderDim
        }`}
        style={{ boxShadow: isHovered ? colors.glow : "none" }}
      >
        {/* Corner accents */}
        <div className={`absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 ${colors.border} opacity-0 transition-opacity group-hover:opacity-100`} />
        <div className={`absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 ${colors.border} opacity-0 transition-opacity group-hover:opacity-100`} />
        <div className={`absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 ${colors.border} opacity-0 transition-opacity group-hover:opacity-100`} />
        <div className={`absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 ${colors.border} opacity-0 transition-opacity group-hover:opacity-100`} />

        {/* Header: Pixel icon + Status */}
        <div className="mb-4 flex items-start justify-between">
          {/* Pixel art icon */}
          <div className="grid grid-cols-5 gap-[2px] p-1">
            {pixels.slice(0, 30).map((filled, i) => (
              <div
                key={i}
                className={`h-2 w-2 transition-all duration-200 ${
                  filled
                    ? `${colors.bg} ${isHovered ? "opacity-100" : "opacity-60"}`
                    : "bg-dark-900/50"
                }`}
                style={{ borderRadius: isSharp ? "0" : "2px" }}
              />
            ))}
          </div>

          {/* Status badge */}
          <div className={`flex items-center gap-2 ${status.color}`}>
            <div className={`h-2 w-2 rounded-full ${status.bg} ${project.status === "in-progress" ? "animate-pulse" : ""}`} />
            <span className="font-mono text-[10px] uppercase tracking-wider">{status.label}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className={`mb-3 font-mono text-xl font-bold ${colors.text}`}>
          {project.title}
        </h3>

        {/* Description */}
        <p className="mb-4 font-mono text-sm leading-relaxed text-terminal-green/80">
          {project.description}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`border ${colors.borderDim} ${colors.bgDim} px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${colors.text} opacity-70 transition-opacity group-hover:opacity-100`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4 border-t border-terminal-green/10 pt-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 font-mono text-xs ${colors.text} opacity-60 transition-all hover:opacity-100`}
            >
              <span>⌘</span> GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 font-mono text-xs ${colors.text} opacity-60 transition-all hover:opacity-100`}
            >
              <span>◉</span> Live Demo
            </a>
          )}
        </div>

        {/* Scan line effect on hover */}
        {isHovered && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-scan absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function ProjectsPage() {
  const [isSharp, setIsSharp] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [glitchText, setGlitchText] = useState(false);

  // Periodic glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sample projects - customize these!
  const projects: Project[] = [
    {
      id: 1,
      title: "AvanAnomalyLab.net",
      description: "This mad scientist portfolio you're exploring right now. Built with Next.js 14, Three.js for 3D effects, and way too many hours perfecting those transitions.",
      tags: ["Next.js", "React", "Three.js", "Tailwind"],
      status: "in-progress",
      github: "https://github.com/yourusername/avananomaly-lab",
      demo: "https://avananomaly.net",
      accent: "cyan",
      pixelPattern: "XXXXX_XXX_XXXXX_XXX_XXXXX_XXX_",
    },
    {
      id: 2,
      title: "Neural Network Playground",
      description: "Interactive visualization of neural networks. Watch neurons fire, adjust weights in real-time, and finally understand what the heck backpropagation actually does.",
      tags: ["Python", "TensorFlow", "WebGL", "D3.js"],
      status: "completed",
      github: "https://github.com/yourusername/neural-playground",
      demo: "https://neural.example.com",
      accent: "pink",
      pixelPattern: "_XXX_XXXXXXX_X_XXXXXXX_X__XXX_",
    },
    {
      id: 3,
      title: "Terminal Portfolio CLI",
      description: "Because sometimes you want to browse a portfolio from the command line. Supports vim keybindings because I'm that kind of person.",
      tags: ["Rust", "CLI", "TUI", "Cross-platform"],
      status: "completed",
      github: "https://github.com/yourusername/terminal-portfolio",
      accent: "green",
      pixelPattern: "X____X____X____X____X____XXXXX",
    },
    {
      id: 4,
      title: "Quantum Random Generator",
      description: "Harvesting true randomness from quantum fluctuations. Or at least pretending to while using Math.random() with extra steps.",
      tags: ["Quantum", "API", "Node.js", "Redis"],
      status: "experimental",
      github: "https://github.com/yourusername/quantum-random",
      accent: "pink",
      pixelPattern: "_X_X__XXX_X_X_X_XXX__X_X__X_X_",
    },
    {
      id: 5,
      title: "GitFlow Automator",
      description: "Automates git workflows so you can spend more time writing code and less time resolving merge conflicts. Handles rebasing without the existential dread.",
      tags: ["Go", "Git", "DevOps", "CLI"],
      status: "completed",
      github: "https://github.com/yourusername/gitflow-auto",
      accent: "amber",
      pixelPattern: "XXXXXXX_X_X___X_X___X_XXXXX__X",
    },
    {
      id: 6,
      title: "Anomaly Detector AI",
      description: "Machine learning system that detects anomalies in time-series data. Currently being trained to detect when I'm about to make poor life decisions.",
      tags: ["Python", "PyTorch", "FastAPI", "Docker"],
      status: "in-progress",
      github: "https://github.com/yourusername/anomaly-detector",
      accent: "cyan",
      pixelPattern: "_XXX_XXXXXXX_X_XX__X_XXXXX_XX_",
    },
  ];

  const filteredProjects = activeFilter
    ? projects.filter((p) => p.tags.includes(activeFilter))
    : projects;

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));

  return (
    <div className="relative min-h-screen bg-dark-900">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <ElectrodeCanvas />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Vignette */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,14,39,0.8)_100%)]" />

      <div className="relative px-4 py-20 md:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="group mb-12 inline-flex items-center gap-2 border border-neon-cyan/30 bg-dark-800/50 px-4 py-2 font-mono text-neon-cyan backdrop-blur-sm transition-all hover:border-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          EXIT WORKSHOP
        </Link>

        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 border-l-4 border-neon-cyan pl-6">
            <h2 className="mb-2 font-mono text-sm text-neon-cyan/60">
              {">"} ASSEMBLY_BAY::PROJECTS
            </h2>
            <h1 
              className={`font-mono text-5xl font-bold text-neon-cyan md:text-7xl ${glitchText ? "animate-glitch" : ""}`}
              data-text="The Workshop"
            >
              The Workshop
            </h1>
            <p className="mt-4 font-mono text-lg text-terminal-green/70">
              // Where ideas become code, and code becomes <span className="text-neon-pink">chaos</span>
            </p>
          </div>

          {/* Controls Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border border-neon-cyan/20 bg-dark-800/50 p-4 backdrop-blur-sm">
            {/* Left: Filter tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-terminal-green/60">FILTER:</span>
              <button
                onClick={() => setActiveFilter(null)}
                className={`border px-3 py-1 font-mono text-xs transition-all ${
                  activeFilter === null
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                    : "border-terminal-green/30 text-terminal-green/60 hover:border-terminal-green hover:text-terminal-green"
                }`}
              >
                ALL
              </button>
              {allTags.slice(0, 6).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
                  className={`border px-3 py-1 font-mono text-xs transition-all ${
                    activeFilter === tag
                      ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                      : "border-terminal-green/30 text-terminal-green/60 hover:border-terminal-green hover:text-terminal-green"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Right: Shape toggle */}
            <button
              onClick={() => setIsSharp(!isSharp)}
              className="group flex items-center gap-2 border border-neon-cyan/30 bg-dark-900/50 px-4 py-2 font-mono text-xs text-neon-cyan/60 transition-all hover:border-neon-cyan hover:text-neon-cyan"
            >
              <div className={`h-4 w-4 border-2 border-current transition-all ${isSharp ? "" : "rounded"}`} />
              {isSharp ? "SHARP" : "SMOOTH"}
            </button>
          </div>

          {/* Project count with animated dots */}
          <div className="mb-6 flex items-center gap-2 font-mono text-sm text-terminal-green/60">
            <span className="inline-flex gap-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-terminal-green" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-terminal-green" style={{ animationDelay: "0.2s" }} />
              <span className="h-2 w-2 animate-pulse rounded-full bg-terminal-green" style={{ animationDelay: "0.4s" }} />
            </span>
            Displaying {filteredProjects.length} of {projects.length} projects
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isSharp={isSharp}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="py-20 text-center">
              <div className="mb-4 font-mono text-6xl text-terminal-green/20">∅</div>
              <p className="font-mono text-lg text-terminal-green/60">
                No projects match the current filter.
              </p>
              <button
                onClick={() => setActiveFilter(null)}
                className="mt-4 font-mono text-sm text-neon-cyan hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-16 grid gap-4 border border-neon-cyan/20 bg-dark-800/30 p-6 backdrop-blur-sm md:grid-cols-4">
            {[
              { value: projects.length, label: "TOTAL BUILDS", color: "text-neon-cyan" },
              { value: projects.filter((p) => p.status === "completed").length, label: "DEPLOYED", color: "text-terminal-green" },
              { value: projects.filter((p) => p.status === "in-progress").length, label: "IN PROGRESS", color: "text-terminal-amber" },
              { value: projects.filter((p) => p.status === "experimental").length, label: "EXPERIMENTAL", color: "text-neon-pink" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`font-mono text-4xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="mt-1 font-mono text-xs text-terminal-green/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="mb-4 font-mono text-terminal-green/60">
              Want to collaborate or have questions?
            </p>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-neon-cyan/30 bg-dark-800/50 px-6 py-3 font-mono text-neon-cyan transition-all hover:border-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
            >
              <span>Find me on GitHub</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="pointer-events-none fixed left-4 top-4 h-20 w-20 border-l-2 border-t-2 border-neon-cyan/20" />
      <div className="pointer-events-none fixed right-4 top-4 h-20 w-20 border-r-2 border-t-2 border-neon-cyan/20" />
      <div className="pointer-events-none fixed bottom-4 left-4 h-20 w-20 border-b-2 border-l-2 border-neon-cyan/20" />
      <div className="pointer-events-none fixed bottom-4 right-4 h-20 w-20 border-b-2 border-r-2 border-neon-cyan/20" />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scan {
          0% {
            top: 0;
          }
          100% {
            top: 100%;
          }
        }
        .animate-scan {
          animation: scan 1.5s linear infinite;
        }
        .animate-glitch {
          animation: glitch 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
}