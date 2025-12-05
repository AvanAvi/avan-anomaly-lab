"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

// Roger Shawyer's EM Drive - Truncated Cone Design
function EMDriveCone() {
  const coneRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (coneRef.current) {
      coneRef.current.rotation.y = time * 0.3;
      coneRef.current.position.y = Math.sin(time * 10) * 0.01;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 5) * 0.2;
      glowRef.current.scale.setScalar(pulse);
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity = 0.3 + Math.sin(time * 5) * 0.15;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Main EM Drive Cone */}
      <mesh ref={coneRef} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.5, 3, 64, 1, false]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.8}
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.4, 2.9, 64, 1, false]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Small end cap */}
      <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 64]} />
        <meshStandardMaterial
          color="#00a8cc"
          emissive="#00d4ff"
          emissiveIntensity={1.5}
          metalness={1}
          roughness={0}
        />
      </mesh>
      
      {/* Large end cap */}
      <mesh position={[0, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial
          color="#00a8cc"
          emissive="#00d4ff"
          emissiveIntensity={1.5}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Microwave cavity wireframe */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 2.8, 32, 1, true]} />
        <meshBasicMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

// Electromagnetic wave rings
function MicrowaveRings() {
  const rings = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rings.current) {
      rings.current.children.forEach((ring, i) => {
        const offset = (state.clock.getElapsedTime() * 1.5 + i * 0.4) % 3;
        ring.position.y = -1.5 + offset;
        ring.scale.setScalar(0.8 + offset * 0.15);
        const material = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (material) {
          material.opacity = Math.max(0, 0.6 - offset * 0.2);
        }
      });
    }
  });

  return (
    <group ref={rings}>
      {[...Array(10)].map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.03, 16, 64]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Thrust particles
function ThrustParticles({ stage }: { stage: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 1500;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.4;
      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = -1.5 - Math.random() * 8;
      pos[i3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (particlesRef.current && stage >= 2) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const speed = stage >= 3 ? 0.15 : 0.08;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] -= speed;
        
        if (positions[i3 + 1] < -12) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 0.4;
          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 1] = -1.5;
          positions[i3 + 2] = Math.sin(angle) * radius;
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
        size={0.04}
        color={stage >= 3 ? "#ffaa00" : "#00ffff"}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Thrust force cone
function ThrustForce({ stage }: { stage: number }) {
  const coneRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coneRef.current && stage >= 2) {
      const intensity = stage >= 3 ? 1.5 : 1;
      coneRef.current.scale.y = (1 + Math.sin(state.clock.getElapsedTime() * 8) * 0.2) * intensity;
    }
  });

  if (stage < 2) return null;

  return (
    <mesh ref={coneRef} position={[0, -3, 0]} rotation={[0, 0, 0]}>
      <coneGeometry args={[1.2, 4, 32]} />
      <meshBasicMaterial
        color={stage >= 3 ? "#ffaa00" : "#00d4ff"}
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface EMDriveTransitionProps {
  onComplete: () => void;
}

export default function EMDriveTransition({ onComplete }: EMDriveTransitionProps) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Stage 0: Initializing (2s)
    const timer1 = setTimeout(() => setStage(1), 2000);
    
    // Stage 1: Loading propulsion (5s with progress)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setStage(2), 500);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    // Stage 2: Thrust detected (7.5s)
    const timer3 = setTimeout(() => setStage(3), 7500);
    
    // Stage 3: Full thrust display (20s)
    const timer4 = setTimeout(() => setFadeOut(true), 11000);
    
    // Complete transition (13.5s total)
    const timer5 = setTimeout(() => onComplete(), 11500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-dark-900 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Split Layout: 3D on Left, Data on Right */}
      <div className="flex h-full">
        
        {/* LEFT: 3D Visualization */}
        <div className="relative w-full lg:w-3/5 h-full">
          <Canvas camera={{ position: [4, 2, 6], fov: 50 }}>
            <color attach="background" args={["#0a0e27"]} />
            <ambientLight intensity={0.4} />
            <pointLight position={[0, 5, 5]} intensity={1.5} color="#00d4ff" />
            <pointLight position={[0, -3, 3]} intensity={stage >= 3 ? 2 : 1} color={stage >= 3 ? "#ffaa00" : "#00d4ff"} />
            <spotLight position={[5, 5, 5]} angle={0.3} intensity={1} color="#00ffff" />
            
            <EMDriveCone />
            <MicrowaveRings />
            <ThrustParticles stage={stage} />
            <ThrustForce stage={stage} />
            
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            <Environment preset="night" />
          </Canvas>

          {/* 3D Label */}
          <div className="absolute bottom-8 left-8">
            <div className="border border-neon-cyan/30 bg-dark-900/80 px-4 py-2 backdrop-blur-sm">
              <p className="font-mono text-xs text-neon-cyan/60">3D VISUALIZATION</p>
              <p className="font-mono text-sm text-neon-cyan">Roger Shawyer EM Drive</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Telemetry & Status */}
        <div className="relative w-full lg:w-2/5 h-full flex flex-col justify-center px-8 lg:px-12 bg-gradient-to-br from-dark-900 to-dark-800">
          
          {/* Mission Control Header */}
          <div className="mb-8 border-l-4 border-neon-cyan pl-4">
            <p className="font-mono text-xs text-neon-cyan/60 mb-1">ANOMALY LAB PROPULSION</p>
            <h2 className="font-mono text-2xl font-bold text-neon-cyan">EM DRIVE TEST</h2>
          </div>

          {/* Stage Messages */}
          <div className="mb-8">
            <h1 className={`font-mono text-3xl lg:text-4xl font-bold mb-4 transition-all duration-300 ${
              stage >= 2 ? 'text-terminal-amber' : 'text-neon-cyan'
            }`}>
              {stage === 0 && "INITIALIZING CAVITY..."}
              {stage === 1 && "MICROWAVE RESONANCE"}
              {stage === 2 && "THRUST DETECTED!"}
              {stage === 3 && "PHYSICS VIOLATED! 🚀"}
            </h1>

            {stage >= 2 && (
              <p className="font-mono text-lg text-terminal-amber/80 animate-pulse">
                Newton's 3rd Law: BROKEN 
              </p>
            )}
          </div>

          {/* Progress Bar */}
          {stage === 1 && (
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="font-mono text-xs text-neon-cyan/80">CAVITY RESONANCE</span>
                <span className="font-mono text-xs text-neon-cyan">{progress}%</span>
              </div>
              <div className="h-2 w-full border border-neon-cyan/50 bg-dark-800">
                <div
                  className="h-full bg-neon-cyan transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Telemetry Data */}
          <div className="space-y-3 border border-terminal-green/20 bg-dark-800/50 p-4 font-mono text-sm">
            <div className="flex justify-between border-b border-terminal-green/10 pb-2">
              <span className="text-terminal-green/60">Frequency:</span>
              <span className={`${stage >= 1 ? 'text-neon-cyan' : 'text-terminal-green/40'}`}>
                {stage >= 1 ? '2.45 GHz' : '---'}
              </span>
            </div>
            <div className="flex justify-between border-b border-terminal-green/10 pb-2">
              <span className="text-terminal-green/60">Cavity Q:</span>
              <span className={`${stage >= 1 ? 'text-neon-cyan' : 'text-terminal-green/40'}`}>
                {stage >= 1 ? '50,000' : '---'}
              </span>
            </div>
            <div className="flex justify-between border-b border-terminal-green/10 pb-2">
              <span className="text-terminal-green/60">Power Input:</span>
              <span className={`${stage >= 2 ? 'text-neon-cyan' : 'text-terminal-green/40'}`}>
                {stage >= 2 ? '2.5 kW' : '---'}
              </span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-terminal-green/60">Thrust Output:</span>
              <span className={`font-bold ${stage >= 2 ? 'text-terminal-amber' : 'text-terminal-green/40'}`}>
                {stage >= 3 ? '750 mN' : stage >= 2 ? 'RISING...' : '---'}
              </span>
            </div>
          </div>

          {/* Thrust Meter */}
          {stage >= 2 && (
            <div className="mt-6">
              <p className="mb-2 font-mono text-xs text-terminal-amber/80">THRUST FORCE</p>
              <div className="h-3 w-full border border-terminal-amber/50 bg-dark-800">
                <div
                  className="h-full bg-gradient-to-r from-neon-cyan via-terminal-amber to-neon-pink transition-all duration-1000"
                  style={{ width: stage >= 3 ? "100%" : "45%" }}
                />
              </div>
              <p className="mt-1 font-mono text-xs text-terminal-amber/60 text-right">
                {stage >= 3 ? 'MAXIMUM' : 'NOMINAL'}
              </p>
            </div>
          )}

          {/* Warning */}
          {stage >= 3 && (
            <div className="mt-6 border-2 border-terminal-amber bg-terminal-amber/10 p-4 animate-pulse">
              <p className="font-mono text-sm text-terminal-amber font-bold">
                ⚠️ WARNING: REACTIONLESS PROPULSION ACTIVE
              </p>
              <p className="font-mono text-xs text-terminal-amber/80 mt-1">
                Conservation of momentum violated
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}