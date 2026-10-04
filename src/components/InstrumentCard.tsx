import React from 'react';
import { ArrowUpRight, LineChart as LineChartIcon, Star, ShieldCheck, Zap, Layers, Sparkles, Lock, Clock } from 'lucide-react';
import { UnifiedInstrument, MutualFundData, EtfData } from '../types/instruments.ts';
import InstrumentPriceBadge from './InstrumentPriceBadge';

interface InstrumentCardProps {
  instrument: UnifiedInstrument;
  onSelect: (instrument: UnifiedInstrument) => void;
  onOpenChart: (instrument: UnifiedInstrument) => void;
  onOpenDetails?: (instrument: UnifiedInstrument) => void;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (instrument: UnifiedInstrument) => void;
  kycStatus?: string;
}

export default function InstrumentCard({
  instrument,
  onSelect,
  onOpenChart,
  onOpenDetails,
  isWatchlisted = false,
  onToggleWatchlist,
  kycStatus = 'NOT_STARTED'
}: InstrumentCardProps) {
  const isEtf = instrument.schemeType === 'ETF';
  const etf = isEtf ? (instrument as EtfData) : null;
  const mf = !isEtf ? (instrument as MutualFundData) : null;

  return (
    <div className="bg-[#0b1120]/90 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] group relative overflow-hidden">
      {/* Top Background Gradient Hue */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-10 transition-opacity group-hover:opacity-20 ${isEtf ? 'bg-emerald-500' : 'bg-sky-500'}`} />

      {/* Header Info & Asset Type Tag */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span 
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${
                isEtf 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : 'bg-sky-500/10 text-sky-400 border-sky-500/25'
              }`}
            >
              {isEtf ? <Zap className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
              {isEtf ? 'NSE ETF' : 'Mutual Fund'}
            </span>

            <span className="text-[11px] text-slate-400 font-medium truncate max-w-[130px]">
              {instrument.category}
            </span>
          </div>

          {onToggleWatchlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(instrument);
              }}
              className={`p-1.5 rounded-lg border transition-colors ${
                isWatchlisted 
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Star className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
            </button>
          )}
        </div>

        {/* Scheme Name & Fund House */}
        <h3 className="font-bold text-white text-base leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2 min-h-[44px]">
          {instrument.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-4 flex items-center gap-1.5">
          <span>{instrument.fundHouse}</span>
          {instrument.symbol && <span className="font-mono text-[10px] text-slate-500">({instrument.symbol})</span>}
        </p>
      </div>

      {/* Pricing Module & Performance Metrics */}
      <div className="pt-3 border-t border-white/5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-0.5">
              1Y Return
            </span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              +{instrument.returns?.return1y || 16.8}%
            </span>
          </div>

          <InstrumentPriceBadge instrument={instrument} size="md" showDetails={false} />
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenChart(instrument)}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <LineChartIcon className="w-3.5 h-3.5 text-slate-400" />
              Chart
            </button>

            <button
              onClick={() => onOpenDetails && onOpenDetails(instrument)}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Details
            </button>
          </div>

          <button
            onClick={() => onSelect(instrument)}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all shadow-sm cursor-pointer w-full ${
              kycStatus === 'VERIFIED'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-800/90 text-slate-400 border border-slate-700/80 hover:border-amber-500/50 hover:text-amber-300 opacity-80'
            }`}
            title={kycStatus === 'VERIFIED' ? "Invest in this fund" : "KYC Verification Required to Invest"}
          >
            {kycStatus === 'VERIFIED' ? (
              <>
                <span>Invest</span> <ArrowUpRight className="w-3.5 h-3.5" />
              </>
            ) : kycStatus === 'SUBMITTED' || kycStatus === 'PENDING' ? (
              <>
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>KYC Under Review</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Invest (KYC Required)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
