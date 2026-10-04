import { BookOpen, TrendingUp, Calendar } from "lucide-react";

export default function SipVsLumpsum() {
  return (
    <div className="flex flex-col items-center py-20 px-4 md:px-6 relative z-10 w-full">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 font-medium mb-6">
            <BookOpen className="h-4 w-4 mr-2" />
            Learning Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            SIP vs Lumpsum
          </h1>
          <p className="text-lg text-slate-400">
            Comparing the two popular methods of investing in mutual funds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="bg-emerald-500/20 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
              <Calendar className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">SIP (Systematic Investment Plan)</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Investing a fixed amount regularly (e.g., monthly) into a mutual fund.
            </p>
            <ul className="space-y-3 text-slate-300 list-disc pl-4">
              <li>Instills financial discipline.</li>
              <li>Rupee Cost Averaging (buy more units when markets are low, fewer when high).</li>
              <li>No need to time the market.</li>
              <li>Light on the wallet, start with as little as ₹500.</li>
            </ul>
          </div>
          
          <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="bg-indigo-500/20 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-400 mb-6">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Lumpsum Investing</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Investing a large sum of money in a mutual fund in one single go.
            </p>
            <ul className="space-y-3 text-slate-300 list-disc pl-4">
              <li>Ideal when you have a surplus amount (bonus, inheritance, sale of asset).</li>
              <li>Requires market timing to maximize returns (buying low).</li>
              <li>Higher risk if the market falls immediately after investment.</li>
              <li>Can generate significant wealth if invested during market lows.</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-emerald-500/20 rounded-[32px] p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Which one should you choose?</h2>
          <p className="text-slate-300 leading-relaxed">
            The choice between SIP and lumpsum depends on your cash flow. If you earn a regular salary, SIP is the logical choice to invest your savings monthly. If you receive a sudden windfall, a lumpsum investment (or a systematic transfer plan - STP) might be more appropriate. Many successful investors use a combination of both!
          </p>
        </div>
      </div>
    </div>
  );
}
