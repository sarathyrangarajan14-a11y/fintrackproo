import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Calculator, TrendingUp } from "lucide-react";

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [durationYears, setDurationYears] = useState<number>(10);

  // Math
  const monthlyRate = expectedReturn / 12 / 100;
  const months = durationYears * 12;
  const totalInvested = monthlyInvestment * months;
  const expectedValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const expectedWealthGain = expectedValue - totalInvested;

  const data = [
    { name: "Invested Amount", value: totalInvested, color: "#94a3b8" },
    { name: "Estimated Returns", value: expectedWealthGain, color: "#10b981" }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="flex-1 relative z-10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <Calculator className="h-8 w-8 text-emerald-400" />
            SIP Calculator
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Calculate your estimated wealth accumulation over time.
          </p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl rounded-[32px] border border-white/10 overflow-hidden flex flex-col md:flex-row">
          
          {/* Controls */}
          <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-white/10 space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-slate-300">Monthly Investment</label>
                <span className="font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-xl">
                  {formatCurrency(monthlyInvestment)}
                </span>
              </div>
              <input 
                type="range" 
                min="500" max="100000" step="500" 
                value={monthlyInvestment} 
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-slate-300">Expected Return Rate (p.a)</label>
                <span className="font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-xl">
                  {expectedReturn}%
                </span>
              </div>
              <input 
                type="range" 
                min="1" max="30" step="0.5" 
                value={expectedReturn} 
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-slate-300">Time Period</label>
                <span className="font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-xl">
                  {durationYears} Years
                </span>
              </div>
              <input 
                type="range" 
                min="1" max="40" step="1" 
                value={durationYears} 
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          {/* Visualization */}
          <div className="p-8 md:w-1/2 bg-white/[0.02] flex flex-col justify-center">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-[24px]">
                  <div className="text-sm font-bold text-slate-400 mb-1">Invested Amount</div>
                  <div className="text-xl font-bold text-white">{formatCurrency(totalInvested)}</div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-[24px]">
                  <div className="text-sm font-bold text-emerald-400 mb-1">Est. Returns</div>
                  <div className="text-xl font-bold text-emerald-400">{formatCurrency(expectedWealthGain)}</div>
                </div>
              </div>
              
              <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px] text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500"></div>
                <div className="text-sm font-bold text-slate-400 mb-2">Total Value</div>
                <div className="text-4xl font-bold text-white">{formatCurrency(expectedValue)}</div>
              </div>

              <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <TrendingUp className="h-8 w-8 text-emerald-500 opacity-80" />
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-slate-400 mt-6">
              Illustrative estimate only. Mutual fund investments are subject to market risks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
