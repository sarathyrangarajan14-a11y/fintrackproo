import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { auth } from "../../lib/firebase";
import { getAuthHeaders } from "../../lib/auth-helpers";
import { 
  ArrowLeft, User, ShieldCheck, Mail, Phone, MapPin, 
  ShoppingCart, Clock, Settings, Users, Briefcase, 
  FileText, TrendingUp, RefreshCw, Layers, Crosshair,
  CheckCircle, Plus, Copy, Link2, Download, AlertCircle, XCircle, Wallet, Trash2,
  History, PlusCircle, Eye, Upload, Edit3, Save, CheckCircle2
} from 'lucide-react';
import ActivityLog from '../../components/ActivityLog';
import DocumentLightbox from '../../components/DocumentLightbox';

export default function PartnerClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingKyc, setSavingKyc] = useState(false);
  const [isEditingKyc, setIsEditingKyc] = useState(false);
  const [kycForm, setKycForm] = useState<any>({});
  const [rejectionReason, setRejectionReason] = useState("");
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Document Lightbox State
  const [lightboxDoc, setLightboxDoc] = useState<{ title: string; url: string; type: string } | null>(null);

  const fetchClient = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/partner/clients/${id}`, {
        headers
      });
      if (res.ok) {
        const data = await res.json();
        setClient(data);
        setKycForm({
          fullName: data.fullName || data.name || data.user?.fullName || '',
          gender: data.gender || '',
          dob: data.dob || '',
          fatherName: data.fatherName || '',
          maritalStatus: data.maritalStatus || 'Single',
          pan: data.pan || '',
          aadhaarNumber: data.aadhaarNumber || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          bankName: data.bankName || '',
          bankAccountNumber: data.bankAccountNumber || '',
          bankIfsc: data.bankIfsc || '',
          bankAccountType: data.bankAccountType || 'Savings',
          bankAccountName: data.bankAccountName || data.fullName || '',
          occupation: data.occupation || 'Salaried',
          annualIncome: data.annualIncome || '10-25L',
          sourceOfIncome: data.sourceOfIncome || 'Salary',
          investmentExperience: data.investmentExperience || '3-5 Years',
          isFatca: data.isFatca || false,
          isPep: data.isPep || false,
          nomineeName: data.nomineeName || '',
          nomineeRelation: data.nomineeRelation || '',
          panDocumentUrl: data.panDocumentUrl || '',
          aadhaarDocumentUrl: data.aadhaarDocumentUrl || '',
          bankProofUrl: data.bankProofUrl || '',
          photoUrl: data.photoUrl || '',
          signatureUrl: data.signatureUrl || ''
        });

        if (data.kycStatus === 'SUBMITTED' && activeTab === 'overview') {
           setActiveTab('kyc');
        }
      }
    } catch (err) {
      console.error("Failed to fetch client", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchClient();
    });
    return () => unsubscribe();
  }, [id]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'activity-log', label: 'Activity Log', icon: History },
    { id: 'mutual-funds', label: 'Mutual Funds', icon: Briefcase },
    { id: 'kyc', label: 'KYC Details', icon: ShieldCheck }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setKycForm((prev: any) => ({ ...prev, [fieldName]: dataUrl }));
      setClient((prev: any) => ({ ...prev, [fieldName]: dataUrl }));
      setNotification({ message: `${fieldName.replace('Url', '').toUpperCase()} document uploaded. Click 'Save KYC Changes' to persist.`, type: 'success' });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveKycDetails = async (targetStatus?: string) => {
    setSavingKyc(true);
    try {
      const headers = await getAuthHeaders();
      const payload = {
        ...kycForm,
        ...(targetStatus && { kycStatus: targetStatus })
      };

      const res = await fetch(`/api/partner/client/${id}/kyc`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setNotification({ 
          message: targetStatus === 'VERIFIED' ? 'KYC verified successfully!' : 'Client KYC details & documents updated!', 
          type: 'success' 
        });
        setIsEditingKyc(false);
        await fetchClient();
      } else {
        const data = await res.json().catch(() => ({}));
        setNotification({ message: data.error || 'Failed to save KYC details', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Error saving KYC details', type: 'error' });
    } finally {
      setSavingKyc(false);
    }
  };
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(16, 185, 129);
    doc.setFont("helvetica", "bold");
    doc.text("FinTrackPro | VELOCITY WEALTH", 14, 18);
    doc.setFontSize(13);
    doc.setTextColor(51, 65, 85);
    doc.text("Client KYC Application & Verification Record", 14, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Client ID: #${client.id} | Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 30);
    doc.text(`Client: ${client.fullName || client.name || client.user?.fullName || client.user?.email || 'N/A'}`, 14, 36);
    doc.text(`Status: ${client.kycStatus || 'PENDING'}`, 14, 42);

    const data = [
      ["Full Legal Name", `${client.gender || ''} ${client.fullName || client.name || 'N/A'}`],
      ["Date of Birth", client.dob || 'N/A'],
      ["Father's / Spouse Name", client.fatherName || 'N/A'],
      ["Marital Status", client.maritalStatus || 'N/A'],
      ["PAN Number", (client.pan || 'N/A').toUpperCase()],
      ["Aadhaar Number", client.aadhaarNumber || 'N/A'],
      ["Residential Address", [client.address, client.city, client.state, client.pincode].filter(Boolean).join(', ') || 'N/A'],
      ["Bank Name", client.bankName || 'N/A'],
      ["Account Number", client.bankAccountNumber || 'N/A'],
      ["IFSC Code", (client.bankIfsc || 'N/A').toUpperCase()],
      ["Account Type", client.bankAccountType || 'Savings'],
      ["Occupation", client.occupation || 'N/A'],
      ["Annual Income", client.annualIncome || 'N/A'],
      ["Source of Wealth", client.sourceOfIncome || 'N/A'],
      ["FATCA / CRS", client.isFatca ? 'Yes' : 'No'],
      ["PEP", client.isPep ? 'Yes' : 'No'],
      ["Nominee Name", client.nomineeName || 'N/A'],
      ["Nominee Relationship", client.nomineeRelation || 'N/A']
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Field", "Verified Information"]],
      body: data,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 9 },
    });
    
    doc.save(`KYC_Form_${client.pan || client.id}_${client.fullName || 'Client'}.pdf`);
  };

  const handleDeleteClient = async () => {
    try {
      setIsDeleting(true);
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/partner/client/${id}`, {
        method: "DELETE",
        headers
      });
      if (res.ok) {
        setNotification({ message: "Client deleted successfully from database", type: "success" });
        setTimeout(() => {
          navigate("/partner/clients");
        }, 1200);
      } else {
        const errData = await res.json().catch(() => ({}));
        setNotification({ message: errData.error || "Failed to delete client", type: "error" });
        setIsDeleting(false);
        setShowDeleteModal(false);
      }
    } catch (err) {
      setNotification({ message: "Error deleting client", type: "error" });
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleAction = async (action: 'approve' | 'reject' | 'correction') => {
    if ((action === 'reject' || action === 'correction') && !rejectionReason) {
      setNotification({ message: `Please provide a reason for ${action}`, type: 'error' });
      return;
    }
    
    try {
      const headers = await getAuthHeaders();
      
      const res = await fetch(`/api/partner/client/${id}/kyc-${action}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ reason: rejectionReason })
      });
      
      if (res.ok) {
        setNotification({ message: `KYC ${action} successfully`, type: 'success' });
        setClient({...client, kycStatus: action === 'approve' ? 'VERIFIED' : action === 'reject' ? 'REJECTED' : 'CORRECTION_REQUIRED'});
        setRejectionReason("");
      } else {
        setNotification({ message: `Failed to ${action} KYC`, type: 'error' });
      }
    } catch (err) {
      setNotification({ message: `Error during KYC ${action}`, type: 'error' });
    }
  };

  if (loading) return <div className="text-white p-8">Loading client details...</div>;
  if (!client) return <div className="text-white p-8">Client not found</div>;

  const documentItems = [
    { key: 'panDocumentUrl', label: 'PAN Card', desc: 'Permanent Account Number' },
    { key: 'aadhaarDocumentUrl', label: 'Aadhaar Card', desc: 'UIDAI Aadhaar Document' },
    { key: 'bankProofUrl', label: 'Bank Proof', desc: 'Cancelled Cheque / Statement' },
    { key: 'photoUrl', label: 'Live Photo (IPV)', desc: 'In-Person Verification' },
    { key: 'signatureUrl', label: 'Client Signature', desc: 'Digital Signature' },
  ];

  return (
    <div className="space-y-6 relative z-10 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/partner/clients" className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {client.fullName || client.user?.fullName || 'Client'}
              {client.kycStatus === 'VERIFIED' && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
            </h1>
            <div className="flex gap-4 mt-1 text-sm text-slate-400">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> ID: {client.id}</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {client.user?.phoneNumber || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Client
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 shrink-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === item.id 
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl">
              <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
                <span>Client Profile & Mandate Summary</span>
                <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold">
                  {client.kycStatus || 'ACTIVE'}
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60">
                  <p className="text-xs text-slate-400 font-medium">KYC Verification</p>
                  <p className="text-base font-bold text-emerald-400 mt-1">{client.kycStatus}</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60">
                  <p className="text-xs text-slate-400 font-medium">PAN Number</p>
                  <p className="text-base font-bold text-white mt-1 uppercase font-mono">{client.pan || 'N/A'}</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60">
                  <p className="text-xs text-slate-400 font-medium">Email Address</p>
                  <p className="text-base font-bold text-white mt-1 truncate">{client.user?.email || 'N/A'}</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60">
                  <p className="text-xs text-slate-400 font-medium">Risk Appetite</p>
                  <p className="text-base font-bold text-teal-400 mt-1">{client.riskProfile || 'Moderate Growth'}</p>
                </div>
              </div>

              {/* Quick Jump to Activity Log */}
              <div className="mt-6 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">SIP History & Audit Trail</h4>
                    <p className="text-xs text-slate-400">Track all creations, modifications, pauses, and cancellations</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('activity-log')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl shadow-md transition-colors whitespace-nowrap"
                >
                  View Activity Ledger
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity-log' && (
          <ActivityLog
            clientId={id!}
            clientName={client.fullName || client.user?.fullName || 'Client'}
            clientPhone={client.phone || client.user?.phone || client.user?.phoneNumber}
            onRefreshParent={fetchClient}
          />
        )}

        {activeTab === 'mutual-funds' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  Mutual Funds & Active SIPs
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage active mandates and recurring investments for {client.fullName || client.user?.fullName || 'Client'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('activity-log')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <History className="w-4 h-4" />
                View Full SIP Activity Log
              </button>
            </div>

            {/* Embedded Activity Log view directly in Mutual Funds as well */}
            <ActivityLog
              clientId={id!}
              clientName={client.fullName || client.user?.fullName || 'Client'}
              clientPhone={client.phone || client.user?.phone || client.user?.phoneNumber}
              onRefreshParent={fetchClient}
            />
          </div>
        )}

        {activeTab === 'kyc' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 text-white space-y-8 shadow-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  Client KYC Profile & Documents
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect submitted government documents, verify investor details, or edit and complete KYC on behalf of client.
                </p>
              </div>
               
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  client.kycStatus === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                  client.kycStatus === 'SUBMITTED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  client.kycStatus === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {client.kycStatus || 'NOT_STARTED'}
                </span>

                <button
                  id="clientdetail-edit-kyc-btn"
                  onClick={() => setIsEditingKyc(!isEditingKyc)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border ${
                    isEditingKyc 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditingKyc ? 'Cancel Edit' : 'Edit KYC'}</span>
                </button>

                <button 
                  onClick={handleExportPDF} 
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-bold"
                >
                  <Download className="w-4 h-4 mr-1" /> Export PDF
                </button>
              </div>
            </div>

            {/* DOCUMENTS GALLERY */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  Submitted Government Documents & Scans ({documentItems.filter(d => !!(client[d.key] || kycForm[d.key])).length}/5)
                </h3>
                {isEditingKyc && (
                  <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    Upload Scans Active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {documentItems.map((doc) => {
                  const docUrl = client[doc.key] || kycForm[doc.key];
                  const hasDoc = Boolean(docUrl && docUrl.length > 20);

                  return (
                    <div 
                      key={doc.key} 
                      className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col justify-between transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-white truncate" title={doc.label}>{doc.label}</p>
                        {hasDoc ? (
                          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-bold uppercase">
                            Available
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[9px] font-bold uppercase">
                            Missing
                          </span>
                        )}
                      </div>

                      {/* Preview Box */}
                      <div className="relative w-full h-32 bg-slate-900 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center group mb-3">
                        {hasDoc ? (
                          <>
                            {docUrl.startsWith('data:application/pdf') || docUrl.endsWith('.pdf') ? (
                              <div className="flex flex-col items-center justify-center text-emerald-400 p-2">
                                <FileText className="w-8 h-8 mb-1" />
                                <span className="text-[10px] font-mono font-bold">PDF Document</span>
                              </div>
                            ) : (
                              <img
                                src={docUrl}
                                alt={doc.label}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            )}
                            <div 
                              onClick={() => setLightboxDoc({ title: `${doc.label} - ${client.fullName || client.name || 'Client'}`, url: docUrl, type: doc.label })}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity cursor-pointer backdrop-blur-[2px]"
                            >
                              <button className="px-2.5 py-1 bg-emerald-500 text-black font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-lg">
                                <Eye className="w-3.5 h-3.5" /> Inspect
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-600 text-xs">
                            <FileText className="w-7 h-7 mb-1 opacity-30" />
                            <span className="text-[10px]">No file</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        {hasDoc && (
                          <button
                            onClick={() => setLightboxDoc({ title: `${doc.label} - ${client.fullName || client.name || 'Client'}`, url: docUrl, type: doc.label })}
                            className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-emerald-400" />
                            View
                          </button>
                        )}
                        <label className="flex-1 py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>{hasDoc ? 'Replace' : 'Upload'}</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e, doc.key)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DETAILS SECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
               {/* Left Column: Personal & Identity */}
               <div className="space-y-6">
                 <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                   <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
                     <User className="w-4 h-4" /> Personal & Identity Details
                   </h3>

                   <div className="grid grid-cols-2 gap-3 text-xs">
                     <div>
                       <span className="text-slate-400 block mb-1">Full Legal Name</span>
                       {isEditingKyc ? (
                         <input 
                           type="text" 
                           value={kycForm.fullName} 
                           onChange={(e) => setKycForm({...kycForm, fullName: e.target.value})} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white" 
                         />
                       ) : (
                         <span className="font-bold text-white block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {client.gender ? `${client.gender} ` : ''}{client.fullName || client.name || client.user?.fullName || 'Not provided'}
                         </span>
                       )}
                     </div>

                     <div>
                       <span className="text-slate-400 block mb-1">Date of Birth (DOB)</span>
                       {isEditingKyc ? (
                         <input 
                           type="date" 
                           value={kycForm.dob} 
                           onChange={(e) => setKycForm({...kycForm, dob: e.target.value})} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white" 
                         />
                       ) : (
                         <span className="font-bold text-white block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {client.dob || 'Not provided'}
                         </span>
                       )}
                     </div>

                     <div>
                       <span className="text-slate-400 block mb-1">Father's / Spouse's Name</span>
                       {isEditingKyc ? (
                         <input 
                           type="text" 
                           value={kycForm.fatherName} 
                           onChange={(e) => setKycForm({...kycForm, fatherName: e.target.value})} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white" 
                         />
                       ) : (
                         <span className="font-bold text-white block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {client.fatherName || 'Not provided'}
                         </span>
                       )}
                     </div>

                     <div>
                       <span className="text-slate-400 block mb-1">Marital Status</span>
                       {isEditingKyc ? (
                         <select 
                           value={kycForm.maritalStatus} 
                           onChange={(e) => setKycForm({...kycForm, maritalStatus: e.target.value})} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                         >
                           <option value="Single">Single</option>
                           <option value="Married">Married</option>
                           <option value="Other">Other</option>
                         </select>
                       ) : (
                         <span className="font-bold text-white block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {client.maritalStatus || 'Single'}
                         </span>
                       )}
                     </div>

                     <div>
                       <span className="text-slate-400 block mb-1">PAN Number</span>
                       {isEditingKyc ? (
                         <input 
                           type="text" 
                           value={kycForm.pan} 
                           onChange={(e) => setKycForm({...kycForm, pan: e.target.value.toUpperCase()})} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono uppercase" 
                         />
                       ) : (
                         <span className="font-bold text-white font-mono uppercase block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {client.pan || 'Not provided'}
                         </span>
                       )}
                     </div>

                     <div>
                       <span className="text-slate-400 block mb-1">Aadhaar (Last 4 / Masked)</span>
                       {isEditingKyc ? (
                         <input 
                           type="text" 
                           value={kycForm.aadhaarNumber} 
                           onChange={(e) => setKycForm({...kycForm, aadhaarNumber: e.target.value})} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono" 
                         />
                       ) : (
                         <span className="font-bold text-white font-mono block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {client.aadhaarNumber ? `•••• •••• ${client.aadhaarNumber.slice(-4)}` : 'Not provided'}
                         </span>
                       )}
                     </div>

                     <div className="col-span-2">
                       <span className="text-slate-400 block mb-1">Residential Address</span>
                       {isEditingKyc ? (
                         <div className="grid grid-cols-3 gap-2">
                           <input 
                             type="text" 
                             placeholder="Street address"
                             value={kycForm.address} 
                             onChange={(e) => setKycForm({...kycForm, address: e.target.value})} 
                             className="col-span-2 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white" 
                           />
                           <input 
                             type="text" 
                             placeholder="City"
                             value={kycForm.city} 
                             onChange={(e) => setKycForm({...kycForm, city: e.target.value})} 
                             className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white" 
                           />
                         </div>
                       ) : (
                         <span className="font-bold text-white block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {[client.address, client.city, client.state, client.pincode].filter(Boolean).join(', ') || 'Not provided'}
                         </span>
                       )}
                     </div>
                   </div>
                 </div>
               </div>

               {/* Right Column: Bank & Investor Profile */}
               <div className="space-y-6">
                 <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                   <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
                     <Wallet className="w-4 h-4" /> Bank Account & Nominee Details
                   </h3>

                   <div className="grid grid-cols-2 gap-3 text-xs">
                     <div>
                       <span className="text-slate-400 block mb-1">Bank Name</span>
                       {isEditingKyc ? (
                         <input 
                           type="text" 
                           value={kycForm.bankName} 
                           onChange={(e) => setKycForm({...kycForm, bankName: e.target.value})} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white" 
                         />
                       ) : (
                         <span className="font-bold text-white block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {client.bankName || 'Not provided'}
                         </span>
                       )}
                     </div>

                     <div>
                       <span className="text-slate-400 block mb-1">Account Number</span>
                       {isEditingKyc ? (
                         <input 
                           type="text" 
                           value={kycForm.bankAccountNumber} 
                           onChange={(e) => setKycForm({...kycForm, bankAccountNumber: e.target.value})} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono" 
                         />
                       ) : (
                         <span className="font-bold text-white font-mono block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {client.bankAccountNumber || 'Not provided'}
                         </span>
                       )}
                     </div>

                     <div>
                       <span className="text-slate-400 block mb-1">IFSC Code</span>
                       {isEditingKyc ? (
                         <input 
                           type="text" 
                           value={kycForm.bankIfsc} 
                           onChange={(e) => setKycForm({...kycForm, bankIfsc: e.target.value.toUpperCase()})} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono uppercase" 
                         />
                       ) : (
                         <span className="font-bold text-white font-mono uppercase block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {client.bankIfsc || 'Not provided'}
                         </span>
                       )}
                     </div>

                     <div>
                       <span className="text-slate-400 block mb-1">Occupation</span>
                       {isEditingKyc ? (
                         <input 
                           type="text" 
                           value={kycForm.occupation} 
                           onChange={(e) => setKycForm({...kycForm, occupation: e.target.value})} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white" 
                         />
                       ) : (
                         <span className="font-bold text-white block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {client.occupation || 'Salaried / Professional'}
                         </span>
                       )}
                     </div>

                     <div>
                       <span className="text-slate-400 block mb-1">Annual Income Bracket</span>
                       <span className="font-bold text-white block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                         {client.annualIncome || '10 Lakh - 25 Lakh'}
                       </span>
                     </div>

                     <div>
                       <span className="text-slate-400 block mb-1">Source of Wealth</span>
                       <span className="font-bold text-white block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                         {client.sourceOfIncome || 'Salary'}
                       </span>
                     </div>

                     <div>
                       <span className="text-slate-400 block mb-1">Nominee Full Name</span>
                       {isEditingKyc ? (
                         <input 
                           type="text" 
                           value={kycForm.nomineeName} 
                           onChange={(e) => setKycForm({...kycForm, nomineeName: e.target.value})} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white" 
                         />
                       ) : (
                         <span className="font-bold text-white block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {client.nomineeName || 'Not specified'}
                         </span>
                       )}
                     </div>

                     <div>
                       <span className="text-slate-400 block mb-1">Nominee Relationship</span>
                       {isEditingKyc ? (
                         <input 
                           type="text" 
                           value={kycForm.nomineeRelation} 
                           onChange={(e) => setKycForm({...kycForm, nomineeRelation: e.target.value})} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white" 
                         />
                       ) : (
                         <span className="font-bold text-white block bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                           {client.nomineeRelation || 'Not specified'}
                         </span>
                       )}
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            {/* In-place Save Bar */}
            {isEditingKyc && (
              <div className="flex items-center justify-end gap-3 p-4 bg-slate-800/80 border border-amber-500/30 rounded-2xl">
                <button
                  onClick={() => setIsEditingKyc(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveKycDetails()}
                  disabled={savingKyc}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingKyc ? 'Saving...' : 'Save KYC Changes'}</span>
                </button>
              </div>
            )}

            {/* PARTNER VERIFICATION CONTROLS */}
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">Partner KYC Verification Status</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Approve client to unlock SIP investment mandates or request corrections.</p>
                </div>
                {client.kycStatus === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" /> Verified & Active
                  </span>
                )}
              </div>

              {client.kycStatus !== 'VERIFIED' && (
                <>
                  <textarea 
                    placeholder="Reason for correction or rejection (Optional for Approval, Required for Rejection/Correction)"
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-emerald-500 min-h-[70px]"
                  />
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => handleAction('approve')} className="flex-1 bg-emerald-500 text-black font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-400 shadow-lg shadow-emerald-500/20">
                      Approve & Verify KYC
                    </button>
                    <button onClick={() => handleAction('correction')} className="flex-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold py-2.5 rounded-xl text-xs hover:bg-amber-500/20">
                      Request Correction
                    </button>
                    <button onClick={() => handleAction('reject')} className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 font-bold py-2.5 rounded-xl text-xs hover:bg-red-500/20">
                      Reject KYC
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DOCUMENT LIGHTBOX */}
      {lightboxDoc && (
        <DocumentLightbox
          isOpen={!!lightboxDoc}
          onClose={() => setLightboxDoc(null)}
          title={lightboxDoc.title}
          url={lightboxDoc.url}
          documentType={lightboxDoc.type}
        />
      )}

      {notification && (
        <div className={`absolute bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${notification.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-400' : 'bg-red-950/90 border-red-500/50 text-red-400'} backdrop-blur-xl animate-in slide-in-from-bottom-5 fade-in duration-300`}>
          <div className="font-bold text-sm">{notification.message}</div>
          <button onClick={() => setNotification(null)} className="opacity-50 hover:opacity-100"><XCircle className="h-4 w-4" /></button>
        </div>
      )}

      {/* DELETE CLIENT CONFIRMATION MODAL */}
      {showDeleteModal && (
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
              Are you sure you want to delete <strong className="text-white font-bold">{client.fullName || client.user?.fullName || 'this client'}</strong> (Client ID: #{client.id})? All linked portfolios, SIPs, mandates, transactions, and CRM history will be permanently deleted from the database.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-sm font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClient}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
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
    </div>
  );
}

