"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["home", "about", "writings", "projects", "contact"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "home", label: "HOME" },
    { id: "about", label: "ABOUT" },
    { id: "writings", label: "WRITINGS" },
    { id: "projects", label: "PROJECTS" },
    { id: "contact", label: "CONTACT" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-terminal-green/30 bg-dark-900/95 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Logo / Brand */}
        <button
          onClick={() => scrollToSection("home")}
          className="group relative font-mono text-xl font-bold text-terminal-green transition-all hover:text-terminal-amber md:text-2xl"
        >
          <span className="relative z-10">AVAN</span>
          <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 text-neon-pink opacity-0 transition-all group-hover:opacity-100">
            AVAN
          </span>
          <span className="text-terminal-green/60">::</span>
          <span className="relative z-10">LAB</span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "group relative px-4 py-2 font-mono text-sm transition-all",
                activeSection === item.id
                  ? "text-terminal-green"
                  : "text-terminal-green/60 hover:text-terminal-green"
              )}
            >
              <span className="relative z-10">{item.label}</span>
              
              {/* Active indicator */}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-terminal-green" />
              )}
              
              {/* Hover effect */}
              <span className="absolute inset-0 border border-terminal-green/0 transition-all group-hover:border-terminal-green/30" />
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <MobileMenu navItems={navItems} scrollToSection={scrollToSection} activeSection={activeSection} />

        {/* Status Indicator */}
        <div className="hidden items-center gap-2 lg:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-terminal-green" />
          <span className="font-mono text-xs text-terminal-green/60">ONLINE</span>
        </div>
      </div>

      {/* Scanline effect on scroll */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-terminal-green to-transparent opacity-50" />
      )}
    </nav>
  );
}

// Mobile Menu Component
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
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex flex-col gap-1.5 p-2"
        aria-label="Toggle menu"
      >
        <span
          className={cn(
            "h-0.5 w-6 bg-terminal-green transition-all",
            isOpen && "translate-y-2 rotate-45"
          )}
        />
        <span
          className={cn(
            "h-0.5 w-6 bg-terminal-green transition-all",
            isOpen && "opacity-0"
          )}
        />
        <span
          className={cn(
            "h-0.5 w-6 bg-terminal-green transition-all",
            isOpen && "-translate-y-2 -rotate-45"
          )}
        />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-dark-900/98 backdrop-blur-lg">
          <div className="flex min-h-screen flex-col items-center justify-center gap-8">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "font-mono text-3xl transition-all hover:text-terminal-amber",
                  activeSection === item.id
                    ? "text-terminal-green"
                    : "text-terminal-green/60"
                )}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <span className="relative">
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-terminal-green">
                      →
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}