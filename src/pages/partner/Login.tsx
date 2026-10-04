import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { TrendingUp, ShieldCheck, Lock, UserCheck, KeyRound } from "lucide-react";

export default function PartnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const cleanInput = email.trim();
    const cleanPassword = password.trim();

    if (!cleanInput || !cleanPassword) {
      setError("Please provide both username and password.");
      setLoading(false);
      return;
    }

    try {
      // 1. First authenticate with the Partner Authentication API
      const res = await fetch("/api/auth/partner-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanInput, password: cleanPassword })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Save partner session securely in localStorage
        localStorage.setItem("partnerUser", JSON.stringify(data.user));
        localStorage.setItem("partnerToken", data.token || "partner-admin-token");
        
        // Notify App auth listeners immediately
        window.dispatchEvent(new Event("auth-state-changed"));

        navigate("/partner/dashboard");
        return;
      }

      // 2. Fallback to Firebase Email/Password if the user entered standard email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(cleanInput)) {
        try {
          const userCred = await signInWithEmailAndPassword(auth, cleanInput, cleanPassword);
          const token = await userCred.user.getIdToken();
          localStorage.setItem("partnerUser", JSON.stringify({
            uid: userCred.user.uid,
            email: userCred.user.email,
            displayName: userCred.user.displayName || "Partner Advisor",
            role: "PARTNER"
          }));
          localStorage.setItem("partnerToken", token);
          window.dispatchEvent(new Event("auth-state-changed"));
          navigate("/partner/dashboard");
          return;
        } catch (fbErr: any) {
          console.warn("Firebase partner auth failed:", fbErr.message);
        }
      }

      setError(data.error || "Invalid username or password. Please verify your credentials.");
    } catch (err: any) {
      console.error("Partner sign-in exception:", err);
      // If server unreachable, check offline validation for fixed credentials
      if ((cleanInput.toLowerCase() === "admin" || cleanInput.toLowerCase() === "admin@velocitywealth.in" || cleanInput.toLowerCase() === "admin@wealthflow.in") && (cleanPassword === "admin123" || cleanPassword === "admin")) {
        localStorage.setItem("partnerUser", JSON.stringify({
          uid: "partner-admin-uid",
          email: "admin@velocitywealth.in",
          displayName: "PARTHASARATHY Radhakrishnan",
          arnNumber: "348996",
          role: "PARTNER"
        }));
        localStorage.setItem("partnerToken", "partner-admin-token");
        window.dispatchEvent(new Event("auth-state-changed"));
        navigate("/partner/dashboard");
        return;
      }
      setError("Unable to authenticate. Please check your network connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Brand Strip */}
      <header className="w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl py-2.5 px-4 sm:px-6 shrink-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500 rounded-xl p-1 shadow-lg shadow-emerald-500/20">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">FinTrack<span className="text-emerald-400">Pro</span></span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Distributor Terminal</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-mono font-bold">ARN: 348996</span>
          </div>
        </div>
      </header>

      {/* Main Horizontal Form Card */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 overflow-hidden z-10">
        <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden my-auto">
          {/* Left Column: Context (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-emerald-500/10 via-slate-950/70 to-indigo-500/10 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-2.5 shadow-xl shadow-emerald-500/10">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white tracking-tight leading-none">Partner Portal</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">IFA Distributor CRM &amp; Execution</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Institutional distribution terminal for client portfolio management, SIP proposals, automated compliance, and commission reconciliations.
              </p>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Licensed ARN: 348996 Portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>256-bit TLS Protected Session</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Terminal Status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active CRM
              </span>
            </div>
          </div>

          {/* Right Column: Horizontal Login Form (7 cols) */}
          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-center space-y-3.5">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Partner Sign In</h3>
              <p className="text-xs text-slate-400">Enter your partner credentials below.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-2.5 rounded-xl text-xs text-center font-medium">
                {error}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Horizontal 2-col inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Username / Email
                  </label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Username or email"
                      className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 rounded-xl font-bold transition-all text-xs disabled:opacity-50 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? "Authenticating..." : "Sign in to Partner Portal"}
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Demo access: admin / admin123</span>
              <span className="text-emerald-400">PARTHASARATHY Radhakrishnan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Footer Strip */}
      <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-2 px-4 shrink-0 text-center text-[10px] text-slate-500 z-10">
        <span>FinTrackPro Partner Gateway · AMFI ARN: 348996 · Confidential Business System</span>
      </footer>
    </div>
  );
}
