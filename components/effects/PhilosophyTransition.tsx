"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Tunnel/Abyss effect - Falling infinitely
function AbyssTunnel({ stage }: { stage: number }) {
  const tunnelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (tunnelRef.current) {
      // Rotate the entire tunnel
      tunnelRef.current.rotation.z = state.clock.getElapsedTime() * 0.3;
      
      // Move rings forward to create infinite falling effect
      tunnelRef.current.children.forEach((ring, i) => {
        ring.position.z += (stage >= 2 ? 0.15 : 0.08);
        
        // Reset ring when it gets too close
        if (ring.position.z > 5) {
          ring.position.z = -50;
        }
        
        // Pulse effect
        const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2 + i) * 0.1;
        ring.scale.setScalar(scale);
      });
    }
  });

  return (
    <group ref={tunnelRef}>
      {[...Array(30)].map((_, i) => (
        <mesh
          key={i}
          position={[0, 0, -i * 2 - 5]}
          rotation={[0, 0, (i * Math.PI) / 15]}
        >
          <torusGeometry args={[8 + i * 0.5, 0.15, 16, 32]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#ff006e" : "#8338ec"}
            transparent
            opacity={0.6 - i * 0.015}
          />
        </mesh>
      ))}
    </group>
  );
}

// Corner Vortex Particles - Sucking into corners
function CornerVortex({ stage }: { stage: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 3000;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Start particles spread across screen
      pos[i3] = (Math.random() - 0.5) * 50;
      pos[i3 + 1] = (Math.random() - 0.5) * 40;
      pos[i3 + 2] = Math.random() * -100;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.getElapsedTime();
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Move towards center and back (falling effect)
        positions[i3 + 2] += (stage >= 2 ? 0.3 : 0.15);
        
        // Spiral inward
        const angle = time + i * 0.01;
        const radius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2);
        const newRadius = radius * 0.99; // Gradually pull inward
        
        positions[i3] = Math.cos(angle) * newRadius;
        positions[i3 + 1] = Math.sin(angle) * newRadius;
        
        // Reset when too close
        if (positions[i3 + 2] > 10) {
          positions[i3] = (Math.random() - 0.5) * 50;
          positions[i3 + 1] = (Math.random() - 0.5) * 40;
          positions[i3 + 2] = -100;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ff006e"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Question marks floating and being sucked in
function FloatingQuestions({ stage }: { stage: number }) {
  const questionsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (questionsRef.current && stage >= 1) {
      questionsRef.current.children.forEach((q, i) => {
        // Move forward (being sucked into abyss)
        q.position.z += (stage >= 3 ? 0.2 : 0.1);
        
        // Rotate
        q.rotation.x = state.clock.getElapsedTime() * (1 + i * 0.1);
        q.rotation.y = state.clock.getElapsedTime() * (0.5 + i * 0.05);
        
        // Reset when too close
        if (q.position.z > 5) {
          q.position.z = -30;
        }
      });
    }
  });

  if (stage < 1) return null;

  return (
    <group ref={questionsRef}>
      {[...Array(20)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 15,
            -Math.random() * 30 - 5,
          ]}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#ff006e" : "#8338ec"}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

interface PhilosophyTransitionProps {
  onComplete: () => void;
}

export default function PhilosophyTransition({ onComplete }: PhilosophyTransitionProps) {
  const [stage, setStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 1500);
    const timer2 = setTimeout(() => setStage(2), 3500);
    const timer3 = setTimeout(() => setStage(3), 5000);
    const timer4 = setTimeout(() => setFadeOut(true), 7500);
    const timer5 = setTimeout(() => onComplete(), 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Pure black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* 3D Abyss Scene - FULL SCREEN */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 90 }}>
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 10, 100]} />
          
          <AbyssTunnel stage={stage} />
          <CornerVortex stage={stage} />
          <FloatingQuestions stage={stage} />
          
          {/* Ambient lighting for depth */}
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 0, 0]} intensity={2} color="#ff006e" />
        </Canvas>
      </div>

      {/* Corner Vignette - Dark edges to enhance abyss */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Text Overlay - Clean and Centered */}
      <div className="relative z-10 flex h-full items-center justify-center px-8">
        <div className="max-w-4xl text-center">
          
          {/* Main Message */}
          <h1
            className="font-mono text-5xl font-bold mb-8 transition-all duration-500 md:text-7xl text-neon-pink bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-neon-pink/30"
          >
            {stage === 0 && "FALLING INTO THE VOID..."}
            {stage === 1 && "DESCENDING INTO DOUBT..."}
            {stage === 2 && "NOTHING MATTERS..."}
            {stage === 3 && "...BUT THIS SCHOOL DOES"}
          </h1>

          {/* Sub-messages */}
          {stage >= 1 && stage < 3 && (
            <div className="space-y-4 font-mono text-lg bg-black/50 backdrop-blur-sm rounded-lg p-4">
              <p className="text-neon-pink animate-pulse">
                ∞ The abyss stares back, and it looks bored ∞
              </p>
              {stage >= 2 && (
                <>
                  <p className="text-purple-400 animate-pulse">
                    ∞ Free will is just a bug we call a feature ∞
                  </p>
                  <p className="text-neon-pink animate-pulse">
                    ∞ We're all just NPCs in someone's simulation ∞
                  </p>
                </>
              )}
            </div>
          )}

          {/* Final Stage */}
          {stage >= 3 && (
            <div className="space-y-6">
              <p className="font-mono text-3xl text-terminal-amber animate-pulse">
                🏛️ WELCOME TO THE SCHOOL 🏛️
              </p>
              <p className="font-mono text-xl text-terminal-green/80">
                Where Dead Philosophers Mock Your Existence
              </p>
            </div>
          )}

          {/* Depth indicator */}
          <div className="mt-12 font-mono text-xs text-neon-pink/30">
            <p>DEPTH: {stage === 0 ? '∞' : stage === 1 ? '∞∞' : stage === 2 ? '∞∞∞' : 'BOTTOMLESS'}</p>
            <p>SANITY: {stage >= 2 ? 'COMPROMISED' : 'DETERIORATING'}</p>
             {/* Final Stage - BIG BLAST */}
{stage >= 3 && (
  <div className="space-y-8 animate-fadeIn">
    {/* Main Title - HUGE with better contrast */}
    <h2 
      className="font-mono text-6xl font-bold text-white md:text-8xl lg:text-9xl"
      style={{
        textShadow: '0 0 60px #ff006e, 0 0 120px #ff006e, 0 0 180px #8338ec, 4px 4px 0px #ff006e',
        animation: 'glitch 0.3s infinite',
        letterSpacing: '0.1em',
      }}
    >
      THE ANOMALY
    </h2>
    <h2 
      className="font-mono text-6xl font-bold text-white md:text-8xl lg:text-9xl"
      style={{
        textShadow: '0 0 60px #ffb000, 0 0 120px #ffb000, 4px 4px 0px #ffb000',
        animation: 'glitch 0.4s infinite',
        letterSpacing: '0.1em',
      }}
    >
      INSTITUTE
    </h2>
    
    {/* Tagline - White on dark for readability */}
    <div className="mt-12 space-y-3 border-y border-neon-cyan/30 py-6">
      <p className="font-mono text-2xl text-white md:text-3xl lg:text-4xl">
        <span className="text-neon-cyan text-5xl">"</span>
        <span className="text-terminal-green">Questioning Everything,</span>
        <span className="text-neon-cyan text-5xl">"</span>
      </p>
      <p className="font-mono text-2xl text-white md:text-3xl lg:text-4xl">
        <span className="text-neon-cyan text-5xl">"</span>
        <span className="text-terminal-green">Answering Nothing</span>
        <span className="text-neon-cyan text-5xl">"</span>
      </p>
    </div>

    {/* Subtitle - Better contrast */}
    <p className="mt-8 font-mono text-xl text-terminal-amber md:text-2xl animate-pulse">
      Where Dead Philosophers Roast the Living
    </p>

    {/* Decorative elements */}
    <div className="mt-8 flex items-center justify-center gap-4">
      <div className="h-px w-20 bg-gradient-to-r from-transparent via-neon-pink to-transparent" />
      <span className="font-mono text-3xl text-neon-pink">⚡</span>
      <div className="h-px w-20 bg-gradient-to-r from-transparent via-neon-pink to-transparent" />
    </div>

    {/* Loading hint */}
    <p className="mt-6 font-mono text-sm text-neon-cyan/60 animate-pulse">
      Entering the hallway...
    </p>
  </div>
)}
          </div>
        </div>
      </div>

      {/* Scanline glitch overlay */}
      {stage >= 2 && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(255, 0, 110, 0.1) 0px, transparent 2px, transparent 4px, rgba(255, 0, 110, 0.1) 4px)',
            animation: 'scan 8s linear infinite',
          }}
        />
      )}
    </div>
  );
}