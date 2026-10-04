import { useState, useEffect, useMemo } from "react";
import { 
  Mail, Send, CheckCircle2, AlertTriangle, Clock, RefreshCw, 
  Search, Filter, Eye, ArrowUpRight, ExternalLink, ShieldCheck, 
  Copy, Check, AlertCircle, FileText, User, ChevronRight, X, 
  Sparkles, MessageSquare, Download, Share2, Info, Server, Key, Terminal, Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAuthHeaders } from "../../lib/auth-helpers";

export interface EmailLogEntry {
  id: string;
  recipientEmail: string;
  recipientName: string;
  senderEmail: string;
  senderName: string;
  subject: string;
  category: 'FUND_QUOTATION' | 'PORTFOLIO_REPORT' | 'KYC_ALERT' | 'SIP_ALERT' | 'TRANSACTION' | 'DIRECT_MESSAGE';
  status: 'DELIVERED' | 'BOUNCED' | 'PENDING' | 'SIMULATED';
  channel: 'RESEND' | 'SMTP' | 'SIMULATED';
  messageId?: string;
  proposalId?: string;
  schemeCode?: string;
  schemeName?: string;
  reportId?: string;
  reportType?: string;
  investmentAmount?: number | string;
  notes?: string;
  htmlContent: string;
  plainText: string;
  mailtoUrl: string;
  errorReason?: string;
  diagnosticCode?: string;
  deliveryAttempts: number;
  lastAttemptAt: string;
  createdAt: string;
  deliveredAt?: string;
  bouncedAt?: string;
  openedAt?: string;
  clickedAt?: string;
  metadata?: Record<string, any>;
}

export interface EmailStats {
  total: number;
  delivered: number;
  bounced: number;
  pending: number;
  simulated: number;
  deliveryRate: number;
  bounceRate: number;
}

export interface EmailTransportConfig {
  resendRestConfigured: boolean;
  smtpConfigured: boolean;
  activeProvider: string;
  smtpHost: string;
  smtpPort: number | string;
  smtpUser: string;
  senderFrom: string;
}

export default function EmailLogs() {
  const [logs, setLogs] = useState<EmailLogEntry[]>([]);
  const [stats, setStats] = useState<EmailStats>({
    total: 0,
    delivered: 0,
    bounced: 0,
    pending: 0,
    simulated: 0,
    deliveryRate: 100,
    bounceRate: 0
  });
  const [configStatus, setConfigStatus] = useState<EmailTransportConfig | null>(null);
  const [showSmtpGuide, setShowSmtpGuide] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  
  // Selected email for detail / preview modal
  const [selectedLog, setSelectedLog] = useState<EmailLogEntry | null>(null);
  const [previewTab, setPreviewTab] = useState<"html" | "text" | "details">("html");
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeName, setComposeName] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeCategory, setComposeCategory] = useState<EmailLogEntry['category']>("DIRECT_MESSAGE");
  const [composeBody, setComposeBody] = useState("");
  const [sendingCompose, setSendingCompose] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchConfig = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/partner/email-config", { headers });
      if (res.ok) {
        const data = await res.json();
        setConfigStatus(data.config);
      }
    } catch (err) {
      console.warn("Failed to fetch email config status", err);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/partner/email-logs?${params.toString()}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching email logs:", err);
      showToast("Failed to fetch email logs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchConfig();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleSendTestEmail = async (targetEmail: string = "sarathyrangarajan14@gmail.com") => {
    try {
      showToast(`Sending test proposal to ${targetEmail}...`, "info");
      const headers = await getAuthHeaders();
      const res = await fetch("/api/partner/send-quote", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clientEmail: targetEmail,
          clientName: "Sarathy Rangarajan",
          schemeCode: "153787",
          schemeName: "JioBlackRock Nifty 50 Index Fund - Direct Plan - Growth Option",
          nav: "10.0000",
          investmentAmount: 50000,
          notes: "Verification test via Resend SMTP / REST Gateway",
          partnerName: "FinTrackPro by Velocity Wealth"
        })
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || `Test quotation dispatched to ${targetEmail}!`, "success");
        fetchLogs();
        fetchConfig();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to dispatch test quote");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to send test email", "error");
    }
  };

  const handleResend = async (log: EmailLogEntry) => {
    try {
      setResendingId(log.id);
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/partner/email-logs/${log.id}/resend`, {
        method: "POST",
        headers
      });

      if (res.ok) {
        const data = await res.json();
        showToast(`Email successfully re-dispatched to ${log.recipientEmail}!`, "success");
        // Update local list
        setLogs(prev => prev.map(l => l.id === log.id ? data.log : l));
        if (selectedLog && selectedLog.id === log.id) {
          setSelectedLog(data.log);
        }
        fetchLogs();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to resend");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to resend email", "error");
    } finally {
      setResendingId(null);
    }
  };

  const handleSendCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      setSendingCompose(true);
      const headers = await getAuthHeaders();
      const res = await fetch("/api/partner/email-logs/send-custom", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: composeTo.trim(),
          recipientName: composeName.trim() || composeTo.split('@')[0],
          subject: composeSubject.trim(),
          body: composeBody.trim(),
          category: composeCategory
        })
      });

      if (res.ok) {
        showToast(`Email dispatched to ${composeTo}!`, "success");
        setIsComposeOpen(false);
        setComposeTo("");
        setComposeName("");
        setComposeSubject("");
        setComposeBody("");
        fetchLogs();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to dispatch email");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to send email", "error");
    } finally {
      setSendingCompose(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Copied to clipboard!", "info");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    } catch {
      return isoString;
    }
  };

  const getCategoryBadge = (category: EmailLogEntry['category']) => {
    switch (category) {
      case 'FUND_QUOTATION':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Fund Quotation</span>;
      case 'PORTFOLIO_REPORT':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Portfolio Report</span>;
      case 'KYC_ALERT':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">KYC Alert</span>;
      case 'SIP_ALERT':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">SIP Mandate</span>;
      case 'TRANSACTION':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">Receipt</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-300 border border-slate-500/20">Direct Message</span>;
    }
  };

  const getStatusBadge = (status: EmailLogEntry['status'], errorReason?: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'BOUNCED':
        return (
          <span 
            title={errorReason || "Mail delivery rejected"} 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Bounced
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Queued
          </span>
        );
      case 'SIMULATED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Portal Sync
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border ${
          toast.type === 'success' 
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/30 shadow-emerald-950/50' 
            : toast.type === 'error'
            ? 'bg-rose-950/90 text-rose-200 border-rose-500/30 shadow-rose-950/50'
            : 'bg-slate-900/90 text-slate-200 border-white/10 shadow-black/50'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Email Status & SMTP Outbound Telemetry
              </h1>
              <p className="text-sm text-slate-400">
                Live delivery tracking, Resend SMTP relay status, bounce diagnostics, and audit logs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchLogs(); fetchConfig(); }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-sm font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={() => setIsComposeOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <Send className="w-4 h-4" />
            Compose Message
          </button>
        </div>
      </div>

      {/* SMTP & Resend Live Credentials Reference Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#0b1120] to-[#0f172a] border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Resend SMTP Relay Configuration</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/10 text-slate-300 border border-white/10">
                Active Provider: {configStatus?.activeProvider || 'RESEND SMTP'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Connected Outbound SMTP Gateway</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Emails are routed through Resend SMTP (<code className="text-emerald-300 font-mono">smtp.resend.com:465</code>) with fallback to REST API and verified sender <code className="text-slate-300 font-mono">onboarding@resend.dev</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleSendTestEmail("sarathyrangarajan14@gmail.com")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition-all hover:scale-[1.02]"
            >
              <Zap className="w-3.5 h-3.5" />
              Dispatch Test Quote (sarathyrangarajan14@gmail.com)
            </button>
            <button
              onClick={() => setShowSmtpGuide(!showSmtpGuide)}
              className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
            >
              {showSmtpGuide ? "Hide Settings" : "View Credentials"}
            </button>
          </div>
        </div>

        {showSmtpGuide && (
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Host */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">SMTP Host</span>
                <button
                  onClick={() => copyToClipboard("smtp.resend.com", "host")}
                  className="text-slate-400 hover:text-emerald-400"
                >
                  {copiedId === "host" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="font-mono text-sm font-bold text-white">smtp.resend.com</p>
              <p className="text-[10px] text-slate-500">Secure mail submission agent</p>
            </div>

            {/* Port */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Port & SSL/TLS</span>
                <button
                  onClick={() => copyToClipboard("465", "port")}
                  className="text-slate-400 hover:text-emerald-400"
                >
                  {copiedId === "port" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="font-mono text-sm font-bold text-white">465 (SSL) / 587 (TLS)</p>
              <p className="text-[10px] text-slate-500">TLS connections: 2465, 587, 2587</p>
            </div>

            {/* User */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">SMTP User</span>
                <button
                  onClick={() => copyToClipboard("resend", "user")}
                  className="text-slate-400 hover:text-emerald-400"
                >
                  {copiedId === "user" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="font-mono text-sm font-bold text-white">resend</p>
              <p className="text-[10px] text-slate-500">Standard Resend SMTP username</p>
            </div>

            {/* Default From */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Default Sender</span>
                <button
                  onClick={() => copyToClipboard("onboarding@resend.dev", "from")}
                  className="text-slate-400 hover:text-emerald-400"
                >
                  {copiedId === "from" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="font-mono text-sm font-bold text-emerald-300 truncate">onboarding@resend.dev</p>
              <p className="text-[10px] text-slate-500">FinTrackPro / Velocity Wealth default</p>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Dispatched */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Dispatched</span>
            <div className="p-2 rounded-xl bg-slate-800/60 text-slate-300">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.total}</span>
            <span className="text-xs font-medium text-slate-400">emails recorded</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 border-t border-white/5 pt-2.5">
            <span className="text-emerald-400 font-semibold">{stats.simulated} synced</span>
            <span>•</span>
            <span className="text-slate-400">{stats.delivered} live routed</span>
          </div>
        </div>

        {/* Delivered Rate */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery Success</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">{stats.deliveryRate}%</span>
            <span className="text-xs font-medium text-emerald-500/80">success rate</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 border-t border-white/5 pt-2.5">
            <span className="text-emerald-400 font-semibold">{stats.delivered + stats.simulated} delivered</span>
            <span>to recipient inboxes</span>
          </div>
        </div>

        {/* Bounced / Failed */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bounced / Rejected</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 tracking-tight">{stats.bounced}</span>
            <span className="text-xs font-medium text-rose-500/80">({stats.bounceRate}% bounce)</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 border-t border-white/5 pt-2.5">
            <span className="text-rose-400 font-semibold">{stats.bounced > 0 ? 'Requires attention' : 'Zero bounce errors'}</span>
          </div>
        </div>

        {/* Pending Queue */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">MTA Relay Queue</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 tracking-tight">{stats.pending}</span>
            <span className="text-xs font-medium text-amber-500/80">pending dispatch</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 border-t border-white/5 pt-2.5">
            <span>Automated retries active</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search recipient, email, proposal, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </form>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              Category:
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Categories</option>
              <option value="FUND_QUOTATION" className="bg-slate-900">Fund Quotations</option>
              <option value="PORTFOLIO_REPORT" className="bg-slate-900">Portfolio Statements</option>
              <option value="KYC_ALERT" className="bg-slate-900">KYC Notifications</option>
              <option value="SIP_ALERT" className="bg-slate-900">SIP Alerts</option>
              <option value="TRANSACTION" className="bg-slate-900">Transaction Receipts</option>
              <option value="DIRECT_MESSAGE" className="bg-slate-900">Direct Messages</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {[
            { key: "ALL", label: "All Logs", count: stats.total },
            { key: "DELIVERED", label: "Delivered", count: stats.delivered },
            { key: "BOUNCED", label: "Bounced", count: stats.bounced },
            { key: "PENDING", label: "Queued", count: stats.pending },
            { key: "SIMULATED", label: "Portal Sync", count: stats.simulated },
          ].map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${
                  isActive ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/10 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-5">Recipient</th>
                <th className="py-4 px-5">Subject & Category</th>
                <th className="py-4 px-5">Delivery Status</th>
                <th className="py-4 px-5">Channel</th>
                <th className="py-4 px-5">Time</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                      <p className="text-sm font-medium">Fetching email delivery logs...</p>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Mail className="w-8 h-8 text-slate-500" />
                      <p className="text-base font-semibold text-slate-300">No email logs found</p>
                      <p className="text-xs text-slate-500">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    {/* Recipient */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {log.recipientName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm truncate">{log.recipientName}</p>
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                            {log.recipientEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subject & Category */}
                    <td className="py-4 px-5 max-w-xs">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-200 text-sm truncate group-hover:text-emerald-400 transition-colors">
                          {log.subject}
                        </p>
                        <div className="flex items-center gap-2">
                          {getCategoryBadge(log.category)}
                          {log.proposalId && (
                            <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                              {log.proposalId}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Delivery Status */}
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        {getStatusBadge(log.status, log.errorReason)}
                        {log.status === 'BOUNCED' && log.errorReason && (
                          <p className="text-[11px] text-rose-400/90 font-medium truncate max-w-[200px]" title={log.errorReason}>
                            {log.errorReason}
                          </p>
                        )}
                        {log.openedAt && log.status === 'DELIVERED' && (
                          <p className="text-[11px] text-emerald-500/80 font-medium flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Opened {formatRelativeTime(log.openedAt)}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Channel */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        log.channel === 'RESEND'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : log.channel === 'SMTP'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-slate-700/40 text-slate-300 border border-slate-600/30'
                      }`}>
                        {log.channel === 'RESEND' ? 'Resend API' : log.channel === 'SMTP' ? 'Resend SMTP' : 'Direct Portal'}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="py-4 px-5 text-slate-400 text-xs whitespace-nowrap">
                      <div>{formatRelativeTime(log.createdAt)}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLog(log)}
                          title="View Email Details"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleResend(log)}
                          disabled={resendingId === log.id}
                          title="Resend Email"
                          className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${resendingId === log.id ? 'animate-spin text-emerald-400' : ''}`} />
                        </button>

                        <a
                          href={log.mailtoUrl}
                          title="Launch in Email App"
                          className="p-2 rounded-xl bg-white/5 hover:bg-sky-500/20 text-slate-300 hover:text-sky-400 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Inspector & Diagnostic Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f172a] border border-white/15 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-white/[0.02]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                    {selectedLog.id}
                  </span>
                  {getCategoryBadge(selectedLog.category)}
                  {getStatusBadge(selectedLog.status, selectedLog.errorReason)}
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{selectedLog.subject}</h3>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 pt-1">
                  <span>To: <strong className="text-slate-200">{selectedLog.recipientName}</strong> &lt;{selectedLog.recipientEmail}&gt;</span>
                  <span>From: <strong className="text-slate-200">{selectedLog.senderName}</strong></span>
                  <span>Dispatched: {new Date(selectedLog.createdAt).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Diagnostic Alert if Bounced */}
            {selectedLog.status === 'BOUNCED' && (
              <div className="p-4 bg-rose-950/40 border-b border-rose-500/20 text-rose-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-rose-300">Delivery Failure Diagnostic</p>
                  <p className="font-mono text-rose-200/90">{selectedLog.errorReason || "550 User mailbox not found or inaccessible"}</p>
                  {selectedLog.diagnosticCode && (
                    <p className="text-[10px] text-rose-400">Diagnostic Code: <strong>{selectedLog.diagnosticCode}</strong></p>
                  )}
                  <p className="text-slate-300 pt-1">
                    Suggestion: Please verify the client's email address in their profile or share the proposal link directly via WhatsApp/SMS.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Tabs */}
            <div className="px-6 border-b border-white/10 flex gap-4 bg-white/[0.01]">
              <button
                onClick={() => setPreviewTab("html")}
                className={`py-3 text-xs font-bold border-b-2 transition-all ${
                  previewTab === "html"
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Rendered HTML Preview
              </button>
              <button
                onClick={() => setPreviewTab("text")}
                className={`py-3 text-xs font-bold border-b-2 transition-all ${
                  previewTab === "text"
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Plain Text & Headers
              </button>
              <button
                onClick={() => setPreviewTab("details")}
                className={`py-3 text-xs font-bold border-b-2 transition-all ${
                  previewTab === "details"
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Telemetry & Metadata
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-[#020617]">
              {previewTab === "html" && (
                <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0b1120] shadow-inner p-4">
                  <div 
                    dangerouslySetInnerHTML={{ __html: selectedLog.htmlContent }}
                    className="overflow-x-auto text-slate-200"
                  />
                </div>
              )}

              {previewTab === "text" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selectedLog.plainText}
                  </div>
                  <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2 text-slate-400">
                    <p><strong>Message-ID:</strong> {selectedLog.messageId || 'N/A'}</p>
                    <p><strong>Delivery Channel:</strong> {selectedLog.channel}</p>
                    <p><strong>Attempts:</strong> {selectedLog.deliveryAttempts}</p>
                    <p><strong>Created At:</strong> {selectedLog.createdAt}</p>
                    {selectedLog.deliveredAt && <p><strong>Delivered At:</strong> {selectedLog.deliveredAt}</p>}
                  </div>
                </div>
              )}

              {previewTab === "details" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-slate-500 font-bold uppercase">Proposal Reference</span>
                      <p className="text-sm font-mono font-bold text-emerald-400">{selectedLog.proposalId || 'N/A'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-slate-500 font-bold uppercase">Scheme Code</span>
                      <p className="text-sm font-mono font-bold text-white">{selectedLog.schemeCode || 'N/A'}</p>
                    </div>
                    {selectedLog.schemeName && (
                      <div className="col-span-2 p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-slate-500 font-bold uppercase">Scheme Name</span>
                        <p className="text-sm font-semibold text-white">{selectedLog.schemeName}</p>
                      </div>
                    )}
                    {selectedLog.investmentAmount && (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-slate-500 font-bold uppercase">Proposed Allocation</span>
                        <p className="text-sm font-bold text-white">₹{Number(selectedLog.investmentAmount).toLocaleString('en-IN')}</p>
                      </div>
                    )}
                  </div>

                  {selectedLog.notes && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-slate-500 font-bold uppercase">Advisor Note</span>
                      <p className="text-slate-300 italic">"{selectedLog.notes}"</p>
                    </div>
                  )}

                  {selectedLog.metadata && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-slate-500 font-bold uppercase">Additional Payload Metadata</span>
                      <pre className="font-mono text-slate-300 mt-1">{JSON.stringify(selectedLog.metadata, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(selectedLog.plainText, selectedLog.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
                >
                  {copiedId === selectedLog.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Body
                </button>

                <a
                  href={selectedLog.mailtoUrl}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Open Mail App
                </a>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
                >
                  Close
                </button>

                <button
                  onClick={() => handleResend(selectedLog)}
                  disabled={resendingId === selectedLog.id}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendingId === selectedLog.id ? 'animate-spin' : ''}`} />
                  Resend Email Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compose Custom Message Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
          <div className="bg-[#0f172a] border border-white/15 rounded-2xl sm:rounded-3xl w-full max-w-4xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Compose Direct Client Advisory</h3>
                  <p className="text-[11px] text-slate-400">Send an authenticated advisory communication to your client</p>
                </div>
              </div>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendCustom} className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* Left Column: Client, Category, Subject, Submit */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Recipient Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="client@example.com"
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Client Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar"
                        value={composeName}
                        onChange={(e) => setComposeName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Category</label>
                      <select
                        value={composeCategory}
                        onChange={(e) => setComposeCategory(e.target.value as any)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                      >
                        <option value="DIRECT_MESSAGE" className="bg-slate-900">Direct Message</option>
                        <option value="KYC_ALERT" className="bg-slate-900">KYC Notification</option>
                        <option value="SIP_ALERT" className="bg-slate-900">SIP Alert</option>
                        <option value="PORTFOLIO_REPORT" className="bg-slate-900">Report Notice</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Portfolio Update & Advisory Note"
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingCompose}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {sendingCompose ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Message Body */}
              <div className="md:col-span-7 flex flex-col space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Message Body *</label>
                <textarea
                  required
                  rows={8}
                  placeholder="Type your message to the client here..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500 custom-scrollbar resize-none"
                ></textarea>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

