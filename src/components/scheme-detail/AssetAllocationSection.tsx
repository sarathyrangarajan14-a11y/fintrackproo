import React from 'react';
import { Layers, BarChart3, Info } from 'lucide-react';
import { SchemeDetailData } from '../../services/schemeDetails.service';

interface AssetAllocationSectionProps {
  allocation: SchemeDetailData['assetAllocation'];
  marketCap: SchemeDetailData['marketCapSplit'];
}

export default function AssetAllocationSection({ allocation, marketCap }: AssetAllocationSectionProps) {
  const assetKeys = [
    { label: 'Equity & Equity Derivatives', value: allocation.equity, color: 'bg-sky-400' },
    { label: 'Debt Securities', value: allocation.debt, color: 'bg-emerald-400' },
    { label: 'Cash & Net Receivables', value: allocation.cashAndReceivables, color: 'bg-amber-400' },
    { label: 'REITs & InvITs', value: allocation.reitsInvITs, color: 'bg-violet-400' },
    { label: 'Hedged Equity', value: allocation.hedgedEquity, color: 'bg-indigo-400' },
  ].filter(item => item.value > 0);

  const marketCapKeys = [
    { label: 'Large Cap Companies', value: marketCap.largeCap, color: 'bg-emerald-400' },
    { label: 'Mid Cap Companies', value: marketCap.midCap, color: 'bg-sky-400' },
    { label: 'Small Cap Companies', value: marketCap.smallCap, color: 'bg-indigo-400' },
  ].filter(item => item.value > 0);

  const hasMarketCap = marketCapKeys.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Asset Allocation progress meters */}
      <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold tracking-wider uppercase text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" /> Asset Allocation (%)
          </h3>
          <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full font-bold text-sky-400 uppercase">
            Portfolio Split
          </span>
        </div>

        <div className="space-y-5">
          {assetKeys.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>{item.label}</span>
                <span className="font-mono text-white">{item.value.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Capitalization progress meters */}
      <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold tracking-wider uppercase text-slate-300 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" /> Market Capitalization (%)
          </h3>
          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold text-emerald-400 uppercase">
            Equity Distribution
          </span>
        </div>

        {!hasMarketCap ? (
          <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-slate-500 text-xs text-center space-y-2">
            <Info className="w-8 h-8 text-slate-600 animate-pulse" />
            <p>Not Applicable for Debt schemes / cash funds</p>
          </div>
        ) : (
          <div className="space-y-5">
            {marketCapKeys.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>{item.label}</span>
                  <span className="font-mono text-white">{item.value.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
