import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-shoe.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => (
  <section className="relative h-[85vh] min-h-[500px] overflow-hidden hero-gradient flex items-center">
    <img
      src={heroImg}
      alt="Premium sneaker"
      width={1920}
      height={1080}
      className="absolute inset-0 w-full h-full object-cover opacity-60"
    />
    <div className="relative z-10 container mx-auto px-4">
      <div className="max-w-2xl animate-slide-up">
        <p className="text-primary-foreground/70 text-sm font-medium tracking-widest uppercase mb-4">New Collection 2026</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
          Premium Jogger Shoes Collection
        </h1>
        <p className="text-primary-foreground/70 text-lg mb-8 max-w-md">
          Elevate every step with engineered comfort and iconic style.
        </p>
        <Link to="/category/new">
          <Button size="lg" variant="secondary" className="rounded-full px-8 text-sm font-semibold tracking-wide">
            Shop Now
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default Hero;
