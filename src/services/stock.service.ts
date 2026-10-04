export const STOCK_API_CONFIG = {
  BASE_URL: "/api/market-indices",
  USE_MOCK_FALLBACK: true 
};

export const INDEX_CATEGORIES = {
  major: ['^NSEI', '^BSESN'],
  broad: ['^NSEI', '^BSESN', '^NSEMDCP50', '^CNXSC', '^CRSLDX'],
  sectoral: ['^NSEBANK', '^CNXIT', '^CNXAUTO', '^CNXPHARMA', '^CNXFMCG', '^CNXMETAL', '^CNXPSUBANK', 'NIFTY_FIN_SERVICE.NS']
};

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  previousClose: number;
  marketState?: string;
  timestamp?: number;
}

export const stockService = {
  async getBatchIndices(symbols: string[] = INDEX_CATEGORIES.major): Promise<Record<string, StockData> | null> {
    try {
      const res = await fetch(`${STOCK_API_CONFIG.BASE_URL}?symbols=${symbols.join(',')}`, {
        signal: AbortSignal.timeout(5000)
      });
      if (!res.ok) throw new Error("API Error");
      return await res.json();
    } catch (error) {
      if (STOCK_API_CONFIG.USE_MOCK_FALLBACK) {
        return this.getMockData(symbols);
      }
      return null;
    }
  },

  getMockData(symbols: string[]) {
    const mock: Record<string, StockData> = {};
    symbols.forEach(sym => {
      let basePrice = 10000;
      if (sym === '^NSEI') basePrice = 24500;
      else if (sym === '^BSESN') basePrice = 80500;
      else if (sym === '^NSEBANK') basePrice = 51200;
      else if (sym === '^NSEMDCP50') basePrice = 14000;
      else if (sym === '^CNXSC') basePrice = 16000;
      else if (sym === '^CRSLDX') basePrice = 22500;
      else if (sym === '^CNXIT') basePrice = 35000;
      else if (sym === '^CNXAUTO') basePrice = 25000;
      else if (sym === '^CNXPHARMA') basePrice = 19000;
      else if (sym === '^CNXFMCG') basePrice = 55000;
      else if (sym === '^CNXMETAL') basePrice = 9000;
      else if (sym === '^CNXPSUBANK') basePrice = 7500;
      else if (sym === 'NIFTY_FIN_SERVICE.NS') basePrice = 23000;

      const fluctuation = (Math.random() - 0.5) * (basePrice * 0.005);
      const currentPrice = basePrice + fluctuation;
      const change = currentPrice - basePrice;
      
      mock[sym] = {
        symbol: sym,
        price: Number(currentPrice.toFixed(2)),
        change: Number(change.toFixed(2)),
        percentChange: Number(((change / basePrice) * 100).toFixed(2)),
        high: basePrice + (basePrice * 0.01),
        low: basePrice - (basePrice * 0.01),
        previousClose: basePrice,
        marketState: 'MOCK',
        timestamp: Date.now()
      };
    });
    return mock;
  }
};
