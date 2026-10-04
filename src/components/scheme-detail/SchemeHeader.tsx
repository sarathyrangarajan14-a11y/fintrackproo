import React, { useState } from 'react';
import { Landmark, Shield, Bookmark, Copy, Check, Star } from 'lucide-react';
import { SchemeDetailData } from '../../services/schemeDetails.service';

interface SchemeHeaderProps {
  scheme: SchemeDetailData['schemeInfo'];
}

export default function SchemeHeader({ scheme }: SchemeHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scheme.schemeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHighRisk = scheme.riskometer.includes('Very High') || scheme.riskometer.includes('High');

  return (
    <div className="bg-[#0b1222] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="space-y-4">
          {/* Badges strip */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              AMFI CODE: {scheme.schemeCode}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-sky-500/10 text-sky-400 border border-sky-500/25">
              {scheme.category}
            </span>
            <button 
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full transition-all cursor-pointer"
              title="Copy Scheme Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-bold uppercase">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Scheme Title & AMC */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              {scheme.name}
            </h1>
            <p className="text-sm text-slate-400 flex items-center gap-2 font-semibold">
              <Landmark className="w-4 h-4 text-slate-500" />
              <span>{scheme.amc}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-mono">{scheme.plan || 'Direct Plan - Growth'}</span>
            </p>
          </div>

          {/* Benchmark */}
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-500/75 shrink-0" />
            <span>Benchmark Index: <strong className="text-slate-200 font-bold">{scheme.benchmark}</strong></span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 px-4 py-2.5 rounded-xl transition-all cursor-pointer">
            <Star className="w-4 h-4" /> Add to Watchlist
          </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5 relative z-10">
        <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl p-4 transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Current NAV</span>
          <span className="text-xl font-mono font-bold text-white">{scheme.nav}</span>
        </div>
        <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl p-4 transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Assets (AUM)</span>
          <span className="text-xl font-mono font-bold text-emerald-400">{scheme.aum}</span>
        </div>
        <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl p-4 transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Expense Ratio (TER)</span>
          <span className="text-sm font-bold text-white block truncate pt-0.5" title={scheme.expenseRatio}>
            {scheme.expenseRatio}
          </span>
        </div>
        <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl p-4 transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Riskometer</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-0.5 rounded-full text-xs font-extrabold border ${
            isHighRisk
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {scheme.riskometer}
          </span>
        </div>
      </div>
    </div>
  );
}
