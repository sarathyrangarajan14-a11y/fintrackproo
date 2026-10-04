import { useState, useEffect } from "react";
import { ArrowDownLeft, ArrowUpRight, Search, Filter, Download, CheckCircle2, Clock, Calendar } from "lucide-react";
import { getAuthHeaders } from "../../lib/auth-helpers";

export default function Transactions() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    const fetchTransactionsData = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/partner/clients", { headers });
        if (res.ok) {
          const data = await res.json();
          setClients(data);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactionsData();
  }, []);

  // Consolidate all client SIPs & transactions
  const transactionsList: any[] = [];
  clients.forEach((c) => {
    if (c.sips && Array.isArray(c.sips)) {
      c.sips.forEach((s: any) => {
        transactionsList.push({
          id: `TXN-SIP-${s.id}`,
          clientName: c.name,
          email: c.email,
          pan: c.pan,
          schemeName: s.schemeName || `Scheme #${s.schemeCode}`,
          type: "SIP Execution",
          amount: parseFloat(s.amount || "0"),
          date: `Day ${s.sipDate || 5} of every month`,
          status: s.status || "ACTIVE",
          frequency: s.frequency || "MONTHLY"
        });
      });
    }
    if (c.portfolios && Array.isArray(c.portfolios)) {
      c.portfolios.forEach((p: any, idx: number) => {
        transactionsList.push({
          id: `TXN-INV-${p.id || idx + 100}`,
          clientName: c.name,
          email: c.email,
          pan: c.pan,
          schemeName: p.schemeName,
          type: "Purchase / Allocation",
          amount: parseFloat(p.investedAmount || "0"),
          date: new Date(c.joinedDate || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
          status: "SETTLED",
          frequency: "LUMPSUM"
        });
      });
    }
  });

  const filtered = transactionsList.filter((tx) => {
    const matchesSearch =
      tx.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.schemeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === "ALL") return matchesSearch;
    if (filterType === "SIP") return matchesSearch && tx.type.includes("SIP");
    if (filterType === "LUMPSUM") return matchesSearch && tx.frequency === "LUMPSUM";
    return matchesSearch;
  });

  const formatInr = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 relative z-10 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Client Transactions</h2>
          <p className="text-slate-400 text-sm mt-1">
            Consolidated record of all client mutual fund investments, systematic plans, and settlements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-800/80 border border-slate-700 text-slate-300 text-xs px-3.5 py-2 rounded-xl">
            Total Records: <span className="font-bold text-white">{transactionsList.length}</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client, fund or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-500"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {["ALL", "SIP", "LUMPSUM"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === type
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {type === "ALL" ? "All Types" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading transaction data...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No transactions match your search filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[750px]">
              <thead className="bg-slate-950/60 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Scheme</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4">Schedule / Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{tx.id}</td>
                    <td className="px-6 py-4 font-medium text-white">
                      <div>{tx.clientName}</div>
                      <div className="text-xs text-slate-400">{tx.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-200 max-w-xs truncate">{tx.schemeName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-400">
                      {formatInr(tx.amount)}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-xs flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {tx.status}
                      </span>
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
