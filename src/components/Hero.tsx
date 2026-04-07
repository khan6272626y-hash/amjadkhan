import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-shoe.jpg";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

const words = ["Collection", "Experience", "Performance", "Innovation"];

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Typewriter effect
  useEffect(() => {
    const current = words[wordIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length - 1 === 0) {
          setDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, deleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  // Parallax scroll
  useEffect(() => {
    const handler = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative h-[100vh] min-h-[600px] overflow-hidden hero-gradient flex items-center -mt-16">
      {/* Parallax background */}
      <img
        src={heroImg}
        alt="Premium sneaker"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover opacity-50 will-change-transform"
        style={{ transform: `translateY(${offsetY * 0.35}px) scale(1.1)` }}
      />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90 pointer-events-none" />

      {/* Smoke animation overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="smoke-particle smoke-1" />
        <div className="smoke-particle smoke-2" />
        <div className="smoke-particle smoke-3" />
        <div className="smoke-particle smoke-4" />
        <div className="smoke-particle smoke-5" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl" style={{ transform: `translateY(${offsetY * -0.15}px)` }}>
          <p className="text-primary-foreground/60 text-xs font-medium tracking-[0.3em] uppercase mb-6 animate-hero-label">
            — New Season 2026
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-2 animate-hero-title">
            <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
              Premium Jogger Shoes
            </span>
          </h1>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 animate-hero-title-2">
            <span className="bg-gradient-to-r from-white/80 to-white/40 bg-clip-text text-transparent">
              {displayed}
            </span>
            <span className="inline-block w-[3px] h-[0.8em] bg-white/70 ml-1 animate-blink align-middle" />
          </h1>
          <p className="text-primary-foreground/50 text-lg md:text-xl mb-10 max-w-lg animate-hero-desc font-light tracking-wide">
            Elevate every step with engineered comfort and iconic style.
          </p>
          <div className="flex items-center gap-4 animate-hero-cta">
            <Link to="/category/new">
              <Button size="lg" className="rounded-full px-10 py-6 text-sm font-semibold tracking-wide bg-white text-foreground hover:bg-white/90 shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105">
                Shop Now
              </Button>
            </Link>
            <Link to="/category/best">
              <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-sm font-semibold tracking-wide border-white/30 text-white hover:bg-white/10 transition-all duration-300">
                Best Sellers
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button onClick={scrollDown} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce-slow group">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/40 text-xs tracking-widest uppercase group-hover:text-white/70 transition-colors">Scroll</span>
          <ChevronDown size={20} className="text-white/40 group-hover:text-white/70 transition-colors" />
        </div>
      </button>
    </section>
  );
};

export default Hero;
