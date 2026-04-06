import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import CategoryBanner from "@/components/CategoryBanner";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

const Index = () => (
  <div>
    <Hero />

    <section className="container mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold mb-10 text-center">Featured Sneakers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>

    <CategoryBanner />
    <Footer />
  </div>
);

export default Index;
