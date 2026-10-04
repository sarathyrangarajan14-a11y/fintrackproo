import React, { useState } from 'react';
import { 
  X, Info, PieChart, Layers, BarChart3, TrendingUp, Users, 
  HelpCircle, Percent, ShieldCheck, Scale, ArrowRight, BookOpen,
  ChevronDown, ChevronUp, Landmark
} from 'lucide-react';
import { UnifiedInstrument } from '../types/instruments.ts';
import { getSchemeDetails, SchemeDetail } from '../data/schemeDetailsData.ts';

interface SchemeDetailsModalProps {
  instrument: UnifiedInstrument;
  onClose: () => void;
  isModal?: boolean;
}

export default function SchemeDetailsModal({ instrument, onClose, isModal = true }: SchemeDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'holdings' | 'ratios' | 'peers' | 'managers' | 'faqs'>('holdings');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Retrieve scheme details either from DB or procedurally generated
  const navValue = instrument.schemeType === 'MUTUAL_FUND' ? instrument.currentNav : instrument.ltp;
  const details: SchemeDetail = getSchemeDetails(
    instrument.code, 
    instrument.name, 
    instrument.category, 
    instrument.fundHouse, 
    navValue
  );

  const {
    schemeInfo,
    assetAllocation,
    marketCapSplit,
    sectorAllocation,
    topHoldings,
    totalHoldingsCount,
    advancedRatios,
    investmentDetails,
    peerComparison,
    fundManagers,
    faqs
  } = details;

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b1120] border border-white/15 rounded-[32px] w-full max-w-5xl shadow-[0_0_60px_rgba(0,0,0,0.85)] relative max-h-[92vh] flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-200">
        
        {/* Header Block */}
        <div className="p-6 md:p-8 border-b border-white/5 relative bg-gradient-to-b from-white/[0.02] to-transparent">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-white p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors z-10 cursor-pointer"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="space-y-3.5 pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${
                instrument.schemeType === 'ETF' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : 'bg-sky-500/10 text-sky-400 border-sky-500/25'
              }`}>
                {instrument.schemeType === 'ETF' ? 'NSE ETF' : 'Mutual Fund'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {schemeInfo.category}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                Benchmark: <strong className="text-slate-300 font-semibold">{schemeInfo.benchmark}</strong>
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold leading-tight text-white group-hover:text-emerald-300 transition-colors">
                {schemeInfo.name}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Landmark className="w-3.5 h-3.5 text-slate-500" />
                <span>{schemeInfo.amc}</span>
                <span>•</span>
                <span className="text-slate-300">{schemeInfo.plan}</span>
              </p>
            </div>
          </div>

          {/* Core Facts Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Current NAV</span>
              <span className="text-lg font-mono font-bold text-white">{schemeInfo.nav}</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Fund AUM</span>
              <span className="text-lg font-mono font-bold text-emerald-400">{schemeInfo.aum}</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Expense Ratio (TER)</span>
              <span className="text-sm font-bold text-white truncate block">{schemeInfo.expenseRatio}</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Riskometer Risk</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 mt-0.5 rounded-full text-xs font-bold border ${
                schemeInfo.riskometer.includes('Very High')
                  ? 'bg-red-500/10 text-red-400 border-red-500/25'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {schemeInfo.riskometer}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-6 md:px-8 border-b border-white/5 flex overflow-x-auto gap-1 scrollbar-none bg-slate-950/40">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`py-4 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'holdings' 
                ? 'border-emerald-400 text-emerald-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <PieChart className="w-4 h-4" /> Holdings &amp; Asset Allocation
          </button>
          <button
            onClick={() => setActiveTab('ratios')}
            className={`py-4 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ratios' 
                ? 'border-emerald-400 text-emerald-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" /> Ratios &amp; Exit Load
          </button>
          <button
            onClick={() => setActiveTab('peers')}
            className={`py-4 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'peers' 
                ? 'border-emerald-400 text-emerald-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Peer Comparison
          </button>
          <button
            onClick={() => setActiveTab('managers')}
            className={`py-4 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'managers' 
                ? 'border-emerald-400 text-emerald-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Fund Managers
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-4 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'faqs' 
                ? 'border-emerald-400 text-emerald-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Scheme FAQs
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-h-[60vh] sm:max-h-[65vh]">
          
          {/* TAB 1: Portfolio, Asset Allocation, Sector Allocation & Holdings */}
          {activeTab === 'holdings' && (
            <div className="space-y-6">
              
              {/* Asset Class Allocation & Market Cap Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Asset Class Allocation Progress Bars */}
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" /> Asset Allocation (%)
                  </h3>
                  <div className="space-y-3.5">
                    {/* Equity */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">Equity &amp; Equities Equiv.</span>
                        <span className="text-white">{assetAllocation.equity}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-sky-400 h-full rounded-full" style={{ width: `${assetAllocation.equity}%` }} />
                      </div>
                    </div>
                    {/* Debt */}
                    {assetAllocation.debt > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-300">Debt Securities</span>
                          <span className="text-white">{assetAllocation.debt}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${assetAllocation.debt}%` }} />
                        </div>
                      </div>
                    )}
                    {/* Cash */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">Cash, Treps &amp; Bank Balances</span>
                        <span className="text-white">{assetAllocation.cashAndReceivables}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${assetAllocation.cashAndReceivables}%` }} />
                      </div>
                    </div>
                    {/* REITs */}
                    {assetAllocation.reitsInvITs > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-300">REITs &amp; InvITs Units</span>
                          <span className="text-white">{assetAllocation.reitsInvITs}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-violet-400 h-full rounded-full" style={{ width: `${assetAllocation.reitsInvITs}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Market Cap Split */}
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-300 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" /> Market Capitalization Split (%)
                  </h3>
                  {marketCapSplit.largeCap === 0 && marketCapSplit.midCap === 0 && marketCapSplit.smallCap === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500 py-8">
                      Not Applicable for Debt schemes
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {/* Large Cap */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-300">Large Cap Companies</span>
                          <span className="text-white">{marketCapSplit.largeCap}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${marketCapSplit.largeCap}%` }} />
                        </div>
                      </div>
                      {/* Mid Cap */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-300">Mid Cap Companies</span>
                          <span className="text-white">{marketCapSplit.midCap}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-sky-400 h-full rounded-full" style={{ width: `${marketCapSplit.midCap}%` }} />
                        </div>
                      </div>
                      {/* Small Cap */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-300">Small Cap Companies</span>
                          <span className="text-white">{marketCapSplit.smallCap}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${marketCapSplit.smallCap}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sector Weightage & Top Holdings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sector Weights */}
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-300">
                    Sector Allocations
                  </h3>
                  <div className="max-h-[250px] overflow-y-auto pr-1 space-y-2">
                    {sectorAllocation.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5 border-b border-white/[0.03] text-xs">
                        <span className="font-medium text-slate-300">{s.sector}</span>
                        <span className="font-bold text-white font-mono">{s.weight}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Fund Holdings */}
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-300">
                      Top Strategic Holdings
                    </h3>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full font-bold text-slate-400">
                      Total: {totalHoldingsCount} Holdings
                    </span>
                  </div>
                  <div className="max-h-[250px] overflow-y-auto pr-1 space-y-2">
                    {topHoldings.map((h, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-white/[0.03] text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-white">{h.name}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{h.type}</div>
                        </div>
                        <span className="font-bold text-emerald-400 font-mono">{h.allocation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Risk Ratios & Load Details */}
          {activeTab === 'ratios' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Advanced Portfolio Ratios */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-300 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" /> Portfolio Performance &amp; Risk Ratios
                </h3>
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                        Price-to-Earnings (P/E) Ratio
                      </span>
                      <span className="text-[10px] text-slate-500 block">Indicates portfolio valuation multiple</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-white">{advancedRatios.peRatio}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                        Price-to-Book (P/B) Ratio
                      </span>
                      <span className="text-[10px] text-slate-500 block">Indicates book value multiple</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-white">{advancedRatios.pbRatio}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                        Standard Deviation
                      </span>
                      <span className="text-[10px] text-slate-500 block">Measures portfolio volatility relative to market</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-white">{advancedRatios.standardDeviation}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                        Sharpe Ratio
                      </span>
                      <span className="text-[10px] text-slate-500 block">Measures risk-adjusted return capabilities</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-emerald-400">{advancedRatios.sharpeRatio}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                        Beta Multiplier
                      </span>
                      <span className="text-[10px] text-slate-500 block">Indicates sensitivity relative to the benchmark index (1.00)</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-white">{advancedRatios.beta}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Limits, Exit Load & Taxation details */}
              <div className="space-y-6">
                
                {/* Investment Limits */}
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                    Investment Thresholds
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">Minimum SIP</span>
                      <span className="text-sm font-bold text-white font-mono">{investmentDetails.minSIP}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">Min. Lumpsum</span>
                      <span className="text-sm font-bold text-white font-mono">{investmentDetails.minLumpsum}</span>
                    </div>
                  </div>
                </div>

                {/* Exit Load Terms */}
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-amber-400" /> Redemption Exit Load Rules
                  </h4>
                  <ul className="space-y-2">
                    {investmentDetails.exitLoad.map((rule, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Taxation Rules */}
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-sky-400" /> Capital Gains Taxation Status
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <strong className="text-slate-300 block">Short Term Capital Gains (STCG)</strong>
                      <span className="text-slate-400">{investmentDetails.taxation.stcg}</span>
                    </div>
                    <div>
                      <strong className="text-slate-300 block">Long Term Capital Gains (LTCG)</strong>
                      <span className="text-slate-400">{investmentDetails.taxation.ltcg}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: Peer Comparison */}
          {activeTab === 'peers' && (
            <div className="space-y-4">
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-300 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Category Peer Comparison Table
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[520px]">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] text-slate-400 uppercase tracking-widest">
                        <th className="py-3 px-4">Scheme / Fund Name</th>
                        <th className="py-3 px-4 text-right">1Y CAGR</th>
                        <th className="py-3 px-4 text-right">3Y CAGR</th>
                        <th className="py-3 px-4 text-right">5Y CAGR</th>
                        <th className="py-3 px-4 text-right">TER (Exp.)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {peerComparison.map((peer, idx) => (
                        <tr 
                          key={idx} 
                          className={`hover:bg-white/[0.02] ${peer.isCurrent ? 'bg-emerald-500/5 font-bold text-emerald-400' : 'text-slate-300'}`}
                        >
                          <td className="py-3.5 px-4 font-semibold flex items-center gap-1.5">
                            {peer.name}
                            {peer.isCurrent && (
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                                Current
                              </span>
                            )}
                          </td>
                          <td className={`py-3.5 px-4 text-right font-mono ${peer.ret1Y.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}`}>{peer.ret1Y}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-emerald-400">{peer.ret3Y}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-emerald-400">{peer.ret5Y}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-300">{peer.ter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Historical performance is for comparison purposes only. Past performance does not guarantee future results. Base Expense Ratio represents the internal AMC management overheads.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Fund Managers */}
          {activeTab === 'managers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fundManagers.map((m, idx) => (
                <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-emerald-400 text-lg">
                    {m.name.split(' ').map(x => x[0]).join('')}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">{m.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{m.role}</p>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1 font-semibold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Tenure: {m.tenure}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: FAQs */}
          {activeTab === 'faqs' && (
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = expandedFaqIndex === idx;
                return (
                  <div 
                    key={idx} 
                    className="bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-4 flex items-center justify-between gap-4 font-bold text-sm text-slate-200 hover:text-white cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" /> {faq.q}
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 border-t border-white/[0.03] text-xs text-slate-400 leading-relaxed bg-slate-950/20">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 border-t border-white/5 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">SEBI Registered AMC</span>
              <span className="text-xs font-semibold text-slate-300">PPFAS / AMFI Scheme Registration Portal</span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 text-xs font-extrabold rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 transition-all cursor-pointer shadow-[0_0_20px_rgba(52,211,153,0.25)]"
          >
            Acknowledge &amp; Return
          </button>
        </div>

      </div>
    </div>
  );
}
