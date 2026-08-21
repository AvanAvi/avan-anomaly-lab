"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

// Rings receding into the distance: falling into the abyss of doubt.
function AbyssTunnel({ speed }: { speed: number }) {
  const tunnelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!tunnelRef.current) return;
    tunnelRef.current.rotation.z = state.clock.getElapsedTime() * 0.25;
    tunnelRef.current.children.forEach((ring) => {
      ring.position.z += speed;
      if (ring.position.z > 5) ring.position.z = -40;
    });
  });

  return (
    <group ref={tunnelRef}>
      {[...Array(18)].map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 2.2 - 5]} rotation={[0, 0, (i * Math.PI) / 15]}>
          <torusGeometry args={[6 + i * 0.4, 0.1, 16, 32]} />
          <meshBasicMaterial color="#6ee7c0" transparent opacity={Math.max(0, 0.5 - i * 0.02)} />
        </mesh>
      ))}
    </group>
  );
}

interface PhilosophyTransitionProps {
  onComplete: () => void;
}

export default function PhilosophyTransition({ onComplete }: PhilosophyTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(onComplete, 350);
      return () => clearTimeout(timer);
    }

    const timers = [
      setTimeout(() => setStage(1), 600),
      setTimeout(() => setStage(2), 1400),
      setTimeout(() => setFadeOut(true), 2200),
      setTimeout(() => onComplete(), 2600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
        <p className="font-mono text-sm tracking-[0.2em] text-signal/70">ENTERING THE INSTITUTE</p>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[100] bg-black transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 85 }}>
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 10, 80]} />
          <ambientLight intensity={0.15} />
          <pointLight position={[0, 0, 0]} intensity={1.5} color="#6ee7c0" />
          <AbyssTunnel speed={stage >= 2 ? 0.22 : 0.1} />
        </Canvas>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 0%, transparent 35%, rgba(0,0,0,0.85) 100%)" }}
      />

      <div className="relative z-10 flex h-full items-center justify-center px-8">
        <div className="max-w-2xl text-center">
          {stage < 2 ? (
            <>
              <h1 className="font-display text-4xl italic text-white md:text-5xl">
                {stage === 0 ? "Falling into doubt" : "Questioning everything"}
              </h1>
              <p className="mt-4 font-mono text-xs tracking-[0.2em] text-signal/50">
                DEPTH: {stage === 0 ? "UNKNOWN" : "INCREASING"}
              </p>
            </>
          ) : (
            <>
              <p className="font-mono text-xs tracking-[0.3em] text-signal/70">PHILOSOPHY</p>
              <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">
                The Anomaly <span className="italic text-signal">Institute</span>
              </h1>
              <p className="mt-4 font-sans text-sm text-white/50">
                Questioning everything, answering nothing.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
