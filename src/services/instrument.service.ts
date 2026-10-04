import { UnifiedInstrument, MutualFundData, EtfData, MarketSessionStatus, NavSyncResult } from '../types/instruments.ts';

class InstrumentService {
  private baseUrl = '/api/instruments';
  private sessionUrl = '/api/market/session';
  private cache: Map<string, { data: UnifiedInstrument; timestamp: number }> = new Map();

  // Fetch instruments with filtering & pagination
  async getInstruments(params: {
    type?: 'ALL' | 'MUTUAL_FUND' | 'ETF';
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    data: UnifiedInstrument[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    marketSession: MarketSessionStatus;
    syncStatus: {
      lastAmfiSync: string;
      isSyncing: boolean;
    };
  }> {
    const query = new URLSearchParams();
    if (params.type) query.set('type', params.type);
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    try {
      const res = await fetch(`${this.baseUrl}?${query.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch instruments: ${res.statusText}`);
      const json = await res.json();
      
      // Update local cache
      if (json.data && Array.isArray(json.data)) {
        json.data.forEach((item: UnifiedInstrument) => {
          this.cache.set(item.id, { data: item, timestamp: Date.now() });
        });
      }

      return json;
    } catch (e) {
      console.error("InstrumentService.getInstruments Error:", e);
      throw e;
    }
  }

  // Get single instrument (Mutual Fund or ETF)
  async getInstrumentById(id: string): Promise<UnifiedInstrument> {
    const cached = this.cache.get(id);
    const now = Date.now();
    
    // Quick cache hit if less than 10 seconds old
    if (cached && now - cached.timestamp < 10000) {
      return cached.data;
    }

    try {
      const res = await fetch(`${this.baseUrl}/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`Instrument ${id} not found`);
      const data: UnifiedInstrument = await res.json();
      this.cache.set(id, { data, timestamp: now });
      return data;
    } catch (e) {
      console.error(`InstrumentService.getInstrumentById(${id}) Error:`, e);
      if (cached) return cached.data;
      throw e;
    }
  }

  // Get current IST market trading session status
  async getMarketSession(): Promise<MarketSessionStatus> {
    try {
      const res = await fetch(this.sessionUrl);
      if (!res.ok) throw new Error("Market session query failed");
      return await res.json();
    } catch (e) {
      return {
        isOpen: false,
        state: 'CLOSED',
        currentTimeIST: new Date().toLocaleTimeString('en-IN') + ' IST',
        nextOpenTimeIST: 'Next Trading Day 09:15 AM IST',
        isTradingDay: true
      };
    }
  }

  // Trigger manual on-demand AMFI NAV synchronization
  async triggerNavSync(): Promise<{ success: boolean; result: NavSyncResult }> {
    try {
      const res = await fetch(`${this.baseUrl}/sync`, { method: 'POST' });
      if (!res.ok) throw new Error("Sync failed");
      return await res.json();
    } catch (e) {
      console.error("Manual NAV sync error:", e);
      throw e;
    }
  }

  // Check sync status
  async getSyncStatus(): Promise<NavSyncResult> {
    try {
      const res = await fetch(`${this.baseUrl}/sync/status`);
      if (!res.ok) throw new Error("Status query failed");
      return await res.json();
    } catch (e) {
      return {
        totalTracked: 0,
        syncedCount: 0,
        failedCount: 0,
        lastSyncTime: 'Unknown',
        status: 'IDLE'
      };
    }
  }
}

export const instrumentService = new InstrumentService();
