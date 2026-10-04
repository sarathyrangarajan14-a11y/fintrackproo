import React, { useState } from 'react';
import { X, CalendarClock, ShieldCheck } from 'lucide-react';
import OtpAuthModal from './OtpAuthModal';

export default function SkipSipModal({ isOpen, onClose, sip, onConfirm, phone, clientName }: any) {
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
        title="Authorize Mandate Pause"
        subtitle="Authenticate with the 6-digit OTP to pause your upcoming installment."
        phone={phone}
        clientName={clientName}
        actionSummary={[
          { label: 'Scheme Code', value: sip.schemeCode },
          { label: 'Skipping Date', value: `${sip.sipDate}th of this month` },
          { label: 'Monthly Amount', value: `₹${sip.amount}` },
          { label: 'Action', value: 'Skip 1 Monthly Installment' }
        ]}
        actionButtonText="Verify & Skip Month"
        badgeVariant="blue"
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
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Skip Current Month</h3>
              <p className="text-slate-400 text-xs mt-0.5">Pause your upcoming SIP installment</p>
            </div>
          </div>
          
          <div className="bg-white/[0.03] rounded-2xl p-4 mb-6 mt-4 border border-white/5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Scheme</span>
              <span className="text-white font-bold">{sip.schemeCode}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Skipping Date</span>
              <span className="text-white font-bold">{sip.sipDate}th of this month</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Amount</span>
              <span className="text-white font-bold">₹{sip.amount}</span>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 mb-6">
            <CalendarClock className="w-5 h-5 text-blue-400 shrink-0" />
            <div className="text-xs text-blue-200/80">
              <p className="font-bold text-blue-400 mb-1">Resumption Details</p>
              <p>Only the immediate upcoming installment will be skipped. Your SIP will automatically resume from the following month on the {sip.sipDate}th.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold transition-colors text-sm">
              Cancel
            </button>
            <button 
              onClick={() => setShowOtp(true)} 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-colors text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Proceed to OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
