import { useState, useEffect } from "react";
import { PieChart, Briefcase, TrendingUp, Users, Search, ArrowUpRight, ShieldCheck, Layers } from "lucide-react";
import { getAuthHeaders } from "../../lib/auth-helpers";
import { mfapiService } from "../../services/mfapi.service";

export default function Portfolio() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/partner/clients", { headers });
        if (res.ok) {
          const data = await res.json();
          setClients(data);
        }
      } catch (err) {
        console.error("Failed to fetch partner portfolios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, []);

  // Consolidate holdings across all clients
  const fundAggregation: { [schemeCode: string]: { schemeName: string; totalInvested: number; totalUnits: number; clientCount: number } } = {};
  let totalFirmAum = 0;

  clients.forEach((c) => {
    if (c.portfolios && Array.isArray(c.portfolios)) {
      c.portfolios.forEach((p: any) => {
        const invested = parseFloat(p.investedAmount || "0");
        const units = parseFloat(p.units || "0");
        totalFirmAum += invested;

        if (!fundAggregation[p.schemeCode]) {
          fundAggregation[p.schemeCode] = {
            schemeName: p.schemeName,
            totalInvested: 0,
            totalUnits: 0,
            clientCount: 0
          };
        }
        fundAggregation[p.schemeCode].totalInvested += invested;
        fundAggregation[p.schemeCode].totalUnits += units;
        fundAggregation[p.schemeCode].clientCount += 1;
      });
    }
  });

  const holdingList = Object.entries(fundAggregation).map(([code, info]) => ({
    code,
    ...info,
    sharePct: totalFirmAum > 0 ? (info.totalInvested / totalFirmAum) * 100 : 0
  })).sort((a, b) => b.totalInvested - a.totalInvested);

  const filteredHoldings = holdingList.filter(
    (h) =>
      h.schemeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatInr = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 relative z-10 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Firm Portfolio Overview</h2>
          <p className="text-slate-400 text-sm mt-1">
            Aggregated scheme distribution and book allocation across all registered partner clients.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Total Book AUM</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{formatInr(totalFirmAum)}</p>
          <p className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Real-time consolidated assets
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Active Schemes</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{holdingList.length} Funds</p>
          <p className="text-xs text-slate-400 mt-1">Across diversified asset classes</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Total Portfolios</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{clients.length} Clients</p>
          <p className="text-xs text-slate-400 mt-1">Fully mapped to ARN #348996</p>
        </div>
      </div>

      {/* Scheme Search */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search scheme name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Scheme Holdings Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading consolidated holdings...</div>
        ) : filteredHoldings.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No scheme holdings found in portfolio.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[650px]">
              <thead className="bg-slate-950/60 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Mutual Fund Scheme</th>
                  <th className="px-6 py-4">Scheme Code</th>
                  <th className="px-6 py-4 text-center">Clients Invested</th>
                  <th className="px-6 py-4 text-right">Total Invested</th>
                  <th className="px-6 py-4 text-right">Portfolio Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHoldings.map((fund) => (
                  <tr key={fund.code} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white max-w-sm truncate">
                      {fund.schemeName}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{fund.code}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Users className="w-3 h-3" />
                        {fund.clientCount} {fund.clientCount === 1 ? "Client" : "Clients"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-400">
                      {formatInr(fund.totalInvested)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${Math.min(fund.sharePct, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-300 w-10 text-right">
                          {fund.sharePct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
