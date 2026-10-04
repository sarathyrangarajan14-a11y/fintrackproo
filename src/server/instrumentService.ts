import { navSyncEngine, POPULAR_MUTUAL_FUNDS } from './navSyncEngine.ts';
import { etfMarketFeedService, POPULAR_ETFS } from './etfMarketFeed.ts';
import { UnifiedInstrument, InstrumentType, MarketSessionStatus } from '../types/instruments.ts';

export class UnifiedInstrumentService {
  // Determine whether an identifier is an ETF or Mutual Fund
  public detectInstrumentType(idOrCode: string): InstrumentType {
    const clean = String(idOrCode).trim().toUpperCase();
    if (clean.endsWith('.NS') || clean.endsWith('.BO') || clean.includes('ETF') || clean.includes('BEES') || POPULAR_ETFS[clean] || POPULAR_ETFS[`${clean}.NS`]) {
      return 'ETF';
    }
    return 'MUTUAL_FUND';
  }

  // Get single instrument by code or ticker
  public async getInstrumentById(id: string): Promise<UnifiedInstrument | null> {
    const cleanId = String(id).trim();
    if (!cleanId) return null;

    const type = this.detectInstrumentType(cleanId);

    if (type === 'ETF') {
      const sym = cleanId.toUpperCase().endsWith('.NS') || cleanId.toUpperCase().endsWith('.BO')
        ? cleanId.toUpperCase()
        : `${cleanId.toUpperCase()}.NS`;
      return await etfMarketFeedService.getEtfQuote(sym);
    } else {
      return await navSyncEngine.getOrSyncScheme(cleanId);
    }
  }

  // List all instruments with filtering, searching, and pagination
  public async getInstruments(options: {
    type?: 'ALL' | 'MUTUAL_FUND' | 'ETF';
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
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
    const { type = 'ALL', category = 'All', search = '', page = 1, limit = 20 } = options;

    const marketSession = etfMarketFeedService.getMarketSessionStatus();
    const syncHealth = navSyncEngine.getSyncStatus();

    let allItems: UnifiedInstrument[] = [];

    // Collect ETFs if requested
    if (type === 'ALL' || type === 'ETF') {
      const etfs = await etfMarketFeedService.getAllEtfs();
      allItems.push(...etfs);
    }

    // Collect Mutual Funds if requested
    if (type === 'ALL' || type === 'MUTUAL_FUND') {
      const popularMfCodes = Object.keys(POPULAR_MUTUAL_FUNDS);
      const mfResults = await Promise.all(
        popularMfCodes.map(code => navSyncEngine.getOrSyncScheme(code))
      );

      mfResults.forEach(res => {
        if (res) allItems.push(res);
      });
    }

    // Apply Search Filter & Dynamic AMFI Search
    if (search && search.trim().length > 0) {
      const q = search.toLowerCase().trim();
      let matched = allItems.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.fundHouse.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.symbol && item.symbol.toLowerCase().includes(q))
      );

      // If user is searching specifically and we want to expand with live MF API results
      if (type === 'ALL' || type === 'MUTUAL_FUND') {
        try {
          const searchTerms = [search.trim()];
          // If searching "Jio BlackRock", also search "JioBlackRock" and individual keywords
          if (search.includes(' ')) {
            searchTerms.push(search.replace(/\s+/g, ''));
            const words = search.split(/\s+/).filter(w => w.length >= 3);
            if (words.length > 0) searchTerms.push(...words);
          }

          const existingCodes = new Set(allItems.map(i => i.code));
          const codesToSync: string[] = [];

          for (const term of searchTerms.slice(0, 3)) {
            const searchRes = await fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(term)}`);
            if (searchRes.ok) {
              const apiSearchResults = (await searchRes.json()) as Array<{ schemeCode: number; schemeName: string }>;
              if (Array.isArray(apiSearchResults)) {
                apiSearchResults.slice(0, 8).forEach(s => {
                  const sc = String(s.schemeCode);
                  if (!existingCodes.has(sc) && !codesToSync.includes(sc)) {
                    codesToSync.push(sc);
                  }
                });
              }
            }
          }

          if (codesToSync.length > 0) {
            const dynamicSchemes = await Promise.all(
              codesToSync.slice(0, 10).map(c => navSyncEngine.getOrSyncScheme(c))
            );

            dynamicSchemes.forEach(sc => {
              if (sc && !existingCodes.has(sc.code)) {
                existingCodes.add(sc.code);
                allItems.push(sc);
                matched.push(sc);
              }
            });
          }
        } catch (err) {
          console.warn('[UnifiedInstrumentService] Dynamic MF search failed:', err);
        }
      }

      allItems = matched;
    }

    // Apply Category Filter
    if (category && category !== 'All') {
      const catLower = category.toLowerCase();
      allItems = allItems.filter(item => {
        if (catLower === 'etf' || catLower === 'etfs') return item.schemeType === 'ETF';
        if (catLower === 'mutual fund' || catLower === 'mutual funds') return item.schemeType === 'MUTUAL_FUND';
        return item.category.toLowerCase().includes(catLower) || item.name.toLowerCase().includes(catLower);
      });
    }

    // Pagination calculations
    const total = allItems.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const startIdx = (currentPage - 1) * limit;
    const paginated = allItems.slice(startIdx, startIdx + limit);

    return {
      data: paginated,
      pagination: {
        total,
        page: currentPage,
        limit,
        totalPages
      },
      marketSession,
      syncStatus: {
        lastAmfiSync: syncHealth.lastSyncTime,
        isSyncing: syncHealth.status === 'SYNCING'
      }
    };
  }
}

export const unifiedInstrumentService = new UnifiedInstrumentService();
