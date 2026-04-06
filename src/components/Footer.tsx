import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-16 grid md:grid-cols-4 gap-10">
      <div>
        <h3 className="font-heading text-xl font-bold mb-4">STRIDE</h3>
        <p className="text-primary-foreground/60 text-sm leading-relaxed">
          Premium jogger shoes crafted for comfort, performance, and style.
        </p>
      </div>
      <div>
        <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/60">
          <li>Men Shoes</li>
          <li>Women Shoes</li>
          <li>Sports Shoes</li>
          <li>Kids Shoes</li>
          <li>Casual Shoes</li>
        </ul>
      </div>
      <div>
        <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
        <ul className="space-y-3 text-sm text-primary-foreground/60">
          <li className="flex items-center gap-2"><Mail size={14} /> support@stride.com</li>
          <li className="flex items-center gap-2"><Phone size={14} /> +1 (555) 123-4567</li>
          <li className="flex items-center gap-2"><MapPin size={14} /> New York, NY</li>
        </ul>
      </div>
      <div>
        <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider">Follow Us</h4>
        <div className="flex gap-4">
          <Instagram size={20} className="text-primary-foreground/60 hover:text-primary-foreground cursor-pointer transition-colors" />
          <Twitter size={20} className="text-primary-foreground/60 hover:text-primary-foreground cursor-pointer transition-colors" />
          <Facebook size={20} className="text-primary-foreground/60 hover:text-primary-foreground cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10 py-6 text-center text-xs text-primary-foreground/40">
      © 2026 STRIDE. All rights reserved.
    </div>
  </footer>
);

export default Footer;
