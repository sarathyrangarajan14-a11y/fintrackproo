import React, { useState, useRef, useEffect } from 'react';
import { 
  KeyRound, 
  RotateCw, 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

export interface ProfessionalOtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  length?: number;
  phone?: string;
  onResend?: () => void;
  resendTimer?: number;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  senderHeader?: string;
  onEditPhone?: () => void;
  autoFocus?: boolean;
  className?: string;
  submitButtonText?: string;
  onSubmit?: () => void;
}

export default function ProfessionalOtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  phone = '',
  onResend,
  resendTimer = 0,
  loading = false,
  error = '',
  disabled = false,
  senderHeader = 'VK-FNTRCK',
  onEditPhone,
  autoFocus = true,
  className = '',
  submitButtonText = 'Verify & Continue',
  onSubmit
}: ProfessionalOtpInputProps) {
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = new Array(length).fill('');
    if (value) {
      value.split('').slice(0, length).forEach((d, i) => {
        arr[i] = d;
      });
    }
    return arr;
  });

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync internal digits when external value changes
  useEffect(() => {
    const clean = (value || '').replace(/\D/g, '').slice(0, length);
    const newDigits = new Array(length).fill('');
    clean.split('').forEach((d, i) => {
      newDigits[i] = d;
    });
    setDigits(newDigits);
  }, [value, length]);

  // Auto focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const updateDigits = (newDigits: string[]) => {
    setDigits(newDigits);
    const fullOtp = newDigits.join('');
    onChange(fullOtp);

    if (fullOtp.length === length && onComplete) {
      onComplete(fullOtp);
    }
  };

  const handleDigitChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    
    // Handle paste inside single box
    if (val.length > 1) {
      handlePastedString(val);
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = val ? val.slice(-1) : '';
    updateDigits(newDigits);

    if (val && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        updateDigits(newDigits);
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        updateDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePastedString = (text: string) => {
    const numeric = text.replace(/\D/g, '').slice(0, length);
    if (!numeric) return;

    const newDigits = new Array(length).fill('');
    numeric.split('').forEach((d, i) => {
      newDigits[i] = d;
    });
    updateDigits(newDigits);

    const nextIdx = Math.min(numeric.length, length - 1);
    setActiveIndex(nextIdx);
    inputRefs.current[nextIdx]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    handlePastedString(pastedData);
  };

  const cleanPhone = (phone || '').replace(/\D/g, '');
  const maskedPhone = cleanPhone.length >= 10
    ? `+91 ${cleanPhone.slice(-10, -8)}*** **${cleanPhone.slice(-3)}`
    : phone;

  const isComplete = digits.every(d => d !== '');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Phone Header & Edit Trigger */}
      {phone && (
        <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300 font-medium">SMS Dispatched To</span>
            <span className="text-xs font-mono font-bold text-white tracking-wider">{maskedPhone}</span>
          </div>
          {onEditPhone && (
            <button
              type="button"
              onClick={onEditPhone}
              disabled={loading}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 cursor-pointer transition-colors"
            >
              Change Number
            </button>
          )}
        </div>
      )}

      {/* Confidentiality Assurance Notice - Strictly Never Shows OTP on Screen */}
      <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3 flex items-start gap-2.5 text-left">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Strict Confidentiality Notice: </span>
          The one-time password has been sent directly to your registered mobile phone via official SMS ({senderHeader}). Do not share this OTP or your phone number with anyone.
        </div>
      </div>

      {/* 6-Digit Segmented PIN Grid */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider text-center">
          Enter 6-Digit Verification Code
        </label>

        <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
          {digits.map((digit, index) => {
            const isFocused = activeIndex === index;
            const isFilled = Boolean(digit);
            const hasError = Boolean(error);

            return (
              <div key={index} className="relative">
                <input
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  maxLength={1}
                  disabled={disabled || loading}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  onFocus={() => setActiveIndex(index)}
                  className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl transition-all duration-200 outline-none
                    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
                    ${hasError 
                      ? 'border-red-500/80 bg-red-500/10 text-red-300 ring-2 ring-red-500/20' 
                      : isFocused 
                        ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300 ring-2 ring-emerald-500/30 scale-105' 
                        : isFilled 
                          ? 'border-emerald-500/40 bg-white/[0.05] text-white shadow-sm' 
                          : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                    }
                    border shadow-inner
                  `}
                />
                {!digit && isFocused && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="w-0.5 h-6 bg-emerald-400 animate-pulse rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Feedback */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="leading-snug text-left">{error}</span>
        </div>
      )}

      {/* Resend Action & Security Info */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-slate-400">Didn't receive SMS?</span>
        {onResend && (
          <button
            type="button"
            onClick={onResend}
            disabled={resendTimer > 0 || loading || disabled}
            className="text-emerald-400 hover:text-emerald-300 font-semibold disabled:text-slate-500 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${resendTimer > 0 ? 'opacity-40 animate-spin' : ''}`} />
            {resendTimer > 0 ? `Resend SMS in ${resendTimer}s` : 'Resend Code via SMS'}
          </button>
        )}
      </div>

      {/* Primary Submit Action */}
      {onSubmit && (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isComplete || loading || disabled}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 text-xs font-bold rounded-xl text-slate-950 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-[0.99]"
        >
          {loading ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <KeyRound className="w-3.5 h-3.5" />
              <span>{submitButtonText}</span>
            </>
          )}
        </button>
      )}

      {/* Security End-to-End Footer */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1 border-t border-white/5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>256-Bit Encrypted • Direct SEBI Multi-Factor Auth</span>
      </div>
    </div>
  );
}
