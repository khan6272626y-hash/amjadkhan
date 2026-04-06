import shoe1 from "@/assets/shoe-1.jpg";
import shoe2 from "@/assets/shoe-2.jpg";
import shoe3 from "@/assets/shoe-3.jpg";
import shoe4 from "@/assets/shoe-4.jpg";
import shoe5 from "@/assets/shoe-5.jpg";
import shoe6 from "@/assets/shoe-6.jpg";
import shoe7 from "@/assets/shoe-7.jpg";
import shoe8 from "@/assets/shoe-8.jpg";
import shoe9 from "@/assets/shoe-9.jpg";
import shoe10 from "@/assets/shoe-10.jpg";
import shoe11 from "@/assets/shoe-11.jpg";
import shoe12 from "@/assets/shoe-12.jpg";
import shoe13 from "@/assets/shoe-13.jpg";
import shoe14 from "@/assets/shoe-14.jpg";
import shoe15 from "@/assets/shoe-15.jpg";
import shoe16 from "@/assets/shoe-16.jpg";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  tag?: string;
}

export const products: Product[] = [
  // Men
  { id: 1, name: "AirFlow Runner", price: 129.99, image: shoe1, category: "men", tag: "new" },
  { id: 2, name: "Shadow Stealth", price: 149.99, image: shoe2, category: "men", tag: "best" },
  { id: 4, name: "Classic Navy", price: 99.99, image: shoe4, category: "men" },
  { id: 16, name: "Navy Surge", price: 139.99, image: shoe16, category: "men", tag: "new" },

  // Women
  { id: 5, name: "Urban Grey", price: 109.99, image: shoe5, category: "women", tag: "best" },
  { id: 6, name: "Retro Green", price: 119.99, image: shoe6, category: "women", tag: "new" },
  { id: 7, name: "Tan Premium", price: 159.99, image: shoe7, category: "women" },
  { id: 12, name: "Nude Elegance", price: 134.99, image: shoe12, category: "women", tag: "best" },

  // Sports
  { id: 3, name: "Blaze Sport X", price: 169.99, image: shoe3, category: "sports", tag: "new" },
  { id: 8, name: "Midnight Black", price: 179.99, image: shoe8, category: "sports", tag: "best" },
  { id: 13, name: "Inferno Racer", price: 189.99, image: shoe13, category: "sports", tag: "new" },
  { id: 15, name: "Trail Hawk", price: 199.99, image: shoe15, category: "sports" },

  // Kids
  { id: 9, name: "Pink Cloud Jr", price: 69.99, image: shoe9, category: "kids", tag: "new" },
  { id: 10, name: "Color Burst Jr", price: 74.99, image: shoe10, category: "kids", tag: "best" },

  // Casual
  { id: 11, name: "Slate Minimal", price: 114.99, image: shoe11, category: "casual", tag: "new" },
  { id: 14, name: "Pure White", price: 124.99, image: shoe14, category: "casual", tag: "best" },
];
