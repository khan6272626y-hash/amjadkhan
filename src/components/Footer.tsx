import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="container mx-auto px-4 py-20">
      <div className="grid md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <h3 className="font-heading text-2xl font-bold mb-4">STRIDE</h3>
          <p className="text-background/40 text-sm leading-relaxed mb-6">
            Premium jogger shoes crafted for comfort, performance, and style.
          </p>
          <div className="flex gap-3">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-all duration-300 hover:scale-110">
                <Icon size={16} className="text-background/60" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-6 text-xs uppercase tracking-[0.2em] text-background/60">Shop</h4>
          <ul className="space-y-3">
            {[
              { label: "Men Shoes", to: "/category/men" },
              { label: "Women Shoes", to: "/category/women" },
              { label: "Sports Shoes", to: "/category/sports" },
              { label: "Kids Shoes", to: "/category/kids" },
              { label: "Casual Shoes", to: "/category/casual" },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm text-background/40 hover:text-background transition-colors inline-flex items-center gap-1 group">
                  {item.label}
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-6 text-xs uppercase tracking-[0.2em] text-background/60">Company</h4>
          <ul className="space-y-3 text-sm text-background/40">
            <li className="hover:text-background transition-colors cursor-pointer">About Us</li>
            <li className="hover:text-background transition-colors cursor-pointer">Careers</li>
            <li className="hover:text-background transition-colors cursor-pointer">Press</li>
            <li className="hover:text-background transition-colors cursor-pointer">Sustainability</li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-6 text-xs uppercase tracking-[0.2em] text-background/60">Contact</h4>
          <ul className="space-y-4 text-sm text-background/40">
            <li className="flex items-center gap-3"><Mail size={14} /> support@stride.com</li>
            <li className="flex items-center gap-3"><Phone size={14} /> +1 (555) 123-4567</li>
            <li className="flex items-center gap-3"><MapPin size={14} /> New York, NY</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="border-t border-background/10 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/30">
        <span>© 2026 STRIDE. All rights reserved.</span>
        <div className="flex gap-6">
          <span className="hover:text-background/60 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-background/60 cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-background/60 cursor-pointer transition-colors">Cookie Policy</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
