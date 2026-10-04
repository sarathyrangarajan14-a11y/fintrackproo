import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { getAuthHeaders } from '../lib/auth-helpers';
import { 
  Check, 
  X, 
  Clock, 
  RefreshCw, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Search, 
  AlertCircle,
  Building,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { mfapiService } from '../services/mfapi.service';

export default function PendingSips() {
  const [pendingSips, setPendingSips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [schemeNames, setSchemeNames] = useState<{ [code: string]: string }>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchPendingSips = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const res = await fetch("/api/partner/sips/pending", {
        headers
      });
      if (res.ok) {
        const data = await res.json();
        setPendingSips(data);
        
        // Fetch scheme names for pending SIPs
        const uniqueSchemeCodes = Array.from(new Set(data.map((item: any) => item.sip?.schemeCode).filter(Boolean))) as string[];
        uniqueSchemeCodes.forEach(async (code) => {
          try {
            const details = await mfapiService.getSchemeDetails(code);
            if (details?.meta?.scheme_name) {
              setSchemeNames(prev => ({
                ...prev,
                [code]: details.meta.scheme_name
              }));
            }
          } catch (e) {
            console.error(`Failed to fetch fund details for ${code}`, e);
          }
        });
      }
    } catch (err) {
      console.error("Failed to fetch pending SIPs", err);
      setNotification({ message: "Failed to load pending SIP approvals.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSips();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPendingSips();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAction = async (sipId: number, action: 'approve' | 'reject') => {
    try {
      setProcessing(sipId);
      const headers = await getAuthHeaders();
      
      const res = await fetch(`/api/partner/sip/${sipId}/${action}`, {
        method: 'POST',
        headers
      });
      
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setPendingSips(prev => prev.filter(p => p.sip.id !== sipId));
        setNotification({
          message: action === 'approve' 
            ? `SIP mandate #${sipId} approved! Official confirmation email dispatched to ${data.recipientEmail || 'client'}.`
            : `SIP mandate #${sipId} rejected.`,
          type: action === 'approve' ? 'success' : 'error'
        });
        setTimeout(() => setNotification(null), 6000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setNotification({ message: errData.error || `Failed to ${action} SIP`, type: 'error' });
      }
    } catch (err) {
      console.error(`Error processing SIP ${action}`, err);
      setNotification({ message: `Network error while processing SIP ${action}`, type: 'error' });
    } finally {
      setProcessing(null);
    }
  };

  const formatInr = (val: any) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  const getClientDisplayName = (client: any) => {
    if (!client) return 'Unknown Client';
    return client.name || 
           client.fullName || 
           client.bankAccountName || 
           client.user?.fullName || 
           (client.user?.email ? client.user.email.split('@')[0] : '') || 
           (client.email ? client.email.split('@')[0] : '') ||
           `Client #${client.id || 'N/A'}`;
  };

  const getClientEmail = (client: any) => {
    if (!client) return 'Not provided';
    return client.email || client.user?.email || 'Not provided';
  };

  const getClientPhone = (client: any) => {
    if (!client) return 'Not provided';
    return client.phone || client.phoneNumber || client.user?.phoneNumber || 'Not provided';
  };

  const getClientIdFormatted = (client: any) => {
    if (!client) return 'CLT-0000';
    return client.clientIdDisplay || `CLT-${String(client.id || 0).padStart(4, '0')}`;
  };

  const filteredSips = pendingSips.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = getClientDisplayName(item.client).toLowerCase();
    const email = getClientEmail(item.client).toLowerCase();
    const phone = getClientPhone(item.client).toLowerCase();
    const clientId = getClientIdFormatted(item.client).toLowerCase();
    const pan = (item.client?.pan || '').toLowerCase();
    const schemeCode = String(item.sip?.schemeCode || '').toLowerCase();
    const fundName = (schemeNames[item.sip?.schemeCode] || '').toLowerCase();
    
    return name.includes(q) || 
           email.includes(q) || 
           phone.includes(q) || 
           clientId.includes(q) || 
           pan.includes(q) || 
           schemeCode.includes(q) ||
           fundName.includes(q);
  });

  if (loading) {
    return (
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden p-6 mt-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-64 bg-slate-700/50 rounded-xl"></div>
          <div className="h-6 w-32 bg-slate-700/50 rounded-full"></div>
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-slate-700/30 rounded-2xl"></div>
          <div className="h-32 bg-slate-700/30 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
          notification.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden p-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h3 className="font-bold text-white text-xl flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-400" />
              SIP Mandate Approvals
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Review and approve incoming Systematic Investment Plan (SIP) authorizations submitted by your clients.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchPendingSips}
              title="Refresh approvals"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3.5 py-1.5 rounded-full">
              {pendingSips.length} Mandate{pendingSips.length !== 1 ? 's' : ''} Pending
            </span>
          </div>
        </div>

        {/* Filter and Search */}
        {pendingSips.length > 0 && (
          <div className="py-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Client Name, ID, Gmail/Email, Phone Number, PAN, or Fund..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {pendingSips.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white">All Caught Up!</h4>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              There are no pending SIP mandates waiting for your verification. As soon as your clients initiate new SIP investments, they will appear here with full contact and KYC details.
            </p>
          </div>
        ) : filteredSips.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-white">No matching mandates found</p>
            <p className="text-xs mt-1">Try adjusting your search keywords for client name, ID, or Gmail.</p>
          </div>
        ) : (
          /* Cards List */
          <div className="space-y-4 pt-2">
            {filteredSips.map((item) => {
              const client = item.client || {};
              const sip = item.sip || {};
              const clientName = getClientDisplayName(client);
              const clientEmail = getClientEmail(client);
              const clientPhone = getClientPhone(client);
              const clientIdFormatted = getClientIdFormatted(client);
              const fundTitle = sip.schemeName || schemeNames[sip.schemeCode] || `Scheme Code: ${sip.schemeCode}`;

              // Get initials for avatar
              const initials = clientName
                .split(' ')
                .map((n: string) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'CL';

              return (
                <div 
                  key={sip.id} 
                  className="bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-2xl p-5 md:p-6 transition-all shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Client Identity & Contact Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-white/10 text-emerald-400 font-bold flex items-center justify-center text-base flex-shrink-0">
                          {initials}
                        </div>

                        {/* Name & ID */}
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h4 className="text-lg font-bold text-white hover:text-emerald-400 transition-colors">
                              {clientName}
                            </h4>
                            
                            {/* Client ID Badge */}
                            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold flex items-center gap-1">
                              ID: {clientIdFormatted}
                            </span>

                            {/* KYC Status Badge */}
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              {client.kycStatus || 'KYC VERIFIED'}
                            </span>
                          </div>

                          {/* Contact Details row: Gmail & Phone & PAN */}
                          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-300 pt-1">
                            {/* Gmail / Email */}
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="font-semibold text-slate-400">Gmail/Email:</span>
                              <a 
                                href={`mailto:${clientEmail}`} 
                                className="text-white hover:underline font-mono"
                              >
                                {clientEmail}
                              </a>
                            </div>

                            {/* Phone / Mobile Number */}
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                              <span className="font-semibold text-slate-400">Number:</span>
                              <span className="text-white font-mono">{clientPhone}</span>
                            </div>

                            {/* PAN Card (if present) */}
                            {client.pan && (
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="font-semibold text-slate-400">PAN:</span>
                                <span className="text-white font-mono uppercase">{client.pan}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mutual Fund & SIP Configuration Details */}
                      <div className="mt-3 pt-3 border-t border-white/5 bg-white/[0.01] rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mutual Fund:</span>
                            <span className="text-sm font-bold text-indigo-300">{fundTitle}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                            <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-slate-300">Code: {sip.schemeCode}</span>
                            <span>&bull;</span>
                            <span className="text-slate-300 font-medium">Frequency: {sip.frequency || 'MONTHLY'}</span>
                            <span>&bull;</span>
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Debit Day: {sip.sipDate || 5}th of every month
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amount Display & Approval Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/5">
                      <div className="text-left lg:text-right">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                          Monthly SIP Amount
                        </span>
                        <p className="text-2xl font-black text-white">
                          {formatInr(sip.amount)}
                        </p>
                        <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 lg:justify-end mt-0.5">
                          <Clock className="w-3 h-3" /> Awaiting Partner Action
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button
                          onClick={() => handleAction(sip.id, 'reject')}
                          disabled={processing === sip.id}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/10 active:scale-95 transition-all disabled:opacity-50"
                        >
                          {processing === sip.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Reject
                        </button>
                        
                        <button
                          onClick={() => handleAction(sip.id, 'approve')}
                          disabled={processing === sip.id}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 transition-all disabled:opacity-50"
                        >
                          {processing === sip.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Approve Mandate
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

