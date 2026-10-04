import React from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, ShieldCheck, Zap } from 'lucide-react';
import { UnifiedInstrument, MutualFundData, EtfData } from '../types/instruments.ts';

interface InstrumentPriceBadgeProps {
  instrument: UnifiedInstrument;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export default function InstrumentPriceBadge({
  instrument,
  size = 'md',
  showDetails = true,
  className = ''
}: InstrumentPriceBadgeProps) {
  const isEtf = instrument.schemeType === 'ETF';

  if (isEtf) {
    const etf = instrument as EtfData;
    const isUp = etf.dayChange >= 0;
    const isLive = etf.isMarketLive;

    return (
      <div className={`flex flex-col items-end ${className}`}>
        {/* Top Header / Live Badge */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            LTP (NSE)
          </span>
          <div 
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
              isLive
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            {isLive ? 'Live Market' : 'Market Closed'}
          </div>
        </div>

        {/* Primary LTP Price Display */}
        <div className="flex items-baseline gap-2">
          <span 
            className={`font-mono font-extrabold text-white tracking-tight ${
              size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base'
            }`}
          >
            ₹{etf.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>

          {/* Intraday Movement Pill */}
          <span 
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold font-mono ${
              isUp 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
            {isUp ? '+' : ''}{etf.dayChange.toFixed(2)} ({isUp ? '+' : ''}{etf.dayChangePercentage.toFixed(2)}%)
          </span>
        </div>

        {/* Intraday Range / Volume / Timestamp */}
        {showDetails && (
          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
            {etf.dayLow > 0 && etf.dayHigh > 0 && (
              <span className="font-mono">
                L: ₹{etf.dayLow} • H: ₹{etf.dayHigh}
              </span>
            )}
            {etf.volume > 0 && (
              <span className="hidden sm:inline border-l border-white/10 pl-2">
                Vol: {(etf.volume / 1000).toFixed(0)}k
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // MUTUAL FUND DISPLAY
  const mf = instrument as MutualFundData;
  const isUp = mf.dayChange >= 0;

  return (
    <div className={`flex flex-col items-end ${className}`}>
      {/* Top Header / NAV Badge */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
          Latest NAV
        </span>
        <div 
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20"
          title="Mutual Fund NAVs are updated daily post-market close between 9:00 PM – 11:00 PM IST"
        >
          <Clock className="w-2.5 h-2.5" />
          <span>As of {mf.navDate || 'Latest EOD'}</span>
        </div>
      </div>

      {/* Primary NAV Display */}
      <div className="flex items-baseline gap-2">
        <span 
          className={`font-mono font-extrabold text-white tracking-tight ${
            size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base'
          }`}
        >
          ₹{mf.currentNav.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
        </span>

        {/* Day's NAV Change Pill */}
        {mf.dayChangePercentage !== undefined && mf.dayChangePercentage !== 0 && (
          <span 
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold font-mono ${
              isUp 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
            {isUp ? '+' : ''}{mf.dayChangePercentage.toFixed(2)}%
          </span>
        )}
      </div>

      {/* Official Daily Notice */}
      {showDetails && (
        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
          <ShieldCheck className="w-3 h-3 text-sky-400/80" />
          <span>Official Daily NAV</span>
        </div>
      )}
    </div>
  );
}
