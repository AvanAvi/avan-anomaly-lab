"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/**
 * A small operating scientific instrument for the hero frame: a stylized
 * tokamak, plasma confined in a toroidal magnetic field. Physically
 * inspired, not physically accurate. Every layer (plasma, field lines,
 * particles, camera) moves at its own tempo so the whole thing reads as
 * a system rather than a single spinning mesh.
 *
 * Architecture, matching the request's shape:
 *   TokamakSimulation          canvas, WebGL guard, visibility/reduced-motion gating
 *     Scene                    lighting, camera rig, composition
 *       ReactorStructure       outer rail, vessel wall, magnetic coils
 *       Plasma                 shader-driven toroidal plasma volume
 *       FieldLines             helical field trajectories
 *       ParticleField          particles circulating along field-inspired paths
 *       CameraRig              elevated three-quarter view, drift, parallax
 */

const MAJOR_RADIUS = 1.6;
const MINOR_RADIUS = 0.55;

const COLOR_STRUCTURE = "#7d8888";
const COLOR_STRUCTURE_DIM = "#293436";
const COLOR_VESSEL = "#3a4448";
const COLOR_SIGNAL = "#6ee7c0";
const COLOR_SIGNAL_BRIGHT = "#9ffbdd";

/* ------------------------------------------------------------------ */
/* WebGL support check, done once, no probing on every render.        */
/* ------------------------------------------------------------------ */
function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Plasma shader: layered filament noise confined to the tube cross   */
/* section, not a solid glowing donut.                                */
/* ------------------------------------------------------------------ */
const PLASMA_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const PLASMA_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColorCore;
  uniform vec3 uColorEdge;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    float theta = vUv.x;
    float phi = vUv.y;

    // Filaments circulating toroidally, drifting slowly over time. A steep
    // smoothstep keeps this as distinct bright strands on a dim field
    // rather than a uniform wash.
    float flow = theta * 10.0 - uTime * 0.55;
    float filament = smoothstep(0.5, 0.98, noise(vec2(flow, phi * 7.0 + uTime * 0.12)));

    // Finer turbulence layered on top, controlled rather than chaotic.
    float turbulence = noise(vec2(theta * 26.0 - uTime * 0.3, phi * 14.0 + uTime * 0.2));

    // Confinement falloff across the tube cross section: brightest at the
    // center, fading toward the seam, so this reads as a bounded volume
    // rather than a solid filled donut.
    float edge = sin(phi * 3.14159265);
    float confinement = smoothstep(0.15, 0.6, edge);

    // A brighter core toward the inner-facing arc of the tube.
    float core = smoothstep(0.8, 1.0, edge) * 0.35;

    float intensity = (0.1 + filament * 0.6 + turbulence * 0.12 + core) * confinement * uIntensity;
    intensity = clamp(intensity, 0.0, 0.85);
    vec3 color = mix(uColorEdge, uColorCore, clamp(filament + core, 0.0, 1.0));

    gl_FragColor = vec4(color * intensity, intensity * 0.85);
  }
`;

/* ------------------------------------------------------------------ */
/* Field line geometry: helical trajectories that wind poloidally as   */
/* they travel toroidally, the way a confining field actually would.  */
/* ------------------------------------------------------------------ */
function fieldLineCurve(windings: number, phase: number, wobble: number) {
  const segments = 160;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const phi = theta * windings + phase;
    const r = MAJOR_RADIUS + MINOR_RADIUS * wobble * Math.cos(phi);
    const y = MINOR_RADIUS * wobble * Math.sin(phi);
    points.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
  }
  return new THREE.CatmullRomCurve3(points, true);
}

interface FieldLinesProps {
  count: number;
  reducedMotion: boolean;
}

function FieldLines({ count, reducedMotion }: FieldLinesProps) {
  const materials = useRef<THREE.MeshBasicMaterial[]>([]);

  const lines = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const windings = 3 + (i % 3);
      const phase = (i / count) * Math.PI * 2;
      const wobble = 0.85 + i * 0.02;
      const curve = fieldLineCurve(windings, phase, wobble);
      const geometry = new THREE.TubeGeometry(curve, 200, 0.006 + (i % 2) * 0.004, 6, true);
      const bright = i % 2 === 0;
      return { geometry, bright, baseOpacity: bright ? 0.22 : 0.09 };
    });
  }, [count]);

  useEffect(() => () => lines.forEach((l) => l.geometry.dispose()), [lines]);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.getElapsedTime();
    materials.current.forEach((mat, i) => {
      if (!mat) return;
      const breathe = 0.5 + 0.5 * Math.sin(t * (Math.PI * 2) / 13 + i * 1.7);
      mat.opacity = lines[i].baseOpacity * (0.6 + breathe * 0.4);
    });
  });

  return (
    <group>
      {lines.map((line, i) => (
        <mesh key={i} geometry={line.geometry}>
          <meshBasicMaterial
            ref={(m) => {
              if (m) materials.current[i] = m;
            }}
            color={line.bright ? COLOR_SIGNAL_BRIGHT : COLOR_SIGNAL}
            transparent
            opacity={line.baseOpacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Reactor structure: outer rail, vessel wall, magnetic coils.         */
/* ------------------------------------------------------------------ */
function ReactorStructure({ coilCount }: { coilCount: number }) {
  const coilAngles = useMemo(
    () => Array.from({ length: coilCount }, (_, i) => (i / coilCount) * Math.PI * 2),
    [coilCount]
  );

  return (
    <group>
      {/* Outer structural rail, mostly for silhouette and scale. Fully
          matte, kept well outside the coils so it doesn't compete. */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[MAJOR_RADIUS * 1.7, 0.014, 8, 64]} />
        <meshStandardMaterial color={COLOR_STRUCTURE_DIM} metalness={0} roughness={1} />
      </mesh>

      {/* Vessel wall containing the plasma, kept low opacity so the plasma reads through it */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[MAJOR_RADIUS, MINOR_RADIUS * 1.2, 12, 64]} />
        <meshStandardMaterial
          color={COLOR_VESSEL}
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Magnetic coils: D-shaped hoops evenly spaced around the toroidal
          direction. Fully matte (no metalness) so they read as calm
          structural hoops rather than picking up sharp specular streaks
          from the point lights, which is what made an early pass look
          like a tangled thread ball instead of an engineered structure. */}
      {coilAngles.map((theta, i) => (
        <group key={i} rotation={[0, theta, 0]}>
          <mesh position={[MAJOR_RADIUS, 0, 0]}>
            <torusGeometry args={[MINOR_RADIUS * 1.05, 0.018, 8, 24]} />
            <meshStandardMaterial
              color={COLOR_STRUCTURE}
              metalness={0}
              roughness={0.95}
              emissive={COLOR_SIGNAL}
              emissiveIntensity={0.035}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Plasma: shader-driven toroidal volume.                              */
/* ------------------------------------------------------------------ */
function Plasma({ reducedMotion }: { reducedMotion: boolean }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0 },
          uColorCore: { value: new THREE.Color(COLOR_SIGNAL_BRIGHT) },
          uColorEdge: { value: new THREE.Color(COLOR_SIGNAL) },
        },
        vertexShader: PLASMA_VERTEX,
        fragmentShader: PLASMA_FRAGMENT,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    // Staggered ignition: the plasma is the last layer to reach full intensity.
    const ignition = THREE.MathUtils.smoothstep(elapsed, 0.6, 1.6);
    material.uniforms.uTime.value = reducedMotion ? 2.0 : elapsed;
    material.uniforms.uIntensity.value = reducedMotion ? 1 : ignition;
  });

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} material={material}>
      <torusGeometry args={[MAJOR_RADIUS, MINOR_RADIUS * 0.72, 48, 128]} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Particles: circulate along toroidal paths near the plasma surface,  */
/* not free-floating.                                                  */
/* ------------------------------------------------------------------ */
function ParticleField({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, theta0, phiOffset, speed, radiusJitter } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const theta0 = new Float32Array(count);
    const phiOffset = new Float32Array(count);
    const speed = new Float32Array(count);
    const radiusJitter = new Float32Array(count);

    const core = new THREE.Color(COLOR_SIGNAL_BRIGHT);
    const edge = new THREE.Color(COLOR_SIGNAL);

    for (let i = 0; i < count; i++) {
      theta0[i] = Math.random() * Math.PI * 2;
      phiOffset[i] = Math.random() * Math.PI * 2;
      speed[i] = 0.05 + Math.random() * 0.1;
      radiusJitter[i] = 0.55 + Math.random() * 0.4;

      const r = MAJOR_RADIUS + MINOR_RADIUS * radiusJitter[i] * Math.cos(phiOffset[i]);
      const y = MINOR_RADIUS * radiusJitter[i] * Math.sin(phiOffset[i]);
      positions[i * 3] = r * Math.cos(theta0[i]);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = r * Math.sin(theta0[i]);

      const mixed = core.clone().lerp(edge, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    return { positions, colors, theta0, phiOffset, speed, radiusJitter };
  }, [count]);

  useFrame((state) => {
    if (reducedMotion || !pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const theta = theta0[i] + t * speed[i];
      const phi = phiOffset[i] + Math.sin(theta * 2 + t * 0.3) * 0.15;
      const r = MAJOR_RADIUS + MINOR_RADIUS * radiusJitter[i] * Math.cos(phi);
      const y = MINOR_RADIUS * radiusJitter[i] * Math.sin(phi);
      arr[i * 3] = r * Math.cos(theta);
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = r * Math.sin(theta);
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Camera rig: stable elevated three-quarter view with slow drift and  */
/* a small parallax response to the cursor.                            */
/* ------------------------------------------------------------------ */
function CameraRig({ hoverRef, reducedMotion }: { hoverRef: React.MutableRefObject<boolean>; reducedMotion: boolean }) {
  const { camera, pointer } = useThree();
  const basePos = useMemo(() => new THREE.Vector3(3.1, 1.85, 3.4), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const driftX = reducedMotion ? 0 : Math.sin(t * 0.025) * 0.15;
    const driftY = reducedMotion ? 0 : Math.cos(t * 0.018) * 0.08;
    const parallaxX = reducedMotion ? 0 : pointer.x * 0.22;
    const parallaxY = reducedMotion ? 0 : pointer.y * 0.12;
    const hoverBoost = hoverRef.current ? 0.06 : 0;

    const targetX = basePos.x + driftX + parallaxX;
    const targetY = basePos.y + driftY + parallaxY + hoverBoost;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, reducedMotion ? 1 : 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, reducedMotion ? 1 : 0.03);
    camera.position.z = basePos.z;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* Scene: composition, lighting, slow reactor drift.                   */
/* ------------------------------------------------------------------ */
function Scene({
  detail,
  reducedMotion,
  hoverRef,
}: {
  detail: { coils: number; fieldLines: number; particles: number };
  reducedMotion: boolean;
  hoverRef: React.MutableRefObject<boolean>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Barely perceptible drift, on a much slower cycle than anything else
    // in the scene, so the reactor itself reads as stable.
    groupRef.current.rotation.y = Math.sin((t * Math.PI * 2) / 50) * 0.025;
  });

  return (
    <>
      <color attach="background" args={["#050708"]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 3, 3]} intensity={0.35} color={COLOR_SIGNAL_BRIGHT} />
      <pointLight position={[-3, -2, -2]} intensity={0.2} color={COLOR_SIGNAL} />

      <CameraRig hoverRef={hoverRef} reducedMotion={reducedMotion} />

      <group ref={groupRef}>
        <ReactorStructure coilCount={detail.coils} />
        <FieldLines count={detail.fieldLines} reducedMotion={reducedMotion} />
        <Plasma reducedMotion={reducedMotion} />
        <ParticleField count={detail.particles} reducedMotion={reducedMotion} />
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Static fallback for browsers without WebGL: same visual language,   */
/* no canvas.                                                          */
/* ------------------------------------------------------------------ */
function StaticFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050708]">
      <svg viewBox="0 0 200 200" className="h-2/3 w-2/3 max-w-[280px]" aria-hidden="true">
        <ellipse cx="100" cy="100" rx="80" ry="34" fill="none" stroke="#293436" strokeWidth="1.5" />
        <ellipse cx="100" cy="100" rx="56" ry="22" fill="none" stroke="#6ee7c0" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx="100" cy="100" rx="56" ry="22" fill="none" stroke="#9ffbdd" strokeWidth="3" opacity="0.35" />
        {[0, 45, 90, 135].map((deg) => (
          <ellipse
            key={deg}
            cx="100"
            cy="100"
            rx="10"
            ry="34"
            fill="none"
            stroke="#7d8888"
            strokeWidth="1"
            opacity="0.5"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Top level: WebGL guard, visibility gating, responsive detail.       */
/* ------------------------------------------------------------------ */
export default function TokamakSimulation() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);

  const [webglOK, setWebglOK] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [inView, setInView] = useState(true);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    setWebglOK(supportsWebGL());
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onVisibility = () => setInView((prev) => (document.hidden ? false : prev || !document.hidden));
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const detail = isCompact
    ? { coils: 4, fieldLines: 3, particles: 110 }
    : { coils: 6, fieldLines: 4, particles: 260 };

  const reducedMotion = !!prefersReducedMotion;
  const active = inView && !document.hidden;

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      onPointerEnter={() => (hoverRef.current = true)}
      onPointerLeave={() => (hoverRef.current = false)}
    >
      {webglOK && !contextLost ? (
        <Canvas
          camera={{ position: [3.1, 1.85, 3.4], fov: 42 }}
          dpr={isCompact ? [1, 1.5] : [1, 2]}
          frameloop={active ? "always" : "never"}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            // A lost context (GPU reset, too many concurrent WebGL
            // surfaces, a backgrounded mobile tab) should fall back to the
            // static diagram rather than leave a permanently blank frame.
            // preventDefault signals the browser it's safe to restore it.
            const canvas = gl.domElement;
            const onLost = (e: Event) => {
              e.preventDefault();
              setContextLost(true);
            };
            const onRestored = () => setContextLost(false);
            canvas.addEventListener("webglcontextlost", onLost);
            canvas.addEventListener("webglcontextrestored", onRestored);
          }}
        >
          <Scene detail={detail} reducedMotion={reducedMotion} hoverRef={hoverRef} />
        </Canvas>
      ) : (
        <StaticFallback />
      )}
    </div>
  );
}
