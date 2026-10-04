import { BookOpen } from "lucide-react";

export default function WhatIsMutualFund() {
  return (
    <div className="flex flex-col items-center py-20 px-4 md:px-6 relative z-10 w-full">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 font-medium mb-6">
            <BookOpen className="h-4 w-4 mr-2" />
            Learning Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            What is a Mutual Fund?
          </h1>
          <p className="text-lg text-slate-400">
            A simple guide to understanding how mutual funds pool money to create wealth.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-xl prose prose-invert prose-emerald max-w-none">
          <h2 className="text-2xl font-bold text-white mb-4">The Basics</h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            A mutual fund is a financial vehicle that pools money collected from many investors to invest in securities like stocks, bonds, money market instruments, and other assets. Professional money managers operate mutual funds, allocating the fund's assets and attempting to produce capital gains or income for the fund's investors.
          </p>
          
          <h3 className="text-xl font-bold text-white mb-3 mt-8">How does it work?</h3>
          <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-6">
            <li><strong>Pooling Money:</strong> Many investors with similar investment objectives pool their money together.</li>
            <li><strong>Professional Management:</strong> An expert fund manager invests this pool of money in different assets.</li>
            <li><strong>Units & NAV:</strong> You get 'units' based on the amount you invest. The price of each unit is called the Net Asset Value (NAV).</li>
            <li><strong>Returns:</strong> The profits (or losses) are shared by all investors in proportion to their investment.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mb-3 mt-8">Types of Mutual Funds</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="font-bold text-emerald-400 mb-2">Equity Funds</h4>
              <p className="text-sm text-slate-400">Invest primarily in stocks. High risk, but potentially higher returns over the long term.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="font-bold text-emerald-400 mb-2">Debt Funds</h4>
              <p className="text-sm text-slate-400">Invest in fixed income instruments like bonds. Lower risk, steady returns.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="font-bold text-emerald-400 mb-2">Hybrid Funds</h4>
              <p className="text-sm text-slate-400">A mix of both equity and debt, balancing risk and return.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="font-bold text-emerald-400 mb-2">Index Funds</h4>
              <p className="text-sm text-slate-400">Passively track a market index (like NIFTY 50) with lower fees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
