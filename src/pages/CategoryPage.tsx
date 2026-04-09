import { useParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useProductsByCategory } from "@/hooks/useProducts";
import { Loader2, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

const titles: Record<string, string> = {
  men: "Men Shoes",
  women: "Women Shoes",
  sports: "Sports Shoes",
  kids: "Kids Shoes",
  casual: "Casual Shoes",
  new: "New Arrivals",
  best: "Best Sellers",
};

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "rating";

const sortLabels: Record<SortOption, string> = {
  default: "Default",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name: A-Z",
  "name-desc": "Name: Z-A",
  rating: "Top Rated",
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const title = titles[slug || ""] || "All Shoes";
  const { data: products = [], isLoading } = useProductsByCategory(slug);

  const [sort, setSort] = useState<SortOption>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  const minPrice = useMemo(() => Math.min(...products.map((p) => p.price), 0), [products]);
  const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price), 500), [products]);

  const filtered = useMemo(() => {
    let result = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return result;
  }, [products, sort, priceRange]);

  return (
    <div>
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-2">Browse</p>
            <h1 className="text-4xl font-bold">{title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{filtered.length} products</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm font-medium hover:bg-accent transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none bg-card border border-border rounded-full px-4 py-2 pr-8 text-sm font-medium cursor-pointer hover:bg-accent transition-colors outline-none"
              >
                {Object.entries(sortLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mb-8 p-6 bg-card rounded-2xl border border-border animate-fade-in">
            <h3 className="font-semibold text-sm mb-4">Price Range</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">$</span>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  min={minPrice}
                  max={priceRange[1]}
                  className="w-20 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-foreground transition-colors"
                />
              </div>
              <span className="text-muted-foreground">—</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">$</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  min={priceRange[0]}
                  max={maxPrice}
                  className="w-20 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-foreground transition-colors"
                />
              </div>
              <button
                onClick={() => setPriceRange([minPrice, maxPrice])}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
            <button
              onClick={() => { setPriceRange([minPrice, maxPrice]); setSort("default"); }}
              className="text-sm text-primary hover:underline mt-2"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
