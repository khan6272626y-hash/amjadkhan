import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, Menu, X, Search, Sun, Moon, User, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useFlyToCart } from "@/context/FlyToCartContext";
import { useAuth } from "@/context/AuthContext";
import { useIsAdmin } from "@/hooks/useAdmin";
import { useProducts } from "@/hooks/useProducts";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { totalItems } = useCart();
  const { data: products = [] } = useProducts();
  const { totalWishlist } = useWishlist();
  const { cartIconRef } = useFlyToCart();
  const { user, signOut } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
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
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
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

  const isTransparent = isHome && !scrolled;
  const textColor = isTransparent ? "text-white" : "text-foreground";
  const subtleText = isTransparent ? "text-white/70" : "text-muted-foreground";
  const hoverBg = isTransparent ? "hover:bg-white/10" : "hover:bg-accent";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className={`font-heading text-xl font-bold tracking-tight relative group ${textColor}`}>
          STRIDE
          <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${isTransparent ? "bg-white" : "bg-foreground"}`} />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {categories.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-300 ${
                isActive(c.to)
                  ? isTransparent
                    ? "bg-white text-black"
                    : "bg-foreground text-background"
                  : `${subtleText} hover:${isTransparent ? "text-white" : "text-foreground"} ${hoverBg}`
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${textColor} ${hoverBg}`}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div ref={searchRef} className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${textColor} ${hoverBg}`}
            >
              <Search size={18} />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-12 w-80 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in text-foreground">
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
            className={`relative p-2 rounded-full transition-all duration-300 hover:scale-110 ${textColor} ${hoverBg}`}
          >
            <Heart size={18} />
            {totalWishlist > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                {totalWishlist}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className={`relative p-2 rounded-full transition-all duration-300 hover:scale-110 ${textColor} ${hoverBg}`}
          >
            <div ref={cartIconRef} className="transition-transform">
              <ShoppingBag size={18} />
            </div>
            {totalItems > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold ${
                isTransparent ? "bg-white text-black" : "bg-foreground text-background"
              }`}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth button */}
          <div ref={userMenuRef} className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${textColor} ${hoverBg}`}
                  aria-label="Account"
                >
                  <User size={18} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-fade-in text-foreground">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-accent transition-colors"
                    >
                      <User size={14} />
                      My Profile
                    </Link>
                    <button
                      onClick={async () => {
                        await signOut();
                        setUserMenuOpen(false);
                        navigate("/");
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-accent transition-colors text-destructive"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/auth"
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${textColor} ${hoverBg}`}
                aria-label="Sign In"
              >
                <User size={18} />
              </Link>
            )}
          </div>

          <button
            className={`md:hidden p-2 rounded-full transition-all duration-300 ${textColor}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-background border-t border-border px-4 pb-4 pt-2 text-foreground">
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
          {!user && (
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-medium text-primary"
            >
              Sign In / Sign Up
            </Link>
          )}
          {user && (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b border-border/50"
              >
                My Profile
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  setMobileOpen(false);
                }}
                className="block py-3 text-sm font-medium text-destructive"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
