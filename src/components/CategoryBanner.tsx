import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  { label: "Men Shoes", slug: "men", image: "shoe-2" },
  { label: "Women Shoes", slug: "women", image: "shoe-5" },
  { label: "Sports Shoes", slug: "sports", image: "shoe-3" },
];

const CategoryBanner = () => (
  <section className="container mx-auto px-4 py-20">
    <h2 className="text-3xl font-bold mb-10 text-center">Shop by Category</h2>
    <div className="grid md:grid-cols-3 gap-6">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          to={`/category/${cat.slug}`}
          className="group relative overflow-hidden rounded-xl aspect-[4/3] bg-card"
        >
          <img
            src={new URL(`../assets/${cat.image}.jpg`, import.meta.url).href}
            alt={cat.label}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-6 left-6 flex items-center gap-2">
            <span className="text-primary-foreground font-heading font-bold text-xl">{cat.label}</span>
            <ArrowRight className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default CategoryBanner;
