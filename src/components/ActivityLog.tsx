import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import {
  History,
  TrendingUp,
  PlusCircle,
  Edit3,
  Trash2,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  IndianRupee,
  ShieldCheck,
  User,
  Building2,
  ArrowRight,
  Download,
  AlertCircle,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import OtpAuthModal from './OtpAuthModal';

export interface SipActivityItem {
  id: string;
  action: 'CREATED' | 'MODIFIED' | 'PAUSED' | 'RESUMED' | 'CANCELLED' | 'DELETED' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  rawAction?: string;
  actionTitle: string;
  sipId?: number;
  schemeCode: string;
  schemeName: string;
  amount: number;
  previousAmount?: number;
  sipDate?: number;
  previousSipDate?: number;
  frequency?: string;
  actor: 'PARTNER' | 'CLIENT' | 'SYSTEM';
  actorName: string;
  referenceNumber: string;
  status: string;
  timestamp: string;
  details?: {
    reason?: string;
    orderId?: string;
    otpVerified?: boolean;
    nextInstallmentDate?: string;
    [key: string]: any;
  };
}

interface ActivityLogProps {
  clientId: number | string;
  clientName?: string;
  clientPhone?: string;
  onRefreshParent?: () => void;
}

export const POPULAR_SCHEMES = [
  { code: "120503", name: "Axis Bluechip Fund - Direct Plan - Growth" },
  { code: "120716", name: "Parag Parikh Flexi Cap Fund - Direct Plan" },
  { code: "120505", name: "HDFC Mid-Cap Opportunities Fund - Direct Plan" },
  { code: "118834", name: "Mirae Asset Large Cap Fund - Direct Plan" },
  { code: "119598", name: "SBI Small Cap Fund - Direct Plan" },
  { code: "102885", name: "Nippon India Small Cap Fund - Direct" },
  { code: "118989", name: "ICICI Prudential Bluechip Fund - Direct Plan" },
  { code: "101672", name: "Quant Active Fund - Direct Plan" },
  { code: "119775", name: "Kotak Mid Cap Fund (Emerging Equity) - Direct Plan" },
  { code: "125497", name: "UTI Nifty 50 Index Fund - Direct Plan" }
];

export default function ActivityLog({ clientId, clientName, clientPhone, onRefreshParent }: ActivityLogProps) {
  const [activities, setActivities] = useState<SipActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [filterActor, setFilterActor] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals for partner actions
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [newSipData, setNewSipData] = useState({
    schemeCode: "120503",
    amount: "5000",
    date: "5",
    frequency: "MONTHLY"
  });

  const [editModalItem, setEditModalItem] = useState<SipActivityItem | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editReason, setEditReason] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const [deleteModalItem, setDeleteModalItem] = useState<SipActivityItem | null>(null);
  const [deleteReason, setDeleteReason] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchActivities = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(`/api/partner/client/${clientId}/sip-activity`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      } else {
        console.error("Failed to fetch SIP activity logs");
      }
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchActivities();
    }
  }, [clientId]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSipWithOtp = async (otp: string) => {
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();

      const res = await fetch(`/api/partner/client/${clientId}/sip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newSipData,
          otp
        })
      });

      if (res.ok) {
        setNotification({
          message: `SIP for ₹${Number(newSipData.amount).toLocaleString('en-IN')}/mo created & logged successfully.`,
          type: 'success'
        });
        setShowCreateModal(false);
        setShowOtpModal(false);
        fetchActivities(true);
        if (onRefreshParent) onRefreshParent();
      } else {
        const errData = await res.json().catch(() => ({}));
        setNotification({
          message: errData.error || "Failed to create SIP",
          type: 'error'
        });
      }
    } catch (err) {
      setNotification({ message: "Network error during SIP creation", type: 'error' });
    }
  };

  const handleModifySip = async () => {
    if (!editModalItem?.sipId && !editModalItem?.details?.sipId) {
      setNotification({ message: "Unable to find SIP mandate identifier", type: 'error' });
      return;
    }
    const targetSipId = editModalItem.sipId || editModalItem.details?.sipId;

    try {
      setIsEditing(true);
      const user = auth.currentUser;
      const token = await user?.getIdToken();

      const res = await fetch(`/api/partner/client/${clientId}/sip/${targetSipId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: editAmount || editModalItem.amount,
          date: editDate || editModalItem.sipDate,
          reason: editReason || 'Terms updated by partner advisor'
        })
      });

      if (res.ok) {
        setNotification({
          message: `SIP mandate terms modified successfully.`,
          type: 'success'
        });
        setEditModalItem(null);
        fetchActivities(true);
        if (onRefreshParent) onRefreshParent();
      } else {
        const errData = await res.json().catch(() => ({}));
        setNotification({ message: errData.error || "Failed to modify SIP", type: 'error' });
      }
    } catch (err) {
      setNotification({ message: "Error modifying SIP", type: 'error' });
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteSip = async () => {
    const targetSipId = deleteModalItem?.sipId || deleteModalItem?.details?.sipId;
    if (!targetSipId) {
      setNotification({ message: "Unable to find SIP mandate identifier", type: 'error' });
      return;
    }

    try {
      setIsDeleting(true);
      const user = auth.currentUser;
      const token = await user?.getIdToken();

      const res = await fetch(`/api/partner/client/${clientId}/sip/${targetSipId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: deleteReason || 'Cancelled by partner on client request'
        })
      });

      if (res.ok) {
        setNotification({
          message: `SIP mandate terminated & recorded in audit log.`,
          type: 'success'
        });
        setDeleteModalItem(null);
        fetchActivities(true);
        if (onRefreshParent) onRefreshParent();
      } else {
        const errData = await res.json().catch(() => ({}));
        setNotification({ message: errData.error || "Failed to delete SIP", type: 'error' });
      }
    } catch (err) {
      setNotification({ message: "Error deleting SIP", type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuickPause = async (item: SipActivityItem) => {
    const targetSipId = item.sipId || item.details?.sipId;
    if (!targetSipId) return;

    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      const endpoint = item.action === 'PAUSED' ? 'resume' : 'pause';

      const res = await fetch(`/api/partner/client/${clientId}/sip/${targetSipId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: `SIP ${endpoint}d by partner` })
      });

      if (res.ok) {
        setNotification({
          message: `SIP mandate ${endpoint === 'resume' ? 'resumed' : 'paused'} successfully.`,
          type: 'success'
        });
        fetchActivities(true);
        if (onRefreshParent) onRefreshParent();
      }
    } catch (e) {
      setNotification({ message: "Failed to toggle SIP state", type: 'error' });
    }
  };

  // Filter & Sort Activities
  const filteredActivities = activities
    .filter(item => {
      // Filter by Action Type
      if (filterAction !== 'ALL') {
        if (filterAction === 'CREATED' && item.action !== 'CREATED' && item.action !== 'APPROVED') return false;
        if (filterAction === 'MODIFIED' && item.action !== 'MODIFIED') return false;
        if (filterAction === 'PAUSED' && item.action !== 'PAUSED' && item.action !== 'RESUMED') return false;
        if (filterAction === 'DELETED' && item.action !== 'DELETED' && item.action !== 'CANCELLED') return false;
      }

      // Filter by Actor
      if (filterActor !== 'ALL' && item.actor !== filterActor) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.schemeName?.toLowerCase().includes(q);
        const matchesCode = item.schemeCode?.toLowerCase().includes(q);
        const matchesRef = item.referenceNumber?.toLowerCase().includes(q);
        const matchesActor = item.actorName?.toLowerCase().includes(q);
        const matchesTitle = item.actionTitle?.toLowerCase().includes(q);
        return matchesName || matchesCode || matchesRef || matchesActor || matchesTitle;
      }

      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
    });

  // Calculate Metrics
  const totalEvents = activities.length;
  const creationsCount = activities.filter(a => a.action === 'CREATED' || a.action === 'APPROVED').length;
  const modificationsCount = activities.filter(a => a.action === 'MODIFIED').length;
  const cancellationsCount = activities.filter(a => a.action === 'DELETED' || a.action === 'CANCELLED').length;

  const getActionBadge = (action: SipActivityItem['action']) => {
    switch (action) {
      case 'CREATED':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: PlusCircle,
          label: 'SIP Created'
        };
      case 'APPROVED':
        return {
          bg: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
          icon: CheckCircle2,
          label: 'SIP Approved'
        };
      case 'MODIFIED':
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: Edit3,
          label: 'SIP Modified'
        };
      case 'PAUSED':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: PauseCircle,
          label: 'SIP Paused'
        };
      case 'RESUMED':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: PlayCircle,
          label: 'SIP Resumed'
        };
      case 'CANCELLED':
      case 'DELETED':
        return {
          bg: 'bg-red-500/10 text-red-400 border-red-500/20',
          icon: Trash2,
          label: action === 'DELETED' ? 'SIP Deleted' : 'SIP Cancelled'
        };
      case 'REJECTED':
        return {
          bg: 'bg-red-500/10 text-red-400 border-red-500/20',
          icon: XCircle,
          label: 'SIP Rejected'
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
          icon: Clock,
          label: 'SIP Event'
        };
    }
  };

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return {
        dateStr: date.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        timeStr: date.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    } catch (e) {
      return { dateStr: 'Recent', timeStr: '' };
    }
  };

  const handleExportCSV = () => {
    if (activities.length === 0) return;

    const headers = ["Activity ID", "Action", "Scheme Name", "Scheme Code", "Amount (INR)", "Previous Amount", "SIP Date", "Actor", "Actor Name", "Reference RRN", "Timestamp", "Status"];
    const rows = activities.map(item => [
      item.id,
      item.action,
      `"${item.schemeName.replace(/"/g, '""')}"`,
      item.schemeCode,
      item.amount,
      item.previousAmount || '',
      item.sipDate || '',
      item.actor,
      `"${item.actorName}"`,
      item.referenceNumber,
      item.timestamp,
      item.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SIP_Activity_Log_Client_${clientId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* HEADER & TOP STATS BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  SIP Activity & Audit Log
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/20">
                    Client #{clientId}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete immutable ledger of SIP creations, modifications, pauses, and deletions
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => fetchActivities(true)}
              disabled={refreshing || loading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Refresh Activity Log"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
              Refresh
            </button>

            <button
              onClick={handleExportCSV}
              disabled={activities.length === 0}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Export Log as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Initiate New SIP
            </button>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-3.5">
            <p className="text-xs text-slate-400 font-medium">Total Activity Events</p>
            <p className="text-2xl font-bold text-white mt-1">{totalEvents}</p>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-3.5">
            <p className="text-xs text-emerald-400 font-medium">SIP Creations & Approvals</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{creationsCount}</p>
          </div>

          <div className="bg-blue-950/20 border border-blue-500/20 rounded-2xl p-3.5">
            <p className="text-xs text-blue-400 font-medium">Terms Modified</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{modificationsCount}</p>
          </div>

          <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-3.5">
            <p className="text-xs text-red-400 font-medium">Terminated / Deleted</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{cancellationsCount}</p>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by fund, RRN, or actor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            {[
              { id: 'ALL', label: 'All Events' },
              { id: 'CREATED', label: 'Creations' },
              { id: 'MODIFIED', label: 'Modifications' },
              { id: 'PAUSED', label: 'Paused' },
              { id: 'DELETED', label: 'Deleted / Cancelled' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterAction(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filterAction === tab.id
                    ? 'bg-emerald-500 text-black shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Order Button */}
          <button
            onClick={() => setSortOrder(prev => prev === 'NEWEST' ? 'OLDEST' : 'NEWEST')}
            className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1 shrink-0"
            title="Toggle sort order"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {sortOrder === 'NEWEST' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>
      </div>

      {/* ACTIVITY TIMELINE / LIST */}
      {loading ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-medium">Loading SIP activity timeline...</p>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-full mb-4">
            <History className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Activity Logs Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            {searchQuery || filterAction !== 'ALL'
              ? "No records matched your search query or selected filter criteria."
              : "No SIP transactions or modifications have been recorded for this client yet."}
          </p>
          {(searchQuery || filterAction !== 'ALL') ? (
            <button
              onClick={() => { setSearchQuery(''); setFilterAction('ALL'); }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-emerald-500 text-black rounded-xl text-xs font-bold hover:bg-emerald-400 transition-colors"
            >
              Initiate First SIP
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((item, index) => {
            const badge = getActionBadge(item.action);
            const { dateStr, timeStr } = formatDateTime(item.timestamp);
            const Icon = badge.icon;
            const isModification = item.action === 'MODIFIED';

            return (
              <div
                key={item.id}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-md group relative overflow-hidden"
              >
                {/* Accent stripe on left */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    item.action === 'CREATED' || item.action === 'APPROVED' ? 'bg-emerald-500' :
                    item.action === 'MODIFIED' ? 'bg-blue-500' :
                    item.action === 'PAUSED' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left block: Icon, Action Badge, Fund Name & Changes */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className={`p-2.5 rounded-2xl border ${badge.bg} shrink-0 mt-0.5`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>

                        <span className="text-xs font-semibold text-slate-300">
                          {item.actionTitle}
                        </span>

                        <span className="text-xs text-slate-500">|</span>

                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {dateStr} at {timeStr}
                        </span>
                      </div>

                      {/* Scheme Name & Code */}
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                          {item.schemeName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                          <span className="font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 text-[11px] text-slate-300">
                            Scheme: {item.schemeCode}
                          </span>
                          <span>•</span>
                          <span>Monthly Auto-Debit</span>
                          {item.sipDate && (
                            <>
                              <span>•</span>
                              <span>Day {item.sipDate} of every month</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Modification Diff Highlight if action is MODIFIED */}
                      {isModification && (item.previousAmount !== undefined || item.previousSipDate !== undefined) && (
                        <div className="flex items-center gap-3 bg-slate-950/60 border border-blue-500/20 rounded-xl p-2.5 mt-2 text-xs">
                          {item.previousAmount !== undefined && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-medium">Amount:</span>
                              <span className="line-through text-slate-500">₹{item.previousAmount.toLocaleString('en-IN')}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                              <span className="font-bold text-emerald-400">₹{item.amount.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          {item.previousSipDate !== undefined && item.previousSipDate !== item.sipDate && (
                            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                              <span className="text-slate-400 font-medium">Debit Day:</span>
                              <span className="line-through text-slate-500">{item.previousSipDate}th</span>
                              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                              <span className="font-bold text-blue-400">{item.sipDate}th of month</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Reason / Notes if present */}
                      {item.details?.reason && (
                        <p className="text-xs text-slate-400 italic bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-800 inline-block mt-1">
                          Note: "{item.details.reason}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right block: Amount, Actor Tag, Reference & Quick Actions */}
                  <div className="flex lg:flex-col items-end justify-between lg:justify-center gap-2.5 shrink-0 border-t lg:border-t-0 border-slate-800/80 pt-3 lg:pt-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium">Monthly Installment</p>
                      <p className="text-base font-bold text-emerald-400">
                        ₹{item.amount.toLocaleString('en-IN')}
                        <span className="text-xs text-slate-400 font-normal"> / mo</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Actor Pill */}
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 ${
                        item.actor === 'PARTNER' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' :
                        item.actor === 'CLIENT' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {item.actor === 'PARTNER' ? <ShieldCheck className="w-3 h-3 text-purple-400" /> : <User className="w-3 h-3 text-blue-400" />}
                        {item.actorName}
                      </span>

                      {/* Reference RRN with Copy */}
                      {item.referenceNumber && (
                        <button
                          onClick={() => handleCopy(item.referenceNumber, item.id)}
                          className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md text-[11px] font-mono border border-slate-700/60 transition-colors"
                          title="Click to copy reference number"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{item.referenceNumber.length > 12 ? `${item.referenceNumber.slice(0, 10)}...` : item.referenceNumber}</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Action Menu (Edit / Pause / Cancel) if SIP is active and ID exists */}
                      {(item.sipId || item.details?.sipId) && item.action !== 'CANCELLED' && item.action !== 'DELETED' && (
                        <div className="flex items-center gap-1 ml-1">
                          <button
                            onClick={() => {
                              setEditModalItem(item);
                              setEditAmount(String(item.amount));
                              setEditDate(String(item.sipDate || 5));
                              setEditReason('');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/20 hover:text-blue-400 text-slate-400 border border-slate-700 transition-colors"
                            title="Modify SIP Terms"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleQuickPause(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600/20 hover:text-amber-400 text-slate-400 border border-slate-700 transition-colors"
                            title={item.action === 'PAUSED' ? 'Resume SIP' : 'Pause SIP'}
                          >
                            {item.action === 'PAUSED' ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => {
                              setDeleteModalItem(item);
                              setDeleteReason('');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-400 border border-slate-700 transition-colors"
                            title="Delete / Cancel Mandate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE SIP MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Create SIP Mandate</h3>
                  <p className="text-xs text-slate-400">Register new auto-debit for {clientName || `Client #${clientId}`}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mutual Fund Scheme</label>
                <select
                  value={newSipData.schemeCode}
                  onChange={(e) => setNewSipData({ ...newSipData, schemeCode: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {POPULAR_SCHEMES.map(s => (
                    <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Monthly Amount (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={newSipData.amount}
                    onChange={(e) => setNewSipData({ ...newSipData, amount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Debit Day of Month</label>
                  <select
                    value={newSipData.date}
                    onChange={(e) => setNewSipData({ ...newSipData, date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {[1, 5, 10, 15, 20, 25, 28].map(d => (
                      <option key={d} value={d}>{d}th of every month</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">Mandate Type:</span><span className="text-white font-medium">e-NACH Recurring Mandate</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Security:</span><span className="text-emerald-400 font-medium">Client OTP Authorization Required</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowOtpModal(true);
                }}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Authorize & Send OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP AUTH MODAL */}
      <OtpAuthModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerified={handleCreateSipWithOtp}
        title="Authorize SIP Mandate"
        subtitle={`A confidential 6-digit OTP has been sent to ${clientName || 'the client'}'s registered mobile number to authorize this monthly SIP of ₹${Number(newSipData.amount).toLocaleString('en-IN')}.`}
        phone={clientPhone}
        clientName={clientName}
        actionSummary={[
          { label: "Mutual Fund Scheme", value: POPULAR_SCHEMES.find(s => s.code === newSipData.schemeCode)?.name || newSipData.schemeCode },
          { label: "Monthly Amount", value: `₹${Number(newSipData.amount).toLocaleString('en-IN')}` },
          { label: "Auto-Debit Day", value: `${newSipData.date}th of every month` }
        ]}
        isPhoneLocked={true}
      />

      {/* EDIT SIP MODAL */}
      {editModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-blue-500/30 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3 text-blue-400">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Modify SIP Terms</h3>
                  <p className="text-xs text-slate-400">{editModalItem.schemeName}</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalItem(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Monthly Installment (₹)</label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Debit Day</label>
                <select
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {[1, 5, 10, 15, 20, 25, 28].map(d => (
                    <option key={d} value={d}>{d}th of month</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reason for Change / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Annual step-up or client request"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setEditModalItem(null)}
                disabled={isEditing}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModifySip}
                disabled={isEditing}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isEditing ? 'Saving...' : 'Save & Log Modification'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE / CANCEL SIP MODAL */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-red-500/30 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete SIP Mandate</h3>
                <p className="text-xs text-slate-400">Cancel recurring auto-debit</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Are you sure you want to stop and delete the SIP mandate for <strong className="text-white">{deleteModalItem.schemeName}</strong> (₹{deleteModalItem.amount.toLocaleString('en-IN')}/mo)? This will permanently cancel all upcoming installments and record the deletion in the client's activity log.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reason for Deletion (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Portfolio rebalancing or client request"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModalItem(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSip}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
            notification.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-400'
              : 'bg-red-950/95 border-red-500/50 text-red-400'
          } backdrop-blur-xl animate-in slide-in-from-bottom-5 fade-in duration-300`}
        >
          <div className="font-bold text-xs">{notification.message}</div>
          <button onClick={() => setNotification(null)} className="opacity-60 hover:opacity-100">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
