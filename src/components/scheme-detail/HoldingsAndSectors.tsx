import React, { useState } from 'react';
import { Search, ListFilter, Percent } from 'lucide-react';
import { SchemeDetailData } from '../../services/schemeDetails.service';

interface HoldingsAndSectorsProps {
  holdings: SchemeDetailData['topHoldings'];
  sectors: SchemeDetailData['sectorAllocation'];
}

export default function HoldingsAndSectors({ holdings, sectors }: HoldingsAndSectorsProps) {
  const [holdingSearch, setHoldingSearch] = useState('');

  const filteredHoldings = holdings.filter(h => 
    h.name.toLowerCase().includes(holdingSearch.toLowerCase()) ||
    h.type.toLowerCase().includes(holdingSearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sector Allocations */}
      <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 md:p-8 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.4)] flex flex-col h-[400px]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold tracking-wider uppercase text-slate-300">
            Sector Weightage
          </h3>
          <span className="text-[10px] bg-slate-800 px-2.5 py-0.5 rounded-full font-bold text-slate-400">
            {sectors.length} Sectors
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-white/10">
          {sectors.map((s, idx) => (
            <div key={idx} className="space-y-1 py-1 border-b border-white/[0.03]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{s.sector}</span>
                <span className="font-bold text-emerald-400 font-mono">{s.weight.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full">
                <div className="bg-emerald-400/80 h-full rounded-full" style={{ width: `${s.weight}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Portfolio Holdings */}
      <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 md:p-8 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.4)] flex flex-col h-[400px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold tracking-wider uppercase text-slate-300">
              Top Strategic Holdings
            </h3>
            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full font-bold text-slate-400">
              {holdings.length} Total
            </span>
          </div>

          {/* Inline Filter Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Filter holdings..."
              value={holdingSearch}
              onChange={(e) => setHoldingSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 w-full sm:w-40 transition-all"
            />
          </div>
        </div>

        {/* Holdings List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-white/10">
          {filteredHoldings.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No holdings match "{holdingSearch}"
            </div>
          ) : (
            filteredHoldings.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-white/[0.03] text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-white tracking-tight">{h.name}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{h.type}</div>
                </div>
                <span className="font-bold text-emerald-400 font-mono bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-lg">
                  {h.allocation}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
