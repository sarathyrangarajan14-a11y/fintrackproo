import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { User, Mail, Phone, ChevronRight, AlertCircle, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  
  const [lockedFields, setLockedFields] = useState({
    email: false,
    phoneNumber: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        const token = await user.getIdToken();
        const res = await fetch("/api/client/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let existingProfile: any = null;
        if (res.ok) {
          existingProfile = await res.json();
          // If profile is fully complete, go to dashboard
          if (existingProfile.fullName && existingProfile.email && existingProfile.phoneNumber && 
              !existingProfile.email.includes('@fintrackpro.client') && !existingProfile.email.includes('@mobile.client')) {
             navigate('/dashboard');
             return;
          }
        }

        // Determine locked fields based on auth provider
        const providers = user.providerData.map(p => p.providerId);
        const isGoogle = providers.includes('google.com');
        const isPhone = providers.includes('phone');

        let defaultEmail = existingProfile?.email || user.email || '';
        let defaultPhone = existingProfile?.phoneNumber || user.phoneNumber || '';
        
        // Clean fallbacks
        if (defaultEmail.includes('@mobile.client') || defaultEmail.includes('@fintrackpro.client')) {
          defaultEmail = '';
        }

        const locks = { email: false, phoneNumber: false };

        if (isGoogle && user.email) {
          locks.email = true;
          defaultEmail = user.email;
        }
        if (isPhone && user.phoneNumber) {
          locks.phoneNumber = true;
          defaultPhone = user.phoneNumber;
        }

        setFormData({
          fullName: existingProfile?.fullName || '',
          email: defaultEmail,
          phoneNumber: defaultPhone
        });
        setLockedFields(locks);
        
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      
      const token = await user.getIdToken();
      const res = await fetch("/api/client/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        throw new Error("Failed to save profile");
      }
      
      // Prompt user mandatorily to complete KYC after profile setup
      navigate('/kyc');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while saving your profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12 bg-[#020617] text-white flex justify-center items-center">
         <div className="flex items-center gap-3 text-slate-400">
           <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
           <span>Loading Profile...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen bg-[#020617] text-white flex flex-col justify-between overflow-hidden">
      {/* Dedicated Clean Brand Header */}
      <header className="w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl py-2.5 px-4 sm:px-6 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500 rounded-xl p-1 shadow-lg shadow-emerald-500/20">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">FinTrack<span className="text-emerald-400">Pro</span></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Profile Registration</span>
          </div>
        </div>
      </header>

      {/* Main Horizontal Form Area */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <div className="max-w-5xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 my-auto">
          {/* Left Column: Context & Verification Steps (4 cols) */}
          <div className="md:col-span-4 bg-gradient-to-br from-blue-500/10 via-slate-950/60 to-emerald-500/10 p-4 sm:p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex items-center justify-center h-9 w-9 rounded-2xl bg-blue-500/20 shadow-lg shadow-blue-500/20 border border-blue-500/30">
                  <User className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight leading-none">Investor Profile</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">Account Setup &amp; Onboarding</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Please confirm your official identity details. Under SEBI guidelines, your registered name will be validated against tax PAN.
              </p>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Name verification matches tax PAN</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Verified email for statements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>2FA SMS transaction alerts</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Next Step</span>
              <span className="text-blue-400 font-semibold flex items-center gap-1">
                <span>Digital KYC</span> &rarr;
              </span>
            </div>
          </div>

          {/* Right Column: Horizontal Form (8 cols) */}
          <div className="md:col-span-8 p-4 sm:p-6 flex flex-col justify-center space-y-3.5">
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Complete Your Profile Details</h1>
              <p className="text-xs text-slate-400">All fields are laid out horizontally for streamlined one-screen completion.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded-xl text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Horizontal 3-column row for Name, Email, and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Full Name (as per PAN)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs"
                      placeholder="Rajesh Sharma"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      disabled={lockedFields.email}
                      className={`w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none text-xs ${lockedFields.email ? 'opacity-60 cursor-not-allowed' : 'focus:border-blue-500'}`}
                      placeholder="name@example.com"
                    />
                    {lockedFields.email && (
                      <span className="absolute right-2 top-2 text-[8px] bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded font-bold uppercase">Locked</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                      disabled={lockedFields.phoneNumber}
                      className={`w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none text-xs ${lockedFields.phoneNumber ? 'opacity-60 cursor-not-allowed' : 'focus:border-blue-500'}`}
                      placeholder="+91 9876543210"
                    />
                    {lockedFields.phoneNumber && (
                      <span className="absolute right-2 top-2 text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold uppercase">Locked</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-6 rounded-xl font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-600/20"
                >
                  {submitting ? 'Saving Profile...' : 'Save & Continue to KYC'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-2 px-4 shrink-0 text-center text-[10px] text-slate-500">
        <span>FinTrackPro Investor Portal · AMFI ARN: 348996 · 256-bit Bank Grade Security</span>
      </footer>
    </div>
  );
}
