import { Link } from "react-router-dom";
import { TrendingUp, ShieldCheck, Zap, PieChart, ArrowRight, LayoutDashboard } from "lucide-react";
import FullHeightScrollWrapper from "../../components/FullHeightScrollWrapper";

export default function Home() {
  return (
    <FullHeightScrollWrapper>
      <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 font-medium mb-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_#34d399]"></span>
              India's Smartest Investment Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Build Your Wealth With <span className="text-emerald-400">Smarter</span> Mutual Fund Investing
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto md:mx-0">
              Discover, compare and invest in mutual funds based on your goals, investment horizon and risk profile. Zero hidden fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link to="/login" className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 font-bold text-black hover:bg-slate-200 transition-colors">
                Start Investing Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/explore" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 font-bold text-white hover:bg-white/10 transition-colors">
                Explore Funds
              </Link>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-4 text-sm text-slate-400 font-medium">
              <div className="flex items-center"><ShieldCheck className="mr-1 h-4 w-4 text-emerald-400" /> Bank-grade Security</div>
              <div className="flex items-center"><Zap className="mr-1 h-4 w-4 text-emerald-400" /> Instant Account</div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-lg">
            {/* Mock Dashboard Card */}
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 relative">
              <div className="absolute -top-4 -right-4 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
                +14.2% XIRR
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Total Portfolio Value</p>
                  <h2 className="text-4xl font-bold text-white mb-3">₹4,25,000<span className="text-slate-500 text-2xl font-normal">.00</span></h2>
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <span className="flex items-center justify-center w-5 h-5 bg-emerald-500/20 rounded-full">↑</span> +₹54,200 All Time
                  </div>
                </div>
                
                <div className="space-y-4 pt-4">
                  {[
                    { name: 'HDFC Mid-Cap Opportunities', value: '₹1,20,000', return: '+18.5%' },
                    { name: 'Parag Parikh Flexi Cap', value: '₹2,05,000', return: '+16.2%' },
                    { name: 'SBI Small Cap Fund', value: '₹1,00,000', return: '+12.1%' }
                  ].map((fund, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                      <div>
                        <div className="font-bold text-white text-sm">{fund.name}</div>
                        <div className="text-xs text-slate-500 mt-1">Direct Growth</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white text-sm">{fund.value}</div>
                        <div className="text-xs text-emerald-400 font-bold mt-1">{fund.return}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full rounded-xl bg-white/10 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors mt-2">
                  View Full Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="w-full py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: TrendingUp, label: 'Start SIP', link: '/explore' },
              { icon: PieChart, label: 'Lumpsum', link: '/explore' },
              { icon: Zap, label: 'Compare Funds', link: '/compare' },
              { icon: LayoutDashboard, label: "Calculators", link: '/calculators/sip' },
            ].map((action, i) => (
              <Link key={i} to={action.link} className="flex flex-col items-center justify-center p-6 rounded-[24px] bg-white/[0.03] backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all text-center group">
                <div className="bg-emerald-500/20 p-3 rounded-2xl mb-4 group-hover:bg-emerald-500/30 transition-colors">
                  <action.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <span className="font-bold text-white text-sm">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="w-full py-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Investing made simple</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 rounded-[32px]">
              <div className="bg-[#1e293b] border border-white/10 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mb-6 mx-auto text-indigo-400">1</div>
              <h3 className="text-xl font-bold text-white mb-3">Create Account</h3>
              <p className="text-slate-400 text-sm">Sign up securely with just your mobile number. No paperwork needed.</p>
            </div>
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 rounded-[32px]">
              <div className="bg-[#1e293b] border border-white/10 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mb-6 mx-auto text-emerald-400">2</div>
              <h3 className="text-xl font-bold text-white mb-3">Choose Funds</h3>
              <p className="text-slate-400 text-sm">Explore expertly categorized mutual funds or search for your favorites.</p>
            </div>
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 rounded-[32px]">
              <div className="bg-[#1e293b] border border-white/10 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mb-6 mx-auto text-amber-400">3</div>
              <h3 className="text-xl font-bold text-white mb-3">Invest & Grow</h3>
              <p className="text-slate-400 text-sm">Start a SIP or invest lumpsum. Track your portfolio growth in real-time.</p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </FullHeightScrollWrapper>
  );
}
