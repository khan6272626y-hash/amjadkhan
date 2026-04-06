import type { Product } from "./products";
import { products } from "./products";

export interface ProductDetail extends Product {
  description: string;
  features: string[];
  sizes: number[];
  images: string[]; // first is the main image, rest are alternate views
  rating: number;
  reviews: number;
  colors: string[];
}

const descriptions: Record<string, { description: string; features: string[] }> = {
  men: {
    description: "Engineered for the modern man who demands both style and performance. Premium materials meet cutting-edge design in this essential sneaker that transitions seamlessly from street to gym.",
    features: ["Breathable mesh upper", "Cushioned EVA midsole", "Rubber outsole for grip", "Padded collar for comfort", "Lightweight construction"],
  },
  women: {
    description: "Designed with elegance and athleticism in mind, this sneaker combines a sleek silhouette with superior comfort technology. Perfect for all-day wear whether you're running errands or hitting the track.",
    features: ["Soft knit upper", "Memory foam insole", "Flexible sole design", "Arch support technology", "Premium finish"],
  },
  sports: {
    description: "Built for peak performance, these high-energy sneakers deliver explosive responsiveness and unmatched support. From the track to the court, dominate every session.",
    features: ["Impact-absorbing sole", "Reinforced toe cap", "Dynamic lacing system", "Anti-slip tread pattern", "Ventilated design"],
  },
  kids: {
    description: "Fun, colorful, and built to keep up with active little feet. These sneakers feature easy-on design and durable construction that parents love and kids adore.",
    features: ["Easy pull-on tab", "Non-marking sole", "Machine washable", "Extra cushioning", "Fun color design"],
  },
  casual: {
    description: "The perfect everyday sneaker that pairs effortlessly with any outfit. Minimalist design meets maximum comfort for the style-conscious individual.",
    features: ["Premium leather upper", "Ortholite insole", "Classic silhouette", "Versatile colorway", "All-day comfort"],
  },
};

const sizesByCategory: Record<string, number[]> = {
  men: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
  women: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
  sports: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
  kids: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
  casual: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
};

const colorOptions: Record<string, string[]> = {
  men: ["Black", "Navy", "Grey"],
  women: ["White", "Blush", "Grey"],
  sports: ["Red", "Black", "Blue"],
  kids: ["Pink", "Blue", "Green"],
  casual: ["White", "Tan", "Slate"],
};

export function getProductDetail(id: number): ProductDetail | undefined {
  const product = products.find((p) => p.id === id);
  if (!product) return undefined;

  const cat = product.category;
  const catInfo = descriptions[cat] || descriptions.men;
  const otherImages = products
    .filter((p) => p.category === cat && p.id !== id)
    .slice(0, 3)
    .map((p) => p.image);

  return {
    ...product,
    description: catInfo.description,
    features: catInfo.features,
    sizes: sizesByCategory[cat] || sizesByCategory.men,
    images: [product.image, ...otherImages],
    rating: 4 + Math.random() * 0.9,
    reviews: 50 + Math.floor(Math.random() * 200),
    colors: colorOptions[cat] || colorOptions.men,
  };
}
