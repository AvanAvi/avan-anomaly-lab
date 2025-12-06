"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Background Music Player - With progressive delays
function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/track.mp3');
      audioRef.current.volume = 0.3;
      audioRef.current.preload = 'auto';
      
      const playWithDelay = () => {
        const delayInSeconds = 45 + (playCountRef.current * 15);
        
        console.log(`Next play in ${delayInSeconds} seconds (Play #${playCountRef.current + 1})`);
        
        timeoutRef.current = setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
          }
        }, delayInSeconds * 1000);
      };
      
      const handleEnded = () => {
        playCountRef.current += 1;
        playWithDelay();
      };
      
      if (audioRef.current) {
        audioRef.current.addEventListener('ended', handleEnded);
      }
      
      playWithDelay();
      
      const playOnInteraction = () => {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
        document.removeEventListener('click', playOnInteraction);
      };
      document.addEventListener('click', playOnInteraction);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.pause();
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        document.removeEventListener('click', playOnInteraction);
      };
    }
  }, []);

  return null;
}

// Multiple Lightning Bolts - Strike every 10 seconds
function LightningField() {
  const [strikes, setStrikes] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const lastStrikeTime = useRef(0);

  useFrame((state) => {
    const currentTime = state.clock.getElapsedTime();
    
    if (currentTime - lastStrikeTime.current >= 10) {
      const newStrike = {
        id: Date.now(),
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * 10 - 5,
      };
      setStrikes((prev) => [...prev, newStrike]);
      lastStrikeTime.current = currentTime;
      
      setTimeout(() => {
        setStrikes((prev) => prev.filter((s) => s.id !== newStrike.id));
      }, 150);
    }
  });

  return (
    <>
      {strikes.map((strike) => (
        <LightningBolt key={strike.id} position={[strike.x, strike.y, -2]} />
      ))}
    </>
  );
}

// Single Lightning Bolt
function LightningBolt({ position }: { position: [number, number, number] }) {
  const points = useMemo(() => {
    const pts = [];
    const startY = position[1];
    for (let i = 0; i < 15; i++) {
      pts.push(
        new THREE.Vector3(
          position[0] + (Math.random() - 0.5) * 2,
          startY - i * 0.7,
          position[2] + (Math.random() - 0.5) * 0.5
        )
      );
    }
    return pts;
  }, [position]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <primitive 
      object={new THREE.Line(
        geometry, 
        new THREE.LineBasicMaterial({ 
          color: "#00d9ff", 
          linewidth: 5, 
          transparent: true, 
          opacity: 0.8 
        })
      )} 
    />
  );
}

// Energy Particles - Reduced count for better performance
function EnergyParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(1500 * 3);
    const colors = new Float32Array(1500 * 3);

    for (let i = 0; i < 1500; i++) {
      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20 - 5;

      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i3] = 0;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 0.3;
      } else if (colorChoice < 0.8) {
        colors[i3] = 0;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      } else {
        colors[i3] = 1;
        colors[i3 + 1] = 0;
        colors[i3 + 2] = 0.5;
      }
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.getElapsedTime() + i) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function PrometheusReactor() {
  return (
    <>
      <BackgroundMusic />
      <div className="fixed inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} color="#ff006e" intensity={0.4} />
          <pointLight position={[6, 0, -5]} color="#00ff41" intensity={1.5} />
          
          <LightningField />
          <EnergyParticles />
        </Canvas>
      </div>
    </>
  );
}