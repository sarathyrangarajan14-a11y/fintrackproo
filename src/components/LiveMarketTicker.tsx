import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { stockService, StockData } from '../services/stock.service';

export default function LiveMarketTicker() {
  const [marketData, setMarketData] = useState<Record<string, StockData>>({});
  const [flashing, setFlashing] = useState<Record<string, 'up' | 'down' | null>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Simple logic to check if market is likely open (Mon-Fri, 9:15-15:30 IST)
  // For UI demo, we'll keep it simple and just show Live if data fetches.
  const isMarketOpen = true; 

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      const data = await stockService.getBatchIndices(['^NSEI', '^NSEBANK', '^BSESN']);
      if (data && mounted) {
        setMarketData(prev => {
          const newFlashing: Record<string, 'up' | 'down' | null> = {};
          
          Object.keys(data).forEach(key => {
            if (prev[key]) {
              if (data[key].price > prev[key].price) newFlashing[key] = 'up';
              else if (data[key].price < prev[key].price) newFlashing[key] = 'down';
              else newFlashing[key] = null;
            }
          });
          
          setFlashing(newFlashing);
          setTimeout(() => {
            if (mounted) setFlashing({});
          }, 800);
          
          return data;
        });
        setLastUpdated(new Date());
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const getLabel = (sym: string) => {
    if (sym === '^NSEI') return 'NIFTY 50';
    if (sym === '^NSEBANK') return 'BANK NIFTY';
    if (sym === '^BSESN') return 'SENSEX';
    return sym;
  };

  if (Object.keys(marketData).length === 0) return null;

  return (
    <div className="bg-[#0f172a] border-b border-white/10 py-2.5 px-4 flex items-center justify-between text-xs overflow-x-auto whitespace-nowrap hide-scrollbar z-50 relative">
      <div className="flex items-center gap-6 min-w-max">
        <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-6">
          <div className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`}></div>
          <span className="text-slate-400 font-bold tracking-wider uppercase">Live Market</span>
        </div>
        
        {Object.entries(marketData).map(([sym, data]) => {
          const isUp = data.change >= 0;
          const flashClass = flashing[sym] === 'up' 
            ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50' 
            : flashing[sym] === 'down' 
              ? 'bg-red-500/20 text-red-300 ring-1 ring-red-500/50' 
              : 'bg-transparent text-slate-300';
          
          return (
            <div key={sym} className={`flex items-center gap-3 px-3 py-1 rounded-lg transition-all duration-300 ${flashClass}`}>
              <span className="font-bold text-slate-400 tracking-wide">{getLabel(sym)}</span>
              <span className={`font-mono font-bold text-sm ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {data.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {isUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {isUp ? '+' : ''}{data.change.toFixed(2)} ({isUp ? '+' : ''}{data.percentChange.toFixed(2)}%)
              </span>
            </div>
          );
        })}
      </div>
      
      {lastUpdated && (
        <div className="text-slate-500 flex items-center gap-1.5 ml-4 min-w-max border-l border-white/10 pl-6">
          <Clock className="w-3 h-3" />
          <span className="font-mono">{lastUpdated.toLocaleTimeString('en-IN', { hour12: true })}</span>
        </div>
      )}
    </div>
  );
}
