import { useParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";

import { products } from "@/data/products";

const titles: Record<string, string> = {
  men: "Men Shoes",
  women: "Women Shoes",
  sports: "Sports Shoes",
  kids: "Kids Shoes",
  casual: "Casual Shoes",
  new: "New Arrivals",
  best: "Best Sellers",
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const title = titles[slug || ""] || "All Shoes";

  const filtered = slug === "new"
    ? products.filter((p) => p.tag === "new")
    : slug === "best"
    ? products.filter((p) => p.tag === "best")
    : products.filter((p) => p.category === slug);

  return (
    <div>
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-10">{title}</h1>
        {filtered.length === 0 ? (
          <p className="text-muted-foreground">No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
