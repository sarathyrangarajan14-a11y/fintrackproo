import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  ArrowUpRight, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  LineChart as LineChartIcon, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  ShieldAlert, 
  Download, 
  ArrowRight, 
  Printer, 
  RefreshCw, 
  Activity, 
  Clock, 
  Layers, 
  Zap, 
  LayoutGrid, 
  Table as TableIcon,
  Sparkles,
  SlidersHorizontal,
  Calculator,
  Lock
} from "lucide-react";
import AdvancedFundChart from "../../components/AdvancedFundChart";
import SchemeDetailsModal from "../../components/SchemeDetailsModal";
import { instrumentService } from "../../services/instrument.service";
import { instamojoService } from "../../services/InstamojoService";
import { auth } from "../../lib/firebase";
import OtpAuthModal from "../../components/OtpAuthModal";
import SipPaymentGatewayModal, { PaymentOrderInfo, PaymentSuccessData } from "../../components/SipPaymentGatewayModal";
import { generateReportPdf } from "../../lib/pdfGenerator";
import { UnifiedInstrument, MutualFundData, EtfData, MarketSessionStatus } from "../../types/instruments";
import InstrumentPriceBadge from "../../components/InstrumentPriceBadge";
import InstrumentCard from "../../components/InstrumentCard";
import { Skeleton, SkeletonCircle } from "../../components/skeletons/SkeletonBase";

const ITEMS_PER_PAGE = 12;

export default function Explore() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get("q") || searchParams.get("scheme") || "";
  
  const [instruments, setInstruments] = useState<UnifiedInstrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [debouncedQuery, setDebouncedQuery] = useState(queryParam);
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Market & Sync Metadata
  const [marketSession, setMarketSession] = useState<MarketSessionStatus | null>(null);
  const [lastAmfiSync, setLastAmfiSync] = useState<string>("Today 11:15 PM IST");
  const [isSyncingNav, setIsSyncingNav] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Modals State
  const [isSipModalOpen, setIsSipModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<UnifiedInstrument | null>(null);
  
  // Payment Gateway Order State
  const [paymentGatewayOrder, setPaymentGatewayOrder] = useState<PaymentOrderInfo | null>(null);
  const [paymentConfirmation, setPaymentConfirmation] = useState<PaymentSuccessData | null>(null);
  const [userToken, setUserToken] = useState<string>('');
  
  // SIP State
  const [sipAmount, setSipAmount] = useState("5000");
  const [sipDate, setSipDate] = useState("5");
  const [investmentType, setInvestmentType] = useState<'sip' | 'lumpsum'>('sip');
  const [kycStatus, setKycStatus] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('client_kyc_status') || 'NOT_STARTED';
    }
    return 'NOT_STARTED';
  });
  const [clientPhone, setClientPhone] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('client_phone') || localStorage.getItem('user_phone') || '';
    }
    return '';
  });
  const [clientName, setClientName] = useState<string>('');
  
  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [watchlist, setWatchlist] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('mf_watchlist') || '[]'); } catch(e) { return []; }
  });

  const toggleWatchlist = (item: UnifiedInstrument) => {
    setWatchlist(prev => {
      const exists = prev.find(f => f.code === item.code || f.schemeCode === item.code);
      let next;
      if (exists) {
        next = prev.filter(f => f.code !== item.code && f.schemeCode !== item.code);
      } else {
        next = [...prev, { schemeCode: item.code, schemeName: item.name, symbol: item.symbol }];
      }
      localStorage.setItem('mf_watchlist', JSON.stringify(next));
      return next;
    });
  };

  const isWatchlisted = (item: UnifiedInstrument) => {
    return watchlist.some(f => f.code === item.code || f.schemeCode === item.code);
  };

  // Sync Search Query Param
  useEffect(() => {
    if (queryParam && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch client profile for KYC status
  useEffect(() => {
    const fetchProfile = async (currentUser?: any) => {
      try {
        const user = currentUser || auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch("/api/client/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const effectiveStatus = data.kycStatus || data.client?.kycStatus || 'NOT_STARTED';
          setKycStatus(effectiveStatus);
          localStorage.setItem('client_kyc_status', effectiveStatus);
          const phone = data.phoneNumber || data.phone || data.client?.phone || data.client?.phoneNumber;
          if (phone) setClientPhone(phone);
          const name = data.fullName || data.name || data.client?.fullName;
          if (name) setClientName(name);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProfile(user);
      }
    });

    let lastFocusFetch = Date.now();
    const handleFocus = () => {
      if (Date.now() - lastFocusFetch > 30000 && auth.currentUser) {
        lastFocusFetch = Date.now();
        fetchProfile(auth.currentUser);
      }
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Fetch market session
  const loadMarketSession = async () => {
    try {
      const session = await instrumentService.getMarketSession();
      setMarketSession(session);
    } catch (e) {
      // Ignored
    }
  };

  // Core Data Fetcher from Unified Instrument Engine
  const loadInstruments = async () => {
    setLoading(true);
    try {
      let typeParam: 'ALL' | 'MUTUAL_FUND' | 'ETF' = 'ALL';
      let catParam = activeCategory;

      if (activeCategory === 'Mutual Funds') {
        typeParam = 'MUTUAL_FUND';
        catParam = 'All';
      } else if (activeCategory === 'ETFs (Live NSE)') {
        typeParam = 'ETF';
        catParam = 'All';
      } else if (activeCategory === 'Watchlist') {
        typeParam = 'ALL';
        catParam = 'All';
      }

      const res = await instrumentService.getInstruments({
        type: typeParam,
        category: catParam,
        search: debouncedQuery,
        page: currentPage,
        limit: ITEMS_PER_PAGE
      });

      let items = res.data;

      if (activeCategory === 'Watchlist') {
        items = items.filter(it => isWatchlisted(it));
      }

      setInstruments(items);
      setTotalPages(res.pagination.totalPages || 1);
      setTotalCount(res.pagination.total || items.length);
      if (res.marketSession) setMarketSession(res.marketSession);
      if (res.syncStatus?.lastAmfiSync) setLastAmfiSync(res.syncStatus.lastAmfiSync);
    } catch (err: any) {
      console.error("Failed to load instruments:", err);
      setNotification({
        message: "Failed to connect to Pricing & NAV service. Showing cached instruments.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketSession();
    const interval = setInterval(loadMarketSession, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadInstruments();
  }, [debouncedQuery, activeCategory, currentPage]);

  // Live polling for ETF price updates during active market sessions
  useEffect(() => {
    if (!marketSession?.isOpen) return;

    const pollInterval = setInterval(() => {
      // Refresh without full skeleton loading state
      let typeParam: 'ALL' | 'MUTUAL_FUND' | 'ETF' = activeCategory === 'Mutual Funds' ? 'MUTUAL_FUND' : activeCategory === 'ETFs (Live NSE)' ? 'ETF' : 'ALL';
      instrumentService.getInstruments({
        type: typeParam,
        category: activeCategory === 'Mutual Funds' || activeCategory === 'ETFs (Live NSE)' ? 'All' : activeCategory,
        search: debouncedQuery,
        page: currentPage,
        limit: ITEMS_PER_PAGE
      }).then(res => {
        if (res.data) setInstruments(res.data);
        if (res.marketSession) setMarketSession(res.marketSession);
      }).catch(() => {});
    }, 12000); // 12 second refresh during market hours

    return () => clearInterval(pollInterval);
  }, [marketSession?.isOpen, debouncedQuery, activeCategory, currentPage]);

  // Trigger Manual On-Demand AMFI NAV Sync
  const handleTriggerNavSync = async () => {
    setIsSyncingNav(true);
    try {
      const res = await instrumentService.triggerNavSync();
      setNotification({
        message: `NAV update complete! Synced ${res.result.syncedCount} mutual fund schemes.`,
        type: 'success'
      });
      setLastAmfiSync(res.result.lastSyncTime);
      await loadInstruments();
    } catch (e: any) {
      setNotification({
        message: e?.message || "Failed to update NAVs.",
        type: 'error'
      });
    } finally {
      setIsSyncingNav(false);
    }
  };

  const handleInvestClick = async (instrument: UnifiedInstrument) => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }
    
    // Live verification check if state is not already VERIFIED
    let currentStatus = kycStatus;
    if (currentStatus !== 'VERIFIED') {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch("/api/client/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const freshStatus = data.kycStatus || data.client?.kycStatus || 'NOT_STARTED';
          currentStatus = freshStatus;
          setKycStatus(freshStatus);
          localStorage.setItem('client_kyc_status', freshStatus);
        }
      } catch (err) {
        console.warn("Live KYC check error:", err);
      }
    }

    if (currentStatus !== 'VERIFIED') {
      navigate('/kyc');
      return;
    }
    openSipModal(instrument);
  };

  const openSipModal = (instrument: UnifiedInstrument) => {
    setSelectedInstrument(instrument);
    setIsSipModalOpen(true);
  };
  
  const openChartModal = (instrument: UnifiedInstrument) => {
    setSelectedInstrument(instrument);
    setIsChartModalOpen(true);
  };

  const openDetailsModal = (instrument: UnifiedInstrument) => {
    navigate(`/funds/${instrument.code}`);
  };

  const handleStartSip = (e: any) => {
    e.preventDefault();
    setIsOtpModalOpen(true);
  };

  const handleSipOtpVerified = async (otp: string, verificationToken?: string, verifiedPhone?: string) => {
    if (!selectedInstrument) return;
    try {
      const token = await auth.currentUser?.getIdToken() || 'mock-token';
      setUserToken(token);
      
      const phoneToUse = verifiedPhone || clientPhone || auth.currentUser?.phoneNumber || localStorage.getItem('client_phone') || "9876543210";
      if (verifiedPhone) {
        localStorage.setItem('client_phone', verifiedPhone);
        setClientPhone(verifiedPhone);
      }

      const orderData = await instamojoService.createSipOrder(
        selectedInstrument.code,
        parseFloat(sipAmount),
        parseInt(sipDate),
        token,
        otp,
        verificationToken,
        phoneToUse
      );

      const { order_id, payment_url, sip_no, txn_no, is_mock } = orderData;

      setIsOtpModalOpen(false);
      setIsSipModalOpen(false);

      const amountVal = parseFloat(sipAmount);
      const schemeNameVal = selectedInstrument.name;

      setPaymentGatewayOrder({
        orderId: order_id,
        sipNo: sip_no,
        txnNo: txn_no,
        amount: amountVal,
        schemeName: schemeNameVal,
        schemeCode: selectedInstrument.code,
        sipDate: parseInt(sipDate),
        paymentUrl: payment_url,
        isMock: is_mock,
        clientName: clientName || auth.currentUser?.displayName || "Investor",
        clientEmail: auth.currentUser?.email || "",
        clientPhone: clientPhone || auth.currentUser?.phoneNumber || "9876543210"
      });
    } catch (error: any) {
      console.error(error);
      setNotification({
        message: error.message || "Failed to initialize order.",
        type: 'error'
      });
    }
  };

  if (paymentConfirmation) {
    return (
      <div className="flex-1 p-4 md:p-8 relative z-10 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-md w-full bg-[#0b1120]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl space-y-6 text-white animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-3">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold">SIP Mandate Registered</h2>
            <p className="text-xs text-slate-400">
              Your investment instruction has been processed securely with official exchange registration.
            </p>
          </div>

          <div className="border-t border-b border-white/5 py-4 space-y-3.5">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Scheme Selected</span>
              <div className="text-sm font-bold text-white truncate">{paymentConfirmation.schemeName}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">SIP Reg No</span>
                <div className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded w-fit uppercase">{paymentConfirmation.sipNo}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Tx Ref No</span>
                <div className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded w-fit uppercase">{paymentConfirmation.txnNo}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Amount (INR)</span>
                <div className="text-base font-bold text-white">₹{paymentConfirmation.amount.toLocaleString('en-IN')}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Frequency</span>
                <div className="text-sm font-semibold text-slate-300">Monthly Auto-Debit</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Authorized Date</span>
                <div className="text-xs font-semibold text-slate-300">{paymentConfirmation.executionDate}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Next Debit Date</span>
                <div className="text-xs font-bold text-emerald-400">{paymentConfirmation.nextDebitDate}</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-[10px] text-slate-400 leading-relaxed space-y-2">
            <p className="font-bold text-amber-400/90 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              AMFI &amp; BSE Star MF Mandate Notice
            </p>
            <p>
              Under SEBI guidelines, auto-debits will execute on your specified day of the month. You can pause or terminate this instruction up to 5 business days prior to debit.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                const doc = generateReportPdf(
                  clientName || "Investor",
                  "SIP Auto-Debit Mandate Registration Receipt",
                  [
                    { Field: "Investment Scheme", Details: paymentConfirmation.schemeName },
                    { Field: "SIP Registration No", Details: paymentConfirmation.sipNo },
                    { Field: "Transaction Ref No", Details: paymentConfirmation.txnNo },
                    { Field: "Payment Reference ID", Details: paymentConfirmation.paymentId || "PAY_CONFIRMED" },
                    { Field: "Amount Paid", Details: `₹${paymentConfirmation.amount.toLocaleString('en-IN')}` },
                    { Field: "SIP Frequency", Details: "Monthly Auto-Debit" },
                    { Field: "Registration Date", Details: paymentConfirmation.executionDate },
                    { Field: "Next Scheduled Debit", Details: paymentConfirmation.nextDebitDate },
                    { Field: "Mandate Status", Details: "ACTIVE & VERIFIED" }
                  ],
                  {
                    email: auth.currentUser?.email || "",
                    phone: clientPhone,
                    period: "1st Installment & NACH Registration"
                  }
                );
                doc.save(`SIP_Mandate_Receipt_${paymentConfirmation.sipNo}.pdf`);
              }}
              className="flex-1 py-3.5 px-4 text-xs font-bold rounded-xl text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Receipt (PDF)
            </button>
            <button
              onClick={() => {
                setPaymentConfirmation(null);
                navigate("/dashboard");
              }}
              className="flex-1 py-3.5 px-4 text-xs font-bold rounded-xl text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Market Session & NAV Synchronization Banner */}
        <div className="bg-[#0b1120]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Market Hours Status */}
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-xl">
              <span className={`w-2.5 h-2.5 rounded-full ${marketSession?.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
                  NSE / BSE Market
                </span>
                <span className="text-xs font-bold text-white">
                  {marketSession?.isOpen ? 'Trading Live (09:15 - 15:30 IST)' : 'Market Closed'}
                </span>
              </div>
            </div>

            {/* Daily NAV Status */}
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
                  Daily NAV Sync
                </span>
                <span className="text-xs font-bold text-sky-300">
                  {lastAmfiSync}
                </span>
              </div>
            </div>
          </div>

          {/* Sync Trigger & View Mode Switcher */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handleTriggerNavSync}
              disabled={isSyncingNav}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-xs font-bold text-sky-300 transition-all cursor-pointer disabled:opacity-50"
              title="Update mutual fund Net Asset Values (NAVs)"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNav ? 'animate-spin' : ''}`} />
              {isSyncingNav ? 'Updating NAVs...' : 'Update NAVs'}
            </button>

            <div className="flex items-center bg-white/[0.04] border border-white/10 p-0.5 rounded-xl">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Instruments</h1>
            <p className="text-slate-400 text-sm mt-1">
              Explore thousands of mutual funds and exchange-traded funds with daily updated NAVs and market performance.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search scheme, ETF ticker, or AMC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-[#0b1120]/90 pl-10 pr-4 text-base md:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Categories / Instrument Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            "All", 
            "Mutual Funds", 
            "ETFs (Live NSE)", 
            "Large Cap", 
            "Mid Cap", 
            "Small Cap", 
            "Index Funds", 
            "Commodities", 
            "Debt", 
            "Watchlist"
          ].map((cat, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(1);
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeCategory === cat 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm" 
                  : "bg-white/[0.03] border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat === 'ETFs (Live NSE)' && <Zap className="w-3 h-3 inline mr-1 text-emerald-400" />}
              {cat === 'Mutual Funds' && <Layers className="w-3 h-3 inline mr-1 text-sky-400" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Notifications */}
        {notification && (
          <div className={`p-4 rounded-xl flex items-center justify-between border ${notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
            <span className="text-xs font-bold">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="p-1 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <SkeletonCircle size="w-10 h-10" />
                        <div className="space-y-1.5">
                          <Skeleton className="w-36 h-4 rounded-md" />
                          <Skeleton className="w-24 h-3 rounded-md" />
                        </div>
                      </div>
                      <Skeleton className="w-16 h-6 rounded-full" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5">
                      <div className="space-y-1"><Skeleton className="w-10 h-2.5 rounded" /><Skeleton className="w-14 h-4 rounded" /></div>
                      <div className="space-y-1"><Skeleton className="w-10 h-2.5 rounded" /><Skeleton className="w-14 h-4 rounded" /></div>
                      <div className="space-y-1"><Skeleton className="w-10 h-2.5 rounded" /><Skeleton className="w-14 h-4 rounded" /></div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Skeleton className="flex-1 h-9 rounded-xl" />
                      <Skeleton className="w-9 h-9 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : instruments.length === 0 ? (
              <div className="bg-[#0b1120]/80 border border-white/10 rounded-2xl p-12 text-center text-slate-400">
                <p className="text-base font-bold text-white mb-1">No instruments found</p>
                <p className="text-xs text-slate-500">Try searching for a different fund name, AMC, or ETF symbol.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instruments.map((instrument) => (
                  <InstrumentCard
                    key={instrument.id}
                    instrument={instrument}
                    onSelect={handleInvestClick}
                    onOpenChart={openChartModal}
                    onOpenDetails={openDetailsModal}
                    isWatchlisted={isWatchlisted(instrument)}
                    onToggleWatchlist={toggleWatchlist}
                    kycStatus={kycStatus}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="w-full bg-[#0b1120]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-white/[0.02] border-b border-white/5 text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-extrabold tracking-widest uppercase text-[11px]">Instrument / Scheme</th>
                    <th className="px-4 py-4 font-extrabold tracking-widest uppercase text-[11px]">Type</th>
                    <th className="px-6 py-4 font-extrabold tracking-widest uppercase text-[11px] text-right">Price / NAV</th>
                    <th className="px-6 py-4 font-extrabold tracking-widest uppercase text-[11px] text-right">1Y Return</th>
                    <th className="px-6 py-4 font-extrabold tracking-widest uppercase text-[11px] text-right">3Y Return</th>
                    <th className="px-6 py-4 font-extrabold tracking-widest uppercase text-[11px] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    [...Array(6)].map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <SkeletonCircle size="w-7 h-7" />
                            <div className="space-y-1.5">
                              <Skeleton className="w-52 h-4 rounded-md" />
                              <Skeleton className="w-28 h-3 rounded-md" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4"><Skeleton className="w-20 h-5 rounded-full" /></td>
                        <td className="px-6 py-4 text-right"><Skeleton className="w-16 h-4 rounded ml-auto" /></td>
                        <td className="px-6 py-4 text-right"><Skeleton className="w-14 h-4 rounded ml-auto" /></td>
                        <td className="px-6 py-4 text-right"><Skeleton className="w-14 h-4 rounded ml-auto" /></td>
                        <td className="px-6 py-4 text-right"><Skeleton className="w-20 h-8 rounded-xl ml-auto" /></td>
                      </tr>
                    ))
                  ) : instruments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-slate-500 font-bold">
                        No instruments found matching your search.
                      </td>
                    </tr>
                  ) : (
                    instruments.map((item) => {
                      const isEtf = item.schemeType === 'ETF';
                      return (
                        <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                          {/* Name & Fund House */}
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2.5">
                              <button
                                onClick={() => toggleWatchlist(item)}
                                className="mt-0.5 text-slate-500 hover:text-amber-400 transition-colors"
                              >
                                <Star className={`w-4 h-4 ${isWatchlisted(item) ? 'fill-amber-400 text-amber-400' : ''}`} />
                              </button>
                              <div>
                                <div className="font-bold text-white text-sm max-w-sm sm:max-w-md truncate group-hover:text-emerald-300 transition-colors" title={item.name}>
                                  {item.name}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                                  <span>{item.fundHouse}</span>
                                  {item.symbol && <span className="font-mono text-[10px] text-slate-500">({item.symbol})</span>}
                                  <span className="text-slate-600">•</span>
                                  <span className="text-slate-400">{item.category}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Instrument Type Badge */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span 
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                                isEtf 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                  : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                              }`}
                            >
                              {isEtf ? <Zap className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
                              {isEtf ? 'NSE ETF' : 'Mutual Fund'}
                            </span>
                          </td>

                          {/* Dedicated Pricing Badge (NAV for MF vs LTP for ETF) */}
                          <td className="px-6 py-4 text-right">
                            <InstrumentPriceBadge instrument={item} size="md" showDetails={true} />
                          </td>

                          {/* 1Y Return */}
                          <td className="px-6 py-4 text-right">
                            <div className="font-mono font-bold text-emerald-400 text-sm flex items-center justify-end">
                              <TrendingUp className="h-3.5 w-3.5 mr-1" />
                              +{item.returns?.return1y || 16.5}%
                            </div>
                          </td>

                          {/* 3Y Return */}
                          <td className="px-6 py-4 text-right font-mono font-bold text-emerald-400 text-sm">
                            +{item.returns?.return3y || 18.2}%
                          </td>

                          {/* Action Buttons */}
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => openChartModal(item)}
                                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                              >
                                <LineChartIcon className="h-3.5 w-3.5 mr-1 text-slate-400" /> Chart
                              </button>
                              <button 
                                onClick={() => openDetailsModal(item)}
                                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                              >
                                <Layers className="h-3.5 w-3.5 mr-1 text-slate-400" /> Details
                              </button>
                              <button 
                                onClick={() => handleInvestClick(item)}
                                className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                                  kycStatus === 'VERIFIED' 
                                    ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                                    : 'bg-slate-800/90 text-slate-400 border border-slate-700 hover:border-amber-500/50 hover:text-amber-300 opacity-80'
                                }`}
                                title={kycStatus === 'VERIFIED' ? "Invest in this fund" : "KYC Verification Required to Invest"}
                              >
                                {kycStatus === 'VERIFIED' ? (
                                  <>
                                    <span>Invest</span> <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                                  </>
                                ) : kycStatus === 'SUBMITTED' || kycStatus === 'PENDING' ? (
                                  <>
                                    <Clock className="mr-1 h-3.5 w-3.5 text-blue-400" />
                                    <span>KYC Under Review</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="mr-1 h-3.5 w-3.5 text-amber-400" />
                                    <span>Invest (KYC Required)</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 pt-4 text-xs font-bold text-slate-400">
            <div>
              Showing {instruments.length} of {totalCount} instruments
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-colors cursor-pointer disabled:cursor-not-allowed min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-colors cursor-pointer disabled:cursor-not-allowed min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Financial Calculators Section */}
        <div className="pt-12 mt-12 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Financial &amp; Investment Calculators</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { label: 'SIP Calculator', path: '/calculators/sip' },
              { label: 'Lumpsum Calculator', path: '/calculators/lumpsum' },
              { label: 'SWP Calculator', path: '/calculators/swp' },
              { label: 'MF Calculator', path: '/calculators/mf' },
              { label: 'Step-Up SIP Calculator', path: '/calculators/stepup' },
              { label: 'Brokerage Calculator', path: '/calculators/brokerage' },
              { label: 'Margin Calculator', path: '/calculators/margin' },
              { label: 'Stock Average Calculator', path: '/calculators/stock-average' },
              { label: 'SSY Calculator', path: '/calculators/ssy' },
              { label: 'PPF Calculator', path: '/calculators/ppf' },
              { label: 'RD Calculator', path: '/calculators/rd' },
              { label: 'FD Calculator', path: '/calculators/fd' },
              { label: 'EPF Calculator', path: '/calculators/epf' },
              { label: 'Income Tax Calculator', path: '/calculators/tax' },
              { label: 'GST Calculator', path: '/calculators/gst' },
              { label: 'HRA Calculator', path: '/calculators/hra' },
              { label: 'Salary Calculator', path: '/calculators/salary' },
              { label: 'TDS Calculator', path: '/calculators/tds' },
              { label: 'EMI Calculator', path: '/calculators/emi' },
              { label: 'Car Loan EMI Calculator', path: '/calculators/car-loan' },
              { label: 'Home Loan EMI Calculator', path: '/calculators/home-loan' },
              { label: 'ROI Calculator', path: '/calculators/roi' }
            ].map((calc) => (
              <Link
                key={calc.path}
                to={calc.path}
                className="bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-400 px-4 py-3 rounded-xl text-xs font-bold text-slate-300 text-center transition-all cursor-pointer shadow-sm hover:shadow-[0_4px_15px_rgba(16,185,129,0.05)]"
              >
                {calc.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* SIP & Investment Setup Modal */}
      {isSipModalOpen && selectedInstrument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
          <div className="relative w-full max-w-3xl md:max-w-4xl rounded-2xl sm:rounded-3xl bg-[#0b1120] border border-white/10 p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <button 
              onClick={() => setIsSipModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white z-10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
              {/* Left Column: Instrument Overview */}
              <div className="md:col-span-5 bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${selectedInstrument.schemeType === 'ETF' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-sky-500/10 text-sky-400 border-sky-500/30'}`}>
                      {selectedInstrument.schemeType === 'ETF' ? 'NSE ETF' : 'Mutual Fund'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium truncate">{selectedInstrument.category}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">{selectedInstrument.name}</h2>
                  <p className="text-xs text-slate-400 mt-1 truncate">{selectedInstrument.fundHouse}</p>
                </div>

                {/* Price Preview */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      {selectedInstrument.schemeType === 'ETF' ? 'Current LTP' : 'Latest NAV'}
                    </span>
                    <span className="text-lg font-mono font-extrabold text-white">
                      ₹{selectedInstrument.schemeType === 'ETF' 
                        ? (selectedInstrument as EtfData).ltp.toFixed(2)
                        : (selectedInstrument as MutualFundData).currentNav.toFixed(4)}
                    </span>
                  </div>
                  <InstrumentPriceBadge instrument={selectedInstrument} size="sm" showDetails={false} />
                </div>

                <div className="text-[11px] text-slate-400 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-2.5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
                  <span>Direct Plan • Zero Brokerage • BSE StarMF Verified</span>
                </div>
              </div>

              {/* Right Column: Investment Form */}
              <div className="md:col-span-7">
                {/* Investment Type Selector */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setInvestmentType('sip')}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      investmentType === 'sip'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    Monthly SIP (Auto-Debit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvestmentType('lumpsum')}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      investmentType === 'lumpsum'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    One-Time (Lumpsum)
                  </button>
                </div>

                <form onSubmit={handleStartSip} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                      Investment Amount (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={sipAmount}
                        onChange={(e) => setSipAmount(e.target.value)}
                        min="500"
                        step="500"
                        required
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {["1000", "2500", "5000", "10000", "25000"].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setSipAmount(amt)}
                          className="flex-1 py-1 rounded-lg bg-white/[0.03] hover:bg-white/10 text-[10px] font-mono text-slate-300 border border-white/5 cursor-pointer text-center"
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {investmentType === 'sip' && (
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                        Monthly Auto-Debit Day
                      </label>
                      <select
                        value={sipDate}
                        onChange={(e) => setSipDate(e.target.value)}
                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 focus:outline-none"
                      >
                        {[1, 5, 10, 15, 20, 25, 28].map(day => (
                          <option key={day} value={day}>{day}th of every month</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] mt-3 cursor-pointer"
                  >
                    Proceed to 2FA Authorization &amp; Payment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Fund / ETF Chart Modal */}
      {isChartModalOpen && selectedInstrument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0b1120] border border-white/15 rounded-[32px] p-6 md:p-8 w-full max-w-5xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative max-h-[95vh] overflow-y-auto">
            <button 
              onClick={() => setIsChartModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors z-10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <AdvancedFundChart
              schemeCode={selectedInstrument.code}
              schemeName={selectedInstrument.name}
              category={selectedInstrument.category}
              fundHouse={selectedInstrument.fundHouse}
              initialTimeframe="1Y"
              isModal={true}
              onClose={() => setIsChartModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Scheme Details & Strategic Holdings Modal */}
      {isDetailsModalOpen && selectedInstrument && (
        <SchemeDetailsModal
          instrument={selectedInstrument}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {/* 2FA OTP Modal */}
      {isOtpModalOpen && selectedInstrument && (
        <OtpAuthModal
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          onVerified={handleSipOtpVerified}
          phone={clientPhone || auth.currentUser?.phoneNumber || ""}
          isPhoneLocked={true}
          title="Verify Investment Authorization"
          subtitle={`Authorize ₹${parseFloat(sipAmount).toLocaleString('en-IN')} ${investmentType === 'sip' ? 'Monthly SIP' : 'Lumpsum'} in ${selectedInstrument.name}`}
          clientName={clientName || auth.currentUser?.displayName || "Investor"}
          actionSummary={[
            { label: "Instrument", value: selectedInstrument.name },
            { label: "Amount", value: `₹${parseFloat(sipAmount).toLocaleString('en-IN')}` },
            { label: "Type", value: investmentType === 'sip' ? `Monthly SIP (Every ${sipDate}th)` : 'One-Time Lumpsum' }
          ]}
          actionButtonText="Authorize & Proceed to Pay"
          badgeVariant="emerald"
        />
      )}

      {/* Sip Payment Gateway Modal */}
      {paymentGatewayOrder && (
        <SipPaymentGatewayModal
          orderInfo={paymentGatewayOrder}
          onClose={() => setPaymentGatewayOrder(null)}
          onPaymentSuccess={(data) => {
            setPaymentGatewayOrder(null);
            setPaymentConfirmation(data);
          }}
          token={userToken}
        />
      )}
    </div>
  );
}
