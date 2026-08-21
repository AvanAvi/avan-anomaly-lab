"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";
import * as THREE from "three";

// Roger Shawyer's EM Drive: a truncated cone cavity.
function EMDriveCone() {
  const coneRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (coneRef.current) {
      coneRef.current.rotation.y = time * 0.4;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 5) * 0.15;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh ref={coneRef} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.5, 3, 64, 1, false]} />
        <meshStandardMaterial
          color="#0f2b24"
          emissive="#6ee7c0"
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.4, 2.9, 64, 1, false]} />
        <meshBasicMaterial color="#9ffbdd" transparent opacity={0.2} side={THREE.BackSide} />
      </mesh>
      <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 64]} />
        <meshStandardMaterial color="#0f2b24" emissive="#6ee7c0" emissiveIntensity={1} metalness={0.3} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial color="#0f2b24" emissive="#6ee7c0" emissiveIntensity={1} metalness={0.3} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Microwave standing wave, drifting toward the small end.
function MicrowaveRings() {
  const rings = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rings.current) return;
    rings.current.children.forEach((ring, i) => {
      const offset = (state.clock.getElapsedTime() * 1.5 + i * 0.5) % 3;
      ring.position.y = -1.5 + offset;
      ring.scale.setScalar(0.8 + offset * 0.15);
      const material = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (material) material.opacity = Math.max(0, 0.55 - offset * 0.18);
    });
  });

  return (
    <group ref={rings}>
      {[...Array(6)].map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.025, 16, 64]} />
          <meshBasicMaterial color="#6ee7c0" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Thrust plume, only once the drive is producing force.
function ThrustPlume({ active }: { active: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 600;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.4;
      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = -1.5 - Math.random() * 5;
      pos[i3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (!particlesRef.current || !active) return;
    const arr = particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      arr[i3 + 1] -= 0.18;
      if (arr[i3 + 1] < -7) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.4;
        arr[i3] = Math.cos(angle) * radius;
        arr[i3 + 1] = -1.5;
        arr[i3 + 2] = Math.sin(angle) * radius;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef} visible={active}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#ffb000" transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

interface EMDriveTransitionProps {
  onComplete: () => void;
}

const STAGE_LABEL = ["Calibrating cavity", "Resonance building", "Thrust detected"];

export default function EMDriveTransition({ onComplete }: EMDriveTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(onComplete, 350);
      return () => clearTimeout(timer);
    }

    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1300),
      setTimeout(() => setFadeOut(true), 2100),
      setTimeout(() => onComplete(), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950">
        <p className="font-mono text-sm tracking-[0.2em] text-signal/70">ENTERING SCIENCE AND TECH</p>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[100] bg-ink-950 transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <div className="flex h-full flex-col lg:flex-row">
        <div className="relative h-1/2 w-full lg:h-full lg:w-3/5">
          <Canvas camera={{ position: [4, 1.5, 6], fov: 50 }}>
            <color attach="background" args={["#07090a"]} />
            <ambientLight intensity={0.35} />
            <pointLight position={[3, 4, 4]} intensity={1.4} color="#9ffbdd" />
            <pointLight position={[-3, -1, -3]} intensity={0.8} color="#6ee7c0" />
            <pointLight position={[0, -3, 3]} intensity={stage >= 2 ? 1.6 : 0.8} color={stage >= 2 ? "#ffb000" : "#6ee7c0"} />
            <EMDriveCone />
            <MicrowaveRings />
            <ThrustPlume active={stage >= 2} />
          </Canvas>
        </div>

        <div className="relative flex h-1/2 w-full flex-col justify-center px-8 lg:h-full lg:w-2/5 lg:px-12">
          <p className="font-mono text-xs tracking-[0.3em] text-signal/70">ANOMALY LAB · PROPULSION</p>
          <h1 className="mt-3 font-display text-3xl text-white md:text-4xl">
            {STAGE_LABEL[stage]}
            <span className="text-signal">.</span>
          </h1>

          {stage === 1 && (
            <div className="mt-6 max-w-xs">
              <div className="h-px w-full bg-line-strong">
                <motion.div
                  className="h-px bg-signal"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          <div className="mt-8 max-w-xs space-y-2 border border-line p-4 font-mono text-xs">
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-white/40">Frequency</span>
              <span className={stage >= 1 ? "text-signal" : "text-white/20"}>2.45 GHz</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-white/40">Cavity Q</span>
              <span className={stage >= 1 ? "text-signal" : "text-white/20"}>50,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Thrust</span>
              <span className={stage >= 2 ? "font-medium text-terminal-amber" : "text-white/20"}>
                {stage >= 2 ? "750 mN" : "---"}
              </span>
            </div>
          </div>

          {stage >= 2 && (
            <p className="mt-6 max-w-xs font-mono text-xs text-terminal-amber/80">
              Newton disagrees. Conservation of momentum, technically violated.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
