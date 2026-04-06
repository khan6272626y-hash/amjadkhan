import shoe1 from "@/assets/shoe-1.jpg";
import shoe2 from "@/assets/shoe-2.jpg";
import shoe3 from "@/assets/shoe-3.jpg";
import shoe4 from "@/assets/shoe-4.jpg";
import shoe5 from "@/assets/shoe-5.jpg";
import shoe6 from "@/assets/shoe-6.jpg";
import shoe7 from "@/assets/shoe-7.jpg";
import shoe8 from "@/assets/shoe-8.jpg";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  tag?: string;
}

export const products: Product[] = [
  { id: 1, name: "AirFlow Runner", price: 129.99, image: shoe1, category: "men", tag: "new" },
  { id: 2, name: "Shadow Stealth", price: 149.99, image: shoe2, category: "men", tag: "best" },
  { id: 3, name: "Blaze Sport X", price: 169.99, image: shoe3, category: "sports", tag: "new" },
  { id: 4, name: "Classic Navy", price: 99.99, image: shoe4, category: "men" },
  { id: 5, name: "Urban Grey", price: 109.99, image: shoe5, category: "women", tag: "best" },
  { id: 6, name: "Retro Green", price: 119.99, image: shoe6, category: "women", tag: "new" },
  { id: 7, name: "Tan Premium", price: 159.99, image: shoe7, category: "women" },
  { id: 8, name: "Midnight Black", price: 179.99, image: shoe8, category: "sports", tag: "best" },
];
