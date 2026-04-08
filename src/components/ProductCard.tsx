import { ShoppingBag, Heart, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useFlyToCart } from "@/context/FlyToCartContext";
import type { Product } from "@/hooks/useProducts";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { triggerFly } = useFlyToCart();
  const imgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const wishlisted = isWishlisted(product.id);
  const navigate = useNavigate();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      triggerFly(product.image, rect);
    }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(wishlisted ? `Removed from wishlist` : `${product.name} added to wishlist`);
  };

  return (
    <div
      ref={cardRef}
      className="group cursor-pointer perspective-1000"
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
        opacity: 0,
        animation: `fade-in 0.6s ease-out ${index * 100}ms forwards`,
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-card mb-3 aspect-square transition-all duration-300 will-change-transform"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
          boxShadow: isHovered
            ? "0 25px 50px -12px hsl(0 0% 0% / 0.25), 0 0 0 1px hsl(0 0% 0% / 0.05)"
            : "var(--card-shadow)",
        }}
      >
        {/* Shine effect on hover */}
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500"
          style={{
            background: `linear-gradient(${105 + tilt.y * 10}deg, transparent 40%, hsl(0 0% 100% / 0.08) 50%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        <img
          ref={imgRef}
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {product.tag && (
          <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest z-20">
            {product.tag === "new" ? "New" : "Best Seller"}
          </span>
        )}

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          <button
            onClick={handleWishlist}
            className="bg-background/90 backdrop-blur-md p-2.5 rounded-full transition-all duration-300 hover:scale-110 shadow-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            style={{ transitionDelay: "0ms" }}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart
              size={16}
              className={`transition-all duration-300 ${
                wishlisted
                  ? "fill-destructive text-destructive scale-110"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={wishlisted ? { animation: "heartbeat 0.4s ease-in-out" } : undefined}
            />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
            className="bg-background/90 backdrop-blur-md p-2.5 rounded-full transition-all duration-300 hover:scale-110 shadow-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            style={{ transitionDelay: "50ms" }}
            aria-label={`View ${product.name}`}
          >
            <Eye size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <button
            onClick={handleAdd}
            className="w-full bg-white text-foreground py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-all duration-200 flex items-center justify-center gap-2"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="px-1 mt-1">
        <h3 className="font-heading font-semibold text-sm group-hover:text-foreground transition-colors">{product.name}</h3>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-muted-foreground text-sm font-medium">${product.price.toFixed(2)}</p>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < 4 ? "bg-foreground/70" : "bg-foreground/20"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
