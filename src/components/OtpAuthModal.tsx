import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Lock, Smartphone, RefreshCw, AlertCircle, Send, Timer, CheckCircle2, Sparkles, MessageSquare, Copy, Check } from 'lucide-react';
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { smsNotificationService } from '../services/smsNotificationService';
import ProfessionalOtpInput from './common/ProfessionalOtpInput';

interface OtpAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (otp: string, verificationToken?: string, verifiedPhone?: string) => Promise<void> | void;
  title: string;
  subtitle?: string;
  actionSummary?: { label: string; value: string }[];
  phone?: string;
  clientName?: string;
  actionButtonText?: string;
  badgeVariant?: 'emerald' | 'amber' | 'blue' | 'red' | 'indigo';
  isPhoneLocked?: boolean;
}

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export default function OtpAuthModal({
  isOpen,
  onClose,
  onVerified,
  title,
  subtitle,
  actionSummary = [],
  phone,
  clientName,
  actionButtonText = "Verify & Authorize",
  badgeVariant = 'emerald',
  isPhoneLocked = false
}: OtpAuthModalProps) {
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneInput, setPhoneInput] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [senderHeader, setSenderHeader] = useState<string>('VK-FNTRCK');

  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Parse initial phone digits
  const cleanPhoneDigits = (raw?: string) => {
    if (!raw) return '';
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0') && digits.length === 11) {
      digits = digits.slice(1);
    }
    return digits;
  };

  // Determine if phone should truly be locked
  const isStrictlyLocked = Boolean(isPhoneLocked);

  // Initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialDigits = cleanPhoneDigits(phone || auth.currentUser?.phoneNumber || '');
      setPhoneInput(initialDigits || '9876543210');
      setStep('send');
      setOtp(['', '', '', '', '', '']);
      setError('');
      setSuccessMsg('');
      setLoading(false);
      setResendTimer(60);
      confirmationResultRef.current = null;
    }
  }, [isOpen, phone]);

  // Handle countdown interval for code resending
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && step === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, step, resendTimer]);

  // Setup reCAPTCHA Verifier
  const setupRecaptcha = () => {
    try {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {
          // ignore
        }
        window.recaptchaVerifier = undefined;
      }

      const container = document.getElementById('firebase-recaptcha-container');
      if (container) {
        container.innerHTML = '';
      }

      const verifier = new RecaptchaVerifier(auth, 'firebase-recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          console.warn('[Firebase Auth] reCAPTCHA expired');
          if (window.recaptchaVerifier) {
            try {
              window.recaptchaVerifier.clear();
            } catch {
              // ignore
            }
            window.recaptchaVerifier = undefined;
          }
        }
      });
      
      window.recaptchaVerifier = verifier;
      return verifier;
    } catch (err) {
      console.warn('[Firebase Auth] RecaptchaVerifier setup skipped:', err);
      return null;
    }
  };

  // Step 1: Send SMS OTP via Dual Gateway (Firebase Phone Auth + Fast2SMS / Twilio SMS fallback)
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    const trimmedPhone = phoneInput.trim();
    if (!trimmedPhone || trimmedPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    const cleanNum = cleanPhoneDigits(trimmedPhone);

    let dispatched = false;
    let firebaseErrorMsg = "";

    // 1. Primary Dispatch: Firebase Phone Authentication
    try {
      const verifier = setupRecaptcha();
      if (verifier) {
        const formattedPhoneNumber = `+91${cleanNum}`;
        const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, verifier);
        confirmationResultRef.current = confirmation;
        dispatched = true;
        setSuccessMsg(`Live SMS OTP sent to +91 ${cleanNum}. Please check your phone.`);
      }
    } catch (fbErr: any) {
      console.warn('[Firebase Auth] Phone dispatch notice:', fbErr?.code, fbErr?.message);
      if (fbErr.code === 'auth/unauthorized-domain') {
        firebaseErrorMsg = `Domain "${window.location.hostname}" is not authorized for SMS in Firebase Console.`;
      } else if (fbErr.code === 'auth/operation-not-allowed') {
        firebaseErrorMsg = 'Phone Authentication is disabled in Firebase Console.';
      } else if (fbErr.code === 'auth/quota-exceeded') {
        firebaseErrorMsg = 'Firebase SMS quota exceeded for today.';
      } else if (fbErr.code === 'auth/too-many-requests') {
        firebaseErrorMsg = 'Firebase has rate-limited SMS requests from this device. Please use test phone numbers in Firebase Console or wait a short while.';
      } else {
        firebaseErrorMsg = fbErr.message || 'Firebase Phone Auth unavailable.';
      }
    }

    // 2. Secondary Dispatch: Server SMS Gateway (Twilio / Fast2SMS)
    try {
      const userToken = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(userToken ? { 'Authorization': `Bearer ${userToken}` } : {})
        },
        body: JSON.stringify({
          phone: cleanNum,
          reason: title || 'SEBI SIP Authorization',
          clientName: clientName || 'Investor'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        dispatched = true;
        setSuccessMsg(data.message || `SMS OTP dispatched to +91 ${cleanNum}. Valid for 5 minutes.`);
        if (data.senderHeader) setSenderHeader(data.senderHeader);
      } else if (data.error) {
        console.warn('[Backend SMS Gateway] Server response:', data.error);
        if (!dispatched) setError(firebaseErrorMsg || data.error);
      }
    } catch (apiErr: any) {
      console.warn('[Backend SMS Gateway] Notice:', apiErr);
      if (!dispatched) setError(firebaseErrorMsg || 'Network error while dispatching SMS. Please try again.');
    }

    if (dispatched) {
      setStep('verify');
      setResendTimer(60);
      setError('');
    } else if (!error) {
      setError(firebaseErrorMsg || 'Failed to dispatch SMS verification code. Please check your mobile number and signal, then try again.');
    }

    setLoading(false);
  };

  // Step 2: Confirm OTP verification code - STRICT SECURITY ENFORCEMENT
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    const fullOtp = otp.join('').trim();
    if (fullOtp.length !== 6 || !/^\d{6}$/.test(fullOtp)) {
      setError('Please enter the complete 6-digit numeric verification code received in your message.');
      return;
    }

    setLoading(true);
    setError('');

    const cleanNum = cleanPhoneDigits(phoneInput);
    let verified = false;
    let tokenIssued: string | undefined = undefined;

    // 1. Confirm Firebase phone confirmation if available
    if (confirmationResultRef.current) {
      try {
        await confirmationResultRef.current.confirm(fullOtp);
        verified = true;
      } catch (fbVerifyErr: any) {
        console.warn('[Firebase Verify] Notice:', fbVerifyErr?.message || fbVerifyErr);
      }
    }

    // 2. Strict Verification via Backend OTP Gateway
    try {
      const verifyRes = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanNum,
          otp: fullOtp
        })
      });
      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success) {
        verified = true;
        tokenIssued = verifyData.verificationToken;
      } else if (!verified) {
        setError(verifyData.error || "Security Check Failed: Incorrect OTP entered. You must enter the exact 6-digit code received on your mobile device.");
        setLoading(false);
        return;
      }
    } catch (verifyErr: any) {
      if (!verified) {
        console.warn('[Backend Verify] Error:', verifyErr);
        setError('Network error during verification. Please try again.');
        setLoading(false);
        return;
      }
    }

    if (verified) {
      setError('');
      try {
        await onVerified(fullOtp, tokenIssued, cleanNum);
      } catch (callbackErr: any) {
        console.error('onVerified callback execution failed:', callbackErr);
        setError(callbackErr?.message || 'Verification succeeded, but completing the action failed.');
      }
    } else {
      setError('Security verification failed. Please enter the exact OTP code received in your SMS message.');
    }
    setLoading(false);
  };

  const handleOtpChange = (index: number, val: string) => {
    const numeric = val.replace(/\D/g, '');
    if (numeric.length > 1) {
      const pasteDigits = numeric.slice(0, 6).split('');
      const newOtp = [...otp];
      pasteDigits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pasteDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numeric;
    setOtp(newOtp);
    setError('');

    if (numeric && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  if (!isOpen) return null;

  const badgeStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  };

  const cleanNum = cleanPhoneDigits(phoneInput);
  const maskedPhone = `+91 ${cleanNum.slice(0, 2)}*** **${cleanNum.slice(-3)}`;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      {/* Container for Firebase reCAPTCHA */}
      <div id="firebase-recaptcha-container" style={{ position: 'absolute', top: -9999, left: -9999 }}></div>

      <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl sm:rounded-3xl w-full max-w-lg md:max-w-xl overflow-hidden relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${badgeStyles[badgeVariant]}`}>
                    Confidential 2FA
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">{title}</h3>
              </div>
            </div>
            <button 
              onClick={onClose} 
              disabled={loading}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            {subtitle || `Verify authorization with a secure, confidential one-time verification code sent directly to the device.`}
          </p>
        </div>

        {/* Action Summary Details in horizontal grid */}
        {actionSummary.length > 0 && (
          <div className="px-4 sm:px-5 mb-3">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
              {actionSummary.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-slate-400 text-[10px] uppercase font-medium">{item.label}</span>
                  <span className="text-white font-bold truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Multi-Screen Content Flow */}
        <div className="px-4 sm:px-5 pb-5">
          
          {/* STEP 1: Phone input & country code form with horizontal layout */}
          {step === 'send' ? (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    Mobile Phone Verification
                  </span>
                  {(isPhoneLocked || phone) && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Account Linked
                    </span>
                  )}
                </label>
                
                {isStrictlyLocked ? (
                  /* Strictly Locked Phone Display (Only when verified/linked account phone) */
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 bg-slate-900/90 border border-slate-700/90 rounded-xl px-3 py-2 flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {countryCode}
                        </span>
                        <span className="text-sm font-mono font-bold text-white tracking-wider">
                          {cleanNum || phoneInput}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" /> Account Linked
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || (!phoneInput && !phone)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 rounded-xl font-bold transition-all text-xs disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> Send OTP Code
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 flex gap-2">
                      <div className="w-16">
                        <input
                          type="text"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          placeholder="+91"
                          maxLength={4}
                          readOnly={isPhoneLocked || isStrictlyLocked}
                          disabled={isPhoneLocked || isStrictlyLocked}
                          className={`w-full bg-[#1e293b]/70 border border-slate-700/80 rounded-xl px-2 py-2 text-xs text-center font-mono focus:outline-none focus:border-emerald-500 ${isPhoneLocked || isStrictlyLocked ? 'opacity-60 cursor-not-allowed text-slate-400' : 'text-slate-300'}`}
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="tel"
                          maxLength={10}
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit number"
                          readOnly={isPhoneLocked || isStrictlyLocked}
                          disabled={isPhoneLocked || isStrictlyLocked}
                          className={`w-full bg-[#1e293b]/70 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 ${isPhoneLocked || isStrictlyLocked ? 'opacity-60 cursor-not-allowed text-slate-400' : 'text-white'}`}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || (!phoneInput && !phone)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 rounded-xl font-bold transition-all text-xs disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> Send OTP Code
                        </>
                      )}
                    </button>
                  </div>
                )}

                <p className="text-[10px] text-slate-400">
                  {clientName 
                    ? `Confidential 6-digit OTP will be dispatched to your registered phone to authorize the mandate.` 
                    : `Confidential 6-digit OTP will be dispatched via official SMS.`}
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          ) : (
            
            /* STEP 2: Professional Verification Input Form */
            <div className="space-y-4">
              <ProfessionalOtpInput
                value={otp.join('')}
                onChange={(code) => {
                  const arr = new Array(6).fill('');
                  code.split('').forEach((d, i) => { if (i < 6) arr[i] = d; });
                  setOtp(arr);
                  setError('');
                }}
                onComplete={(code) => {
                  const arr = new Array(6).fill('');
                  code.split('').forEach((d, i) => { if (i < 6) arr[i] = d; });
                  setOtp(arr);
                }}
                length={6}
                phone={cleanNum}
                onResend={handleSendOtp}
                resendTimer={resendTimer}
                loading={loading}
                error={error}
                senderHeader={senderHeader}
                onEditPhone={(!isPhoneLocked && !phone) ? () => setStep('send') : undefined}
                submitButtonText={actionButtonText}
                onSubmit={() => handleVerifyOtp()}
              />

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white py-2.5 rounded-xl font-semibold transition-colors text-xs disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

