import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { SchemeDetailData } from '../../services/schemeDetails.service';

interface PeerComparisonTableProps {
  peers: SchemeDetailData['peerComparison'];
}

export default function PeerComparisonTable({ peers }: PeerComparisonTableProps) {
  return (
    <div className="space-y-4">
      <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-extrabold tracking-wider uppercase text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Category Peer Comparison Table
          </h3>
          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold text-emerald-400 uppercase">
            Performance Metrics
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/25">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-slate-400 uppercase tracking-widest bg-white/[0.01]">
                <th className="py-4 px-5">Scheme / Fund Name</th>
                <th className="py-4 px-5 text-right">1Y CAGR</th>
                <th className="py-4 px-5 text-right">3Y CAGR</th>
                <th className="py-4 px-5 text-right">5Y CAGR</th>
                <th className="py-4 px-5 text-right">Exp. Ratio (TER)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {peers.map((peer, idx) => {
                const isNegative1Y = peer.ret1Y.startsWith('-');
                return (
                  <tr 
                    key={idx} 
                    className={`hover:bg-white/[0.02] transition-colors ${
                      peer.isCurrent 
                        ? 'bg-emerald-500/5 font-extrabold text-emerald-400' 
                        : ''
                    }`}
                  >
                    <td className="py-4 px-5 font-bold flex items-center gap-2 max-w-[280px] sm:max-w-none truncate">
                      <span>{peer.name}</span>
                      {peer.isCurrent && (
                        <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 font-extrabold border border-emerald-400/20">
                          Active
                        </span>
                      )}
                    </td>
                    <td className={`py-4 px-5 text-right font-mono ${isNegative1Y ? 'text-red-400' : 'text-emerald-400'}`}>
                      {peer.ret1Y}
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-emerald-400">
                      {peer.ret3Y}
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-emerald-400">
                      {peer.ret5Y}
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-slate-400">
                      {peer.ter}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          Historical returns represent compound annualized growth rate (CAGR). Standard direct plan performance is utilized. Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
        </p>
      </div>
    </div>
  );
}
