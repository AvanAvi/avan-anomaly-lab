// lib/research.ts
// Data model and content for the Research section. Everything the UI
// needs (index cards, project pages, the diagram component) reads from
// PROJECTS below, so a new project is one array entry, not a new page.

export type ResearchTheme = "propulsion" | "population" | "resources";

export type ResearchStatus = "active" | "developing" | "dormant";

export const STATUS_COPY: Record<ResearchStatus, { label: string; tone: "positive" | "active" | "neutral" }> = {
  active: { label: "Active", tone: "positive" },
  developing: { label: "Developing", tone: "active" },
  dormant: { label: "Dormant", tone: "neutral" },
};

export const THEME_LABEL: Record<ResearchTheme, string> = {
  propulsion: "Unconventional Propulsion",
  population: "Systems & Population",
  resources: "Resource Balancing",
};

export interface WritingPiece {
  title: string;
  excerpt: string;
  /** True if this piece is (or will be) published under the pen name. */
  penName?: boolean;
}

export interface KeyIdea {
  label: string;
  detail: string;
}

export interface ResearchProject {
  slug: string;
  theme: ResearchTheme;
  title: string;
  /** One line, used on the index card and as the page kicker. */
  thesis: string;
  abstract: string;
  status: ResearchStatus;
  statusNote: string;
  questions: string[];
  methodology: string[];
  keyIdeas: KeyIdea[];
  writing: WritingPiece[];
  relatedExperiments?: string[];
}

/**
 * The pen name itself is not decided yet. Every place that would show
 * it reads through this constant and PEN_NAME_LABEL below, so setting
 * the real name here is the only change needed once it exists.
 */
export const PEN_NAME: string | null = null;

export const PEN_NAME_LABEL = PEN_NAME ?? "a name not yet public";

export const PROJECTS: ResearchProject[] = [
  {
    slug: "unconventional-propulsion",
    theme: "propulsion",
    title: "Unconventional Propulsion",
    thesis:
      "Most propulsion work optimizes inside an accepted constraint set. This asks which of those constraints are physics, and which are just habit.",
    abstract:
      "A working framework for evaluating unconventional propulsion concepts, electromagnetic drives, exotic atmospheric flight regimes, and the rest, on energy accounting and materials science first, before engineering feasibility is even discussed. Most claims in this space die at the first law of thermodynamics. The interesting ones do not, and the framework exists to tell the difference quickly. Includes an ongoing thread on sustained flight above Mach 30 in atmosphere: not whether it is possible, but what has to be true about materials and thermal management for it to be possible at all.",
    status: "active",
    statusNote: "Ongoing literature synthesis and first-principles energy modeling.",
    questions: [
      "Where does an unconventional propulsion claim fail on energy accounting alone, before any engineering objection is needed?",
      "What is the actual thermal ceiling for sustained hypersonic flight: a materials problem, or a materials science problem we have not funded yet?",
      "Which parts of electromagnetic propulsion are an efficiency argument, and which are a different physics argument wearing efficiency language?",
      "If a concept survives the energy and thermal filters, what is the smallest experiment that would falsify it cheaply?",
    ],
    methodology: [
      "First-principles energy and thermal budgeting applied before a concept is taken seriously",
      "Literature synthesis across aerospace engineering, plasma physics, and materials science",
      "Explicit separation of what current physics permits from what is currently buildable",
    ],
    keyIdeas: [
      {
        label: "Energy accounting first",
        detail:
          "Any concept gets checked against conservation of energy and momentum before its engineering is discussed. This filters out most of the internet's propulsion claims in one step.",
      },
      {
        label: "Thermal is the real bottleneck",
        detail:
          "At extreme atmospheric speeds, the limiting factor is usually not thrust, it is keeping the airframe from becoming part of the exhaust.",
      },
      {
        label: "Buildable is a separate axis from possible",
        detail:
          "Physically permitted and currently buildable are different questions, and conflating them is where most speculative propulsion writing goes wrong.",
      },
    ],
    writing: [
      {
        title: "The Energy Budget Test",
        excerpt:
          "A short filter for propulsion claims: draw the energy diagram before reading the marketing copy.",
      },
      {
        title: "What Mach 30 Actually Costs",
        excerpt:
          "Notes on thermal load, ablation, and why the atmosphere fights back harder than the vacuum ever does.",
        penName: true,
      },
    ],
    relatedExperiments: ["Reduced-order thermal model for leading-edge heating at extreme Mach"],
  },
  {
    slug: "minimum-viable-population",
    theme: "population",
    title: "Minimum Viable Population",
    thesis:
      "Not how many people could survive, but how many people a civilization needs to keep being one, indefinitely.",
    abstract:
      "A systems framing of long-term human survival: the smallest self-sustaining population that preserves genetic health, technological competence, and social resilience across generations, without collapsing into either extinction or a fragile monoculture. Population size is one variable among several, genetics, resource loops, social structure, and dependency on lost technology all move together, and the interesting failure modes live in the interactions, not any single number.",
    status: "developing",
    statusNote: "Framing the problem and its constraints before attaching numbers to it.",
    questions: [
      "What genetic diversity floor actually prevents long-term collapse, and how does it trade off against social cohesion at small scale?",
      "Which failure modes kill a small population first: resource shocks, technological dependency, or the social structures meant to prevent both?",
      "How much of a civilization's technical knowledge base has to survive intact for the population to stay technologically self-sufficient?",
      "Is there a population size below which resilience planning becomes a losing game regardless of resources?",
    ],
    methodology: [
      "Treat population size, genetics, resources, and social structure as one coupled system, not four separate problems",
      "Borrow failure-mode analysis from conservation biology and systems engineering rather than demography alone",
      "Stress-test proposed thresholds against historical population bottlenecks where data exists",
    ],
    keyIdeas: [
      {
        label: "A demographic floor is not a survival plan",
        detail:
          "A number large enough to avoid inbreeding depression says nothing about whether the group can maintain infrastructure, agriculture, or medicine.",
      },
      {
        label: "Technological dependency is a hidden population cost",
        detail:
          "A group that depends on knowledge or infrastructure it cannot itself maintain has a higher effective minimum population than its genetics alone suggest.",
      },
      {
        label: "Resilience and efficiency pull in opposite directions",
        detail:
          "The social structures that make a small population efficient are often the ones that make it brittle under shock.",
      },
    ],
    writing: [
      {
        title: "The Number Is the Wrong Question",
        excerpt:
          "Why 'minimum viable population' is a systems problem wearing a demography costume.",
      },
    ],
  },
  {
    slug: "resource-balancing",
    theme: "resources",
    title: "Resource Balancing",
    thesis:
      "Constrained systems do not fail because they run out. They fail because the feedback that would have told them to slow down arrives too late.",
    abstract:
      "A framework for modeling resource allocation in constrained systems, drawing on optimization, feedback control, and network theory. The core interest is not the allocation itself but the feedback loops that should keep it in equilibrium: what makes a resource network self-correct instead of oscillate or collapse, and how much of that comes down to the speed and honesty of the signal telling the system it is off balance.",
    status: "developing",
    statusNote: "Building the modeling framework before applying it to specific systems.",
    questions: [
      "How much of a resource system's stability comes from its allocation rule versus the speed of its feedback signal?",
      "What is the smallest feedback delay that turns a self-correcting system into an oscillating one?",
      "Do network effects make constrained systems more resilient by distributing shocks, or more fragile by propagating them faster?",
      "Where is the line between an equilibrium and a slow collapse that has not finished yet?",
    ],
    methodology: [
      "Model resource systems as feedback loops first, allocation rules second",
      "Borrow stability analysis from control theory rather than treating optimization as the whole problem",
      "Use network structure to locate where a shock in one part of the system propagates fastest",
    ],
    keyIdeas: [
      {
        label: "Delay breaks systems before scarcity does",
        detail:
          "A resource network with accurate but slow feedback behaves like one with no feedback at all, right up until it does not.",
      },
      {
        label: "Optimization and equilibrium are not the same goal",
        detail:
          "A perfectly optimized allocation with no slack is often one shock away from an allocation that no longer works.",
      },
      {
        label: "Networks distribute both shocks and corrections",
        detail:
          "The same connectivity that spreads a resource shortage is what makes a correction propagate before the shortage becomes total.",
      },
    ],
    writing: [
      {
        title: "The System That Failed Slowly",
        excerpt:
          "Notes on feedback delay as the real variable behind most resource collapses, not the resource itself.",
        penName: true,
      },
    ],
  },
];

export function getProject(slug: string): ResearchProject | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
