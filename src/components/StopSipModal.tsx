import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
import OtpAuthModal from './OtpAuthModal';

export default function StopSipModal({ isOpen, onClose, sip, onConfirm, phone, clientName }: any) {
  const [showOtp, setShowOtp] = useState(false);

  if (!isOpen || !sip) return null;

  const handleCloseAll = () => {
    setShowOtp(false);
    onClose();
  };

  const handleOtpVerified = async (otp: string) => {
    await onConfirm(sip.id, otp);
    handleCloseAll();
  };

  if (showOtp) {
    return (
      <OtpAuthModal
        isOpen={true}
        onClose={handleCloseAll}
        onVerified={handleOtpVerified}
        title="Authorize Mandate Cancellation"
        subtitle="Mandate cancellation requires 2FA OTP verification under SEBI investor regulations."
        phone={phone}
        clientName={clientName}
        actionSummary={[
          { label: 'Scheme Code', value: sip.schemeCode },
          { label: 'Monthly Amount', value: `₹${sip.amount} / month` },
          { label: 'Debit Day', value: `${sip.sipDate}th of every month` },
          { label: 'Action', value: 'Cancel Auto-Debit Mandate' }
        ]}
        actionButtonText="Verify & Cancel SIP"
        badgeVariant="red"
        isPhoneLocked={true}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-white/10 rounded-[32px] w-full max-w-md overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Stop SIP Mandate</h3>
              <p className="text-slate-400 text-xs mt-0.5">Cancel recurring auto-debit for this fund</p>
            </div>
          </div>
          
          <div className="bg-white/[0.03] rounded-2xl p-4 mb-6 mt-4 border border-white/5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Scheme</span>
              <span className="text-white font-bold">{sip.schemeCode}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Monthly Amount</span>
              <span className="text-white font-bold">₹{sip.amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Debit Day</span>
              <span className="text-white font-bold">{sip.sipDate}th of month</span>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="text-xs text-red-200/80">
              <p className="font-bold text-red-400 mb-1">Important Notice</p>
              <p>Future recurring debits will be cancelled immediately. Your past accumulated units will remain invested safely in this fund.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold transition-colors text-sm">
              Keep Active
            </button>
            <button 
              onClick={() => setShowOtp(true)} 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold transition-colors text-sm shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Proceed to OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
