import { ShieldCheck, Target, TrendingUp, CheckCircle2, ArrowRight, Zap, PieChart, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-28 relative z-10">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_#34d399]"></span>
            SEBI & AMFI Registered Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6 max-w-4xl mx-auto">
            Intelligent Wealth Building, <span className="text-emerald-400">Guided by Expert Advice.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-10">
            FinTrackPro gives you a unified, powerful platform to track, invest, and manage your family’s mutual fund portfolio—backed by certified financial experts dedicated to your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-8 font-bold text-black hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Get Started / Sign In
            </Link>
            <Link to="/contact" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 font-bold text-white hover:bg-white/10 transition-colors">
              Book a Free Portfolio Review
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="w-full py-16 relative z-10 border-t border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Who We Are</h2>
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>
                At <strong className="text-white">FinTrackPro</strong>, we believe wealth creation should be simple, transparent, and goal-focused. We combine modern financial technology with human advisory expertise to deliver a disciplined, stress-free investing experience.
              </p>
              <p>
                Navigating thousands of mutual fund schemes, market cycles, and changing tax laws can be overwhelming. FinTrackPro simplifies your financial journey by providing a single dashboard for your entire family's investments, continuous portfolio tracking, and tailored investment strategies built around your life milestones—from buying your first home to securing a comfortable retirement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Invest Grid */}
      <section className="w-full py-20 relative z-10 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Invest Through FinTrackPro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Goal-Based Investing",
                desc: "Plans customized for retirement, child education, or wealth growth.",
                adv: "Every rupee invested has a clear purpose and defined timeline.",
                icon: Target
              },
              {
                title: "All-in-One Family Portfolio",
                desc: "Track your entire family's assets under a single login.",
                adv: "360° visibility over total household net worth and asset allocation.",
                icon: PieChart
              },
              {
                title: "Zero Paperwork Execution",
                desc: "Paperless e-KYC, instant mandate approval, and UPI payments.",
                adv: "Start SIPs or lumpsum investments in under 3 minutes.",
                icon: Zap
              },
              {
                title: "Data-Driven Fund Selection",
                desc: "Curated scheme recommendations based on risk and consistency.",
                adv: "No emotional investing or chasing short-term market noise.",
                icon: TrendingUp
              },
              {
                title: "Tax-Optimized Reports",
                desc: "One-click Capital Gains (LTCG / STCG) and tax-saving (ELSS) statements.",
                adv: "Quick, headache-free ITR filing and tax planning.",
                icon: FileText
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-[24px] p-8 hover:bg-white/[0.05] transition-colors">
                <item.icon className="h-8 w-8 text-emerald-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{item.desc}</p>
                <div className="pt-4 border-t border-white/5">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">Your Advantage</span>
                  <p className="text-sm text-slate-300">{item.adv}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything You Need */}
      <section className="w-full py-20 relative z-10 border-t border-white/5 bg-emerald-950/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Everything You Need in One Place</h2>
            <div className="space-y-6">
              {[
                { title: "Instant Multi-Scheme Investing", desc: "Invest across equity, debt, hybrid, and index funds from top AMCs with one-tap payment options (UPI, Net Banking, and Auto-Debit Mandates)." },
                { title: "Automated Portfolio Tracking", desc: "Monitor live valuation, XIRR returns, and asset distribution updated daily." },
                { title: "External Portfolio Import", desc: "Easily import your existing investments (via CAS) to analyze and manage your entire portfolio from one clean dashboard." },
                { title: "Transparent & Secure", desc: "Bank-grade 256-bit encryption ensuring complete confidentiality of your financial data and personal details." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
                  <div className="mt-1">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & Guarantee */}
      <section className="w-full py-20 relative z-10 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Steps */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent hidden">
                {/* Hidden vertical line logic, skipping for a simpler layout below */}
              </div>
              <div className="space-y-8">
                {[
                  { num: "1", title: "Complete Quick KYC", desc: "Set up your investment account 100% online with quick paperless verification." },
                  { num: "2", title: "Map Your Goals", desc: "Define your target milestones, time horizons, and risk comfort." },
                  { num: "3", title: "Invest with Confidence", desc: "Approve tailored fund recommendations via instant UPI or auto-SIP." },
                  { num: "4", title: "Track & Grow", desc: "Review progress on your live dashboard while your advisor helps keep you on course." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-lg text-emerald-400 relative z-10">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-slate-400 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Trust & Security Guarantee</h2>
              <div className="bg-slate-900/50 border border-emerald-500/20 rounded-[32px] p-8 space-y-8">
                <div className="flex gap-4">
                  <ShieldCheck className="h-10 w-10 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">SEBI & AMFI Registered</h3>
                    <p className="text-slate-400 text-sm">All transactions are routed securely through authorized exchange infrastructure (BSE/NSE).</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <ShieldCheck className="h-10 w-10 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Direct Bank Routing</h3>
                    <p className="text-slate-400 text-sm">Your investment money moves directly from your verified bank account to the respective Mutual Fund AMC—never through intermediary wallets.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-20 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-emerald-950/20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Start Your Wealth Journey with FinTrackPro Today.</h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Join smart investors who track, plan, and grow their wealth with clarity and confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 font-bold text-black hover:bg-slate-200 transition-colors shadow-lg">
              Create Your Free Account
            </Link>
            <Link to="/contact" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-8 font-bold text-white hover:bg-white/10 transition-colors">
              Talk to a Wealth Advisor <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}