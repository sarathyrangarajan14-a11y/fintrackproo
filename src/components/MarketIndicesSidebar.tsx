import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, Search } from 'lucide-react';
import { stockService, StockData, INDEX_CATEGORIES } from '../services/stock.service';

export default function MarketIndicesSidebar() {
  const [marketData, setMarketData] = useState<Record<string, StockData>>({});
  const [flashing, setFlashing] = useState<Record<string, 'up' | 'down' | null>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'major' | 'broad' | 'sectoral'>('major');

  const [marketStatus, setMarketStatus] = useState<string>('CLOSED');
  const isMarketOpen = marketStatus === 'REGULAR';

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      // Fetch all required symbols depending on the active tab, or fetch all at once to keep it fast
      // Fetching all at once so switching tabs is instant
      const allSymbols = [...new Set([...INDEX_CATEGORIES.major, ...INDEX_CATEGORIES.broad, ...INDEX_CATEGORIES.sectoral])];
      const data = await stockService.getBatchIndices(allSymbols);
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
        if (data['^NSEI']?.marketState) {
          setMarketStatus(data['^NSEI'].marketState);
        }
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
    const labels: Record<string, string> = {
      '^NSEI': 'NIFTY 50',
      '^BSESN': 'SENSEX',
      '^NSEMDCP50': 'NIFTY MIDCAP 50',
      '^CNXSC': 'NIFTY SMLCAP 100',
      '^CRSLDX': 'NIFTY 500',
      '^NSEBANK': 'BANK NIFTY',
      '^CNXIT': 'NIFTY IT',
      '^CNXAUTO': 'NIFTY AUTO',
      '^CNXPHARMA': 'NIFTY PHARMA',
      '^CNXFMCG': 'NIFTY FMCG',
      '^CNXMETAL': 'NIFTY METAL',
      '^CNXPSUBANK': 'NIFTY PSU',
      'NIFTY_FIN_SERVICE.NS': 'NIFTY FIN'
    };
    return labels[sym] || sym;
  };

  const currentSymbols = INDEX_CATEGORIES[activeTab];

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-400" /> Live Markets
        </h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`}></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{marketStatus === 'REGULAR' ? 'Open' : (marketStatus === 'HOLIDAY' || marketStatus === 'CLOSED' ? marketStatus : 'Closed')}</span>
        </div>
      </div>
      
      <div className="flex border-b border-white/10 text-sm font-bold">
        <button 
          onClick={() => setActiveTab('major')}
          className={`flex-1 py-3 text-center transition-colors ${activeTab === 'major' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5' : 'text-slate-400 hover:bg-white/5'}`}
        >
          Major
        </button>
        <button 
          onClick={() => setActiveTab('broad')}
          className={`flex-1 py-3 text-center transition-colors ${activeTab === 'broad' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5' : 'text-slate-400 hover:bg-white/5'}`}
        >
          Broad
        </button>
        <button 
          onClick={() => setActiveTab('sectoral')}
          className={`flex-1 py-3 text-center transition-colors ${activeTab === 'sectoral' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5' : 'text-slate-400 hover:bg-white/5'}`}
        >
          Sectoral
        </button>
      </div>

      <div className="p-2 space-y-1">
        {currentSymbols.map(sym => {
          const data = marketData[sym];
          if (!data) return (
            <div key={sym} className="p-4 flex justify-between animate-pulse bg-white/5 rounded-2xl m-2">
              <div className="w-24 h-4 bg-white/10 rounded"></div>
              <div className="w-16 h-4 bg-white/10 rounded"></div>
            </div>
          );

          const isUp = data.change >= 0;
          const flashClass = flashing[sym] === 'up' 
            ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50' 
            : flashing[sym] === 'down' 
              ? 'bg-red-500/20 text-red-300 ring-1 ring-red-500/50' 
              : 'hover:bg-white/5 text-slate-300';
          
          return (
            <div key={sym} className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-300 ${flashClass}`}>
              <div>
                <div className="font-bold text-white text-sm">{getLabel(sym)}</div>
              </div>
              <div className="text-right">
                <div className={`font-mono font-bold text-sm ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {data.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center justify-end text-[10px] font-bold mt-0.5">
                  <span className={`flex items-center ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                    {isUp ? '+' : ''}{data.change.toFixed(2)} ({isUp ? '+' : ''}{data.percentChange.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {lastUpdated && (
        <div className="p-4 border-t border-white/10 text-center text-xs text-slate-500 font-mono">
          Last updated: {lastUpdated.toLocaleTimeString('en-IN', { hour12: true })}
        </div>
      )}
    </div>
  );
}
