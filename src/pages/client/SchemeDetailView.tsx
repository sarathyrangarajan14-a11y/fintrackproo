import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SchemeDetailSkeleton from '../../components/skeletons/SchemeDetailSkeleton';
import { 
  ChevronLeft, RefreshCw, AlertTriangle, ArrowRight, ShieldCheck, 
  Layers, BarChart3, TrendingUp, Users, HelpCircle, Coins, Lock 
} from 'lucide-react';
import { auth } from '../../lib/firebase';

import SchemeHeader from '../../components/scheme-detail/SchemeHeader';
import AssetAllocationSection from '../../components/scheme-detail/AssetAllocationSection';
import HoldingsAndSectors from '../../components/scheme-detail/HoldingsAndSectors';
import AdvancedRatios from '../../components/scheme-detail/AdvancedRatios';
import PeerComparisonTable from '../../components/scheme-detail/PeerComparisonTable';
import FundManagersList from '../../components/scheme-detail/FundManagersList';
import SchemeFaqAccordion from '../../components/scheme-detail/SchemeFaqAccordion';

import { schemeDetailsService, SchemeDetailData } from '../../services/schemeDetails.service';

export default function SchemeDetailView() {
  const { schemeCode } = useParams<{ schemeCode: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<SchemeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [kycStatus, setKycStatus] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('client_kyc_status') || 'NOT_STARTED';
    }
    return 'NOT_STARTED';
  });

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
          const effective = data.kycStatus || data.client?.kycStatus || 'NOT_STARTED';
          setKycStatus(effective);
          localStorage.setItem('client_kyc_status', effective);
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

    const handleFocus = () => {
      if (auth.currentUser) fetchProfile(auth.currentUser);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!schemeCode) {
      setError("No scheme code was found in the address parameters.");
      setLoading(false);
      return;
    }

    async function loadScheme() {
      setLoading(true);
      setError(null);
      try {
        const fetchedData = await schemeDetailsService.fetchSchemeDetail(schemeCode!);
        if (isMounted) {
          setData(fetchedData);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load mutual fund statistics.");
          setLoading(false);
        }
      }
    }

    loadScheme();

    return () => {
      isMounted = false;
    };
  }, [schemeCode, retryTrigger]);

  const handleBackToExplore = () => {
    navigate('/explore');
  };

  // 1. Loading Skeleton Layout
  if (loading) {
    return <SchemeDetailSkeleton />;
  }

  // 2. Error / Empty State
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Scheme Not Found</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {error || "We couldn't retrieve information for this specific mutual fund at the moment."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setRetryTrigger(prev => prev + 1)}
              className="flex-1 py-3 px-5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <button 
              onClick={handleBackToExplore}
              className="flex-1 py-3 px-5 rounded-xl text-xs font-bold bg-emerald-400 text-slate-900 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Explore Schemes <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Perfect Dynamic Details Page
  return (
    <div className="min-h-screen bg-[#020617] text-white py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation back-link */}
        <div>
          <button 
            onClick={handleBackToExplore}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Explore
          </button>
        </div>

        {/* Dynamic header */}
        <SchemeHeader scheme={data.schemeInfo} />

        {/* Dynamic bento blocks split with clean subheadings */}
        <div className="space-y-8">
          
          {/* Section 1: Asset allocations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 font-extrabold px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Asset Allocations</span>
            </div>
            <AssetAllocationSection 
              allocation={data.assetAllocation} 
              marketCap={data.marketCapSplit} 
            />
          </div>

          {/* Section 2: Top holdings & Sectors */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 font-extrabold px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Portfolio Composition</span>
            </div>
            <HoldingsAndSectors 
              holdings={data.topHoldings} 
              sectors={data.sectorAllocation} 
            />
          </div>

          {/* Section 3: Risk ratios & Load framework */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 font-extrabold px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Advanced Ratios &amp; load thresholds</span>
            </div>
            <AdvancedRatios 
              ratios={data.advancedRatios} 
              investmentDetails={data.investmentDetails} 
            />
          </div>

          {/* Section 4: Peer comparisons */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 font-extrabold px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Comparative Peer Indices</span>
            </div>
            <PeerComparisonTable peers={data.peerComparison} />
          </div>

          {/* Section 5: Managers list */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 font-extrabold px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Scheme Administrators</span>
            </div>
            <FundManagersList managers={data.fundManagers} />
          </div>

          {/* Section 6: Faqs list */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 font-extrabold px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Frequently Answered Questions</span>
            </div>
            <SchemeFaqAccordion faqs={data.faqs} />
          </div>

        </div>

        {/* Invest CTA Board */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border border-emerald-500/20 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5" />
          
          <div className="space-y-1.5 relative z-10">
            <h3 className="text-lg md:text-xl font-black text-white tracking-tight">
              Ready to invest in {data.schemeInfo.name}?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl font-medium">
              Join millions of users compounding wealth daily. Secure instant paperless onboarding with e-mandate automatic transactions.
            </p>
          </div>

          <button 
            onClick={async () => {
              if (!auth.currentUser) {
                navigate('/login');
                return;
              }
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
                } catch(e) {}
              }

              if (currentStatus !== 'VERIFIED') {
                navigate('/kyc');
                return;
              }
              navigate(`/explore?scheme=${data.schemeInfo.schemeCode}`);
            }}
            className={`w-full md:w-auto px-8 py-4 font-black rounded-2xl transition-all cursor-pointer text-xs uppercase tracking-widest relative z-10 text-center shrink-0 flex items-center justify-center gap-2 ${
              kycStatus === 'VERIFIED'
                ? 'bg-emerald-400 text-slate-900 hover:bg-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-amber-500/50 hover:text-amber-300 opacity-80'
            }`}
            title={kycStatus === 'VERIFIED' ? "Invest in this scheme" : "KYC Verification Required to Invest"}
          >
            {kycStatus === 'VERIFIED' ? (
              <>Invest in Scheme</>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Invest (KYC Required)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
