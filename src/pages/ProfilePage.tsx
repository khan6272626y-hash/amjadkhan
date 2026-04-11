import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, User, Package, Clock } from "lucide-react";
import { getImageUrl } from "@/lib/imageMap";

interface OrderItem {
  quantity: number;
  price: number;
  products: { name: string; image_key: string } | null;
}

interface Order {
  id: string;
  total_price: number;
  status: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  created_at: string;
  order_items: OrderItem[];
}

const ProfilePage = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      Promise.all([loadProfile(), loadOrders()]).then(() => setLoading(false));
    }
  }, [user, authLoading, navigate]);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (data) {
      setFullName(data.full_name || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
    }
  };

  const loadOrders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("orders")
      .select("id, total_price, status, payment_method, payment_status, transaction_id, created_at, order_items(quantity, price, products(name, image_key))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setOrders(data as unknown as Order[]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, address })
      .eq("user_id", user.id);
    if (error) toast.error("Failed to update profile");
    else toast.success("Profile updated!");
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    processing: "bg-yellow-500/10 text-yellow-600",
    shipped: "bg-blue-500/10 text-blue-600",
    delivered: "bg-primary/10 text-primary",
    cancelled: "bg-destructive/10 text-destructive",
    pending: "bg-yellow-500/10 text-yellow-600",
    paid: "bg-green-500/10 text-green-600",
  };

  return (
    <div className="min-h-[80vh] container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-heading">My Account</h1>
          <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${activeTab === "profile" ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-accent"}`}
          >
            <User size={14} className="inline mr-2" />Profile
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${activeTab === "orders" ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-accent"}`}
          >
            <Package size={14} className="inline mr-2" />Orders ({orders.length})
          </button>
        </div>

        {activeTab === "profile" ? (
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, City" />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
              </Button>
            </form>
            <Button variant="outline" onClick={handleSignOut} className="w-full mt-4 h-12 rounded-xl gap-2 text-destructive hover:text-destructive">
              <LogOut size={16} /> Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Clock size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                       <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColor[order.status] || ""}`}>
                         {order.status}
                       </span>
                       <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColor[order.payment_status] || ""}`}>
                         {order.payment_status}
                       </span>
                       <span className="text-xs bg-accent px-2 py-1 rounded-full capitalize">{order.payment_method}</span>
                       <span className="font-bold">Rs. {Number(order.total_price).toFixed(0)}</span>
                     </div>
                  </div>
                  <div className="space-y-3">
                    {order.order_items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.products && (
                          <img src={getImageUrl(item.products.image_key)} alt={item.products.name} className="w-12 h-12 rounded-lg object-cover" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.products?.name || "Unknown Product"}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
