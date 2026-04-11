import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Banknote, Loader2, Smartphone, Copy, CheckCircle } from "lucide-react";

const JAZZCASH_NUMBER = "03001234567";
const EASYPAISA_NUMBER = "03009876543";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<"cod" | "jazzcash" | "easypaisa">("cod");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState("");

  const copyNumber = (num: string, label: string) => {
    navigator.clipboard.writeText(num);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return;
    }

    if ((payment === "jazzcash" || payment === "easypaisa") && !transactionId.trim()) {
      toast.error("Please enter your Transaction ID");
      return;
    }

    setSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_price: totalPrice,
          status: "processing",
          shipping_address: address,
          phone,
          email,
          payment_method: payment,
          transaction_id: payment !== "cod" ? transactionId : null,
          payment_status: payment === "cod" ? "pending" : "pending",
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

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

  const paymentMethods = [
    { id: "cod" as const, label: "Cash on Delivery", icon: Banknote },
    { id: "jazzcash" as const, label: "JazzCash", icon: Smartphone },
    { id: "easypaisa" as const, label: "EasyPaisa", icon: Smartphone },
  ];

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
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ahmed Khan" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House #, Street, City, Pakistan" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03001234567" required className="mt-1" />
            </div>
          </div>

          <h2 className="font-heading font-bold text-lg pt-4">Payment Method</h2>
          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => { setPayment(m.id); setTransactionId(""); }}
                className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors text-center ${
                  payment === m.id ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"
                }`}
              >
                <m.icon size={24} />
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            ))}
          </div>

          {/* JazzCash instructions */}
          {payment === "jazzcash" && (
            <div className="space-y-4 animate-fade-in p-4 bg-card border border-border rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">JazzCash Merchant Number</p>
                  <p className="text-2xl font-bold mt-1">{JAZZCASH_NUMBER}</p>
                </div>
                <button type="button" onClick={() => copyNumber(JAZZCASH_NUMBER, "jazzcash")} className="p-2 hover:bg-accent rounded-lg transition-colors">
                  {copied === "jazzcash" ? <CheckCircle size={20} className="text-primary" /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Send the exact amount to this number via JazzCash, then enter the Transaction ID below.</p>
              <div>
                <Label htmlFor="txnId">Transaction ID</Label>
                <Input id="txnId" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Enter JazzCash TID" required className="mt-1" />
              </div>
            </div>
          )}

          {/* EasyPaisa instructions */}
          {payment === "easypaisa" && (
            <div className="space-y-4 animate-fade-in p-4 bg-card border border-border rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-secondary">EasyPaisa Merchant Number</p>
                  <p className="text-2xl font-bold mt-1">{EASYPAISA_NUMBER}</p>
                </div>
                <button type="button" onClick={() => copyNumber(EASYPAISA_NUMBER, "easypaisa")} className="p-2 hover:bg-accent rounded-lg transition-colors">
                  {copied === "easypaisa" ? <CheckCircle size={20} className="text-primary" /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Send the exact amount to this number via EasyPaisa, then enter the Transaction ID below.</p>
              <div>
                <Label htmlFor="txnId2">Transaction ID</Label>
                <Input id="txnId2" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Enter EasyPaisa TID" required className="mt-1" />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full rounded-full" size="lg" disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin" size={18} /> : `Place Order — Rs. ${totalPrice.toFixed(0)}`}
          </Button>
        </form>

        <div className="bg-card rounded-lg p-6 h-fit border border-border">
          <h2 className="font-heading font-bold text-lg mb-6">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">Rs. {(item.price * item.quantity).toFixed(0)}</p>
              </div>
            ))}
            <div className="border-t border-border pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>Rs. {totalPrice.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
