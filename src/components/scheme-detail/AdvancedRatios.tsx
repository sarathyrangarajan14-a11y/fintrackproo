import React from 'react';
import { BarChart3, HelpCircle, AlertCircle, Percent, Scale, Coins } from 'lucide-react';
import { SchemeDetailData } from '../../services/schemeDetails.service';

interface AdvancedRatiosProps {
  ratios: SchemeDetailData['advancedRatios'];
  investmentDetails: SchemeDetailData['investmentDetails'];
}

export default function AdvancedRatios({ ratios, investmentDetails }: AdvancedRatiosProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Ratios Metrics */}
      <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 md:p-8 space-y-5 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
        <h3 className="text-sm font-extrabold tracking-wider uppercase text-slate-300 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-400" /> Advanced Risk &amp; Valuation Ratios
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-300">Price-to-Earnings (P/E)</span>
              <span className="text-[10px] text-slate-500 block">Indicates standard price valuation multiple</span>
            </div>
            <span className="font-mono text-sm font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg">
              {ratios.peRatio}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-300">Price-to-Book (P/B)</span>
              <span className="text-[10px] text-slate-500 block">Indicates asset book valuation multiple</span>
            </div>
            <span className="font-mono text-sm font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg">
              {ratios.pbRatio}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-300">Standard Deviation</span>
              <span className="text-[10px] text-slate-500 block">Measures annualized asset price volatility</span>
            </div>
            <span className="font-mono text-sm font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg">
              {ratios.standardDeviation}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-300">Sharpe Ratio</span>
              <span className="text-[10px] text-slate-500 block">Measures risk-adjusted return capabilities</span>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              {ratios.sharpeRatio}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-300">Beta</span>
              <span className="text-[10px] text-slate-500 block">Indicates market volatility sensitivity index</span>
            </div>
            <span className="font-mono text-sm font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg">
              {ratios.beta}
            </span>
          </div>
        </div>
      </div>

      {/* Load & limits & taxation Column */}
      <div className="space-y-6">
        {/* Investment Limits */}
        <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-5 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-emerald-400" /> Investment Thresholds
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-500 block font-semibold">Minimum SIP</span>
              <span className="text-sm font-mono font-bold text-white">{investmentDetails.minSIP}</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-500 block font-semibold">Minimum Lumpsum</span>
              <span className="text-sm font-mono font-bold text-white">{investmentDetails.minLumpsum}</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Stamp Duty: <span className="text-slate-400 font-semibold">{investmentDetails.stampDuty}</span>
          </div>
        </div>

        {/* Exit Load */}
        <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-5 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-400" /> Exit Load Framework
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {investmentDetails.exitLoad.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Capital Gains taxation */}
        <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-5 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-sky-400" /> Capital Gains Taxation
          </h4>
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Short Term Gains (STCG)</span>
              <p className="text-slate-300 font-medium leading-relaxed">{investmentDetails.taxation.stcg}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Long Term Gains (LTCG)</span>
              <p className="text-slate-300 font-medium leading-relaxed">{investmentDetails.taxation.ltcg}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
