import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Banknote, Loader2 } from "lucide-react";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<"cod" | "card">("cod");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return;
    }

    setSubmitting(true);
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_price: totalPrice,
          status: "pending",
          shipping_address: address,
          phone,
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await clearCart();
      toast.success("Order placed successfully!");
      navigate("/profile");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    }
    setSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">No items to checkout</h1>
        <Button onClick={() => navigate("/")} className="rounded-full px-8 mt-4">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-10">Checkout</h1>
      {!user && (
        <div className="mb-6 p-4 bg-secondary/10 border border-secondary/20 rounded-xl text-sm">
          <Link to="/auth" className="text-secondary font-semibold hover:underline">Sign in</Link> to save your order history.
        </div>
      )}
      <div className="grid lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="font-heading font-bold text-lg">Shipping Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, City, State" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" required className="mt-1" />
            </div>
          </div>

          <h2 className="font-heading font-bold text-lg pt-4">Payment Method</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPayment("cod")}
              className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${payment === "cod" ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"}`}
            >
              <Banknote size={24} />
              <span className="text-sm font-medium">Cash on Delivery</span>
            </button>
            <button
              type="button"
              onClick={() => setPayment("card")}
              className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${payment === "card" ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"}`}
            >
              <CreditCard size={24} />
              <span className="text-sm font-medium">Credit / Debit Card</span>
            </button>
          </div>

          {payment === "card" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="0000 0000 0000 0000" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" className="mt-1" />
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full rounded-full" size="lg" disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin" size={18} /> : `Place Order — $${totalPrice.toFixed(2)}`}
          </Button>
        </form>

        <div className="bg-card rounded-lg p-6 h-fit">
          <h2 className="font-heading font-bold text-lg mb-6">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-md" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t border-border pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
