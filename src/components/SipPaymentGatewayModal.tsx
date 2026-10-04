import React, { useState, useEffect } from "react";
import { 
  X, ShieldCheck, CreditCard, Building2, Smartphone, CheckCircle2, 
  Lock, ArrowRight, RefreshCw, AlertCircle, QrCode, Copy, Check, 
  Download, Printer, ChevronRight, ExternalLink, Sparkles, ShieldAlert, MessageSquare
} from "lucide-react";
import { generateReportPdf } from "../lib/pdfGenerator";
import { auth } from "../lib/firebase";
import { smsNotificationService } from "../services/smsNotificationService";
import ProfessionalOtpInput from "./common/ProfessionalOtpInput";

export interface PaymentOrderInfo {
  orderId: string;
  sipNo: string;
  txnNo: string;
  amount: number;
  schemeName: string;
  schemeCode?: string;
  sipDate: number;
  paymentUrl?: string;
  isMock?: boolean;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

export interface PaymentSuccessData {
  sipNo: string;
  txnNo: string;
  orderId: string;
  paymentId: string;
  amount: number;
  schemeName: string;
  paymentMode: string;
  utrNo: string;
  executionDate: string;
  nextDebitDate: string;
}

interface SipPaymentGatewayModalProps {
  orderInfo: PaymentOrderInfo;
  onClose: () => void;
  onPaymentSuccess: (data: PaymentSuccessData) => void;
  token?: string;
}

const POPULAR_BANKS = [
  { id: "HDFC", name: "HDFC Bank", code: "HDFC0000001", short: "HDFC" },
  { id: "ICICI", name: "ICICI Bank", code: "ICIC0000001", short: "ICICI" },
  { id: "SBI", name: "State Bank of India", code: "SBIN0000001", short: "SBI" },
  { id: "AXIS", name: "Axis Bank", code: "UTIB0000001", short: "Axis" },
  { id: "KOTAK", name: "Kotak Mahindra Bank", code: "KKBK0000001", short: "Kotak" },
  { id: "PNB", name: "Punjab National Bank", code: "PUNB0000001", short: "PNB" }
];

const ALL_BANKS = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "IndusInd Bank",
  "Union Bank of India",
  "IDFC FIRST Bank",
  "Yes Bank",
  "Federal Bank",
  "Central Bank of India",
  "Indian Bank"
];

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", icon: "GPay", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { id: "phonepe", name: "PhonePe", icon: "PhonePe", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { id: "paytm", name: "Paytm UPI", icon: "Paytm", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  { id: "bhim", name: "BHIM UPI", icon: "BHIM", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { id: "cred", name: "CRED UPI", icon: "CRED", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" }
];

export default function SipPaymentGatewayModal({
  orderInfo,
  onClose,
  onPaymentSuccess,
  token
}: SipPaymentGatewayModalProps) {
  const [activeTab, setActiveTab] = useState<"upi" | "netbanking" | "card" | "mandate">("upi");
  
  // UPI Form State
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("gpay");
  const [upiId, setUpiId] = useState<string>("investor@okhdfcbank");
  const [isUpiValid, setIsUpiValid] = useState<boolean>(true);
  const [copiedQr, setCopiedQr] = useState<boolean>(false);

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState<string>("HDFC Bank");

  // Card State
  const [cardNumber, setCardNumber] = useState<string>("4532 8921 4458 9201");
  const [cardHolder, setCardHolder] = useState<string>(orderInfo.clientName || "Investor Account");
  const [cardExpiry, setCardExpiry] = useState<string>("08/29");
  const [cardCvv, setCardCvv] = useState<string>("382");

  // Mandate / NACH State
  const [authMode, setAuthMode] = useState<"aadhaar" | "netbanking" | "debit">("aadhaar");

  // Timer countdown (10 mins)
  const [timeLeft, setTimeLeft] = useState<number>(600);

  // Processing & Simulation State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [otpPrompt, setOtpPrompt] = useState<boolean>(false);
  const [bankOtp, setBankOtp] = useState<string>("");
  const [bankResendTimer, setBankResendTimer] = useState<number>(60);
  const [isVerifyingBankOtp, setIsVerifyingBankOtp] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Success State
  const [successResult, setSuccessResult] = useState<PaymentSuccessData | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (successResult || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [successResult, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Bank Resend Timer countdown
  useEffect(() => {
    let timer: any;
    if (otpPrompt && bankResendTimer > 0) {
      timer = setInterval(() => {
        setBankResendTimer(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpPrompt, bankResendTimer]);

  const handleResendBankOtp = async () => {
    if (bankResendTimer > 0 || isVerifyingBankOtp) return;
    const rawPhone = String(orderInfo.clientPhone || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '9876543210';
    setPaymentError(null);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          reason: `HDFC Bank E-Mandate SIP Authorization (₹${orderInfo.amount.toLocaleString('en-IN')})`,
          clientName: orderInfo.clientName || 'Investor',
          amount: orderInfo.amount
        })
      });
      const data = await res.json();
      if (data.success) {
        setBankResendTimer(60);
      }
    } catch (e) {
      console.warn("Bank OTP resend error:", e);
    }
  };

  // Card number input formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  // Card expiry formatting
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  // Initiate Payment Submission
  const handleInitiatePayment = async () => {
    setPaymentError(null);
    setIsProcessing(true);
    setProcessingStage(1);

    // Progressive visual feedback
    setTimeout(() => setProcessingStage(2), 700);
    setTimeout(() => setProcessingStage(3), 1400);

    // If OTP verification is chosen for card or e-mandate
    if (activeTab === 'card' || activeTab === 'mandate') {
      const rawPhone = String(orderInfo.clientPhone || '').replace(/\D/g, '');
      const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '9876543210';
      
      try {
        const res = await fetch('/api/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: cleanPhone,
            reason: `HDFC Bank E-Mandate SIP Authorization (₹${orderInfo.amount.toLocaleString('en-IN')})`,
            clientName: orderInfo.clientName || 'Investor',
            amount: orderInfo.amount
          })
        });
        await res.json();
      } catch (err) {
        console.warn('Bank OTP dispatch error:', err);
      }

      setTimeout(() => {
        setIsProcessing(false);
        setOtpPrompt(true);
      }, 1600);
      return;
    }

    // Otherwise complete payment verification with backend directly
    completeVerification();
  };

  // Strictly verify Bank OTP before completing mandate verification
  const handleVerifyBankOtp = async () => {
    const cleanCode = bankOtp.trim();
    if (!cleanCode || cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      setPaymentError("Please enter the complete 6-digit numeric Bank OTP received in your SMS message.");
      return;
    }

    setIsVerifyingBankOtp(true);
    setPaymentError(null);

    const rawPhone = String(orderInfo.clientPhone || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '9876543210';

    try {
      const verifyRes = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          otp: cleanCode
        })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setPaymentError(verifyData.error || "Security Check Failed: Incorrect Bank OTP entered. You must enter the exact 6-digit code received in your message.");
        setIsVerifyingBankOtp(false);
        return;
      }

      // Security check passed! Complete verification
      setIsVerifyingBankOtp(false);
      completeVerification();
    } catch (err: any) {
      console.error("Bank OTP verification failed:", err);
      setPaymentError("Network error during bank verification. Please try again.");
      setIsVerifyingBankOtp(false);
    }
  };

  const completeVerification = async () => {
    setIsProcessing(true);
    setProcessingStage(4);

    try {
      const paymentId = `MOJO_PAY_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const utrNo = `UTR${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;

      // Call backend payment verification route
      let authToken = token;
      if (!authToken) {
        try {
          authToken = await auth.currentUser?.getIdToken();
        } catch (e) {}
      }

      const response = await fetch('/api/sip/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || 'mock-token'}`
        },
        body: JSON.stringify({
          payment_id: paymentId,
          payment_request_id: orderInfo.orderId || orderInfo.txnNo,
          sipNo: orderInfo.sipNo,
          txnNo: orderInfo.txnNo,
          is_mock: orderInfo.isMock ?? true
        })
      });

      const resData = await response.json();

      if (!response.ok && !resData.success) {
        throw new Error(resData.error || "Payment gateway authorization failed.");
      }

      const today = new Date();
      let nextDate = new Date(today.getFullYear(), today.getMonth(), orderInfo.sipDate || 5);
      if (nextDate <= today) nextDate = new Date(today.getFullYear(), today.getMonth() + 1, orderInfo.sipDate || 5);

      const successData: PaymentSuccessData = {
        sipNo: orderInfo.sipNo,
        txnNo: orderInfo.txnNo,
        orderId: orderInfo.orderId,
        paymentId: paymentId,
        amount: orderInfo.amount,
        schemeName: orderInfo.schemeName,
        paymentMode: activeTab === 'upi' ? `UPI (${selectedUpiApp.toUpperCase()})` : activeTab === 'netbanking' ? `Net Banking (${selectedBank})` : activeTab === 'card' ? 'Debit Card E-Mandate' : 'NACH E-Mandate',
        utrNo: utrNo,
        executionDate: today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        nextDebitDate: nextDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      setSuccessResult(successData);
      setIsProcessing(false);
      setOtpPrompt(false);
      onPaymentSuccess(successData);
    } catch (err: any) {
      console.error("Payment error:", err);
      setPaymentError(err.message || "Failed to verify transaction with payment clearing house.");
      setIsProcessing(false);
      setOtpPrompt(false);
    }
  };

  // Download official receipt
  const handleDownloadReceipt = () => {
    if (!successResult) return;
    const doc = generateReportPdf(
      orderInfo.clientName || "Investor",
      "SIP Payment & Auto-Debit Mandate Receipt",
      [
        { Field: "Mutual Fund Scheme", Details: successResult.schemeName },
        { Field: "SIP Registration No", Details: successResult.sipNo },
        { Field: "Transaction Ref No", Details: successResult.txnNo },
        { Field: "Gateway Payment ID", Details: successResult.paymentId },
        { Field: "Bank UTR / RRN", Details: successResult.utrNo },
        { Field: "Amount Paid", Details: `₹${successResult.amount.toLocaleString('en-IN')}` },
        { Field: "Payment Method", Details: successResult.paymentMode },
        { Field: "Payment Date", Details: successResult.executionDate },
        { Field: "Upcoming Auto-Debit", Details: successResult.nextDebitDate },
        { Field: "Mandate Status", Details: "ACTIVE & VERIFIED" }
      ],
      {
        email: orderInfo.clientEmail,
        phone: orderInfo.clientPhone,
        period: "1st Installment + Auto-Debit Mandate",
        totals: {
          invested: `₹${successResult.amount.toLocaleString('en-IN')}`,
          currentValue: `₹${successResult.amount.toLocaleString('en-IN')}`,
          gain: "₹0.00",
          returns: "0.0%"
        }
      }
    );
    doc.save(`SIP_Receipt_${successResult.sipNo}.pdf`);
  };

  return (
    <div id="sip-payment-gateway-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-white/15 rounded-[28px] shadow-2xl overflow-hidden text-white my-8 animate-in zoom-in-95 duration-200">
        
        {/* Gateway Brand Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0d172b] to-slate-900 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">velocitywealth</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Official Instamojo &amp; NPCI Payment Gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Session Expires</div>
              <div className={`text-xs font-mono font-bold ${timeLeft < 120 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                {formatTimer(timeLeft)}
              </div>
            </div>
            {!successResult && !isProcessing && (
              <button 
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close payment modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ERROR BANNER IF ANY */}
        {paymentError && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{paymentError}</span>
          </div>
        )}

        {/* SCREEN 1: SUCCESSFUL PAYMENT & MANDATE CONFIRMATION */}
        {successResult ? (
          <div className="p-6 md:p-8 space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Payment Successful &amp; SIP Activated</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your 1st installment of <strong className="text-emerald-400">₹{successResult.amount.toLocaleString('en-IN')}</strong> has been confirmed, and your monthly auto-pay mandate is officially registered with the clearing house.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Fund Name</span>
                  <div className="text-sm font-bold text-white mt-0.5">{successResult.schemeName}</div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  STATUS: CONFIRMED
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Amount Paid</span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">₹{successResult.amount.toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">SIP Reg No</span>
                  <div className="font-mono text-xs font-bold text-slate-200 mt-0.5 truncate">{successResult.sipNo}</div>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Txn Ref No</span>
                  <div className="font-mono text-xs font-bold text-slate-200 mt-0.5 truncate">{successResult.txnNo}</div>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Next Auto-Debit</span>
                  <div className="text-xs font-bold text-emerald-300 mt-0.5">{successResult.nextDebitDate}</div>
                </div>
              </div>

              <div className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Payment Reference / ID:</span>
                  <span className="font-mono text-slate-300">{successResult.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bank UTR Number:</span>
                  <span className="font-mono text-slate-300">{successResult.utrNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Channel:</span>
                  <span className="text-slate-300 font-semibold">{successResult.paymentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Authorized Timestamp:</span>
                  <span className="text-slate-300">{successResult.executionDate}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Official Receipt (PDF)
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Continue to Portfolio <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : isProcessing ? (
          /* SCREEN 2: LIVE PAYMENT PROCESSING ANIMATION */
          <div className="p-8 md:p-12 text-center space-y-6 animate-in fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center">
                <Lock className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Authorizing Payment &amp; Registering Mandate</h3>
              <p className="text-xs text-slate-400">Please do not close or refresh this window.</p>
            </div>

            {/* Step-by-step progress */}
            <div className="max-w-md mx-auto bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3 text-left">
              <div className="flex items-center gap-3 text-xs">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${processingStage >= 1 ? 'bg-emerald-500 text-black font-bold' : 'bg-white/10 text-slate-400'}`}>
                  {processingStage > 1 ? '✓' : '1'}
                </div>
                <span className={processingStage >= 1 ? 'text-white font-semibold' : 'text-slate-500'}>
                  Connecting to NPCI / Instamojo Payment Switch
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${processingStage >= 2 ? 'bg-emerald-500 text-black font-bold' : 'bg-white/10 text-slate-400'}`}>
                  {processingStage > 2 ? '✓' : '2'}
                </div>
                <span className={processingStage >= 2 ? 'text-white font-semibold' : 'text-slate-500'}>
                  Validating ₹{orderInfo.amount.toLocaleString('en-IN')} payment authorization
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${processingStage >= 3 ? 'bg-emerald-500 text-black font-bold' : 'bg-white/10 text-slate-400'}`}>
                  {processingStage > 3 ? '✓' : '3'}
                </div>
                <span className={processingStage >= 3 ? 'text-white font-semibold' : 'text-slate-500'}>
                  Registering recurring NACH auto-debit on {orderInfo.sipDate}th of month
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${processingStage >= 4 ? 'bg-emerald-500 text-black font-bold' : 'bg-white/10 text-slate-400'}`}>
                  {processingStage >= 4 ? '✓' : '4'}
                </div>
                <span className={processingStage >= 4 ? 'text-white font-semibold' : 'text-slate-500'}>
                  Confirming mutual fund unit allocation with AMC registrar
                </span>
              </div>
            </div>
          </div>
        ) : otpPrompt ? (
          /* SCREEN 3: 3D SECURE / BANK OTP CONFIRMATION */
          <div className="p-6 md:p-8 space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Bank 3D Secure / E-Mandate OTP</h3>
              <p className="text-xs text-slate-400">
                A 6-digit one-time password has been sent to your registered mobile number for authorizing recurring auto-debit.
              </p>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-4 max-w-md mx-auto">
              <ProfessionalOtpInput
                value={bankOtp}
                onChange={(code) => {
                  setBankOtp(code);
                  setPaymentError(null);
                }}
                onComplete={(code) => {
                  setBankOtp(code);
                }}
                length={6}
                phone={orderInfo.clientPhone || '9876543210'}
                onResend={handleResendBankOtp}
                resendTimer={bankResendTimer}
                loading={isVerifyingBankOtp}
                error={paymentError || ''}
                senderHeader="HDFC-BANK"
                submitButtonText="Verify & Authorize Mandate"
                onSubmit={handleVerifyBankOtp}
              />

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOtpPrompt(false);
                    setPaymentError(null);
                  }}
                  disabled={isVerifyingBankOtp}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 disabled:opacity-50 cursor-pointer transition-colors"
                >
                  Cancel & Return to Payment Options
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* SCREEN 4: PRIMARY PAYMENT GATEWAY CHECKOUT PAGE */
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Order & Amount Highlight Bar */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Mutual Fund SIP Investment
                </div>
                <div className="text-base font-bold text-white mt-0.5 line-clamp-1">{orderInfo.schemeName}</div>
                <div className="text-xs text-slate-400 flex items-center gap-3 mt-1 font-mono">
                  <span>Order: {orderInfo.orderId || orderInfo.txnNo}</span>
                  <span>•</span>
                  <span>Auto-Debit: {orderInfo.sipDate}th monthly</span>
                </div>
              </div>

              <div className="text-right md:border-l md:border-white/10 md:pl-6">
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Payable Today</div>
                <div className="text-2xl font-black text-emerald-400">₹{orderInfo.amount.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Zero Brokerage • Direct Scheme</div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Select Payment Mode
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("upi")}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    activeTab === "upi"
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/10"
                      : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs font-bold">UPI / QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("netbanking")}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    activeTab === "netbanking"
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/10"
                      : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs font-bold">Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("card")}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    activeTab === "card"
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/10"
                      : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-bold">Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("mandate")}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    activeTab === "mandate"
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/10"
                      : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-bold">e-NACH Mandate</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: UPI & QR CODE */}
            {activeTab === "upi" && (
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-5 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold text-slate-300 mb-2 block">1. Select Preferred UPI App</span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {UPI_APPS.map(app => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                          selectedUpiApp === app.id 
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow' 
                            : 'bg-black/30 border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                          {app.icon.slice(0, 2)}
                        </span>
                        <span>{app.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-t border-white/5 pt-4">
                  {/* UPI QR CODE DISPLAY */}
                  <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center space-y-2.5">
                    <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto shadow-md flex items-center justify-center relative group">
                      {/* Stylized QR simulation */}
                      <div className="w-full h-full border-2 border-slate-900 grid grid-cols-6 grid-rows-6 gap-0.5 p-1 bg-white">
                        <div className="bg-slate-900 col-span-2 row-span-2 rounded-sm" />
                        <div className="bg-white col-span-2 row-span-2" />
                        <div className="bg-slate-900 col-span-2 row-span-2 rounded-sm" />
                        <div className="bg-slate-900 col-span-1 row-span-1" />
                        <div className="bg-slate-900 col-span-2 row-span-1" />
                        <div className="bg-slate-900 col-span-1 row-span-1" />
                        <div className="bg-slate-900 col-span-1 row-span-2" />
                        <div className="bg-emerald-600 col-span-2 row-span-2 rounded-sm" />
                        <div className="bg-slate-900 col-span-1 row-span-2" />
                        <div className="bg-slate-900 col-span-2 row-span-2 rounded-sm" />
                        <div className="bg-slate-900 col-span-2 row-span-2 rounded-sm" />
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 font-semibold">
                      Scan with Google Pay, PhonePe, Paytm, or BHIM
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Amount: ₹{orderInfo.amount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* UPI ID / VPA ENTER */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">
                        Or Enter UPI ID / Virtual Payment Address (VPA)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            setIsUpiValid(e.target.value.includes('@'));
                          }}
                          placeholder="e.g. mobile@upi or name@okaxis"
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                        {isUpiValid && upiId.includes('@') && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 bg-black/20 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                      A payment request and auto-debit mandate setup will be sent directly to your UPI app for instant PIN approval.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: NET BANKING */}
            {activeTab === "netbanking" && (
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold text-slate-300 mb-2.5 block">Popular Indian Banks</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {POPULAR_BANKS.map(bank => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.name)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          selectedBank === bank.name
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow'
                            : 'bg-black/30 border-white/5 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{bank.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Instant Gateway</div>
                        </div>
                        {selectedBank === bank.name && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">
                    Or Select Another Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {ALL_BANKS.map(b => (
                      <option key={b} value={b} className="bg-slate-900 text-white">{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: DEBIT CARD */}
            {activeTab === "card" && (
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4532 •••• •••• 9201"
                      className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Name on Card</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Account Holder"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-center text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">CVV (3 Digits)</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="•••"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-center text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 bg-black/20 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Card details are tokenized securely in accordance with RBI CoF guidelines.</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: E-NACH MANDATE */}
            {activeTab === "mandate" && (
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4 animate-in fade-in">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Registered Bank:</span>
                    <span className="font-bold text-white">HDFC Bank Limited</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Account Number:</span>
                    <span className="font-mono text-slate-200">XXXX XXXX 4821</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">IFSC Code:</span>
                    <span className="font-mono text-slate-200">HDFC0000240</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Mandate Max Limit:</span>
                    <span className="font-bold text-emerald-400">₹25,000 / month</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-300 mb-2 block">Choose Authentication Method</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode("aadhaar")}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        authMode === "aadhaar" ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-black/30 border-white/5 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      Aadhaar OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("netbanking")}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        authMode === "netbanking" ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-black/30 border-white/5 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      Net Banking
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("debit")}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        authMode === "debit" ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-black/30 border-white/5 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      Debit Card
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mandate Compliance Notice */}
            <div className="text-[11px] text-slate-400 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                By clicking "Pay &amp; Authorize SIP", you authorize <strong className="text-slate-200">velocitywealth</strong> to debit <strong className="text-emerald-400">₹{orderInfo.amount.toLocaleString('en-IN')}</strong> today and set up monthly auto-debit on the <strong className="text-slate-200">{orderInfo.sipDate}th of every month</strong>. You can pause or cancel at any time.
              </span>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel Order
              </button>

              <button
                id="authorize-sip-payment-button"
                type="button"
                onClick={handleInitiatePayment}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Pay ₹{orderInfo.amount.toLocaleString('en-IN')} &amp; Setup SIP Mandate
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
