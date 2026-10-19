import DemoEmbed from "@/components/research/paper/DemoEmbed";
import Equation from "@/components/research/paper/Equation";
import PaperFigure from "@/components/research/paper/PaperFigure";
import PaperSection from "@/components/research/paper/PaperSection";
import PaperTable from "@/components/research/paper/PaperTable";
import RichText from "@/components/research/paper/RichText";
import { FIGURES, REFERENCES } from "@/lib/papers/hypersonic-tps";

/**
 * Web presentation of the V2 hypersonic TPS working paper. The prose is
 * condensed from the LaTeX source but every number, citation, and claim
 * comes from it. Where the paper's own sections disagree on a figure,
 * this page states only what they agree on.
 */

export const CONTENTS = [
  { id: "demonstration", index: "00", label: "Demonstration" },
  { id: "motivation", index: "01", label: "Motivation" },
  { id: "background", index: "02", label: "Background" },
  { id: "approach", index: "03", label: "Approach" },
  { id: "results", index: "04", label: "Results" },
  { id: "discussion", index: "05", label: "Discussion" },
  { id: "limitations", index: "06", label: "Limitations" },
  { id: "conclusion", index: "07", label: "Conclusion" },
  { id: "references", index: "08", label: "References" },
];

const DEMO_SRC = "/research/unconventional-propulsion/hypersonic-cruiser.html";

export const AT_A_GLANCE = [
  {
    value: "76.2 MW/m²",
    label: "Stagnation heat flux",
    detail: "Convective, at Mach 30 and 30 km altitude. Reproducible from the stated correlation; V1 claimed 45.",
  },
  {
    value: "≈ Mach 21",
    label: "High-confidence ceiling",
    detail: "At least 99% of the swept parameter space still gives an armor thickness that is both stress-safe and buildable.",
  },
  {
    value: "3,312 km",
    label: "Nominal range at Mach 25",
    detail: "The practical ceiling. About half of the swept parameter space has no valid design there.",
  },
  {
    value: "6–11×",
    label: "Real-world precedent",
    detail: "How much thicker qualified ITER/WEST tungsten armor is than the model's thinnest self-consistent designs.",
  },
];

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="pt-6 font-display text-2xl text-white">{children}</h3>;
}

function P({ children }: { children: string }) {
  return (
    <p>
      <RichText>{children}</RichText>
    </p>
  );
}

function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <aside className="my-8 border-l-2 border-signal/50 bg-signal/[0.04] px-5 py-4">
      <p className="font-mono text-[11px] tracking-[0.2em] text-signal/70">{label}</p>
      <div className="mt-2 font-sans text-base leading-relaxed text-white/80">{children}</div>
    </aside>
  );
}

const GLOSSARY: { term: string; def: string }[] = [
  {
    term: "Thermal protection system (TPS)",
    def: "The outer layers that keep aerodynamic heating from reaching the vehicle's load-bearing structure.",
  },
  {
    term: "Stagnation point",
    def: "The point on the nose where the oncoming air is brought to rest. It is usually the most intensely heated spot on the vehicle.",
  },
  {
    term: "ODS-W",
    def: "Oxide-dispersion-strengthened tungsten: tungsten reinforced with a fine dispersion of oxide particles (here Y₂O₃), developed for fusion plasma-facing components.",
  },
  {
    term: "CFC and RAFM steel",
    def: "Carbon-fibre-reinforced carbon, and reduced-activation ferritic-martensitic steel. In the model's layered stack they sit behind the tungsten as a thermal and oxidation buffer and a load-bearing substructure.",
  },
  {
    term: "Specific impulse, $I_{sp}$",
    def: "Thrust delivered per unit weight flow of propellant, in seconds. Higher means more efficient propulsion.",
  },
  {
    term: "Lift-to-drag ratio, $L/D$",
    def: "How much lift the vehicle generates for each unit of drag in steady cruise.",
  },
  {
    term: "MHD",
    def: "Magnetohydrodynamics: using magnetic fields to act on the electrically conducting, partly ionised air around a hypersonic vehicle.",
  },
  {
    term: "Self-consistent design",
    def: "The paper's term for an armor thickness that is simultaneously below the stress limit and above the minimum buildable thickness.",
  },
];

const ROBUSTNESS: { mach: number; share: number; label: string }[] = [
  { mach: 21, share: 99, label: "≥ 99%" },
  { mach: 22, share: 95, label: "95%" },
  { mach: 23, share: 85, label: "85%" },
  { mach: 24, share: 69, label: "69%" },
  { mach: 25, share: 51, label: "51%" },
  { mach: 26, share: 33, label: "33%" },
  { mach: 27, share: 17, label: "17%" },
  { mach: 28, share: 8, label: "8%" },
  { mach: 29, share: 3, label: "3%" },
  { mach: 30, share: 1, label: "1%" },
];

const REGIMES = [
  {
    range: "Mach 8 to ~11",
    name: "Not mass-closeable",
    tone: "border-line-strong",
    body: "Thermal stress does not bind, so the design falls back to the 6 mm reference thickness. The TPS alone is 71% of gross mass, leaving a negative propellant fraction at 50,000 kg.",
  },
  {
    range: "Mach 12 to 25",
    name: "Self-consistent",
    tone: "border-signal/50",
    body: "Stress binds and forces thinner, lighter armor as Mach rises. Range grows from roughly 215 km at Mach 12 to a nominal 3,312 km at Mach 25, but confidence falls steadily past Mach 21.",
  },
  {
    range: "Mach 26 to 30",
    name: "No self-consistent thickness",
    tone: "border-alert/50",
    body: "The stress-safe maximum (0.28 to 0.45 mm) is below the 0.5 mm buildable floor. No thickness is both buildable and stress-safe, so the regime is assessed as infeasible.",
  },
];

const LIMITATIONS: { id: string; title: string; body: string; effect: string }[] = [
  {
    id: "L1",
    title: "Radiative heat-flux contribution",
    body: "The only radiative correlation in hand ([[TauberSutton1991]]) is validated for 10 to 16 km/s at roughly 54 to 72 km altitude. At the model's 30 km cruise condition the air is 28.5× denser than its validated ceiling, so radiation is carried as a bounded 0 to 35% of convective heating instead of a computed value.",
    effect:
      "Does not change the stress-limited-thickness mechanism. Needs a radiative-transport source verified at 30 km, or a re-examination of whether 30 km is the right cruise altitude for this vehicle class.",
  },
  {
    id: "L2",
    title: "ODS-tungsten allowable stress",
    body: "The allowable stress rests on two open primary sources, one used quantitatively ([[Tan2015]]) and one qualitatively ([[Aguirre2011]]). No temperature-resolved strength data for a Y₂O₃-based ODS-W near 1,000 K was found, and the paper treats that search as exhausted. This revision reverses which Mach regime looks most favourable. The 0.5 mm manufacturability floor that interacts with it has no cited source.",
    effect:
      "The single most consequential materials input. Every Mach ceiling should be read against the floor-sensitivity table.",
  },
  {
    id: "L3",
    title: "Manufacturability of sub-millimetre ODS-W tiles",
    body: "Three ITER/WEST manufacturing papers ([[Grosman2013,Fukuda-2021,Richou-2021]]) all describe tungsten monoblocks, 5.7 to 7.7 mm thick, bonded to an actively cooled CuCrZr tube, not thin tiles on a buffer layer. Qualification is incomplete even at that scale: the WEST high-heat-flux acceptance criterion was not finalised at publication, and ITER-grade blocks were tested for about 1,000 cycles at ≥ 20 MW/m² against an original specification of 5,000 cycles at 10 MW/m², with unexplained differences in cracking between suppliers. The highest-priority follow-up source (Missirlian et al., 2023) could not be obtained.",
    effect:
      "The paper's most significant unresolved weakness: the best real-world analogue argues against, not for, near-term manufacturability of the geometry the feasible window needs.",
  },
  {
    id: "L4",
    title: "MHD flight-packaging factor",
    body: "The 2 to 5× factor that scales a stationary fusion magnet's mass to a flight system is an explicit engineering assumption. No public flight-magnet packaging fraction for a REBCO system of this scale was found.",
    effect:
      "The MHD system is only 2 to 3% of gross mass, so this moves the range number without changing the feasibility picture.",
  },
  {
    id: "L5",
    title: "Vehicle geometry and mass allocations",
    body: "Gross mass, wetted area, and mass fractions are inherited from V1 as design choices and never independently derived or validated.",
    effect:
      "A different wetted-area-to-mass ratio shifts where the crossover Mach numbers fall, though not the mechanism itself.",
  },
  {
    id: "L6",
    title: "Real-gas stagnation temperature",
    body: "The 6,000 to 8,000 K real-gas figure inherited from V1 was not re-derived from an open equilibrium-air table.",
    effect: "Descriptive context only. The mass and range model uses the heat-flux correlation, not this temperature.",
  },
  {
    id: "L7",
    title: "Steady-state thermal stress",
    body: "Equation 3 is a steady-state, linear-elastic result. It misses transient thermal-shock spikes during rapid heating, such as ascent, and plastic relaxation at high temperature. Transient spikes are typically larger than the steady value.",
    effect:
      "Non-conservative: the true stress-safe thickness may be thinner still, which would narrow the feasible band further. Needs a transient finite-element simulation across a full flight profile.",
  },
];

export default function HypersonicTpsPaper() {
  return (
    <>
      {/* 00 Interactive demonstration. Breaks out of the text column so the
          drawing gets close to its native 1000 px width. */}
      <PaperSection id="demonstration" index="00" title="Interactive demonstration">
        <P>
          The paper's model as a working instrument. Set the cruise Mach number with the slider, by dragging across the test cell, or with the arrow keys. The stagnation heat flux, the stress-limited tungsten thickness, the mass fractions, the range and the regime all update from the paper's equations, and the coupon on the bench changes thickness to match. Select a part name to highlight it in the drawing.
        </P>
        <div className="relative left-1/2 w-[min(72rem,calc(100vw-3rem))] -translate-x-1/2">
          <div className="border border-line bg-ink-900/40">
            <DemoEmbed
              src={DEMO_SRC}
              title="Interactive model of the V2 hypersonic cruiser in a free-jet test cell. Set the cruise Mach number from 8 to 30 to see heat flux, allowed armor thickness, mass fractions, range and feasibility regime."
            />
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <p className="max-w-3xl font-sans text-sm leading-relaxed text-white/50">
              <span className="font-mono text-xs tracking-wide text-signal/70">DEMONSTRATION.</span> 
              <RichText>{"An illustration of the model, not a vehicle design: the paper does no shape design, and the vehicle and test-cell geometry are drawn for explanation only. It runs a single case with $I_{sp}$ = 500 s and $L/D$ = 3.5 and a radiative share that ramps to 17.5% at Mach 30, so its readouts track the paper's nominal results closely (for example 3,304 km at Mach 25 against the paper's 3,312 km) but are not identical everywhere. The percentage shown is the paper's swept self-consistent share."}</RichText>
            </p>
            <a
              href={DEMO_SRC}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 font-mono text-xs text-white/40 underline-offset-2 transition-colors hover:text-signal hover:underline"
            >
              Open full screen ↗
            </a>
          </div>
        </div>
      </PaperSection>

      {/* 01 Motivation */}
      <PaperSection id="motivation" index="01" title="Motivation and research question">
        <P>
          Air-breathing hypersonic flight has a demonstrated envelope well short of Mach 30. The fastest confirmed air-breathing powered flight is still NASA's X-43A at Mach 9.6 in 2004 ([[NSJ-X43A]]). Going much faster in the atmosphere runs into two constraints at once: no air-breathing propulsion architecture has been demonstrated beyond roughly Mach 10, even at laboratory scale, and no reusable structural material can survive the resulting heat flux at the vehicle's nose.
        </P>
        <P>
          That heat flux is of order 45 to 80 MW/m² at Mach 20 to 30 at 30 km altitude, one to two orders of magnitude above what any conventional aerospace alloy can take continuously. Components in magnetic-confinement fusion reactors are routinely specified to survive 10 to 20 MW/m² of steady heat flux ([[ITER-divertor]]). An earlier version of this work (V1) proposed that fusion materials could therefore address the materials constraint, and built a thermal-protection mass model around that idea.
        </P>

        <Sub>What checking V1 found</Sub>
        <P>A claim-by-claim verification of V1 found three categories of problem:</P>
        <ol className="space-y-3 pl-0">
          {[
            "The governing range equation omits cruise velocity, so it does not have units of distance. Its output for V1's Mach 30 case was plausible only by coincidence.",
            "The stated constant in the stagnation heat-flux correlation does not reproduce V1's own claimed result, missing by roughly three orders of magnitude.",
            "A citation for \"experimental validation\" of magnetohydrodynamic flow control does not match what the traceable primary source reports.",
          ].map((item, i) => (
            <li key={i} className="flex gap-4 border-l-2 border-alert/40 pl-5">
              <span className="font-mono text-xs leading-7 text-alert/70">{String(i + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <P>
          The first two are the equations from which nearly every quantitative conclusion in V1 follows. V2 does not patch them. It re-derives the range physics from first principles, replaces the heat-flux correlation with an independently sourced one, and rebuilds the mass model around a physical sizing criterion, thermal stress, instead of an assumed armor thickness.
        </P>

        <Callout label="RESEARCH QUESTION">
          <p className="font-display text-xl italic leading-relaxed text-white/90">
            Under a thermal-stress-limited sizing criterion for a layered fusion-material thermal protection system, and using only publicly verifiable propulsion, materials, and aerothermal data, what is the mass-closeable cruise range of an air-breathing hypersonic vehicle as a function of Mach number between 8 and 30, and how does that answer's uncertainty decompose across propulsive, structural, and materials unknowns?
          </p>
        </Callout>
        <P>
          Two things change relative to V1. Mach number becomes a free variable instead of being fixed at 30, which is only possible because the corrected range equation contains velocity. And armor thickness becomes an output, derived from a stress limit, rather than an input.
        </P>
        <P>
          This is not a vehicle design study. There is no aerodynamic shape optimisation, no trajectory analysis beyond an idealised constant-altitude cruise, and no detailed propulsion design. The reference vehicle is kept from V1 on purpose, so that the effect of correcting V1's errors is not confused with the effect of choosing a different vehicle.
        </P>
      </PaperSection>

      {/* 02 Background */}
      <PaperSection id="background" index="02" title="Theoretical background">
        <details className="group border border-line bg-ink-900/40 open:bg-ink-900/60">
          <summary className="cursor-pointer list-none px-5 py-4 font-mono text-xs tracking-[0.15em] text-white/60 transition-colors hover:text-signal [&::-webkit-details-marker]:hidden">
            <span className="mr-2 inline-block text-signal/70 transition-transform group-open:rotate-90">›</span>
            KEY TERMS
          </summary>
          <dl className="grid gap-x-8 gap-y-5 border-t border-line px-5 py-5 md:grid-cols-2">
            {GLOSSARY.map((g) => (
              <div key={g.term}>
                <dt className="font-sans text-sm font-medium text-white/85">
                  <RichText>{g.term}</RichText>
                </dt>
                <dd className="mt-1 font-sans text-sm leading-relaxed text-white/55">{g.def}</dd>
              </div>
            ))}
          </dl>
        </details>

        <Sub>The hypersonic thermal environment</Sub>
        <P>
          Above roughly Mach 8 to 10, air passing through the bow shock gets hot enough that vibrational excitation, dissociation and, at the top of this study's range, ionisation absorb a large share of the energy that would otherwise appear as heat. This is the real-gas effect, and it is standard hypersonic aerothermodynamics. The ideal-gas stagnation temperature gives the reference it is measured against:
        </P>
        <Equation number={1} label="Ideal-gas stagnation temperature" tex={String.raw`T_0 = T_\infty\left(1 + \frac{\gamma-1}{2}M^2\right)`}>
          <RichText>
            {"With $T_\\infty = 226$ K, $\\gamma = 1.4$ and $M = 30$ this gives 40,906 K. Real-gas chemistry brings the true stagnation temperature down to a few thousand kelvin. The paper keeps that only as an order-of-magnitude figure; the mass model does not use it."}
          </RichText>
        </Equation>

        <Sub>Stagnation-point heating</Sub>
        <P>
          What matters for sizing is the heat flux into the wall, which comes from a separate empirical correlation. V2 uses the Sutton–Graves relation with the constant documented in NASA's public TFAWS aerothermodynamics course ([[SuttonGraves1971,TFAWS]]):
        </P>
        <Equation number={2} label="Sutton–Graves convective heating" tex={String.raw`\begin{gathered}\dot q_s = k\,\sqrt{\frac{\rho}{R_n}}\;V^3 \\[4pt] k = 1.7415\times10^{-4}\ \text{(SI, Earth atmosphere)}\end{gathered}`}>
          <RichText>
            {"$\\dot q_s$ is the stagnation-point heat flux, $\\rho$ the free-stream air density, $R_n$ the nose radius and $V$ the flight speed. V1 used the same form with a constant of $1.83\\times10^{-8}$, which does not reproduce V1's own answer. Because of the $V^3$ term, doubling the speed multiplies the heat flux by eight."}
          </RichText>
        </Equation>

        <Sub>Sizing the armor by thermal stress</Sub>
        <P>
          A plate heated steadily on one side develops a temperature gradient through its thickness, $\Delta T = \dot q\,\delta/\lambda$, and a matching thermal stress. This is a standard thermoelastic result, and its form is unchanged from V1:
        </P>
        <Equation number={3} label="Thermal stress in a one-sided-heated plate" tex={String.raw`\sigma_{th} = \frac{\alpha\,E\,\dot q\,\delta}{2\lambda(1-\nu)}`}>
          <RichText>
            {"$\\alpha$ is the thermal-expansion coefficient, $E$ Young's modulus, $\\delta$ the plate thickness, $\\lambda$ the thermal conductivity and $\\nu$ Poisson's ratio. With V1's assumed 6 mm of ODS-W at Mach 30, it gives about 4,761 MPa, roughly five times a typical ODS-W allowable stress."}
          </RichText>
        </Equation>
        <P>
          V1 assumed the thickness and computed the stress without checking it against the material's strength. V2 inverts the relationship. It takes the allowable stress as the design constraint and solves for the thickest armor the material can tolerate at a given heat flux:
        </P>
        <Equation number={4} label="Stress-limited maximum thickness" tex={String.raw`\delta_{\max} = \frac{\sigma_{\text{allow}}\cdot 2\lambda(1-\nu)}{\alpha\,E\,\dot q}`}>
          <RichText>
            {"This inversion is the paper's central methodological change. Since $\\delta_{\\max}$ is inversely proportional to $\\dot q$, and $\\dot q$ grows as $V^3$, the allowed thickness shrinks rapidly as the vehicle flies faster."}
          </RichText>
        </Equation>

        <Sub>Range physics</Sub>
        <P>
          {"For an air-breathing vehicle in steady cruise, where lift equals weight and thrust equals drag, the Breguet range equation is re-derived from the definition of specific impulse, $T = \\dot m g_0 I_{sp}$. The gravitational constant $g_0$ cancels, leaving a form in which velocity appears explicitly:"}
        </P>
        <Equation number={5} label="Air-breathing Breguet range" tex={String.raw`R = V\cdot\frac{L}{D}\cdot I_{sp}\cdot\ln\!\left(\frac{m_i}{m_f}\right)`}>
          <RichText>
            {"$m_i$ and $m_f$ are the initial and final vehicle mass. Units check: (m/s)·(1)·(s)·(1) = m. Range goes to zero as $V \\to 0$ and is exactly linear in $V$ at fixed $I_{sp}$, $L/D$ and mass ratio. The result matches an independent public derivation ([[MIT-OCW]]). V1's equation, $R = I_{sp}\\,g_0\\,(L/D)\\ln(m_i/m_f)$, has units of m/s and fails both checks."}
          </RichText>
        </Equation>
      </PaperSection>

      {/* 03 Approach */}
      <PaperSection id="approach" index="03" title="Approach">
        <Sub>Only verifiable sources</Sub>
        <P>
          Every numerical constant in the model is registered with an explicit accessibility tier: (a) public primary or institutional sources such as NASA, DOE and IAEA reports, arXiv preprints and open-access journals; (b) public secondary or handbook values, flagged and given wider uncertainty bands; (c) inaccessible sources, which are not used. No numeric input falls into tier (c). Where a paywalled V1 source could not be replaced with an equally precise open one, the claim was downgraded to qualitative or given a wide uncertainty band.
        </P>

        <Sub>Re-sourcing the tungsten allowable stress</Sub>
        <P>
          One V1 citation for the ODS-W strength input did not correspond to any real publication under its stated title. The real paper by that author in that issue ([[Munoz2011]]) measures room-temperature hardness and elastic modulus on a La₂O₃-dispersed alloy. That is a different property, temperature and alloy system, so it serves only as a third cross-check of Young's modulus (400 GPa), not of strength.
        </P>
        <P>
          Two other open primary sources were read in full. [[Tan2015]] tabulates tensile strength for W–Y₂O₃, and [[Aguirre2011]] gives graph-read data for five tungsten compositions from 25 to 1,000 °C. Both indicate that V1's 400 to 800 MPa allowable-stress range was optimistic at the model's own assumed operating temperature of about 1,000 K. The input was revised to 260 MPa nominal, swept from 200 to 350 MPa, based on Tan et al.'s data. Aguirre et al. is used only as qualitative corroboration.
        </P>
        <PaperTable
          caption="W–Y₂O₃ tensile strength from Tan et al. (2015), with the paper's interpolation to its assumed ~1,000 K operating point (highlighted)."
          headers={["Temperature", "Yield strength", "Ultimate strength"]}
          rows={[
            ["400 °C", "397 MPa", "436 MPa"],
            ["600 °C", "273 MPa", "346 MPa"],
            ["≈ 727 °C (≈ 1,000 K, interpolated)", "≈ 231 MPa", "≈ 285 MPa"],
            ["800 °C", "206 MPa", "249 MPa"],
          ]}
          highlightRow={2}
        />

        <Sub>Model inputs</Sub>
        <P>
          The thermal protection system is a three-layer stack: an outer ODS-W armor layer whose thickness comes from Equation 4, over fixed-thickness CFC and RAFM layers. Its mass per unit area is the sum of each layer's density times its thickness, $\rho_a = \sum_i \rho_i\,\delta_i$. The reference vehicle is retained from V1 as an explicit design choice, not a derived result.
        </P>
        <PaperTable
          caption="Principal model inputs. Ranges marked swept are varied in the Monte Carlo and sensitivity analyses."
          headers={["Input", "Value", "Basis"]}
          rows={[
            ["Gross mass", "50,000 kg", "Retained from V1 (design choice)"],
            ["Wetted area", "120 m²", "Retained from V1"],
            ["Nose radius", "5 cm", "Retained from V1"],
            ["Structure / systems / min. payload", "0.20 / 0.05 / 0.05 of gross mass", "Retained from V1"],
            ["Cruise condition", "Constant 30 km altitude, $\\rho = 0.018$ kg/m³", "Idealised cruise"],
            ["Back layers", "CFC 15 mm, RAFM 20 mm", "Fixed thickness"],
            ["ODS-W properties", "$\\alpha = 4.5\\times10^{-6}$ K⁻¹, $E = 400$ GPa, $\\nu = 0.28$, $\\lambda = 120$ W/(m·K)", "$\\lambda$ from a public MOOSE/INL correlation; $E$ cross-checked by three sources"],
            ["ODS-W allowable stress", "260 MPa nominal, 200–350 MPa swept", "Tan et al. (2015)"],
            ["Manufacturability floor", "0.5 mm minimum thickness", "Assumed; no cited source"],
            ["Specific impulse $I_{sp}$", "350–800 s swept", "Design target, not demonstrated"],
            ["Lift-to-drag $L/D$", "2.5–5.0 swept", "Swept in sensitivity analysis"],
            ["Radiative heating", "0–35% of convective, swept", "Bounded placeholder (see below)"],
            ["MHD flight-packaging factor", "2–5× swept, 3× default", "Engineering assumption"],
          ]}
        />

        <Sub>Radiative heating</Sub>
        <P>
          {"V1's radiative-heating claim traces to [[TauberSutton1991]], which was read in full. V1 treated one exponent as the constant 1.072; for this nose radius the source actually defines it as a function of velocity and density, $a = 1.072\\times10^6\\,V^{-1.88}\\rho^{-0.325}$. More importantly, the correlation is validated only for 10 to 16 km/s and densities corresponding to about 54 to 72 km altitude, and does not cover a 30 km cruise at all. Extrapolated anyway, it gives about 4.7 MW/m² at Mach 30, less than V1's claimed 8 to 15 MW/m². Given how far outside its range that is, the paper does not adopt the number and keeps a bounded 0 to 35% of convective heating as a conservative placeholder."}
        </P>

        <Sub>Magnet mass from a real, tested coil</Sub>
        <Equation number={6} label="Magnet stored energy" tex={String.raw`E_{\text{mag}} = \frac{B^2}{2\mu_0}\,\pi r^2 L`}>
          <RichText>
            {"For $B = 2$ T, $r = 0.5$ m and $L = 3$ m this gives 3.75 MJ. V1 reported 7.5 MJ for identical inputs, an arithmetic error by exactly a factor of two."}
          </RichText>
        </Equation>
        <P>
          Converting energy to mass needs a specific energy, which V1 asserted without a traceable source. V2 instead uses the SPARC toroidal-field model coil, a physically tested high-field REBCO magnet that reached 20.1 T with a measured 10,058 kg coil mass and 110 MJ stored energy, giving 10.94 kJ/kg ([[SPARC-TFMC]]). Because that coil is a stationary reactor magnet, an explicit flight-packaging factor of 2 to 5× is applied for the cryostat, structure and power conditioning a flight system would need. Any reduction in heating from MHD flow control is not credited anywhere in the model.
        </P>

        <Sub>Verification protocol</Sub>
        <P>
          No equation entered the model until it passed three checks: its units reduce correctly, it behaves correctly in at least one physically required limiting case, and, where a benchmark existed, it matches an independently computed value. The checks are enforced as assertions in the model code. Uncertainty is propagated with a 20,000-sample sweep at each Mach number.
        </P>
        <PaperTable
          caption="Equation-by-equation disposition relative to V1."
          headers={["Equation", "V1 status", "V2 disposition"]}
          rows={[
            ["Ideal-gas stagnation temperature (Eq. 1)", "Verified correct", "Retained unchanged"],
            ["Sutton–Graves heat flux (Eq. 2)", "Constant unreproducible (≈1,400× off)", "Constant replaced with sourced NASA value"],
            ["Thermal stress (Eqs. 3–4)", "Dimensionally correct, ~10% numeric discrepancy in V1's worked example", "Form retained; usage inverted to solve for thickness"],
            ["Magnet stored energy (Eq. 6)", "Factor-of-2 arithmetic error", "Arithmetic corrected"],
            ["Magnet specific energy", "Asserted, untraced (5–10 kJ/kg)", "Derived from a real, tested magnet plus explicit packaging uncertainty"],
            ["TPS areal density", "Verified correct", "Retained unchanged"],
            ["Breguet range (Eq. 5)", "Dimensionally invalid, omits $V$", "Re-derived, velocity-explicit form"],
          ]}
        />
      </PaperSection>

      {/* 04 Results */}
      <PaperSection id="results" index="04" title="Results">
        <Sub>Heat flux, corrected</Sub>
        <P>
          At Mach 30, 30 km altitude and a 5 cm nose radius, Equation 2 gives a convective stagnation heat flux of 76.2 MW/m². That is roughly 70% higher than V1's 45 MW/m², and unlike V1's figure it is exactly reproducible from the stated formula and a publicly documented constant.
        </P>
        <PaperFigure figure={FIGURES.heatFlux} />

        <Sub>Allowed armor thickness falls as Mach rises</Sub>
        <P>
          Applying Equation 4, the thickest stress-tolerable armor falls steeply with Mach number. At Mach 8 to 10 it is well above the 6 mm reference thickness, so stress does not bind and 6 mm is used. By Mach 25 to 30 it is well under a millimetre. Thermal stress scales with heat flux, and heat flux scales with $V^3$, so the stress limit tightens far faster than any plausible minimum buildable thickness could be relaxed.
        </P>
        <Callout label="PRINCIPAL FINDING">
          Sizing the armor against a thermal-stress limit, instead of assuming its thickness, means the allowed thickness <em>falls</em> with increasing Mach number. This mechanism does not depend on the exact allowable-stress value; that value only decides where the mechanism stops producing a buildable design.
        </Callout>
        <PaperFigure figure={FIGURES.thickness} />
        <P>
          Revising the allowable stress exposed a modelling inconsistency the original 700 MPa placeholder had hidden. The model also imposes a 0.5 mm manufacturability floor. Under 700 MPa, the stress-safe maximum at Mach 30 (0.87 mm) stayed above that floor, so the two constraints never conflicted. Under 260 MPa it drops to 0.28 mm at Mach 30. The only "buildable" thickness there would carry 465 MPa against a 260 MPa allowable, a 79% overshoot. The original code silently clamped thickness to the floor in that case. V2 reports such cases as infeasible.
        </P>

        <Sub>How robust is a buildable design?</Sub>
        <P>
          At each Mach number, a 20,000-sample sweep over the uncertain inputs records what fraction of the swept parameter space gives a self-consistent design. This measures coverage of assumed input ranges, not the probability that such a vehicle would work.
        </P>
        <figure className="my-8 border border-line p-5 md:p-6" aria-labelledby="robustness-caption">
          <ul className="space-y-2">
            {ROBUSTNESS.map((r) => (
              <li key={r.mach} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3">
                <span className="font-mono text-xs text-white/50">Mach {r.mach}</span>
                <span className="h-2.5 bg-white/[0.06]" aria-hidden="true">
                  <span
                    className={`block h-full ${r.share >= 99 ? "bg-signal" : r.share >= 50 ? "bg-signal/60" : "bg-alert/60"}`}
                    style={{ width: `${r.share}%` }}
                  />
                </span>
                <span className="text-right font-mono text-xs text-white/70">{r.label}</span>
              </li>
            ))}
          </ul>
          <figcaption id="robustness-caption" className="mt-4 font-sans text-sm leading-relaxed text-white/45">
            Share of the swept 20,000-sample parameter space with a self-consistent design (0.5 mm floor). Values from the paper's feasibility sweep.
          </figcaption>
        </figure>
        <P>
          Mach 26 to 30, the regime the original form of this model identified as most favourable, is largely infeasible under this evidence. A high-confidence ceiling sits near Mach 21, and Mach 22 to 25 is an increasingly fragile transition zone.
        </P>
        <P>
          The 0.5 mm floor itself has no cited source, and the ceiling is sensitive to it: roughly four Mach numbers are lost for each extra 0.5 mm. Above 1.2 mm the model never reaches 99% self-consistency at any Mach number. The paper asks that every Mach ceiling be read against this table, not as a fixed value.
        </P>
        <PaperTable
          caption="Highest Mach number at which at least 99% or 50% of the swept parameter space yields a self-consistent design, for each assumed manufacturability floor. The 0.5 mm baseline (highlighted) is used throughout."
          headers={["Assumed floor", "≥ 99% self-consistent", "≥ 50% self-consistent"]}
          rows={[
            ["0.3 mm", "Mach 24", "Mach 29"],
            ["0.5 mm (baseline)", "Mach 21", "Mach 25"],
            ["0.8 mm", "Mach 18", "Mach 21"],
            ["1.0 mm", "Mach 16", "Mach 19"],
            ["1.2 mm", "Never reached", "Mach 18"],
            ["1.5 mm", "Never reached", "Mach 17"],
          ]}
          highlightRow={1}
        />
        <PaperFigure figure={FIGURES.floor} />
        <Callout label="REAL-WORLD PRECEDENT">
          <RichText>
            {"Qualified ITER/WEST tungsten plasma-facing armor is made as monoblocks 5.7 to 7.7 mm thick, bonded to an actively cooled CuCrZr heat-sink tube ([[Fukuda-2021,Richou-2021]]). That is more than 6× thicker than the thinnest self-consistent design in the high-confidence window (0.89 mm at Mach 21), and more than 11× thicker than the thinnest anywhere in the sweep (0.51 mm at Mach 25). It is also a different approach: a thick, actively cooled block rather than a thin unsupported tile."}
          </RichText>
        </Callout>

        <Sub>Mass budget and range</Sub>
        <P>
          Combining the stress-limited tungsten thickness with the fixed CFC and RAFM layers and the corrected magnet mass (3× packaging by default), the model computes the TPS mass fraction, the propellant fraction left over, and the range from Equation 5 at each Mach number. Three regimes emerge.
        </P>
        <div className="grid gap-4 md:grid-cols-3">
          {REGIMES.map((r) => (
            <div key={r.name} className={`border-t-2 ${r.tone} border-x border-b border-x-line border-b-line p-5`}>
              <p className="font-mono text-[11px] tracking-wide text-white/45">{r.range.toUpperCase()}</p>
              <h4 className="mt-2 font-display text-xl text-white">{r.name}</h4>
              <p className="mt-2 font-sans text-sm leading-relaxed text-white/55">{r.body}</p>
            </div>
          ))}
        </div>
        <PaperFigure figure={FIGURES.range} />
        <P>
          The nominal peak range has moved from Mach 30 (3,750 to 3,982 km under the original 700 MPa placeholder, itself already below V1's reported 4,760 km) to Mach 25 (3,312 km). Two changes drive this together, and neither explains it alone: an allowable stress about 2.7× lower than the placeholder, and the fix to the clamping bug that had let an unsafe thickness into the mass accounting.
        </P>

        <Sub>Uncertainty</Sub>
        <P>
          The Monte Carlo propagation samples specific impulse, lift-to-drag ratio, allowable stress, radiative fraction, magnet packaging factor, and CFC/RAFM thickness and density. Re-run at Mach 30 with the revised allowable stress, 98.7% of the sampled space has no self-consistent design at all. The few surviving cases are not representative and are shown only as a caution.
        </P>
        <P>
          The paper's primary uncertainty result is therefore at Mach 25: a median range of 3,663 km with a 5th to 95th percentile interval of 1,717 to 7,183 km, computed over the roughly half of sampled cases that have a valid design. That is a much weaker feasibility statement than the Mach 21 window, and the paper reports it as such.
        </P>
        <PaperFigure figure={FIGURES.monteCarlo} />
        <P>
          A one-at-a-time sensitivity analysis at Mach 24 shows specific impulse and lift-to-drag ratio as the dominant contributors by a wide margin. Allowable stress and radiative fraction now produce small, lopsided swings in which one extreme gives no valid design at all. Propulsion parameters, not materials, dominate the range uncertainty, but within a narrower and more fragile feasible envelope than previously reported.
        </P>
        <PaperFigure figure={FIGURES.tornado} />
      </PaperSection>

      {/* 05 Discussion */}
      <PaperSection id="discussion" index="05" title="Discussion">
        <Sub>What survives from V1</Sub>
        <P>
          The layered architecture survives: a high-temperature outer armor, an intermediate thermal and oxidation buffer, and a load-bearing substructure, each doing the job its properties suit. The stress-limited sizing independently arrives at a thin tile over structure, the same pattern real fusion plasma-facing components use for unrelated reasons (neutron flux and erosion life). The observation that no single fusion material solves the problem alone also survives.
        </P>

        <Sub>What does not</Sub>
        <P>
          V1's specific range figures cannot be treated as established. They came from an equation that would give the same output at any cruise Mach number, which is not physically possible for an air-breathing vehicle. V1's description of MHD flow control as "experimentally validated" at a specific test facility does not hold up against the traceable sources. V2 instead cites an open numerical study ([[MHD-arxiv]]) predicting MHD-induced shock-standoff increases of 8 to 140% at Mach 5.6. That is simulated, not experimentally confirmed, and whether it would reduce heat flux enough to matter at much higher Mach numbers is unresolved.
        </P>

        <Sub>The fusion pedigree does not transfer</Sub>
        <P>
          The properties the model actually uses are melting point, thermal conductivity, thermal-stress tolerance and oxidation behaviour. None of them depend on neutron flux. A hypersonic TPS sees thermal and mechanical cycling but no meaningful neutron exposure, so the neutron-embrittlement literature that dominates fusion materials research is close to irrelevant here. The accurate framing is not "proven by fusion service". Fusion research happens to have funded the best public data on a class of materials that would be useful here for unrelated reasons, and the neutron-service data should be set aside.
        </P>

        <Sub>Propulsion is a target, not a capability</Sub>
        <P>
          No air-breathing propulsion system has flown anywhere near the speeds where this model closes. GE Aerospace's rotating-detonation ramjet ground tests in September 2025 and January 2026 ([[GE-2025,GE-LM-2026]]) are genuine progress, but at undisclosed Mach numbers and far below the scale of a 50-tonne cruise vehicle. NASA's own overview states that air-breathing rotating-detonation engines remain at the simulation stage with no quantified specific-impulse advantage ([[NASA-RDE-2023]]), unlike the rocket-mode version, which has multi-minute hot-fire data ([[NASA-RDRE2023]]). The 350 to 800 s specific impulse the model needs is a design target.
        </P>
      </PaperSection>

      {/* 06 Limitations */}
      <PaperSection id="limitations" index="06" title="Limitations">
        <P>
          The paper catalogues seven limitations. For each, it states what is uncertain, whether that changes the conclusion, and what would resolve it.
        </P>
        <div className="space-y-4">
          {LIMITATIONS.map((l) => (
            <article key={l.id} className="border border-line p-5 md:p-6" aria-labelledby={`lim-${l.id}`}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-signal/60">{l.id}</span>
                <h3 id={`lim-${l.id}`} className="font-display text-xl text-white">
                  {l.title}
                </h3>
              </div>
              <p className="mt-3 font-sans text-sm leading-relaxed text-white/65">
                <RichText>{l.body}</RichText>
              </p>
              <p className="mt-3 border-t border-line pt-3 font-sans text-sm leading-relaxed text-white/50">
                <span className="font-mono text-[11px] tracking-wide text-white/40">EFFECT · </span>
                {l.effect}
              </p>
            </article>
          ))}
        </div>
        <PaperTable
          caption="Summary of confidence, downstream effect, and resolution path for each input."
          headers={["Item", "Confidence", "Feeds into", "Resolvable by"]}
          rows={[
            ["Sutton–Graves heat flux", "High (public, sourced constant)", "Everything downstream", "Resolved relative to V1"],
            ["Breguet range form", "High (re-derived, cross-checked)", "Range output", "Resolved relative to V1"],
            ["ODS-W allowable stress (L2)", "Low–medium (two open sources, one qualitative)", "Thickness, mass, range", "Temperature-resolved primary strength measurement"],
            ["Radiative heat-flux fraction (L1)", "Low (bounded, not computed)", "Thickness, mass, range", "Radiation-transport source verified at 30 km"],
            ["Thin ODS-W tile manufacturability (L3)", "Low (real analogue 6–11× thicker, itself not fully qualified)", "Entire feasibility conclusion", "Dedicated experimental study"],
            ["Manufacturability floor value (L2)", "Low (unsourced assumption)", "Feasible-Mach ceiling", "Sourced minimum-buildable-thickness figure"],
            ["MHD packaging factor (L4)", "Low (engineering judgement)", "Magnet mass, range (second order)", "Flight-magnet engineering estimate"],
            ["Vehicle geometry (L5)", "Inherited assumption", "Everything", "Dedicated vehicle-sizing study"],
            ["Transient thermal stress (L7)", "Not modelled (steady state only)", "Thickness", "Transient finite-element simulation"],
          ]}
        />
      </PaperSection>

      {/* 07 Conclusion */}
      <PaperSection id="conclusion" index="07" title="Conclusion">
        <P>
          Correcting V1's dimensional and evidentiary errors changes both the numbers and the shape of the argument. With velocity restored to the range equation, Mach number becomes a real design variable. Mass closure then depends on a specific, derivable structural regime, thin armor sized by thermal stress, rather than on "enough fusion material". For this vehicle at a constant 30 km cruise, that regime opens above roughly Mach 12, with a high-confidence ceiling near Mach 21 and a fragile, evidence-dependent extension to Mach 25.
        </P>
        <P>
          The revision to primary tensile data moved the result substantially. Under the 700 MPa placeholder, Mach 26 to 30 looked best, with range rising to 3,750 to 3,982 km at Mach 30. Under the 260 MPa evidence-based value, that regime is infeasible, and the revision also exposed a latent bug that had let the floor thickness violate the model's own stress limit. When better data arrived mid-project, the central quantitative claim moved, unfavourably, and the paper reports that in full.
        </P>
        <Callout label="WHAT THE PAPER DOES AND DOES NOT ESTABLISH">
          <p>
            It does not establish that Mach 25 cruise is achievable, let alone Mach 30. It establishes what would have to be true for even the narrower Mach 12 to 21 window to hold:
          </p>
          <ul className="mt-3 space-y-2 font-sans text-sm leading-relaxed text-white/70">
            <li>· ODS-W tiles manufacturable at a thinness and scale with no real-world precedent.</li>
            <li>· A temperature-resolved strength measurement for Y₂O₃-based ODS-W near 1,000 K, which was sought and not found, and which could move the allowable stress either way.</li>
            <li>· Propulsion and MHD performance that remains undemonstrated in the open literature.</li>
          </ul>
        </Callout>
      </PaperSection>

      {/* 08 References */}
      <PaperSection id="references" index="08" title="References">
        <PaperReferences />
      </PaperSection>
    </>
  );
}


function PaperReferences() {
  return (
    <ol className="space-y-3 font-sans text-sm leading-relaxed text-white/55">
      {REFERENCES.map((ref) => (
        <li key={ref.key} id={`ref-${ref.key}`} className="scroll-mt-8 border-l border-line pl-4 target:border-signal target:text-white/80">
          {ref.citation}{" "}
          {ref.url && (
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-mono text-xs text-signal/70 underline-offset-2 hover:text-signal hover:underline"
            >
              {ref.url.replace(/^https?:\/\//, "")}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}
