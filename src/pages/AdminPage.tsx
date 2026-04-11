import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useIsAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/imageMap";
import {
  LayoutDashboard, Package, ShoppingCart, Users, CreditCard,
  Plus, Pencil, Trash2, Search, Loader2, ChevronDown, Eye, X,
  DollarSign, TrendingUp, UserCheck, Box
} from "lucide-react";

type Tab = "dashboard" | "products" | "orders" | "users" | "payments";

const AdminPage = () => {
  const { user } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (adminLoading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin" size={32} /></div>;
  if (!isAdmin) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
      <p className="text-muted-foreground mb-6">You need admin privileges to access this page.</p>
      <Button onClick={() => navigate("/")}>Go Home</Button>
    </div>
  );

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "products" as Tab, label: "Products", icon: Package },
    { id: "orders" as Tab, label: "Orders", icon: ShoppingCart },
    { id: "users" as Tab, label: "Users", icon: Users },
    { id: "payments" as Tab, label: "Payments", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-card border-r border-border transition-all duration-300 flex flex-col shrink-0`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && <h2 className="font-heading font-bold text-lg">Admin</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-accent rounded">
            <ChevronDown size={16} className={`transition-transform ${sidebarOpen ? "rotate-90" : "-rotate-90"}`} />
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <t.icon size={18} />
              {sidebarOpen && <span>{t.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {tab === "dashboard" && <DashboardTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "users" && <UsersTab />}
        {tab === "payments" && <PaymentsTab />}
      </main>
    </div>
  );
};

/* ========== DASHBOARD TAB ========== */
const DashboardTab = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [profilesRes, ordersRes, productsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id, total_price"),
        supabase.from("products").select("id", { count: "exact", head: true }),
      ]);
      const revenue = (ordersRes.data || []).reduce((sum, o) => sum + Number(o.total_price), 0);
      setStats({
        users: profilesRes.count || 0,
        orders: (ordersRes.data || []).length,
        revenue,
        products: productsRes.count || 0,
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;

  const cards = [
    { label: "Total Users", value: stats.users, icon: UserCheck, color: "text-blue-500" },
    { label: "Total Orders", value: stats.orders, icon: Box, color: "text-green-500" },
    { label: "Revenue", value: `Rs. ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-yellow-500" },
    { label: "Products", value: stats.products, icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <c.icon size={24} className={c.color} />
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== PRODUCTS TAB ========== */
const ProductsTab = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", description: "", price: "", discount_price: "", category: "men",
    subcategory: "", brand: "", stock: "100", image_key: "shoe-1", tag: "",
    is_new: false, is_best: false,
  });

  const loadProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", discount_price: "", category: "men", subcategory: "", brand: "", stock: "100", image_key: "shoe-1", tag: "", is_new: false, is_best: false });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (p: any) => {
    setForm({
      name: p.name, description: p.description || "", price: String(p.price),
      discount_price: p.discount_price ? String(p.discount_price) : "",
      category: p.category, subcategory: p.subcategory || "", brand: p.brand || "",
      stock: String(p.stock), image_key: p.image_key, tag: p.tag || "",
      is_new: p.is_new, is_best: p.is_best,
    });
    setEditing(p);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    const payload = {
      name: form.name, description: form.description || null,
      price: Number(form.price), discount_price: form.discount_price ? Number(form.discount_price) : null,
      category: form.category, subcategory: form.subcategory || null,
      brand: form.brand || null, stock: Number(form.stock), image_key: form.image_key,
      tag: form.tag || null, is_new: form.is_new, is_best: form.is_best,
    };

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Product updated");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Product added");
    }
    resetForm();
    loadProducts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); loadProducts(); }
  };

  const categories = ["men", "women", "sports", "kids", "casual"];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2"><Plus size={16} /> Add Product</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-10" />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-2 text-sm">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => resetForm()}>
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={resetForm}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
              <div><Label>Description</Label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm min-h-[80px]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price (Rs.)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1" /></div>
                <div><Label>Discount Price</Label><Input type="number" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Category</Label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm">
                    {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div><Label>Subcategory</Label><Input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Brand</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="mt-1" /></div>
                <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="mt-1" /></div>
              </div>
              <div><Label>Image Key</Label><Input value={form.image_key} onChange={(e) => setForm({ ...form, image_key: e.target.value })} className="mt-1" placeholder="shoe-1" /></div>
              <div><Label>Tag</Label><Input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="mt-1" placeholder="new / best" /></div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} /> New Arrival</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_best} onChange={(e) => setForm({ ...form, is_best: e.target.checked })} /> Best Seller</label>
              </div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update Product" : "Add Product"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2">Image</th>
                <th className="text-left py-3 px-2">Name</th>
                <th className="text-left py-3 px-2">Category</th>
                <th className="text-left py-3 px-2">Price</th>
                <th className="text-left py-3 px-2">Stock</th>
                <th className="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-accent/30">
                  <td className="py-2 px-2"><img src={getImageUrl(p.image_key)} alt={p.name} className="w-12 h-12 rounded-lg object-cover" /></td>
                  <td className="py-2 px-2 font-medium">{p.name}</td>
                  <td className="py-2 px-2 capitalize">{p.category}</td>
                  <td className="py-2 px-2">
                    Rs. {Number(p.price).toLocaleString()}
                    {p.discount_price && <span className="text-xs text-muted-foreground line-through ml-2">Rs. {Number(p.discount_price).toLocaleString()}</span>}
                  </td>
                  <td className="py-2 px-2">{p.stock}</td>
                  <td className="py-2 px-2">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-accent rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-8 text-muted-foreground">No products found</p>}
        </div>
      )}
    </div>
  );
};

/* ========== ORDERS TAB ========== */
const OrdersTab = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*, products(name, image_key))")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) toast.error(error.message);
    else { toast.success(`Order marked as ${status}`); loadOrders(); }
  };

  const updatePayment = async (orderId: string, payment_status: string) => {
    const { error } = await supabase.from("orders").update({ payment_status }).eq("id", orderId);
    if (error) toast.error(error.message);
    else { toast.success(`Payment marked as ${payment_status}`); loadOrders(); }
  };

  const filtered = orders.filter((o) => !statusFilter || o.status === statusFilter);

  const statusColors: Record<string, string> = {
    processing: "bg-yellow-500/10 text-yellow-600",
    shipped: "bg-blue-500/10 text-blue-600",
    delivered: "bg-green-500/10 text-green-600",
    cancelled: "bg-red-500/10 text-red-600",
    pending: "bg-yellow-500/10 text-yellow-600",
    paid: "bg-green-500/10 text-green-600",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Order #{o.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[o.status] || ""}`}>{o.status}</span>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[o.payment_status] || ""}`}>
                    Payment: {o.payment_status}
                  </span>
                  <span className="text-xs bg-accent px-2 py-1 rounded-full capitalize">{o.payment_method}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">Rs. {Number(o.total_price).toLocaleString()}</p>
                  {o.transaction_id && <p className="text-xs text-muted-foreground">TID: {o.transaction_id}</p>}
                  {o.email && <p className="text-xs text-muted-foreground">{o.email}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedOrder(selectedOrder?.id === o.id ? null : o)} className="p-1.5 hover:bg-accent rounded-lg"><Eye size={14} /></button>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="bg-background border border-border rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {o.payment_status !== "paid" && (
                    <Button size="sm" variant="outline" onClick={() => updatePayment(o.id, "paid")} className="text-xs h-7">
                      Mark Paid
                    </Button>
                  )}
                </div>
              </div>
              {selectedOrder?.id === o.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <p className="text-xs text-muted-foreground">Phone: {o.phone || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">Address: {o.shipping_address || "N/A"}</p>
                  {o.order_items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.products && <img src={getImageUrl(item.products.image_key)} alt="" className="w-10 h-10 rounded object-cover" />}
                      <div>
                        <p className="text-sm font-medium">{item.products?.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} × Rs. {Number(item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center py-8 text-muted-foreground">No orders found</p>}
        </div>
      )}
    </div>
  );
};

/* ========== USERS TAB ========== */
const UsersTab = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleBlock = async (userId: string, currentlyBlocked: boolean) => {
    const { error } = await supabase.from("profiles").update({ is_blocked: !currentlyBlocked }).eq("user_id", userId);
    if (error) toast.error(error.message);
    else { toast.success(currentlyBlocked ? "User unblocked" : "User blocked"); load(); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users ({profiles.length})</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2">Name</th>
              <th className="text-left py-3 px-2">Phone</th>
              <th className="text-left py-3 px-2">Joined</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-left py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-accent/30">
                <td className="py-2 px-2 font-medium">{p.full_name || "—"}</td>
                <td className="py-2 px-2">{p.phone || "—"}</td>
                <td className="py-2 px-2">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="py-2 px-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.is_blocked ? "bg-red-500/10 text-red-600" : "bg-green-500/10 text-green-600"}`}>
                    {p.is_blocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <Button size="sm" variant={p.is_blocked ? "default" : "destructive"} onClick={() => toggleBlock(p.user_id, p.is_blocked)} className="text-xs h-7">
                    {p.is_blocked ? "Unblock" : "Block"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ========== PAYMENTS TAB ========== */
const PaymentsTab = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .in("payment_method", ["jazzcash", "easypaisa"])
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const verifyPayment = async (orderId: string) => {
    const { error } = await supabase.from("orders").update({ payment_status: "paid" }).eq("id", orderId);
    if (error) toast.error(error.message);
    else { toast.success("Payment verified"); load(); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment Verification</h1>
      <p className="text-sm text-muted-foreground mb-4">JazzCash & EasyPaisa payments that need verification</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2">Order</th>
              <th className="text-left py-3 px-2">Method</th>
              <th className="text-left py-3 px-2">Transaction ID</th>
              <th className="text-left py-3 px-2">Amount</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-left py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border/50 hover:bg-accent/30">
                <td className="py-2 px-2">#{o.id.slice(0, 8)}</td>
                <td className="py-2 px-2 capitalize">{o.payment_method}</td>
                <td className="py-2 px-2 font-mono text-xs">{o.transaction_id || "—"}</td>
                <td className="py-2 px-2">Rs. {Number(o.total_price).toLocaleString()}</td>
                <td className="py-2 px-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${o.payment_status === "paid" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                    {o.payment_status}
                  </span>
                </td>
                <td className="py-2 px-2">
                  {o.payment_status !== "paid" && (
                    <Button size="sm" onClick={() => verifyPayment(o.id)} className="text-xs h-7">Verify</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-8 text-muted-foreground">No pending payments</p>}
      </div>
    </div>
  );
};

export default AdminPage;
