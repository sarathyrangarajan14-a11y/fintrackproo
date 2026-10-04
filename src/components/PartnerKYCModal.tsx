import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, CheckCircle2, AlertCircle, Clock, FileText, 
  Download, Upload, Eye, Edit3, Save, RefreshCw, User, Building, 
  CreditCard, MapPin, Briefcase, FileCheck, ArrowRight, XCircle, ExternalLink
} from 'lucide-react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAuthHeaders } from '../lib/auth-helpers';
import DocumentLightbox from './DocumentLightbox';

interface PartnerKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  clientName?: string;
  onKycUpdated?: () => void;
  onSuccess?: () => void;
}

export default function PartnerKYCModal({
  isOpen,
  onClose,
  clientId,
  clientName,
  onKycUpdated,
  onSuccess
}: PartnerKYCModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'documents' | 'personal' | 'bank' | 'nominee'>('documents');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [actionReason, setActionReason] = useState("");
  const [showReasonModal, setShowReasonModal] = useState<'reject' | 'correction' | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Document Lightbox
  const [lightboxDoc, setLightboxDoc] = useState<{ title: string; url: string; type: string } | null>(null);

  const fetchClientDetails = async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/partner/clients/${clientId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setClientData(data);
        setEditForm({
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
      } else {
        setNotification({ message: 'Failed to fetch client KYC details', type: 'error' });
      }
    } catch (err) {
      console.error("Error fetching client KYC:", err);
      setNotification({ message: 'Error loading KYC details', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && clientId) {
      fetchClientDetails();
      setIsEditing(false);
    }
  }, [isOpen, clientId]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setEditForm((prev: any) => ({ ...prev, [fieldName]: dataUrl }));
      setClientData((prev: any) => ({ ...prev, [fieldName]: dataUrl }));
      setNotification({ message: `${fieldName.replace('Url', '').toUpperCase()} document uploaded locally. Click 'Save KYC Changes' to persist.`, type: 'success' });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDetails = async (targetStatus?: string) => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const payload = {
        ...editForm,
        ...(targetStatus && { kycStatus: targetStatus })
      };

      const res = await fetch(`/api/partner/client/${clientId}/kyc`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setNotification({ 
          message: targetStatus === 'VERIFIED' ? 'KYC verified successfully!' : 'Client KYC details & documents updated!', 
          type: 'success' 
        });
        setIsEditing(false);
        await fetchClientDetails();
        if (onKycUpdated) onKycUpdated();
        if (onSuccess) onSuccess();
      } else {
        const data = await res.json().catch(() => ({}));
        setNotification({ message: data.error || 'Failed to save KYC details', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Error saving KYC details', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (action: 'approve' | 'reject' | 'correction') => {
    if ((action === 'reject' || action === 'correction') && !actionReason.trim()) {
      setNotification({ message: `Please provide a reason for ${action}`, type: 'error' });
      return;
    }

    try {
      setSaving(true);
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/partner/client/${clientId}/kyc-${action}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason: actionReason })
      });

      if (res.ok) {
        setNotification({ message: `KYC status updated: ${action.toUpperCase()}`, type: 'success' });
        setShowReasonModal(null);
        setActionReason('');
        await fetchClientDetails();
        if (onKycUpdated) onKycUpdated();
        if (onSuccess) onSuccess();
      } else {
        setNotification({ message: `Failed to ${action} KYC`, type: 'error' });
      }
    } catch (err) {
      setNotification({ message: `Error processing ${action}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    if (!clientData) return;
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
    doc.text(`Client ID: #${clientData.id} | Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 28);
    doc.text(`Status: ${clientData.kycStatus || 'PENDING'}`, 14, 34);

    const pdfData = [
      ["Full Name", `${clientData.gender || ''} ${clientData.fullName || clientData.name || 'N/A'}`],
      ["Date of Birth", clientData.dob || 'N/A'],
      ["Father's Name", clientData.fatherName || 'N/A'],
      ["Marital Status", clientData.maritalStatus || 'N/A'],
      ["PAN Number", (clientData.pan || 'N/A').toUpperCase()],
      ["Aadhaar Number", clientData.aadhaarNumber || 'N/A'],
      ["Address", `${clientData.address || ''}, ${clientData.city || ''}, ${clientData.state || ''} ${clientData.pincode || ''}`],
      ["Bank Name", clientData.bankName || 'N/A'],
      ["Account Number", clientData.bankAccountNumber || 'N/A'],
      ["IFSC Code", (clientData.bankIfsc || 'N/A').toUpperCase()],
      ["Account Type", clientData.bankAccountType || 'Savings'],
      ["Occupation", clientData.occupation || 'N/A'],
      ["Annual Income", clientData.annualIncome || 'N/A'],
      ["Source of Wealth", clientData.sourceOfIncome || 'N/A'],
      ["FATCA / CRS", clientData.isFatca ? 'Yes' : 'No'],
      ["PEP", clientData.isPep ? 'Yes' : 'No'],
      ["Nominee Name", clientData.nomineeName || 'N/A'],
      ["Nominee Relationship", clientData.nomineeRelation || 'N/A']
    ];

    autoTable(doc, {
      startY: 42,
      head: [["Field", "Verified Information"]],
      body: pdfData,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 9 },
    });

    doc.save(`KYC_${clientData.pan || clientData.id}_${clientData.fullName || 'Client'}.pdf`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"><ShieldCheck className="w-3.5 h-3.5" /> KYC Verified</span>;
      case 'SUBMITTED':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30"><Clock className="w-3.5 h-3.5" /> Pending Verification</span>;
      case 'CORRECTION_REQUIRED':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30"><AlertCircle className="w-3.5 h-3.5" /> Correction Required</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30"><XCircle className="w-3.5 h-3.5" /> KYC Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30"><Clock className="w-3.5 h-3.5" /> Not Started</span>;
    }
  };

  const documentItems = [
    { key: 'panDocumentUrl', label: 'PAN Card', desc: 'Permanent Account Number Card Front', fileKey: 'PAN' },
    { key: 'aadhaarDocumentUrl', label: 'Aadhaar Card', desc: 'UIDAI Aadhaar Card / eAadhaar Front & Back', fileKey: 'Aadhaar' },
    { key: 'bankProofUrl', label: 'Bank Proof / Cheque', desc: 'Cancelled Cheque or Bank Passbook / Statement', fileKey: 'Bank_Proof' },
    { key: 'photoUrl', label: 'In-Person Verification (IPV Photo)', desc: 'Live Client Photo / Webcam Verification', fileKey: 'IPV_Photo' },
    { key: 'signatureUrl', label: 'Client Signature', desc: 'Digital Signature on White Paper / Canvas', fileKey: 'Signature' },
  ];

  return (
    <div 
      id="partner-kyc-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        id="partner-kyc-modal-container"
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#0c1322] border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden text-slate-200"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/10 bg-[#0f172a]/95">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white">
                  {clientData?.fullName || clientData?.name || clientName || 'Client'}
                </h3>
                {clientData && getStatusBadge(clientData.kycStatus)}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Client #{clientId} • {clientData?.email || clientData?.user?.email || 'No email'} • {clientData?.phone || clientData?.user?.phoneNumber || 'No phone'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="export-kyc-pdf-btn"
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
              title="Download Full KYC PDF"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button
              id="edit-kyc-toggle-btn"
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors border ${
                isEditing 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Editing Mode' : 'Edit Details'}</span>
            </button>

            <button
              id="close-kyc-modal-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 md:px-8 border-b border-white/10 bg-[#0f172a]/60 text-xs font-bold overflow-x-auto">
          <button
            id="tab-kyc-documents"
            onClick={() => setActiveTab('documents')}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'documents' 
                ? 'border-emerald-400 text-emerald-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            Documents on File ({documentItems.filter(d => !!clientData?.[d.key]).length}/5)
          </button>
          <button
            id="tab-kyc-personal"
            onClick={() => setActiveTab('personal')}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'personal' 
                ? 'border-emerald-400 text-emerald-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            Personal & Identity
          </button>
          <button
            id="tab-kyc-bank"
            onClick={() => setActiveTab('bank')}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'bank' 
                ? 'border-emerald-400 text-emerald-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            Bank & Mandate
          </button>
          <button
            id="tab-kyc-nominee"
            onClick={() => setActiveTab('nominee')}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'nominee' 
                ? 'border-emerald-400 text-emerald-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Profile & Nominee
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
              <p className="text-sm font-medium">Loading client KYC records and documents...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: DOCUMENTS ON FILE */}
              {activeTab === 'documents' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                    <div>
                      <h4 className="text-base font-bold text-white">Submitted KYC Documents</h4>
                      <p className="text-xs text-slate-400">Click any document to inspect full preview in high resolution or upload scans directly.</p>
                    </div>
                    {isEditing && (
                      <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-bold">
                        Upload / Replace active
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documentItems.map((doc) => {
                      const docUrl = clientData?.[doc.key] || editForm?.[doc.key];
                      const hasDoc = Boolean(docUrl && docUrl.length > 20);

                      return (
                        <div
                          key={doc.key}
                          className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition-all"
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                              <p className="text-sm font-bold text-white">{doc.label}</p>
                              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{doc.desc}</p>
                            </div>
                            {hasDoc ? (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0">
                                Uploaded
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0">
                                Missing
                              </span>
                            )}
                          </div>

                          {/* Document Preview Box */}
                          <div className="relative w-full h-36 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center group mb-3">
                            {hasDoc ? (
                              <>
                                {docUrl.startsWith('data:application/pdf') || docUrl.endsWith('.pdf') ? (
                                  <div className="flex flex-col items-center justify-center text-emerald-400 p-3">
                                    <FileText className="w-10 h-10 mb-1" />
                                    <span className="text-xs font-mono font-bold">PDF Document</span>
                                  </div>
                                ) : (
                                  <img
                                    src={docUrl}
                                    alt={doc.label}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                  />
                                )}
                                <div 
                                  onClick={() => setLightboxDoc({ title: `${doc.label} - #${clientId}`, url: docUrl, type: doc.label })}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity cursor-pointer backdrop-blur-[2px]"
                                >
                                  <button className="px-3 py-1.5 bg-emerald-500 text-black font-bold text-xs rounded-lg flex items-center gap-1 shadow-lg">
                                    <Eye className="w-3.5 h-3.5" /> Inspect Preview
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-slate-600 text-xs">
                                <FileText className="w-8 h-8 mb-1 opacity-40" />
                                <span>No document uploaded</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {hasDoc && (
                              <button
                                onClick={() => setLightboxDoc({ title: `${doc.label} - #${clientId}`, url: docUrl, type: doc.label })}
                                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                View Full
                              </button>
                            )}

                            <label className="flex-1 py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center">
                              <Upload className="w-3.5 h-3.5" />
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
              )}

              {/* TAB 2: PERSONAL & IDENTITY */}
              {activeTab === 'personal' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Full Legal Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.fullName}
                            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          />
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.fullName || clientData?.name || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Date of Birth (DOB)</label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editForm.dob}
                            onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          />
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.dob || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Gender</label>
                        {isEditing ? (
                          <select
                            value={editForm.gender}
                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.gender || 'Not specified'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Father's / Spouse's Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.fatherName}
                            onChange={(e) => setEditForm({ ...editForm, fatherName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          />
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.fatherName || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Marital Status</label>
                        {isEditing ? (
                          <select
                            value={editForm.maritalStatus}
                            onChange={(e) => setEditForm({ ...editForm, maritalStatus: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          >
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.maritalStatus || 'Single'}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">Residential Address</label>
                        {isEditing ? (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                            <input
                              type="text"
                              placeholder="Street Address"
                              value={editForm.address}
                              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                              className="md:col-span-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="City"
                              value={editForm.city}
                              onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Pincode"
                              value={editForm.pincode}
                              onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                            />
                          </div>
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {[clientData?.address, clientData?.city, clientData?.state, clientData?.pincode].filter(Boolean).join(', ') || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                      Government Identity
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">PAN Number</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.pan}
                            onChange={(e) => setEditForm({ ...editForm, pan: e.target.value.toUpperCase() })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono uppercase"
                          />
                        ) : (
                          <p className="font-bold text-white font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 uppercase">
                            {clientData?.pan || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Aadhaar (Last 4 Digits / Masked)</label>
                        {isEditing ? (
                          <input
                            type="text"
                            placeholder="XXXX-XXXX-1234"
                            value={editForm.aadhaarNumber}
                            onChange={(e) => setEditForm({ ...editForm, aadhaarNumber: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono"
                          />
                        ) : (
                          <p className="font-bold text-white font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.aadhaarNumber ? `•••• •••• ${clientData.aadhaarNumber.slice(-4)}` : 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BANK & MANDATE */}
              {activeTab === 'bank' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                      Bank Account Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Bank Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.bankName}
                            onChange={(e) => setEditForm({ ...editForm, bankName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          />
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.bankName || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Account Holder Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.bankAccountName}
                            onChange={(e) => setEditForm({ ...editForm, bankAccountName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          />
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.bankAccountName || clientData?.fullName || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Bank Account Number</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.bankAccountNumber}
                            onChange={(e) => setEditForm({ ...editForm, bankAccountNumber: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono"
                          />
                        ) : (
                          <p className="font-bold text-white font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.bankAccountNumber || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">IFSC Code</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.bankIfsc}
                            onChange={(e) => setEditForm({ ...editForm, bankIfsc: e.target.value.toUpperCase() })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono uppercase"
                          />
                        ) : (
                          <p className="font-bold text-white font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 uppercase">
                            {clientData?.bankIfsc || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Account Type</label>
                        {isEditing ? (
                          <select
                            value={editForm.bankAccountType}
                            onChange={(e) => setEditForm({ ...editForm, bankAccountType: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          >
                            <option value="Savings">Savings Account</option>
                            <option value="Current">Current Account</option>
                            <option value="NRE">NRE Account</option>
                            <option value="NRO">NRO Account</option>
                          </select>
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.bankAccountType || 'Savings Account'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PROFILE & NOMINEE */}
              {activeTab === 'nominee' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                      Investor Profile & Declarations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Occupation</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.occupation}
                            onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          />
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.occupation || 'Salaried / Professional'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Annual Income Bracket</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.annualIncome}
                            onChange={(e) => setEditForm({ ...editForm, annualIncome: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          />
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.annualIncome || '10 Lakh - 25 Lakh'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Source of Wealth</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.sourceOfIncome}
                            onChange={(e) => setEditForm({ ...editForm, sourceOfIncome: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          />
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.sourceOfIncome || 'Salary & Business'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">FATCA / PEP Declaration</label>
                        <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          FATCA: {clientData?.isFatca ? 'Yes (Tax Resident Outside India)' : 'No (Resident Indian)'} • PEP: {clientData?.isPep ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                      Nominee Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Nominee Full Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.nomineeName}
                            onChange={(e) => setEditForm({ ...editForm, nomineeName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          />
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.nomineeName || 'Not specified'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Relationship with Investor</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.nomineeRelation}
                            onChange={(e) => setEditForm({ ...editForm, nomineeRelation: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          />
                        ) : (
                          <p className="font-bold text-white bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            {clientData?.nomineeRelation || 'Not specified'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 md:px-8 py-4 border-t border-white/10 bg-[#0f172a]/95">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                id="save-kyc-changes-btn"
                onClick={() => handleSaveDetails()}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save KYC Changes'}</span>
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {clientData?.kycStatus !== 'VERIFIED' ? (
              <>
                <button
                  id="request-correction-btn"
                  onClick={() => setShowReasonModal('correction')}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs transition-colors disabled:opacity-50"
                >
                  Request Correction
                </button>
                <button
                  id="reject-kyc-btn"
                  onClick={() => setShowReasonModal('reject')}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  id="approve-kyc-btn"
                  onClick={() => handleAction('approve')}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saving ? 'Processing...' : 'Approve & Verify KYC'}</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  All KYC checks verified & approved
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REASON MODAL (Reject or Correction) */}
      {showReasonModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-2">
              {showReasonModal === 'reject' ? 'Reject Client KYC' : 'Request KYC Correction'}
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              {showReasonModal === 'reject' 
                ? 'Specify the rejection reason. The client will be notified to restart onboarding.'
                : 'Explain what documents or details need correction (e.g. "Upload clearer PAN Card image").'}
            </p>
            <textarea
              id="reason-textarea"
              rows={4}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="Enter specific instructions or reason..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-emerald-500 mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => { setShowReasonModal(null); setActionReason(''); }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(showReasonModal)}
                disabled={!actionReason.trim() || saving}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-colors disabled:opacity-50 ${
                  showReasonModal === 'reject' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600 text-black'
                }`}
              >
                {saving ? 'Submitting...' : showReasonModal === 'reject' ? 'Confirm Rejection' : 'Send Correction Request'}
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-[120] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border ${
          notification.type === 'success' ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-300' : 'bg-red-950/95 border-red-500/50 text-red-300'
        } backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200`}>
          <p className="text-xs font-bold">{notification.message}</p>
          <button onClick={() => setNotification(null)} className="opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}
