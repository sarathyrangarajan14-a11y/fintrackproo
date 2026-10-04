import { Phone, Mail, MapPin, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="flex flex-col items-center py-20 px-4 md:px-6 relative z-10 w-full">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Contact & Support
          </h1>
          <p className="text-lg text-slate-400">
            We're here to help you navigate your wealth building journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 md:p-10 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-8">Your Wealth Advisor</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-emerald-400">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Name</p>
                  <p className="text-lg font-bold text-white">PARTHASARATHY radhakrishnan</p>
                  <p className="text-sm text-emerald-400 mt-1">ARN: 348996</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-emerald-400">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Phone</p>
                  <a href="tel:7045251730" className="text-lg font-bold text-white hover:text-emerald-400 transition-colors">
                    7045251730
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-emerald-400">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Email</p>
                  <a href="mailto:sarathyrangarajan14@gmail.com" className="text-lg font-bold text-white hover:text-emerald-400 transition-colors break-all">
                    sarathyrangarajan14@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white/[0.01] border border-white/5 rounded-[32px] p-8 md:p-10 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-white mb-6">Need immediate assistance?</h3>
            <p className="text-slate-400 mb-8">
              Whether you need help tracking an investment, have questions about your portfolio, or want to start a new SIP, feel free to reach out directly.
            </p>
            
            <div className="space-y-4">
              <Link to="/login" className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors group">
                <span className="font-bold text-white">Sign In to Dashboard</span>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </Link>
              
              <Link to="/explore" className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors group">
                <span className="font-bold text-white">Explore Funds</span>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}