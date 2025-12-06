"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef, lazy, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";

// Lazy load heavy transition components for better performance
const EMDriveTransition = lazy(() => import("@/components/effects/EMDriveTransition"));
const PhilosophyTransition = lazy(() => import("@/components/effects/PhilosophyTransition"));
const ReadingTransition = lazy(() => import("@/components/effects/ReadingTransition"));
const ProjectsTransition = lazy(() => import("@/components/effects/ProjectsTransition"));

type TransitionType = 'science' | 'philosophy' | 'reading' | 'projects';

interface TransitionContextType {
  startTransition: (destination: string, type?: TransitionType) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [destination, setDestination] = useState<string>("");
  const [transitionType, setTransitionType] = useState<TransitionType>('science');
  const [animationComplete, setAnimationComplete] = useState(false);
  const startPathRef = useRef<string>("");

  // Ensure scroll is always enabled on mount (in case it was locked previously)
  useEffect(() => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }, []);

  // Watch for route changes - only unmount transition AFTER route has changed
  useEffect(() => {
    if (animationComplete && pathname !== startPathRef.current && pathname === destination) {
      // Route has changed to destination - safe to unmount transition
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      setIsTransitioning(false);
      setAnimationComplete(false);
    }
  }, [pathname, animationComplete, destination]);

  const startTransition = (dest: string, type: TransitionType = 'science') => {
    // Store the starting path so we can detect when navigation completes
    startPathRef.current = pathname;
    
    // Scroll to top and lock scroll
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    setDestination(dest);
    setTransitionType(type);
    setAnimationComplete(false);
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    // Mark animation as complete and navigate
    // The overlay will stay visible until useEffect detects the route change
    setAnimationComplete(true);
    router.push(destination);
  };

  // Select the appropriate transition component based on type
  const renderTransition = () => {
    const props = { onComplete: handleTransitionComplete };
    
    switch (transitionType) {
      case 'philosophy':
        return <PhilosophyTransition {...props} />;
      case 'reading':
        return <ReadingTransition {...props} />;
      case 'projects':
        return <ProjectsTransition {...props} />;
      case 'science':
      default:
        return <EMDriveTransition {...props} />;
    }
  };

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}
      {isTransitioning && (
        <Suspense fallback={<div className="fixed inset-0 z-[9999] bg-dark-900" />}>
          <div className="fixed inset-0 z-[9999] bg-dark-900">
            {renderTransition()}
          </div>
        </Suspense>
      )}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within TransitionProvider");
  }
  return context;
}