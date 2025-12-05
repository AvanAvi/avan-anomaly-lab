"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import EMDriveTransition from "@/components/effects/EMDriveTransition";

interface TransitionContextType {
  startTransition: (destination: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [destination, setDestination] = useState<string>("");

  const startTransition = (dest: string) => {
    // Scroll to top and lock scroll
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    setDestination(dest);
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    // Navigate after animation completes
    window.location.href = destination;
  };

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}
      {isTransitioning && (
        <div className="fixed inset-0 z-[9999]">
          <EMDriveTransition onComplete={handleTransitionComplete} />
        </div>
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