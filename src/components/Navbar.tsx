import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const Navbar = () => {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const categories = [
    { label: "Men", to: "/category/men" },
    { label: "Women", to: "/category/women" },
    { label: "Sports", to: "/category/sports" },
    { label: "New Arrivals", to: "/category/new" },
    { label: "Best Sellers", to: "/category/best" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-heading text-xl font-bold tracking-tight">
          STRIDE
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {categories.map((c) => (
            <Link key={c.to} to={c.to} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {c.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4">
          {categories.map((c) => (
            <Link key={c.to} to={c.to} onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-border last:border-0">
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
