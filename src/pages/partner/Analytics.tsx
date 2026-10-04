import { useState, useEffect } from "react";
import { TrendingUp, Users, PieChart, IndianRupee, ArrowUpRight, BarChart3, Download } from "lucide-react";
import { auth } from "../../lib/firebase";
import { getAuthHeaders } from "../../lib/auth-helpers";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("This Month");
  const [stats, setStats] = useState({ totalClients: 0, totalAum: 0, monthlySipBook: 0 });
  const [loading, setLoading] = useState(true);
  
  const ranges = ["Today", "This Week", "This Month", "This Quarter", "FY 2024", "All Time"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/partner/stats", { headers });
        if (res.ok) {
          setStats(await res.json());
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchStats();
    });
    return () => unsubscribe();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 relative z-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Business Analytics</h2>
          <p className="text-slate-400">Track your AUM growth, SIP book, and overall business performance.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 bg-white/[0.03] border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold transition-colors text-sm">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 rounded-[32px] mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-slate-500 mr-2">Period:</span>
          {ranges.map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${
                timeRange === range 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-500/20 p-3 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">AUM Growth</p>
          <h3 className="text-3xl font-bold text-white mt-1">{loading ? "..." : formatCurrency(stats.totalAum)}</h3>
          <p className="text-slate-500 text-xs mt-2">Target: ₹50.0 Cr</p>
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: stats.totalAum > 0 ? '5%' : '0%' }}></div>
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-indigo-500/20 p-3 rounded-2xl">
              <IndianRupee className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Monthly SIP Book</p>
          <h3 className="text-3xl font-bold text-white mt-1">{loading ? "..." : formatCurrency(stats.monthlySipBook)}</h3>
          <p className="text-slate-500 text-xs mt-2">Active SIPs linked to clients</p>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-500/20 p-3 rounded-2xl">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Active Clients</p>
          <h3 className="text-3xl font-bold text-white mt-1">{loading ? "..." : stats.totalClients}</h3>
          <p className="text-slate-500 text-xs mt-2">Total registered investors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        
        {/* Mock Chart Area - AUM Breakdown */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-slate-400" /> AUM Asset Allocation
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
            <div className="relative w-48 h-48 rounded-full border-8 border-white/5 flex items-center justify-center">
               <div className="text-center">
                 <p className="text-xl font-bold text-white">{formatCurrency(stats.totalAum)}</p>
                 <p className="text-xs text-slate-500 font-bold uppercase">Total</p>
               </div>
            </div>
            <div className="space-y-4 w-full md:w-auto">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-400 mr-2"></div><span className="text-sm font-bold text-slate-300">Equity</span></div>
                <span className="text-sm font-bold text-white">{stats.totalAum > 0 ? "100%" : "0%"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Chart Area - Monthly Business */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-slate-400" /> Gross Sales vs Redemptions
          </h3>
          <div className="h-48 w-full flex items-end justify-between gap-2 mt-8 pb-4 border-b border-white/10">
            <div className="text-slate-500 font-bold text-sm mx-auto self-center">Not enough data to display trends</div>
          </div>
        </div>

      </div>
    </div>
  );
}
