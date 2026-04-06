import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFlyToCart } from "@/context/FlyToCartContext";
import type { Product } from "@/data/products";
import { toast } from "sonner";
import { useRef } from "react";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { triggerFly } = useFlyToCart();
  const imgRef = useRef<HTMLImageElement>(null);

  const handleAdd = () => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      triggerFly(product.image, rect);
    }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="group animate-fade-in">
      <div className="relative overflow-hidden rounded-lg bg-card mb-3 aspect-square">
        <img
          ref={imgRef}
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.tag && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {product.tag === "new" ? "New" : "Best Seller"}
          </span>
        )}
        <button
          onClick={handleAdd}
          className="absolute bottom-3 right-3 bg-primary text-primary-foreground p-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 shadow-card-hover"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={18} />
        </button>
      </div>
      <h3 className="font-heading font-semibold text-sm">{product.name}</h3>
      <p className="text-muted-foreground text-sm">${product.price.toFixed(2)}</p>
    </div>
  );
};

export default ProductCard;
