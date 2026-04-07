import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import CategoryBanner from "@/components/CategoryBanner";
import { products } from "@/data/products";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ScrollReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
};

const Index = () => {
  const featured = products.filter((p) => p.tag);
  const newArrivals = products.filter((p) => p.tag === "new");

  return (
    <div>
      <Hero />

      {/* Marquee banner */}
      <div className="bg-foreground text-background py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-medium tracking-widest uppercase">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>Free Shipping Over $150</span>
              <span className="w-1.5 h-1.5 rounded-full bg-background/30" />
              <span>Premium Quality</span>
              <span className="w-1.5 h-1.5 rounded-full bg-background/30" />
              <span>30-Day Returns</span>
              <span className="w-1.5 h-1.5 rounded-full bg-background/30" />
              <span>New Collection 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-background/30" />
            </span>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <section className="container mx-auto px-4 py-24">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-2">Curated Selection</p>
              <h2 className="text-4xl md:text-5xl font-bold">Featured Sneakers</h2>
            </div>
            <Link to="/category/best" className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {featured.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Stats banner */}
      <ScrollReveal>
        <section className="bg-foreground text-background py-16">
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "50K+", label: "Happy Customers" },
              { num: "200+", label: "Shoe Models" },
              { num: "4.9", label: "Average Rating" },
              { num: "15+", label: "Countries" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-bold mb-1">{s.num}</p>
                <p className="text-background/50 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <CategoryBanner />

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-24">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-2">Just Dropped</p>
              <h2 className="text-4xl md:text-5xl font-bold">New Arrivals</h2>
            </div>
            <Link to="/category/new" className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <ScrollReveal>
        <section className="container mx-auto px-4 pb-24">
          <div className="bg-foreground text-background rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute rounded-full border border-background/20" style={{
                  width: `${200 + i * 100}px`,
                  height: `${200 + i * 100}px`,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }} />
              ))}
            </div>
            <div className="relative z-10">
              <p className="text-xs tracking-[0.3em] uppercase text-background/50 mb-4">Stay Updated</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the STRIDE Club</h2>
              <p className="text-background/50 max-w-md mx-auto mb-8">Get early access to new drops, exclusive deals, and style inspiration.</p>
              <div className="flex max-w-md mx-auto gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-background/10 border border-background/20 rounded-full px-6 py-3 text-sm text-background placeholder:text-background/40 outline-none focus:border-background/40 transition-colors"
                />
                <button className="bg-background text-foreground px-8 py-3 rounded-full text-sm font-semibold hover:bg-background/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
};

export default Index;
