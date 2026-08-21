// components/ui/FlightPathAnimation.tsx
// Animated flight path showing message travel distance

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================
// CONSTANTS
// ============================================

// "The Lab" - Plage de la Croisette, Cannes, France
const LAB_LOCATION = {
  lat: 43.5510,
  lng: 7.0175,
  name: 'Cannes',
  country: 'France',
};

// ============================================
// HAVERSINE FORMULA - Calculate geodesic distance
// ============================================

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// ============================================
// TYPES
// ============================================

interface FlightPathAnimationProps {
  userLocation: {
    lat: number;
    lng: number;
    city: string | null;
    country: string | null;
  } | null;
  showAnimation: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function FlightPathAnimation({
  userLocation,
  showAnimation,
}: FlightPathAnimationProps) {
  const [displayDistance, setDisplayDistance] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Calculate actual distance
  const actualDistance = userLocation
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        LAB_LOCATION.lat,
        LAB_LOCATION.lng
      )
    : 0;

  // Animate the distance counter
  useEffect(() => {
    if (!showAnimation || !actualDistance) return;

    // Phase 1: Start animation
    setAnimationPhase(1);

    // Animate distance counter
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const animateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayDistance(Math.round(actualDistance * eased));

      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        // Phase 2: Show message
        setTimeout(() => setAnimationPhase(2), 500);
      }
    };

    requestAnimationFrame(animateCounter);
  }, [showAnimation, actualDistance]);

  if (!showAnimation || !userLocation) return null;

  const userCity = userLocation.city || 'Your location';
  const userCountry = userLocation.country || '';

  return (
    <motion.div
      className="my-6 overflow-hidden border border-signal/30 bg-ink-900/50 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Flight Path Visualization */}
      <div className="relative mb-4 h-20">
        {/* Connection Line */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 300 60"
          preserveAspectRatio="none"
        >
          {/* Dotted arc path */}
          <motion.path
            d="M 30 45 Q 150 -10 270 45"
            fill="none"
            stroke="rgba(110, 231, 192, 0.3)"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          
          {/* Animated plane along path */}
          <motion.g
            initial={{ offsetDistance: '0%' }}
            animate={{ offsetDistance: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            style={{
              offsetPath: 'path("M 30 45 Q 150 -10 270 45")',
            }}
          >
            <text
              fontSize="16"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              ✈️
            </text>
          </motion.g>
        </svg>

        {/* Start Point - User Location */}
        <motion.div
          className="absolute bottom-2 left-2 text-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="text-xl">📍</div>
          <p className="font-mono text-[10px] text-signal">
            {userCity}
          </p>
          {userCountry && (
            <p className="font-mono text-[8px] text-white/40">{userCountry}</p>
          )}
        </motion.div>

        {/* End Point - Cannes */}
        <motion.div
          className="absolute bottom-2 right-2 text-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <div className="text-xl">🏖️</div>
          <p className="font-mono text-[10px] text-signal">
            {LAB_LOCATION.name}
          </p>
          <p className="font-mono text-[8px] text-white/40">
            {LAB_LOCATION.country}
          </p>
        </motion.div>
      </div>

      {/* Distance Counter */}
      <motion.div
        className="mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="font-mono text-xs text-white/50">Your message traveled</p>
        <motion.p
          className="font-mono text-3xl font-bold text-signal"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
        >
          {displayDistance.toLocaleString()} km
        </motion.p>
      </motion.div>

      {/* Cheeky Message */}
      <motion.div
        className="border border-terminal-amber/20 bg-terminal-amber/5 p-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: animationPhase >= 2 ? 1 : 0, y: animationPhase >= 2 ? 0 : 10 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-xs leading-relaxed text-white/50">
          <span className="text-terminal-amber">Psst.</span> You didn&apos;t hear this from me, 
          but the crackhead who built this site? Currently unreachable. Last seen: 
          <span className="text-signal"> Plage de la Croisette, Cannes</span>. 
          Doing... let&apos;s say <span className="italic">&quot;research.&quot;</span>
        </p>
        <p className="mt-2 font-mono text-xs leading-relaxed text-white/40">
          I&apos;m just the website, I don&apos;t judge. But I DO deliver messages. 
          Eventually. When he checks his phone. <span className="italic">If</span> he checks his phone. 😎🍷
        </p>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// EXPORT UTILITY FOR USE IN OTHER COMPONENTS
// ============================================

export { calculateDistance, LAB_LOCATION };