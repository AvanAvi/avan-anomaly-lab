"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface SignalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

/**
 * The two CTA treatments used throughout the instrument design system.
 * Primary: signal-colored, fills on hover. Ghost: hairline border, brightens
 * on hover. Both settle with the same instrument easing, no bounce.
 */
export default function SignalButton({
  variant = "primary",
  className,
  children,
  ...props
}: SignalButtonProps) {
  return (
    <button
      className={cn(
        "group relative overflow-hidden px-7 py-3.5 font-mono text-sm tracking-wide transition-colors duration-500 ease-instrument",
        variant === "primary"
          ? "border border-signal/40 text-signal hover:text-ink-950"
          : "border border-line-strong text-white/70 hover:border-white/40 hover:text-white",
        className
      )}
      {...props}
    >
      {variant === "primary" && (
        <span className="absolute inset-0 -translate-x-full bg-signal transition-transform duration-500 ease-instrument group-hover:translate-x-0" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
