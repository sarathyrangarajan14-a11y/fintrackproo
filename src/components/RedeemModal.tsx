import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, TrendingDown, ShieldCheck } from 'lucide-react';
import OtpAuthModal from './OtpAuthModal';

export default function RedeemModal({ isOpen, onClose, fund, onConfirm, phone, clientName }: any) {
  const [redeemType, setRedeemType] = useState<'full' | 'partial'>('full');
  const [redeemUnits, setRedeemUnits] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [rrnNumber, setRrnNumber] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  if (!isOpen || !fund) return null;

  const formatInr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format;
  const nav = fund.nav || 0;
  
  // Calculate amounts based on input
  let redemptionValue = 0;
  if (redeemType === 'full') {
    redemptionValue = fund.currentValue;
  } else {
    const units = Number(redeemUnits);
    if (!isNaN(units) && units > 0) {
      redemptionValue = units * nav;
    }
  }

  // Ensure redemptionValue doesn't exceed current value visually if user types too much
  if (redemptionValue > fund.currentValue) {
    redemptionValue = fund.currentValue;
  }

  const exitLoad = redemptionValue * 0.01;
  const netProceeds = redemptionValue - exitLoad;

  const handleOtpVerified = async (otp: string) => {
    try {
      const type = redeemType;
      const amount = redemptionValue.toString();
      await onConfirm(type, amount, otp);
      setShowOtp(false);
      setIsSuccess(true);
      setRrnNumber('MF-RED-' + Math.floor(100000000 + Math.random() * 900000000));
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setShowOtp(false);
    setRrnNumber('');
    setRedeemType('full');
    setRedeemUnits('');
    onClose();
  };

  if (showOtp) {
    return (
      <OtpAuthModal
        isOpen={true}
        onClose={() => setShowOtp(false)}
        onVerified={handleOtpVerified}
        title="Authorize Fund Redemption"
        subtitle="Authenticate with 2FA OTP to place the redemption order with the AMC."
        phone={phone}
        clientName={clientName}
        actionSummary={[
          { label: 'Scheme Name', value: fund.schemeName },
          { label: 'Redemption Type', value: redeemType === 'full' ? 'Full Redemption' : 'Partial Redemption' },
          { label: 'Gross Amount', value: formatInr(redemptionValue) },
          { label: 'Estimated Payout', value: formatInr(netProceeds) }
        ]}
        actionButtonText="Verify & Redeem"
        badgeVariant="amber"
        isPhoneLocked={true}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-[#111625] border border-[#1e2437] rounded-[24px] w-full max-w-[500px] overflow-hidden relative shadow-2xl font-sans">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#1e2437]">
          <h3 className="text-[20px] font-bold text-white tracking-wide">Redeem Investment</h3>
          <button onClick={handleClose} className="text-[#8b95a5] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-[#00d084]/20 text-[#00d084] rounded-full flex items-center justify-center mb-6">
               <CheckCircle2 className="w-8 h-8" />
             </div>
             <h4 className="text-xl font-bold text-white mb-2">Redemption Successful</h4>
             <p className="text-[#8b95a5] text-sm mb-6">Your redemption request has been placed successfully. The amount will be credited to your linked bank account in 2-3 working days.</p>
             
             <div className="bg-[#1a2035] border border-[#1e2437] rounded-xl p-4 w-full mb-8 text-left">
               <p className="text-xs text-[#8b95a5] mb-1">Retrieval Reference Number (RRN)</p>
               <p className="text-lg font-mono font-bold text-white select-all">{rrnNumber}</p>
             </div>

             <button onClick={handleClose} className="w-full bg-[#1a2035] border border-[#1e2437] hover:bg-[#252d47] text-white py-4 rounded-xl font-bold transition-colors">
               Done
             </button>
          </div>
        ) : (
          <div className="p-6 pb-8">
            
            {/* Scheme Card */}
            <div className="bg-[#1a2035] rounded-2xl p-5 mb-4">
              <p className="text-[13px] text-[#8b95a5] mb-1.5">Scheme</p>
              <p className="text-[17px] font-bold text-white tracking-wide">{fund.schemeName}</p>
            </div>
            
            {/* 4-Grid Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#1a2035] rounded-2xl p-4">
                <p className="text-[13px] text-[#8b95a5] mb-2">Available Units</p>
                <p className="text-[18px] font-bold text-[#00d084]">{fund.units}</p>
              </div>
              <div className="bg-[#1a2035] rounded-2xl p-4">
                <p className="text-[13px] text-[#8b95a5] mb-2">Current Value</p>
                <p className="text-[18px] font-bold text-white">{formatInr(fund.currentValue)}</p>
              </div>
              <div className="bg-[#1a2035] rounded-2xl p-4">
                <p className="text-[13px] text-[#8b95a5] mb-2">Current NAV</p>
                <p className="text-[18px] font-bold text-white">₹{nav.toFixed(2)}</p>
              </div>
              <div className="bg-[#1a2035] rounded-2xl p-4">
                <p className="text-[13px] text-[#8b95a5] mb-2">Invested</p>
                <p className="text-[18px] font-bold text-white">{formatInr(fund.investedAmount)}</p>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex bg-[#1a2035] p-1.5 rounded-[14px] mb-5">
              <button 
                onClick={() => { setRedeemType('full'); setRedeemUnits(''); }}
                className={`flex-1 py-3 rounded-[10px] text-[15px] font-bold transition-colors ${redeemType === 'full' ? 'bg-[#00d084] text-[#111625] shadow-sm' : 'text-[#8b95a5] hover:text-white'}`}
              >
                Full Redemption
              </button>
              <button 
                onClick={() => setRedeemType('partial')}
                className={`flex-1 py-3 rounded-[10px] text-[15px] font-bold transition-colors ${redeemType === 'partial' ? 'bg-[#00d084] text-[#111625] shadow-sm' : 'text-[#8b95a5] hover:text-white'}`}
              >
                Partial
              </button>
            </div>
            
            {/* Partial Input */}
            {redeemType === 'partial' && (
              <div className="mb-6">
                <label className="block text-[13px] text-[#8b95a5] mb-2">Number of Units to Redeem</label>
                <input 
                  type="number"
                  value={redeemUnits}
                  onChange={(e) => setRedeemUnits(e.target.value)}
                  placeholder="Enter units (e.g. 10.5)"
                  className="w-full bg-[#1a2035] border border-[#1e2437] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084] transition-all text-lg"
                />
                {Number(redeemUnits) > Number(fund.units) && (
                  <p className="text-[13px] text-red-400 mt-2">Cannot exceed available units.</p>
                )}
              </div>
            )}

            {/* Tax Info Block */}
            <div className="border border-[#4b3c20] bg-[#111625] rounded-2xl p-5 mb-6">
              <div className="flex gap-2.5 mb-4">
                <AlertCircle className="w-5 h-5 text-[#e89f13] shrink-0" />
                <div>
                  <p className="text-[15px] font-bold text-[#e89f13] mb-1.5">Exit Load & Tax Info</p>
                  <p className="text-[13px] text-[#a99c85] leading-relaxed pr-2">Exit load of 1% applies if redeemed within 365 days of purchase. Capital gains tax may apply on profits.</p>
                </div>
              </div>
              
              <div className="space-y-3.5 border-t border-[#2e261a] pt-4">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#8b95a5]">Redemption Amount</span>
                  <span className="font-bold text-white">{formatInr(redemptionValue)}</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#8b95a5]">Exit Load (1%)</span>
                  <span className="font-bold text-[#f85149]">-{formatInr(exitLoad)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-1 border-t border-[#2e261a]">
                  <span className="text-[#e89f13] font-bold text-[15px]">Net Proceeds</span>
                  <span className="text-[#00d084] font-bold text-[16px]">{formatInr(netProceeds)}</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-4">
              <button onClick={handleClose} className="flex-1 bg-transparent border border-[#1e2437] hover:bg-[#1a2035] text-white py-4 rounded-xl font-bold text-[15px] transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => setShowOtp(true)} 
                disabled={redeemType === 'partial' && (!redeemUnits || Number(redeemUnits) <= 0 || Number(redeemUnits) > Number(fund.units))}
                className="flex-1 bg-[#00d084] hover:bg-[#00b573] disabled:opacity-50 disabled:cursor-not-allowed text-[#111625] py-4 rounded-xl font-bold text-[15px] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,208,132,0.3)]"
              >
                <ShieldCheck className="w-4 h-4" /> Proceed to OTP
              </button>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
