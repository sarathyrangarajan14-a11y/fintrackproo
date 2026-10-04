import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calculator, TrendingUp, DollarSign, Percent, Calendar, ArrowLeft, 
  Coins, Landmark, ShieldAlert, BadgePercent, Scale, User, FileText, Briefcase
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function CalculatorsDashboard() {
  const { type = 'sip' } = useParams<{ type: string }>();
  const navigate = useNavigate();

  // Unified formatting helper
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // --- STATE DECLARATIONS FOR THE VARIOUS CALCULATORS ---
  // 1 & 4. SIP & MF
  const [sipMonthly, setSipMonthly] = useState<number>(5000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(10);
  const [investmentType, setInvestmentType] = useState<'sip' | 'lumpsum'>('sip');

  // 2. Lumpsum
  const [lumpAmount, setLumpAmount] = useState<number>(50000);
  const [lumpRate, setLumpRate] = useState<number>(12);
  const [lumpYears, setLumpYears] = useState<number>(10);

  // 3. SWP
  const [swpTotal, setSwpTotal] = useState<number>(1000000);
  const [swpWithdrawal, setSwpWithdrawal] = useState<number>(10000);
  const [swpRate, setSwpRate] = useState<number>(8);
  const [swpYears, setSwpYears] = useState<number>(10);

  // 5. Step-Up SIP
  const [stepupMonthly, setStepupMonthly] = useState<number>(5000);
  const [stepupPct, setStepupPct] = useState<number>(10);
  const [stepupRate, setStepupRate] = useState<number>(12);
  const [stepupYears, setStepupYears] = useState<number>(10);

  // 6. Brokerage
  const [brokeBuy, setBrokeBuy] = useState<number>(1000);
  const [brokeSell, setBrokeSell] = useState<number>(1100);
  const [brokeQty, setBrokeQty] = useState<number>(100);
  const [brokeType, setBrokeType] = useState<'delivery' | 'intraday'>('delivery');

  // 7. Margin
  const [marginPrice, setMarginPrice] = useState<number>(500);
  const [marginQty, setMarginQty] = useState<number>(200);
  const [marginLeverage, setMarginLeverage] = useState<number>(5);

  // 8. Stock Average
  const [stockQty1, setStockQty1] = useState<number>(100);
  const [stockPrice1, setStockPrice1] = useState<number>(150);
  const [stockQty2, setStockQty2] = useState<number>(50);
  const [stockPrice2, setStockPrice2] = useState<number>(180);

  // 9. SSY (Sukanya Samriddhi Yojana)
  const [ssyContribution, setSsyContribution] = useState<number>(50000);
  const ssyRate = 8.2; // Government-fixed interest rate p.a.

  // 10. PPF (Public Provident Fund)
  const [ppfContribution, setPpfContribution] = useState<number>(50000);
  const [ppfYears, setPpfYears] = useState<number>(15);
  const ppfRate = 7.1; // Government-fixed interest rate p.a.

  // 11. RD
  const [rdMonthly, setRdMonthly] = useState<number>(5000);
  const [rdRate, setRdRate] = useState<number>(7.0);
  const [rdYears, setRdYears] = useState<number>(5);

  // 12. FD
  const [fdPrincipal, setFdPrincipal] = useState<number>(100000);
  const [fdRate, setFdRate] = useState<number>(7.1);
  const [fdYears, setFdYears] = useState<number>(5);

  // 13. EPF
  const [epfBasic, setEpfBasic] = useState<number>(30000);
  const [epfBalance, setEpfBalance] = useState<number>(50000);
  const [epfAge, setEpfAge] = useState<number>(25);
  const [epfRetire, setEpfRetire] = useState<number>(58);
  const epfRate = 8.25; // Government-fixed interest rate p.a.

  // 14. Income Tax
  const [taxGross, setTaxGross] = useState<number>(1200000);
  const [taxDeductions, setTaxDeductions] = useState<number>(150000);

  // 15. GST
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstAction, setGstAction] = useState<'add' | 'remove'>('add');

  // 16. HRA
  const [hraBasic, setHraBasic] = useState<number>(50000);
  const [hraReceived, setHraReceived] = useState<number>(20000);
  const [hraRent, setHraRent] = useState<number>(15000);
  const [hraMetro, setHraMetro] = useState<boolean>(true);

  // 17. Salary
  const [salCTC, setSalCTC] = useState<number>(1200000);
  const [salDeducts, setSalDeducts] = useState<number>(50000);

  // 18. TDS
  const [tdsAmount, setTdsAmount] = useState<number>(50000);
  const [tdsType, setTdsType] = useState<'professional' | 'rent' | 'commission'>('professional');

  // 19, 20 & 21. EMI, Car Loan, Home Loan
  const [emiPrincipal, setEmiPrincipal] = useState<number>(5000000);
  const [emiRate, setEmiRate] = useState<number>(8.5);
  const [emiYears, setEmiYears] = useState<number>(20);

  // 22. ROI
  const [roiInitial, setRoiInitial] = useState<number>(100000);
  const [roiFinal, setRoiFinal] = useState<number>(150000);
  const [roiYears, setRoiYears] = useState<number>(3);

  // Sync EMI principal and rate based on specialized loan selections on mount
  useEffect(() => {
    if (type === 'car-loan') {
      setEmiPrincipal(800000);
      setEmiRate(9.5);
      setEmiYears(7);
    } else if (type === 'home-loan') {
      setEmiPrincipal(5000000);
      setEmiRate(8.5);
      setEmiYears(20);
    } else if (type === 'emi') {
      setEmiPrincipal(1000000);
      setEmiRate(10.5);
      setEmiYears(5);
    }
  }, [type]);

  // --- MATHEMATICAL FORMULAS & CALCULATION ENGINES ---
  const calculateSIP = (monthly: number, expected: number, years: number) => {
    const r = expected / 12 / 100;
    const months = years * 12;
    const total = monthly * months;
    const futureValue = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    const gains = Math.max(0, futureValue - total);
    return { total, futureValue, gains };
  };

  const calculateLumpsum = (p: number, r: number, y: number) => {
    const futureValue = p * Math.pow(1 + r / 100, y);
    const gains = Math.max(0, futureValue - p);
    return { total: p, futureValue, gains };
  };

  const calculateSWP = (total: number, withdraw: number, rate: number, years: number) => {
    let balance = total;
    const r = rate / 12 / 100;
    const months = years * 12;
    let totalWithdrawn = 0;
    
    for (let i = 0; i < months; i++) {
      const interest = balance * r;
      balance = balance + interest - withdraw;
      totalWithdrawn += withdraw;
      if (balance <= 0) {
        balance = 0;
        break;
      }
    }
    return { invested: total, withdrawn: totalWithdrawn, finalBalance: balance };
  };

  const calculateStepUpSIP = (monthly: number, stepup: number, rate: number, years: number) => {
    let currentMonthly = monthly;
    let totalInvested = 0;
    let futureValue = 0;
    const r = rate / 12 / 100;

    for (let year = 1; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        totalInvested += currentMonthly;
        futureValue = (futureValue + currentMonthly) * (1 + r);
      }
      currentMonthly = currentMonthly * (1 + stepup / 100);
    }
    const gains = Math.max(0, futureValue - totalInvested);
    return { total: totalInvested, futureValue, gains };
  };

  const calculateBrokerage = (buy: number, sell: number, qty: number, isIntraday: boolean) => {
    const buyValue = buy * qty;
    const sellValue = sell * qty;
    const totalTurnover = buyValue + sellValue;
    
    // Growth Platform Brokerage: 0.05% or ₹20 (whichever is lower)
    const cap = 20;
    const buyBroke = isIntraday ? Math.min(buyValue * 0.0005, cap) : 0;
    const sellBroke = isIntraday ? Math.min(sellValue * 0.0005, cap) : 0;
    const brokerage = buyBroke + sellBroke;

    // STT (Securities Transaction Tax)
    const stt = isIntraday ? (sellValue * 0.00025) : (totalTurnover * 0.001);
    
    // Transaction Charges (Exchange + SEBI + Stamp Duty)
    const exchangeCharges = totalTurnover * 0.0000345;
    const sebiCharges = totalTurnover * 0.000001;
    const stampDuty = buyValue * 0.00015;

    // GST (18% on Brokerage + Exchange Charges)
    const gst = (brokerage + exchangeCharges) * 0.18;

    const totalTaxesAndCharges = brokerage + stt + exchangeCharges + sebiCharges + stampDuty + gst;
    const rawProfitLoss = sellValue - buyValue;
    const netProfitLoss = rawProfitLoss - totalTaxesAndCharges;

    return { brokerage, taxes: totalTaxesAndCharges, netProfitLoss };
  };

  const calculateSSY = (yearly: number) => {
    let balance = 0;
    const r = ssyRate / 100;
    let totalInvested = 0;

    // SSY runs for 21 years maturity, investments done for first 15 years
    for (let i = 1; i <= 21; i++) {
      if (i <= 15) {
        balance += yearly;
        totalInvested += yearly;
      }
      const interest = balance * r;
      balance += interest;
    }
    const gains = Math.max(0, balance - totalInvested);
    return { total: totalInvested, futureValue: balance, gains };
  };

  const calculatePPF = (yearly: number, years: number) => {
    let balance = 0;
    const r = ppfRate / 100;
    let totalInvested = 0;

    for (let i = 1; i <= years; i++) {
      balance += yearly;
      totalInvested += yearly;
      const interest = balance * r;
      balance += interest;
    }
    const gains = Math.max(0, balance - totalInvested);
    return { total: totalInvested, futureValue: balance, gains };
  };

  const calculateRD = (monthly: number, rate: number, years: number) => {
    const totalInvested = monthly * years * 12;
    // RD compounds quarterly: Formula is based on compounding frequency of 4 times a year
    const r = rate / 100;
    const n = 4; // compounding frequency
    const t = years;
    
    let futureValue = 0;
    const months = years * 12;
    for (let i = 1; i <= months; i++) {
      // Find quarterly interest factor for each installment based on its duration
      const remainingMonths = months - i + 1;
      const quarterFraction = remainingMonths / 12;
      const maturityOfInstallment = monthly * Math.pow(1 + r / n, n * quarterFraction);
      futureValue += maturityOfInstallment;
    }
    const gains = Math.max(0, futureValue - totalInvested);
    return { total: totalInvested, futureValue, gains };
  };

  const calculateFD = (p: number, rate: number, years: number) => {
    // FD standard compounding is quarterly
    const f = 4;
    const futureValue = p * Math.pow(1 + (rate / 100) / f, f * years);
    const gains = Math.max(0, futureValue - p);
    return { total: p, futureValue, gains };
  };

  const calculateEPF = (basic: number, bal: number, age: number, retire: number) => {
    const years = Math.max(1, retire - age);
    let epfBal = bal;
    const interestRate = epfRate / 100;
    let totalInvested = 0;

    for (let i = 1; i <= years; i++) {
      // Basic salary increments by 5% annually
      const currentBasic = basic * Math.pow(1.05, i - 1);
      const employeeContribution = currentBasic * 0.12 * 12;
      const employerContribution = currentBasic * 0.0367 * 12; // 3.67% goes directly to EPF
      const yearlyContribution = employeeContribution + employerContribution;

      epfBal += yearlyContribution;
      totalInvested += employeeContribution; // Showing client's personal investment
      const interest = epfBal * interestRate;
      epfBal += interest;
    }
    const totalAccumulated = epfBal;
    return { total: totalInvested, futureValue: totalAccumulated, gains: Math.max(0, totalAccumulated - totalInvested) };
  };

  const calculateIncomeTax = (gross: number, deducts: number) => {
    // Simplified comparison of Old vs New regime under 2026-27 structure
    // New regime basic slab with high basic standard exemption
    const standardExemptionNew = 75000;
    const taxableNew = Math.max(0, gross - standardExemptionNew);
    
    // Old regime standard exemptions
    const taxableOld = Math.max(0, gross - deducts - 50000);

    // Dynamic slab calculator
    const computeNewTax = (income: number) => {
      if (income <= 700000) return 0; // Rebate
      let tax = 0;
      if (income > 300000) tax += Math.min(income - 300000, 300000) * 0.05;
      if (income > 600000) tax += Math.min(income - 600000, 300000) * 0.10;
      if (income > 900000) tax += Math.min(income - 900000, 300000) * 0.15;
      if (income > 1200000) tax += Math.min(income - 1200000, 300000) * 0.20;
      if (income > 1500000) tax += (income - 1500000) * 0.30;
      return tax;
    };

    const computeOldTax = (income: number) => {
      if (income <= 500000) return 0;
      let tax = 0;
      if (income > 250000) tax += Math.min(income - 250000, 250000) * 0.05;
      if (income > 500000) tax += Math.min(income - 500000, 500000) * 0.20;
      if (income > 1000000) tax += (income - 1000000) * 0.30;
      return tax;
    };

    const taxNew = computeNewTax(taxableNew) * 1.04; // 4% cess
    const taxOld = computeOldTax(taxableOld) * 1.04; // 4% cess

    return { oldTax: taxOld, newTax: taxNew };
  };

  const calculateGST = (amount: number, rate: number, isAdding: boolean) => {
    let gstAmt = 0;
    let net = 0;
    if (isAdding) {
      gstAmt = amount * (rate / 100);
      net = amount + gstAmt;
    } else {
      net = amount / (1 + rate / 100);
      gstAmt = amount - net;
    }
    return { gstAmount: gstAmt, total: isAdding ? net : amount, base: isAdding ? amount : net };
  };

  const calculateHRA = (basic: number, received: number, rent: number, isMetro: boolean) => {
    const basicDA = basic;
    const limit1 = received;
    const limit2 = Math.max(0, rent - (basicDA * 0.10));
    const limit3 = basicDA * (isMetro ? 0.50 : 0.40);
    const exempt = Math.min(limit1, limit2, limit3);
    const taxable = Math.max(0, received - exempt);
    return { exempt, taxable };
  };

  const calculateTDS = (amount: number, role: 'professional' | 'rent' | 'commission') => {
    const rate = role === 'professional' ? 10 : role === 'rent' ? 5 : 5;
    const tds = amount * (rate / 100);
    const net = amount - tds;
    return { tds, net, rate };
  };

  const calculateEMI = (p: number, rate: number, years: number) => {
    const r = rate / 12 / 100;
    const n = years * 12;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const interest = Math.max(0, totalPayment - p);
    return { monthlyEmi: emi, totalInterest: interest, totalPayable: totalPayment };
  };

  const calculateROI = (initial: number, final: number, years: number) => {
    const absReturn = ((final - initial) / initial) * 100;
    const cagr = (Math.pow(final / initial, 1 / years) - 1) * 100;
    return { absolute: absReturn, cagr };
  };


  // --- CALCULATOR SELECTION OBJECTS ---
  const calculatorsList = [
    { id: 'sip', name: 'SIP Calculator', category: 'Investment' },
    { id: 'lumpsum', name: 'Lumpsum Calculator', category: 'Investment' },
    { id: 'swp', name: 'SWP Calculator', category: 'Investment' },
    { id: 'mf', name: 'MF Calculator', category: 'Investment' },
    { id: 'stepup', name: 'Step-Up SIP Calculator', category: 'Investment' },
    { id: 'brokerage', name: 'Brokerage Calculator', category: 'Trading' },
    { id: 'margin', name: 'Margin Calculator', category: 'Trading' },
    { id: 'stock-average', name: 'Stock Average Calculator', category: 'Trading' },
    { id: 'ssy', name: 'SSY Calculator', category: 'Government Schemes' },
    { id: 'ppf', name: 'PPF Calculator', category: 'Government Schemes' },
    { id: 'rd', name: 'RD Calculator', category: 'Banking' },
    { id: 'fd', name: 'FD Calculator', category: 'Banking' },
    { id: 'epf', name: 'EPF Calculator', category: 'Banking' },
    { id: 'tax', name: 'Income Tax Calculator', category: 'Tax' },
    { id: 'gst', name: 'GST Calculator', category: 'Tax' },
    { id: 'hra', name: 'HRA Calculator', category: 'Tax' },
    { id: 'salary', name: 'Salary Calculator', category: 'Personal Finance' },
    { id: 'tds', name: 'TDS Calculator', category: 'Personal Finance' },
    { id: 'emi', name: 'EMI Calculator', category: 'Loans' },
    { id: 'car-loan', name: 'Car Loan EMI Calculator', category: 'Loans' },
    { id: 'home-loan', name: 'Home Loan EMI Calculator', category: 'Loans' },
    { id: 'roi', name: 'ROI Calculator', category: 'Personal Finance' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 md:p-12 space-y-6 sm:space-y-8 relative overflow-hidden">
      {/* Background grids and abstract glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <Calculator className="w-4 h-4" /> Multi-Calculator Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {calculatorsList.find(c => c.id === type)?.name || 'Calculator'}
            </h1>
          </div>

          <Link 
            to="/explore" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl transition-all cursor-pointer self-start sm:self-auto min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
        </div>

        {/* Mobile & Tablet Calculator Switcher (< lg) */}
        <div className="lg:hidden bg-[#0b1120] border border-white/10 rounded-2xl p-4 space-y-2 shadow-lg">
          <label htmlFor="mobile-calc-select" className="block text-xs font-extrabold uppercase tracking-wider text-emerald-400">
            Select Calculator
          </label>
          <div className="relative">
            <select
              id="mobile-calc-select"
              value={type}
              onChange={(e) => navigate(`/calculators/${e.target.value}`)}
              className="w-full bg-slate-900 border border-white/10 text-white font-bold rounded-xl px-4 py-3 text-base appearance-none focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {calculatorsList.map(item => (
                <option key={item.id} value={item.id} className="bg-slate-900 text-white">
                  {item.name} ({item.category})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Dynamic calculation workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Side navigation selector (Desktop only: lg+) */}
          <div className="hidden lg:block lg:col-span-1 space-y-3 bg-white/[0.02] border border-white/5 p-4 rounded-3xl h-[650px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2 mb-3">
              Explore Calculators
            </h3>
            {calculatorsList.map(item => {
              const isActive = item.id === type;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(`/calculators/${item.id}`)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                      : 'text-slate-400 bg-transparent border-transparent hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-[8px] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full text-slate-500 font-black">
                    {item.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Core Interactive Calculation Workspace */}
          <div className="lg:col-span-3">
            <div className="bg-[#0b1120] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              
              {/* Left Column: Dynamic Inputs */}
              <div className="p-6 md:p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-white/10 space-y-6">
                
                {/* 1. SIP CALCULATOR INPUTS */}
                {type === 'sip' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">SIP Installment Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Monthly Deposit</span>
                        <span className="font-mono font-bold text-white">{formatINR(sipMonthly)}</span>
                      </div>
                      <input 
                        type="range" min="500" max="150000" step="500" value={sipMonthly}
                        onChange={(e) => setSipMonthly(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Expected Annual Rate</span>
                        <span className="font-mono font-bold text-emerald-400">{sipRate}% p.a.</span>
                      </div>
                      <input 
                        type="range" min="1" max="30" step="0.5" value={sipRate}
                        onChange={(e) => setSipRate(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Time Tenure</span>
                        <span className="font-mono font-bold text-white">{sipYears} Years</span>
                      </div>
                      <input 
                        type="range" min="1" max="40" step="1" value={sipYears}
                        onChange={(e) => setSipYears(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 2. LUMPSUM CALCULATOR INPUTS */}
                {type === 'lumpsum' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">Lumpsum Investment Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Total Capital Investment</span>
                        <span className="font-mono font-bold text-white">{formatINR(lumpAmount)}</span>
                      </div>
                      <input 
                        type="range" min="5000" max="5000000" step="5000" value={lumpAmount}
                        onChange={(e) => setLumpAmount(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Expected Annual Rate</span>
                        <span className="font-mono font-bold text-emerald-400">{lumpRate}% p.a.</span>
                      </div>
                      <input 
                        type="range" min="1" max="30" step="0.5" value={lumpRate}
                        onChange={(e) => setLumpRate(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Time Tenure</span>
                        <span className="font-mono font-bold text-white">{lumpYears} Years</span>
                      </div>
                      <input 
                        type="range" min="1" max="40" step="1" value={lumpYears}
                        onChange={(e) => setLumpYears(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 3. SWP CALCULATOR INPUTS */}
                {type === 'swp' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">SWP Withdrawal Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Initial Total Investment</span>
                        <span className="font-mono font-bold text-white">{formatINR(swpTotal)}</span>
                      </div>
                      <input 
                        type="range" min="50000" max="10000000" step="50000" value={swpTotal}
                        onChange={(e) => setSwpTotal(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Monthly Withdrawal Goal</span>
                        <span className="font-mono font-bold text-emerald-400">{formatINR(swpWithdrawal)}</span>
                      </div>
                      <input 
                        type="range" min="1000" max="150000" step="500" value={swpWithdrawal}
                        onChange={(e) => setSwpWithdrawal(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Expected Annual Returns</span>
                        <span className="font-mono font-bold text-white">{swpRate}% p.a.</span>
                      </div>
                      <input 
                        type="range" min="1" max="30" step="0.5" value={swpRate}
                        onChange={(e) => setSwpRate(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Time Tenure</span>
                        <span className="font-mono font-bold text-white">{swpYears} Years</span>
                      </div>
                      <input 
                        type="range" min="1" max="40" step="1" value={swpYears}
                        onChange={(e) => setSwpYears(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 4. MF CALCULATOR INPUTS */}
                {type === 'mf' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">MF Returns Engine</h3>
                    <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                      <button 
                        onClick={() => setInvestmentType('sip')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${investmentType === 'sip' ? 'bg-emerald-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                      >
                        Monthly SIP
                      </button>
                      <button 
                        onClick={() => setInvestmentType('lumpsum')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${investmentType === 'lumpsum' ? 'bg-emerald-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                      >
                        Lumpsum Fund
                      </button>
                    </div>
                    
                    {investmentType === 'sip' ? (
                      <div className="space-y-6 pt-2">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-400">Monthly SIP Amount</span>
                            <span className="font-mono font-bold text-white">{formatINR(sipMonthly)}</span>
                          </div>
                          <input 
                            type="range" min="500" max="150000" step="500" value={sipMonthly}
                            onChange={(e) => setSipMonthly(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-400">Duration Years</span>
                            <span className="font-mono font-bold text-white">{sipYears} Years</span>
                          </div>
                          <input 
                            type="range" min="1" max="40" step="1" value={sipYears}
                            onChange={(e) => setSipYears(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 pt-2">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-400">Lumpsum Capital</span>
                            <span className="font-mono font-bold text-white">{formatINR(lumpAmount)}</span>
                          </div>
                          <input 
                            type="range" min="5000" max="5000000" step="5000" value={lumpAmount}
                            onChange={(e) => setLumpAmount(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-400">Duration Years</span>
                            <span className="font-mono font-bold text-white">{lumpYears} Years</span>
                          </div>
                          <input 
                            type="range" min="1" max="40" step="1" value={lumpYears}
                            onChange={(e) => setLumpYears(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. STEP-UP SIP INPUTS */}
                {type === 'stepup' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">Step-Up SIP Plan</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Initial Monthly SIP</span>
                        <span className="font-mono font-bold text-white">{formatINR(stepupMonthly)}</span>
                      </div>
                      <input 
                        type="range" min="1000" max="100000" step="500" value={stepupMonthly}
                        onChange={(e) => setStepupMonthly(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Annual Step-Up (%)</span>
                        <span className="font-mono font-bold text-emerald-400">{stepupPct}%</span>
                      </div>
                      <input 
                        type="range" min="1" max="50" step="1" value={stepupPct}
                        onChange={(e) => setStepupPct(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Expected Return Rate</span>
                        <span className="font-mono font-bold text-white">{stepupRate}% p.a.</span>
                      </div>
                      <input 
                        type="range" min="1" max="30" step="0.5" value={stepupRate}
                        onChange={(e) => setStepupRate(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Duration Years</span>
                        <span className="font-mono font-bold text-white">{stepupYears} Years</span>
                      </div>
                      <input 
                        type="range" min="1" max="40" step="1" value={stepupYears}
                        onChange={(e) => setStepupYears(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 6. BROKERAGE INPUTS */}
                {type === 'brokerage' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">Trading Brokerage Parameters</h3>
                    <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                      <button 
                        onClick={() => setBrokeType('delivery')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${brokeType === 'delivery' ? 'bg-emerald-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                      >
                        Equity Delivery
                      </button>
                      <button 
                        onClick={() => setBrokeType('intraday')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${brokeType === 'intraday' ? 'bg-emerald-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                      >
                        Equity Intraday
                      </button>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Buying Price (₹)</label>
                      <input 
                        type="number" value={brokeBuy}
                        onChange={(e) => setBrokeBuy(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Selling Price (₹)</label>
                      <input 
                        type="number" value={brokeSell}
                        onChange={(e) => setBrokeSell(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Stock Quantity</label>
                      <input 
                        type="number" value={brokeQty}
                        onChange={(e) => setBrokeQty(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 7. MARGIN INPUTS */}
                {type === 'margin' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">Margin Valuation</h3>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Share Price (₹)</label>
                      <input 
                        type="number" value={marginPrice}
                        onChange={(e) => setMarginPrice(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Quantity</label>
                      <input 
                        type="number" value={marginQty}
                        onChange={(e) => setMarginQty(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Leverage / Intraday Multiplier</label>
                      <select 
                        value={marginLeverage}
                        onChange={(e) => setMarginLeverage(Number(e.target.value))}
                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="1">1x (No Leverage)</option>
                        <option value="2">2x Leverage</option>
                        <option value="5">5x Leverage (Standard Intraday)</option>
                        <option value="10">10x Leverage</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 8. STOCK AVERAGE INPUTS */}
                {type === 'stock-average' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">Average Price Evaluator</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-400">First Buy Qty</label>
                        <input 
                          type="number" value={stockQty1}
                          onChange={(e) => setStockQty1(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-400">First Buy Price (₹)</label>
                        <input 
                          type="number" value={stockPrice1}
                          onChange={(e) => setStockPrice1(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-400">Second Buy Qty</label>
                        <input 
                          type="number" value={stockQty2}
                          onChange={(e) => setStockQty2(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-400">Second Buy Price (₹)</label>
                        <input 
                          type="number" value={stockPrice2}
                          onChange={(e) => setStockPrice2(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. SSY INPUTS */}
                {type === 'ssy' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">SSY Account Scheme</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Annual Investment Contribution</span>
                        <span className="font-mono font-bold text-white">{formatINR(ssyContribution)}</span>
                      </div>
                      <input 
                        type="range" min="1000" max="150000" step="1000" value={ssyContribution}
                        onChange={(e) => setSsyContribution(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Fixed SSY Interest Rate</span>
                      <p className="text-xs text-slate-300 font-semibold">{ssyRate}% p.a. (Govt Fixed compounding annually)</p>
                    </div>
                  </div>
                )}

                {/* 10. PPF INPUTS */}
                {type === 'ppf' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">PPF Savings Scheme</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Yearly Contribution</span>
                        <span className="font-mono font-bold text-white">{formatINR(ppfContribution)}</span>
                      </div>
                      <input 
                        type="range" min="500" max="150000" step="500" value={ppfContribution}
                        onChange={(e) => setPpfContribution(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Tenure Years</span>
                        <span className="font-mono font-bold text-white">{ppfYears} Years</span>
                      </div>
                      <input 
                        type="range" min="15" max="50" step="5" value={ppfYears}
                        onChange={(e) => setPpfYears(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Current PPF Interest Rate</span>
                      <p className="text-xs text-slate-300 font-semibold">{ppfRate}% p.a.</p>
                    </div>
                  </div>
                )}

                {/* 11. RD INPUTS */}
                {type === 'rd' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">RD Bank Rates</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Monthly Installment</span>
                        <span className="font-mono font-bold text-white">{formatINR(rdMonthly)}</span>
                      </div>
                      <input 
                        type="range" min="500" max="100000" step="500" value={rdMonthly}
                        onChange={(e) => setRdMonthly(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Interest Rate</span>
                        <span className="font-mono font-bold text-emerald-400">{rdRate}% p.a.</span>
                      </div>
                      <input 
                        type="range" min="2" max="15" step="0.1" value={rdRate}
                        onChange={(e) => setRdRate(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Tenure</span>
                        <span className="font-mono font-bold text-white">{rdYears} Years</span>
                      </div>
                      <input 
                        type="range" min="1" max="25" step="1" value={rdYears}
                        onChange={(e) => setRdYears(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 12. FD INPUTS */}
                {type === 'fd' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">Fixed Deposit Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Principal Amount</span>
                        <span className="font-mono font-bold text-white">{formatINR(fdPrincipal)}</span>
                      </div>
                      <input 
                        type="range" min="1000" max="5000000" step="5000" value={fdPrincipal}
                        onChange={(e) => setFdPrincipal(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Interest Rate</span>
                        <span className="font-mono font-bold text-emerald-400">{fdRate}% p.a.</span>
                      </div>
                      <input 
                        type="range" min="2" max="15" step="0.1" value={fdRate}
                        onChange={(e) => setFdRate(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Tenure Years</span>
                        <span className="font-mono font-bold text-white">{fdYears} Years</span>
                      </div>
                      <input 
                        type="range" min="1" max="25" step="1" value={fdYears}
                        onChange={(e) => setFdYears(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 13. EPF INPUTS */}
                {type === 'epf' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">Provident Fund Projection</h3>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Monthly Basic Salary + DA (₹)</label>
                      <input 
                        type="number" value={epfBasic}
                        onChange={(e) => setEpfBasic(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Current EPF Account Balance (₹)</label>
                      <input 
                        type="number" value={epfBalance}
                        onChange={(e) => setEpfBalance(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-400">Current Age</label>
                        <input 
                          type="number" value={epfAge}
                          onChange={(e) => setEpfAge(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-400">Retirement Age</label>
                        <input 
                          type="number" value={epfRetire}
                          onChange={(e) => setEpfRetire(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 14. INCOME TAX INPUTS */}
                {type === 'tax' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">Income Tax Estimator</h3>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Annual Gross Salary (₹)</label>
                      <input 
                        type="number" value={taxGross}
                        onChange={(e) => setTaxGross(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Total Deductions under 80C, 80D etc. (Old Regime Only)</label>
                      <input 
                        type="number" value={taxDeductions}
                        onChange={(e) => setTaxDeductions(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* 15. GST INPUTS */}
                {type === 'gst' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">GST Valuation</h3>
                    <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                      <button 
                        onClick={() => setGstAction('add')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${gstAction === 'add' ? 'bg-emerald-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                      >
                        Add GST
                      </button>
                      <button 
                        onClick={() => setGstAction('remove')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${gstAction === 'remove' ? 'bg-emerald-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                      >
                        Remove GST
                      </button>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Base Cost Amount (₹)</label>
                      <input 
                        type="number" value={gstAmount}
                        onChange={(e) => setGstAmount(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">GST Slab Rate</label>
                      <select 
                        value={gstRate}
                        onChange={(e) => setGstRate(Number(e.target.value))}
                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      >
                        <option value="5">5% (Essential Goods)</option>
                        <option value="12">12% (Standard Items)</option>
                        <option value="18">18% (Services & General Goods)</option>
                        <option value="28">28% (Luxury Goods)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 16. HRA INPUTS */}
                {type === 'hra' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">HRA Tax Exemption</h3>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Monthly Basic Salary + DA (₹)</label>
                      <input 
                        type="number" value={hraBasic}
                        onChange={(e) => setHraBasic(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Actual HRA Allowance Received (₹)</label>
                      <input 
                        type="number" value={hraReceived}
                        onChange={(e) => setHraReceived(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Actual Monthly House Rent Paid (₹)</label>
                      <input 
                        type="number" value={hraRent}
                        onChange={(e) => setHraRent(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" checked={hraMetro}
                        onChange={(e) => setHraMetro(e.target.checked)}
                        className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
                        id="metro_city"
                      />
                      <label htmlFor="metro_city" className="text-xs font-bold text-slate-300 cursor-pointer">
                        Residing in Metro City (Delhi, Mumbai, Kolkata, Chennai)
                      </label>
                    </div>
                  </div>
                )}

                {/* 17. SALARY INPUTS */}
                {type === 'salary' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">Salary Matrix</h3>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Cost to Company (CTC) Annual (₹)</label>
                      <input 
                        type="number" value={salCTC}
                        onChange={(e) => setSalCTC(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Annual Professional Tax &amp; Other Deducts (₹)</label>
                      <input 
                        type="number" value={salDeducts}
                        onChange={(e) => setSalDeducts(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* 18. TDS INPUTS */}
                {type === 'tds' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">TDS Tax Estimator</h3>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Transaction Value Amount (₹)</label>
                      <input 
                        type="number" value={tdsAmount}
                        onChange={(e) => setTdsAmount(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Payment Category Type</label>
                      <select 
                        value={tdsType}
                        onChange={(e) => setTdsType(e.target.value as any)}
                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      >
                        <option value="professional">Professional / Tech Fees (10% TDS)</option>
                        <option value="rent">Rent of Land / Building (5% TDS)</option>
                        <option value="commission">Insurance / Brokerage Commission (5% TDS)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 19, 20 & 21. EMI & LOAN INPUTS */}
                {(type === 'emi' || type === 'car-loan' || type === 'home-loan') && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">
                      {type === 'car-loan' ? 'Car Loan Details' : type === 'home-loan' ? 'Home Loan Details' : 'Loan EMI Details'}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Loan Principal</span>
                        <span className="font-mono font-bold text-white">{formatINR(emiPrincipal)}</span>
                      </div>
                      <input 
                        type="range" min={type === 'car-loan' ? 50000 : 100000} max={type === 'home-loan' ? 20000000 : 10000000} step="50000" value={emiPrincipal}
                        onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Annual Interest Rate</span>
                        <span className="font-mono font-bold text-emerald-400">{emiRate}% p.a.</span>
                      </div>
                      <input 
                        type="range" min="3" max="25" step="0.1" value={emiRate}
                        onChange={(e) => setEmiRate(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Loan Tenure</span>
                        <span className="font-mono font-bold text-white">{emiYears} Years</span>
                      </div>
                      <input 
                        type="range" min="1" max={type === 'home-loan' ? 30 : 10} step="1" value={emiYears}
                        onChange={(e) => setEmiYears(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 22. ROI INPUTS */}
                {type === 'roi' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider">ROI Return Valuation</h3>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Initial Outlay Cost Value (₹)</label>
                      <input 
                        type="number" value={roiInitial}
                        onChange={(e) => setRoiInitial(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Final Return Payoff Value (₹)</label>
                      <input 
                        type="number" value={roiFinal}
                        onChange={(e) => setRoiFinal(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-400">Holding Duration Years</label>
                      <input 
                        type="number" value={roiYears}
                        onChange={(e) => setRoiYears(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Visualization & Results Summary */}
              <div className="p-6 md:p-8 md:w-1/2 bg-white/[0.02] flex flex-col justify-center">
                
                {/* 1. SIP RESULTS VIEW */}
                {type === 'sip' && (() => {
                  const r = calculateSIP(sipMonthly, sipRate, sipYears);
                  const chartData = [
                    { name: 'Invested', value: r.total, color: '#94a3b8' },
                    { name: 'Gains', value: r.gains, color: '#10b981' }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Invested Amount</span>
                          <span className="text-base font-bold text-white">{formatINR(r.total)}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase">Est. Returns</span>
                          <span className="text-base font-bold text-emerald-400">{formatINR(r.gains)}</span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-5 rounded-3xl border border-white/10 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Total Future Value</span>
                        <span className="text-3xl font-black text-white">{formatINR(r.futureValue)}</span>
                      </div>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={4} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => formatINR(val)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 2. LUMPSUM RESULTS VIEW */}
                {type === 'lumpsum' && (() => {
                  const r = calculateLumpsum(lumpAmount, lumpRate, lumpYears);
                  const chartData = [
                    { name: 'Capital Invested', value: r.total, color: '#38bdf8' },
                    { name: 'Wealth Gains', value: r.gains, color: '#10b981' }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Principal Capital</span>
                          <span className="text-base font-bold text-white">{formatINR(r.total)}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase">Est. Returns</span>
                          <span className="text-base font-bold text-emerald-400">{formatINR(r.gains)}</span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-5 rounded-3xl border border-white/10 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Total Maturity Value</span>
                        <span className="text-3xl font-black text-white">{formatINR(r.futureValue)}</span>
                      </div>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={4} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => formatINR(val)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 3. SWP RESULTS VIEW */}
                {type === 'swp' && (() => {
                  const r = calculateSWP(swpTotal, swpWithdrawal, swpRate, swpYears);
                  const chartData = [
                    { name: 'Remaining Capital', value: r.finalBalance, color: '#a78bfa' },
                    { name: 'Total Withdrawn', value: r.withdrawn, color: '#f59e0b' }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                          <span className="text-[10px] text-amber-400 font-bold block mb-1 uppercase">Total Withdrawn</span>
                          <span className="text-base font-bold text-amber-400">{formatINR(r.withdrawn)}</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Maturity Balance</span>
                          <span className="text-base font-bold text-white">{formatINR(r.finalBalance)}</span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-5 rounded-3xl border border-white/10 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">SWP Account Payoff Value</span>
                        <span className="text-2xl font-black text-emerald-400">{formatINR(r.finalBalance + r.withdrawn)}</span>
                      </div>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={4} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => formatINR(val)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 4. MF RETURNS VIEW */}
                {type === 'mf' && (() => {
                  const r = investmentType === 'sip' 
                    ? calculateSIP(sipMonthly, sipRate, sipYears)
                    : calculateLumpsum(lumpAmount, lumpRate, lumpYears);
                  const chartData = [
                    { name: 'Invested', value: r.total, color: '#f43f5e' },
                    { name: 'Compound Returns', value: r.gains, color: '#10b981' }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Invested Amount</span>
                          <span className="text-base font-bold text-white">{formatINR(r.total)}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase">Growth Gains</span>
                          <span className="text-base font-bold text-emerald-400">{formatINR(r.gains)}</span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-5 rounded-3xl border border-white/10 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Mutual Fund Value</span>
                        <span className="text-3xl font-black text-white">{formatINR(r.futureValue)}</span>
                      </div>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={4} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => formatINR(val)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 5. STEP-UP SIP RESULTS VIEW */}
                {type === 'stepup' && (() => {
                  const r = calculateStepUpSIP(stepupMonthly, stepupPct, stepupRate, stepupYears);
                  const chartData = [
                    { name: 'Incremented Investment', value: r.total, color: '#a78bfa' },
                    { name: 'Step-Up Returns', value: r.gains, color: '#10b981' }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Total Paid Cap</span>
                          <span className="text-base font-bold text-white">{formatINR(r.total)}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase">Gains Over Time</span>
                          <span className="text-base font-bold text-emerald-400">{formatINR(r.gains)}</span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-5 rounded-3xl border border-white/10 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Maturity Value</span>
                        <span className="text-3xl font-black text-white">{formatINR(r.futureValue)}</span>
                      </div>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={4} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => formatINR(val)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 6. BROKERAGE RESULTS VIEW */}
                {type === 'brokerage' && (() => {
                  const r = calculateBrokerage(brokeBuy, brokeSell, brokeQty, brokeType === 'intraday');
                  const isProfit = r.netProfitLoss >= 0;
                  return (
                    <div className="space-y-6">
                      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-3">
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                          <span>Total Brokerage</span>
                          <span className="text-white font-mono">{formatINR(r.brokerage)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                          <span>Taxes &amp; Statutory Levies</span>
                          <span className="text-white font-mono">{formatINR(r.taxes)}</span>
                        </div>
                        <div className="border-t border-white/5 pt-3 flex justify-between text-xs font-bold text-slate-300">
                          <span>Buy Value Total</span>
                          <span className="font-mono">{formatINR(brokeBuy * brokeQty)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-300">
                          <span>Sell Value Total</span>
                          <span className="font-mono">{formatINR(brokeSell * brokeQty)}</span>
                        </div>
                      </div>

                      <div className={`p-6 rounded-[24px] text-center border ${
                        isProfit 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        <span className="text-[10px] block uppercase font-bold mb-1">Net Yield Profit / Loss</span>
                        <span className="text-3xl font-black font-mono">{formatINR(r.netProfitLoss)}</span>
                        <p className="text-[10px] text-slate-500 font-semibold mt-2">Inclusive of STT, SEBI fee, Stamp duty &amp; 18% GST</p>
                      </div>
                    </div>
                  );
                })()}

                {/* 7. MARGIN RESULTS VIEW */}
                {type === 'margin' && (() => {
                  const totalVal = marginPrice * marginQty;
                  const reqMargin = totalVal / marginLeverage;
                  return (
                    <div className="space-y-6 text-center">
                      <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px] space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Share Purchase Value</span>
                        <span className="text-2xl font-bold text-white font-mono">{formatINR(totalVal)}</span>
                      </div>
                      
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[24px] space-y-1">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">Capital Margin Required ({marginLeverage}x)</span>
                        <span className="text-4xl font-black text-emerald-400 font-mono">{formatINR(reqMargin)}</span>
                      </div>
                      
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Leverage amplifies both potential profits and potential losses. Trade responsibly.
                      </p>
                    </div>
                  );
                })()}

                {/* 8. STOCK AVERAGE RESULTS VIEW */}
                {type === 'stock-average' && (() => {
                  const totalShares = stockQty1 + stockQty2;
                  const totalCost = (stockQty1 * stockPrice1) + (stockQty2 * stockPrice2);
                  const avgPrice = totalShares > 0 ? (totalCost / totalShares) : 0;
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Total Shares</span>
                          <span className="text-base font-bold text-white">{totalShares} Units</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Total Cost</span>
                          <span className="text-base font-bold text-white">{formatINR(totalCost)}</span>
                        </div>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[24px] text-center space-y-1">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">Combined Stock Average Buy Price</span>
                        <span className="text-4xl font-black text-emerald-400 font-mono">{formatINR(avgPrice)}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* 9. SSY RESULTS VIEW */}
                {type === 'ssy' && (() => {
                  const r = calculateSSY(ssyContribution);
                  const chartData = [
                    { name: 'Invested', value: r.total, color: '#f59e0b' },
                    { name: 'SSY Interest', value: r.gains, color: '#10b981' }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Total Invested (15 Yr)</span>
                          <span className="text-base font-bold text-white">{formatINR(r.total)}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase">Est. Returns</span>
                          <span className="text-base font-bold text-emerald-400">{formatINR(r.gains)}</span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-5 rounded-3xl border border-white/10 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Maturity Value (21 Yr)</span>
                        <span className="text-3xl font-black text-white">{formatINR(r.futureValue)}</span>
                      </div>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={4} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => formatINR(val)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 10. PPF RESULTS VIEW */}
                {type === 'ppf' && (() => {
                  const r = calculatePPF(ppfContribution, ppfYears);
                  const chartData = [
                    { name: 'Invested', value: r.total, color: '#f59e0b' },
                    { name: 'PPF Interest Earned', value: r.gains, color: '#10b981' }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Total Invested</span>
                          <span className="text-base font-bold text-white">{formatINR(r.total)}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase">Interest Gains</span>
                          <span className="text-base font-bold text-emerald-400">{formatINR(r.gains)}</span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-5 rounded-3xl border border-white/10 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">PPF Maturity Balance</span>
                        <span className="text-3xl font-black text-white">{formatINR(r.futureValue)}</span>
                      </div>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={4} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => formatINR(val)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 11. RD RESULTS VIEW */}
                {type === 'rd' && (() => {
                  const r = calculateRD(rdMonthly, rdRate, rdYears);
                  const chartData = [
                    { name: 'RD Invested', value: r.total, color: '#38bdf8' },
                    { name: 'RD Interest Yield', value: r.gains, color: '#10b981' }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Total Deposits</span>
                          <span className="text-base font-bold text-white">{formatINR(r.total)}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase">Estimated Return</span>
                          <span className="text-base font-bold text-emerald-400">{formatINR(r.gains)}</span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-5 rounded-3xl border border-white/10 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Total Maturity Value</span>
                        <span className="text-3xl font-black text-white">{formatINR(r.futureValue)}</span>
                      </div>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={4} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => formatINR(val)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 12. FD RESULTS VIEW */}
                {type === 'fd' && (() => {
                  const r = calculateFD(fdPrincipal, fdRate, fdYears);
                  const chartData = [
                    { name: 'Principal Outlay', value: r.total, color: '#38bdf8' },
                    { name: 'FD Compound Yield', value: r.gains, color: '#10b981' }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Deposited Principal</span>
                          <span className="text-base font-bold text-white">{formatINR(r.total)}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase">Interest Earned</span>
                          <span className="text-base font-bold text-emerald-400">{formatINR(r.gains)}</span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-5 rounded-3xl border border-white/10 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">FD Maturity Value</span>
                        <span className="text-3xl font-black text-white">{formatINR(r.futureValue)}</span>
                      </div>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={4} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => formatINR(val)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 13. EPF RESULTS VIEW */}
                {type === 'epf' && (() => {
                  const r = calculateEPF(epfBasic, epfBalance, epfAge, epfRetire);
                  const chartData = [
                    { name: 'Personal PF Deducted', value: r.total, color: '#a78bfa' },
                    { name: 'PF Employer Share & Interest', value: r.gains, color: '#10b981' }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Emp. Contribution</span>
                          <span className="text-base font-bold text-white">{formatINR(r.total)}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase">Est. PF Interest</span>
                          <span className="text-base font-bold text-emerald-400">{formatINR(r.gains)}</span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-5 rounded-3xl border border-white/10 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Maturity Retirement Corpus</span>
                        <span className="text-3xl font-black text-white">{formatINR(r.futureValue)}</span>
                      </div>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={4} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => formatINR(val)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 14. INCOME TAX RESULTS VIEW */}
                {type === 'tax' && (() => {
                  const r = calculateIncomeTax(taxGross, taxDeductions);
                  const chartData = [
                    { name: 'Old Regime', tax: r.oldTax },
                    { name: 'New Regime', tax: r.newTax }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-5 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-400">Old Regime Tax</span>
                          <span className="font-mono text-sm font-bold text-white">{formatINR(r.oldTax)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-emerald-400">New Regime Tax (Recommended)</span>
                          <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">{formatINR(r.newTax)}</span>
                        </div>
                      </div>

                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} width={40} />
                            <Bar dataKey="tax" fill="#10b981" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 15. GST RESULTS VIEW */}
                {type === 'gst' && (() => {
                  const r = calculateGST(gstAmount, gstRate, gstAction === 'add');
                  const chartData = [
                    { name: 'Net Cost Price', value: r.base, color: '#a78bfa' },
                    { name: 'GST Share Amount', value: r.gstAmount, color: '#10b981' }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Net Base Price</span>
                          <span className="text-base font-bold text-white">{formatINR(r.base)}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase">GST Amount ({gstRate}%)</span>
                          <span className="text-base font-bold text-emerald-400">{formatINR(r.gstAmount)}</span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-5 rounded-3xl border border-white/10 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Gross Billing Invoice</span>
                        <span className="text-3xl font-black text-white">{formatINR(r.total)}</span>
                      </div>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={4} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => formatINR(val)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 16. HRA RESULTS VIEW */}
                {type === 'hra' && (() => {
                  const r = calculateHRA(hraBasic, hraReceived, hraRent, hraMetro);
                  return (
                    <div className="space-y-6">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[24px] text-center space-y-1">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">Tax-Exempt HRA Amount</span>
                        <span className="text-4xl font-black text-emerald-400 font-mono">{formatINR(r.exempt)}</span>
                      </div>

                      <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px] text-center space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Taxable Portion of HRA</span>
                        <span className="text-2xl font-bold text-red-400 font-mono">{formatINR(r.taxable)}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* 17. SALARY RESULTS VIEW */}
                {type === 'salary' && (() => {
                  const monthlyGross = salCTC / 12;
                  const epfVal = Math.min(monthlyGross * 0.12, 15000); // Standard caps
                  const inHand = monthlyGross - epfVal - (salDeducts / 12);
                  return (
                    <div className="space-y-6">
                      <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl space-y-3">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Monthly Gross Salary</span>
                          <span className="text-white font-mono">{formatINR(monthlyGross)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Monthly EPF Deductions</span>
                          <span className="text-white font-mono">{formatINR(epfVal)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Professional Tax &amp; Other Levy</span>
                          <span className="text-white font-mono">{formatINR(salDeducts / 12)}</span>
                        </div>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[24px] text-center space-y-1">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">Take-Home Monthly In-Hand Salary</span>
                        <span className="text-4xl font-black text-emerald-400 font-mono">{formatINR(inHand)}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* 18. TDS RESULTS VIEW */}
                {type === 'tds' && (() => {
                  const r = calculateTDS(tdsAmount, tdsType);
                  return (
                    <div className="space-y-6 text-center">
                      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[24px] space-y-1">
                        <span className="text-[10px] text-red-400 font-bold uppercase block">Tax Deducted (TDS @ {r.rate}%)</span>
                        <span className="text-3xl font-bold text-red-400 font-mono">{formatINR(r.tds)}</span>
                      </div>
                      
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[24px] space-y-1">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">Net In-Hand Disbursement</span>
                        <span className="text-4xl font-black text-emerald-400 font-mono">{formatINR(r.net)}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* 19, 20 & 21. EMI & LOAN RESULTS VIEW */}
                {(type === 'emi' || type === 'car-loan' || type === 'home-loan') && (() => {
                  const r = calculateEMI(emiPrincipal, emiRate, emiYears);
                  const chartData = [
                    { name: 'Principal Outlay', value: emiPrincipal, color: '#38bdf8' },
                    { name: 'Interest Yield Cost', value: r.totalInterest, color: '#ef4444' }
                  ];
                  return (
                    <div className="space-y-6">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl text-center">
                        <span className="text-[10px] text-emerald-400 block uppercase font-bold mb-1">Monthly Loan EMI Payment</span>
                        <span className="text-3xl font-black text-emerald-400">{formatINR(r.monthlyEmi)}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Total Interest</span>
                          <span className="text-sm font-bold text-red-400">{formatINR(r.totalInterest)}</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Total Amount</span>
                          <span className="text-sm font-bold text-white">{formatINR(r.totalPayable)}</span>
                        </div>
                      </div>

                      <div className="h-36">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => formatINR(val)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* 22. ROI RESULTS VIEW */}
                {type === 'roi' && (() => {
                  const r = calculateROI(roiInitial, roiFinal, roiYears);
                  return (
                    <div className="space-y-6 text-center">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[24px] space-y-1">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">Absolute Return Yield (ROI)</span>
                        <span className="text-4xl font-black text-emerald-400 font-mono">{r.absolute.toFixed(2)}%</span>
                      </div>

                      {roiYears > 0 && (
                        <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px] space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Annualized CAGR return yield</span>
                          <span className="text-2xl font-bold text-white font-mono">{r.cagr.toFixed(2)}% p.a.</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
