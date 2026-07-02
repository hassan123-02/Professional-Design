import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from "recharts";
import {
  LayoutDashboard, Package, ShoppingCart, Truck, Users, FileText,
  BarChart2, Settings, Bell, Search, TrendingUp, TrendingDown,
  AlertTriangle, DollarSign, Activity, Pill, Stethoscope,
  Building2, UserCheck, Receipt, Shield, LogOut, Menu, X,
  Plus, Filter, Download, Eye, Edit, Trash2, ArrowUpRight,
  ArrowDownRight, CheckCircle, AlertCircle, Wallet, CreditCard,
  Banknote, FlaskConical, Layers, ChevronRight, ChevronDown,
  Barcode, Package2, RefreshCw, Clock, Star, Zap, Tag, Hash, Printer
} from "lucide-react";

// ─── Reusable UI primitives ──────────────────────────────────────────────────

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: string }) => {
  const styles: Record<string, string> = {
    default: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    muted: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded border font-mono ${styles[variant] || styles.default}`}>
      {children}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; variant: string }> = {
    active: { label: "Active", variant: "success" },
    low: { label: "Low Stock", variant: "warning" },
    critical: { label: "Critical", variant: "danger" },
    completed: { label: "Completed", variant: "success" },
    pending: { label: "Pending", variant: "warning" },
    refunded: { label: "Refunded", variant: "muted" },
    delivered: { label: "Delivered", variant: "success" },
    transit: { label: "In Transit", variant: "cyan" },
    paid: { label: "Paid", variant: "success" },
  };
  const { label, variant } = map[status] || { label: status, variant: "muted" };
  return <Badge variant={variant}>{label}</Badge>;
};

const PaymentBadge = ({ method }: { method: string }) => {
  const map: Record<string, string> = {
    Cash: "success",
    Credit: "warning",
    "Bank Transfer": "default",
    "EasyPaisa / JazzCash": "purple",
  };
  return <Badge variant={map[method] || "muted"}>{method}</Badge>;
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  trendValue,
  color = "blue",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down";
  trendValue?: string;
  color?: string;
}) {
  const colorMap: Record<string, { icon: string; glow: string; bg: string }> = {
    blue: { icon: "text-blue-400", glow: "shadow-blue-500/10", bg: "bg-blue-500/10" },
    emerald: { icon: "text-emerald-400", glow: "shadow-emerald-500/10", bg: "bg-emerald-500/10" },
    amber: { icon: "text-amber-400", glow: "shadow-amber-500/10", bg: "bg-amber-500/10" },
    red: { icon: "text-red-400", glow: "shadow-red-500/10", bg: "bg-red-500/10" },
    purple: { icon: "text-purple-400", glow: "shadow-purple-500/10", bg: "bg-purple-500/10" },
    cyan: { icon: "text-cyan-400", glow: "shadow-cyan-500/10", bg: "bg-cyan-500/10" },
    orange: { icon: "text-orange-400", glow: "shadow-orange-500/10", bg: "bg-orange-500/10" },
    pink: { icon: "text-pink-400", glow: "shadow-pink-500/10", bg: "bg-pink-500/10" },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className={`relative rounded-xl border border-white/[0.07] bg-card p-5 shadow-xl ${c.glow} transition-all duration-200 hover:border-white/10 hover:shadow-2xl group overflow-hidden`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: "radial-gradient(ellipse at top left, rgba(59,130,246,0.04) 0%, transparent 70%)" }} />
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${c.bg}`}>
          <Icon size={16} className={c.icon} />
        </div>
        {trendValue && (
          <span className={`flex items-center gap-0.5 text-[11px] font-mono font-medium ${trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
            {trend === "up" ? "↗" : "↘"} {trendValue}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xl font-bold font-sans tracking-tight text-white">{value}</p>
        <p className="text-[11px] font-medium text-foreground/80">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground/60">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ medicines, transactions, suppliers }: { medicines: any[]; transactions: any[]; suppliers: any[] }) {
  const revenueData = [
    { month: "Jan", revenue: 284500, purchase: 198000, profit: 86500 },
    { month: "Feb", revenue: 312800, purchase: 215000, profit: 97800 },
    { month: "Mar", revenue: 298400, purchase: 201000, profit: 97400 },
    { month: "Apr", revenue: 341200, purchase: 228000, profit: 113200 },
    { month: "May", revenue: 378600, purchase: 247000, profit: 131600 },
    { month: "Jun", revenue: 415900, purchase: 269000, profit: 146900 },
  ];

  const categoryChartData = [
    { name: "Antibiotics", value: 28, color: "#3b82f6" },
    { name: "Cardiac", value: 19, color: "#10b981" },
    { name: "Vitamins", value: 16, color: "#f59e0b" },
    { name: "Analgesics", value: 14, color: "#a855f7" },
    { name: "GI", value: 13, color: "#06b6d4" },
    { name: "Others", value: 10, color: "#64748b" },
  ];

  const totalSales = transactions.reduce((sum, t) => sum + t.amount, 0);
  const liveDelta = totalSales - 13770;
  const liveTxDelta = transactions.length - 5;

  const revenueVal = `PKR ${(4.16 + Math.max(0, liveDelta) / 100000).toFixed(2)}L`;
  const profitVal = `PKR ${(1.47 + Math.max(0, liveDelta * 0.35) / 100000).toFixed(2)}L`;
  const todaySalesVal = `PKR ${(28420 + Math.max(0, liveDelta)).toLocaleString()}`;
  const todayTxVal = `${156 + Math.max(0, liveTxDelta)} transactions`;

  const lowStockCount = medicines.filter(m => m.stock < 500).length;

  return (
    <div className="space-y-5">
      {/* 8 Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Revenue (Jun)" value={revenueVal} sub="Monthly cumulative" trend="up" trendValue="9.8%" color="blue" />
        <StatCard icon={TrendingUp} label="Net Profit" value={profitVal} sub="Margin: 35.3%" trend="up" trendValue="11.6%" color="emerald" />
        <StatCard icon={ShoppingCart} label="Today Sales" value={todaySalesVal} sub={todayTxVal} trend="up" trendValue="4.2%" color="purple" />
        <StatCard icon={Truck} label="Purchases" value="PKR 2.69L" sub="Jun 2025" trend="down" trendValue="2.1%" color="cyan" />

        <StatCard icon={Package} label="Inventory Value" value="PKR 18.7L" sub="4,820 SKUs" color="orange" />
        <StatCard icon={AlertTriangle} label="Low Stock Items" value={String(Math.max(24, lowStockCount))} sub="Needs reorder" color="amber" />
        <StatCard icon={Clock} label="Near Expiry (90d)" value="38" sub="Medicines expiring soon" color="red" />
        <StatCard icon={Wallet} label="Pending Payments" value="PKR 94,720" sub="12 customers" color="pink" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trends AreaChart */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.07] bg-card p-5 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-foreground text-sm">Revenue vs Purchase vs Profit</h3>
              <p className="text-[10px] text-muted-foreground">H1 2025 · PKR Currency</p>
            </div>
            <button className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold">
              Monthly
            </button>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="purchGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v/1000}k`} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f1623", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 11 }} />
                <Legend verticalAlign="bottom" align="left" iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
                <Area type="monotone" dataKey="purchase" stroke="#f59e0b" strokeWidth={2} fill="url(#purchGrad)" name="Purchase" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fill="url(#profGrad)" name="Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category Donut */}
        <div className="rounded-xl border border-white/[0.07] bg-card p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-foreground text-sm">Sales by Category</h3>
            <p className="text-[10px] text-muted-foreground">June 2025</p>
          </div>
          <div className="flex-1 flex items-center justify-center py-4">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={categoryChartData} cx="50%" cy="50%" outerRadius={60} innerRadius={40} dataKey="value">
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] pt-3 border-t border-white/5">
            {categoryChartData.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-muted-foreground">{c.name}</span>
                </div>
                <span className="font-mono text-foreground font-semibold">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <div>
            <h4 className="font-bold text-foreground text-sm">Recent Transactions</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Today, Jun 19</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                {["Invoice ID", "Customer", "Time", "Items", "Amount", "Payment", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {transactions.slice(0, 5).map((tx) => {
                const isPending = tx.status.toLowerCase() === "pending";
                const isCash = tx.payment.toLowerCase() === "cash";
                const isCard = tx.payment.toLowerCase() === "card";
                const isInsurance = tx.payment.toLowerCase() === "insurance";
                const isSplit = tx.payment.toLowerCase() === "split";

                let payClass = "bg-slate-500/10 text-slate-400 border-slate-500/20";
                if (isCash) payClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                else if (isCard) payClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                else if (isInsurance) payClass = "bg-purple-500/10 text-purple-400 border-purple-500/20";
                else if (isSplit) payClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";

                return (
                  <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-blue-400 hover:underline cursor-pointer font-mono">{tx.id}</td>
                    <td className="px-5 py-3.5 font-medium text-white">{tx.customer}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{tx.time}</td>
                    <td className="px-5 py-3.5 text-white font-mono font-semibold">{tx.items}</td>
                    <td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">PKR {tx.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded border ${payClass}`}>
                        {tx.payment}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded border ${
                        isPending 
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Medicine Management ──────────────────────────────────────────────────────

function MedicineManagement({
  medicines,
  setMedicines,
  categories,
  setCategories,
}: {
  medicines: any[];
  setMedicines: React.Dispatch<React.SetStateAction<any[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [generic, setGeneric] = useState("");
  const [brand, setBrand] = useState("");
  const [medCategory, setMedCategory] = useState("");
  const [batch, setBatch] = useState("");
  const [expiry, setExpiry] = useState("");
  const [baseMrp, setBaseMrp] = useState(0);
  const [stock, setStock] = useState(0);
  const [baseUnit, setBaseUnit] = useState("Tablet");

  // Packaging states (Dynamic row list)
  const [customPackages, setCustomPackages] = useState<any[]>([]);
  const [baseBarcode, setBaseBarcode] = useState("");

  // Inline Category Manager
  const [isManagingCats, setIsManagingCats] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingCatValue, setEditingCatValue] = useState("");

  const filtered = medicines.filter((m) =>
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.generic.toLowerCase().includes(search.toLowerCase())) &&
    (selectedCat === "All" || m.category === selectedCat)
  );

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !medCategory || baseMrp <= 0 || stock < 0) {
      alert("Fields missing or invalid.");
      return;
    }

    // Barcode uniqueness check
    const newBarcodes: string[] = [];
    if (baseBarcode) newBarcodes.push(baseBarcode);
    customPackages.forEach(p => {
      if (p.barcode) newBarcodes.push(p.barcode);
    });

    // Check duplicate barcodes within the form itself
    const duplicateInForm = newBarcodes.filter((item, index) => newBarcodes.indexOf(item) !== index);
    if (duplicateInForm.length > 0) {
      alert(`Error: Duplicate barcode value "${duplicateInForm[0]}" detected in this form. Each barcode must be unique.`);
      return;
    }

    // Check duplicate against existing medicines in database
    for (const med of medicines) {
      if (med.packaging) {
        for (const pkg of med.packaging) {
          if (pkg.barcode && newBarcodes.includes(pkg.barcode)) {
            alert(`Error: Barcode "${pkg.barcode}" is already registered to "${med.name}" (${pkg.type}). Barcodes must be unique.`);
            return;
          }
        }
      }
    }

    const calculatedPackages: any[] = [];

    // Base unit is always added
    calculatedPackages.push({
      type: baseUnit,
      qty: 1,
      childUnit: "",
      ratio: 1,
      mrp: baseMrp,
      barcode: baseBarcode,
    });

    // Compute ratios recursively
    for (let i = 0; i < customPackages.length; i++) {
      const pkg = customPackages[i];
      const child = calculatedPackages.find(p => p.type === pkg.childUnit);
      const childRatio = child ? child.ratio : 1;
      const ratio = pkg.qty * childRatio;

      calculatedPackages.push({
        type: pkg.type,
        qty: pkg.qty,
        childUnit: pkg.childUnit,
        ratio,
        mrp: pkg.mrp,
        barcode: pkg.barcode || "",
      });
    }

    // Sort descending by ratio
    calculatedPackages.sort((a, b) => b.ratio - a.ratio);

    const newMed = {
      id: `MED-00${medicines.length + 1}`,
      name,
      generic,
      brand,
      category: medCategory,
      batch: batch || `BT-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
      expiry: expiry || "2027-12",
      mrp: baseMrp,
      stock,
      unit: baseUnit,
      status: stock <= 0 ? "critical" : stock < 500 ? "low" : "active",
      packaging: calculatedPackages,
    };

    setMedicines([...medicines, newMed]);
    setIsAddOpen(false);

    setName("");
    setGeneric("");
    setBrand("");
    setMedCategory("");
    setBatch("");
    setExpiry("");
    setBaseMrp(0);
    setStock(0);
    setBaseUnit("Tablet");
    setBaseBarcode("");
    setCustomPackages([]);
  };

  const handleAddCategory = () => {
    if (newCatInput && !categories.includes(newCatInput)) {
      setCategories([...categories, newCatInput]);
      setMedCategory(newCatInput);
      setNewCatInput("");
    }
  };

  const handleDeleteCategory = (catName: string) => {
    setCategories(categories.filter(c => c !== catName));
    if (medCategory === catName) setMedCategory("");
  };

  const handleRenameCategory = (index: number) => {
    if (editingCatValue && !categories.includes(editingCatValue)) {
      const updated = [...categories];
      const oldName = updated[index];
      updated[index] = editingCatValue;
      setCategories(updated);
      setMedicines(medicines.map(m => m.category === oldName ? { ...m, category: editingCatValue } : m));
      setEditingCatIndex(null);
      setEditingCatValue("");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Medicine catalog</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{medicines.length} registered SKUs</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-blue-500 transition-all cursor-pointer"
        >
          <Plus size={13} /> Add Medicine
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-72">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine catalog..."
            className="w-full pl-8 pr-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={() => setSelectedCat("All")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCat === "All" ? "bg-primary text-white" : "border border-white/[0.08] text-muted-foreground"}`}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setSelectedCat(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCat === c ? "bg-primary text-white" : "border border-white/[0.08] text-muted-foreground"}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {["ID", "Medicine SKU", "Generic Formula", "Brand", "Category", "MRP (Base)", "Stock (Base)", "Packaging Hierarchy", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-muted-foreground/70 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-mono text-muted-foreground/50">{m.id}</td>
                <td className="px-4 py-3 font-medium text-foreground">{m.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.generic}</td>
                <td className="px-4 py-3 text-foreground">{m.brand}</td>
                <td className="px-4 py-3"><Badge>{m.category}</Badge></td>
                <td className="px-4 py-3 font-mono text-emerald-400">Rs.{m.mrp.toFixed(2)}</td>
                <td className="px-4 py-3 font-mono text-foreground">{m.stock} ({m.unit})</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground font-mono">
                    {m.packaging && m.packaging.map((pkg: any, idx: number) => {
                      if (pkg.ratio === 1) return null;
                      return <div key={idx}>1 {pkg.type} = {pkg.qty} {pkg.childUnit}</div>;
                    })}
                  </div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-foreground">Register Medicine SKU</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-muted-foreground hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveMedicine} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">Formula Formula</label>
                  <input type="text" value={generic} onChange={(e) => setGeneric(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">Brand / Maker</label>
                  <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-muted-foreground font-medium">Category Selector *</label>
                    <button type="button" onClick={() => setIsManagingCats(!isManagingCats)} className="text-[10px] text-primary hover:underline">{isManagingCats ? "Form Editor" : "Manage Categories"}</button>
                  </div>
                  {isManagingCats ? (
                    <div className="border border-white/10 rounded-lg p-2 bg-white/[0.01] space-y-2">
                      <div className="flex gap-1">
                        <input type="text" value={newCatInput} onChange={(e) => setNewCatInput(e.target.value)} placeholder="New category..." className="flex-1 px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-white" />
                        <button type="button" onClick={handleAddCategory} className="px-2 py-1 bg-primary text-white rounded">+</button>
                      </div>
                      <div className="max-h-20 overflow-y-auto space-y-1">
                        {categories.map((c, idx) => (
                          <div key={c} className="flex items-center justify-between p-1 bg-white/[0.02] rounded text-[10px]">
                            {editingCatIndex === idx ? (
                              <input type="text" value={editingCatValue} onChange={(e) => setEditingCatValue(e.target.value)} onBlur={() => handleRenameCategory(idx)} autoFocus className="bg-black text-white px-1 border border-primary w-20" />
                            ) : (
                              <span onDoubleClick={() => { setEditingCatIndex(idx); setEditingCatValue(c); }} className="cursor-pointer text-foreground">{c}</span>
                            )}
                            <button type="button" onClick={() => handleDeleteCategory(c)} className="text-red-400"><Trash2 size={10} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <select required value={medCategory} onChange={(e) => setMedCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-foreground focus:outline-none">
                      <option value="">-- Choose --</option>
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-card text-foreground">{c}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">Base MRP (Rs.) *</label>
                  <input type="number" step="0.01" required value={baseMrp || ""} onChange={(e) => setBaseMrp(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">Base Stock Qty *</label>
                  <input type="number" required value={stock || ""} onChange={(e) => setStock(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">Base Unit Type *</label>
                  <select value={baseUnit} onChange={(e) => setBaseUnit(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-foreground focus:outline-none">
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Bottle">Bottle</option>
                    <option value="Vial">Vial</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">Base Barcode</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={baseBarcode}
                      onChange={(e) => setBaseBarcode(e.target.value)}
                      placeholder="Scan/Type"
                      className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setBaseBarcode("EAN" + Math.floor(100000000 + Math.random() * 900000000))}
                      className="px-2 bg-white/[0.06] text-white rounded-lg text-[10px]"
                    >
                      Gen
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 rounded-xl p-4 bg-white/[0.01] space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                  <Layers size={13} className="text-primary" />
                  Packaging Hierarchy Conversions
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Package Unit Hierarchy Editor</p>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomPackages([
                          ...customPackages,
                          {
                            type: "",
                            qty: 10,
                            childUnit: customPackages.length > 0 ? customPackages[customPackages.length - 1].type : baseUnit,
                            mrp: 0,
                            barcode: "",
                          }
                        ]);
                      }}
                      className="px-2.5 py-1 bg-primary text-white rounded text-[10px] font-semibold cursor-pointer"
                    >
                      + Add Package Level
                    </button>
                  </div>

                  <div className="bg-white/[0.01] border border-white/5 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground border-b border-white/5 pb-1">
                      <span>Base Unit: {baseUnit || "Tablet"}</span>
                      <span>Base Selling Price: Rs.{baseMrp.toFixed(2)}</span>
                    </div>

                    {customPackages.map((pkg, idx) => {
                      const childOptions = [baseUnit, ...customPackages.slice(0, idx).map(p => p.type)].filter(Boolean);

                      return (
                        <div key={idx} className="grid grid-cols-5 gap-2 items-end bg-white/[0.02] p-2 rounded border border-white/5 text-[11px]">
                          <div>
                            <label className="text-[9px] text-muted-foreground block mb-0.5">Package Name</label>
                            <input
                              type="text"
                              required
                              value={pkg.type}
                              onChange={(e) => {
                                const list = [...customPackages];
                                list[idx].type = e.target.value;
                                setCustomPackages(list);
                              }}
                              placeholder="e.g. Strip"
                              className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-muted-foreground block mb-0.5">Contains Qty</label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={pkg.qty || ""}
                              onChange={(e) => {
                                const list = [...customPackages];
                                list[idx].qty = Number(e.target.value);
                                setCustomPackages(list);
                              }}
                              className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-muted-foreground block mb-0.5">Child Unit</label>
                            <select
                              value={pkg.childUnit}
                              onChange={(e) => {
                                const list = [...customPackages];
                                list[idx].childUnit = e.target.value;
                                setCustomPackages(list);
                              }}
                              className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-white text-[10px] focus:outline-none"
                            >
                              {childOptions.map((opt) => (
                                <option key={opt} value={opt} className="bg-card text-foreground">{opt}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] text-muted-foreground block mb-0.5">Barcode</label>
                            <div className="flex gap-1">
                              <input
                                type="text"
                                value={pkg.barcode || ""}
                                onChange={(e) => {
                                  const list = [...customPackages];
                                  list[idx].barcode = e.target.value;
                                  setCustomPackages(list);
                                }}
                                placeholder="Scan/Type"
                                className="w-full px-1.5 py-1 rounded border border-white/10 bg-white/[0.03] text-white font-mono text-[10px]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const list = [...customPackages];
                                  list[idx].barcode = "EAN" + Math.floor(100000000 + Math.random() * 900000000);
                                  setCustomPackages(list);
                                }}
                                className="px-1 py-0.5 bg-white/[0.06] text-white rounded text-[8px]"
                              >
                                Gen
                              </button>
                            </div>
                          </div>
                          <div className="flex items-end gap-1">
                            <div className="flex-1">
                              <label className="text-[9px] text-muted-foreground block mb-0.5">Price (Rs.) *</label>
                              <input
                                type="number"
                                required
                                min="0.01"
                                step="0.01"
                                value={pkg.mrp || ""}
                                onChange={(e) => {
                                  const list = [...customPackages];
                                  list[idx].mrp = Number(e.target.value);
                                  setCustomPackages(list);
                                }}
                                className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-white font-mono"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomPackages(customPackages.filter((_, i) => i !== idx));
                              }}
                              className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {customPackages.length === 0 && (
                      <p className="text-[10px] text-muted-foreground text-center py-2">No custom packaging levels defined. Single base unit sales only.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 border border-white/10 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg">Save SKU</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── POS Billing ─────────────────────────────────────────────────────────────

function POSBilling({
  medicines,
  setMedicines,
  customers,
  setCustomers,
  transactions,
  setTransactions,
  isSessionOpen,
  setActiveModule,
  printerConfig,
  activePrintInvoice,
  setActivePrintInvoice,
}: {
  medicines: any[];
  setMedicines: React.Dispatch<React.SetStateAction<any[]>>;
  customers: any[];
  setCustomers: React.Dispatch<React.SetStateAction<any[]>>;
  transactions: any[];
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  isSessionOpen: boolean;
  setActiveModule: React.Dispatch<React.SetStateAction<string>>;
  printerConfig: any;
  activePrintInvoice: any;
  setActivePrintInvoice: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [payMethod, setPayMethod] = useState("Cash");

  const [cashReceived, setCashReceived] = useState<number>(0);
  const [creditCustomerId, setCreditCustomerId] = useState("");
  const [creditDueDate, setCreditDueDate] = useState("2026-08-02");
  const [selectedBank, setSelectedBank] = useState("HBL");
  const [bankRefNo, setBankRefNo] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [walletTxId, setWalletTxId] = useState("");
  const [walletConfirmed, setWalletConfirmed] = useState(false);

  // Barcode search states
  const [barcodeInput, setBarcodeInput] = useState("");
  const barcodeRef = useRef<HTMLInputElement>(null);
  const [autoFocusScanner, setAutoFocusScanner] = useState(true);

  const subtotal = cart.reduce((sum, item) => sum + item.mrp * item.qty, 0);
  const discount = cart.reduce((sum, item) => sum + (item.mrp * item.qty * item.discount) / 100, 0);
  const tax = (subtotal - discount) * 0.05;
  const total = subtotal - discount + tax;

  useEffect(() => {
    setCashReceived(Math.ceil(total));
  }, [total]);

  useEffect(() => {
    if (customers.length > 0 && !creditCustomerId) {
      setCreditCustomerId(customers[0].id);
    }
  }, [customers, creditCustomerId]);

  // Auto-focus barcode scan field
  useEffect(() => {
    if (autoFocusScanner && barcodeRef.current && isSessionOpen) {
      barcodeRef.current.focus();
    }
  }, [cart, autoFocusScanner, isSessionOpen]);

  if (!isSessionOpen) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
          <AlertCircle size={28} className="text-amber-400" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-base font-semibold text-foreground">POS Terminal Inactive</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The Daily Cash Register session is currently closed. You must open a cash session before checkouts can be processed.
          </p>
        </div>
        <button
          onClick={() => setActiveModule("cash-register")}
          className="mt-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-blue-500 transition-all cursor-pointer"
        >
          Go to Daily Closing Page
        </button>
      </div>
    );
  }

  const addItem = (med: any) => {
    const defaultPkg = med.packaging && med.packaging.length > 0 ? med.packaging[med.packaging.length - 1] : { type: med.unit, ratio: 1, mrp: med.mrp };
    const defaultUnit = defaultPkg.type;
    const defaultRatio = defaultPkg.ratio;
    const defaultMrp = defaultPkg.mrp;

    const existingIndex = cart.findIndex((c) => c.id === med.id && c.unit === defaultUnit);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].qty += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          id: med.id,
          name: med.name,
          qty: 1,
          unit: defaultUnit,
          mrp: defaultMrp,
          discount: 0,
          ratio: defaultRatio,
          baseMrp: med.mrp,
        },
      ]);
    }
    setSearch("");
  };

  const updateCartItemUnit = (id: string, newUnit: string) => {
    const med = medicines.find(m => m.id === id);
    if (!med) return;

    const pkg = med.packaging ? med.packaging.find((p: any) => p.type === newUnit) : null;
    const ratio = pkg ? pkg.ratio : 1;
    const newMrp = pkg ? pkg.mrp : med.mrp;

    setCart(cart.map((c) => c.id === id ? { ...c, unit: newUnit, mrp: newMrp, ratio } : c));
  };

  const updateQty = (id: string, unit: string, delta: number) => {
    setCart(cart.map((c) => (c.id === id && c.unit === unit ? { ...c, qty: Math.max(1, c.qty + delta) } : c)).filter((c) => c.qty > 0));
  };

  const removeItem = (id: string, unit: string) => {
    setCart(cart.filter((c) => !(c.id === id && c.unit === unit)));
  };

  // Barcode Scanning Handler
  const handleBarcodeScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput) return;

    let foundMed: any = null;
    let foundPkg: any = null;

    for (const med of medicines) {
      if (med.packaging) {
        const pkg = med.packaging.find((p: any) => p.barcode === barcodeInput);
        if (pkg) {
          foundMed = med;
          foundPkg = pkg;
          break;
        }
      }
    }

    if (foundMed && foundPkg) {
      // Check stock limit
      if (foundMed.stock < foundPkg.ratio) {
        alert(`Insufficient stock for ${foundMed.name} in package unit ${foundPkg.type}. Available base units: ${foundMed.stock}`);
        setBarcodeInput("");
        return;
      }

      const existingIndex = cart.findIndex((c) => c.id === foundMed.id && c.unit === foundPkg.type);
      if (existingIndex > -1) {
        const updated = [...cart];
        updated[existingIndex].qty += 1;
        setCart(updated);
      } else {
        setCart([
          ...cart,
          {
            id: foundMed.id,
            name: foundMed.name,
            qty: 1,
            unit: foundPkg.type,
            mrp: foundPkg.mrp,
            discount: 0,
            ratio: foundPkg.ratio,
            baseMrp: foundMed.mrp,
          },
        ]);
      }
    } else {
      alert(`Barcode "${barcodeInput}" not found in catalog.`);
    }

    setBarcodeInput("");
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    for (const item of cart) {
      const med = medicines.find(m => m.id === item.id);
      if (!med) continue;
      const totalBaseQty = item.qty * item.ratio;
      if (med.stock < totalBaseQty) {
        alert(`Insufficient stock for ${item.name}. Available: ${med.stock} base units.`);
        return;
      }
    }

    if (payMethod === "Credit" && !creditCustomerId) {
      alert("Select customer.");
      return;
    }
    if (payMethod === "Bank Transfer" && !bankRefNo) {
      alert("Enter Reference number.");
      return;
    }
    if (payMethod === "EasyPaisa / JazzCash" && (!mobileNumber || !walletTxId || !walletConfirmed)) {
      alert("Enter mobile transaction details & confirm.");
      return;
    }

    const invoiceId = `INV-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB");
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Deduct stock
    setMedicines(medicines.map((med) => {
      const cartItemsForMed = cart.filter(item => item.id === med.id);
      if (cartItemsForMed.length === 0) return med;

      const totalDeductedBaseUnits = cartItemsForMed.reduce((sum, item) => sum + (item.qty * item.ratio), 0);
      const newStock = Math.max(0, med.stock - totalDeductedBaseUnits);
      const status = newStock <= 0 ? "critical" : newStock < 500 ? "low" : "active";
      return { ...med, stock: newStock, status };
    }));

    // Customer balances
    let selectedCustName = "Walk-in Customer";
    if (payMethod === "Credit") {
      setCustomers(customers.map((c) => {
        if (c.id === creditCustomerId) {
          selectedCustName = c.name;
          const newOutstanding = c.outstanding + total;
          return {
            ...c,
            outstanding: newOutstanding,
            visits: c.visits + 1,
            spent: c.spent + total,
            ledger: [...c.ledger, {
              date: dateStr,
              invoiceId,
              type: "Debit",
              description: `POS Credit Purchase`,
              amount: total,
              runningBalance: newOutstanding,
            }],
          };
        }
        return c;
      }));
    } else {
      const regular = customers.find(c => c.name === "Rajesh Kumar");
      if (regular) {
        selectedCustName = regular.name;
        setCustomers(customers.map(c => c.id === regular.id ? { ...c, visits: c.visits + 1, spent: c.spent + total } : c));
      }
    }

    const newTx: any = {
      id: invoiceId,
      customer: selectedCustName,
      time: timeStr,
      items: cart.reduce((sum, item) => sum + item.qty, 0),
      amount: total,
      change: payMethod === "Cash" ? Math.max(0, cashReceived - total) : 0,
      payment: payMethod,
      status: "completed",
      date: dateStr,
      cashier: "Admin",
      details: cart.map(i => ({
        name: i.name,
        qty: i.qty,
        unit: i.unit,
        mrp: i.mrp,
        discount: i.discount,
        total: i.mrp * i.qty * (1 - i.discount/100),
      })),
    };

    if (payMethod === "EasyPaisa / JazzCash") {
      newTx.mobile = mobileNumber;
      newTx.txId = walletTxId;
    } else if (payMethod === "Bank Transfer") {
      newTx.bank = selectedBank;
      newTx.refNo = bankRefNo;
    } else if (payMethod === "Credit") {
      newTx.dueDate = creditDueDate;
    }

    setTransactions([...transactions, newTx]);
    alert(`Checkout complete. Invoice ID: ${invoiceId}`);

    // Printer dispatcher auto print/preview trigger
    if (printerConfig.autoPrint || printerConfig.printPreview) {
      setActivePrintInvoice(newTx);
    }

    setCart([]);
    setBankRefNo("");
    setMobileNumber("");
    setWalletTxId("");
    setWalletConfirmed(false);
  };

  const filteredMeds = search.length > 1 ? medicines.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.generic.toLowerCase().includes(search.toLowerCase())).slice(0, 5) : [];
  const selectedCreditCustObj = customers.find((c) => c.id === creditCustomerId);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">POS Billing Terminal</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Wholesale & retail support via package units</p>
        </div>
        {transactions.length > 0 && (
          <button
            onClick={() => setActivePrintInvoice(transactions[transactions.length - 1])}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-foreground hover:bg-white/[0.08]"
          >
            <Printer size={13} /> Reprint Last Invoice
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Cart - left */}
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Barcode scan entry */}
            <form onSubmit={handleBarcodeScan} className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-card px-4 py-2.5">
              <Barcode size={14} className="text-emerald-400" />
              <input
                ref={barcodeRef}
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Scan barcode here (auto-adds to cart)..."
                className="flex-1 bg-transparent text-xs text-foreground placeholder-muted-foreground focus:outline-none"
              />
              <button type="submit" className="text-[10px] text-emerald-400 hover:underline">Scan</button>
            </form>

            {/* Standard name search */}
            <div className="relative">
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-card px-4 py-2.5">
                <Search size={13} className="text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type name or formula to add to checkout..." className="flex-1 bg-transparent text-xs text-foreground placeholder-muted-foreground focus:outline-none" />
              </div>
              {filteredMeds.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 z-20 rounded-xl border border-white/10 bg-card shadow-2xl overflow-hidden divide-y divide-white/[0.05]">
                  {filteredMeds.map((m) => (
                    <button key={m.id} onClick={() => addItem(m)} className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/[0.04] transition-colors text-left">
                      <div>
                        <p className="text-xs font-semibold text-white">{m.name}</p>
                        <p className="text-[10px] text-muted-foreground">{m.brand} · Stock: {m.stock} {m.unit}</p>
                      </div>
                      <p className="text-xs font-mono text-emerald-400">Rs.{m.mrp.toFixed(2)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["Medicine", "Package Unit", "Quantity", "Conversion", "Unit Price", "Subtotal", "Available Stock", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground/70 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => {
                  const lineTotal = item.mrp * item.qty * (1 - item.discount / 100);
                  const med = medicines.find(m => m.id === item.id);
                  const packagingOptions = med && med.packaging ? med.packaging : [];
                  const baseUnitSymbol = med ? med.unit : "Tablet";
                  const availableBaseStock = med ? med.stock : 0;

                  return (
                    <tr key={`${item.id}-${item.unit}-${index}`} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5 font-medium text-foreground">{item.name}</td>
                      <td className="px-4 py-2.5">
                        {packagingOptions.length > 0 ? (
                          <select value={item.unit} onChange={(e) => updateCartItemUnit(item.id, e.target.value)} className="bg-white/[0.03] border border-white/10 rounded px-1.5 py-0.5 text-[11px] text-foreground focus:outline-none">
                            {packagingOptions.map((pkg: any) => (
                              <option key={pkg.type} value={pkg.type} className="bg-card text-foreground">{pkg.type} (x{pkg.ratio})</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-muted-foreground">{item.unit}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(item.id, item.unit, -1)} className="w-5 h-5 rounded bg-white/[0.06] text-white">−</button>
                          <span className="w-6 text-center font-mono text-foreground">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.unit, 1)} className="w-5 h-5 rounded bg-white/[0.06] text-white">+</button>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-muted-foreground">
                        {item.qty * item.ratio} {baseUnitSymbol}s
                      </td>
                      <td className="px-4 py-2.5 font-mono text-foreground">Rs.{item.mrp.toFixed(2)}</td>
                      <td className="px-4 py-2.5 font-mono text-emerald-400 font-medium">Rs.{lineTotal.toFixed(2)}</td>
                      <td className="px-4 py-2.5 font-mono text-muted-foreground">
                        {availableBaseStock.toLocaleString()} {baseUnitSymbol}s
                      </td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => removeItem(item.id, item.unit)} className="text-muted-foreground hover:text-red-400"><Trash2 size={12} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment panel - right */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-white/[0.07] bg-card p-5 shadow-xl">
            <h4 className="text-xs font-semibold text-foreground mb-4 uppercase">Totals summary</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono text-foreground">Rs.{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-mono text-red-400">−Rs.{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (5%)</span>
                <span className="font-mono text-foreground">Rs.{tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-white/[0.06] my-1" />
              <div className="flex justify-between font-bold text-emerald-400 text-sm">
                <span>Total Payable</span>
                <span>Rs.{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-card p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase">Payment Methods</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Cash", icon: Banknote },
                { label: "Credit", icon: Receipt },
                { label: "Bank Transfer", icon: CreditCard },
                { label: "EasyPaisa / JazzCash", icon: Wallet },
              ].map(({ label, icon: Icon }) => (
                <button key={label} onClick={() => setPayMethod(label)} className={`flex items-center gap-1 px-2 py-2 rounded-lg border text-[11px] font-medium transition-all ${payMethod === label ? "border-primary bg-primary/15 text-primary" : "border-white/[0.07] text-muted-foreground"}`}>
                   <Icon size={12} />
                   {label}
                </button>
              ))}
            </div>

            {payMethod === "Cash" && (
              <div className="mt-3 space-y-2">
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">Cash Received</label>
                  <input type="number" value={cashReceived || ""} onChange={(e) => setCashReceived(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none font-mono" />
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Change Return</span>
                  <span className="text-emerald-400 font-bold">Rs.{Math.max(0, cashReceived - total).toFixed(2)}</span>
                </div>
              </div>
            )}

            {payMethod === "Credit" && (
              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">Select Credit Client</label>
                  <select value={creditCustomerId} onChange={(e) => setCreditCustomerId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-foreground focus:outline-none">
                    {customers.map((c) => (
                      <option key={c.id} value={c.id} className="bg-card text-foreground">{c.name} ({c.id})</option>
                    ))}
                  </select>
                </div>
                {selectedCreditCustObj && (
                  <div className="flex justify-between font-mono text-[10px] bg-white/[0.02] p-2 rounded">
                    <span className="text-muted-foreground font-semibold">Active Outstanding:</span>
                    <span className="text-red-400 font-bold">Rs.{selectedCreditCustObj.outstanding.toLocaleString()}</span>
                  </div>
                )}
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">Payment Due Date</label>
                  <input type="date" value={creditDueDate} onChange={(e) => setCreditDueDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-foreground focus:outline-none" />
                </div>
              </div>
            )}

            {payMethod === "Bank Transfer" && (
              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">Select Bank</label>
                  <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-foreground focus:outline-none">
                    <option value="HBL">Habib Bank (HBL)</option>
                    <option value="Meezan">Meezan Bank</option>
                    <option value="Alfalah">Bank Alfalah</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">Transaction Ref #</label>
                  <input type="text" value={bankRefNo} onChange={(e) => setBankRefNo(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none" />
                </div>
              </div>
            )}

            {payMethod === "EasyPaisa / JazzCash" && (
              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">Account Mobile Number</label>
                  <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="03xx-xxxxxxx" className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">Transaction ID (TID)</label>
                  <input type="text" value={walletTxId} onChange={(e) => setWalletTxId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none font-mono" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={walletConfirmed} onChange={(e) => setWalletConfirmed(e.target.checked)} id="wall-conf" className="rounded" />
                  <label htmlFor="wall-conf" className="text-[10px] text-muted-foreground cursor-pointer">Confirm Payment Received</label>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleCompleteSale} className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-xs font-semibold cursor-pointer">Complete Checkout · Rs.{total.toFixed(2)}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Inventory ────────────────────────────────────────────────────────────────

function Inventory({ medicines }: { medicines: any[] }) {
  const stats = [
    { icon: Package, label: "Total SKUs", value: String(medicines.length), color: "blue" },
    { icon: TrendingUp, label: "Base Stock Count", value: medicines.reduce((s, m) => s + m.stock, 0).toLocaleString(), color: "emerald" },
    { icon: AlertTriangle, label: "Low Stocks", value: String(medicines.filter(m => m.stock < 500).length), color: "amber" },
    { icon: AlertCircle, label: "Critical Stockouts", value: String(medicines.filter(m => m.stock <= 0).length), color: "red" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Inventory management</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Real-time stock indicators</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.05]">
          <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Inventory Batch Ledger</h4>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {["ID", "Medicine Name", "Formula Formula", "Batch ID", "Expiry Date", "Unit Stock"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground/70 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.id} className="border-b border-white/[0.03]">
                <td className="px-4 py-2.5 font-mono text-muted-foreground/50">{m.id}</td>
                <td className="px-4 py-2.5 font-medium text-foreground">{m.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{m.generic}</td>
                <td className="px-4 py-2.5 font-mono text-muted-foreground">{m.batch}</td>
                <td className="px-4 py-2.5 font-mono text-foreground">{m.expiry}</td>
                <td className="px-4 py-2.5 font-mono text-foreground font-bold">{m.stock} {m.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Purchases ────────────────────────────────────────────────────────────────

function Purchases({ purchaseOrders }: { purchaseOrders: any[] }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Purchase orders</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Procurement transactions history</p>
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {["PO Number", "Supplier", "Date", "Items", "Amount (Rs.)", "Status", "Payment"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-medium text-muted-foreground/70 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((po) => (
              <tr key={po.id} className="border-b border-white/[0.03]">
                <td className="px-5 py-3 font-mono text-blue-400">{po.id}</td>
                <td className="px-5 py-3 font-medium text-foreground">{po.supplier}</td>
                <td className="px-5 py-3 font-mono text-muted-foreground">{po.date}</td>
                <td className="px-5 py-3 font-mono text-foreground">{po.items}</td>
                <td className="px-5 py-3 font-mono text-emerald-400 font-bold">Rs.{po.amount.toLocaleString()}</td>
                <td className="px-5 py-3"><StatusBadge status={po.status} /></td>
                <td className="px-5 py-3"><StatusBadge status={po.payment} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Suppliers Redesign ───────────────────────────────────────────────────────

function Suppliers({
  suppliers,
  setSuppliers,
}: {
  suppliers: any[];
  setSuppliers: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedSupProfile, setSelectedSupProfile] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(4.0);

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;

    const newSup = {
      id: `SUP-00${suppliers.length + 1}`,
      name,
      contact,
      phone: phone || "+91 99999 88888",
      city: city || "Mumbai",
      outstanding: 0,
      orders: 0,
      rating,
      ledger: [],
    };

    setSuppliers([...suppliers, newSup]);
    setIsAddOpen(false);

    setName("");
    setContact("");
    setPhone("");
    setCity("");
    setRating(4.0);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Supplier Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{suppliers.length} active distribution partners</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-blue-500 transition-all cursor-pointer"
        >
          <Plus size={13} /> Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="rounded-xl border border-white/[0.07] bg-card p-4 shadow-xl hover:border-white/12 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Building2 size={16} className="text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="font-mono text-amber-400 font-semibold">{s.rating}</span>
                </div>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-0.5">{s.name}</h4>
              <p className="text-[11px] text-muted-foreground mb-3">{s.contact} · {s.city}</p>
            </div>
            <div className="space-y-2 border-t border-white/[0.05] pt-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Orders Placed</span>
                <span className="font-mono text-foreground font-bold">{s.orders}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Outstanding</span>
                <span className={`font-mono font-bold ${s.outstanding === 0 ? "text-emerald-400" : "text-amber-400"}`}>
                  Rs.{s.outstanding.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2.5 mt-2 text-[10px]">
                <button
                  onClick={() => setSelectedSupProfile(s)}
                  className="flex-1 py-1 rounded bg-white/[0.04] text-white hover:bg-white/[0.08]"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedSupProfile && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-foreground">Supplier Profile: {selectedSupProfile.name}</h3>
              <button onClick={() => setSelectedSupProfile(null)} className="text-muted-foreground hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono text-white">{selectedSupProfile.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact Officer:</span>
                <span className="text-white font-medium">{selectedSupProfile.contact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone Contact:</span>
                <span className="font-mono text-white">{selectedSupProfile.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">City:</span>
                <span className="text-white">{selectedSupProfile.city}</span>
              </div>
              <div className="flex justify-between font-mono bg-white/[0.02] p-2.5 rounded">
                <span className="text-muted-foreground">Active Payable Balance:</span>
                <span className="text-amber-400 font-bold">Rs.{selectedSupProfile.outstanding.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-foreground">Add Supply Agency</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-muted-foreground hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddSupplier} className="space-y-3.5 text-xs">
              <div>
                <label className="text-muted-foreground block mb-0.5">Agency Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] text-white" />
              </div>
              <div>
                <label className="text-muted-foreground block mb-0.5">Contact Officer Name *</label>
                <input type="text" required value={contact} onChange={(e) => setContact(e.target.value)} className="w-full px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] text-white" />
              </div>
              <div>
                <label className="text-muted-foreground block mb-0.5">Phone Number</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 xxxxx xxxxx" className="w-full px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] text-white" />
              </div>
              <div>
                <label className="text-muted-foreground block mb-0.5">City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] text-white" />
              </div>
              <div>
                <label className="text-muted-foreground block mb-0.5">Agency Rating</label>
                <input type="number" step="0.1" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] text-white" />
              </div>
              <div className="flex gap-2 justify-end pt-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1.5 border border-white/10 rounded">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-primary text-white rounded">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Customers Redesign ───────────────────────────────────────────────────────

function Customers({
  customers,
  setCustomers,
}: {
  customers: any[];
  setCustomers: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("Regular");
  const [creditLimit, setCreditLimit] = useState(50000);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newCust = {
      id: `CUS-00${customers.length + 1}`,
      name,
      phone,
      type,
      visits: 0,
      spent: 0,
      points: 0,
      outstanding: 0,
      creditLimit,
      ledger: [],
    };

    setCustomers([...customers, newCust]);
    setIsAddOpen(false);

    setName("");
    setPhone("");
    setType("Regular");
    setCreditLimit(50000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Customer Accounts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{customers.length} registered profiles</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-blue-500 transition-all cursor-pointer"
        >
          <Plus size={13} /> Add Customer
        </button>
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {["Customer", "Phone Contact", "Account Class", "Visits Log", "Net Spent (Rs.)", "Loyalty Points", "Outstanding", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-medium text-muted-foreground/70 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const initials = c.name.split(" ").map((n: string) => n[0]).join("");
              return (
                <tr key={c.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-blue-500/20 text-blue-400">{initials}</div>
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-muted-foreground">{c.phone}</td>
                  <td className="px-5 py-3">
                    <Badge variant={c.type === "Loyalty" ? "success" : c.type === "Credit" ? "warning" : "default"}>{c.type}</Badge>
                  </td>
                  <td className="px-5 py-3 font-mono text-foreground">{c.visits}</td>
                  <td className="px-5 py-3 font-mono text-emerald-400 font-medium">Rs.{c.spent.toLocaleString()}</td>
                  <td className="px-5 py-3 font-mono text-foreground">{c.points}</td>
                  <td className="px-5 py-3 font-mono font-bold text-red-400">
                    {c.outstanding > 0 ? `Rs.${c.outstanding.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setSelectedProfile(c)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-white px-2 py-1 bg-white/[0.05] rounded text-[10px]"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-foreground">Customer Profile: {selectedProfile.name}</h3>
              <button onClick={() => setSelectedProfile(null)} className="text-muted-foreground hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-muted-foreground">ID Account:</span>
                <span className="text-white">{selectedProfile.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mobile Contact:</span>
                <span className="font-mono text-white">{selectedProfile.phone}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-muted-foreground">Credit Limit Allowed:</span>
                <span className="text-white">Rs.{(selectedProfile.creditLimit || 50000).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-mono bg-white/[0.02] p-2.5 rounded">
                <span className="text-muted-foreground">Current Outstanding Debt:</span>
                <span className="text-red-400 font-bold">Rs.{selectedProfile.outstanding.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-foreground">Register Client Profile</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-muted-foreground hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="text-muted-foreground block mb-0.5">Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] text-white" />
              </div>
              <div>
                <label className="text-muted-foreground block mb-0.5">Phone Number *</label>
                <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] text-white" />
              </div>
              <div>
                <label className="text-muted-foreground block mb-0.5">Account Class</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] text-xs text-white">
                  <option value="Regular">Regular Class</option>
                  <option value="Credit">Credit Class</option>
                  <option value="Loyalty">Loyalty Class</option>
                </select>
              </div>
              {type === "Credit" && (
                <div>
                  <label className="text-muted-foreground block mb-0.5">Allowed Credit Limit (Rs.)</label>
                  <input type="number" value={creditLimit} onChange={(e) => setCreditLimit(Number(e.target.value))} className="w-full px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] text-white font-mono" />
                </div>
              )}
              <div className="flex gap-2 justify-end pt-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1.5 border border-white/10 rounded">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-primary text-white rounded">Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Customer Ledger ─────────────────────────────────────────────────────────

function CustomerLedgerModule({
  customers,
  setCustomers,
}: {
  customers: any[];
  setCustomers: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [selectedCustId, setSelectedCustId] = useState(customers[0]?.id || "");
  const [payAmount, setPayAmount] = useState<number>(0);
  const [viewingInvoice, setViewingInvoice] = useState<any | null>(null);

  const [custManualDate, setCustManualDate] = useState("2026-07-02");
  const [custManualRef, setCustManualRef] = useState("");
  const [custManualDesc, setCustManualDesc] = useState("");
  const [custManualType, setCustManualType] = useState<"Debit" | "Credit">("Debit");
  const [custManualAmount, setCustManualAmount] = useState<number>(0);

  const activeCustomerObj = customers.find(c => c.id === selectedCustId);

  const handleReceivePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomerObj || payAmount <= 0) return;

    if (payAmount > activeCustomerObj.outstanding) {
      alert("Payment amount exceeds outstanding balance!");
      return;
    }

    const newOutstanding = activeCustomerObj.outstanding - payAmount;
    const newLedgerItem = {
      date: "2026-07-02",
      invoiceId: "PAYMENT",
      type: "Credit",
      description: `Outstanding Payment Received`,
      amount: payAmount,
      runningBalance: newOutstanding,
    };

    setCustomers(customers.map((c) => {
      if (c.id === selectedCustId) {
        return {
          ...c,
          outstanding: newOutstanding,
          ledger: [...c.ledger, newLedgerItem],
        };
      }
      return c;
    }));

    alert(`Payment of Rs.${payAmount.toLocaleString()} recorded.`);
    setPayAmount(0);
  };

  const handleAddCustManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomerObj || custManualAmount <= 0 || !custManualDesc) return;

    let newOutstanding = activeCustomerObj.outstanding;
    if (custManualType === "Debit") {
      newOutstanding += custManualAmount;
    } else {
      newOutstanding = Math.max(0, newOutstanding - custManualAmount);
    }

    const newLedgerItem = {
      date: custManualDate,
      invoiceId: custManualRef || `MAN-${Math.floor(Math.random() * 900 + 100)}`,
      type: custManualType,
      description: custManualDesc,
      amount: custManualAmount,
      runningBalance: newOutstanding,
    };

    setCustomers(customers.map((c) => {
      if (c.id === selectedCustId) {
        return {
          ...c,
          outstanding: newOutstanding,
          ledger: [...c.ledger, newLedgerItem],
        };
      }
      return c;
    }));

    alert("Manual ledger entry posted.");
    setCustManualRef("");
    setCustManualDesc("");
    setCustManualAmount(0);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Customer accounts ledger</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Outstanding credit ledgers & payments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/[0.07] bg-card p-5 shadow-xl space-y-4 h-fit">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Select Customer</label>
            <select
              value={selectedCustId}
              onChange={(e) => setSelectedCustId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-foreground focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id} className="bg-card text-foreground">{c.name} ({c.id})</option>
              ))}
            </select>
          </div>

          {activeCustomerObj && (
            <div className="space-y-3.5 border-t border-white/[0.05] pt-3.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Account Type:</span>
                <Badge variant={activeCustomerObj.type === "Credit" ? "warning" : "default"}>{activeCustomerObj.type}</Badge>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">Total Spent:</span>
                <span className="text-white font-medium">Rs.{activeCustomerObj.spent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-mono bg-white/[0.02] p-2.5 rounded border border-white/5">
                <span className="text-muted-foreground font-semibold">Outstanding Due:</span>
                <span className={activeCustomerObj.outstanding === 0 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                  Rs.{activeCustomerObj.outstanding.toLocaleString()}
                </span>
              </div>

              {activeCustomerObj.outstanding > 0 && (
                <form onSubmit={handleReceivePayment} className="space-y-2 border-t border-white/[0.05] pt-3">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Post Cash Payment</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={payAmount || ""}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      placeholder="Amount to receive (Rs.)"
                      className="flex-1 px-3 py-1.5 rounded border border-white/10 bg-white/[0.03] text-xs text-white focus:outline-none font-mono"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded text-xs font-medium cursor-pointer">Receive</button>
                  </div>
                </form>
              )}

              {/* Manual Ledger Entry Form */}
              <form onSubmit={handleAddCustManualEntry} className="space-y-2 border-t border-white/[0.05] pt-3">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Post Manual Ledger Entry</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-muted-foreground">Date</label>
                    <input
                      type="date"
                      value={custManualDate}
                      onChange={(e) => setCustManualDate(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-muted-foreground">Ref / Inv ID</label>
                    <input
                      type="text"
                      placeholder="e.g. ADJ-01"
                      value={custManualRef}
                      onChange={(e) => setCustManualRef(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground">Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balance Correction"
                    value={custManualDesc}
                    onChange={(e) => setCustManualDesc(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] text-white focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-muted-foreground">Type</label>
                    <select
                      value={custManualType}
                      onChange={(e) => setCustManualType(e.target.value as "Debit" | "Credit")}
                      className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] text-white focus:outline-none"
                    >
                      <option value="Debit" className="bg-card text-foreground">Debit (+ Due)</option>
                      <option value="Credit" className="bg-card text-foreground">Credit (- Due)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-muted-foreground">Amount (Rs.) *</label>
                    <input
                      type="number"
                      required
                      value={custManualAmount || ""}
                      onChange={(e) => setCustManualAmount(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-1 bg-primary hover:bg-blue-500 text-white rounded text-[10px] font-semibold cursor-pointer">
                  Post Entry
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Ledger Log */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">Debit/Credit Log Ledger</h3>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {["Date", "Reference ID", "Description", "Debit (+)", "Credit (−)", "Outstanding Balance", "Receipt"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground/70 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeCustomerObj && activeCustomerObj.ledger && activeCustomerObj.ledger.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{item.date}</td>
                  <td className="px-4 py-2.5 font-mono text-blue-400">{item.invoiceId}</td>
                  <td className="px-4 py-2.5 text-foreground">{item.description}</td>
                  <td className="px-4 py-2.5 font-mono text-red-400 font-medium">
                    {item.type === "Debit" ? `+Rs.${item.amount.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-medium">
                    {item.type === "Credit" ? `−Rs.${item.amount.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-white font-bold">Rs.{item.runningBalance.toLocaleString()}</td>
                  <td className="px-4 py-2.5">
                    {item.invoiceId !== "PAYMENT" ? (
                      <button
                        onClick={() => setViewingInvoice({ id: item.invoiceId, date: item.date, customer: activeCustomerObj.name, amount: item.amount })}
                        className="text-primary hover:underline font-medium text-[10px]"
                      >
                        Print Invoice
                      </button>
                    ) : "—"}
                  </td>
                </tr>
              ))}
              {(!activeCustomerObj || !activeCustomerObj.ledger || activeCustomerObj.ledger.length === 0) && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">No ledger transactions logged.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingInvoice && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-xs font-mono text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="font-bold text-sm">MEDCARE ERP INVOICE</span>
              <button onClick={() => setViewingInvoice(null)} className="text-muted-foreground hover:text-white cursor-pointer"><X size={15} /></button>
            </div>
            <div className="space-y-1">
              <p>Invoice ID: {viewingInvoice.id}</p>
              <p>Date: {viewingInvoice.date}</p>
              <p>Client: {viewingInvoice.customer}</p>
            </div>
            <div className="border-t border-b border-white/10 py-2 my-2 flex justify-between font-bold">
              <span>Grand Total:</span>
              <span className="text-emerald-400">Rs.{viewingInvoice.amount.toLocaleString()}</span>
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-4">Thank you for visiting MedCare Pharmacy!</p>
            <button onClick={() => { alert("Receipt printed."); setViewingInvoice(null); }} className="w-full py-2 bg-primary text-white rounded font-bold">Print Receipt</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Supplier Ledger ─────────────────────────────────────────────────────────

function SupplierLedgerModule({
  suppliers,
  setSuppliers,
}: {
  suppliers: any[];
  setSuppliers: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [selectedSupId, setSelectedSupId] = useState(suppliers[0]?.id || "");
  const [payAmount, setPayAmount] = useState<number>(0);

  const [supManualDate, setSupManualDate] = useState("2026-07-02");
  const [supManualRef, setSupManualRef] = useState("");
  const [supManualDesc, setSupManualDesc] = useState("");
  const [supManualType, setSupManualType] = useState<"Bill" | "Payment">("Bill");
  const [supManualAmount, setSupManualAmount] = useState<number>(0);

  const activeSupplierObj = suppliers.find(s => s.id === selectedSupId);

  const handleMakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSupplierObj || payAmount <= 0) return;

    if (payAmount > activeSupplierObj.outstanding) {
      alert("Payment amount exceeds outstanding debt!");
      return;
    }

    const newOutstanding = activeSupplierObj.outstanding - payAmount;
    const newLedgerItem = {
      date: "2026-07-02",
      poNumber: "PAYMENT",
      type: "Payment",
      description: `Outstanding Debts Paid Off`,
      amount: payAmount,
      runningBalance: newOutstanding,
    };

    setSuppliers(suppliers.map((s) => {
      if (s.id === selectedSupId) {
        return {
          ...s,
          outstanding: newOutstanding,
          ledger: [...s.ledger, newLedgerItem],
        };
      }
      return s;
    }));

    alert(`Payment of Rs.${payAmount.toLocaleString()} recorded to supplier account.`);
    setPayAmount(0);
  };

  const handleAddSupManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSupplierObj || supManualAmount <= 0 || !supManualDesc) return;

    let newOutstanding = activeSupplierObj.outstanding;
    if (supManualType === "Bill") {
      newOutstanding += supManualAmount;
    } else {
      newOutstanding = Math.max(0, newOutstanding - supManualAmount);
    }

    const newLedgerItem = {
      date: supManualDate,
      poNumber: supManualRef || `MAN-${Math.floor(Math.random() * 900 + 100)}`,
      type: supManualType,
      description: supManualDesc,
      amount: supManualAmount,
      runningBalance: newOutstanding,
    };

    setSuppliers(suppliers.map((s) => {
      if (s.id === selectedSupId) {
        return {
          ...s,
          outstanding: newOutstanding,
          ledger: [...s.ledger, newLedgerItem],
        };
      }
      return s;
    }));

    alert("Manual ledger entry posted.");
    setSupManualRef("");
    setSupManualDesc("");
    setSupManualAmount(0);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Supplier ledgers</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Purchases, payouts, and outstanding bills</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/[0.07] bg-card p-5 shadow-xl space-y-4 h-fit">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Select Supplier</label>
            <select
              value={selectedSupId}
              onChange={(e) => setSelectedSupId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-foreground focus:outline-none"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id} className="bg-card text-foreground">{s.name}</option>
              ))}
            </select>
          </div>

          {activeSupplierObj && (
            <div className="space-y-3.5 border-t border-white/[0.05] pt-3.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">Contact:</span>
                <span className="text-foreground">{activeSupplierObj.contact}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">Orders Count:</span>
                <span className="text-foreground">{activeSupplierObj.orders}</span>
              </div>
              <div className="flex justify-between text-xs font-mono bg-white/[0.02] p-2 rounded">
                <span className="text-muted-foreground font-semibold">Payable Liability:</span>
                <span className={activeSupplierObj.outstanding === 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                  Rs.{activeSupplierObj.outstanding.toLocaleString()}
                </span>
              </div>

              {activeSupplierObj.outstanding > 0 && (
                <form onSubmit={handleMakePayment} className="space-y-2 border-t border-white/[0.05] pt-3">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Record Payment Made</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={payAmount || ""}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      placeholder="Amount to pay (Rs.)"
                      className="flex-1 px-3 py-1.5 rounded border border-white/10 bg-white/[0.03] text-xs text-white focus:outline-none font-mono"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded text-xs font-medium cursor-pointer font-bold">Pay Out</button>
                  </div>
                </form>
              )}

              {/* Manual Ledger Entry Form */}
              <form onSubmit={handleAddSupManualEntry} className="space-y-2 border-t border-white/[0.05] pt-3">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Post Manual Ledger Entry</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-muted-foreground">Date</label>
                    <input
                      type="date"
                      value={supManualDate}
                      onChange={(e) => setSupManualDate(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-muted-foreground">PO / Ref ID</label>
                    <input
                      type="text"
                      placeholder="e.g. ADJ-01"
                      value={supManualRef}
                      onChange={(e) => setSupManualRef(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground">Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balance Correction"
                    value={supManualDesc}
                    onChange={(e) => setSupManualDesc(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] text-white focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-muted-foreground">Type</label>
                    <select
                      value={supManualType}
                      onChange={(e) => setSupManualType(e.target.value as "Bill" | "Payment")}
                      className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] text-white focus:outline-none"
                    >
                      <option value="Bill" className="bg-card text-foreground">Bill (+ Due)</option>
                      <option value="Payment" className="bg-card text-foreground">Payment (- Due)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-muted-foreground">Amount (Rs.) *</label>
                    <input
                      type="number"
                      required
                      value={supManualAmount || ""}
                      onChange={(e) => setSupManualAmount(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-1 bg-primary hover:bg-blue-500 text-white rounded text-[10px] font-semibold cursor-pointer">
                  Post Entry
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Ledger log */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">Purchase Bills Log</h3>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {["Date", "PO Number", "Type", "Description", "Bill Amount", "Running Balance"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground/70 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeSupplierObj && activeSupplierObj.ledger && activeSupplierObj.ledger.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-white/[0.03]">
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{item.date}</td>
                  <td className="px-4 py-2.5 font-mono text-blue-400">{item.poNumber}</td>
                  <td className="px-4 py-2.5 text-foreground">{item.type}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{item.description}</td>
                  <td className="px-4 py-2.5 font-mono text-amber-400 font-medium">Rs.{item.amount.toLocaleString()}</td>
                  <td className="px-4 py-2.5 font-mono text-white font-bold">Rs.{item.runningBalance.toLocaleString()}</td>
                </tr>
              ))}
              {(!activeSupplierObj || !activeSupplierObj.ledger || activeSupplierObj.ledger.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">No purchase bill entries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Accounts & Finance ──────────────────────────────────────────────────────

function AccountsFinanceModule({ transactions }: { transactions: any[] }) {
  const cashSales = transactions.filter(t => t.payment === "Cash").reduce((sum, t) => sum + t.amount, 0);
  const creditSales = transactions.filter(t => t.payment === "Credit").reduce((sum, t) => sum + t.amount, 0);
  const bankSales = transactions.filter(t => t.payment === "Bank Transfer").reduce((sum, t) => sum + t.amount, 0);
  const walletSales = transactions.filter(t => t.payment === "EasyPaisa / JazzCash").reduce((sum, t) => sum + t.amount, 0);

  const bankTxs = transactions.filter(t => t.payment === "Bank Transfer");
  const walletTxs = transactions.filter(t => t.payment === "EasyPaisa / JazzCash");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Accounts & Finance</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Asset accounts and transaction routes summary</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Banknote} label="Cash Drawer Asset" value={`Rs.${(cashSales + 5000).toLocaleString()}`} sub="Starting cash: Rs.5,000" color="emerald" />
        <StatCard icon={CreditCard} label="Bank Accounts" value={`Rs.${bankSales.toLocaleString()}`} sub="Direct wire transfers" color="blue" />
        <StatCard icon={Wallet} label="Mobile Wallets" value={`Rs.${walletSales.toLocaleString()}`} sub="EasyPaisa & JazzCash" color="purple" />
        <StatCard icon={Receipt} label="Outstanding Credit" value={`Rs.${creditSales.toLocaleString()}`} sub="Due receivables" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center gap-2">
            <CreditCard size={14} className="text-blue-400" />
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Bank Transfer Inflows</h4>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {["Invoice ID", "Bank Name", "Ref Number", "Date", "Amount"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bankTxs.map((t) => (
                <tr key={t.id} className="border-b border-white/[0.03]">
                  <td className="px-4 py-2.5 font-mono text-blue-400">{t.id}</td>
                  <td className="px-4 py-2.5 font-semibold text-foreground">{t.bank}</td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{t.refNo}</td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{t.date}</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-bold">Rs.{t.amount.toLocaleString()}</td>
                </tr>
              ))}
              {bankTxs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">No bank transfers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center gap-2">
            <Wallet size={14} className="text-purple-400" />
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Mobile Wallet Inflows</h4>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {["Invoice ID", "Mobile No.", "TID Reference", "Date", "Amount"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {walletTxs.map((t) => (
                <tr key={t.id} className="border-b border-white/[0.03]">
                  <td className="px-4 py-2.5 font-mono text-blue-400">{t.id}</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">{t.mobile}</td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{t.txId}</td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{t.date}</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-bold">Rs.{t.amount.toLocaleString()}</td>
                </tr>
              ))}
              {walletTxs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">No mobile wallet transfers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Daily Register Closing Page (Lifecycle Enabled) ─────────────────────────

function CashRegisterModule({
  transactions,
  isSessionOpen,
  setIsSessionOpen,
  activeFloat,
  setActiveFloat,
  registerSessionsHistory,
  setRegisterSessionsHistory,
}: {
  transactions: any[];
  isSessionOpen: boolean;
  setIsSessionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeFloat: number;
  setActiveFloat: React.Dispatch<React.SetStateAction<number>>;
  registerSessionsHistory: any[];
  setRegisterSessionsHistory: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const cashSales = transactions.filter((t) => t.payment === "Cash" && t.date === "2026-07-02").reduce((sum, t) => sum + t.amount, 0);
  const cardSales = transactions.filter((t) => t.payment === "Bank Transfer" && t.date === "2026-07-02").reduce((sum, t) => sum + t.amount, 0);
  const walletSales = transactions.filter((t) => t.payment === "EasyPaisa / JazzCash" && t.date === "2026-07-02").reduce((sum, t) => sum + t.amount, 0);
  const creditSales = transactions.filter((t) => t.payment === "Credit" && t.date === "2026-07-02").reduce((sum, t) => sum + t.amount, 0);

  const expectedCash = activeFloat + cashSales;

  // Open/Close inputs
  const [openFloatInput, setOpenFloatInput] = useState<number>(5000);
  const [openCashierName, setOpenCashierName] = useState("Dr. Arun Mehta");
  const [showOpenModal, setShowOpenModal] = useState(false);

  const [actualCashCounted, setActualCashCounted] = useState<number>(expectedCash);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const cashDifference = actualCashCounted - expectedCash;

  const handleOpenCashSession = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveFloat(openFloatInput);
    setIsSessionOpen(true);
    setShowOpenModal(false);
    setActualCashCounted(openFloatInput); // Sync actual counts default
    alert(`Register Drawer initialized with Starting Float: Rs.${openFloatInput.toLocaleString()}`);
  };

  const handleCloseCashSession = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newSessionLog = {
      id: `SESS-0${registerSessionsHistory.length + 1}`,
      openTime: "08:00 AM",
      closeTime: timeStr,
      float: activeFloat,
      sales: cashSales,
      expected: expectedCash,
      counted: actualCashCounted,
      difference: cashDifference,
      status: cashDifference === 0 ? "Reconciled" : "Discrepancy",
      date: "2026-07-02",
      auditor: openCashierName,
    };

    setRegisterSessionsHistory([...registerSessionsHistory, newSessionLog]);
    setIsSessionOpen(false);
    setShowCloseModal(false);
    alert("Register Drawer session locked. Session archived in audits ledger.");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Daily register closing</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Control daily drawer float and lock sessions</p>
        </div>
        {isSessionOpen ? (
          <button
            onClick={() => {
              setActualCashCounted(expectedCash); // reset default close cash count
              setShowCloseModal(true);
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close Cash / End Session
          </button>
        ) : (
          <button
            onClick={() => setShowOpenModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Open Cash / Start Session
          </button>
        )}
      </div>

      {!isSessionOpen ? (
        <div className="rounded-xl border border-white/[0.07] bg-card p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto border border-white/5">
            <LockIcon size={24} className="text-muted-foreground" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-sm font-semibold text-white">Daily register session closed</h3>
            <p className="text-xs text-muted-foreground">The POS terminal cannot check out transactions until you execute "Open Cash" to initialize starting floats.</p>
          </div>
          <button
            onClick={() => setShowOpenModal(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Initialize Drawer (Open Cash)
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-white/[0.07] bg-card p-5 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Float starting Cash</span>
              <p className="text-xl font-mono font-bold text-white">Rs.{activeFloat.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-card p-5 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Expected cash sales</span>
              <p className="text-xl font-mono font-bold text-emerald-400">Rs.{cashSales.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-card p-5 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Expected drawer cash</span>
              <p className="text-xl font-mono font-bold text-blue-400">Rs.{expectedCash.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-card p-5 space-y-2">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Actual Cash Counted</span>
              <input
                type="number"
                value={actualCashCounted || ""}
                onChange={(e) => setActualCashCounted(Number(e.target.value))}
                className="w-full px-3 py-1 bg-white/[0.03] border border-white/10 rounded font-mono text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.05]">
                <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">Drawer Payments Inflows</h3>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    {["Payment Stream", "Expected Inflow", "Actual counted", "Difference Status"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground/70 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/[0.03]">
                    <td className="px-4 py-3 font-semibold">Cash Drawer (Sales + Float)</td>
                    <td className="px-4 py-3 font-mono">Rs.{expectedCash.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono">Rs.{actualCashCounted.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono">
                      {cashDifference === 0 ? (
                        <span className="text-emerald-400 font-bold">Perfect Balance</span>
                      ) : cashDifference > 0 ? (
                        <span className="text-emerald-400 font-bold">+Rs.{cashDifference.toLocaleString()} (Surplus)</span>
                      ) : (
                        <span className="text-red-400 font-bold">−Rs.{Math.abs(cashDifference).toLocaleString()} (Shortage)</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-white/[0.03]">
                    <td className="px-4 py-3 font-semibold">Bank Transfers Account</td>
                    <td className="px-4 py-3 font-mono">Rs.{cardSales.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono">Rs.{cardSales.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">Auto Verified</td>
                  </tr>
                  <tr className="border-b border-white/[0.03]">
                    <td className="px-4 py-3 font-semibold">Mobile Wallets</td>
                    <td className="px-4 py-3 font-mono">Rs.{walletSales.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono">Rs.{walletSales.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">Auto Verified</td>
                  </tr>
                  <tr className="border-b border-white/[0.03]">
                    <td className="px-4 py-3 font-semibold">Outstanding Credit Sales</td>
                    <td className="px-4 py-3 font-mono">Rs.{creditSales.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono">Rs.{creditSales.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">Logged to Ledger</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-card p-5 space-y-3">
              <h4 className="text-xs font-semibold text-white uppercase">Active drawer checks</h4>
              <div className="text-[11px] text-muted-foreground space-y-2">
                <p>• Starting Float count is verified inside drawer memory.</p>
                <p>• Cash receipts are automatically calculated upon checkout.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Logs */}
      <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden mt-6">
        <div className="px-5 py-4 border-b border-white/[0.05]">
          <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">Register Sessions Audit History Log</h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {["Session ID", "Date", "Opening Float", "Cash Sales", "Expected Drawer", "Counted Drawer", "Difference", "Audited By", "Status"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground/70 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registerSessionsHistory.map((sess) => (
              <tr key={sess.id} className="border-b border-white/[0.03]">
                <td className="px-4 py-2.5 font-mono text-blue-400">{sess.id}</td>
                <td className="px-4 py-2.5 font-mono text-muted-foreground">{sess.date}</td>
                <td className="px-4 py-2.5 font-mono">Rs.{sess.float.toLocaleString()}</td>
                <td className="px-4 py-2.5 font-mono">Rs.{sess.sales.toLocaleString()}</td>
                <td className="px-4 py-2.5 font-mono">Rs.{sess.expected.toLocaleString()}</td>
                <td className="px-4 py-2.5 font-mono">Rs.{sess.counted.toLocaleString()}</td>
                <td className={`px-4 py-2.5 font-mono font-semibold ${sess.difference === 0 ? "text-emerald-400" : "text-red-400"}`}>
                  Rs.{sess.difference.toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-foreground">{sess.auditor || "Admin User"}</td>
                <td className="px-4 py-2.5">
                  <Badge variant={sess.difference === 0 ? "success" : "danger"}>{sess.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Symmetrical Open Cash Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="font-bold text-xs font-mono uppercase text-white">Open Cash / Start Session</span>
              <button onClick={() => setShowOpenModal(false)} className="text-muted-foreground hover:text-white cursor-pointer"><X size={15} /></button>
            </div>
            <form onSubmit={handleOpenCashSession} className="space-y-3.5 text-xs">
              <div>
                <label className="text-muted-foreground block mb-1">Starting float cash drawer (Rs.) *</label>
                <input
                  type="number"
                  required
                  value={openFloatInput || ""}
                  onChange={(e) => setOpenFloatInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] font-mono text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground block mb-1">Auditing Cashier Name</label>
                <input
                  type="text"
                  required
                  value={openCashierName}
                  onChange={(e) => setOpenCashierName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-xs text-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded font-bold uppercase cursor-pointer"
              >
                Confirm & Open Drawer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Symmetrical Close Cash Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-2xl space-y-4 font-mono text-xs text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="font-bold text-xs uppercase">Close Cash / End Session</span>
              <button onClick={() => setShowCloseModal(false)} className="text-muted-foreground hover:text-white cursor-pointer"><X size={15} /></button>
            </div>
            <div className="space-y-1.5">
              <p>Auditor: {openCashierName}</p>
              <div className="border-t border-white/10 my-2 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Starting Float:</span>
                  <span>Rs.{activeFloat.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cash Sales today:</span>
                  <span>Rs.{cashSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-b border-white/5 pb-1 mb-1">
                  <span>Expected Drawer Cash:</span>
                  <span>Rs.{expectedCash.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-[10px] text-muted-foreground uppercase">Actual Cash Counted:</span>
                  <input
                    type="number"
                    value={actualCashCounted || ""}
                    onChange={(e) => setActualCashCounted(Number(e.target.value))}
                    className="w-24 px-2 py-1 bg-white/[0.05] border border-white/10 rounded font-mono text-right text-white focus:outline-none"
                  />
                </div>
                <div className="flex justify-between font-bold border-t border-dashed border-white/10 pt-2 text-amber-400">
                  <span>Audit Difference:</span>
                  <span>Rs.{cashDifference.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCloseCashSession}
              className="w-full py-2.5 bg-red-500 hover:bg-red-400 text-white rounded font-bold uppercase cursor-pointer"
            >
              Confirm Close & Lock Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── User & Roles Management ──────────────────────────────────────────────────

function UserMgmtModule({
  usersList,
  setUsersList,
}: {
  usersList: any[];
  setUsersList: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Cashier");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Cashier");

  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    Admin: ["Dashboard", "POS Billing", "Medicines", "Inventory", "Purchases", "Suppliers", "Customers", "Ledgers", "Finance", "Cash Register", "Reports", "Settings"],
    Pharmacist: ["Dashboard", "POS Billing", "Medicines", "Inventory", "Reports"],
    Cashier: ["POS Billing", "Cash Register"],
    "Inv. Manager": ["Inventory", "Purchases", "Suppliers", "Reports"],
  });

  const handleTogglePerm = (roleName: string, moduleName: string) => {
    const activePerms = rolePermissions[roleName] || [];
    const updatedPerms = activePerms.includes(moduleName)
      ? activePerms.filter(m => m !== moduleName)
      : [...activePerms, moduleName];
    
    setRolePermissions({
      ...rolePermissions,
      [roleName]: updatedPerms,
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser = {
      name,
      email,
      role,
      access: rolePermissions[role]?.join(", ") || "POS Only",
      color: role === "Admin" ? "purple" : role === "Pharmacist" ? "blue" : role === "Cashier" ? "emerald" : "amber",
      status: "Active",
    };

    setUsersList([...usersList, newUser]);
    setIsAddOpen(false);

    setName("");
    setEmail("");
    setRole("Cashier");
  };

  const availableModules = ["Dashboard", "POS Billing", "Medicines", "Inventory", "Purchases", "Suppliers", "Customers", "Ledgers", "Finance", "Cash Register", "Reports", "Settings"];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">User Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Control staff accounts & role privileges</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-blue-500 transition-all cursor-pointer"
        >
          <Plus size={13} /> Add Staff Account
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Active Staff Accounts</h3>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {["Staff User", "Role", "Email", "Access Modules"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground/70 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usersList.map((u, idx) => (
                <tr key={idx} className="border-b border-white/[0.03]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center font-bold text-[10px] text-white">
                        {u.name[0]}
                      </div>
                      <span className="font-semibold text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.color}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{rolePermissions[u.role]?.join(", ") || u.access}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-card p-5 shadow-xl space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Access Control List</h3>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Select Role to Edit</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-foreground focus:outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Cashier">Cashier</option>
              <option value="Inv. Manager">Inv. Manager</option>
            </select>
          </div>

          <div className="border-t border-white/[0.05] pt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Permitted Modules</p>
            {availableModules.map((mod) => {
              const isChecked = rolePermissions[selectedRole]?.includes(mod) || false;
              return (
                <div key={mod} className="flex items-center justify-between text-xs py-1">
                  <span className="text-foreground">{mod}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleTogglePerm(selectedRole, mod)}
                    className="rounded text-primary border-white/10 bg-white/[0.02]"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-foreground">Add Staff Account</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-muted-foreground hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
              <div>
                <label className="text-muted-foreground block mb-0.5">Staff Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] text-white" />
              </div>
              <div>
                <label className="text-muted-foreground block mb-0.5">Email Address *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] text-white font-mono" />
              </div>
              <div>
                <label className="text-muted-foreground block mb-0.5">Assigned Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] text-xs text-white">
                  <option value="Admin">Admin</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Inv. Manager">Inv. Manager</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1.5 border border-white/10 rounded">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-primary text-white rounded">Save Staff Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Reports ─────────────────────────────────────────────────────────────────

function ReportsPage({
  medicines,
  transactions,
  customers,
}: {
  medicines: any[];
  transactions: any[];
  customers: any[];
}) {
  const cashTotal = transactions.filter(t => t.payment === "Cash").reduce((sum, t) => sum + t.amount, 0);
  const creditTotal = transactions.filter(t => t.payment === "Credit").reduce((sum, t) => sum + t.amount, 0);
  const bankTotal = transactions.filter(t => t.payment === "Bank Transfer").reduce((sum, t) => sum + t.amount, 0);
  const walletTotal = transactions.filter(t => t.payment === "EasyPaisa / JazzCash").reduce((sum, t) => sum + t.amount, 0);

  const paymentPieData = [
    { name: "Cash", value: cashTotal, color: "#10b981" },
    { name: "Credit", value: creditTotal, color: "#f59e0b" },
    { name: "Bank Transfer", value: bankTotal, color: "#3b82f6" },
    { name: "EasyPaisa / JazzCash", value: walletTotal, color: "#8b5cf6" },
  ].filter(p => p.value > 0);

  const packageConversations = medicines.map((m) => {
    const formulas: string[] = [];
    if (m.packaging && m.packaging.length > 1) {
      m.packaging.forEach((pkg: any) => {
        if (pkg.ratio === 1) return;
        formulas.push(`1 ${pkg.type} = ${pkg.qty} ${pkg.childUnit}`);
      });
    }
    return {
      id: m.id,
      name: m.name,
      baseUnit: m.unit,
      conversions: formulas.length > 0 ? formulas.join(" · ") : "Single Base Unit Only",
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Reports & Analytics</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Dynamic reports for payment streams & packaging conversions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/[0.07] bg-card p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Payment share breakdown</h3>
            <p className="text-[10px] text-muted-foreground mb-4 font-mono">Total sales: Rs.{transactions.reduce((s,t)=>s+t.amount,0).toLocaleString()}</p>
          </div>
          {paymentPieData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={paymentPieData} cx="50%" cy="50%" outerRadius={55} innerRadius={25} dataKey="value">
                    {paymentPieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 overflow-y-auto max-h-20 text-[10px] font-mono">
                {paymentPieData.map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-muted-foreground">{c.name}</span>
                    </div>
                    <span className="text-white font-bold">Rs.{c.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">No transactions found.</div>
          )}
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-card p-5 shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Outstanding customer receivables</h3>
            <span className="text-[11px] font-bold text-red-400 font-mono">Total Receivables: Rs.{customers.reduce((s,c)=>s+c.outstanding,0).toLocaleString()}</span>
          </div>
          <div className="overflow-y-auto max-h-52">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-white/[0.05] text-muted-foreground/70 uppercase">
                  <th className="py-2 text-left">ID</th>
                  <th className="py-2 text-left">Customer Name</th>
                  <th className="py-2 text-left font-mono">Phone</th>
                  <th className="py-2 text-right">Outstanding Due</th>
                </tr>
              </thead>
              <tbody>
                {customers.filter(c => c.outstanding > 0).map((c) => (
                  <tr key={c.id} className="border-b border-white/[0.03]">
                    <td className="py-2 font-mono text-muted-foreground">{c.id}</td>
                    <td className="py-2 text-white font-medium">{c.name}</td>
                    <td className="py-2 font-mono text-muted-foreground">{c.phone}</td>
                    <td className="py-2 text-right font-mono text-red-400 font-bold">Rs.{c.outstanding.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.05]">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Credit Sales Report</h4>
          </div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/[0.05] text-muted-foreground/70 uppercase">
                <th className="px-4 py-2 text-left">Invoice ID</th>
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.filter(t => t.payment === "Credit").map((t) => (
                <tr key={t.id} className="border-b border-white/[0.03]">
                  <td className="px-4 py-2 font-mono text-blue-400">{t.id}</td>
                  <td className="px-4 py-2 text-foreground">{t.customer}</td>
                  <td className="px-4 py-2 font-mono text-muted-foreground">{t.dueDate}</td>
                  <td className="px-4 py-2 text-right font-mono text-amber-400 font-bold">Rs.{t.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.05]">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Bank & Mobile Wallet Trans</h4>
          </div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/[0.05] text-muted-foreground/70 uppercase">
                <th className="px-4 py-2 text-left">Ref Code</th>
                <th className="px-4 py-2 text-left">Method</th>
                <th className="px-4 py-2 text-left">Account</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.filter(t => ["Bank Transfer", "EasyPaisa / JazzCash"].includes(t.payment)).map((t) => (
                <tr key={t.id} className="border-b border-white/[0.03]">
                  <td className="px-4 py-2 font-mono text-blue-400">{t.refNo || t.txId}</td>
                  <td className="px-4 py-2"><Badge variant={t.payment === "Bank Transfer" ? "default" : "purple"}>{t.payment}</Badge></td>
                  <td className="px-4 py-2 font-mono text-muted-foreground">{t.bank ? `Bank: ${t.bank}` : `Mob: ${t.mobile}`}</td>
                  <td className="px-4 py-2 text-right font-mono text-emerald-400 font-bold">Rs.{t.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.05]">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Medicine Sales by Unit Type</h4>
          </div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/[0.05] text-muted-foreground/70 uppercase">
                <th className="px-4 py-2 text-left">Medicine</th>
                <th className="px-4 py-2 text-left">Unit Sold</th>
                <th className="px-4 py-2 text-right">Quantity</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {transactions.flatMap(t => t.details || []).reduce((acc: any[], item: any) => {
                const existing = acc.find(x => x.name === item.name && x.unit === item.unit);
                if (existing) {
                  existing.qty += item.qty;
                  existing.total += item.total;
                } else {
                  acc.push({ name: item.name, unit: item.unit, qty: item.qty, total: item.total });
                }
                return acc;
              }, []).map((row, idx) => (
                <tr key={idx} className="border-b border-white/[0.03]">
                  <td className="px-4 py-2 text-white font-medium">{row.name}</td>
                  <td className="px-4 py-2"><Badge variant="cyan">{row.unit}</Badge></td>
                  <td className="px-4 py-2 text-right font-mono">{row.qty}</td>
                  <td className="px-4 py-2 text-right font-mono text-emerald-400 font-bold">Rs.{row.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-card shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.05]">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Package conversion formulas</h4>
          </div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/[0.05] text-muted-foreground/70 uppercase">
                <th className="px-4 py-2 text-left">Medicine SKU</th>
                <th className="px-4 py-2 text-left">Base Unit</th>
                <th className="px-4 py-2 text-left">Conversion Equations</th>
              </tr>
            </thead>
            <tbody>
              {packageConversations.map((row) => (
                <tr key={row.id} className="border-b border-white/[0.03]">
                  <td className="px-4 py-2 text-white font-medium">{row.name}</td>
                  <td className="px-4 py-2"><Badge>{row.baseUnit}</Badge></td>
                  <td className="px-4 py-2 font-mono text-muted-foreground">{row.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────

function SettingsPage({
  printerConfig,
  setPrinterConfig,
  onTestPrint,
}: {
  printerConfig: any;
  setPrinterConfig: React.Dispatch<React.SetStateAction<any>>;
  onTestPrint: () => void;
}) {
  const [localPrinter, setLocalPrinter] = useState(printerConfig);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPrinterConfig(localPrinter);
    alert("Printer configuration saved!");
  };

  const handleReset = () => {
    const def = {
      printerName: "XP-80 thermal",
      printerType: "Thermal",
      connectionType: "USB",
      paperSize: "80mm",
      copies: 1,
      autoPrint: true,
      printPreview: true,
    };
    setLocalPrinter(def);
    setPrinterConfig(def);
    alert("Printer configuration reset!");
  };

  const sections = [
    {
      title: "Store Information",
      icon: Building2,
      fields: [
        { label: "Store Name", value: "MedCare Pharmacy", type: "text" },
        { label: "License Number", value: "PH-MH-2024-88441", type: "text" },
        { label: "GST Number", value: "27AABCP1234A1Z5", type: "text" },
        { label: "Contact Phone", value: "+91 22 2567 8900", type: "text" },
      ],
    },
    {
      title: "Tax Settings",
      icon: Receipt,
      fields: [
        { label: "Default GST Rate", value: "5", type: "number" },
        { label: "Include GST in MRP", value: "Yes", type: "text" },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Settings</h2>
        <p className="text-xs text-muted-foreground mt-0.5">System configurations & preferences</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Col - General settings */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.title} className="rounded-xl border border-white/[0.07] bg-card p-5 shadow-xl">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <section.icon size={15} className="text-blue-400" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
              </div>
              <div className="space-y-3">
                {section.fields.map((f) => (
                  <div key={f.label}>
                    <label className="text-[11px] text-muted-foreground block mb-1 font-medium">{f.label}</label>
                    <input
                      type={f.type}
                      defaultValue={f.value}
                      className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                ))}
              </div>
              <button className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-blue-500 transition-all cursor-pointer">Save Changes</button>
            </div>
          ))}
        </div>

        {/* Right Col - Printer settings */}
        <div className="rounded-xl border border-white/[0.07] bg-card p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.05]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Printer size={15} className="text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Printer Integration</h4>
              <p className="text-[10px] text-muted-foreground">Setup receipts & report layouts</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-muted-foreground block mb-1 font-medium font-sans">Printer Name</label>
                <input
                  type="text"
                  value={localPrinter.printerName}
                  onChange={(e) => setLocalPrinter({ ...localPrinter, printerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Printer Type</label>
                <select
                  value={localPrinter.printerType}
                  onChange={(e) => setLocalPrinter({ ...localPrinter, printerType: e.target.value, paperSize: e.target.value === "Thermal" ? "80mm" : "A4" })}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-foreground focus:outline-none"
                >
                  <option value="Thermal" className="bg-card text-foreground">Thermal Printer (Receipts)</option>
                  <option value="Laser" className="bg-card text-foreground">Laser / Inkjet (A4 Invoice)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Connection Type</label>
                <select
                  value={localPrinter.connectionType}
                  onChange={(e) => setLocalPrinter({ ...localPrinter, connectionType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-foreground focus:outline-none"
                >
                  <option value="USB" className="bg-card text-foreground">USB Cable</option>
                  <option value="Network" className="bg-card text-foreground">Network (LAN/IP)</option>
                  <option value="Wi-Fi" className="bg-card text-foreground">Wi-Fi</option>
                  <option value="Bluetooth" className="bg-card text-foreground">Bluetooth</option>
                </select>
              </div>
              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Paper Size</label>
                <select
                  value={localPrinter.paperSize}
                  onChange={(e) => setLocalPrinter({ ...localPrinter, paperSize: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-foreground focus:outline-none"
                >
                  {localPrinter.printerType === "Thermal" ? (
                    <>
                      <option value="58mm" className="bg-card text-foreground">58mm Receipt</option>
                      <option value="80mm" className="bg-card text-foreground">80mm Receipt</option>
                    </>
                  ) : (
                    <option value="A4" className="bg-card text-foreground">A4 Standard Sheet</option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="text-muted-foreground block mb-1 font-medium">Number of Copies</label>
              <input
                type="number"
                min="1"
                max="5"
                value={localPrinter.copies}
                onChange={(e) => setLocalPrinter({ ...localPrinter, copies: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-foreground focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-2.5 pt-2">
              <label className="flex items-center gap-2 text-muted-foreground font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrinter.autoPrint}
                  onChange={(e) => setLocalPrinter({ ...localPrinter, autoPrint: e.target.checked })}
                  className="rounded"
                />
                <span>Auto Print Invoice on POS checkout completion</span>
              </label>
              <label className="flex items-center gap-2 text-muted-foreground font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrinter.printPreview}
                  onChange={(e) => setLocalPrinter({ ...localPrinter, printPreview: e.target.checked })}
                  className="rounded"
                />
                <span>Show print preview dialog before sending job</span>
              </label>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium cursor-pointer"
              >
                Save Configuration
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/[0.04] text-white font-medium cursor-pointer"
              >
                Reset Configuration
              </button>
              <button
                type="button"
                onClick={onTestPrint}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium cursor-pointer ml-auto"
              >
                Test Print
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Placeholder module ────────────────────────────────────────────────────────

function PlaceholderModule({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center">
        <Icon size={28} className="text-muted-foreground/50" />
      </div>
      <div className="text-center">
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">Module ready · Live records interface active</p>
      </div>
    </div>
  );
}

// ─── Invoice Print Preview Modal ────────────────────────────────────────────────
function InvoicePrintModal({
  invoice,
  onClose,
  printerConfig,
}: {
  invoice: any;
  onClose: () => void;
  printerConfig: any;
}) {
  const [printFormat, setPrintFormat] = useState(printerConfig.printerType === "Thermal" ? "thermal" : "a4");

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto no-print">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div className="bg-card border border-white/10 rounded-xl p-5 w-full max-w-2xl flex flex-col max-h-[90vh] text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Invoice Print Dispatcher</h3>
            <p className="text-[10px] text-muted-foreground">Default config: {printerConfig.printerName} ({printerConfig.paperSize})</p>
          </div>
          <div className="flex gap-2 bg-white/[0.04] p-1 rounded-lg">
            <button
              onClick={() => setPrintFormat("thermal")}
              className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all ${printFormat === "thermal" ? "bg-primary text-white" : "text-muted-foreground"}`}
            >
              Thermal Receipt (58/80mm)
            </button>
            <button
              onClick={() => setPrintFormat("a4")}
              className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all ${printFormat === "a4" ? "bg-primary text-white" : "text-muted-foreground"}`}
            >
              Laser / A4 Invoice
            </button>
          </div>
        </div>

        {/* Scrollable preview viewport */}
        <div className="flex-1 overflow-y-auto p-4 bg-black/40 rounded-xl border border-white/[0.05] flex justify-center items-start min-h-[300px]">
          {printFormat === "thermal" ? (
            <div className="print-area bg-white text-black p-4 w-[280px] font-mono text-[10px] leading-tight space-y-3 border border-gray-300 shadow-lg">
              {/* Header */}
              <div className="text-center space-y-0.5">
                <h2 className="text-[12px] font-bold tracking-wide uppercase">Mehran Medical Store</h2>
                <p className="text-[8px] text-gray-700">Bismillah Market, Stop No. 1, Nooriabad</p>
                <p className="text-[8px] text-gray-700">Ph: 0347-0904371</p>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-400 my-1" />

              {/* Invoice info */}
              <div className="text-[8px] text-gray-800 space-y-0.5">
                <p>Invoice: {invoice.id}</p>
                <p>{invoice.date || "28/06/2026"}, {invoice.time || "14:46:11"}</p>
              </div>

              {/* Barcode Mock */}
              <div className="flex flex-col items-center py-1">
                <div className="flex gap-[1px] items-stretch h-6">
                  <div className="w-[1.5px] bg-black" /><div className="w-[3px] bg-black" /><div className="w-[1px]" /><div className="w-[1.5px] bg-black" /><div className="w-[1.5px] bg-black" /><div className="w-[2px]" /><div className="w-[3px] bg-black" /><div className="w-[1.5px] bg-black" /><div className="w-[2px]" /><div className="w-[1.5px] bg-black" /><div className="w-[3px] bg-black" /><div className="w-[1.5px] bg-black" /><div className="w-[1px]" /><div className="w-[3px] bg-black" />
                </div>
                <span className="text-[7px] tracking-widest mt-0.5 text-gray-700">{invoice.id}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-400 my-1" />

              {/* Customer/Server info */}
              <div className="text-gray-800 space-y-0.5 text-[9px]">
                <p><span className="font-semibold">Customer:</span> {invoice.customer || "Walk-in Customer"}</p>
                <p><span className="font-semibold">Payment:</span> {invoice.payment || "Cash"}</p>
                <p><span className="font-semibold">Served by:</span> {invoice.cashier || "Admin"}</p>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-400 my-1" />

              {/* Table */}
              <div>
                <div className="flex justify-between font-semibold border-b border-dashed border-gray-400 pb-0.5 mb-1 text-[9px]">
                  <span className="w-1/2 text-left">Item</span>
                  <span className="w-1/6 text-right">Qty-Unit</span>
                  <span className="w-1/6 text-right">Rate</span>
                  <span className="w-1/6 text-right">Amt</span>
                </div>
                <div className="space-y-1.5">
                  {(invoice.details || []).map((item: any, idx: number) => (
                    <div key={idx} className="text-gray-900 text-[9px]">
                      <p className="font-bold uppercase">{idx + 1}. {item.name}</p>
                      <div className="flex justify-end">
                        <span className="w-1/4 text-right pr-2">{item.qty}</span>
                        <span className="w-1/4 text-right pr-2">{(item.mrp || 0).toFixed(2)}</span>
                        <span className="w-1/4 text-right">{((item.mrp || 0) * item.qty).toFixed(2)}</span>
                      </div>
                      <div className="pl-3 text-[8px] text-gray-600 italic">
                        ({item.unit})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-400 my-1" />

              {/* Totals */}
              <div className="space-y-0.5 text-gray-900 text-[9px] font-semibold">
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span>Rs {invoice.amount.toFixed(2)}</span>
                </div>
                <div className="border-t border-dashed border-gray-400 my-0.5" />
                <div className="flex justify-between font-bold">
                  <span>Net Amount</span>
                  <span>Rs {invoice.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid</span>
                  <span>Rs {(invoice.amount + (invoice.change || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Return</span>
                  <span>Rs {(invoice.change || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-400 my-1" />

              {/* Footer */}
              <div className="text-center space-y-0.5 text-[8px]">
                <p className="font-bold">Thank You for Visiting Mehran Medical Store</p>
                <p>0347-0904371</p>
                <p className="font-bold">*** Thank You ***</p>
              </div>
            </div>
          ) : (
            <div className="print-area bg-white text-black p-8 w-[500px] font-sans space-y-6 border border-gray-300 shadow-lg min-h-[600px] text-[11px]">
              {/* Logo / Header */}
              <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 uppercase">Mehran Medical Store</h1>
                  <p className="text-gray-600">Bismillah Market, Stop No. 1, Nooriabad</p>
                  <p className="text-gray-600">Phone: 0347-0904371 | Email: billing@mehranmed.com</p>
                </div>
                <div className="text-right">
                  <h2 className="text-base font-bold text-gray-800 uppercase">TAX INVOICE</h2>
                  <p className="text-gray-600">Invoice No: <span className="font-bold text-black">{invoice.id}</span></p>
                  <p className="text-gray-600">Date: {invoice.date || "02/07/2026"}</p>
                </div>
              </div>

              {/* Billing details */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
                <div>
                  <p className="text-gray-500 font-semibold uppercase text-[9px] mb-1">Billed To:</p>
                  <p className="font-bold text-gray-900">{invoice.customer || "Walk-in Customer"}</p>
                  <p className="text-gray-600">Payment Mode: {invoice.payment || "Cash"}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 font-semibold uppercase text-[9px] mb-1">Served By:</p>
                  <p className="font-bold text-gray-900">{invoice.cashier || "Admin"}</p>
                  <p className="text-gray-600">Time: {invoice.time || "16:00:00"}</p>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 text-gray-700 font-bold uppercase text-[9px]">
                    <th className="py-2">#</th>
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Package Unit</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(invoice.details || []).map((item: any, idx: number) => (
                    <tr key={idx} className="text-gray-800">
                      <td className="py-2">{idx + 1}</td>
                      <td className="py-2 font-semibold">{item.name}</td>
                      <td className="py-2 text-right">{item.qty}</td>
                      <td className="py-2 text-right text-gray-600">{item.unit}</td>
                      <td className="py-2 text-right">Rs.{item.mrp.toFixed(2)}</td>
                      <td className="py-2 text-right font-mono">Rs.{(item.qty * item.mrp).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Subtotals */}
              <div className="flex justify-end pt-4">
                <div className="w-48 space-y-1.5 font-semibold text-gray-700 text-right">
                  <div className="flex justify-between text-xs">
                    <span>Subtotal:</span>
                    <span>Rs.{invoice.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Sales Tax (0%):</span>
                    <span>Rs.0.00</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-2 text-gray-900 font-bold">
                    <span>Total:</span>
                    <span>Rs.{invoice.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer signature / disclaimer */}
              <div className="pt-8 flex justify-between items-end border-t border-gray-200">
                <div className="text-[9px] text-gray-500">
                  <p>* This is a computer-generated invoice and requires no physical signature.</p>
                  <p>* Thank you for your purchase!</p>
                </div>
                <div className="text-center w-36">
                  <div className="border-b border-gray-300 h-10 w-full" />
                  <p className="text-[9px] text-gray-500 mt-1">Authorized Signatory</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons footer */}
        <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/10 rounded-lg text-white hover:bg-white/[0.04]"
          >
            Close Preview
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold"
          >
            Dispatch to Printer ({printerConfig.copies} copies)
          </button>
        </div>
      </div>
    </div>
  );
}

// Custom lock icon fallback helper
const LockIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// ─── Sidebar nav config ────────────────────────────────────────────────────────

const navSections = [
  {
    label: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operations",
    items: [
      { id: "pos", label: "POS Billing", icon: ShoppingCart },
      { id: "medicines", label: "Medicines", icon: Pill },
      { id: "inventory", label: "Inventory", icon: Package },
      { id: "purchases", label: "Purchases", icon: Truck },
      { id: "purchase-returns", label: "Purchase Returns", icon: RefreshCw },
      { id: "sales-returns", label: "Sales Returns", icon: RefreshCw },
    ],
  },
  {
    label: "Relationships",
    items: [
      { id: "suppliers", label: "Suppliers", icon: Building2 },
      { id: "customers", label: "Customers", icon: Users },
      { id: "customer-ledger", label: "Customer Ledger", icon: FileText },
      { id: "supplier-ledger", label: "Supplier Ledger", icon: FileText },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "accounts-finance", label: "Accounts & Finance", icon: Wallet },
      { id: "cash-register", label: "Cash Register", icon: Barcode },
      { id: "reports", label: "Reports", icon: BarChart2 },
    ],
  },
  {
    label: "System",
    items: [
      { id: "users", label: "User Mgmt", icon: Shield },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

const alerts = [
  { label: "Inventory alert: low stock limit detected", type: "warning" },
  { label: "Invoice payment due alerts active", type: "info" },
];

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const activeLabel = navSections.flatMap(s => s.items).find(i => i.id === activeModule)?.label || "Dashboard";

  // Daily session states
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [activeFloat, setActiveFloat] = useState(5000);
  const [registerSessionsHistory, setRegisterSessionsHistory] = useState<any[]>([
    { id: "SESS-01", openTime: "08:00 AM", closeTime: "06:00 PM", float: 5000, sales: 1840, expected: 6840, counted: 6840, difference: 0, status: "Reconciled", date: "2026-07-01", auditor: "Dr. Arun Mehta" }
  ]);

  // Printer settings states
  const [printerConfig, setPrinterConfig] = useState({
    printerName: "XP-80 thermal",
    printerType: "Thermal",
    connectionType: "USB",
    paperSize: "80mm",
    copies: 1,
    autoPrint: true,
    printPreview: true,
  });

  const [activePrintInvoice, setActivePrintInvoice] = useState<any | null>(null);

  // Dynamic state database
  const [medicines, setMedicines] = useState([
    { id: "MED-001", name: "Amoxicillin 500mg", generic: "Amoxicillin", brand: "Cipla", category: "Antibiotic", batch: "BT-2025-441", expiry: "2026-12", mrp: 2.25, stock: 1240, unit: "Tablet", status: "active", packaging: [
      { type: "Box", parentUnit: "", childUnit: "Strip", qty: 10, ratio: 100, mrp: 170.00, barcode: "8901001" },
      { type: "Strip", parentUnit: "Box", childUnit: "Tablet", qty: 10, ratio: 10, mrp: 20.00, barcode: "8901002" },
      { type: "Tablet", parentUnit: "Strip", childUnit: "", qty: 1, ratio: 1, mrp: 2.25, barcode: "8901003" }
    ]},
    { id: "MED-002", name: "Metformin 500mg", generic: "Metformin HCl", brand: "Sun Pharma", category: "Diabetic", batch: "BT-2025-312", expiry: "2026-10", mrp: 1.80, stock: 860, unit: "Tablet", status: "active", packaging: [
      { type: "Box", parentUnit: "", childUnit: "Strip", qty: 10, ratio: 100, mrp: 140.00, barcode: "8902001" },
      { type: "Strip", parentUnit: "Box", childUnit: "Tablet", qty: 10, ratio: 10, mrp: 15.00, barcode: "8902002" },
      { type: "Tablet", parentUnit: "Strip", childUnit: "", qty: 1, ratio: 1, mrp: 1.80, barcode: "8902003" }
    ]},
    { id: "MED-003", name: "Atorvastatin 20mg", generic: "Atorvastatin", brand: "Torrent", category: "Cardiac", batch: "BT-2025-198", expiry: "2026-03", mrp: 2.80, stock: 520, unit: "Tablet", status: "active", packaging: [
      { type: "Box", parentUnit: "", childUnit: "Strip", qty: 10, ratio: 100, mrp: 220.00, barcode: "8903001" },
      { type: "Strip", parentUnit: "Box", childUnit: "Tablet", qty: 10, ratio: 10, mrp: 25.00, barcode: "8903002" },
      { type: "Tablet", parentUnit: "Strip", childUnit: "", qty: 1, ratio: 1, mrp: 2.80, barcode: "8903003" }
    ]},
    { id: "MED-004", name: "Paracetamol 650mg", generic: "Paracetamol", brand: "GSK", category: "Analgesic", batch: "BT-2025-570", expiry: "2026-11", mrp: 1.00, stock: 3200, unit: "Tablet", status: "active", packaging: [
      { type: "Strip", parentUnit: "", childUnit: "Tablet", qty: 10, ratio: 10, mrp: 8.50, barcode: "8904001" },
      { type: "Tablet", parentUnit: "Strip", childUnit: "", qty: 1, ratio: 1, mrp: 1.00, barcode: "8904002" }
    ]},
    { id: "MED-005", name: "Cetirizine 10mg", generic: "Cetirizine HCl", brand: "Mankind", category: "Antiallergic", batch: "BT-2025-221", expiry: "2025-08", mrp: 1.00, stock: 180, unit: "Tablet", status: "low", packaging: [
      { type: "Strip", parentUnit: "", childUnit: "Tablet", qty: 10, ratio: 10, mrp: 8.50, barcode: "8905001" },
      { type: "Tablet", parentUnit: "Strip", childUnit: "", qty: 1, ratio: 1, mrp: 1.00, barcode: "8905002" }
    ]},
    { id: "MED-006", name: "Omeprazole 20mg", generic: "Omeprazole", brand: "AstraZeneca", category: "GI", batch: "BT-2025-449", expiry: "2027-01", mrp: 3.50, stock: 220, unit: "Capsule", status: "low", packaging: [
      { type: "Bottle", parentUnit: "", childUnit: "Capsule", qty: 100, ratio: 100, mrp: 320.00, barcode: "8906001" },
      { type: "Capsule", parentUnit: "Bottle", childUnit: "", qty: 1, ratio: 1, mrp: 3.50, barcode: "8906002" }
    ]},
    { id: "MED-007", name: "Azithromycin 500mg", generic: "Azithromycin", brand: "Pfizer", category: "Antibiotic", batch: "BT-2025-388", expiry: "2027-06", mrp: 8.00, stock: 640, unit: "Tablet", status: "active", packaging: [
      { type: "Strip", parentUnit: "", childUnit: "Tablet", qty: 6, ratio: 6, mrp: 45.00, barcode: "8907001" },
      { type: "Tablet", parentUnit: "Strip", childUnit: "", qty: 1, ratio: 1, mrp: 8.00, barcode: "8907002" }
    ]},
    { id: "MED-008", name: "Insulin Glargine", generic: "Insulin Glargine", brand: "Sanofi", category: "Diabetic", batch: "BT-2025-167", expiry: "2026-02", mrp: 1200.00, stock: 42, unit: "Vial", status: "critical", packaging: [
      { type: "Carton", parentUnit: "", childUnit: "Vial", qty: 10, ratio: 10, mrp: 11000.00, barcode: "8908001" },
      { type: "Vial", parentUnit: "Carton", childUnit: "", qty: 1, ratio: 1, mrp: 1200.00, barcode: "8908002" }
    ]}
  ]);

  const [categories, setCategories] = useState(["Antibiotic", "Diabetic", "Cardiac", "Analgesic", "Antiallergic", "GI", "Vitamin", "Injection", "Syrup", "Drops", "Tablet", "Capsule"]);

  const [customers, setCustomers] = useState([
    { id: "CUS-001", name: "Rajesh Kumar", phone: "+91 98765 43210", type: "Regular", visits: 24, spent: 48200, points: 482, outstanding: 0, creditLimit: 50000, ledger: [] },
    { id: "CUS-002", name: "Mohammed Ali", phone: "+91 87654 32109", type: "Credit", visits: 18, spent: 92400, points: 924, outstanding: 3120, creditLimit: 75000, ledger: [
      { date: "2026-06-15", invoiceId: "INV-2025-8839", type: "Debit", description: "Credit Purchase", amount: 3120, runningBalance: 3120 }
    ] },
    { id: "CUS-003", name: "Sunita Patel", phone: "+91 76543 21098", type: "Regular", visits: 9, spent: 12800, points: 128, outstanding: 0, creditLimit: 30000, ledger: [] },
    { id: "CUS-004", name: "Priya Sharma", phone: "+91 65432 10987", type: "Loyalty", visits: 41, spent: 124600, points: 2492, outstanding: 0, creditLimit: 100000, ledger: [] }
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: "SUP-001", name: "Medline Distributors", contact: "Arvind Shah", phone: "+91 98200 44521", city: "Mumbai", outstanding: 0, orders: 48, rating: 4.8, ledger: [] },
    { id: "SUP-002", name: "HealthCare Pharma", contact: "Ramesh Gupta", phone: "+91 99100 87654", city: "Delhi", outstanding: 89400, orders: 32, rating: 4.2, ledger: [
      { date: "2026-06-14", poNumber: "PO-2025-440", type: "Bill", description: "Pending Bill", amount: 89400, runningBalance: 89400 }
    ] },
    { id: "SUP-003", name: "Apex Medicals", contact: "Suresh Jain", phone: "+91 97300 12345", city: "Pune", outstanding: 0, orders: 61, rating: 4.9, ledger: [] },
    { id: "SUP-004", name: "Prime Pharma", contact: "Deepak Verma", phone: "+91 96200 88901", city: "Bangalore", outstanding: 54200, orders: 19, rating: 3.8, ledger: [
      { date: "2026-06-10", poNumber: "PO-2025-438", type: "Bill", description: "Pending Bill", amount: 54200, runningBalance: 54200 }
    ] },
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState([
    { id: "PO-2025-441", supplier: "Medline Distributors", date: "Jun 15, 2025", items: 24, amount: 124800, status: "delivered", payment: "paid" },
    { id: "PO-2025-440", supplier: "HealthCare Pharma", date: "Jun 14, 2025", items: 18, amount: 89400, status: "transit", payment: "pending" },
    { id: "PO-2025-439", supplier: "Apex Medicals", date: "Jun 12, 2025", items: 31, amount: 208600, status: "delivered", payment: "paid" },
    { id: "PO-2025-438", supplier: "Prime Pharma", date: "Jun 10, 2025", items: 12, amount: 54200, status: "pending", payment: "pending" },
    { id: "PO-2025-437", supplier: "National Pharma", date: "Jun 08, 2025", items: 8, amount: 38000, status: "delivered", payment: "paid" },
  ]);

  const [transactions, setTransactions] = useState([
    { id: "INV-2025-8841", customer: "Rajesh Kumar", time: "09:42 AM", items: 5, amount: 1840, payment: "Cash", status: "completed", date: "2026-07-02" },
    { id: "INV-2025-8840", customer: "Priya Sharma", time: "09:18 AM", items: 3, amount: 2490, payment: "Card", status: "completed", date: "2026-07-02" },
    { id: "INV-2025-8839", customer: "Walk-in Customer", time: "08:55 AM", items: 7, amount: 3120, payment: "Insurance", status: "pending", date: "2026-07-02" },
    { id: "INV-2025-8838", customer: "Sunita Patel", time: "08:30 AM", items: 2, amount: 680, payment: "Card", status: "completed", date: "2026-07-02" },
    { id: "INV-2025-8837", customer: "Mohammed Ali", time: "08:12 AM", items: 9, amount: 5640, payment: "Split", status: "completed", date: "2026-07-02" }
  ]);

  const [usersList, setUsersList] = useState([
    { name: "Dr. Arun Mehta", email: "arun.mehta@medcare.com", role: "Admin", access: "All Modules", color: "purple", status: "Active" },
    { name: "Nisha Kapoor", email: "nisha.k@medcare.com", role: "Pharmacist", access: "Billing, Inventory, Catalog", color: "blue", status: "Active" },
    { name: "Ravi Tiwari", email: "ravi.t@medcare.com", role: "Cashier", access: "POS Terminal, Daily Closing", color: "emerald", status: "Active" },
    { name: "Kavita Singh", email: "kavita.s@medcare.com", role: "Inv. Manager", access: "Inventory, Purchases, Reports", color: "amber", status: "Active" },
  ]);

  const renderModuleWithState = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard medicines={medicines} transactions={transactions} suppliers={suppliers} />;
      case "medicines":
        return <MedicineManagement medicines={medicines} setMedicines={setMedicines} categories={categories} setCategories={setCategories} />;
      case "pos":
        return (
          <POSBilling
            medicines={medicines}
            setMedicines={setMedicines}
            customers={customers}
            setCustomers={setCustomers}
            transactions={transactions}
            setTransactions={setTransactions}
            isSessionOpen={isSessionOpen}
            setActiveModule={setActiveModule}
            printerConfig={printerConfig}
            activePrintInvoice={activePrintInvoice}
            setActivePrintInvoice={setActivePrintInvoice}
          />
        );
      case "inventory":
        return <Inventory medicines={medicines} />;
      case "purchases":
        return <Purchases purchaseOrders={purchaseOrders} />;
      case "purchase-returns":
        return <PlaceholderModule title="Purchase Returns Log" icon={RefreshCw} />;
      case "sales-returns":
        return <PlaceholderModule title="Sales Returns Log" icon={RefreshCw} />;
      case "suppliers":
        return <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} />;
      case "customers":
        return <Customers customers={customers} setCustomers={setCustomers} />;
      case "customer-ledger":
        return <CustomerLedgerModule customers={customers} setCustomers={setCustomers} />;
      case "supplier-ledger":
        return <SupplierLedgerModule suppliers={suppliers} setSuppliers={setSuppliers} />;
      case "accounts-finance":
        return <AccountsFinanceModule transactions={transactions} />;
      case "cash-register":
        return <CashRegisterModule transactions={transactions} isSessionOpen={isSessionOpen} setIsSessionOpen={setIsSessionOpen} activeFloat={activeFloat} setActiveFloat={setActiveFloat} registerSessionsHistory={registerSessionsHistory} setRegisterSessionsHistory={setRegisterSessionsHistory} />;
      case "users":
        return <UserMgmtModule usersList={usersList} setUsersList={setUsersList} />;
      case "reports":
        return <ReportsPage medicines={medicines} transactions={transactions} customers={customers} />;
      case "settings":
        return (
          <SettingsPage
            printerConfig={printerConfig}
            setPrinterConfig={setPrinterConfig}
            onTestPrint={() => setActivePrintInvoice({
              id: "INV-20260628-144540-929",
              customer: "Walk-in Customer",
              payment: "Cash",
              cashier: "Admin",
              amount: 50.00,
              change: 0.00,
              date: "28/06/2026",
              time: "14:46:11",
              details: [{ name: "PANADOL 500MCG TAB", qty: 10, unit: "Tablet", mrp: 5.00 }]
            })}
          />
        );
      default:
        return <Dashboard medicines={medicines} transactions={transactions} suppliers={suppliers} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside className={`flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex-shrink-0 ${sidebarCollapsed ? "w-14" : "w-56"}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border h-14">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <FlaskConical size={15} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground leading-none">MedCare</p>
              <p className="text-[10px] text-muted-foreground">Pharmacy ERP</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-none">
          {navSections.map((section) => (
            <div key={section.label}>
              {!sidebarCollapsed && <p className="px-4 text-[9px] font-semibold tracking-widest text-muted-foreground/50 uppercase mb-1">{section.label}</p>}
              {section.items.map((item) => {
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-3 mx-1 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-white/[0.04]"
                    }`}
                  >
                    <item.icon size={14} className={isActive ? "text-primary" : "text-muted-foreground"} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {!sidebarCollapsed && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User profile footer */}
        <div className="border-t border-sidebar-border p-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-[10px] text-blue-400">AM</div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">Dr. Arun Mehta</p>
              <p className="text-[10px] text-muted-foreground">Admin Mode</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-5 border-b border-white/[0.05] bg-sidebar/50 backdrop-blur flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-white/[0.05] cursor-pointer">
              <Menu size={16} />
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>MedCare ERP</span>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">{activeLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.05] cursor-pointer">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            {notifOpen && (
              <div className="absolute right-5 top-12 w-72 rounded-xl border border-white/10 bg-card shadow-2xl z-50 overflow-hidden text-xs">
                <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between font-bold text-white">
                  <span>Notifications</span>
                  <button onClick={() => setNotifOpen(false)} className="text-muted-foreground hover:text-white"><X size={13} /></button>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {alerts.map((a, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-white/[0.02]">
                      <p className="text-white">{a.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 scrollbar-none">
          {renderModuleWithState()}
        </main>
      </div>
      {activePrintInvoice && (
        <InvoicePrintModal
          invoice={activePrintInvoice}
          onClose={() => setActivePrintInvoice(null)}
          printerConfig={printerConfig}
        />
      )}
    </div>
  );
}
