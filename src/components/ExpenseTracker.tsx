import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Tag, 
  IndianRupee, 
  Filter, 
  Download, 
  TrendingDown, 
  PieChart, 
  Utensils, 
  ShoppingCart, 
  Car, 
  Zap, 
  ShoppingBag, 
  Tv, 
  HeartPulse, 
  TrendingUp, 
  GraduationCap, 
  Plane, 
  MoreHorizontal, 
  Search, 
  Check, 
  X, 
  Receipt,
  CreditCard,
  Wallet,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";
import { auth } from "../lib/firebase";

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  description?: string;
  paymentMethod?: string;
  createdAt: string;
}

export const EXPENSE_CATEGORIES = [
  { id: "Food & Dining", label: "Food & Dining", icon: Utensils, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: "Groceries", label: "Groceries & Essentials", icon: ShoppingCart, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "Transportation", label: "Fuel & Transport", icon: Car, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "Utilities", label: "Bills & Utilities", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  { id: "Shopping", label: "Shopping & Retail", icon: ShoppingBag, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { id: "Entertainment", label: "Entertainment & Subs", icon: Tv, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "Healthcare", label: "Health & Medical", icon: HeartPulse, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  { id: "Investments", label: "SIP & Investments", icon: TrendingUp, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  { id: "Education", label: "Education & Skills", icon: GraduationCap, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { id: "Travel", label: "Travel & Vacations", icon: Plane, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  { id: "Other", label: "Miscellaneous", icon: MoreHorizontal, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
];

export const PAYMENT_METHODS = [
  "UPI (GPay/PhonePe)",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Cash"
];

const SAMPLE_EXPENSES: Expense[] = [
  {
    id: "sample-1",
    amount: 850,
    category: "Food & Dining",
    date: new Date().toISOString().split("T")[0],
    description: "Team lunch & beverages",
    paymentMethod: "UPI (GPay/PhonePe)",
    createdAt: new Date().toISOString()
  },
  {
    id: "sample-2",
    amount: 2400,
    category: "Groceries",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    description: "Weekly organic vegetables & pantry staples",
    paymentMethod: "Credit Card",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "sample-3",
    amount: 1200,
    category: "Transportation",
    date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    description: "Vehicle fuel & highway toll",
    paymentMethod: "UPI (GPay/PhonePe)",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "sample-4",
    amount: 1499,
    category: "Utilities",
    date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
    description: "High-speed broadband fiber subscription",
    paymentMethod: "Net Banking",
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: "sample-5",
    amount: 5000,
    category: "Investments",
    date: new Date(Date.now() - 345600000).toISOString().split("T")[0],
    description: "Direct Mutual Fund Auto-SIP Mandate",
    paymentMethod: "Net Banking",
    createdAt: new Date(Date.now() - 345600000).toISOString()
  }
];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [timeframeFilter, setTimeframeFilter] = useState<"ALL" | "TODAY" | "THIS_WEEK" | "THIS_MONTH">("THIS_MONTH");
  const [sortBy, setSortBy] = useState<"DATE_DESC" | "DATE_ASC" | "AMOUNT_DESC" | "AMOUNT_ASC">("DATE_DESC");

  // Form State
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("Food & Dining");
  const [date, setDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI (GPay/PhonePe)");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const user = auth.currentUser;
  const storageKey = `fintrack_expenses_${user?.uid || "guest"}`;

  // Load expenses on mount
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        // Try local storage first for instant render
        const localData = localStorage.getItem(storageKey);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setExpenses(parsed);
            setLoading(false);
            return;
          }
        }

        // Try API if user is authenticated
        if (user) {
          const token = await user.getIdToken();
          const res = await fetch("/api/client/expenses", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              setExpenses(data);
              localStorage.setItem(storageKey, JSON.stringify(data));
              setLoading(false);
              return;
            }
          }
        }

        // Default to initial sample data if empty
        setExpenses(SAMPLE_EXPENSES);
        localStorage.setItem(storageKey, JSON.stringify(SAMPLE_EXPENSES));
      } catch (e) {
        console.warn("Could not load expenses, using fallback:", e);
        setExpenses(SAMPLE_EXPENSES);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [user, storageKey]);

  // Save changes to localStorage & backend
  const persistExpenses = async (updatedList: Expense[]) => {
    setExpenses(updatedList);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
      if (user) {
        const token = await user.getIdToken();
        await fetch("/api/client/expenses/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ expenses: updatedList })
        }).catch(() => {});
      }
    } catch (err) {
      console.error("Error saving expenses:", err);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const resetForm = () => {
    setAmount("");
    setCategory("Food & Dining");
    setDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setPaymentMethod("UPI (GPay/PhonePe)");
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleQuickAddAmount = (addVal: number) => {
    const cur = parseFloat(amount) || 0;
    setAmount(String(cur + addVal));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showNotification("Please enter a valid expense amount greater than 0");
      return;
    }

    if (!category.trim()) {
      showNotification("Please select an expense category");
      return;
    }

    if (!date) {
      showNotification("Please select a date for the expense");
      return;
    }

    if (editingId) {
      // Update existing expense
      const updated = expenses.map((item) =>
        item.id === editingId
          ? {
              ...item,
              amount: parsedAmount,
              category: category.trim(),
              date,
              description: description.trim() || undefined,
              paymentMethod
            }
          : item
      );
      await persistExpenses(updated);
      showNotification(`Expense updated to ₹${parsedAmount.toLocaleString("en-IN")}`);
    } else {
      // Create new expense
      const newExpense: Expense = {
        id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        amount: parsedAmount,
        category: category.trim(),
        date,
        description: description.trim() || undefined,
        paymentMethod,
        createdAt: new Date().toISOString()
      };
      const updated = [newExpense, ...expenses];
      await persistExpenses(updated);
      showNotification(`Added ₹${parsedAmount.toLocaleString("en-IN")} in ${category}`);
    }

    resetForm();
  };

  const handleEdit = (exp: Expense) => {
    setEditingId(exp.id);
    setAmount(String(exp.amount));
    setCategory(exp.category);
    setDate(exp.date);
    setDescription(exp.description || "");
    setPaymentMethod(exp.paymentMethod || "UPI (GPay/PhonePe)");
    setIsFormOpen(true);
    // Scroll smoothly to form
    document.getElementById("expense-form-container")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    const target = expenses.find((e) => e.id === id);
    if (!target) return;
    const confirmDelete = window.confirm(
      `Delete expense of ₹${target.amount.toLocaleString("en-IN")} (${target.category})?`
    );
    if (!confirmDelete) return;

    const filtered = expenses.filter((e) => e.id !== id);
    await persistExpenses(filtered);
    showNotification("Expense deleted successfully");
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      showNotification("No expenses to export.");
      return;
    }

    const headers = ["Date", "Category", "Amount (INR)", "Payment Method", "Notes", "Created At"];
    const rows = expenses.map((e) => [
      `"${e.date}"`,
      `"${e.category}"`,
      e.amount,
      `"${e.paymentMethod || "N/A"}"`,
      `"${(e.description || "").replace(/"/g, '""')}"`,
      `"${e.createdAt}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wealthflow_expenses_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Expense records exported to CSV!");
  };

  // Date Calculation Helpers
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  
  const currentMonthStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const weekAgoStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  }, []);

  // Filtered & Sorted Expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCat = item.category.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchAmt = String(item.amount).includes(q);
          if (!matchCat && !matchDesc && !matchAmt) return false;
        }

        // Category filter
        if (filterCategory !== "ALL" && item.category !== filterCategory) {
          return false;
        }

        // Timeframe filter
        if (timeframeFilter === "TODAY") {
          return item.date === todayStr;
        }
        if (timeframeFilter === "THIS_WEEK") {
          return item.date >= weekAgoStr && item.date <= todayStr;
        }
        if (timeframeFilter === "THIS_MONTH") {
          return item.date.startsWith(currentMonthStr);
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "DATE_DESC") return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === "DATE_ASC") return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === "AMOUNT_DESC") return b.amount - a.amount;
        if (sortBy === "AMOUNT_ASC") return a.amount - b.amount;
        return 0;
      });
  }, [expenses, searchQuery, filterCategory, timeframeFilter, sortBy, todayStr, weekAgoStr, currentMonthStr]);

  // Spending Analytics & Metrics
  const metrics = useMemo(() => {
    const thisMonthExpenses = expenses.filter((e) => e.date.startsWith(currentMonthStr));
    const totalMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const todayExpenses = expenses.filter((e) => e.date === todayStr);
    const totalToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

    const weekExpenses = expenses.filter((e) => e.date >= weekAgoStr && e.date <= todayStr);
    const totalWeek = weekExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Category breakdown for current month (or all time if month has 0)
    const activeSet = thisMonthExpenses.length > 0 ? thisMonthExpenses : expenses;
    const catMap: Record<string, number> = {};
    activeSet.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });

    const totalActive = activeSet.reduce((sum, e) => sum + e.amount, 0);
    const categoryBreakdown = Object.entries(catMap)
      .map(([cat, amt]) => ({
        category: cat,
        amount: amt,
        percentage: totalActive > 0 ? (amt / totalActive) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

    return {
      totalMonth,
      totalToday,
      totalWeek,
      totalActive,
      categoryBreakdown,
      topCategory,
      countThisMonth: thisMonthExpenses.length
    };
  }, [expenses, currentMonthStr, todayStr, weekAgoStr]);

  const getCategoryDetails = (catName: string) => {
    const found = EXPENSE_CATEGORIES.find((c) => c.id === catName || c.label === catName);
    return found || {
      id: catName,
      label: catName,
      icon: Receipt,
      color: "text-slate-300",
      bg: "bg-slate-500/10",
      border: "border-slate-500/20"
    };
  };

  return (
    <section className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[32px] p-6 md:p-8 space-y-6 relative overflow-hidden">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-black px-4 py-2.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Receipt className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Daily Expense Tracker</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Smart Outlay
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Monitor daily living costs, categorize transactions, and identify surplus funds to direct into mutual fund SIPs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            title="Download records as CSV"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => {
              if (isFormOpen && editingId) {
                resetForm();
              } else {
                setIsFormOpen(!isFormOpen);
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer ${
              isFormOpen
                ? "bg-white/10 text-white hover:bg-white/15 border border-white/20"
                : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20"
            }`}
          >
            {isFormOpen ? (
              <>
                <X className="w-3.5 h-3.5" /> Cancel
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> + Add Expense
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        
        {/* Month Total */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Spent This Month
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
              {metrics.countThisMonth} txns
            </span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-white mt-1">
            ₹{metrics.totalMonth.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Calendar month outlay
          </p>
        </div>

        {/* Today's Spend */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> Today's Expenses
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
              Today
            </span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-emerald-400 mt-1">
            ₹{metrics.totalToday.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {metrics.totalToday === 0 ? "No expenses logged today" : "Logged for today"}
          </p>
        </div>

        {/* Last 7 Days */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" /> Past 7 Days
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
              7D Burn
            </span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-white mt-1">
            ₹{metrics.totalWeek.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Avg ~₹{Math.round(metrics.totalWeek / 7).toLocaleString("en-IN")} / day
          </p>
        </div>

        {/* Top Outlay Category */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <PieChart className="w-3.5 h-3.5 text-rose-400" /> Top Category
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300">
              Primary
            </span>
          </div>
          <div className="text-sm md:text-base font-bold text-white truncate mt-1">
            {metrics.topCategory ? metrics.topCategory.category : "N/A"}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {metrics.topCategory
              ? `₹${metrics.topCategory.amount.toLocaleString("en-IN")} (${metrics.topCategory.percentage.toFixed(0)}%)`
              : "No spending logged yet"}
          </p>
        </div>

      </div>

      {/* Add / Edit Expense Form Modal/Accordion */}
      {isFormOpen && (
        <div 
          id="expense-form-container"
          className="bg-white/[0.04] border border-emerald-500/30 rounded-3xl p-5 md:p-6 shadow-2xl relative transition-all"
        >
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-sm font-bold text-white">
                {editingId ? "Edit Expense Details" : "Record Daily Expense"}
              </h3>
            </div>
            <button
              onClick={resetForm}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Amount, Date, Mode, Note, Actions */}
            <div className="md:col-span-6 space-y-3">
              {/* Amount & Quick Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Amount (₹) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold font-mono text-base">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl pl-8 pr-3 py-2 text-white font-mono text-base font-bold placeholder:text-slate-600 outline-none"
                  />
                </div>

                {/* Quick Amount Adder */}
                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                  <span className="text-[10px] text-slate-500 mr-1">Quick:</span>
                  {[100, 250, 500, 1000, 2000, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAddAmount(val)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors cursor-pointer"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Payment Method */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-slate-300">
                      Date <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex items-center gap-1 text-[9px]">
                      <button
                        type="button"
                        onClick={() => setDate(todayStr)}
                        className={`px-1 rounded cursor-pointer ${date === todayStr ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400 hover:text-white"}`}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const yest = new Date(Date.now() - 86400000).toISOString().split("T")[0];
                          setDate(yest);
                        }}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        Yest
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-2.5 py-1.5 text-white text-xs font-mono outline-none cursor-pointer [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-2.5 py-1.5 text-white text-xs outline-none cursor-pointer"
                  >
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm} value={pm} className="bg-slate-900 text-white">
                        {pm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description / Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Note / Description <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy order, Petrol refill"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={100}
                  className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-3 py-1.5 text-white text-xs placeholder:text-slate-600 outline-none"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-black transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingId ? "Save Changes" : "Record Expense"}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Category Grid Selection */}
            <div className="md:col-span-6 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Select Category <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EXPENSE_CATEGORIES.map((catItem) => {
                  const Icon = catItem.icon;
                  const isSelected = category === catItem.id;
                  return (
                    <button
                      key={catItem.id}
                      type="button"
                      onClick={() => setCategory(catItem.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                        isSelected
                          ? "bg-white/15 border-white text-white shadow-md ring-1 ring-white/30"
                          : `${catItem.bg} ${catItem.border} text-slate-300 hover:bg-white/10 hover:text-white`
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${catItem.color}`} />
                      <span className="truncate">{catItem.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </form>
        </div>
      )}

      {/* Category Breakdown Progress Bars */}
      {metrics.categoryBreakdown.length > 0 && (
        <div className="bg-white/[0.015] border border-white/5 rounded-2xl p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-emerald-400" />
              Category Outlay Distribution ({timeframeFilter === "THIS_MONTH" ? "This Month" : timeframeFilter === "TODAY" ? "Today" : "Selected Period"})
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Total: ₹{metrics.totalActive.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {metrics.categoryBreakdown.slice(0, 6).map((item) => {
              const details = getCategoryDetails(item.category);
              const Icon = details.icon;
              return (
                <div 
                  key={item.category}
                  onClick={() => setFilterCategory(filterCategory === item.category ? "ALL" : item.category)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    filterCategory === item.category
                      ? "bg-white/10 border-white/30"
                      : "bg-white/[0.02] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <Icon className={`w-3.5 h-3.5 ${details.color} shrink-0`} />
                      <span className="text-slate-200 font-medium truncate">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-right font-mono shrink-0">
                      <span className="font-bold text-white">₹{item.amount.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] text-slate-400">({item.percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                  
                  {/* Progress track */}
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${details.color.replace('text-', 'bg-')}`}
                      style={{ width: `${Math.min(100, Math.max(3, item.percentage))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        
        {/* Timeframe Chips */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl text-xs overflow-x-auto">
          {[
            { id: "THIS_MONTH", label: "This Month" },
            { id: "THIS_WEEK", label: "Last 7 Days" },
            { id: "TODAY", label: "Today" },
            { id: "ALL", label: "All Time" }
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframeFilter(tf.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                timeframeFilter === tf.id
                  ? "bg-emerald-500 text-black font-bold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                {c.label}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Expenses List */}
      <div className="space-y-2.5">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-white/[0.01] border border-dashed border-white/10">
            <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-300">No expenses found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || filterCategory !== "ALL" || timeframeFilter !== "ALL"
                ? "No transactions match your active filters. Try clearing search or resetting filter."
                : "No daily expenses recorded yet. Click '+ Add Expense' above to log your first transaction!"}
            </p>
            {(searchQuery || filterCategory !== "ALL" || timeframeFilter !== "THIS_MONTH") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("ALL");
                  setTimeframeFilter("ALL");
                }}
                className="mt-3 text-xs text-emerald-400 hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredExpenses.map((expense) => {
            const catDetails = getCategoryDetails(expense.category);
            const Icon = catDetails.icon;
            const isToday = expense.date === todayStr;

            return (
              <div
                key={expense.id}
                className="p-3.5 md:p-4 rounded-2xl bg-white/[0.025] hover:bg-white/[0.045] border border-white/5 transition-all flex items-center justify-between gap-3 group"
              >
                
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${catDetails.bg} ${catDetails.border} border flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${catDetails.color}`} />
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs md:text-sm font-bold text-white truncate">
                        {expense.category}
                      </p>
                      {isToday && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Today
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {new Date(expense.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>

                      {expense.paymentMethod && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400 flex items-center gap-1 font-mono text-[10px]">
                            <CreditCard className="w-2.5 h-2.5 text-slate-500" />
                            {expense.paymentMethod}
                          </span>
                        </>
                      )}

                      {expense.description && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-slate-300 italic truncate max-w-xs hidden sm:inline">
                            "{expense.description}"
                          </span>
                        </>
                      )}
                    </div>

                    {expense.description && (
                      <p className="text-[11px] text-slate-300 italic truncate sm:hidden mt-0.5">
                        "{expense.description}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-sm md:text-base font-bold font-mono text-white">
                      -₹{expense.amount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(expense)}
                      title="Edit expense"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      title="Delete expense"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Footer Info / SIP Bridge */}
      <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          Pro-Tip: Saving ₹150/day through expense optimization enables an extra ₹4,500/mo SIP!
        </span>
        <button
          onClick={() => {
            const hasData = expenses.length > 0;
            if (hasData) {
              if (window.confirm("Load sample demo expenses? This will reset custom entries.")) {
                persistExpenses(SAMPLE_EXPENSES);
                showNotification("Sample expenses reloaded");
              }
            } else {
              persistExpenses(SAMPLE_EXPENSES);
              showNotification("Sample expenses loaded");
            }
          }}
          className="text-[11px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
        >
          Reset to Sample Data
        </button>
      </div>

    </section>
  );
}
