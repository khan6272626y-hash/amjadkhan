import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const categories = [
  { label: "Men Shoes", slug: "men", image: "shoe-2" },
  { label: "Women Shoes", slug: "women", image: "shoe-5" },
  { label: "Sports Shoes", slug: "sports", image: "shoe-3" },
];

const CategoryBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="container mx-auto px-4 py-24">
      <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-2">Browse</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-12">Shop by Category</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className={`group relative overflow-hidden rounded-2xl aspect-[4/3] bg-card transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <img
              src={new URL(`../assets/${cat.image}.jpg`, import.meta.url).href}
              alt={cat.label}
              loading="lazy"
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              <div>
                <span className="text-white font-heading font-bold text-2xl block mb-1">{cat.label}</span>
                <span className="text-white/50 text-xs tracking-widest uppercase">Explore Collection</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowRight className="text-white" size={18} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryBanner;
