"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Tag = keyof JSX.IntrinsicElements;

interface RevealProps {
  children: React.ReactNode;
  as?: Tag;
  delay?: number;
  className?: string;
  /** Distance the content settles in from, in pixels. */
  distance?: number;
}

/**
 * Scroll reveal primitive used across the instrument design system.
 * Settles content into place with a single, physically coherent motion
 * rather than a generic fade. Disabled entirely under reduced motion.
 */
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  className,
  distance = 24,
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion(as) as typeof motion.div;

  if (prefersReducedMotion) {
    const Static = as as "div";
    return <Static className={className}>{children}</Static>;
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
