import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useFlyToCart } from "@/context/FlyToCartContext";
import { products } from "@/data/products";
import strideLogo from "@/assets/stride-logo.png";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const { cartIconRef } = useFlyToCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = query.trim().length > 0
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const categories = [
    { label: "Men", to: "/category/men" },
    { label: "Women", to: "/category/women" },
    { label: "Sports", to: "/category/sports" },
    { label: "Kids", to: "/category/kids" },
    { label: "Casual", to: "/category/casual" },
    { label: "New Arrivals", to: "/category/new" },
    { label: "Best Sellers", to: "/category/best" },
  ];

  const goToProduct = (id: number) => {
    navigate(`/product/${id}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center">
          <img src={strideLogo} alt="STRIDE" className="h-8 w-auto invert dark:invert-0" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {categories.map((c) => (
            <Link key={c.to} to={c.to} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {c.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div ref={searchRef} className="relative">
            <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <Search size={22} className="text-foreground" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-10 w-72 sm:w-80 bg-background border border-border rounded-xl shadow-lg overflow-hidden animate-fade-in">
                <div className="flex items-center gap-2 px-3 border-b border-border">
                  <Search size={16} className="text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search sneakers..."
                    className="w-full py-3 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                      <X size={14} />
                    </button>
                  )}
                </div>
                {query.trim().length > 0 && (
                  <div className="max-h-72 overflow-y-auto">
                    {results.length > 0 ? (
                      results.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => goToProduct(p.id)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-accent transition-colors text-left"
                        >
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">${p.price.toFixed(2)}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-4 text-sm text-muted-foreground text-center">No sneakers found</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link to="/wishlist" className="relative">
            <Heart size={22} />
            {totalWishlist > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {totalWishlist}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative">
            <div ref={cartIconRef} className="transition-transform">
              <ShoppingBag size={22} />
            </div>
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
