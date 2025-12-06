"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { TransitionProvider } from "./transition-provider";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Reset scroll lock whenever route changes
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    
    // Force scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <TransitionProvider>
      {children}
    </TransitionProvider>
  );
}