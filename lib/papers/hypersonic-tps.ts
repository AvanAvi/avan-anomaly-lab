// lib/papers/hypersonic-tps.ts
// Metadata, figures, and references for the V2 hypersonic TPS working
// paper. Every number and citation here is taken from the paper's LaTeX
// source (V2_latex/); nothing is added that the paper does not state.
// The page body that presents it lives in
// components/research/papers/HypersonicTpsPaper.tsx.

import type { ResearchPaper } from "@/lib/research";

const FIG_DIR = "/research/unconventional-propulsion";

export const HYPERSONIC_TPS_PAPER: ResearchPaper = {
  title:
    "Thermal-Stress-Limited Sizing of Fusion-Derived Thermal Protection for Hypersonic Cruise: A Corrected Range–Mach Trade Study",
  shortTitle: "Thermal-stress-limited sizing of fusion-derived thermal protection",
  subtitle: "A Version-2 reanalysis",
  kind: "Working paper",
  status: "Draft, not yet submitted or peer reviewed",
  date: "October 2026",
  approach: "Literature-based trade study with Monte Carlo uncertainty sweep",
  summary:
    "Could materials developed for fusion reactors protect an air-breathing vehicle cruising at Mach 15 to 30? This reanalysis corrects the range equation and heat-flux constant of an earlier version, then sizes the tungsten-alloy armor from a thermal-stress limit instead of assuming its thickness. Allowed armor thickness falls as Mach number rises. With an allowable stress revised from primary tensile data, the high-confidence ceiling sits near Mach 21, not Mach 30.",
  // Set to a path under /public (e.g. "/research/unconventional-propulsion/paper.pdf")
  // once a version with final authorship is ready to share.
  pdfUrl: undefined,
};

export interface PaperFigureData {
  number: number;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export const FIGURES: Record<string, PaperFigureData> = {
  heatFlux: {
    number: 1,
    src: `${FIG_DIR}/fig1_heatflux_vs_mach.png`,
    width: 900,
    height: 630,
    alt: "Line chart of stagnation-point heat flux against Mach number from 8 to 30. The convective curve rises steeply from near zero to about 77 MW per square metre at Mach 30; a dashed total curve including the bounded radiative estimate rises to about 89. A dotted horizontal line marks V1's unreproducible 45 MW per square metre claim.",
    caption:
      "Sutton–Graves stagnation-point convective heat flux versus Mach number at 30 km altitude, nose radius 5 cm. Replaces V1's unreproducible constant.",
  },
  thickness: {
    number: 2,
    src: `${FIG_DIR}/fig2_thickness_vs_mach.png`,
    width: 900,
    height: 630,
    alt: "Line chart of the stress-limited maximum outer ODS-W armor thickness against Mach number. The curve falls from about 17 mm at Mach 8 to below 1 mm past Mach 20 and crosses the 0.5 mm manufacturability floor in the mid-20s. A band marks the 5.7 to 7.7 mm thickness of qualified ITER and WEST tungsten armor, and a dotted line marks V1's assumed 6 mm.",
    caption:
      "Stress-limited maximum armor thickness versus Mach number under the evidence-revised allowable stress. The shaded region at high Mach marks where no thickness is both stress-safe and above the 0.5 mm manufacturability floor.",
  },
  range: {
    number: 3,
    src: `${FIG_DIR}/fig3_range_vs_mach.png`,
    width: 975,
    height: 690,
    alt: "Chart of nominal cruise range against Mach number. Mach 8 to 11 are marked mass-infeasible. A green line of self-consistent designs rises from about 200 km at Mach 12 to about 3,300 km at Mach 25. Mach 26 to 30 are marked as having no self-consistent thickness.",
    caption:
      "Nominal cruise range versus Mach number, separating the not-mass-closeable, self-consistent, and no-self-consistent-thickness regimes.",
  },
  monteCarlo: {
    number: 4,
    src: `${FIG_DIR}/fig4_montecarlo_range.png`,
    width: 1650,
    height: 660,
    alt: "Two Monte Carlo range histograms. Left, Mach 30: a sparse distribution labelled as a cautionary, unrepresentative surviving tail. Right, Mach 25: a right-skewed distribution with a median of 3,663 km, with V1's 4,760 km point estimate marked for comparison.",
    caption:
      "Monte Carlo range distributions. Left: Mach 30, shown only as a caution, since almost all of the sampled space has no self-consistent design. Right: Mach 25, the paper's primary uncertainty result.",
  },
  tornado: {
    number: 5,
    src: `${FIG_DIR}/fig5_tornado.png`,
    width: 975,
    height: 630,
    alt: "Tornado chart of range sensitivity at Mach 24 around a base case of 3,095 km. Specific impulse (350 to 800 s) and lift-to-drag ratio (2.5 to 5.0) produce by far the widest bars, followed by the MHD packaging factor. Allowable stress and radiative fraction produce small, one-sided bars where one extreme yields no valid design.",
    caption:
      "One-at-a-time (tornado) sensitivity of range to each swept parameter at Mach 24. One-sided bars mark a swept extreme that produces no valid design.",
  },
  floor: {
    number: 6,
    src: `${FIG_DIR}/fig6_floor_sensitivity.png`,
    width: 975,
    height: 645,
    alt: "Line chart of the self-consistent fraction of the swept uncertainty space against Mach number, one curve per assumed manufacturability floor from 0.3 to 1.5 mm. Thicker floors make the curves fall off at progressively lower Mach numbers; the bold 0.5 mm baseline falls through 50 percent near Mach 25.",
    caption:
      "Self-consistent fraction of the swept uncertainty space versus Mach number, one curve per assumed manufacturability floor (0.3–1.5 mm). The bold 0.5 mm baseline is used everywhere else in the paper.",
  },
};

export interface PaperReference {
  key: string;
  /** Short in-text label, e.g. "Tan et al., 2015". */
  label: string;
  citation: string;
  url?: string;
}

/** The 18 sources the paper actually cites, in alphabetical order. */
export const REFERENCES: PaperReference[] = [
  {
    key: "Aguirre2011",
    label: "Aguirre et al., 2011",
    citation:
      "Aguirre, M. V., Martín, A., Pastor, J. Y., Llorca, J., Monge, M. A., & Pareja, R. (2011). Mechanical properties of tungsten alloys with Y2O3 and titanium additions. Journal of Nuclear Materials, 417, 516–519.",
    url: "https://doi.org/10.1016/j.jnucmat.2010.12.120",
  },
  {
    key: "SPARC-TFMC",
    label: "CFS & MIT PSFC, 2023",
    citation:
      "Commonwealth Fusion Systems & MIT PSFC (2023). The SPARC Toroidal Field Model Coil program. arXiv:2308.12301.",
    url: "https://arxiv.org/pdf/2308.12301",
  },
  {
    key: "Fukuda-2021",
    label: "Fukuda et al., 2021",
    citation:
      "Fukuda, M., et al. (2021). Performance evaluation of tungsten for ITER divertor toward mass production. Fusion Engineering and Design, 167, 112283.",
    url: "https://doi.org/10.1016/j.fusengdes.2021.112283",
  },
  {
    key: "GE-2025",
    label: "GE Aerospace, 2025",
    citation:
      "GE Aerospace (2025, September 22). GE Aerospace demonstrates new hypersonic ramjets with rotating detonation combustion [Press release].",
    url: "https://www.geaerospace.com/news/press-releases/ge-aerospace-demonstrates-new-hypersonic-ramjets-rotating-detonation-combustion",
  },
  {
    key: "Grosman2013",
    label: "Grosman et al., 2013",
    citation:
      "Grosman, A., et al. (2013). The WEST programme. Fusion Engineering and Design, 88, 497–500.",
    url: "https://doi.org/10.1016/j.fusengdes.2013.02.039",
  },
  {
    key: "ITER-divertor",
    label: "ITER Organization, 2024",
    citation: "ITER Organization (2024). Divertor. ITER machine systems.",
    url: "https://www.iter.org/machine/divertor",
  },
  {
    key: "GE-LM-2026",
    label: "Lockheed Martin & GE Aerospace, 2026",
    citation:
      "Lockheed Martin & GE Aerospace (2026, January 14). GE Aerospace and Lockheed Martin demonstrate rotating detonation ramjet for hypersonic missiles [Press release].",
    url: "https://news.lockheedmartin.com/2026-01-14-GE-Aerospace-and-Lockheed-Martin-Demonstrate-Rotating-Detonation-Ramjet-for-Hypersonic-Missiles",
  },
  {
    key: "MIT-OCW",
    label: "MIT OpenCourseWare, 2005",
    citation: "MIT OpenCourseWare (2005). 16.Unified propulsion notes: Breguet range equation.",
    url: "https://web.mit.edu/16.unified/www/SPRING/propulsion/notes/node98.html",
  },
  {
    key: "Munoz2011",
    label: "Muñoz et al., 2011",
    citation:
      "Muñoz, A., Monge, M. A., Savoini, B., Rabanal, M. E., Garcés, G., & Pareja, R. (2011). La2O3-reinforced W and W–V alloys produced by hot isostatic pressing. Journal of Nuclear Materials, 417, 508–511.",
    url: "https://doi.org/10.1016/j.jnucmat.2011.01.077",
  },
  {
    key: "NASA-RDRE2023",
    label: "NASA, 2023",
    citation: "NASA (2023). NASA's 3D-printed rotating detonation rocket engine test a success.",
    url: "https://www.nasa.gov/centers-and-facilities/marshall/nasas-3d-printed-rotating-detonation-rocket-engine-test-a-success/",
  },
  {
    key: "TFAWS",
    label: "NASA TFAWS, 2012",
    citation:
      "NASA Thermal & Fluids Analysis Workshop (2012). Aerothermodynamics course, lecture #1: Stagnation point heating.",
    url: "https://tfaws.nasa.gov/TFAWS12/Proceedings/Aerothermodynamics%20Course.pdf",
  },
  {
    key: "NSJ-X43A",
    label: "National Security Journal, 2026",
    citation:
      "National Security Journal (2026). NASA's X-43A flew at Mach 9.6 and 110,000 feet: No air-breathing aircraft has gone faster in the 22 years since that flight.",
    url: "https://nationalsecurityjournal.org/nasas-x-43a-flew-at-mach-9-6-and-110000-feet-no-air-breathing-aircraft-has-gone-faster-in-the-22-years-since-that-flight/",
  },
  {
    key: "MHD-arxiv",
    label: "arXiv:2207.09857, 2022",
    citation: "Numerical modelling of imposed magnetohydrodynamic effects in hypersonic flows (2022). arXiv:2207.09857.",
    url: "https://arxiv.org/pdf/2207.09857",
  },
  {
    key: "NASA-RDE-2023",
    label: "Perkins & Paxson, 2023",
    citation:
      "Perkins, D., & Paxson, D. (2023). Rotating detonation research at NASA. AIAA Aviation presentation, NASA NTRS 20230008544.",
    url: "https://ntrs.nasa.gov/api/citations/20230008544/downloads/AIAA%20Aviation%20NASA%20RDE%20Overview_V1.pdf",
  },
  {
    key: "Richou-2021",
    label: "Richou et al., 2021",
    citation:
      "Richou, M., et al. (2021). Acceptance tests of the actively cooled tungsten monoblock plasma facing units for WEST. Physica Scripta, 96, 124029.",
    url: "https://doi.org/10.1088/1402-4896/ac2657",
  },
  {
    key: "SuttonGraves1971",
    label: "Sutton & Graves, 1971",
    citation:
      "Sutton, K., & Graves, R. A. (1971). A general stagnation-point convective heating equation for arbitrary gas mixtures. NASA TR R-376.",
  },
  {
    key: "Tan2015",
    label: "Tan et al., 2015",
    citation:
      "Tan, X., et al. (2015). Mechanical properties and microstructural change of W–Y2O3 alloy under helium irradiation. Scientific Reports, 5, 12755.",
    url: "https://doi.org/10.1038/srep12755",
  },
  {
    key: "TauberSutton1991",
    label: "Tauber & Sutton, 1991",
    citation:
      "Tauber, M. E., & Sutton, K. (1991). Stagnation-point radiative heating relations for Earth and Mars entries. Journal of Spacecraft and Rockets, 28(1), 40–42.",
  },
];

export const REFERENCE_BY_KEY: Record<string, PaperReference> = Object.fromEntries(
  REFERENCES.map((r) => [r.key, r]),
);
