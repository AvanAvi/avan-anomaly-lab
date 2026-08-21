"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Writings from "@/components/sections/Writings";
import Navbar from "@/components/layout/Navbar";
import Projects from "@/components/sections/Projects";
import ContactSection from "@/components/sections/ContactSection";
import FieldBackground from "@/components/effects/FieldBackground";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen scroll-smooth">
        <FieldBackground />

        <div id="home" className="scroll-mt-20">
          <Hero />
        </div>
        <div id="about" className="scroll-mt-20">
          <About />
        </div>
        <div id="writings" className="scroll-mt-20">
          <Writings />
        </div>
        <div id="projects" className="scroll-mt-20">
          <Projects />
        </div>
        <div id="contact" className="scroll-mt-20">
          <ContactSection />
        </div>
      </main>
    </>
  );
}