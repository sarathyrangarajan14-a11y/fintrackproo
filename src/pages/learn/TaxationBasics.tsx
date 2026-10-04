import { BookOpen, AlertCircle, FileText } from "lucide-react";

export default function TaxationBasics() {
  return (
    <div className="flex flex-col items-center py-20 px-4 md:px-6 relative z-10 w-full">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 font-medium mb-6">
            <BookOpen className="h-4 w-4 mr-2" />
            Learning Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Taxation Basics
          </h1>
          <p className="text-lg text-slate-400">
            How your mutual fund returns are taxed in India.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-xl space-y-12">
          
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
            <AlertCircle className="h-6 w-6 mt-1 shrink-0" />
            <p className="text-sm leading-relaxed">
              <strong>Disclaimer:</strong> Tax laws are subject to change. The information provided below reflects the general taxation rules as per recent union budgets. Always consult a certified tax professional for advice specific to your situation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6" /> Equity Mutual Funds
            </h2>
            <p className="text-slate-300 mb-4 text-sm">
              Funds investing 65% or more in domestic equities.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                <h3 className="font-bold text-white mb-2">Short-Term Capital Gains (STCG)</h3>
                <p className="text-sm text-slate-400 mb-2">Holding period &lt; 1 Year</p>
                <div className="text-xl font-extrabold text-white">20%</div>
                <p className="text-xs text-slate-500 mt-1">+ surcharge & cess</p>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                <h3 className="font-bold text-white mb-2">Long-Term Capital Gains (LTCG)</h3>
                <p className="text-sm text-slate-400 mb-2">Holding period &gt; 1 Year</p>
                <div className="text-xl font-extrabold text-white">12.5%</div>
                <p className="text-xs text-slate-500 mt-1">On gains exceeding ₹1.25 Lakh per year.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold text-indigo-400 mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6" /> Debt Mutual Funds
            </h2>
            <p className="text-slate-300 mb-4 text-sm">
              Funds investing predominantly in fixed-income securities.
            </p>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold text-white mb-2">Capital Gains Taxation (Post Apr 1, 2023)</h3>
              <p className="text-slate-300 mb-2">
                For debt funds acquired on or after April 1, 2023, the indexation benefit has been removed. 
              </p>
              <p className="text-lg font-bold text-white mt-4 bg-indigo-500/20 p-3 rounded-lg border border-indigo-500/30">
                Taxed at your applicable income tax slab rate.
              </p>
              <p className="text-sm text-slate-400 mt-2">Regardless of the holding period.</p>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6" /> Tax Saving Funds (ELSS)
            </h2>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Equity Linked Savings Schemes (ELSS) offer tax deduction benefits under Section 80C of the Income Tax Act up to ₹1.5 Lakhs per financial year.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>They have a mandatory lock-in period of 3 years.</li>
              <li>Taxed similarly to Equity Funds on maturity (12.5% LTCG on gains above ₹1.25L).</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
