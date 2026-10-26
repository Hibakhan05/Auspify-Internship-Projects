import { useEffect, useState } from "react";
import { ScrollTrigger } from "../../lib/gsap";
import LandingNav from "./LandingNav";
import Hero from "./Hero";
import HeroSeam from "./HeroSeam";
import Features from "./Features";
import DemoInput from "./DemoInput";
import ConversionModal from "./ConversionModal";
import Footer from "./Footer";

export default function LandingPage({ onNavigate }) {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#11141A] text-[#FAF9F6] antialiased selection:bg-[#9EAF97] selection:text-[#11141A]">
      <LandingNav onNavigate={onNavigate} />
      <main>
        <Hero />
        <HeroSeam />
        <Features />
        <DemoInput onSubmit={() => setModalOpen(true)} />
      </main>
      <Footer />
      {modalOpen && (
        <ConversionModal
          onClose={() => setModalOpen(false)}
          onSignup={() => onNavigate("signup")}
        />
      )}
    </div>
  );
}