import { useParams, Link } from "react-router-dom";
import { useState, useRef } from "react";
import { ShoppingBag, Heart, Star, ChevronLeft, Minus, Plus, Truck, RotateCcw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useFlyToCart } from "@/context/FlyToCartContext";
import { getProductDetail } from "@/data/productDetails";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductDetail(Number(id));
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { triggerFly } = useFlyToCart();
  const imgRef = useRef<HTMLImageElement>(null);

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/" className="text-primary underline">Back to shop</Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      triggerFly(product.image, rect);
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
    toast.success(`${product.name} added to cart`);
  };

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-foreground transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-card">
              <img
                ref={imgRef}
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {product.tag && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.tag === "new" ? "New" : "Best Seller"}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImage === i ? "border-primary shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1 capitalize">{product.category}</p>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold">{product.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Color{selectedColor && `: ${selectedColor}`}</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                      selectedColor === color
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Size (US)</h3>
                <button className="text-sm text-primary hover:underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3 border border-border rounded-lg w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-accent transition-colors rounded-l-lg">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-accent transition-colors rounded-r-lg">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleAddToCart} size="lg" className="flex-1 gap-2 text-base h-14 rounded-xl">
                <ShoppingBag size={20} />
                Add to Cart
              </Button>
              <Button
                onClick={() => {
                  toggleWishlist(product.id);
                  toast.success(wishlisted ? "Removed from wishlist" : `${product.name} added to wishlist`);
                }}
                variant="outline"
                size="lg"
                className="h-14 w-14 rounded-xl p-0"
              >
                <Heart size={20} className={wishlisted ? "fill-destructive text-destructive" : ""} />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={20} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={20} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield size={20} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">2-Year Warranty</span>
              </div>
            </div>

            {/* Features */}
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link to={`/product/${p.id}`} key={p.id}>
                <ProductCard product={p} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
