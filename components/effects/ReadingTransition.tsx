"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { Book, BookOpen, BookMarked, Library } from "lucide-react";

// Books spiraling inward toward the shelf.
function FlyingBooks({ speed }: { speed: number }) {
  const booksRef = useRef<THREE.Points>(null);
  const particleCount = 80;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 16 + Math.random() * 8;
      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = (Math.random() - 0.5) * 24;
      pos[i3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!booksRef.current) return;
    const arr = booksRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const currentRadius = Math.sqrt(arr[i3] ** 2 + arr[i3 + 2] ** 2);
      const angle = Math.atan2(arr[i3 + 2], arr[i3]) + speed;
      const newRadius = currentRadius * 0.985;
      arr[i3] = Math.cos(angle) * newRadius;
      arr[i3 + 2] = Math.sin(angle) * newRadius;
      arr[i3 + 1] += Math.sin(time * 2 + i) * 0.015;

      if (currentRadius < 2) {
        const resetAngle = (i / particleCount) * Math.PI * 2;
        const resetRadius = 16 + Math.random() * 8;
        arr[i3] = Math.cos(resetAngle) * resetRadius;
        arr[i3 + 2] = Math.sin(resetAngle) * resetRadius;
      }
    }
    booksRef.current.geometry.attributes.position.needsUpdate = true;
    booksRef.current.rotation.y = time * 0.2;
  });

  return (
    <points ref={booksRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.25} color="#ffb000" transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

const BOOK_ICONS = [Book, BookOpen, BookMarked, Library];

interface ReadingTransitionProps {
  onComplete: () => void;
}

export default function ReadingTransition({ onComplete }: ReadingTransitionProps) {
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
      setTimeout(() => setFadeOut(true), 2000),
      setTimeout(() => onComplete(), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950">
        <p className="font-mono text-sm tracking-[0.2em] text-terminal-amber/70">ENTERING THE LIBRARY</p>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[100] bg-ink-950 transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <color attach="background" args={["#07090a"]} />
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={1.8} color="#ffb000" />
          <FlyingBooks speed={stage >= 2 ? 0.05 : 0.02} />
        </Canvas>
      </div>

      {stage >= 1 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => {
            const Icon = BOOK_ICONS[i % BOOK_ICONS.length];
            return (
              <div
                key={i}
                className="absolute h-6 w-6 text-terminal-amber/50"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 53) % 100}%`,
                  animation: `floatToCenter ${2.5 + (i % 3) * 0.4}s ease-in-out ${i * 0.06}s forwards`,
                }}
              >
                <Icon className="h-full w-full" />
              </div>
            );
          })}
        </div>
      )}

      <div className="relative z-10 flex h-full items-center justify-center px-8">
        <div className="max-w-xl text-center">
          {stage < 2 ? (
            <h1 className="font-display text-4xl italic text-white md:text-5xl">
              {stage === 0 ? "Opening the vault" : "Books converging"}
            </h1>
          ) : (
            <>
              <p className="font-mono text-xs tracking-[0.3em] text-terminal-amber/70">LIBRARY</p>
              <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">
                The <span className="italic text-terminal-amber">Library</span>
              </h1>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
