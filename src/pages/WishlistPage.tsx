import { Link } from "react-router-dom";
import { Heart, Trash2, Loader2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useFlyToCart } from "@/context/FlyToCartContext";
import { useProducts, type Product } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRef } from "react";

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { triggerFly } = useFlyToCart();
  const { data: products = [], isLoading } = useProducts();
  const imgRefs = useRef<Record<number, HTMLImageElement | null>>({});

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddToCart = (product: Product) => {
    const img = imgRefs.current[product.id];
    if (img) {
      triggerFly(product.image, img.getBoundingClientRect());
    }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    toast.success(`${product.name} added to cart`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Heart size={64} className="mx-auto text-muted-foreground/30 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-6">Save your favorite sneakers to find them later.</p>
        <Link to="/">
          <Button className="rounded-full px-8">Browse Sneakers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-10">My Wishlist ({wishlistProducts.length})</h1>
      <div className="grid gap-6">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-6 bg-card rounded-lg p-4 animate-fade-in"
          >
            <img
              ref={(el) => { imgRefs.current[product.id] = el; }}
              src={product.image}
              alt={product.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold">{product.name}</h3>
              <p className="text-muted-foreground text-sm capitalize">{product.category}</p>
              <p className="font-semibold mt-1">${product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </Button>
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  toast.success("Removed from wishlist");
                }}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Remove ${product.name} from wishlist`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
