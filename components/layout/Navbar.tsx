"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "writings", label: "Writings" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const current = NAV_ITEMS.map((item) => item.id).find((id) => {
        const element = document.getElementById(id);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (current) setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-500 ease-instrument",
        isScrolled ? "border-b border-line bg-ink-950/90 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
        <button
          onClick={() => scrollToSection("home")}
          className="font-mono text-sm tracking-[0.15em] text-white/80 transition-colors hover:text-signal"
        >
          AVAN <span className="text-white/30">::</span> LAB
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "relative px-4 py-2 font-mono text-xs tracking-wide transition-colors duration-300",
                activeSection === item.id ? "text-signal" : "text-white/50 hover:text-white/80"
              )}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute inset-x-4 -bottom-[1px] h-px bg-signal" />
              )}
            </button>
          ))}
        </div>

        <MobileMenu navItems={NAV_ITEMS} scrollToSection={scrollToSection} activeSection={activeSection} />

        <div className="hidden items-center gap-2 lg:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_6px_rgba(110,231,192,0.7)]" />
          <span className="font-mono text-[11px] tracking-wide text-white/40">ONLINE</span>
        </div>
      </div>
    </nav>
  );
}

function MobileMenu({
  navItems,
  scrollToSection,
  activeSection,
}: {
  navItems: Array<{ id: string; label: string }>;
  scrollToSection: (id: string) => void;
  activeSection: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex flex-col gap-1.5 p-2"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span className={cn("h-px w-6 bg-white/70 transition-transform duration-300 ease-instrument", isOpen && "translate-y-[7px] rotate-45")} />
        <span className={cn("h-px w-6 bg-white/70 transition-opacity duration-300", isOpen && "opacity-0")} />
        <span className={cn("h-px w-6 bg-white/70 transition-transform duration-300 ease-instrument", isOpen && "-translate-y-[7px] -rotate-45")} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-ink-950/98 backdrop-blur-lg">
          <div className="flex min-h-screen flex-col items-center justify-center gap-8">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "font-mono text-2xl tracking-wide transition-colors",
                  activeSection === item.id ? "text-signal" : "text-white/50"
                )}
                style={{ animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s both` }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
