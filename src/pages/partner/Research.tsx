import React, { useState, useEffect } from "react";
import { 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  BarChart3, 
  Award, 
  Sparkles, 
  Share2, 
  Download, 
  Layers, 
  CheckCircle2, 
  PieChart, 
  Activity,
  Maximize2
} from "lucide-react";
import AdvancedFundChart from "../../components/AdvancedFundChart";
import { mfapiService } from "../../services/mfapi.service";

interface PopularScheme {
  code: string;
  name: string;
  category: string;
  fundHouse: string;
  cagr3y: string;
}

const FEATURED_SCHEMES: PopularScheme[] = [
  {
    code: "120503",
    name: "Mirae Asset Large & Midcap Fund - Direct Plan - Growth",
    category: "Large & Mid Cap Fund",
    fundHouse: "Mirae Asset Mutual Fund",
    cagr3y: "22.4%"
  },
  {
    code: "118989",
    name: "Nippon India Small Cap Fund - Direct Plan - Growth",
    category: "Small Cap Fund",
    fundHouse: "Nippon India Mutual Fund",
    cagr3y: "28.1%"
  },
  {
    code: "122639",
    name: "Parag Parikh Flexi Cap Fund - Direct Plan - Growth",
    category: "Flexi Cap Fund",
    fundHouse: "PPFAS Mutual Fund",
    cagr3y: "19.8%"
  },
  {
    code: "119598",
    name: "HDFC Top 100 Fund - Direct Plan - Growth",
    category: "Large Cap Fund",
    fundHouse: "HDFC Mutual Fund",
    cagr3y: "17.9%"
  },
  {
    code: "120828",
    name: "Quant Active Fund - Direct Plan - Growth",
    category: "Multi Cap Fund",
    fundHouse: "Quant Mutual Fund",
    cagr3y: "24.6%"
  },
  {
    code: "120716",
    name: "UTI Nifty 50 Index Fund - Direct Plan - Growth",
    category: "Index Fund",
    fundHouse: "UTI Mutual Fund",
    cagr3y: "14.2%"
  }
];

export default function Research() {
  const [selectedScheme, setSelectedScheme] = useState<PopularScheme>(FEATURED_SCHEMES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"chart" | "peer_comparison" | "pitch_deck">("chart");
  const [copiedLink, setCopiedLink] = useState(false);

  // Search schemes from AMFI database
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await mfapiService.searchSchemes(searchQuery.trim());
        setSearchResults(res.slice(0, 8));
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = async (item: any) => {
    setSelectedScheme({
      code: String(item.schemeCode),
      name: item.schemeName,
      category: "AMFI Mutual Fund",
      fundHouse: "Registered AMC",
      cagr3y: "Live Tracking"
    });
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSharePresentation = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="flex-1 p-4 md:p-8 relative z-10 max-w-7xl mx-auto space-y-8">
      
      {/* Header & Presentation Studio Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-3xl font-bold text-white tracking-tight">Fund Research & Presentation Studio</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Presentation Ready
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            Deliver extraordinary mutual fund presentations with interactive 1M, 3M, 6M, 1Y, 3Y, and all-time compounding analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSharePresentation}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? "Link Copied!" : "Share Deck"}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-xl text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" /> Print / Export Slide
          </button>
        </div>
      </div>

      {/* Quick Search & Filter Toolbar */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[28px] p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scheme name or AMC (e.g. Parag Parikh, HDFC, Small Cap)..."
              className="w-full bg-black/50 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />

            {/* Dropdown Live Results */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#090d16] border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-40 max-h-72 overflow-y-auto">
                <div className="p-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">
                  Search Results
                </div>
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left p-3 hover:bg-white/10 transition-colors border-b border-white/5 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-white leading-snug">{item.schemeName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">Code #{item.schemeCode}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 shrink-0">Analyze →</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Tabs */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab("chart")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "chart" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Interactive Charts
            </button>
            <button
              onClick={() => setActiveTab("peer_comparison")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "peer_comparison" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Peer Matrix
            </button>
            <button
              onClick={() => setActiveTab("pitch_deck")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "pitch_deck" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Client Pitch Deck
            </button>
          </div>

        </div>

        {/* Featured Scheme Carousel Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Top Pitch Funds:
          </span>
          {FEATURED_SCHEMES.map((scheme) => {
            const isSelected = selectedScheme.code === scheme.code;
            return (
              <button
                key={scheme.code}
                onClick={() => setSelectedScheme(scheme)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] font-bold"
                    : "bg-white/[0.02] text-slate-400 border-white/5 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {scheme.name.split("-")[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "chart" && (
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[32px] p-6 md:p-8">
          <AdvancedFundChart
            key={selectedScheme.code}
            schemeCode={selectedScheme.code}
            schemeName={selectedScheme.name}
            category={selectedScheme.category}
            fundHouse={selectedScheme.fundHouse}
            initialTimeframe="1Y"
            showPresentationHeader={true}
          />
        </div>
      )}

      {activeTab === "peer_comparison" && (
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[32px] p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Category Peer Benchmarking</h3>
              <p className="text-xs text-slate-400">Comparing risk-adjusted performance against top category leaders</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Fund Performance Metrics
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead className="bg-white/[0.02] border-b border-white/10 text-slate-400 text-xs font-mono uppercase">
                <tr>
                  <th className="px-5 py-3.5">Scheme Name</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5 text-right">3Y CAGR</th>
                  <th className="px-5 py-3.5 text-right">Expense Ratio</th>
                  <th className="px-5 py-3.5 text-right">Alpha</th>
                  <th className="px-5 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {FEATURED_SCHEMES.map((scheme, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-white">{scheme.name}</p>
                      <span className="text-[10px] text-slate-500 font-mono">#{scheme.code} • {scheme.fundHouse}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-300 text-xs">{scheme.category}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-emerald-400">{scheme.cagr3y}</td>
                    <td className="px-5 py-4 text-right font-mono text-slate-300">0.72%</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-amber-400">+4.8%</td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedScheme(scheme);
                          setActiveTab("chart");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
                      >
                        Inspect Chart →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "pitch_deck" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-950/40 via-[#0b1120] to-slate-950 border border-white/15 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-indigo-400 font-bold">Executive Summary</span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedScheme.name}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300">
                ★
              </div>
            </div>

            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Key Value Proposition
                </h4>
                <p className="text-xs text-slate-300">
                  Disciplined investment framework targeting long-term capital compounding with superior downside protection during market consolidations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Recommended Horizon</span>
                  <p className="text-lg font-bold text-white font-mono mt-0.5">3 to 5+ Years</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Ideal Allocation</span>
                  <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">Core Growth SIP</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Presentation Deck Version 2.4 • Daily NAV Updated</span>
              <button
                onClick={() => {
                  setActiveTab("chart");
                }}
                className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                Open 1M-ALL Chart Engine
              </button>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 space-y-6 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Presentation Quick Tips</h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  Toggle between <strong>NAV Trend</strong>, <strong>₹10k Lump Sum</strong>, and <strong>SIP Wealth</strong> to show compounding visually.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  Use the <strong>1M, 3M, 6M, 1Y, 3Y, ALL</strong> buttons to display performance across market cycles.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  Click <strong>Presentation Mode</strong> for full-screen immersive slide projections.
                </li>
              </ul>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer"
            >
              Export Slide Snapshot
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
