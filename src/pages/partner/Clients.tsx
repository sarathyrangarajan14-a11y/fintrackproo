import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Filter, Mail, Plus, UserPlus, FileText, CheckCircle, Clock, Ban, X, ChevronRight, Check, Trash2, CheckCircle2, ShieldCheck, Eye, FileCheck, User } from "lucide-react";
import { auth } from "../../lib/firebase";
import { getAuthHeaders } from "../../lib/auth-helpers";
import PartnerKYCModal from "../../components/PartnerKYCModal";

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newClientData, setNewClientData] = useState({
    name: "",
    email: "",
    phone: "",
    pan: "",
    dob: "",
    clientType: "Individual"
  });

  // Partner KYC Modal State
  const [selectedKycClient, setSelectedKycClient] = useState<{ id: number; name: string } | null>(null);

  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Client Deletion Confirmation Modal State
  const [clientToDelete, setClientToDelete] = useState<{ id: number; name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchClients = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/partner/clients", {
        headers
      });
      
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error("Failed to fetch clients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;
    const clientId = clientToDelete.id;
    try {
      setDeletingId(clientId);
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/partner/client/${clientId}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setNotification({ message: `Client "${clientToDelete.name}" deleted successfully from database`, type: "success" });
        setClientToDelete(null);
        await fetchClients();
      } else {
        const errData = await res.json().catch(() => ({}));
        setNotification({ message: errData.error || "Failed to delete client", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Error deleting client", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleApproveKYC = async (clientId: number) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/partner/client/${clientId}/kyc-approve`, {
        method: 'POST',
        headers
      });
      if (res.ok) {
        setNotification({ message: "KYC Approved and Client Notified via SMS/WhatsApp", type: "success" });
        fetchClients();
      } else {
        setNotification({ message: "Failed to approve KYC", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Error approving KYC", type: "error" });
    }
  };

  const handleSubmitKYC = async (clientId: number) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/partner/client/${clientId}/kyc-submit`, {
        method: 'POST',
        headers
      });
      if (res.ok) {
        setNotification({ message: "KYC Completed and Verified on behalf of client", type: "success" });
        fetchClients();
      } else {
        setNotification({ message: "Failed to complete KYC", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Error completing KYC", type: "error" });
    }
  };

  const formatCurrency = (val: any) => {
    if (val === "Hidden") return "Hidden";
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    }
    return val;
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          client.id.toString().includes(searchQuery) ||
                          client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Registered") return matchesSearch && client.clientStatus === "REGISTERED";
    if (activeFilter === "Pending") return matchesSearch && client.clientStatus === "REGISTRATION_PENDING";
    if (activeFilter === "Leads") return matchesSearch && client.clientStatus === "LEAD";
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "REGISTERED":
        return <span className="flex items-center px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold uppercase tracking-wider"><CheckCircle className="w-3 h-3 mr-1" /> Registered</span>;
      case "REGISTRATION_PENDING":
        return <span className="flex items-center px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold uppercase tracking-wider"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
      case "LEAD":
        return <span className="flex items-center px-2 py-1 bg-slate-500/20 text-slate-300 border border-slate-500/30 rounded text-[10px] font-bold uppercase tracking-wider"><UserPlus className="w-3 h-3 mr-1" /> Lead</span>;
      default:
        return <span className="flex items-center px-2 py-1 bg-slate-500/20 text-slate-400 border border-slate-500/30 rounded text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 relative z-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Client Directory</h2>
          <p className="text-slate-400">Manage all your leads, prospects, and registered clients.</p>
        </div>
        <button 
          onClick={() => { setWizardStep(1); setIsAddClientOpen(true); }}
          className="flex items-center bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Client
        </button>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-4 mb-6">
        <Ban className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-white font-bold text-sm mb-1">Data Privacy Enforcement Active</h4>
          <p className="text-xs text-blue-200/70 leading-relaxed">
            Financial privacy rules applied at the backend layer. AUM, PAN, and full names are strictly masked for "Leads" and "Registration Pending" clients until they complete client-app consent and registration.
          </p>
        </div>
      </div>

      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] p-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Name, Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {["All", "Registered", "Pending", "Leads"].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors shrink-0 ${
                  activeFilter === filter 
                    ? 'bg-white/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-white/[0.03] text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-[24px] border border-white/5 bg-white/[0.01]">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-white/[0.02] text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Client</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Contact</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">AUM</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-slate-400 font-bold animate-pulse">Loading directory...</td></tr>
              ) : filteredClients.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-slate-400 font-bold">No clients found.</td></tr>
              ) : filteredClients.map((client, i) => (
                <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-base flex items-center gap-2"><Link to={`/partner/client/${client.id}`} className="hover:text-emerald-400 transition-colors">
                      {client.name}</Link>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 uppercase tracking-tight font-mono">ID: FT-{client.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300 font-mono text-xs mb-1">{client.email}</div>
                    <div className="text-slate-500 text-xs font-mono">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      {getStatusBadge(client.clientStatus)}
                      {client.kycStatus === "VERIFIED" && (
                        <button
                          onClick={() => setSelectedKycClient({ id: client.id, name: client.name })}
                          className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider transition-colors"
                          title="View Verified KYC Documents & Details"
                        >
                          <ShieldCheck className="w-3 h-3 mr-1" /> KYC Verified
                        </button>
                      )}
                      {client.kycStatus === "SUBMITTED" && (
                        <button
                          onClick={() => setSelectedKycClient({ id: client.id, name: client.name })}
                          className="inline-flex items-center text-[10px] font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider transition-colors"
                          title="Inspect Documents & Verify"
                        >
                          <Clock className="w-3 h-3 mr-1" /> Review KYC
                        </button>
                      )}
                      {(client.kycStatus === "NOT_STARTED" || client.kycStatus === "PENDING" || !client.kycStatus) && (
                        <button
                          onClick={() => setSelectedKycClient({ id: client.id, name: client.name })}
                          className="inline-flex items-center text-[10px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider transition-colors"
                          title="Do KYC for Client"
                        >
                          <FileText className="w-3 h-3 mr-1" /> Do KYC
                        </button>
                      )}
                      {client.kycStatus === "CORRECTION_REQUIRED" && (
                        <button
                          onClick={() => setSelectedKycClient({ id: client.id, name: client.name })}
                          className="inline-flex items-center text-[10px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider transition-colors"
                        >
                          <Clock className="w-3 h-3 mr-1" /> Needs Correction
                        </button>
                      )}
                      {client.kycStatus === "REJECTED" && (
                        <button
                          onClick={() => setSelectedKycClient({ id: client.id, name: client.name })}
                          className="inline-flex items-center text-[10px] font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider transition-colors"
                        >
                          <X className="w-3 h-3 mr-1" /> Rejected
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {client.aum === "Hidden" ? (
                      <span className="text-slate-500 italic text-xs font-bold px-2 py-1 bg-white/5 rounded">Hidden (Unregistered)</span>
                    ) : (
                      <span className="font-bold text-white">{formatCurrency(client.aum)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {client.kycStatus === "SUBMITTED" ? (
                        <>
                          <button 
                            onClick={() => setSelectedKycClient({ id: client.id, name: client.name })}
                            className="inline-flex items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="Inspect Documents & Verify"
                          >
                            <Eye className="h-4 w-4 mr-1" /> Review
                          </button>
                          <button 
                            onClick={() => handleApproveKYC(client.id)}
                            className="inline-flex items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title="Quick Approve KYC"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                          </button>
                        </>
                      ) : (client.kycStatus === "NOT_STARTED" || client.kycStatus === "PENDING" || client.kycStatus === "CORRECTION_REQUIRED") ? (
                        <button 
                          onClick={() => setSelectedKycClient({ id: client.id, name: client.name })}
                          className="inline-flex items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                          title="Complete KYC on behalf of client"
                        >
                          <FileText className="h-4 w-4 mr-1" /> Do KYC
                        </button>
                      ) : (
                        <button 
                          onClick={() => setSelectedKycClient({ id: client.id, name: client.name })}
                          className="inline-flex items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          title="View KYC Documents & Status"
                        >
                          <FileCheck className="h-4 w-4 mr-1" /> KYC Docs
                        </button>
                      )}

                      {client.clientStatus === "REGISTERED" ? (
                        <Link 
                          to={`/partner/client/${client.id}`}
                          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
                        >
                          <User className="h-4 w-4 mr-1" /> Profile
                        </Link>
                      ) : (
                        <button 
                          onClick={() => {
                            setNewClientData({ ...newClientData, email: client.email, phone: client.phone, name: client.name });
                            setWizardStep(3);
                            setIsAddClientOpen(true);
                          }}
                          className="inline-flex items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-400 hover:bg-blue-500/20 transition-colors"
                        >
                          <Mail className="h-4 w-4 mr-1" /> Invite
                        </button>
                      )}
                      <button 
                        onClick={() => setClientToDelete({ id: client.id, name: client.name })}
                        className="inline-flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Delete Client"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CLIENT CONFIRMATION MODAL */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-red-500/30 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Client</h3>
                <p className="text-xs text-slate-400">Permanently remove from database</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-white font-bold">{clientToDelete.name}</strong> (Client ID: #{clientToDelete.id})? All associated portfolios, SIPs, mandates, transactions, and CRM records will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setClientToDelete(null)}
                disabled={deletingId !== null}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-sm font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteClient}
                disabled={deletingId !== null}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {deletingId !== null ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ADD CLIENT WIZARD MODAL */}
      {isAddClientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-hidden">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-4xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddClientOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white z-10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Add New Client</h3>
                <p className="text-slate-400 text-xs">Onboard a prospect to the FinTrackPro platform with automated KYC integration.</p>
              </div>

              {/* Progress Steps inline */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-1.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${wizardStep > step ? 'bg-emerald-500 text-black' : wizardStep === step ? 'bg-emerald-500 text-black ring-2 ring-emerald-500/30' : 'bg-[#1e293b] text-slate-400 border border-white/10'}`}>
                      {wizardStep > step ? <Check className="w-3.5 h-3.5" /> : step}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 hidden md:inline">
                      {step === 1 ? 'Details' : step === 2 ? 'PAN/DOB' : 'Invite'}
                    </span>
                    {step < 3 && <div className="w-4 h-0.5 bg-white/10 mx-1"></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Basic Details in 3-column horizontal grid */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
                    <input type="text" placeholder="e.g. Rahul Sharma" value={newClientData.name} onChange={e => setNewClientData({...newClientData, name: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Mobile Number</label>
                    <input type="tel" placeholder="10-digit number" value={newClientData.phone} onChange={e => setNewClientData({...newClientData, phone: e.target.value.replace(/\D/g, '')})} maxLength={10} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
                    <input type="email" placeholder="client@example.com" value={newClientData.email} onChange={e => setNewClientData({...newClientData, email: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button onClick={() => setWizardStep(2)} disabled={!newClientData.name || !newClientData.phone || !newClientData.email} className="flex items-center px-6 py-2.5 bg-emerald-500 text-black rounded-xl font-bold text-xs hover:bg-emerald-400 disabled:opacity-50 transition-colors cursor-pointer">
                    Next: Verification <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: PAN & Demographics in 3-column horizontal grid */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">PAN Number</label>
                    <input type="text" placeholder="ABCDE1234F" maxLength={10} value={newClientData.pan} onChange={e => setNewClientData({...newClientData, pan: e.target.value.toUpperCase()})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono uppercase focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Date of Birth</label>
                    <input type="date" value={newClientData.dob} onChange={e => setNewClientData({...newClientData, dob: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Client Type</label>
                    <select value={newClientData.clientType} onChange={e => setNewClientData({...newClientData, clientType: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500">
                      <option>Individual</option>
                      <option>HUF</option>
                      <option>NRI</option>
                      <option>Corporate</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2 flex justify-between">
                  <button onClick={() => setWizardStep(1)} className="px-5 py-2.5 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer">Back</button>
                  <button onClick={() => setWizardStep(3)} disabled={!newClientData.pan} className="flex items-center px-6 py-2.5 bg-emerald-500 text-black rounded-xl font-bold text-xs hover:bg-emerald-400 disabled:opacity-50 transition-colors cursor-pointer">
                    Next: Onboarding <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Invitation Action in 2-column horizontal grid */}
            {wizardStep === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-5 w-5 text-emerald-400 shrink-0" />
                        <h4 className="font-bold text-white text-sm">Send Secure Invite Link</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        <strong className="text-white">{newClientData.name}</strong> will receive an OTP invite link to verify their details and complete KYC securely.
                      </p>
                    </div>
                    <div className="flex gap-4 pt-1 border-t border-emerald-500/15">
                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500" /> Send via SMS
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500" /> Send via Email
                      </label>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm mb-1">Manual Partner Entry</h4>
                      <p className="text-xs text-slate-400 mb-3">Upload client's Aadhaar and PAN documents directly from the partner desk.</p>
                    </div>
                    <button type="button" className="w-full py-2 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 rounded-xl text-slate-300 text-xs font-bold transition-colors cursor-pointer text-center">
                      Proceed to Manual Desk KYC
                    </button>
                  </div>
                </div>
                
                <div className="pt-1 flex justify-between">
                  <button onClick={() => setWizardStep(2)} className="px-5 py-2.5 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer">Back</button>
                  <button 
                    onClick={() => {
                      setNotification({ message: `Invitation sent successfully to ${newClientData.phone} and ${newClientData.email}`, type: 'success' });
                      setTimeout(() => setNotification(null), 5000);
                      setIsAddClientOpen(false);
                      setWizardStep(1);
                      setNewClientData({name: "", email: "", phone: "", pan: "", dob: "", clientType: "Individual"});
                    }} 
                    className="flex items-center px-6 py-2.5 bg-emerald-500 text-black rounded-xl font-bold text-xs hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    <Check className="w-4 h-4 mr-1.5" /> Send Invitation & Finish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Partner KYC Inspection & Completion Modal */}
      {selectedKycClient && (
        <PartnerKYCModal
          isOpen={!!selectedKycClient}
          onClose={() => setSelectedKycClient(null)}
          clientId={selectedKycClient.id}
          clientName={selectedKycClient.name}
          onKycUpdated={() => {
            fetchClients();
          }}
        />
      )}

      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${notification.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400' : 'bg-red-950/80 border-red-500/30 text-red-400'} backdrop-blur-xl animate-in slide-in-from-bottom-5 fade-in duration-300`}>
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
