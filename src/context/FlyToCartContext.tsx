import { createContext, useContext, useRef, useCallback, useState, type ReactNode } from "react";

interface FlyItem {
  id: number;
  src: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface FlyToCartContextType {
  cartIconRef: React.RefObject<HTMLDivElement>;
  triggerFly: (imageSrc: string, startRect: DOMRect) => void;
}

const FlyToCartContext = createContext<FlyToCartContextType | null>(null);

export const useFlyToCart = () => {
  const ctx = useContext(FlyToCartContext);
  if (!ctx) throw new Error("useFlyToCart must be inside FlyToCartProvider");
  return ctx;
};

let flyId = 0;

export const FlyToCartProvider = ({ children }: { children: ReactNode }) => {
  const cartIconRef = useRef<HTMLDivElement>(null!);
  const [items, setItems] = useState<FlyItem[]>([]);

  const triggerFly = useCallback((imageSrc: string, startRect: DOMRect) => {
    const cartEl = cartIconRef.current;
    if (!cartEl) return;
    const cartRect = cartEl.getBoundingClientRect();
    const id = ++flyId;
    setItems((prev) => [
      ...prev,
      {
        id,
        src: imageSrc,
        startX: startRect.left + startRect.width / 2,
        startY: startRect.top + startRect.height / 2,
        endX: cartRect.left + cartRect.width / 2,
        endY: cartRect.top + cartRect.height / 2,
      },
    ]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 800);
  }, []);

  return (
    <FlyToCartContext.Provider value={{ cartIconRef, triggerFly }}>
      {children}
      {items.map((item) => (
        <FlyImage key={item.id} item={item} />
      ))}
    </FlyToCartContext.Provider>
  );
};

const FlyImage = ({ item }: { item: FlyItem }) => {
  return (
    <img
      src={item.src}
      alt=""
      className="fly-to-cart-image"
      style={
        {
          "--start-x": `${item.startX}px`,
          "--start-y": `${item.startY}px`,
          "--end-x": `${item.endX}px`,
          "--end-y": `${item.endY}px`,
        } as React.CSSProperties
      }
    />
  );
};
