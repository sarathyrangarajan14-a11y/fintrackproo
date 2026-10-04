import React, { useState } from 'react';
import { X, Edit3, Calendar, IndianRupee, AlertCircle } from 'lucide-react';

interface EditSipModalProps {
  isOpen: boolean;
  onClose: () => void;
  sip: any;
  onConfirm: (updatedData: { amount: number; sipDate: number }) => void;
}

export default function EditSipModal({ isOpen, onClose, sip, onConfirm }: EditSipModalProps) {
  if (!isOpen || !sip) return null;

  const [amount, setAmount] = useState(sip.amount?.toString() || "5000");
  const [sipDate, setSipDate] = useState(sip.sipDate?.toString() || "5");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 500) {
      setError("Minimum monthly SIP amount is ₹500");
      return;
    }
    setError("");
    onConfirm({
      amount: numAmount,
      sipDate: parseInt(sipDate)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-2xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200 p-5 sm:p-6">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Modify SIP Mandate</h3>
            <p className="text-slate-400 text-xs">Update your monthly recurring investment terms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: Current Details */}
          <div className="md:col-span-5 bg-white/[0.02] rounded-xl p-4 border border-white/5 flex flex-col justify-between space-y-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Existing Mandate</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Scheme Code</span>
                  <span className="text-white font-mono font-bold">{sip.schemeCode}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Amount</span>
                  <span className="text-emerald-400 font-bold">₹{sip.amount}/mo</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Debit Day</span>
                  <span className="text-white font-bold">{sip.sipDate}th</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 bg-white/[0.02] p-2 rounded-lg border border-white/5">
              Requires 2FA SMS OTP authorization to update BSE StarMF mandate.
            </div>
          </div>

          {/* Right Column: New Values Form */}
          <form onSubmit={handleSubmit} className="md:col-span-7 flex flex-col justify-between space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-emerald-400" /> New Amount (₹)
                </label>
                <input
                  type="number"
                  min="500"
                  step="100"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#1e293b]/70 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. 5000"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-400" /> New Debit Day
                </label>
                <select
                  value={sipDate}
                  onChange={(e) => setSipDate(e.target.value)}
                  className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                >
                  {[...Array(28)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}th of every month
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2 rounded-xl">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 py-2.5 rounded-xl font-bold transition-colors text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 rounded-xl font-bold transition-colors text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                Proceed to OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
