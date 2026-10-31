import { useEffect, useRef, useState } from "react";
import { Welcome } from "./components/portfolio/Welcome";
import { Cursor, Backdrop } from "./components/portfolio/Cursor";
import { Hero } from "./components/portfolio/Hero";
import { Story } from "./components/portfolio/Story";
import { Projects } from "./components/portfolio/Projects";
import { Island } from "./components/portfolio/Island";
import { Contact, confetti } from "./components/portfolio/Contact";
import { startSmoothScroll, stopSmoothScroll, smoothScrollTo } from "./lib/smooth";
import GhostCursor from "./components/ui/GhostCursor";
import ColorBends from "./components/ui/ColorBends";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function App() {
  const [stage, setStage] = useState<"loading" | "welcome" | "site">("loading");
  const clicks = useRef(0);

  useEffect(() => {
    document.title = "Koustava Ramesha";
    startSmoothScroll();
    let seen = false;
    try { seen = sessionStorage.getItem("kr-seen") === "1" || localStorage.getItem("kr-seen") === "1"; } catch { /* ignore */ }
    setStage(seen ? "site" : "welcome");
    return stopSmoothScroll;
  }, []);

  const enter = () => {
    try { localStorage.setItem("kr-seen", "1"); } catch { /* ignore */ }
    setStage("site");
    smoothScrollTo(0);
  };

  const surprise = () => { confetti(); document.documentElement.classList.toggle("theme-surprise"); };

  useEffect(() => {
    let i = 0;
    const k = (e: KeyboardEvent) => { i = e.key === KONAMI[i] ? i + 1 : e.key === KONAMI[0] ? 1 : 0; if (i === KONAMI.length) { i = 0; surprise(); } };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);

  const onLogo = () => { clicks.current++; if (clicks.current >= 5) { clicks.current = 0; surprise(); } };

  const replay = () => {
    document.body.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(0.85)", opacity: 0 }], { duration: 700, easing: "cubic-bezier(0.16,1,0.3,1)" }).onfinish = () => setStage("welcome");
  };

  if (stage === "loading") return <div className="fixed inset-0 bg-background" aria-busy="true" />;

  return (
    <>
      {/* Site-wide ColorBends background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <ColorBends
          colors={["#bea212"]}
          rotation={-38}
          speed={0.66}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={1}
          parallax={2}
          iterations={1}
          intensity={2}
          bandWidth={3}
          transparent
          autoRotate={2}
        />
      </div>

      {/* Site-wide ghost cursor trail */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]">
        <GhostCursor
          color="#B497CF"
          size={80}
          trailLength={50}
          inertia={0.5}
          turbulence={0.5}
          drift={0.3}
          bloomStrength={0.6}
          grainIntensity={0.05}
          detail={1}
          brightness={1}
          bloomRadius={1}
          edgeIntensity={0}
          fadeDelayMs={1000}
          fadeDurationMs={1500}
          clickPuff
          intro
          zIndex={0}
        />
      </div>

      <Cursor />
      {stage === "welcome" && <Welcome onEnter={enter} />}
      <main className="relative z-[2] transition-all duration-1000 ease-spring" style={{ opacity: stage === "site" ? 1 : 0, transform: stage === "site" ? "none" : "scale(0.92)" }}>
        <Backdrop />
        <Island onLogo={onLogo} />
        <Hero />
        <Story />
        <Projects />
        <Contact onReplay={replay} />
      </main>
    </>
  );
}
