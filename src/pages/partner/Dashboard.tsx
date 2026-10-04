import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, TrendingUp, PieChart, IndianRupee, Search, X, ShieldCheck, Briefcase, ArrowUpRight, MessageSquare, RotateCw, Sparkles, Check, FileText, Mail, Clock } from "lucide-react";
import { auth } from "../../lib/firebase";
import { getAuthHeaders } from "../../lib/auth-helpers";
import { mfapiService } from "../../services/mfapi.service";
import OtpAuthModal from "../../components/OtpAuthModal";
import PartnerKYCModal from "../../components/PartnerKYCModal";
import SipPaymentGatewayModal, { PaymentOrderInfo, PaymentSuccessData } from "../../components/SipPaymentGatewayModal";
import PendingSips from "../../components/PendingSips";

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'pending'>('overview');
  
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAum: 0,
    monthlySipBook: 0,
    pendingActions: 0
  });
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Client Portfolio Modal
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientModalTab, setClientModalTab] = useState<'overview' | 'portfolio' | 'kyc'>('overview');
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [kycModalClient, setKycModalClient] = useState<any | null>(null);

  // SIP on Behalf Flow
  const [isSipModalOpen, setIsSipModalOpen] = useState(false);
  const [sipSearchQuery, setSipSearchQuery] = useState("");
  const [sipFundResults, setSipFundResults] = useState<any[]>([]);
  const [searchingFunds, setSearchingFunds] = useState(false);
  const [selectedFund, setSelectedFund] = useState<any>(null);
  const [sipAmount, setSipAmount] = useState("");
  const [sipDate, setSipDate] = useState("5");

  // Dynamic OTP Flow
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedMandateOtp, setGeneratedMandateOtp] = useState("");
  const [mandateOtpTime, setMandateOtpTime] = useState("");
  const [processingSip, setProcessingSip] = useState(false);
  const [mandateOtpCopied, setMandateOtpCopied] = useState(false);
  const [paymentGatewayOrder, setPaymentGatewayOrder] = useState<PaymentOrderInfo | null>(null);
  
  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const headers = await getAuthHeaders();

        const [statsRes, clientsRes] = await Promise.all([
          fetch("/api/partner/stats", { headers }),
          fetch("/api/partner/clients/recent", { headers })
        ]);

        if (statsRes.ok && clientsRes.ok) {
          const statsData = await statsRes.json();
          const clientsData = await clientsRes.json();
          setStats(statsData);
          setClients(clientsData);
        }
      } catch (err) {
        console.error("Failed to fetch partner data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerData();

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) fetchPartnerData();
    });
    return () => unsubscribe();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const openPortfolio = async (client: any) => {
    setSelectedClient(client);
    setIsPortfolioModalOpen(true);
    setLoadingPortfolio(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/partner/client/${client.id}/portfolio`, {
        headers
      });
      if (res.ok) {
        const data = await res.json();
        // Enrich with current NAV
        const enriched = await Promise.all(data.map(async (item: any) => {
          let latestNav = Number(item.averagePrice);
          try {
            const navData = await mfapiService.getLatestNAV(item.schemeCode);
            if (navData && navData.nav) latestNav = parseFloat(navData.nav);
          } catch (e) {
            console.error("Failed to fetch NAV", e);
          }
          const currentValue = Number(item.units) * latestNav;
          const returnPct = ((currentValue - Number(item.investedAmount)) / Number(item.investedAmount)) * 100;
          return { ...item, currentValue, returnPct, latestNav };
        }));
        setPortfolio(enriched);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const startSipOnBehalf = () => {
    setIsPortfolioModalOpen(false);
    setIsSipModalOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (sipSearchQuery.length > 2) {
        setSearchingFunds(true);
        try {
          const res = await mfapiService.searchSchemes(sipSearchQuery);
          setSipFundResults(res.slice(0, 5)); // top 5 results
        } catch (e) {
          console.error(e);
        } finally {
          setSearchingFunds(false);
        }
      } else {
        setSipFundResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [sipSearchQuery]);

  const handleSipSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFund) {
      setNotification({ message: "Please select a fund", type: 'error' });
      setTimeout(() => setNotification(null), 5000);
      return;
    }
    setIsSipModalOpen(false);
    setIsOtpModalOpen(true);
  };

  const handlePartnerSipOtpVerified = async (verifiedOtp: string) => {
    setProcessingSip(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/partner/client/${selectedClient.id}/sip`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          schemeCode: selectedFund.schemeCode,
          amount: parseFloat(sipAmount),
          date: parseInt(sipDate),
          otp: verifiedOtp
        })
      });

      if (res.ok) {
        setIsOtpModalOpen(false);
        const amountNum = parseFloat(sipAmount);
        const fundName = selectedFund.schemeName || `Mutual Fund (${selectedFund.schemeCode})`;
        const sipNo = `SIP-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const txnNo = `TXN-MF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Launch Payment Gateway Modal for client
        setPaymentGatewayOrder({
          orderId: `MOJO_PTR_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          sipNo,
          txnNo,
          amount: amountNum,
          schemeName: fundName,
          schemeCode: selectedFund.schemeCode,
          sipDate: parseInt(sipDate),
          paymentUrl: `/api/sip/verify-payment-redirect?sipNo=${sipNo}&txnNo=${txnNo}&amount=${amountNum}&schemeName=${encodeURIComponent(fundName)}&is_mock=true`,
          isMock: true,
          clientName: selectedClient.name,
          clientEmail: selectedClient.email || "client@example.com",
          clientPhone: selectedClient.phone || "9876543210"
        });

        // Reset inputs
        setSelectedFund(null);
        setSipAmount("");
      } else {
        const err = await res.json();
        setNotification({ message: err.error || "Failed to initiate SIP", type: 'error' });
        setTimeout(() => setNotification(null), 5000);
        throw new Error(err.error || "Failed to initiate SIP");
      }
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setProcessingSip(false);
    }
  };

  return (
    <div className="space-y-6 relative z-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Partner Dashboard</h2>
          <p className="text-slate-400">Manage your clients and oversee portfolios.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/partner/email-logs"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/10"
          >
            <Mail className="w-4 h-4" />
            Email Status Logs
          </Link>
          <div className="bg-white/[0.05] px-4 py-2 border border-white/10 rounded-xl text-sm font-bold text-slate-400 hidden md:block">
            Last updated: Today, 09:41 AM
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'overview' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('clients')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'clients' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}
        >
          My Clients
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'pending' ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}
        >
          <Clock className="w-4 h-4" />
          Pending Approvals
          {stats.pendingActions > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${activeTab === 'pending' ? 'bg-black text-amber-400' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
              {stats.pendingActions}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/[0.04] backdrop-blur-xl p-6 rounded-[32px] border border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-400">Total Clients</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{loading ? "..." : stats.totalClients}</h3>
                </div>
                <div className="bg-indigo-500/20 p-2 rounded-2xl">
                  <Users className="h-6 w-6 text-indigo-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                <span className="text-emerald-400 font-bold">+12</span>
                <span className="text-slate-500 ml-2">this month</span>
              </div>
            </div>

            <div className="bg-white/[0.04] backdrop-blur-xl p-6 rounded-[32px] border border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-400">Total AUM</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{loading ? "..." : formatCurrency(stats.totalAum)}</h3>
                </div>
                <div className="bg-emerald-500/20 p-2 rounded-2xl">
                  <PieChart className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                <span className="text-emerald-400 font-bold">+2.1 Cr</span>
                <span className="text-slate-500 ml-2">this month</span>
              </div>
            </div>

            <div className="bg-white/[0.04] backdrop-blur-xl p-6 rounded-[32px] border border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-400">Monthly SIP Book</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{loading ? "..." : formatCurrency(stats.monthlySipBook)}</h3>
                </div>
                <div className="bg-indigo-500/20 p-2 rounded-2xl">
                  <IndianRupee className="h-6 w-6 text-indigo-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                <span className="text-emerald-400 font-bold">+₹4.5 L</span>
                <span className="text-slate-500 ml-2">this month</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('pending')}
              className="bg-white/[0.04] hover:bg-white/[0.07] cursor-pointer transition-all backdrop-blur-xl p-6 rounded-[32px] border border-amber-500/20 hover:border-amber-500/40 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-400 group-hover:text-amber-400 transition-colors">Pending Actions</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{loading ? "..." : stats.pendingActions}</h3>
                </div>
                <div className="bg-amber-500/20 p-2 rounded-2xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-amber-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  {loading ? "..." : stats.pendingActions} Actions Required <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Pending SIP Approvals Section */}
          <div className="pt-2">
            <PendingSips />
          </div>

          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden p-2">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center rounded-t-[24px]">
              <h3 className="font-bold text-white text-lg">Recent Compliance & System Alerts</h3>
            </div>
            <div className="p-6 text-slate-400 text-sm">
              {clients.length > 0 ? (
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5"></div>
                    <div>
                      <span className="text-white font-bold block">KYC Update Required</span>
                      1 client needs Aadhaar linked before next month's SIPs.
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5"></div>
                    <div>
                      <span className="text-white font-bold block">New Mandate Approvals</span>
                      {clients[0]?.name} successfully approved their auto-pay mandate.
                    </div>
                  </li>
                </ul>
              ) : (
                <div className="text-center py-4 font-bold opacity-50">No recent alerts.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PendingSips />
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden p-2">
            <div className="overflow-x-auto rounded-[24px]">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-white/[0.02] text-slate-400 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Client Details</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Contact</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Recent Activity</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400 font-bold">Loading clients...</td></tr>
                  ) : clients.map((client, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-base">{client.name}</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase tracking-tight">ID: #{client.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-300">{client.email}</div>
                        <div className="text-slate-500 text-xs mt-1">{client.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-300">{client.activity}</div>
                        <div className="text-slate-500 text-xs mt-1">{client.date}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openPortfolio(client)}
                          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
                        >
                          <Briefcase className="h-4 w-4 mr-2" /> View Portfolio
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO MODAL (Client 360) */}
      {isPortfolioModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 rounded-[32px] p-6 md:p-8 w-full max-w-5xl shadow-2xl relative max-h-[90vh] flex flex-col">
            <button 
              onClick={() => setIsPortfolioModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-bold text-white">{selectedClient.name}</h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <span>ID: #{selectedClient.id}</span>
                  <span>{selectedClient.email}</span>
                  <span>{selectedClient.phone}</span>
                </div>
              </div>
              <button 
                onClick={startSipOnBehalf}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-black hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
              >
                Invest on Behalf <ArrowUpRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            {/* Client Tabs */}
            <div className="flex space-x-2 border-b border-white/10 mb-6 shrink-0">
              <button 
                onClick={() => setClientModalTab('overview')}
                className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors ${clientModalTab === 'overview' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setClientModalTab('portfolio')}
                className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors ${clientModalTab === 'portfolio' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Portfolio
              </button>
              <button 
                onClick={() => setClientModalTab('kyc')}
                className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors ${clientModalTab === 'kyc' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                KYC & Documents
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              
              {clientModalTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total AUM</p>
                      <p className="text-2xl font-bold text-white">
                        {loadingPortfolio ? "..." : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(portfolio.reduce((sum, f) => sum + f.currentValue, 0))}
                      </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Invested</p>
                      <p className="text-2xl font-bold text-white">
                         {loadingPortfolio ? "..." : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(portfolio.reduce((sum, f) => sum + Number(f.investedAmount), 0))}
                      </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">Overall Returns</p>
                      <p className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                        +14.2% <TrendingUp className="h-5 w-5" />
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                    <h4 className="font-bold text-white mb-4">Client Profile</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Risk Profile</p>
                        <p className="text-sm font-bold text-amber-400">Aggressive</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Client Since</p>
                        <p className="text-sm font-bold text-white">Jan 2024</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Active SIPs</p>
                        <p className="text-sm font-bold text-white">2 (₹15,000/mo)</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Tax Bracket</p>
                        <p className="text-sm font-bold text-white">30%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {clientModalTab === 'portfolio' && (
                <div className="animate-in fade-in">
                  {loadingPortfolio ? (
                    <div className="py-12 text-center text-slate-400 font-bold">Fetching portfolio data...</div>
                  ) : portfolio.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 font-bold">No mutual fund investments found for this client.</div>
                  ) : (
                    <div className="space-y-4">
                      {portfolio.map((fund, i) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 gap-4 hover:bg-white/[0.05] transition-colors">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white">{fund.schemeName}</p>
                            <p className="text-xs text-slate-500 mt-1">{fund.units} Units @ ₹{fund.averagePrice} Avg</p>
                          </div>
                          <div className="md:text-right">
                            <p className="text-sm font-bold text-white">
                              Current: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fund.currentValue)}
                            </p>
                            <p className={`text-xs font-bold mt-1 flex items-center justify-end gap-1 ${fund.returnPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {fund.returnPct >= 0 ? <TrendingUp className="h-3 w-3" /> : null}
                              {fund.returnPct >= 0 ? '+' : ''}{fund.returnPct.toFixed(2)}% Return
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {clientModalTab === 'kyc' && (
                <div className="animate-in fade-in space-y-6">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <ShieldCheck className="h-8 w-8 text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="font-bold text-emerald-400 mb-1">
                          KYC Status: {selectedClient.kycStatus || 'VERIFIED'}
                        </h4>
                        <p className="text-sm text-emerald-200/70">
                          Inspect identity scans, bank proof, PAN, Aadhaar, or edit and verify client KYC.
                        </p>
                      </div>
                    </div>

                    <button
                      id="dashboard-open-kyc-modal-btn"
                      onClick={() => setKycModalClient(selectedClient)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2 whitespace-nowrap"
                    >
                      <FileText className="w-4 h-4" />
                      View & Manage Full KYC
                    </button>
                  </div>
                  
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden p-6 space-y-4">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3">Client Information & Documents Quick-Check</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block mb-1">PAN Number</span>
                        <span className="font-mono uppercase font-bold text-white">{selectedClient.pan || 'Provided'}</span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block mb-1">Bank Mandate</span>
                        <span className="font-bold text-white">{selectedClient.bankName || 'Verified Bank Account'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* PARTNER KYC FULL MODAL */}
      {kycModalClient && (
        <PartnerKYCModal
          isOpen={!!kycModalClient}
          onClose={() => setKycModalClient(null)}
          clientId={kycModalClient.id}
          clientName={kycModalClient.name || kycModalClient.fullName || 'Client'}
          onSuccess={() => {
            setNotification({ message: "Client KYC successfully processed & updated.", type: 'success' });
          }}
        />
      )}

      {/* START SIP MODAL */}
      {isSipModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-hidden">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsSipModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl bg-white/5 hover:bg-white/10 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">Initiate Client SIP</h3>
              <p className="text-slate-400 text-xs">Onboarding mandate on behalf of <span className="font-bold text-white">{selectedClient.name}</span> ({selectedClient.phone})</p>
            </div>

            <form onSubmit={handleSipSetupSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Left Column: Fund Search & Selection */}
              <div className="md:col-span-6 space-y-2">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">Search Mutual Fund</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search AMC or Scheme Name..."
                    value={sipSearchQuery}
                    onChange={(e) => setSipSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  {searchingFunds && <div className="absolute right-3 top-2.5 text-[10px] text-slate-500 font-bold">Searching...</div>}
                </div>
                
                {/* Search Results Dropdown */}
                {sipFundResults.length > 0 && !selectedFund && (
                  <div className="bg-[#1e293b] border border-white/10 rounded-xl overflow-hidden max-h-36 overflow-y-auto">
                    {sipFundResults.map((fund: any) => (
                      <button
                        key={fund.schemeCode}
                        type="button"
                        onClick={() => {
                          setSelectedFund(fund);
                          setSipSearchQuery(fund.schemeName);
                          setSipFundResults([]);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 border-b border-white/5 last:border-0 truncate"
                      >
                        {fund.schemeName}
                      </button>
                    ))}
                  </div>
                )}
                {selectedFund && (
                  <div className="text-xs text-emerald-400 font-bold flex items-center justify-between bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                    <span className="truncate max-w-[240px]">Selected: {selectedFund.schemeName}</span>
                    <button type="button" onClick={() => { setSelectedFund(null); setSipSearchQuery(""); }} className="text-slate-400 hover:text-white shrink-0 ml-2">Clear</button>
                  </div>
                )}
                <p className="text-[10px] text-slate-500">Only verified direct AMFI funds with automated BSE StarMF NACH mandate.</p>
              </div>

              {/* Right Column: Amount, Date, and Submit */}
              <div className="md:col-span-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Monthly (₹)</label>
                    <input
                      type="number"
                      required
                      min="500"
                      step="100"
                      value={sipAmount}
                      onChange={(e) => setSipAmount(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">SIP Date</label>
                    <select
                      value={sipDate}
                      onChange={(e) => setSipDate(e.target.value)}
                      className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    >
                      {[1, 5, 10, 15, 20, 25, 28].map((day) => (
                        <option key={day} value={day}>{day}th of month</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!selectedFund || !sipAmount}
                    className="w-full py-2.5 px-4 font-bold rounded-xl text-xs text-black bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    Continue to Mandate Verification
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP VERIFICATION MODAL */}
      {isOtpModalOpen && selectedClient && (
        <OtpAuthModal
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          onVerified={handlePartnerSipOtpVerified}
          title="Client Mandate & SIP Authorization"
          subtitle={`A confidential 6-digit authorization OTP has been dispatched to ${selectedClient.name}'s registered mobile number.`}
          phone={selectedClient.phone}
          clientName={selectedClient.name}
          actionButtonText="Verify & Authorize Mandate"
          actionSummary={[
            { label: "Client Name", value: selectedClient.name },
            { label: "Scheme Code", value: selectedFund?.schemeCode || "N/A" },
            { label: "Monthly SIP", value: `₹${sipAmount}` },
            { label: "Debit Date", value: `${sipDate}th of each month` }
          ]}
          isPhoneLocked={true}
        />
      )}

      {/* Interactive SIP Payment Gateway Modal */}
      {paymentGatewayOrder && (
        <SipPaymentGatewayModal
          orderInfo={paymentGatewayOrder}
          onClose={() => setPaymentGatewayOrder(null)}
          onPaymentSuccess={(data: PaymentSuccessData) => {
            setPaymentGatewayOrder(null);
            setNotification({
              message: `Payment & Mandate for ${data.schemeName} confirmed successfully (Ref: ${data.txnNo})`,
              type: 'success'
            });
            setTimeout(() => setNotification(null), 6000);
          }}
        />
      )}

      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${notification.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400' : 'bg-red-950/80 border-red-500/30 text-red-400'} backdrop-blur-xl animate-in slide-in-from-bottom-5 fade-in duration-300`}>
          <div className="font-bold text-sm">
            {notification.message}
          </div>
          <button onClick={() => setNotification(null)} className="opacity-50 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
