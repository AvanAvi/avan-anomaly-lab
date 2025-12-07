"use client";

import { Suspense, lazy } from "react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Writings from "@/components/sections/Writings";
import Navbar from "@/components/layout/Navbar";
import Projects from "@/components/sections/Projects";
import ContactSection from '@/components/sections/ContactSection';

// Lazy load heavy 3D components for better performance
const PrometheusReactor = lazy(() => import("@/components/effects/PrometheusReactor"));

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen scroll-smooth">
        {/* Fixed positioning prevents layout shifts during loading */}
        <div className="fixed inset-0 -z-10">
          <Suspense fallback={null}>
            <PrometheusReactor />
          </Suspense>
        </div>
        
        <div id="home">
          <Hero />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="writings">
          <Writings />
        </div>
        <div id="projects">
          <Projects />
        </div>
        <div id="contact">
          <ContactSection />
        </div>

      </main>
    </>
  );
}