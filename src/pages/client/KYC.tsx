import { useState, useEffect, useRef } from "react";
import { CheckCircle2, FileText, Upload, Camera, X, Smartphone, PenTool, ShieldCheck, ArrowRight, Save, User, Building, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import SignatureCanvas from 'react-signature-canvas';

export default function KYC() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState<string>(() => localStorage.getItem('client_kyc_status') || 'NOT_STARTED');
  const [kycRejectionReason, setKycRejectionReason] = useState<string>('');
  const navigate = useNavigate();
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  const [kycData, setKycData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    fatherName: "",
    mobile: "",
    email: "",
    maritalStatus: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    pan: "",
    aadhaarNumber: "",
    bankAccountName: "",
    bankName: "",
    bankAccountNumber: "",
    bankIfsc: "",
    bankAccountType: "Savings",
    occupation: "",
    annualIncome: "",
    sourceOfIncome: "",
    investmentExperience: "",
    isFatca: false,
    isPep: false,
    nomineeName: "",
    nomineeRelation: "",
    panDocumentUrl: "",
    aadhaarDocumentUrl: "",
    bankProofUrl: "",
    photoUrl: "",
    signatureUrl: ""
  });

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        
        // Auto-fill email and mobile from user profile
        setKycData(prev => ({
          ...prev,
          email: user.email || "",
          mobile: user.phoneNumber || "",
          fullName: user.displayName || ""
        }));

        const token = await user.getIdToken();
        const res = await fetch("/api/client/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const status = data.kycStatus || 'NOT_STARTED';
          setKycStatus(status);
          localStorage.setItem('client_kyc_status', status);
          setKycRejectionReason(data.kycRejectionReason || '');
          if (data.kycStatus && data.kycStatus !== 'NOT_STARTED') {
             // Load existing data
             setKycData(prev => ({
                ...prev,
                ...data
             }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    
    auth.onAuthStateChanged((user) => {
      if (user) fetchProfile();
    });
  }, []);

  const handleNext = () => setStep(s => Math.min(s + 1, 6));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  // Simulated File Uploads (In prod: Upload to Firebase Storage and get URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            setKycData(prev => ({ ...prev, [field]: dataUrl }));
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        // Fallback for PDF or other types. Just limit size manually?
        if (file.size > 500 * 1024) {
           alert("File is too large! Please upload a file smaller than 500KB.");
           return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setKycData(prev => ({ ...prev, [field]: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        kycData.signatureUrl = sigCanvas.current.toDataURL();
      }
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      
      const res = await fetch("/api/client/kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({...kycData, isDraft: true})
      });
      
      if (res.ok) {
        setKycStatus('PENDING');
        setNotification({ message: "Draft saved successfully", type: 'success' });
      } else {
        setNotification({ message: "Failed to save draft", type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setNotification({ message: "Error saving draft", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        kycData.signatureUrl = sigCanvas.current.toDataURL();
      }

      const user = auth.currentUser;
      const token = await user?.getIdToken();
      
      const res = await fetch("/api/client/kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(kycData)
      });
      
      if (res.ok) {
        setKycStatus('SUBMITTED');
        setNotification({ message: "KYC submitted successfully", type: 'success' });
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        setNotification({ message: "Failed to submit KYC", type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setNotification({ message: "Error submitting KYC", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (kycStatus === 'VERIFIED') {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-xl border border-emerald-500/30 rounded-[32px] p-8 shadow-2xl text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/20 mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">KYC VERIFIED</h2>
          <p className="text-slate-400 mb-8">
            Your KYC has been successfully verified. You can now invest in mutual fund schemes.
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="w-full inline-flex justify-center py-3 px-8 border border-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)] text-sm font-bold rounded-xl text-black bg-emerald-400 hover:bg-emerald-500 transition-colors"
          >
            Browse Mutual Funds
          </button>
        </div>
      </div>
    );
  }

  if (kycStatus === 'SUBMITTED') {
    return (
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md mx-auto w-full bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-[32px] p-8 shadow-2xl text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-500/20 mb-6">
            <ShieldCheck className="h-10 w-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">KYC Under Review</h2>
          <p className="text-slate-400 mb-8">
            Your KYC application has been submitted and is pending verification from your partner. We will notify you once it is approved.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full inline-flex justify-center py-3 px-8 border border-slate-600 text-sm font-bold rounded-xl text-white bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full max-h-full flex items-center justify-center p-2 overflow-hidden relative z-10">
      <div className="max-w-5xl w-full mx-auto my-auto bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between max-h-[calc(100vh-6.5rem)] overflow-hidden">
        
        {/* Compact Top Header & Stepper */}
        <div className="shrink-0 mb-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none">Paperless Digital KYC</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">SEBI (Mutual Funds) Regulations Compliant Onboarding</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                Step {step} of 6
              </span>
            </div>
          </div>

          {/* Horizontal Progress Stepper Bar */}
          <div className="grid grid-cols-6 gap-1.5">
            {[
              { num: 1, label: "Personal" },
              { num: 2, label: "PAN & Aadhaar" },
              { num: 3, label: "Bank Account" },
              { num: 4, label: "Investor Profile" },
              { num: 5, label: "Photo & Sign" },
              { num: 6, label: "Review & Submit" }
            ].map((s) => (
              <div
                key={s.num}
                className={`py-1 px-1.5 rounded-lg border text-center transition-all flex items-center justify-center gap-1 ${
                  step === s.num
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                    : step > s.num
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
                }`}
              >
                <span className="text-[10px] truncate">
                  {step > s.num ? '✓' : s.num}. {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {kycStatus === 'CORRECTION_REQUIRED' && (
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-xl p-2 mb-2 shrink-0">
            <h3 className="font-bold text-amber-400 text-xs mb-0.5">Correction Required</h3>
            <p className="text-amber-200 text-xs">{kycRejectionReason}</p>
          </div>
        )}

        <form onSubmit={step === 6 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 flex flex-col justify-center py-1 overflow-hidden">
            
            {/* Step 1: Personal Info & Address in High-Density Horizontal Grid */}
            {step === 1 && (
              <div className="space-y-2.5 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Full Name (as per PAN)</label>
                    <input type="text" required value={kycData.fullName} onChange={e => setKycData({...kycData, fullName: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Date of Birth</label>
                    <input type="date" required value={kycData.dob} onChange={e => setKycData({...kycData, dob: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Gender</label>
                    <select required value={kycData.gender} onChange={e => setKycData({...kycData, gender: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Father's / Spouse's Name</label>
                    <input type="text" required value={kycData.fatherName} onChange={e => setKycData({...kycData, fatherName: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="Father's name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Mobile Number</label>
                    <input type="tel" required value={kycData.mobile} onChange={e => setKycData({...kycData, mobile: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500" placeholder="10-digit mobile" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</label>
                    <input type="email" required value={kycData.email} onChange={e => setKycData({...kycData, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="name@email.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Marital Status</label>
                    <select required value={kycData.maritalStatus} onChange={e => setKycData({...kycData, maritalStatus: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">City</label>
                    <input type="text" required value={kycData.city} onChange={e => setKycData({...kycData, city: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="City" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Permanent Residential Address</label>
                    <input type="text" required value={kycData.address} onChange={e => setKycData({...kycData, address: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="House/Flat No, Street, Landmark" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">State</label>
                    <input type="text" required value={kycData.state} onChange={e => setKycData({...kycData, state: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="State" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">PIN Code</label>
                    <input type="text" required pattern="[0-9]{6}" value={kycData.pincode} onChange={e => setKycData({...kycData, pincode: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500" placeholder="6-digit PIN" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: PAN & Aadhaar (Horizontal Side-by-Side 2-Col Layout) */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Left: PAN Card */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-400" /> Income Tax PAN
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">10 Characters</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">PAN Number</label>
                        <input
                          type="text"
                          required
                          pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                          placeholder="ABCDE1234F"
                          value={kycData.pan}
                          onChange={e => setKycData({...kycData, pan: e.target.value.toUpperCase()})}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Upload PAN Document</label>
                        <div className="border border-dashed border-slate-600 rounded-lg p-2 text-center hover:bg-slate-800/80 transition-colors cursor-pointer relative">
                          <input type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(e, 'panDocumentUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required={!kycData.panDocumentUrl} />
                          {kycData.panDocumentUrl ? (
                            <div className="text-emerald-400 flex items-center justify-center text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Attached ✓</div>
                          ) : (
                            <div className="text-slate-400 text-[11px] flex items-center justify-center gap-1"><Upload className="w-3.5 h-3.5 opacity-60" /> Choose PAN file</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Aadhaar Card */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Aadhaar UIDAI
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">12 Digits</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Aadhaar Number</label>
                        <input
                          type="text"
                          required
                          pattern="[0-9]{12}"
                          placeholder="1234 5678 9012"
                          value={kycData.aadhaarNumber}
                          onChange={e => setKycData({...kycData, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12)})}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono tracking-wider focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Upload Aadhaar</label>
                        <div className="border border-dashed border-slate-600 rounded-lg p-2 text-center hover:bg-slate-800/80 transition-colors cursor-pointer relative">
                          <input type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(e, 'aadhaarDocumentUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required={!kycData.aadhaarDocumentUrl} />
                          {kycData.aadhaarDocumentUrl ? (
                            <div className="text-emerald-400 flex items-center justify-center text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Attached ✓</div>
                          ) : (
                            <div className="text-slate-400 text-[11px] flex items-center justify-center gap-1"><Upload className="w-3.5 h-3.5 opacity-60" /> Choose Aadhaar file</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Bank Details in High-Density Horizontal Grid */}
            {step === 3 && (
              <div className="space-y-2.5 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Account Holder Name</label>
                    <input type="text" required value={kycData.bankAccountName} onChange={e => setKycData({...kycData, bankAccountName: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="As per bank passbook" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Bank Name</label>
                    <input type="text" required value={kycData.bankName} onChange={e => setKycData({...kycData, bankName: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. HDFC Bank, SBI" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Account Type</label>
                    <select required value={kycData.bankAccountType} onChange={e => setKycData({...kycData, bankAccountType: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500">
                      <option value="Savings">Savings Account</option>
                      <option value="Current">Current Account</option>
                      <option value="NRE">NRE Account</option>
                      <option value="NRO">NRO Account</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Account Number</label>
                    <input type="password" required value={kycData.bankAccountNumber} onChange={e => setKycData({...kycData, bankAccountNumber: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500" placeholder="Enter account number" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">IFSC Code (11 alphanumeric)</label>
                    <input type="text" required pattern="^[A-Z]{4}0[A-Z0-9]{6}$" placeholder="HDFC0001234" value={kycData.bankIfsc} onChange={e => setKycData({...kycData, bankIfsc: e.target.value.toUpperCase()})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Cheque / Passbook Proof</label>
                    <div className="border border-dashed border-slate-600 rounded-lg p-1.5 text-center hover:bg-slate-800/80 transition-colors cursor-pointer relative">
                      <input type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(e, 'bankProofUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required={!kycData.bankProofUrl} />
                      {kycData.bankProofUrl ? (
                        <div className="text-emerald-400 flex items-center justify-center text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Attached ✓</div>
                      ) : (
                        <div className="text-slate-400 text-[11px] flex items-center justify-center gap-1"><Upload className="w-3.5 h-3.5 opacity-60" /> Upload Proof</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Investor Profile & Nominee in High-Density Horizontal Layout */}
            {step === 4 && (
              <div className="space-y-2.5 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Occupation</label>
                    <select required value={kycData.occupation} onChange={e => setKycData({...kycData, occupation: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select</option>
                      <option value="Private Sector">Private Sector</option>
                      <option value="Public Sector">Public Sector</option>
                      <option value="Government">Government</option>
                      <option value="Business">Business</option>
                      <option value="Professional">Professional</option>
                      <option value="Retired">Retired</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Annual Income</label>
                    <select required value={kycData.annualIncome} onChange={e => setKycData({...kycData, annualIncome: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select</option>
                      <option value="Below 1 Lakh">&lt; 1 Lakh</option>
                      <option value="1-5 Lakhs">1-5 Lakhs</option>
                      <option value="5-10 Lakhs">5-10 Lakhs</option>
                      <option value="10-25 Lakhs">10-25 Lakhs</option>
                      <option value=">25 Lakhs">&gt; 25 Lakhs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Source of Wealth</label>
                    <select required value={kycData.sourceOfIncome} onChange={e => setKycData({...kycData, sourceOfIncome: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select</option>
                      <option value="Salary">Salary</option>
                      <option value="Business">Business</option>
                      <option value="Gift">Gift</option>
                      <option value="Ancestral">Ancestral</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Experience</label>
                    <select required value={kycData.investmentExperience} onChange={e => setKycData({...kycData, investmentExperience: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select</option>
                      <option value="Novice">Novice (0-1 yr)</option>
                      <option value="Intermediate">Intermediate (1-3 yrs)</option>
                      <option value="Expert">Expert (3+ yrs)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Nominee Full Name</label>
                    <input type="text" required value={kycData.nomineeName} onChange={e => setKycData({...kycData, nomineeName: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="Nominee legal name" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Nominee Relationship</label>
                    <input type="text" required value={kycData.nomineeRelation} onChange={e => setKycData({...kycData, nomineeRelation: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. Spouse, Son, Father" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                  <label className="flex items-center gap-2 p-2 bg-slate-800/80 rounded-lg border border-slate-700 cursor-pointer text-xs">
                    <input type="checkbox" checked={kycData.isFatca} onChange={e => setKycData({...kycData, isFatca: e.target.checked})} className="w-3.5 h-3.5 rounded text-emerald-500" />
                    <span className="text-slate-300 text-[10px]">Tax resident of a country other than India (FATCA/CRS)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-800/80 rounded-lg border border-slate-700 cursor-pointer text-xs">
                    <input type="checkbox" checked={kycData.isPep} onChange={e => setKycData({...kycData, isPep: e.target.checked})} className="w-3.5 h-3.5 rounded text-emerald-500" />
                    <span className="text-slate-300 text-[10px]">Politically Exposed Person (PEP) or related to one</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Live Photo & Digital Signature (Horizontal Side-by-Side 2-Col Layout) */}
            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Left: Photo Upload */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-emerald-400" /> Passport Photograph
                      </span>
                      <span className="text-[10px] text-slate-400">Clear Face Photo</span>
                    </div>

                    <div className="border border-dashed border-slate-600 rounded-lg p-2 text-center hover:bg-slate-800/80 transition-colors cursor-pointer relative flex-1 flex flex-col items-center justify-center min-h-[90px]">
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'photoUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required={!kycData.photoUrl} />
                      {kycData.photoUrl ? (
                        <div className="flex items-center gap-3">
                          <img src={kycData.photoUrl} alt="Preview" className="w-14 h-14 object-cover rounded-full border-2 border-emerald-500" />
                          <div className="text-emerald-400 text-xs font-bold flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Photo Uploaded ✓</div>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-xs">
                          <Camera className="w-6 h-6 mx-auto mb-1 opacity-60" />
                          <p className="text-[11px]">Click to capture or upload photo</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Digital Signature Canvas */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <PenTool className="w-4 h-4 text-emerald-400" /> Vector Digital Signature
                      </span>
                      <button type="button" onClick={() => sigCanvas.current?.clear()} className="text-[10px] text-emerald-400 hover:underline">Clear Pad</button>
                    </div>

                    <div className="bg-white rounded-lg overflow-hidden border border-slate-400 touch-none flex-1 min-h-[90px]">
                      <SignatureCanvas 
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{className: 'w-full h-24 cursor-crosshair'}} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review & Final Submission in High-Density Horizontal 3-Column Cards */}
            {step === 6 && (
              <div className="space-y-2 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {/* Identity Card */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-2.5 space-y-1 text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5 mb-1 pb-1 border-b border-white/5">
                      <User className="w-3.5 h-3.5 text-emerald-400" /> Identity
                    </span>
                    <div className="flex justify-between"><span className="text-slate-400">Name:</span> <span className="text-white font-medium truncate">{kycData.fullName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">PAN:</span> <span className="text-white font-mono uppercase">{kycData.pan}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Aadhaar:</span> <span className="text-white font-mono">••••••••{kycData.aadhaarNumber?.slice(-4)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">DOB:</span> <span className="text-white">{kycData.dob}</span></div>
                  </div>

                  {/* Banking Card */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-2.5 space-y-1 text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5 mb-1 pb-1 border-b border-white/5">
                      <Building className="w-3.5 h-3.5 text-emerald-400" /> Banking &amp; Mandate
                    </span>
                    <div className="flex justify-between"><span className="text-slate-400">Bank:</span> <span className="text-white font-medium truncate">{kycData.bankName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Account:</span> <span className="text-white font-mono">{kycData.bankAccountNumber?.slice(-4) ? `••••${kycData.bankAccountNumber.slice(-4)}` : 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">IFSC:</span> <span className="text-white font-mono uppercase">{kycData.bankIfsc}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Type:</span> <span className="text-white">{kycData.bankAccountType}</span></div>
                  </div>

                  {/* Compliance Card */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-2.5 space-y-1 text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5 mb-1 pb-1 border-b border-white/5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Declarations
                    </span>
                    <div className="flex justify-between"><span className="text-slate-400">Occupation:</span> <span className="text-white truncate">{kycData.occupation || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Income:</span> <span className="text-white">{kycData.annualIncome || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Nominee:</span> <span className="text-white truncate">{kycData.nomineeName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Sign &amp; Photo:</span> <span className="text-emerald-400 font-bold">Attached ✓</span></div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>By submitting, I declare that the details provided are true, valid, and compliant with SEBI &amp; PMLA regulations.</span>
                </div>
              </div>
            )}
          </div>

          {/* Compact Bottom Navigation Actions */}
          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || loading}
              className={`inline-flex justify-center py-1.5 px-3.5 border border-slate-700 shadow-sm text-xs font-bold rounded-xl transition-colors cursor-pointer ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-300 bg-slate-800 hover:bg-slate-700'}`}
            >
              &larr; Back
            </button>
            
            <div className="flex gap-2">
              {step < 6 && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex items-center justify-center py-1.5 px-3.5 text-xs font-bold rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 mr-1" /> Save Draft
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center py-1.5 px-5 border border-transparent shadow-[0_0_15px_rgba(16,185,129,0.2)] text-xs font-bold rounded-xl text-black bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {loading ? "Processing..." : step === 6 ? "Confirm & Submit KYC" : (
                  <>Next Step &rarr;</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${notification.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-400' : 'bg-red-950/90 border-red-500/50 text-red-400'} backdrop-blur-xl animate-in slide-in-from-bottom-5 fade-in duration-300`}>
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
