import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton";
import MarketIndicesSidebar from "../../components/MarketIndicesSidebar";
import { auth } from "../../lib/firebase";
import RedeemModal from "../../components/RedeemModal";
import StopSipModal from "../../components/StopSipModal";
import SkipSipModal from "../../components/SkipSipModal";
import EditSipModal from "../../components/EditSipModal";
import OtpAuthModal from "../../components/OtpAuthModal";
import TransactionHistory from "../../components/TransactionHistory";
import { 
  MoreVertical, 
  RotateCcw, 
  FastForward, 
  Ban, 
  Clock, 
  Edit3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Plus, 
  Wallet, 
  CheckCircle2, 
  Activity, 
  Sparkles, 
  Radio, 
  RefreshCw,
  LineChart as LineChartIcon,
  Layers,
  Mail,
  ArrowRight,
  Lock,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  X
} from "lucide-react";
import { mfapiService, LiveNavData } from "../../services/mfapi.service";
import AdvancedFundChart from "../../components/AdvancedFundChart";
import ExpenseTracker from "../../components/ExpenseTracker";

function MarketClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden sm:flex flex-col text-right px-4 py-2 bg-white/[0.03] border border-white/10 rounded-2xl">
      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono flex items-center justify-end gap-1">
        <Clock className="w-3 h-3 text-indigo-400" /> Market Clock
      </span>
      <span className="text-sm font-mono font-bold text-white tracking-wide">
        {time} <span className="text-[10px] text-slate-400 font-sans">IST</span>
      </span>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [liveTicks, setLiveTicks] = useState<Map<string, LiveNavData>>(new Map());
  const [lastTickTime, setLastTickTime] = useState<string>(new Date().toLocaleTimeString('en-IN'));
  const [kycStatus, setKycStatus] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('client_kyc_status') || 'NOT_STARTED';
    }
    return 'NOT_STARTED';
  });
  const [kycRejectionReason, setKycRejectionReason] = useState<string>('');
  const [showKycMandatoryModal, setShowKycMandatoryModal] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const status = localStorage.getItem('client_kyc_status') || 'NOT_STARTED';
      return status !== 'VERIFIED';
    }
    return true;
  });
  const [pendingSips, setPendingSips] = useState<any[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [redeemModalFund, setRedeemModalFund] = useState<any>(null);
  const [stopSipModalSip, setStopSipModalSip] = useState<any>(null);
  const [skipSipModalSip, setSkipSipModalSip] = useState<any>(null);
  const [editSipModalSip, setEditSipModalSip] = useState<any>(null);
  const [editOtpData, setEditOtpData] = useState<{ sip: any; amount: number; sipDate: number } | null>(null);
  const [activeSips, setActiveSips] = useState<any[]>([]);
  const [clientProposals, setClientProposals] = useState<any[]>([]);
  const [clientPhone, setClientPhone] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('client_phone') || localStorage.getItem('user_phone') || '';
    }
    return '';
  });
  const [clientName, setClientName] = useState<string>('');
  const [selectedChartScheme, setSelectedChartScheme] = useState<{ schemeCode: string | number; schemeName: string; category?: string }>({
    schemeCode: "120503",
    schemeName: "Mirae Asset Large & Midcap Fund - Direct Plan",
    category: "Large & Mid Cap Fund"
  });
  const user = auth.currentUser;

  const toggleMenu = (index: number) => {
    if (activeMenuId === index) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(index);
    }
  };

  const handleRedeemConfirm = async (type: string, amount: string, otp?: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/client/portfolio/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ schemeCode: redeemModalFund.schemeCode, type, amount, otp })
      });
      if (res.ok) {
        // modal handles success display
      }
    } catch(e) {
      console.error(e);
      throw e;
    }
  };

  const handleStopSipConfirm = async (sipId: number, otp?: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/client/sip/${sipId}/stop`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ otp })
      });
      if (res.ok) {
        setStopSipModalSip(null);
        window.location.reload();
      }
    } catch(e) {
      console.error(e);
      throw e;
    }
  };

  const handleSkipSipConfirm = async (sipId: number, otp?: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/client/sip/${sipId}/skip`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ otp })
      });
      if (res.ok) {
        setSkipSipModalSip(null);
        window.location.reload();
      }
    } catch(e) {
      console.error(e);
      throw e;
    }
  };

  const handleEditSipProceedToOtp = (updatedData: { amount: number; sipDate: number }) => {
    if (!editSipModalSip) return;
    setEditOtpData({
      sip: editSipModalSip,
      amount: updatedData.amount,
      sipDate: updatedData.sipDate
    });
    setEditSipModalSip(null);
  };

  const handleEditSipOtpVerified = async (otp: string) => {
    if (!editOtpData) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/client/sip/${editOtpData.sip.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: editOtpData.amount,
          date: editOtpData.sipDate,
          otp
        })
      });
      if (res.ok) {
        setEditOtpData(null);
        window.location.reload();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to modify SIP mandate');
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // 1. Fetch User Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch("/api/client/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          
          if (!data.fullName || !data.email || !data.phoneNumber || data.email.includes('@mobile.client') || data.email.includes('@fintrackpro.client')) {
             window.location.href = '/profile-setup';
             return;
          }

          const effective = data.kycStatus || data.client?.kycStatus || 'NOT_STARTED';
          setKycStatus(effective);
          localStorage.setItem('client_kyc_status', effective);
          setKycRejectionReason(data.kycRejectionReason || '');
          if (data.phone || data.mobile || data.phoneNumber) {
            setClientPhone(data.phone || data.mobile || data.phoneNumber);
          }
          if (data.fullName || data.name) {
            setClientName(data.fullName || data.name);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    if (user) {
      fetchProfile();
      let lastFocusFetch = Date.now();
      const onFocus = () => {
        if (Date.now() - lastFocusFetch > 30000) {
          lastFocusFetch = Date.now();
          fetchProfile();
        }
      };
      window.addEventListener('focus', onFocus);
      return () => window.removeEventListener('focus', onFocus);
    }
  }, [user]);

  // 2. Fetch Initial Portfolio & SIPs
  const fetchDashboardData = async () => {
    try {
      const token = await user?.getIdToken();
      const res = await fetch("/api/client/portfolio", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const rawPortfolio = await res.json();
        
        // Fetch official AMFI NAV for each holding
        const enriched = await Promise.all(rawPortfolio.map(async (item: any) => {
          const rawPrice = Number(item.averagePrice);
          let latestNav = (!isNaN(rawPrice) && rawPrice > 0) ? rawPrice : 100.0;
          let schemeCategory = 'Mutual Fund';
          let oneDayChangePct = 0;
          let officialName = item.schemeName;

          try {
            const navData = await mfapiService.getLatestNAV(item.schemeCode);
            if (navData && navData.nav) {
              const parsed = parseFloat(navData.nav);
              if (!isNaN(parsed) && parsed > 0) {
                latestNav = parsed;
              }
              oneDayChangePct = (!isNaN(Number(navData.oneDayChangePct))) ? Number(navData.oneDayChangePct) : 0;
              if (navData.meta?.scheme_category) schemeCategory = navData.meta.scheme_category;
              if (navData.meta?.scheme_name) officialName = navData.meta.scheme_name;
            }
          } catch (e) {
            console.error("Failed to fetch NAV for", item.schemeCode);
          }

          // Register scheme for real-time live market ticks
          mfapiService.registerForLiveTicks(item.schemeCode, officialName);

          return {
            ...item,
            schemeName: officialName,
            baseNav: latestNav,
            nav: latestNav,
            oneDayChangePct,
            schemeCategory
          };
        }));
        
        setPortfolios(enriched);
        if (enriched.length > 0) {
          setSelectedChartScheme({
            schemeCode: enriched[0].schemeCode,
            schemeName: enriched[0].schemeName,
            category: enriched[0].schemeCategory || "Equity Mutual Fund"
          });
        }
      }

      const sipRes = await fetch("/api/client/sips", { headers: { Authorization: `Bearer ${token}` } });
      if (sipRes.ok) {
        const sipData = await sipRes.json();
        setPendingSips(sipData.filter((s: any) => s.status === 'PENDING'));
        setActiveSips(sipData.filter((s: any) => s.status === 'ACTIVE'));
      }

      // Fetch active proposals for this client only if email exists
      try {
        const userEmail = user?.email || localStorage.getItem('user_email') || '';
        if (userEmail) {
          const propRes = await fetch(`/api/client/proposals?email=${encodeURIComponent(userEmail)}`);
          if (propRes.ok) {
            const propData = await propRes.json();
            if (propData.success && Array.isArray(propData.proposals)) {
              setClientProposals(propData.proposals);
            }
          }
        } else {
          setClientProposals([]);
        }
      } catch (propErr) {
        console.warn("Could not load client proposals:", propErr);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // 3. Subscribe to Real-Time AMFI Market Tick Engine (Second-by-Second)
  useEffect(() => {
    const unsubscribe = mfapiService.subscribe((ticks) => {
      setLiveTicks(new Map(ticks));
      setLastTickTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    });
    return () => unsubscribe();
  }, []);

  // 4. Compute Real-Time Dynamic Portfolio Valuations & Returns
  const dynamicPortfolio = useMemo(() => {
    return portfolios.map((item) => {
      const liveData = liveTicks.get(String(item.schemeCode));
      const liveNav = liveData ? Number(liveData.nav) : NaN;
      const itemNav = Number(item.nav);
      const itemBase = Number(item.baseNav);
      const itemPrice = Number(item.averagePrice);

      const currentNav = (!isNaN(liveNav) && liveNav > 0)
        ? liveNav
        : (!isNaN(itemNav) && itemNav > 0)
          ? itemNav
          : (!isNaN(itemBase) && itemBase > 0)
            ? itemBase
            : (!isNaN(itemPrice) && itemPrice > 0)
              ? itemPrice
              : 100.0;

      const units = Number(item.units) || 0;
      const invested = Number(item.investedAmount) || 0;
      const currentValue = units * currentNav;
      const totalGain = currentValue - invested;
      const returnPct = invested > 0 ? (totalGain / invested) * 100 : 0;
      const intradayChangePct = liveData ? (Number(liveData.intradayChangePct) || 0) : (Number(item.oneDayChangePct) || 0);

      return {
        ...item,
        currentNav,
        currentValue,
        totalGain,
        returnPct,
        intradayChangePct
      };
    });
  }, [portfolios, liveTicks]);

  const totalInvested = useMemo(() => {
    return dynamicPortfolio.reduce((sum, item) => sum + (Number(item.investedAmount) || 0), 0);
  }, [dynamicPortfolio]);

  const totalCurrentValue = useMemo(() => {
    return dynamicPortfolio.reduce((sum, item) => sum + (item.currentValue || 0), 0);
  }, [dynamicPortfolio]);

  const totalReturns = totalCurrentValue - totalInvested;
  const totalReturnPct = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
  const isPositiveReturns = totalReturns >= 0;

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <div className="flex-1 p-4 md:p-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header with Real-Time AMFI Market Pulse */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-white tracking-tight">Wealth Control</h1>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Market Feed
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Live Portfolio Tracking • Daily NAV & Market Updates
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <MarketClock />
              <button 
                onClick={async () => {
                  let current = kycStatus;
                  if (current !== 'VERIFIED' && user) {
                    try {
                      const token = await user.getIdToken();
                      const res = await fetch("/api/client/profile", {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      if (res.ok) {
                        const data = await res.json();
                        const eff = data.kycStatus || data.client?.kycStatus || 'NOT_STARTED';
                        current = eff;
                        setKycStatus(eff);
                        localStorage.setItem('client_kyc_status', eff);
                      }
                    } catch(e) {}
                  }

                  if (current !== 'VERIFIED') {
                    setShowKycMandatoryModal(true);
                  } else {
                    window.location.href = '/explore';
                  }
                }}
                className={`inline-flex items-center justify-center rounded-2xl px-6 py-3.5 font-bold transition-all shadow-sm cursor-pointer ${
                  kycStatus === 'VERIFIED'
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                    : 'bg-slate-800/90 text-slate-400 border border-slate-700/80 hover:border-amber-500/50 hover:text-amber-300 opacity-80'
                }`}
                title={kycStatus === 'VERIFIED' ? "Explore funds to invest" : "Complete KYC to unlock investing"}
              >
                {kycStatus === 'VERIFIED' ? (
                  <>
                    <Plus className="mr-2 h-5 w-5" /> Invest More
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4 text-amber-400" /> Invest (KYC Required)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Persistent KYC Regulatory Compliance Status Banner */}
          {kycStatus !== 'VERIFIED' && (
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              kycStatus === 'SUBMITTED' || kycStatus === 'PENDING'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                : kycStatus === 'REJECTED'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    kycStatus === 'SUBMITTED' || kycStatus === 'PENDING'
                      ? 'bg-blue-500/20 text-blue-400'
                      : kycStatus === 'REJECTED'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {kycStatus === 'SUBMITTED' || kycStatus === 'PENDING' ? (
                      <Clock className="w-5 h-5 animate-pulse" />
                    ) : kycStatus === 'REJECTED' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white">
                        {kycStatus === 'SUBMITTED' || kycStatus === 'PENDING'
                          ? 'KYC Verification Under Review'
                          : kycStatus === 'REJECTED'
                          ? 'KYC Verification Rejected - Action Required'
                          : 'Mandatory Regulatory Compliance: KYC Not Completed'}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        kycStatus === 'SUBMITTED' || kycStatus === 'PENDING'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : kycStatus === 'REJECTED'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {kycStatus || 'NOT_STARTED'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      {kycStatus === 'SUBMITTED' || kycStatus === 'PENDING'
                        ? 'Your KYC documents (PAN, Aadhaar, Bank Details, Signature) have been submitted and are being reviewed by the compliance administration. All investing privileges will unlock immediately upon verification.'
                        : kycStatus === 'REJECTED'
                        ? `Your KYC submission was rejected: "${kycRejectionReason || 'Document clarity or mismatch issue'}". Please correct and resubmit your documents.`
                        : 'Under SEBI & RBI regulations, you must complete your KYC verification before placing mutual fund investments, lumpsums, or starting SIPs. All investment actions are strictly locked.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 sm:self-center">
                  <button
                    onClick={() => { window.location.href = '/kyc'; }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      kycStatus === 'SUBMITTED' || kycStatus === 'PENDING'
                        ? 'bg-blue-500 hover:bg-blue-400 text-slate-950'
                        : kycStatus === 'REJECTED'
                        ? 'bg-rose-500 hover:bg-rose-400 text-white'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    <span>{kycStatus === 'SUBMITTED' || kycStatus === 'PENDING' ? 'View Submitted KYC' : kycStatus === 'REJECTED' ? 'Resubmit KYC Now' : 'Complete KYC Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Realtime Status Ticker */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent border border-emerald-500/20 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">Live Portfolio Tracking:</span>
              <span>Daily NAV & Market Updates</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
              <span className="hidden md:inline">Last Updated: <strong className="text-emerald-400">{lastTickTime}</strong></span>
              <button 
                onClick={fetchDashboardData}
                title="Refresh NAVs"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
          </div>

          {/* Active Advisor Investment Proposals */}
          {clientProposals && clientProposals.length > 0 && (
            <div className="space-y-4">
              {clientProposals.map((prop, idx) => (
                <div 
                  key={prop.proposalId || idx}
                  className="bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/20 border border-blue-500/30 rounded-3xl p-5 md:p-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-400" /> New Investment Proposal from Advisor
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">Ref: {prop.proposalId}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{prop.schemeName}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                        <span>Live NAV: <strong className="text-emerald-400 font-mono">₹{prop.nav || 'N/A'}</strong></span>
                        {prop.investmentAmount && (
                          <span>Proposed Allocation: <strong className="text-white font-mono">₹{Number(prop.investmentAmount).toLocaleString('en-IN')}</strong></span>
                        )}
                        <span>Partner: <strong className="text-slate-200">{prop.partnerName || 'Velocity Wealth Partner'}</strong></span>
                      </div>
                      {prop.notes && (
                        <p className="text-xs text-slate-400 italic bg-white/[0.03] border border-white/5 rounded-xl p-2.5 mt-2">
                          "{prop.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={async () => {
                          let current = kycStatus;
                          if (current !== 'VERIFIED' && user) {
                            try {
                              const token = await user.getIdToken();
                              const res = await fetch("/api/client/profile", {
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              if (res.ok) {
                                const data = await res.json();
                                const eff = data.kycStatus || data.client?.kycStatus || 'NOT_STARTED';
                                current = eff;
                                setKycStatus(eff);
                                localStorage.setItem('client_kyc_status', eff);
                              }
                            } catch(e) {}
                          }

                          if (current !== 'VERIFIED') {
                            window.location.href = '/kyc';
                          } else {
                            window.location.href = `/explore?scheme=${prop.schemeCode}&ref=${prop.proposalId}`;
                          }
                        }}
                        className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                          kycStatus === 'VERIFIED'
                            ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-blue-500/25'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-amber-500/50 hover:text-amber-300 shadow-none'
                        }`}
                      >
                        {kycStatus === 'VERIFIED' ? (
                          <>
                            <span>Review &amp; Invest</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 text-amber-400" />
                            <span>Locked (KYC Required)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Portfolio Summary KPI Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Current Value */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 rounded-[32px] relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm flex items-center gap-2 font-medium">
                  <Wallet className="h-4 w-4 text-indigo-400" /> Current Valuation
                </p>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Live NAV
                </span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 font-mono tracking-tight">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalCurrentValue)}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                Updated in real-time across {dynamicPortfolio.length} active holding{dynamicPortfolio.length === 1 ? '' : 's'}
              </p>
            </div>

            {/* 2. Invested Amount */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 rounded-[32px] relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm flex items-center gap-2 font-medium">
                  <PieChart className="h-4 w-4 text-slate-400" /> Total Invested
                </p>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                  Capital
                </span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 font-mono tracking-tight">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalInvested)}
              </h2>
              <p className="text-xs text-slate-400">
                Principal purchase amount invested in fund units
              </p>
            </div>

            {/* 3. Total Returns (Accurate Mathematical Logic with Correct Sign & Direction) */}
            <div className={`bg-white/[0.04] backdrop-blur-xl border p-6 rounded-[32px] relative overflow-hidden group transition-all ${
              isPositiveReturns ? 'border-emerald-500/20 hover:border-emerald-500/40' : 'border-rose-500/20 hover:border-rose-500/40'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm flex items-center gap-2 font-medium">
                  {isPositiveReturns ? <TrendingUp className="h-4 w-4 text-emerald-400" /> : <TrendingDown className="h-4 w-4 text-rose-400" />}
                  Total Returns (P&L)
                </p>
                <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isPositiveReturns 
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}>
                  {isPositiveReturns ? 'Gain' : 'Loss'}
                </span>
              </div>

              <h2 className={`text-4xl font-bold mb-2 font-mono tracking-tight ${
                isPositiveReturns ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {isPositiveReturns ? '+' : '-'}{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.abs(totalReturns))}
              </h2>

              <div className={`flex items-center gap-2 text-sm font-semibold ${
                isPositiveReturns ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                  isPositiveReturns ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {isPositiveReturns ? '↑' : '↓'}
                </span>
                <span>{isPositiveReturns ? '+' : ''}{totalReturnPct.toFixed(2)}% Overall Return</span>
              </div>
            </div>

          </section>

          {/* Dedicated Presentation-Grade Interactive Chart Section */}
          <section id="portfolio-chart-section" className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[32px] p-6 md:p-8 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <LineChartIcon className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">Historical Performance & NAV Growth Analytics</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Verified NAV
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Analyze past 1 month, 3 months, 6 months, 1 year, 3 years, and all-time compounding returns with benchmark alpha comparison.
                </p>
              </div>

              {/* Fund Selector for Chart Section */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Active Fund:</span>
                <select
                  value={String(selectedChartScheme.schemeCode)}
                  onChange={(e) => {
                    const code = e.target.value;
                    const foundHolding = dynamicPortfolio.find(p => String(p.schemeCode) === code);
                    if (foundHolding) {
                      setSelectedChartScheme({
                        schemeCode: foundHolding.schemeCode,
                        schemeName: foundHolding.schemeName,
                        category: foundHolding.schemeCategory || "Portfolio Holding"
                      });
                    } else {
                      const curatedList: Record<string, { name: string; cat: string }> = {
                        "120503": { name: "Mirae Asset Large & Midcap Fund - Direct Plan", cat: "Large & Mid Cap" },
                        "118989": { name: "Nippon India Small Cap Fund - Direct Plan", cat: "Small Cap" },
                        "122639": { name: "Parag Parikh Flexi Cap Fund - Direct Plan", cat: "Flexi Cap" },
                        "119598": { name: "HDFC Top 100 Fund - Direct Plan", cat: "Large Cap" },
                        "120828": { name: "Quant Active Fund - Direct Plan", cat: "Multi Cap" }
                      };
                      const entry = curatedList[code] || { name: `Scheme #${code}`, cat: "Mutual Fund" };
                      setSelectedChartScheme({
                        schemeCode: code,
                        schemeName: entry.name,
                        category: entry.cat
                      });
                    }
                  }}
                  className="bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {dynamicPortfolio.length > 0 && (
                    <optgroup label="Your Portfolio Holdings">
                      {dynamicPortfolio.map((p, idx) => (
                        <option key={idx} value={String(p.schemeCode)}>
                          {p.schemeName} (Holding)
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Market Benchmark & Top Funds">
                    <option value="120503">Mirae Asset Large & Midcap (120503)</option>
                    <option value="118989">Nippon India Small Cap (118989)</option>
                    <option value="122639">Parag Parikh Flexi Cap (122639)</option>
                    <option value="119598">HDFC Top 100 Fund (119598)</option>
                    <option value="120828">Quant Active Fund (120828)</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Render Advanced Multi-Timeframe Chart */}
            <div className="pt-2">
              <AdvancedFundChart
                key={String(selectedChartScheme.schemeCode)}
                schemeCode={selectedChartScheme.schemeCode}
                schemeName={selectedChartScheme.schemeName}
                category={selectedChartScheme.category}
                initialTimeframe="1Y"
                showPresentationHeader={true}
              />
            </div>

          </section>

          {/* Main Grid: Holdings & SIPS vs Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
            
            {/* Holdings & SIP Controls */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-[32px] p-6 md:p-8 flex flex-col">
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Your Mutual Fund Holdings</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time NAV tracking and unit allocations</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                    {dynamicPortfolio.length} Scheme{dynamicPortfolio.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {dynamicPortfolio.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-white/[0.01] rounded-2xl border border-dashed border-white/10">
                      <Wallet className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
                      <p className="text-slate-300 font-bold text-base">No active investments found</p>
                      <p className="text-slate-500 text-xs mt-1 mb-4">Start your wealth journey with zero-commission mutual funds.</p>
                      {kycStatus === 'VERIFIED' ? (
                        <Link to="/explore" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-400 text-black text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors">
                          <Plus className="w-4 h-4" /> Explore Top Funds
                        </Link>
                      ) : (
                        <button 
                          onClick={() => setShowKycMandatoryModal(true)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          <Lock className="w-4 h-4 text-amber-400" /> Complete KYC to Invest
                        </button>
                      )}
                    </div>
                  ) : (
                    dynamicPortfolio.map((fund, i) => {
                      const isFundPositive = fund.totalGain >= 0;
                      return (
                        <div key={i} className="p-5 bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl border border-white/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          
                          {/* Left: Fund Scheme Info */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#1e293b] border border-white/10 rounded-2xl flex items-center justify-center font-bold text-indigo-400 shrink-0 shadow-inner">
                              {fund.schemeName.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-bold text-white leading-tight">{fund.schemeName}</p>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                                  #{fund.schemeCode}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                <span>Units: <strong className="text-white font-mono">{Number(fund.units).toFixed(4)}</strong></span>
                                <span>•</span>
                                <span>Avg Buy: <strong className="text-slate-300 font-mono">₹{Number(fund.averagePrice).toFixed(2)}</strong></span>
                                <span>•</span>
                                <span className="text-emerald-400 font-mono flex items-center gap-1">
                                  Live NAV: ₹{fund.currentNav.toFixed(2)}
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Valuations & Action Menu */}
                          <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                            
                            <div className="text-left sm:text-right">
                              <p className="text-base font-bold text-white font-mono">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fund.currentValue)}
                              </p>
                              <div className="flex items-center sm:justify-end gap-1.5 mt-0.5">
                                <span className={`text-xs font-bold font-mono ${isFundPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {isFundPositive ? '+' : ''}{fund.returnPct.toFixed(2)}%
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  ({isFundPositive ? '+' : ''}{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fund.totalGain)})
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-mono">
                                Invested: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fund.investedAmount)}
                              </p>
                            </div>

                            <div className="relative">
                              <button 
                                onClick={() => toggleMenu(i)} 
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                              
                              {activeMenuId === i && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f172a] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-30 py-2">
                                  <button 
                                    onClick={() => { 
                                      setSelectedChartScheme({
                                        schemeCode: fund.schemeCode,
                                        schemeName: fund.schemeName,
                                        category: fund.schemeCategory || "Portfolio Holding"
                                      });
                                      setActiveMenuId(null);
                                      document.getElementById('portfolio-chart-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                                  >
                                    <LineChartIcon className="w-3.5 h-3.5" /> View Performance Chart
                                  </button>
                                  <button 
                                    onClick={() => { setRedeemModalFund(fund); setActiveMenuId(null); }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
                                  >
                                    <Wallet className="w-3.5 h-3.5 text-indigo-400" /> Redeem Units
                                  </button>
                                  {activeSips.find(s => s.schemeCode === fund.schemeCode) && (
                                    <>
                                      <button 
                                        onClick={() => { setEditSipModalSip(activeSips.find(s => s.schemeCode === fund.schemeCode)); setActiveMenuId(null); }}
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-indigo-400 hover:bg-indigo-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" /> Modify SIP Mandate
                                      </button>
                                      <button 
                                        onClick={() => { setSkipSipModalSip(activeSips.find(s => s.schemeCode === fund.schemeCode)); setActiveMenuId(null); }}
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
                                      >
                                        <FastForward className="w-3.5 h-3.5 text-blue-400" /> Skip Next Installment
                                      </button>
                                      <button 
                                        onClick={() => { setStopSipModalSip(activeSips.find(s => s.schemeCode === fund.schemeCode)); setActiveMenuId(null); }}
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                                      >
                                        <Ban className="w-3.5 h-3.5" /> Stop Recurring SIP
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>

                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

                {/* Active SIPs Section */}
                {activeSips.length > 0 && (
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-bold text-white flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-emerald-400" /> Active SIP Mandates
                      </h4>
                      <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                        {activeSips.length} Active
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {activeSips.map((sip, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.07] rounded-2xl border border-emerald-500/15 transition-colors gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center font-bold text-emerald-400 shrink-0">
                              <RotateCcw className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-white">{sip.schemeCode}</p>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  ACTIVE
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Debit Day: <span className="text-white font-medium">{sip.sipDate}th</span> • Next: {new Date(sip.nextInstallmentDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                            <div className="text-left sm:text-right">
                              <p className="text-sm font-bold text-emerald-400 font-mono">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(sip.amount)}
                                <span className="text-[10px] text-slate-400 font-normal"> / mo</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setEditSipModalSip(sip)}
                                title="Modify SIP"
                                className="px-2.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                              <button
                                onClick={() => setSkipSipModalSip(sip)}
                                title="Skip 1 Month"
                                className="px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <FastForward className="w-3 h-3" /> Skip
                              </button>
                              <button
                                onClick={() => setStopSipModalSip(sip)}
                                title="Cancel Mandate"
                                className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Ban className="w-3 h-3" /> Stop
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Approvals */}
                {pendingSips.length > 0 && (
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <h4 className="text-md font-bold text-slate-300 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" /> Pending Approvals</h4>
                    <div className="flex flex-col gap-4">
                      {pendingSips.map((sip, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center font-bold text-amber-400">
                              <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{sip.schemeCode} (SIP)</p>
                              <p className="text-xs text-amber-300">Waiting for Partner Approval</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-white font-mono">
                              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(sip.amount)}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase">Date: {sip.sipDate}th of month</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Daily Expense Tracker Component */}
              <ExpenseTracker />

              <TransactionHistory />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              
              {/* KYC Verification Card */}
              {kycStatus === 'VERIFIED' ? (
                <div className="bg-emerald-500/10 p-6 rounded-[32px] border border-emerald-500/20 backdrop-blur-md">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-emerald-400">KYC Verified</h3>
                      <p className="text-xs text-slate-400 mt-1">Your investment profile is verified and compliant with SEBI regulations.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-500/10 p-6 rounded-[32px] border border-amber-500/20 backdrop-blur-md">
                  <div className="flex gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-amber-400">KYC Verification Required</h3>
                      <p className="text-xs text-slate-400 mt-1 mb-4">Complete your verification to enable full transaction capabilities.</p>
                      <Link to="/kyc" className="inline-block text-center text-xs font-bold bg-amber-400 text-black px-4 py-2 rounded-xl hover:bg-amber-500 transition-colors">
                        Complete KYC Now
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Market Indices & Benchmark Sidebar */}
              <MarketIndicesSidebar />
            </div>

          </div>

        </div>
      </div>

      {/* Action Modals */}
      <RedeemModal 
        isOpen={!!redeemModalFund} 
        onClose={() => { setRedeemModalFund(null); window.location.reload(); }} 
        fund={redeemModalFund} 
        onConfirm={handleRedeemConfirm} 
        phone={clientPhone || user?.phoneNumber || undefined} 
        clientName={clientName || user?.displayName || 'Client'} 
      />
      <EditSipModal 
        isOpen={!!editSipModalSip} 
        onClose={() => setEditSipModalSip(null)} 
        sip={editSipModalSip} 
        onConfirm={handleEditSipProceedToOtp} 
      />
      <StopSipModal 
        isOpen={!!stopSipModalSip} 
        onClose={() => setStopSipModalSip(null)} 
        sip={stopSipModalSip} 
        onConfirm={handleStopSipConfirm} 
        phone={clientPhone || user?.phoneNumber || undefined} 
        clientName={clientName || user?.displayName || 'Client'} 
      />
      <SkipSipModal 
        isOpen={!!skipSipModalSip} 
        onClose={() => setSkipSipModalSip(null)} 
        sip={skipSipModalSip} 
        onConfirm={handleSkipSipConfirm} 
        phone={clientPhone || user?.phoneNumber || undefined} 
        clientName={clientName || user?.displayName || 'Client'} 
      />

      {/* OTP Authentication Modal for SIP Edit */}
      {editOtpData && (
        <OtpAuthModal
          isOpen={true}
          onClose={() => setEditOtpData(null)}
          onVerified={handleEditSipOtpVerified}
          title="Authorize Mandate Update"
          subtitle="Authenticate with 2FA OTP to update your recurring auto-debit terms."
          phone={clientPhone || user?.phoneNumber || (typeof window !== 'undefined' ? localStorage.getItem('client_phone') || undefined : undefined)}
          clientName={clientName || user?.displayName || 'Client'}
          actionSummary={[
            { label: 'Scheme Code', value: editOtpData.sip.schemeCode },
            { label: 'New Monthly Amount', value: `₹${editOtpData.amount}` },
            { label: 'New Debit Day', value: `${editOtpData.sipDate}th of every month` },
            { label: 'Action', value: 'Modify Mandate Terms' }
          ]}
          actionButtonText="Verify & Update Mandate"
          badgeVariant="indigo"
          isPhoneLocked={true}
        />
      )}

      {/* Mandatory KYC Pop-Up Modal */}
      {showKycMandatoryModal && kycStatus !== 'VERIFIED' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0b1329] border border-amber-500/30 rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <button
              onClick={() => setShowKycMandatoryModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-500/20 mb-4 border border-amber-500/30">
                <ShieldAlert className="h-8 w-8 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Mandatory KYC Verification</h2>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Under SEBI (Mutual Funds) Regulations, 1996 and RBI Master Directions on KYC, your identity must be verified before executing mutual fund investments, lumpsums, or SIPs.
              </p>
            </div>

            {/* Current Status Box */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">Current KYC Status</span>
                <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                  kycStatus === 'SUBMITTED' || kycStatus === 'PENDING'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : kycStatus === 'REJECTED'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {kycStatus === 'SUBMITTED' ? 'Documents Submitted' : kycStatus || 'NOT_STARTED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {kycStatus === 'SUBMITTED' || kycStatus === 'PENDING'
                  ? 'Your documents have been submitted to compliance admin. All investment actions will unlock once verified.'
                  : kycStatus === 'REJECTED'
                  ? `Re-submission needed: ${kycRejectionReason || 'Please verify document clarity and match with PAN details.'}`
                  : 'Investment actions are currently locked. Complete your online paperless KYC in under 3 minutes.'}
              </p>
            </div>

            {/* Verification Steps */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1. PAN Number &amp; Identity Verification</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2. Masked Aadhaar &amp; Address Authentication</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3. Bank Account Proof &amp; E-Mandate Authorization</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>4. Digital Signature &amp; Admin Document Approval</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { window.location.href = '/kyc'; }}
                className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>{kycStatus === 'SUBMITTED' ? 'View Submitted Documents' : 'Proceed to KYC Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowKycMandatoryModal(false)}
                className="py-3.5 px-4 rounded-xl font-semibold text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                View Dashboard (Locked)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
