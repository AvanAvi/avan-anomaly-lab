import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Writings from "@/components/sections/Writings";
import PrometheusReactor from "@/components/effects/PrometheusReactor";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <PrometheusReactor />
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