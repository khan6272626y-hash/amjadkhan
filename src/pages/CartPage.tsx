import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";


const CartPage = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div>
        <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some sneakers to get started.</p>
          <Link to="/">
            <Button className="rounded-full px-8">Continue Shopping</Button>
          </Link>
        </div>
        
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-16 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-10">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-card rounded-lg">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-semibold">{item.name}</h3>
                    <p className="text-muted-foreground text-sm">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-md border border-border hover:bg-accent transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-md border border-border hover:bg-accent transition-colors">
                      <Plus size={14} />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-auto text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-lg p-6 h-fit sticky top-24">
            <h2 className="font-heading font-bold text-lg mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Free</span></div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                <span>Total</span><span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="w-full mt-6 rounded-full">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
