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
// STAGE 1: IDEATION - Character at desk with lightbulb moment
// ============================================
function IdeationStage({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Start typing
      setTimeout(() => setPhase(2), 1500),  // Stop, thinking
      setTimeout(() => setPhase(3), 2000),  // Lightbulb!
      setTimeout(() => setPhase(4), 2500),  // Excited typing
    ];
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Isometric room/desk setup */}
      <div className="relative" style={{ perspective: "1000px" }}>
        {/* Floor grid */}
        <div 
          className="absolute -bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 opacity-20"
          style={{
            background: "linear-gradient(90deg, #00ffff 1px, transparent 1px), linear-gradient(#00ffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            transform: `${ISO_TRANSFORM} translateZ(-50px)`,
          }}
        />

        {/* Desk - Isometric */}
        <motion.div
          className="relative"
          style={{ transform: "perspective(800px) rotateX(10deg)" }}
        >
          {/* Desk surface */}
          <div className="relative h-32 w-80 rounded-lg bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 shadow-2xl">
            {/* Desk edge highlight */}
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-lg bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600" />
            
            {/* Monitor */}
            <motion.div 
              className="absolute -top-24 left-1/2 -translate-x-1/2"
              animate={{ 
                filter: phase >= 1 ? "brightness(1.2)" : "brightness(0.8)" 
              }}
            >
              {/* Monitor frame */}
              <div className="relative h-20 w-32 rounded-sm border-2 border-gray-600 bg-dark-900">
                {/* Screen content */}
                <div className="absolute inset-1 overflow-hidden rounded-sm bg-dark-800">
                  {/* Code lines */}
                  {phase >= 1 && (
                    <motion.div className="space-y-1 p-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-1 rounded bg-terminal-green/60"
                          initial={{ width: 0 }}
                          animate={{ width: `${40 + Math.random() * 50}%` }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                        />
                      ))}
                    </motion.div>
                  )}
                  
                  {/* Screen glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/10 to-transparent" />
                </div>
                
                {/* Monitor stand */}
                <div className="absolute -bottom-4 left-1/2 h-4 w-4 -translate-x-1/2 bg-gray-700" />
                <div className="absolute -bottom-5 left-1/2 h-1 w-12 -translate-x-1/2 rounded bg-gray-600" />
              </div>
            </motion.div>

            {/* Keyboard */}
            <motion.div 
              className="absolute bottom-4 left-1/2 h-6 w-24 -translate-x-1/2 rounded-sm bg-gray-800"
              animate={{
                boxShadow: phase === 1 || phase === 4 
                  ? "0 0 10px rgba(0, 255, 255, 0.3)" 
                  : "none"
              }}
            >
              {/* Keys indication */}
              <div className="grid h-full w-full grid-cols-10 gap-px p-1">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-sm bg-gray-700"
                    animate={{
                      backgroundColor: (phase === 1 || phase === 4) && Math.random() > 0.7 
                        ? "#00ffff" 
                        : "#374151"
                    }}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Coffee mug */}
            <div className="absolute bottom-3 right-6 h-5 w-4 rounded-b-lg bg-gray-600">
              <div className="absolute -right-1 top-1 h-3 w-2 rounded-r-full border-2 border-gray-600 bg-transparent" />
              {/* Steam */}
              <motion.div
                className="absolute -top-3 left-1/2 text-[8px] text-gray-500"
                animate={{ y: [-2, -6, -2], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ~
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Character - Person in hoodie */}
        <motion.div
          className="absolute -top-12 left-1/2 -translate-x-1/2"
          animate={{
            y: phase === 3 ? -5 : 0,
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Head */}
          <motion.div 
            className="relative mx-auto h-10 w-8 rounded-full bg-gradient-to-b from-amber-200 to-amber-300"
            animate={{
              rotateZ: phase === 2 ? [0, -5, 5, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Hair */}
            <div className="absolute -top-1 left-0 right-0 h-4 rounded-t-full bg-gray-900" />
            {/* Eyes */}
            <div className="absolute top-4 flex w-full justify-center gap-2">
              <motion.div 
                className="h-1 w-1 rounded-full bg-gray-900"
                animate={{ scaleY: phase === 3 ? [1, 1.5, 1] : 1 }}
              />
              <motion.div 
                className="h-1 w-1 rounded-full bg-gray-900"
                animate={{ scaleY: phase === 3 ? [1, 1.5, 1] : 1 }}
              />
            </div>
          </motion.div>

          {/* Hoodie body */}
          <div className="relative -mt-1 h-14 w-16 rounded-b-lg bg-gradient-to-b from-gray-700 to-gray-800">
            {/* Hood */}
            <div className="absolute -top-2 left-1/2 h-6 w-12 -translate-x-1/2 rounded-t-full bg-gray-700" />
            {/* Hoodie pocket */}
            <div className="absolute bottom-2 left-1/2 h-3 w-10 -translate-x-1/2 rounded-b border-t border-gray-600 bg-gray-750" />
            
            {/* Arms on keyboard */}
            <motion.div
              className="absolute -bottom-2 left-0 h-3 w-8 rounded-full bg-gray-700"
              style={{ transform: "rotate(-20deg)" }}
              animate={{
                y: phase === 1 || phase === 4 ? [0, -1, 0] : 0,
              }}
              transition={{ duration: 0.15, repeat: phase === 1 || phase === 4 ? Infinity : 0 }}
            />
            <motion.div
              className="absolute -bottom-2 right-0 h-3 w-8 rounded-full bg-gray-700"
              style={{ transform: "rotate(20deg)" }}
              animate={{
                y: phase === 1 || phase === 4 ? [0, -1, 0] : 0,
              }}
              transition={{ duration: 0.15, repeat: phase === 1 || phase === 4 ? Infinity : 0, delay: 0.075 }}
            />
          </div>

          {/* Headphones */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <div className="absolute -left-5 top-2 h-4 w-2 rounded-l-full bg-gray-600" />
            <div className="absolute -right-5 top-2 h-4 w-2 rounded-r-full bg-gray-600" />
            <div className="absolute -top-1 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-gray-600" />
          </div>
        </motion.div>

        {/* Lightbulb - Appears on phase 3 */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              className="absolute -top-32 left-1/2"
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {/* Thought bubble dots */}
              <motion.div
                className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="h-1 w-1 rounded-full bg-terminal-amber/60" />
                <div className="h-1.5 w-1.5 rounded-full bg-terminal-amber/60" />
                <div className="h-2 w-2 rounded-full bg-terminal-amber/60" />
              </motion.div>

              {/* Lightbulb */}
              <motion.div
                className="relative"
                animate={{
                  filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <svg width="40" height="50" viewBox="0 0 40 50">
                  {/* Bulb glow */}
                  <motion.circle
                    cx="20"
                    cy="18"
                    r="18"
                    fill="url(#bulbGlow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  {/* Bulb glass */}
                  <path
                    d="M20 2 C30 2 36 10 36 18 C36 26 28 32 28 36 L12 36 C12 32 4 26 4 18 C4 10 10 2 20 2"
                    fill="#ffb000"
                    stroke="#ff8c00"
                    strokeWidth="1"
                  />
                  {/* Bulb base */}
                  <rect x="12" y="36" width="16" height="4" fill="#666" rx="1" />
                  <rect x="14" y="40" width="12" height="3" fill="#555" rx="1" />
                  <rect x="16" y="43" width="8" height="2" fill="#444" rx="1" />
                  {/* Filament */}
                  <path
                    d="M16 28 Q20 20 24 28"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <defs>
                    <radialGradient id="bulbGlow">
                      <stop offset="0%" stopColor="#ffb000" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ffb000" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>

                {/* Rays */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-4 h-4 w-0.5 bg-terminal-amber"
                    style={{
                      transformOrigin: "bottom center",
                      transform: `rotate(${i * 45}deg) translateY(-24px)`,
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: [0, 1, 0] }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.8, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stage label */}
      <motion.div
        className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="font-mono text-xs text-terminal-amber/60">STAGE 01</div>
        <div className="font-mono text-2xl font-bold text-terminal-amber">IDEATION</div>
        <motion.div 
          className="mt-2 font-mono text-sm text-terminal-green/60"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {phase < 3 ? "Processing thoughts..." : "💡 Eureka!"}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// STAGE 2: DESIGN - Blueprint unfolds with wireframes
// ============================================
function DesignStage({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Paper unfolds
      setTimeout(() => setPhase(2), 800),   // Grid appears
      setTimeout(() => setPhase(3), 1200),  // Wireframes draw
      setTimeout(() => setPhase(4), 2000),  // Annotations
    ];
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Blueprint paper - Isometric */}
      <motion.div
        className="relative"
        style={{ perspective: "1000px" }}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ 
          rotateX: phase >= 1 ? 0 : -90,
          opacity: phase >= 1 ? 1 : 0,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Main blueprint */}
        <div 
          className="relative h-80 w-[500px] rounded border-2 border-neon-cyan/30 bg-dark-800/90 p-6"
          style={{
            backgroundImage: phase >= 2 
              ? "linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px)"
              : "none",
            backgroundSize: "20px 20px",
          }}
        >
          {/* Blueprint header */}
          <div className="mb-4 flex items-center justify-between border-b border-neon-cyan/20 pb-2">
            <div className="font-mono text-xs text-neon-cyan/60">PROJECT_BLUEPRINT_v1.0</div>
            <div className="font-mono text-xs text-neon-cyan/60">SCALE: 1:1</div>
          </div>

          {/* Wireframe components - drawn progressively */}
          <div className="relative h-full">
            {/* Main app wireframe */}
            {phase >= 3 && (
              <motion.div
                className="absolute left-4 top-4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              >
                <svg width="200" height="150" className="overflow-visible">
                  {/* Browser window */}
                  <motion.rect
                    x="0" y="0" width="180" height="120"
                    fill="none"
                    stroke="#00ffff"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Title bar */}
                  <motion.line
                    x1="0" y1="20" x2="180" y2="20"
                    stroke="#00ffff"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  />
                  {/* Window buttons */}
                  <motion.circle cx="12" cy="10" r="4" fill="#ff006e" 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} />
                  <motion.circle cx="26" cy="10" r="4" fill="#ffb000"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.45 }} />
                  <motion.circle cx="40" cy="10" r="4" fill="#00ff41"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
                  
                  {/* Sidebar */}
                  <motion.rect
                    x="5" y="25" width="40" height="90"
                    fill="none"
                    stroke="#00ffff"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  />
                  
                  {/* Content area */}
                  <motion.rect
                    x="50" y="25" width="125" height="60"
                    fill="none"
                    stroke="#00ffff"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  />
                  
                  {/* Cards */}
                  {[0, 1, 2].map((i) => (
                    <motion.rect
                      key={i}
                      x={55 + i * 42}
                      y="90"
                      width="38"
                      height="25"
                      fill="none"
                      stroke="#00ffff"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                    />
                  ))}
                </svg>
              </motion.div>
            )}

            {/* Component diagram */}
            {phase >= 3 && (
              <motion.div
                className="absolute right-4 top-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <svg width="140" height="150">
                  {/* Component boxes */}
                  {["API", "DB", "UI"].map((label, i) => (
                    <g key={label}>
                      <motion.rect
                        x="30"
                        y={10 + i * 45}
                        width="80"
                        height="35"
                        fill="rgba(0,255,255,0.1)"
                        stroke="#00ffff"
                        strokeWidth="1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + i * 0.15 }}
                      />
                      <motion.text
                        x="70"
                        y={32 + i * 45}
                        fill="#00ffff"
                        fontSize="12"
                        textAnchor="middle"
                        fontFamily="monospace"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 + i * 0.15 }}
                      >
                        {label}
                      </motion.text>
                    </g>
                  ))}
                  {/* Connecting arrows */}
                  <motion.path
                    d="M70 45 L70 55 M70 90 L70 100"
                    stroke="#00ff41"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.5, duration: 0.3 }}
                  />
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#00ff41" />
                    </marker>
                  </defs>
                </svg>
              </motion.div>
            )}

            {/* Annotations */}
            {phase >= 4 && (
              <>
                <motion.div
                  className="absolute bottom-16 left-4 font-mono text-[10px] text-terminal-amber"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ← Main Interface
                </motion.div>
                <motion.div
                  className="absolute bottom-16 right-4 font-mono text-[10px] text-terminal-amber"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Architecture →
                </motion.div>
                
                {/* Dimension lines */}
                <motion.div
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="h-px flex-1 bg-neon-cyan/30" />
                  <span className="mx-2 font-mono text-[10px] text-neon-cyan/60">480px</span>
                  <div className="h-px flex-1 bg-neon-cyan/30" />
                </motion.div>
              </>
            )}
          </div>

          {/* Corner markers */}
          {[
            "top-0 left-0 border-t-2 border-l-2",
            "top-0 right-0 border-t-2 border-r-2",
            "bottom-0 left-0 border-b-2 border-l-2",
            "bottom-0 right-0 border-b-2 border-r-2",
          ].map((classes, i) => (
            <motion.div
              key={i}
              className={`absolute h-4 w-4 border-neon-cyan ${classes}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}
        </div>

        {/* Floating tools */}
        <motion.div
          className="absolute -right-16 top-1/2 flex -translate-y-1/2 flex-col gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 20 }}
        >
          {["📐", "✏️", "📏"].map((tool, i) => (
            <motion.div
              key={i}
              className="flex h-10 w-10 items-center justify-center rounded border border-neon-cyan/30 bg-dark-800 text-lg"
              whileHover={{ scale: 1.1 }}
              animate={{ y: [0, -3, 0] }}
              transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
            >
              {tool}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Stage label */}
      <motion.div
        className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="font-mono text-xs text-neon-cyan/60">STAGE 02</div>
        <div className="font-mono text-2xl font-bold text-neon-cyan">DESIGN</div>
        <motion.div 
          className="mt-2 font-mono text-sm text-terminal-green/60"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Architecting the solution...
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