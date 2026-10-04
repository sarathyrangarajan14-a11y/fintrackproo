import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Phone, 
  KeyRound, 
  RotateCw, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  ChevronLeft,
  Lock
} from "lucide-react";
import { auth } from "../../lib/firebase";
import { smsNotificationService } from "../../services/smsNotificationService";
import ProfessionalOtpInput from "../../components/common/ProfessionalOtpInput";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  PhoneAuthProvider,
  linkWithCredential
} from "firebase/auth";

export default function VerifyPhone() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [senderHeader, setSenderHeader] = useState<string>("VK-FNTRCK");
  
  // Feedback States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const navigate = useNavigate();

  // Redirect if user doesn't belong here
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }
    const hasLocalVerifiedPhone = typeof window !== 'undefined' && Boolean(localStorage.getItem(`phone_verified_${user.uid}`));
    // If they already have a phone number, send them to dashboard
    if (user.phoneNumber || hasLocalVerifiedPhone) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval: any;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Clean up reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const getRecaptchaVerifier = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (e) {}
      recaptchaVerifierRef.current = null;
    }

    const container = document.getElementById('recaptcha-container-link');
    if (container) {
      container.innerHTML = '';
    }

    recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container-link', {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        if (recaptchaVerifierRef.current) {
          try {
            recaptchaVerifierRef.current.clear();
          } catch (e) {}
          recaptchaVerifierRef.current = null;
        }
      }
    });

    return recaptchaVerifierRef.current;
  };

  const cleanIndianPhoneNumber = (raw: string) => {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0') && digits.length === 11) {
      digits = digits.slice(1);
    }
    return digits;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cleanIndianPhoneNumber(phoneNumber);
    if (cleanNum.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    let dispatched = false;

    // 1. Dispatch custom FinTrackPro SMS via server (formats exact template: "Use OTP {OTP} to log into your FinTrackPro Account...")
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanNum })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        dispatched = true;
        setStep("otp");
        setOtp("");
        setResendTimer(60);
        setSuccessMsg(data.message || `SMS verification OTP dispatched to +91 ${cleanNum}`);
        if (data.senderHeader) setSenderHeader(data.senderHeader);
      }
    } catch (e) {
      console.warn("Server SMS dispatch notice:", e);
    }

    // 2. Fallback to Firebase Phone verification if server gateway was not available
    if (!dispatched) {
      try {
        const appVerifier = getRecaptchaVerifier();
        const formattedPhoneNumber = `+91${cleanNum}`;
        const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
        setConfirmationResult(confirmation);
        dispatched = true;
        setStep("otp");
        setOtp("");
        setResendTimer(60);
        setSuccessMsg(`Live SMS OTP sent to +91 ${cleanNum}. Please check your phone.`);
      } catch (fbErr: any) {
        console.warn("[Firebase Phone Auth] Notice:", fbErr?.code, fbErr?.message);
        if (fbErr.code === "auth/unauthorized-domain") {
          setError(`Domain "${window.location.hostname}" is not authorized for SMS in Firebase Console.`);
        } else if (fbErr.code === "auth/operation-not-allowed") {
          setError("Phone Authentication is disabled in Firebase Console. Please enable Phone provider under Authentication > Sign-in method.");
        } else if (fbErr.code === "auth/quota-exceeded") {
          setError("Firebase daily SMS quota exceeded. In Firebase Console > Authentication > Phone, add your phone number under 'Phone numbers for testing' to bypass limits.");
        } else if (fbErr.code === "auth/too-many-requests") {
          setError("Firebase has temporarily rate-limited SMS requests from this device. Please use test phone numbers in Firebase Console or wait a short while.");
        } else {
          setError(fbErr.message || "Failed to dispatch SMS verification code.");
        }

        if (recaptchaVerifierRef.current) {
          try {
            recaptchaVerifierRef.current.clear();
          } catch (e) {}
          recaptchaVerifierRef.current = null;
        }
      }
    }

    setLoading(false);
  };

  const handleResendOtp = async () => {
    if (loading || resendTimer > 0) return;
    const cleanNum = cleanIndianPhoneNumber(phoneNumber);
    setError("");
    setSuccessMsg("");
    setLoading(true);

    let resent = false;

    // 1. Resend via server SMS gateway with exact format
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanNum })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        resent = true;
        setResendTimer(60);
        setOtp("");
        setSuccessMsg(`A fresh SMS OTP has been sent to +91 ${cleanNum}`);
        setTimeout(() => setSuccessMsg(""), 5000);
        if (data.senderHeader) setSenderHeader(data.senderHeader);
      }
    } catch (e) {
      console.warn("Server resend error:", e);
    }

    // 2. Fallback to Firebase resend only if server resend failed
    if (!resent) {
      try {
        const appVerifier = getRecaptchaVerifier();
        const formattedPhoneNumber = `+91${cleanNum}`;
        const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
        setConfirmationResult(confirmation);
        resent = true;
        setResendTimer(60);
        setOtp("");
      } catch (fbErr: any) {
        console.warn("[Firebase Resend] Notice:", fbErr?.code);
      }
    }

    if (!resent) {
      setError("Failed to resend SMS code. Please check your network and try again.");
    }

    setLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    const cleanNum = cleanIndianPhoneNumber(phoneNumber);
    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No active user session found. Please login again.");
      }

      let verified = false;

      // 1. Primary check: Verify via Backend OTP Gateway (Fast2SMS SMS delivery)
      try {
        const verifyRes = await fetch('/api/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: cleanNum,
            otp
          })
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          verified = true;
        } else if (!confirmationResult) {
          setError(verifyData.error || "Incorrect or expired verification code. Please check your SMS.");
          setLoading(false);
          return;
        }
      } catch (backendErr: any) {
        console.warn("Backend OTP verification network warning:", backendErr);
      }

      // 2. If confirmationResult exists, attempt Firebase credential linking
      if (confirmationResult) {
        try {
          const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
          await linkWithCredential(user, credential);
          verified = true;
        } catch (linkErr: any) {
          console.warn("Firebase link notice:", linkErr?.code || linkErr?.message || linkErr);
          if (linkErr.code === "auth/credential-already-in-use" || linkErr.code === "auth/provider-already-linked") {
            verified = true;
          }
        }
      }

      // Final strict check
      if (!verified) {
        setError("Security Check Failed: Incorrect OTP code. Please enter the exact 6-digit code received on your phone.");
        setLoading(false);
        return;
      }

      // Store local verified indicator
      if (typeof window !== 'undefined') {
        localStorage.setItem(`phone_verified_${user.uid}`, `+91${cleanNum}`);
        localStorage.setItem('client_phone', `+91${cleanNum}`);
      }

      // Sync verification to server backend
      try {
        const token = await user.getIdToken(true);
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            phoneNumber: `+91${cleanNum}`,
            phone: cleanNum
          })
        });

        await fetch('/api/client/profile/setup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            phoneNumber: `+91${cleanNum}`
          })
        });
      } catch (syncErr) {
        console.warn("Server phone sync notice:", syncErr);
      }

      setSuccessMsg("Phone number verified! Redirecting to complete mandatory KYC...");
      setTimeout(() => {
        navigate("/kyc");
      }, 800);
    } catch (err: any) {
      console.error("Verification processing error:", err);
      if (err.code === "auth/credential-already-in-use") {
        setError("This phone number is already linked to another account. Please use a different number.");
      } else if (err.code === "auth/invalid-verification-code") {
        setError("Invalid verification code. Please check the code and try again.");
      } else {
        setError(err.message || "Verification and account linking failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetFlow = () => {
    setStep("phone");
    setOtp("");
    setConfirmationResult(null);
    setError("");
    setSuccessMsg("");
  };

  // Mask the phone number for Screen 2: lock identity, e.g. +91 ******1234
  const getMaskedPhone = () => {
    const cleanNum = cleanIndianPhoneNumber(phoneNumber);
    if (cleanNum.length === 10) {
      return `+91 ******${cleanNum.slice(6)}`;
    }
    return phoneNumber;
  };

  return (
    <div className="w-full h-screen max-h-screen flex items-center justify-center p-2 sm:p-4 bg-[#0b1329] text-white overflow-hidden">
      <div id="recaptcha-container-link"></div>

      <div className="max-w-4xl w-full mx-auto bg-white/[0.04] backdrop-blur-xl rounded-[28px] border border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 my-auto">
        {/* Left Column: Context & Regulatory Shield (5 cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-emerald-500/10 via-slate-900/60 to-indigo-500/10 p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-emerald-500/20 shadow-lg shadow-emerald-500/20 border border-emerald-500/30">
                <Phone className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight leading-none">Phone <span className="text-emerald-400">Security</span></h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Two-Factor Authentication</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Under SEBI mutual fund guidelines, all accounts must bind a verified Indian mobile number to prevent unauthorized transactions and activate digital KYC.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Anti-Fraud Ledger Shield Active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fast2SMS Institutional Gateway</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-Time Single-Use Cryptographic Token</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Authentication State</span>
            <span className="text-emerald-400 font-semibold">{step === 'phone' ? 'Awaiting Number' : 'Awaiting OTP'}</span>
          </div>
        </div>

        {/* Right Column: Interactive Phone / OTP Verification Area (7 cols) */}
        <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-center space-y-3.5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-xl text-xs font-semibold flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in text-center">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === "phone" ? (
            <form className="space-y-2.5" onSubmit={handlePhoneSubmit}>
              <label className="block text-xs font-medium text-slate-300">Registered Indian Mobile Number</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-bold text-xs">+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono tracking-wider text-xs"
                    placeholder="XXXXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || phoneNumber.length !== 10}
                  className="whitespace-nowrap flex justify-center items-center gap-1.5 py-2 px-4 text-xs font-bold rounded-xl text-slate-900 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20 cursor-pointer shrink-0"
                >
                  {loading ? "Sending..." : "Send Verification OTP"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                A high-priority 6-digit SMS verification code will be dispatched to this number.
              </p>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/[0.03] px-3 py-2 rounded-xl border border-white/5 text-xs">
                <span className="text-slate-400">Verifying code sent to:</span>
                <strong className="text-emerald-400 font-mono">{getMaskedPhone()}</strong>
              </div>

              <ProfessionalOtpInput
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  setError("");
                }}
                length={6}
                phone={phoneNumber}
                onResend={handleResendOtp}
                resendTimer={resendTimer}
                loading={loading}
                error={error}
                senderHeader={senderHeader}
                onEditPhone={handleResetFlow}
                submitButtonText="Verify & Complete Setup"
                onSubmit={() => handleOtpSubmit(new Event('submit') as any)}
              />

              <button
                type="button"
                onClick={handleResetFlow}
                disabled={loading}
                className="w-full flex justify-center items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Change Mobile Number</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
