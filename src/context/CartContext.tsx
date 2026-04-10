import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load cart from Supabase when user logs in
  useEffect(() => {
    if (!user) {
      setItems([]);
      setCartId(null);
      return;
    }
    loadCart();
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Get or create cart
      let { data: cart } = await supabase
        .from("cart")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!cart) {
        const { data: newCart } = await supabase
          .from("cart")
          .insert({ user_id: user.id })
          .select("id")
          .single();
        cart = newCart;
      }

      if (!cart) { setLoading(false); return; }
      setCartId(cart.id);

      // Load cart items with product details
      const { data: cartItems } = await supabase
        .from("cart_items")
        .select("id, product_id, quantity, products(id, name, price, image_key)")
        .eq("cart_id", cart.id);

      if (cartItems) {
        const { getImageUrl } = await import("@/lib/imageMap");
        const mapped: CartItem[] = cartItems
          .filter((ci: any) => ci.products)
          .map((ci: any) => ({
            id: ci.products.id,
            name: ci.products.name,
            price: Number(ci.products.price),
            image: getImageUrl(ci.products.image_key),
            quantity: ci.quantity,
          }));
        setItems(mapped);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
    }
    setLoading(false);
  };

  const addToCart = useCallback(async (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    if (user && cartId) {
      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cartId)
        .eq("product_id", item.id)
        .single();

      if (existing) {
        await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + 1 })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("cart_items")
          .insert({ cart_id: cartId, product_id: item.id, quantity: 1 });
      }
    }
  }, [user, cartId]);

  const removeFromCart = useCallback(async (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (user && cartId) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId)
        .eq("product_id", id);
    }
  }, [user, cartId]);

  const updateQuantity = useCallback(async (id: number, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
    if (user && cartId) {
      await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("cart_id", cartId)
        .eq("product_id", id);
    }
  }, [user, cartId, removeFromCart]);

  const clearCart = useCallback(async () => {
    setItems([]);
    if (user && cartId) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId);
    }
  }, [user, cartId]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
