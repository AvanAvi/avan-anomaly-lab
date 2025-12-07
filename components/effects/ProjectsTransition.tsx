"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectsTransitionProps {
  onComplete: () => void;
}

// ============================================
// ISOMETRIC HELPERS
// ============================================
const ISO_TRANSFORM = "rotateX(60deg) rotateZ(-45deg)";
const ISO_SCALE = "scale(1)";

// ============================================
// STAGE 1: IDEATION - Clean, minimal design
// ============================================
function IdeationStage({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timers = [
      setTimeout(() => setPhase(1), 400),   // Start thinking
      setTimeout(() => setPhase(2), 1200),  // Ideas floating
      setTimeout(() => setPhase(3), 2200),  // Lightbulb moment
    ];
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main content container - centered */}
      <div className="relative flex flex-col items-center">
        
        {/* Thinking character - simple, clean */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Head with thinking animation */}
          <motion.div
            className="relative h-20 w-16 rounded-full bg-gradient-to-b from-amber-200 to-amber-300"
            animate={{ 
              rotateZ: phase === 1 ? [0, -3, 3, 0] : 0,
            }}
            transition={{ duration: 2, repeat: phase === 1 ? Infinity : 0 }}
          >
            {/* Hair */}
            <div className="absolute -top-1 left-1 right-1 h-8 rounded-t-full bg-gray-800" />
            
            {/* Eyes */}
            <div className="absolute top-9 flex w-full justify-center gap-4">
              <motion.div 
                className="h-2 w-2 rounded-full bg-gray-900"
                animate={{ 
                  y: phase >= 1 && phase < 3 ? [0, -2, 0] : 0,
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div 
                className="h-2 w-2 rounded-full bg-gray-900"
                animate={{ 
                  y: phase >= 1 && phase < 3 ? [0, -2, 0] : 0,
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
              />
            </div>
            
            {/* Mouth - slight smile when eureka */}
            <motion.div
              className="absolute bottom-4 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-gray-700"
              animate={{ 
                scaleX: phase === 3 ? 1.5 : 1,
                borderRadius: phase === 3 ? "0 0 8px 8px" : "4px"
              }}
            />
          </motion.div>

          {/* Simple body/shoulders */}
          <div className="mx-auto -mt-2 h-12 w-24 rounded-t-3xl bg-gradient-to-b from-gray-600 to-gray-700" />
        </motion.div>

        {/* Thinking dots - appear in phase 1-2 */}
        <AnimatePresence>
          {phase >= 1 && phase < 3 && (
            <motion.div
              className="absolute -right-8 -top-4 flex flex-col items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-full bg-gray-500"
                  style={{ width: 6 + i * 2, height: 6 + i * 2 }}
                  animate={{ 
                    opacity: [0.4, 1, 0.4],
                    scale: [0.9, 1.1, 0.9],
                  }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating idea fragments - phase 2 */}
        <AnimatePresence>
          {phase >= 2 && phase < 3 && (
            <>
              {["?", "...", "💭"].map((item, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl text-gray-400"
                  style={{
                    left: -40 + i * 40,
                    top: -80 - i * 15,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: [0.3, 0.7, 0.3],
                    y: [0, -10, 0],
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  {item}
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* LIGHTBULB - Eureka moment */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              className="absolute -top-40"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {/* Glow effect behind bulb */}
              <motion.div
                className="absolute -inset-8 rounded-full bg-terminal-amber/20"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              
              {/* Lightbulb SVG */}
              <motion.svg 
                width="60" 
                height="80" 
                viewBox="0 0 60 80"
                animate={{ filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {/* Outer glow */}
                <circle cx="30" cy="30" r="28" fill="#ffb000" opacity="0.2" />
                
                {/* Bulb glass */}
                <path
                  d="M30 5 C45 5 55 18 55 30 C55 42 43 52 43 58 L17 58 C17 52 5 42 5 30 C5 18 15 5 30 5"
                  fill="#ffb000"
                  stroke="#ff8c00"
                  strokeWidth="2"
                />
                
                {/* Inner highlight */}
                <ellipse cx="22" cy="22" rx="8" ry="10" fill="#ffe066" opacity="0.4" />
                
                {/* Filament */}
                <path
                  d="M22 42 Q30 30 38 42"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                  opacity="0.9"
                />
                
                {/* Base */}
                <rect x="17" y="58" width="26" height="6" fill="#666" rx="1" />
                <rect x="19" y="64" width="22" height="5" fill="#555" rx="1" />
                <rect x="22" y="69" width="16" height="4" fill="#444" rx="2" />
              </motion.svg>

              {/* Rays */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-8 h-6 w-1 rounded-full bg-terminal-amber"
                  style={{
                    transformOrigin: "center bottom",
                    transform: `translateX(-50%) rotate(${i * 45}deg) translateY(-45px)`,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ 
                    scaleY: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ 
                    delay: i * 0.05,
                    duration: 0.8, 
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stage label - positioned at bottom with good spacing */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="font-mono text-xs tracking-widest text-terminal-amber/60">STAGE 01</div>
        <div className="mt-1 font-mono text-2xl font-bold text-terminal-amber">IDEATION</div>
        <motion.div 
          className="mt-2 font-mono text-sm text-gray-400"
        >
          {phase < 3 ? "Brainstorming..." : "💡 Eureka!"}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// STAGE 2: DESIGN - Clean blueprint with proper sizing
// ============================================
function DesignStage({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Paper unfolds
      setTimeout(() => setPhase(2), 800),   // Grid appears
      setTimeout(() => setPhase(3), 1400),  // Wireframes draw
      setTimeout(() => setPhase(4), 2400),  // Complete
    ];
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Blueprint container - responsive sizing */}
      <motion.div
        className="relative w-full max-w-lg"
        style={{ perspective: "1000px" }}
        initial={{ rotateX: -60, opacity: 0 }}
        animate={{ 
          rotateX: phase >= 1 ? 0 : -60,
          opacity: phase >= 1 ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Main blueprint panel */}
        <div 
          className="relative rounded-lg border-2 border-neon-cyan/40 bg-dark-800/95 p-4 shadow-xl sm:p-6"
          style={{
            backgroundImage: phase >= 2 
              ? "linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px)"
              : "none",
            backgroundSize: "16px 16px",
          }}
        >
          {/* Blueprint header */}
          <div className="mb-3 flex items-center justify-between border-b border-neon-cyan/20 pb-2">
            <div className="font-mono text-[10px] text-neon-cyan/70 sm:text-xs">BLUEPRINT_v1.0</div>
            <div className="font-mono text-[10px] text-neon-cyan/50 sm:text-xs">SCALE 1:1</div>
          </div>

          {/* Wireframe content area */}
          <div className="relative h-48 sm:h-56">
            {/* App wireframe - Left side */}
            {phase >= 3 && (
              <motion.div
                className="absolute left-0 top-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <svg 
                  viewBox="0 0 160 120" 
                  className="h-28 w-36 sm:h-32 sm:w-44"
                >
                  {/* Browser window */}
                  <motion.rect
                    x="0" y="0" width="155" height="115"
                    fill="rgba(0,255,255,0.05)"
                    stroke="#00ffff"
                    strokeWidth="2"
                    rx="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Title bar */}
                  <rect x="0" y="0" width="155" height="18" fill="rgba(0,255,255,0.1)" rx="4" />
                  <line x1="0" y1="18" x2="155" y2="18" stroke="#00ffff" strokeWidth="1" opacity="0.5" />
                  
                  {/* Window buttons */}
                  <motion.circle cx="12" cy="9" r="3" fill="#ff006e" 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} />
                  <motion.circle cx="24" cy="9" r="3" fill="#ffb000"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.35 }} />
                  <motion.circle cx="36" cy="9" r="3" fill="#00ff41"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} />
                  
                  {/* Sidebar */}
                  <motion.rect
                    x="4" y="24" width="35" height="86"
                    fill="none"
                    stroke="#00ffff"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 0.5 }}
                  />
                  
                  {/* Header */}
                  <motion.rect
                    x="44" y="24" width="106" height="20"
                    fill="none"
                    stroke="#00ffff"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 0.6 }}
                  />
                  
                  {/* Content cards */}
                  {[0, 1, 2].map((i) => (
                    <motion.rect
                      key={i}
                      x={44 + i * 36}
                      y="50"
                      width="32"
                      height="55"
                      rx="2"
                      fill="rgba(0,255,255,0.05)"
                      stroke="#00ffff"
                      strokeWidth="1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.8, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                    />
                  ))}
                </svg>
              </motion.div>
            )}

            {/* Architecture diagram - Right side */}
            {phase >= 3 && (
              <motion.div
                className="absolute right-0 top-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <svg viewBox="0 0 100 120" className="h-28 w-24 sm:h-32 sm:w-28">
                  {/* Component boxes */}
                  {[
                    { label: "UI", y: 5, color: "#00ffff" },
                    { label: "API", y: 45, color: "#00ff41" },
                    { label: "DB", y: 85, color: "#ffb000" },
                  ].map((item, i) => (
                    <g key={item.label}>
                      <motion.rect
                        x="10"
                        y={item.y}
                        width="80"
                        height="28"
                        rx="4"
                        fill={`${item.color}10`}
                        stroke={item.color}
                        strokeWidth="1.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.15 }}
                      />
                      <motion.text
                        x="50"
                        y={item.y + 18}
                        fill={item.color}
                        fontSize="11"
                        textAnchor="middle"
                        fontFamily="monospace"
                        fontWeight="bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 + i * 0.15 }}
                      >
                        {item.label}
                      </motion.text>
                    </g>
                  ))}
                  
                  {/* Connecting lines */}
                  <motion.line
                    x1="50" y1="33" x2="50" y2="45"
                    stroke="#666"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.3 }}
                  />
                  <motion.line
                    x1="50" y1="73" x2="50" y2="85"
                    stroke="#666"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.4 }}
                  />
                  
                  {/* Arrows */}
                  <motion.polygon
                    points="45,44 50,40 55,44"
                    fill="#666"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.35 }}
                  />
                  <motion.polygon
                    points="45,84 50,80 55,84"
                    fill="#666"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.45 }}
                  />
                </svg>
              </motion.div>
            )}

            {/* Labels */}
            {phase >= 4 && (
              <>
                <motion.div
                  className="absolute bottom-8 left-0 font-mono text-[9px] text-terminal-amber sm:text-[10px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ← Interface
                </motion.div>
                <motion.div
                  className="absolute bottom-8 right-0 font-mono text-[9px] text-terminal-amber sm:text-[10px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  Stack →
                </motion.div>
              </>
            )}

            {/* Bottom dimension line */}
            {phase >= 4 && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="h-px flex-1 bg-neon-cyan/30" />
                <span className="font-mono text-[9px] text-neon-cyan/60">responsive</span>
                <div className="h-px flex-1 bg-neon-cyan/30" />
              </motion.div>
            )}
          </div>

          {/* Corner markers */}
          {[
            "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
            "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
            "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
            "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
          ].map((classes, i) => (
            <motion.div
              key={i}
              className={`absolute h-3 w-3 border-neon-cyan/60 ${classes}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Stage label - bottom with proper spacing */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="font-mono text-xs tracking-widest text-neon-cyan/60">STAGE 02</div>
        <div className="mt-1 font-mono text-2xl font-bold text-neon-cyan">DESIGN</div>
        <motion.div 
          className="mt-2 font-mono text-sm text-gray-400"
        >
          {phase < 4 ? "Architecting solution..." : "✓ Blueprint ready!"}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// STAGE 3: CODING - Editor with streaming code
// ============================================
function CodingStage({ active }: { active: boolean }) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  const codeLines = [
    "import { Project } from '@anomaly/core';",
    "",
    "export default function Workshop() {",
    "  const [ideas, setIdeas] = useState([]);",
    "  const [building, setBuilding] = useState(true);",
    "",
    "  useEffect(() => {",
    "    const magic = async () => {",
    "      await transformIdea(ideas);",
    "      await compile();",
    "      await deploy(); // 🚀",
    "    };",
    "    magic();",
    "  }, [ideas]);",
    "",
    "  return <Innovation infinite />;",
    "}",
  ];

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setCurrentLine((prev) => {
        if (prev < codeLines.length) {
          setLines((l) => [...l, codeLines[prev]]);
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 180); // Slower typing for better readability
    return () => clearInterval(interval);
  }, [active]);

  const syntaxHighlight = (line: string) => {
    return line
      .replace(/(import|export|default|function|const|return|async|await|from)/g, '<span class="text-neon-pink">$1</span>')
      .replace(/('[@\w/.]+')/g, '<span class="text-terminal-amber">$1</span>')
      .replace(/(useState|useEffect)/g, '<span class="text-neon-cyan">$1</span>')
      .replace(/(\{|\}|\(|\)|\[|\])/g, '<span class="text-gray-400">$1</span>')
      .replace(/(\/\/.*)/g, '<span class="text-gray-500">$1</span>');
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
        {/* Character typing - hidden on small screens */}
        <motion.div
          className="relative hidden md:block"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Mini desk setup */}
          <div className="relative h-28 w-40 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 p-3">
            {/* Mini monitor */}
            <div className="mx-auto h-10 w-16 rounded-sm border border-gray-600 bg-dark-900">
              <motion.div
                className="h-full w-full rounded-sm bg-gradient-to-br from-terminal-green/20 to-neon-cyan/20"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </div>
            
            {/* Character - zoomed out */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 scale-[0.6]">
              {/* Head */}
              <div className="relative mx-auto h-8 w-6 rounded-full bg-gradient-to-b from-amber-200 to-amber-300">
                <div className="absolute -top-1 left-0 right-0 h-3 rounded-t-full bg-gray-900" />
              </div>
              {/* Body */}
              <div className="relative -mt-1 h-10 w-12 rounded-b-lg bg-gradient-to-b from-gray-700 to-gray-800">
                {/* Arms typing */}
                <motion.div
                  className="absolute -bottom-1 left-1 h-2 w-6 rounded-full bg-gray-700"
                  animate={{ y: [0, -1, 0] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-1 right-1 h-2 w-6 rounded-full bg-gray-700"
                  animate={{ y: [0, -1, 0] }}
                  transition={{ duration: 0.1, repeat: Infinity, delay: 0.05 }}
                />
              </div>
            </div>
          </div>

          {/* Typing indicator */}
          <motion.div
            className="mt-3 text-center font-mono text-xs text-terminal-green/60"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            Typing furiously...
          </motion.div>
        </motion.div>

        {/* Code editor */}
        <motion.div
          className="relative h-64 w-full max-w-sm overflow-hidden rounded-lg border border-terminal-green/30 bg-dark-900/95 font-mono text-sm shadow-2xl sm:h-72 sm:max-w-md"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Editor header */}
          <div className="flex items-center justify-between border-b border-terminal-green/20 bg-dark-800 px-3 py-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-neon-pink" />
              <div className="h-2.5 w-2.5 rounded-full bg-terminal-amber" />
              <div className="h-2.5 w-2.5 rounded-full bg-terminal-green" />
            </div>
            <div className="text-[10px] text-terminal-green/60">workshop.tsx</div>
            <div className="text-[10px] text-terminal-green/40">UTF-8</div>
          </div>

          {/* Line numbers + code - with proper scroll container */}
          <div className="flex h-[calc(100%-40px)] overflow-hidden">
            {/* Line numbers */}
            <div className="w-8 flex-shrink-0 overflow-hidden border-r border-terminal-green/10 bg-dark-800/50 py-2 text-right">
              {lines.map((_, i) => (
                <div key={i} className="px-1 text-[10px] leading-4 text-terminal-green/30">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code content - proper overflow */}
            <div className="flex-1 overflow-hidden py-2 pl-2 pr-2">
              <div className="h-full overflow-y-auto overflow-x-hidden">
                {lines.map((line, i) => (
                  <motion.div
                    key={i}
                    className="whitespace-pre text-[10px] leading-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) || "&nbsp;" }}
                  />
                ))}
                {/* Cursor */}
                {currentLine < codeLines.length && (
                  <motion.span
                    className="inline-block h-3 w-1.5 bg-terminal-green"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Progress bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark-800">
            <motion.div
              className="h-full bg-gradient-to-r from-terminal-green to-neon-cyan"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentLine / codeLines.length) * 100}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Stage label */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="font-mono text-xs text-terminal-green/60">STAGE 03</div>
        <div className="font-mono text-2xl font-bold text-terminal-green">CODING</div>
        <motion.div 
          className="mt-2 font-mono text-sm text-terminal-green/60"
        >
          {currentLine < codeLines.length 
            ? `Writing line ${currentLine + 1}/${codeLines.length}...`
            : "✓ Code complete!"}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// STAGE 4: FABRICATION - CNC Lathe Machine
// ============================================
function FabricationStage({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Machine powers on
      setTimeout(() => setPhase(2), 800),   // Chuck starts spinning
      setTimeout(() => setPhase(3), 1500),  // Cutting tool engages
      setTimeout(() => setPhase(4), 2500),  // Sparks/shavings
    ];
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* CNC Lathe Machine - Isometric view */}
      <div className="relative flex flex-col items-center" style={{ transform: "perspective(1000px) rotateX(10deg) rotateY(-15deg)" }}>
        {/* Machine base */}
        <motion.div
          className="relative h-40 w-80 rounded-lg bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 shadow-2xl sm:h-44 sm:w-96"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Control panel */}
          <div className="absolute -top-16 left-4 h-14 w-24 rounded-t-lg bg-gray-700 p-2">
            {/* Screen */}
            <div className="h-8 w-full rounded-sm bg-dark-900">
              <motion.div
                className="flex h-full items-center justify-center font-mono text-[8px] text-terminal-green"
                animate={{ opacity: phase >= 1 ? 1 : 0.3 }}
              >
                {phase < 2 ? "STANDBY" : phase < 4 ? "RUNNING" : "COMPLETE"}
              </motion.div>
            </div>
            {/* LED indicators */}
            <div className="mt-1 flex justify-center gap-1">
              <motion.div 
                className="h-2 w-2 rounded-full"
                animate={{ 
                  backgroundColor: phase >= 1 ? "#00ff41" : "#333",
                  boxShadow: phase >= 1 ? "0 0 8px #00ff41" : "none"
                }}
              />
              <motion.div 
                className="h-2 w-2 rounded-full"
                animate={{ 
                  backgroundColor: phase >= 2 ? "#ffb000" : "#333",
                  boxShadow: phase >= 2 ? "0 0 8px #ffb000" : "none"
                }}
              />
            </div>
          </div>

          {/* Headstock (left side with spinning chuck) */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2">
            {/* Motor housing */}
            <div className="h-28 w-20 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 shadow-inner">
              {/* Spindle */}
              <motion.div
                className="absolute -right-8 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full border-4 border-gray-500 bg-gray-700"
                animate={{ 
                  rotate: phase >= 2 ? 360 : 0,
                }}
                transition={{ 
                  duration: 0.3, 
                  repeat: phase >= 2 ? Infinity : 0,
                  ease: "linear"
                }}
              >
                {/* Chuck jaws */}
                {[0, 120, 240].map((angle) => (
                  <div
                    key={angle}
                    className="absolute left-1/2 top-1/2 h-2 w-6 -translate-x-1/2 -translate-y-1/2 bg-gray-500"
                    style={{ transform: `rotate(${angle}deg) translateX(8px)` }}
                  />
                ))}
                {/* Workpiece */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600"
                  animate={{
                    width: phase >= 4 ? "24px" : "32px",
                    height: phase >= 4 ? "24px" : "32px",
                  }}
                  transition={{ duration: 1 }}
                />
              </motion.div>
            </div>
          </div>

          {/* Tool post (cutting tool) */}
          <motion.div
            className="absolute right-24 top-1/2 -translate-y-1/2"
            animate={{
              x: phase >= 3 ? -40 : 0,
            }}
            transition={{ duration: 0.8 }}
          >
            {/* Tool holder */}
            <div className="h-12 w-8 bg-gradient-to-b from-gray-500 to-gray-600">
              {/* Cutting insert */}
              <div className="absolute -left-2 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-gradient-to-br from-yellow-600 to-yellow-800" />
            </div>
            {/* Tool post base */}
            <div className="h-4 w-12 -translate-x-2 rounded bg-gray-700" />
          </motion.div>

          {/* Tailstock (right side) */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <div className="h-20 w-12 rounded-r-lg bg-gradient-to-l from-gray-500 to-gray-600">
              {/* Quill */}
              <div className="absolute -left-4 top-1/2 h-4 w-8 -translate-y-1/2 bg-gray-500" />
            </div>
          </div>

          {/* Bed ways */}
          <div className="absolute bottom-4 left-1/4 right-1/4 flex justify-between">
            <div className="h-2 w-full rounded bg-gray-500" />
          </div>

          {/* Metal shavings / sparks */}
          {phase >= 4 && (
            <div className="absolute left-32 top-1/2 -translate-y-1/2">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 w-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                  animate={{
                    x: [0, 30 + Math.random() * 40],
                    y: [0, -20 + Math.random() * 60],
                    opacity: [1, 0],
                    rotate: [0, 180 + Math.random() * 180],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    repeat: Infinity,
                    repeatDelay: 0.3,
                  }}
                />
              ))}
            </div>
          )}

          {/* Machine nameplate */}
          <div className="absolute bottom-2 right-2 font-mono text-[8px] text-gray-400">
            ANOMALY CNC-3000
          </div>
        </motion.div>

        {/* Coolant tank */}
        <div className="absolute -bottom-6 left-4 h-5 w-24 rounded bg-gray-700">
          <div className="h-full w-1/2 rounded-l bg-neon-cyan/20" />
        </div>
        
        {/* Status display - positioned below machine on mobile, beside on larger screens */}
        <motion.div
          className="mt-4 w-full max-w-[180px] rounded border border-terminal-amber/30 bg-dark-800/90 p-3 md:absolute md:-right-48 md:top-1/2 md:mt-0 md:-translate-y-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="font-mono text-xs text-terminal-amber/60">MACHINE STATUS</div>
          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">RPM:</span>
              <motion.span 
                className="text-xs text-terminal-amber"
                animate={{ opacity: phase >= 2 ? 1 : 0.3 }}
              >
                {phase >= 2 ? "2,400" : "0"}
              </motion.span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Feed:</span>
              <motion.span 
                className="text-xs text-terminal-amber"
                animate={{ opacity: phase >= 3 ? 1 : 0.3 }}
              >
                {phase >= 3 ? "0.2mm/rev" : "---"}
              </motion.span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Depth:</span>
              <motion.span 
                className="text-xs text-terminal-amber"
                animate={{ opacity: phase >= 4 ? 1 : 0.3 }}
              >
                {phase >= 4 ? "1.5mm" : "---"}
              </motion.span>
            </div>
          </div>
          {/* Progress */}
          <div className="mt-2 h-1 w-full rounded-full bg-gray-700">
            <motion.div
              className="h-full rounded-full bg-terminal-amber"
              initial={{ width: "0%" }}
              animate={{ width: `${phase * 25}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Stage label */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="font-mono text-xs text-terminal-amber/60">STAGE 04</div>
        <div className="font-mono text-2xl font-bold text-terminal-amber">FABRICATION</div>
        <motion.div 
          className="mt-2 font-mono text-sm text-terminal-green/60"
        >
          {phase < 2 ? "Initializing CNC..." : phase < 4 ? "Machining component..." : "✓ Part complete!"}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN TRANSITION COMPONENT
// ============================================
export default function ProjectsTransition({ onComplete }: ProjectsTransitionProps) {
  const [currentStage, setCurrentStage] = useState(0);

  // Stage timings - Total ~25 seconds
  const stageTimings = [
    { stage: 1, delay: 0, duration: 3500 },       // Ideation - watch the lightbulb moment
    { stage: 2, delay: 3500, duration: 3500 },    // Design - see blueprints unfold
    { stage: 3, delay: 7000, duration: 3500 },    // Coding - watch code stream
    { stage: 4, delay: 10500, duration: 3500 },   // Fabrication - CNC machining
    { stage: 5, delay: 14000, duration: 2500 },   // Assembly - robotic arm
    { stage: 6, delay: 16500, duration: 2500 },   // Quality Check - scanning
    { stage: 7, delay: 19000, duration: 3500 },   // Packaging - box forming + sealing
    { stage: 8, delay: 22500, duration: 2500 },   // Deploy - rocket launch
  ];

  useEffect(() => {
    const timers = stageTimings.map(({ stage, delay }) =>
      setTimeout(() => setCurrentStage(stage), delay)
    );

    // Complete callback
    const completeTimer = setTimeout(() => onComplete(), 25000);
    timers.push(completeTimer);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-dark-900">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Stages */}
      <AnimatePresence mode="wait">
        {currentStage === 1 && <IdeationStage key="ideation" active={true} />}
        {currentStage === 2 && <DesignStage key="design" active={true} />}
        {currentStage === 3 && <CodingStage key="coding" active={true} />}
        {currentStage === 4 && <FabricationStage key="fabrication" active={true} />}
        {currentStage === 5 && <AssemblyStage key="assembly" active={true} />}
        {currentStage === 6 && <QualityCheckStage key="quality" active={true} />}
        {currentStage === 7 && <PackagingStage key="packaging" active={true} />}
        {currentStage === 8 && <DeploymentStage key="deployment" active={true} />}
      </AnimatePresence>

      {/* Top HUD */}
      <div className="absolute left-0 right-0 top-0 z-50 border-b border-terminal-green/20 bg-dark-900/90 px-6 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="font-mono text-sm text-terminal-green/60">
            ANOMALY ASSEMBLY LINE
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((stage) => (
              <motion.div
                key={stage}
                className={`h-2 w-8 rounded-full ${
                  currentStage >= stage ? "bg-terminal-green" : "bg-gray-700"
                }`}
                animate={{
                  boxShadow: currentStage === stage ? "0 0 10px #00ff41" : "none",
                }}
              />
            ))}
          </div>
          <div className="font-mono text-sm text-terminal-green">
            {currentStage}/8
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="pointer-events-none absolute left-4 top-16 h-16 w-16 border-l-2 border-t-2 border-terminal-green/20" />
      <div className="pointer-events-none absolute right-4 top-16 h-16 w-16 border-r-2 border-t-2 border-terminal-green/20" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-16 w-16 border-b-2 border-l-2 border-terminal-green/20" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-16 w-16 border-b-2 border-r-2 border-terminal-green/20" />
    </div>
  );
}

// ============================================
// STAGE 5: ASSEMBLY - Robotic Arm
// ============================================
function AssemblyStage({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1000),
      setTimeout(() => setPhase(4), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Centered container */}
      <div className="relative flex h-72 w-full max-w-lg flex-col items-center justify-end px-4">
        {/* Robotic arm - centered above conveyor */}
        <div className="relative mb-4 h-40 w-full">
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{ transformOrigin: "bottom center" }}
          >
            {/* Arm base */}
            <div className="relative">
              <div className="mx-auto h-6 w-14 rounded-t-lg bg-gradient-to-b from-gray-500 to-gray-600" />
              
              {/* Lower arm segment */}
              <motion.div
                className="absolute -top-16 left-1/2 h-16 w-5 -translate-x-1/2 rounded bg-gradient-to-b from-gray-500 to-gray-600"
                style={{ transformOrigin: "bottom center" }}
                animate={{ rotate: phase >= 1 ? -25 : 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Joint */}
                <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-terminal-amber shadow-[0_0_8px_rgba(255,176,0,0.6)]" />
                
                {/* Upper arm segment */}
                <motion.div
                  className="absolute -top-14 left-1/2 h-14 w-4 -translate-x-1/2 rounded bg-gradient-to-b from-gray-400 to-gray-500"
                  style={{ transformOrigin: "bottom center" }}
                  animate={{ rotate: phase >= 2 ? 50 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Wrist joint */}
                  <div className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-terminal-amber shadow-[0_0_8px_rgba(255,176,0,0.6)]" />
                  
                  {/* Gripper */}
                  <motion.div
                    className="absolute -top-6 left-1/2 -translate-x-1/2"
                    animate={{ rotate: phase >= 3 ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Gripper fingers */}
                    <motion.div
                      className="flex gap-1"
                      animate={{ gap: phase >= 4 ? "2px" : "6px" }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="h-6 w-1.5 rounded bg-gray-500" />
                      <div className="h-6 w-1.5 rounded bg-gray-500" />
                    </motion.div>
                    
                    {/* Held component */}
                    {phase >= 3 && (
                      <motion.div
                        className="absolute left-1/2 top-1.5 h-3 w-3 -translate-x-1/2 rounded bg-gradient-to-br from-neon-cyan to-neon-cyan/60 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Assembly platform - right side */}
          <div className="absolute bottom-0 right-8 h-10 w-16 rounded-t bg-gray-600">
            {/* Base component */}
            <div className="absolute bottom-full left-1/2 mb-1 h-5 w-10 -translate-x-1/2 rounded bg-gradient-to-b from-gray-400 to-gray-500" />
            
            {/* Assembled component */}
            {phase >= 4 && (
              <motion.div
                className="absolute bottom-full left-1/2 mb-6 h-3 w-3 -translate-x-1/2 rounded bg-gradient-to-br from-neon-cyan to-neon-cyan/60 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              />
            )}
          </div>
        </div>

        {/* Conveyor belt base */}
        <div className="relative h-12 w-full rounded bg-gradient-to-b from-gray-600 to-gray-700">
          {/* Belt surface */}
          <motion.div
            className="absolute inset-x-2 top-2 h-3 rounded bg-gray-800"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, #444 0px, #444 20px, #333 20px, #333 40px)",
              backgroundSize: "40px 100%",
            }}
            animate={{ backgroundPositionX: ["0px", "-40px"] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Incoming parts on conveyor */}
          <div className="absolute inset-x-4 top-1 overflow-hidden">
            <motion.div
              className="flex gap-16"
              animate={{ x: ["-100px", "100px"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 w-3 flex-shrink-0 rounded bg-neon-cyan/60" />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stage label */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="font-mono text-xs text-neon-cyan/60">STAGE 05</div>
        <div className="font-mono text-2xl font-bold text-neon-cyan">ASSEMBLY</div>
        <motion.div className="mt-2 font-mono text-sm text-terminal-green/60">
          Robotic assembly in progress...
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// STAGE 6: QUALITY CHECK
// ============================================
function QualityCheckStage({ active }: { active: boolean }) {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setScanProgress((prev) => Math.min(prev + 5, 100));
    }, 80);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full max-w-sm">
        {/* Scanner frame */}
        <div className="relative rounded-lg border-2 border-terminal-green/30 bg-dark-800/80 p-6">
          {/* Scanner header */}
          <div className="absolute -top-3 left-4 bg-dark-900 px-2 font-mono text-xs text-terminal-green">
            QUALITY SCANNER
          </div>

          {/* Product being scanned */}
          <div className="relative mx-auto mb-6 h-28 w-28">
            {/* Product */}
            <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600">
              <div className="absolute inset-2 rounded bg-gradient-to-br from-neon-cyan/30 to-neon-cyan/10" />
            </div>

            {/* Scan line */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-terminal-green shadow-[0_0_15px_rgba(0,255,65,0.8)]"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Corner markers */}
            {[
              "top-0 left-0 border-t-2 border-l-2",
              "top-0 right-0 border-t-2 border-r-2",
              "bottom-0 left-0 border-b-2 border-l-2",
              "bottom-0 right-0 border-b-2 border-r-2",
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute h-4 w-4 border-terminal-green ${pos}`}
              />
            ))}
          </div>

          {/* Scan results */}
          <div className="space-y-2">
            {[
              { label: "Dimensions", status: scanProgress > 30 },
              { label: "Material", status: scanProgress > 50 },
              { label: "Integrity", status: scanProgress > 70 },
              { label: "Finish", status: scanProgress > 90 },
            ].map((check, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-mono text-xs text-gray-400">{check.label}</span>
                <motion.span
                  className={`font-mono text-xs ${check.status ? "text-terminal-green" : "text-gray-600"}`}
                  animate={{ opacity: check.status ? 1 : 0.3 }}
                >
                  {check.status ? "✓ PASS" : "..."}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 w-full rounded-full bg-dark-900">
            <motion.div
              className="h-full rounded-full bg-terminal-green"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stage label */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="font-mono text-xs text-terminal-green/60">STAGE 06</div>
        <div className="font-mono text-2xl font-bold text-terminal-green">QUALITY CHECK</div>
        <motion.div className="mt-2 font-mono text-sm text-terminal-green/60">
          {scanProgress < 100 ? `Scanning... ${scanProgress}%` : "✓ All checks passed!"}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// STAGE 7: PACKAGING - Smooth box assembly
// ============================================
function PackagingStage({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);

  // Phase timeline:
  // 0: Initial - product on conveyor
  // 1: Product moves to center (500ms)
  // 2: Box bottom appears (300ms)
  // 3: Box sides fold up (500ms)
  // 4: Box front/back close (400ms)
  // 5: Product drops into box (300ms)
  // 6: Box top flaps close (500ms)
  // 7: Label stamps (300ms)
  // 8: Sealed box moves out (500ms)

  useEffect(() => {
    if (!active) return;
    const timers = [
      setTimeout(() => setPhase(1), 200),    // Product starts moving
      setTimeout(() => setPhase(2), 700),    // Box bottom appears
      setTimeout(() => setPhase(3), 1000),   // Sides fold up
      setTimeout(() => setPhase(4), 1500),   // Front/back close
      setTimeout(() => setPhase(5), 1900),   // Product drops in
      setTimeout(() => setPhase(6), 2200),   // Top flaps close
      setTimeout(() => setPhase(7), 2700),   // Label stamps
      setTimeout(() => setPhase(8), 3000),   // Box moves out
    ];
    return () => timers.forEach(clearTimeout);
  }, [active]);

  const getStatusText = () => {
    if (phase < 2) return "Product arriving...";
    if (phase < 4) return "Forming box...";
    if (phase < 6) return "Inserting product...";
    if (phase < 7) return "Sealing box...";
    if (phase < 8) return "Applying label...";
    return "✓ Package complete!";
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex h-64 w-full max-w-md flex-col items-center justify-end">
        
        {/* Packaging machine frame */}
        <div className="relative mb-4 h-44 w-full max-w-xs">
          {/* Machine housing */}
          <div className="absolute inset-x-8 top-0 h-8 rounded-t-lg bg-gradient-to-b from-gray-500 to-gray-600">
            {/* Machine lights */}
            <div className="absolute left-4 top-2 flex gap-2">
              <motion.div 
                className="h-2 w-2 rounded-full"
                animate={{ 
                  backgroundColor: phase >= 1 ? "#00ff41" : "#333",
                  boxShadow: phase >= 1 ? "0 0 6px #00ff41" : "none"
                }}
              />
              <motion.div 
                className="h-2 w-2 rounded-full"
                animate={{ 
                  backgroundColor: phase >= 3 ? "#ffb000" : "#333",
                  boxShadow: phase >= 3 ? "0 0 6px #ffb000" : "none"
                }}
              />
              <motion.div 
                className="h-2 w-2 rounded-full"
                animate={{ 
                  backgroundColor: phase >= 7 ? "#00ffff" : "#333",
                  boxShadow: phase >= 7 ? "0 0 6px #00ffff" : "none"
                }}
              />
            </div>
          </div>

          {/* Side pillars */}
          <div className="absolute bottom-10 left-8 h-28 w-2 bg-gradient-to-b from-gray-500 to-gray-600" />
          <div className="absolute bottom-10 right-8 h-28 w-2 bg-gradient-to-b from-gray-500 to-gray-600" />

          {/* Packaging area - centered */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            
            {/* Product - moves to center then drops into box */}
            <motion.div
              className="absolute z-10"
              initial={{ x: -80, y: 0 }}
              animate={{ 
                x: phase >= 1 ? 0 : -80,
                y: phase >= 5 ? 16 : 0,
                opacity: phase >= 5 ? 0 : 1,
              }}
              transition={{ 
                x: { duration: 0.5, ease: "easeOut" },
                y: { duration: 0.3, ease: "easeIn" },
                opacity: { duration: 0.1, delay: 0.2 }
              }}
            >
              <div className="h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded bg-gradient-to-br from-neon-cyan to-neon-cyan/70 shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
            </motion.div>

            {/* Box assembly */}
            <div className="relative h-14 w-14" style={{ perspective: "200px" }}>
              
              {/* Box bottom */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-2 bg-amber-800"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: phase >= 2 ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Box left side */}
              <motion.div
                className="absolute bottom-2 left-0 h-12 w-2 origin-bottom bg-amber-700"
                initial={{ rotateY: -90 }}
                animate={{ rotateY: phase >= 3 ? 0 : -90 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />

              {/* Box right side */}
              <motion.div
                className="absolute bottom-2 right-0 h-12 w-2 origin-bottom bg-amber-700"
                initial={{ rotateY: 90 }}
                animate={{ rotateY: phase >= 3 ? 0 : 90 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              />

              {/* Box back */}
              <motion.div
                className="absolute bottom-2 left-2 right-2 h-12 origin-bottom bg-amber-600"
                initial={{ rotateX: 90 }}
                animate={{ rotateX: phase >= 4 ? 0 : 90 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />

              {/* Product inside box (appears after drop) */}
              {phase >= 5 && (
                <motion.div
                  className="absolute bottom-3 left-1/2 h-8 w-8 -translate-x-1/2 rounded bg-gradient-to-br from-neon-cyan/80 to-neon-cyan/40"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Box top - left flap */}
              <motion.div
                className="absolute left-0 top-0 h-2 w-7 origin-left bg-amber-700"
                initial={{ rotateZ: -90 }}
                animate={{ rotateZ: phase >= 6 ? 0 : -90 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />

              {/* Box top - right flap */}
              <motion.div
                className="absolute right-0 top-0 h-2 w-7 origin-right bg-amber-700"
                initial={{ rotateZ: 90 }}
                animate={{ rotateZ: phase >= 6 ? 0 : 90 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
              />
            </div>
          </div>

          {/* Label stamper arm */}
          <motion.div
            className="absolute left-1/2 top-8 z-20 -translate-x-1/2"
            animate={{ y: phase === 7 ? 24 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="h-4 w-1 bg-gray-500" />
            <div className="h-3 w-6 -translate-x-2.5 rounded-b bg-gray-600">
              <div className="flex h-full items-center justify-center text-[8px]">📋</div>
            </div>
          </motion.div>

          {/* Label on box (appears after stamp) */}
          {phase >= 7 && (
            <motion.div
              className="absolute bottom-14 left-1/2 z-30 -translate-x-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded bg-white px-1 py-0.5 shadow-sm">
                <span className="font-mono text-[6px] font-bold text-gray-800">ANOMALY</span>
              </div>
            </motion.div>
          )}

          {/* Completed box moving out */}
          {phase >= 8 && (
            <motion.div
              className="absolute bottom-12 left-1/2 z-20"
              initial={{ x: "-50%", opacity: 1 }}
              animate={{ x: "100px", opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeIn" }}
            >
              <div className="relative h-14 w-14 rounded bg-amber-700 shadow-lg">
                <div className="absolute inset-1 rounded bg-amber-600" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                  📦
                </div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 rounded bg-white px-1">
                  <span className="font-mono text-[5px] font-bold text-gray-800">ANOMALY</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Conveyor belt */}
          <div className="absolute bottom-0 left-0 right-0 h-10 rounded bg-gradient-to-b from-gray-600 to-gray-700">
            <motion.div
              className="absolute inset-x-2 top-2 h-2 rounded bg-gray-800"
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, #555 0px, #555 15px, #444 15px, #444 30px)",
              }}
              animate={{ backgroundPositionX: ["0px", "-30px"] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            />
            {/* Belt rollers */}
            <div className="absolute bottom-1 left-4 h-2 w-2 rounded-full bg-gray-500" />
            <div className="absolute bottom-1 right-4 h-2 w-2 rounded-full bg-gray-500" />
          </div>
        </div>
      </div>

      {/* Stage label */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="font-mono text-xs text-terminal-amber/60">STAGE 07</div>
        <div className="font-mono text-2xl font-bold text-terminal-amber">PACKAGING</div>
        <motion.div className="mt-2 font-mono text-sm text-terminal-green/60">
          {getStatusText()}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// STAGE 8: DEPLOYMENT
// ============================================
function DeploymentStage({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);
  // Phase 0: Initial - rocket on pad
  // Phase 1: Ignition - flames appear
  // Phase 2: Liftoff - rocket rises
  // Phase 3: Success message

  useEffect(() => {
    if (!active) return;
    const timers = [
      setTimeout(() => setPhase(1), 400),   // Ignition
      setTimeout(() => setPhase(2), 1000),  // Liftoff
      setTimeout(() => setPhase(3), 1800),  // Success
    ];
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Container/Rocket */}
      <motion.div
        className="relative z-10"
        animate={{
          y: phase >= 2 ? "-50vh" : 0,
          scale: phase >= 2 ? 0.6 : 1,
          opacity: phase >= 2 ? 0 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeIn" }}
      >
        {/* Docker container styled rocket */}
        <div className="relative">
          {/* Container body */}
          <div className="h-28 w-20 rounded-t-3xl bg-gradient-to-b from-neon-cyan to-neon-cyan/70 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
            {/* Docker whale logo area */}
            <div className="flex h-full flex-col items-center justify-center">
              <div className="text-3xl">🐳</div>
              <div className="mt-1 font-mono text-[10px] font-bold text-dark-900">DEPLOY</div>
            </div>
          </div>
          
          {/* Container base */}
          <div className="h-3 w-20 bg-gray-600" />
          
          {/* Rocket flames - appear at ignition */}
          {phase >= 1 && phase < 3 && (
            <motion.div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-8 w-6 rounded-b-full bg-gradient-to-t from-terminal-amber via-orange-500 to-yellow-400" />
              <motion.div
                className="absolute left-1/2 top-0 h-10 w-4 -translate-x-1/2 rounded-b-full bg-gradient-to-t from-orange-600 to-yellow-300"
                animate={{ scaleY: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.1, repeat: Infinity }}
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Launch platform */}
      <div className="absolute bottom-32 left-1/2 h-3 w-32 -translate-x-1/2 rounded bg-gray-700">
        <div className="absolute -left-3 -top-6 h-8 w-1.5 bg-gray-600" />
        <div className="absolute -right-3 -top-6 h-8 w-1.5 bg-gray-600" />
      </div>

      {/* Smoke/steam at base - appears during ignition and liftoff */}
      {phase >= 1 && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-3 w-3 rounded-full bg-gray-400/40"
              initial={{ x: 0, y: 0, scale: 0 }}
              animate={{
                x: (i % 2 === 0 ? 1 : -1) * (15 + i * 8),
                y: -(5 + i * 6),
                scale: [0, 1.5, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Success message */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            className="absolute inset-x-4 top-1/3 text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="font-mono text-4xl font-bold text-terminal-green sm:text-5xl md:text-6xl"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(0,255,65,0.5)",
                  "0 0 40px rgba(0,255,65,0.8)",
                  "0 0 20px rgba(0,255,65,0.5)",
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              DEPLOYED ✓
            </motion.div>
            <motion.div 
              className="mt-4 font-mono text-base text-terminal-green/60 sm:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Project is now live!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage label - hidden after launch */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase >= 2 ? 0 : 1, y: 0 }}
      >
        <div className="font-mono text-xs text-neon-cyan/60">STAGE 08</div>
        <div className="font-mono text-2xl font-bold text-neon-cyan">DEPLOYMENT</div>
        <motion.div className="mt-2 font-mono text-sm text-terminal-green/60">
          {phase === 0 ? "Preparing launch..." : phase === 1 ? "Ignition!" : "Launching..."}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}