"use client";

import { Suspense, lazy } from "react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Writings from "@/components/sections/Writings";
import Navbar from "@/components/layout/Navbar";

// Lazy load heavy 3D components for better performance
const PrometheusReactor = lazy(() => import("@/components/effects/PrometheusReactor"));

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen scroll-smooth">
        <Suspense fallback={<div className="fixed inset-0 bg-dark-900" />}>
          <PrometheusReactor />
        </Suspense>
        <div id="home">
          <Hero />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="writings">
          <Writings />
        </div>
        {/* Projects and Contact coming next */}
      </main>
    </>
  );
}