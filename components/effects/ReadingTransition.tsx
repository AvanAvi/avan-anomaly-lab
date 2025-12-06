"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Book, BookOpen, BookMarked, Library } from "lucide-react";

// Flying Books - 3D particles moving inward
function FlyingBooks({ stage }: { stage: number }) {
  const booksRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 20 + Math.random() * 10;
      
      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = (Math.random() - 0.5) * 30;
      pos[i3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (booksRef.current && stage >= 1) {
      const positions = booksRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.getElapsedTime();
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        const currentRadius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
        const angle = Math.atan2(positions[i3 + 2], positions[i3]);
        const newRadius = currentRadius * 0.97;
        const spiralAngle = angle + (stage >= 2 ? 0.05 : 0.02);
        
        positions[i3] = Math.cos(spiralAngle) * newRadius;
        positions[i3 + 2] = Math.sin(spiralAngle) * newRadius;
        positions[i3 + 1] += Math.sin(time * 2 + i) * 0.02;
        
        if (currentRadius < 2) {
          const resetAngle = (i / particleCount) * Math.PI * 2;
          const resetRadius = 20 + Math.random() * 10;
          positions[i3] = Math.cos(resetAngle) * resetRadius;
          positions[i3 + 2] = Math.sin(resetAngle) * resetRadius;
        }
      }
      
      booksRef.current.geometry.attributes.position.needsUpdate = true;
      booksRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <points ref={booksRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={stage >= 2 ? 0.3 : 0.2}
        color="#ffb000"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function BookPortal({ stage }: { stage: number }) {
  const portalRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.z = state.clock.getElapsedTime() * 2;
      
      const targetScale = stage >= 3 ? 4 : stage >= 2 ? 2.5 : 1.5;
      portalRef.current.scale.x += (targetScale - portalRef.current.scale.x) * 0.05;
      portalRef.current.scale.y += (targetScale - portalRef.current.scale.y) * 0.05;
    }
  });

  return (
    <group ref={portalRef}>
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          rotation={[0, 0, (i / 8) * Math.PI * 2]}
        >
          <torusGeometry args={[2 + i * 0.3, 0.1, 16, 32]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#ffb000" : "#ff8800"}
            transparent
            opacity={0.6 - i * 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

function FlippingPages({ stage }: { stage: number }) {
  const pagesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pagesRef.current && stage >= 2) {
      pagesRef.current.children.forEach((page, i) => {
        page.rotation.y = state.clock.getElapsedTime() * 3 + i;
        page.position.z = Math.sin(state.clock.getElapsedTime() * 2 + i) * 2;
      });
    }
  });

  if (stage < 2) return null;

  return (
    <group ref={pagesRef}>
      {[...Array(20)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            0,
          ]}
        >
          <planeGeometry args={[0.5, 0.7]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

interface ReadingTransitionProps {
  onComplete: () => void;
}

export default function ReadingTransition({ onComplete }: ReadingTransitionProps) {
  const [stage, setStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 1000);
    const timer2 = setTimeout(() => setStage(2), 2500);
    const timer3 = setTimeout(() => setStage(3), 4500);
    const timer4 = setTimeout(() => setFadeOut(true), 6500);
    const timer5 = setTimeout(() => onComplete(), 7000);

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
      
      {/* Warm background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-amber-900/20 to-dark-900" />
      
      {/* 3D Scene - FIXED POSITIONING */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <color attach="background" args={["#0a0e27"]} />
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={2} color="#ffb000" />
          <pointLight position={[5, 5, 5]} intensity={1} color="#ff8800" />
          
          <FlyingBooks stage={stage} />
          <BookPortal stage={stage} />
          <FlippingPages stage={stage} />
        </Canvas>
      </div>

      {/* 2D Lucide Book Icons Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stage >= 1 && [...Array(30)].map((_, i) => {
          const BookIcon = [Book, BookOpen, BookMarked, Library][i % 4];
          const colors = ["text-terminal-amber", "text-amber-500", "text-yellow-500", "text-orange-500"];
          const sizes = ["w-8 h-8", "w-10 h-10", "w-12 h-12", "w-6 h-6"];
          
          return (
            <div
              key={i}
              className={`absolute ${colors[i % 4]} ${sizes[i % 4]}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatToCenter ${3 + Math.random() * 2}s ease-in-out ${i * 0.1}s forwards`,
                opacity: 0.7,
              }}
            >
              <BookIcon className="w-full h-full" />
            </div>
          );
        })}
      </div>

      {/* Text Overlay */}
      <div className="relative z-10 flex h-full items-center justify-center px-8">
        <div className="max-w-4xl text-center bg-dark-900/70 backdrop-blur-sm rounded-lg p-8 border border-terminal-amber/30">

          <h1 className="font-mono text-5xl font-bold mb-8 transition-all duration-500 md:text-7xl text-terminal-amber">
            {stage === 0 && "ACCESSING THE VAULT..."}
            {stage === 1 && "LOADING LIBRARY PORTAL..."}
            {stage === 2 && "BOOKS CONVERGING..."}
            {stage === 3 && "📚 INFINITE LIBRARY 📚"}
          </h1>

          <p className="font-mono text-xl text-terminal-green">
            {stage === 0 && "Initializing knowledge database..."}
            {stage === 1 && "Summoning literary particles..."}
            {stage === 2 && "Assembling infinite wisdom..."}
            {stage === 3 && "Welcome to the endless shelves."}
          </p>
        </div>
      </div>
    </div>
  );
}