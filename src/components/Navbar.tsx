import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, Menu, X, Search, Sun, Moon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useFlyToCart } from "@/context/FlyToCartContext";
import { products } from "@/data/products";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const { cartIconRef } = useFlyToCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

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

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border"
          : isHome
            ? "bg-transparent border-b border-transparent"
            : "bg-background/80 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-heading text-xl font-bold tracking-tight relative group">
          <span className={scrolled || !isHome ? "text-foreground" : "text-white"}>STRIDE</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {categories.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-300 ${
                isActive(c.to)
                  ? "bg-foreground text-background"
                  : scrolled || !isHome
                    ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                    : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              scrolled || !isHome ? "text-foreground hover:bg-accent" : "text-white/80 hover:bg-white/10"
            }`}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Search */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                scrolled || !isHome ? "text-foreground hover:bg-accent" : "text-white/80 hover:bg-white/10"
              }`}
            >
              <Search size={18} />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-12 w-80 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                <div className="flex items-center gap-2 px-4 border-b border-border">
                  <Search size={14} className="text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search sneakers..."
                    className="w-full py-3.5 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
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
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-accent transition-colors text-left group"
                        >
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover group-hover:scale-105 transition-transform" />
                          <div>
                            <p className="text-sm font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">${p.price.toFixed(2)}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-6 text-sm text-muted-foreground text-center">No sneakers found</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link
            to="/wishlist"
            className={`relative p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              scrolled || !isHome ? "text-foreground hover:bg-accent" : "text-white/80 hover:bg-white/10"
            }`}
          >
            <Heart size={18} />
            {totalWishlist > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold min-w-[18px] h-[18px]">
                {totalWishlist}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className={`relative p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              scrolled || !isHome ? "text-foreground hover:bg-accent" : "text-white/80 hover:bg-white/10"
            }`}
          >
            <div ref={cartIconRef} className="transition-transform">
              <ShoppingBag size={18} />
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className={`md:hidden p-2 rounded-full transition-all duration-300 ${
              scrolled || !isHome ? "text-foreground" : "text-white"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu with slide animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-background border-t border-border px-4 pb-4 pt-2">
          {categories.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-medium transition-colors border-b border-border/50 last:border-0 ${
                isActive(c.to) ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
