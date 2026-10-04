import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // DEMO ONLY: Allow admin/admin
    if (email === "admin" && password === "admin") {
      navigate("/admin/dashboard");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/operation-not-allowed") { 
        setError("Email/Password auth is not enabled in Firebase. Please enable it in the Firebase Console."); 
      } else { 
        setError("Invalid credentials. Please verify your administrative credentials and try again."); 
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden relative">
      {/* Top Header */}
      <header className="w-full border-b border-red-500/20 bg-slate-900/80 backdrop-blur-md py-2.5 px-4 sm:px-6 shrink-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 rounded-lg p-1">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">FinTrackPro <span className="text-red-400">Master Console</span></span>
          </div>
          <span className="text-[11px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">Super Admin Access Only</span>
        </div>
      </header>

      {/* Main Horizontal Form Card */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 overflow-hidden z-10">
        <div className="max-w-3xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
          {/* Left Column (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-red-600/10 via-slate-900 to-slate-950 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-red-600 rounded-xl p-2.5 shadow-lg shadow-red-600/20">
                  <ShieldAlert className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight leading-none">Security Terminal</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">Elevated Authorization Desk</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Full-system control console for AMFI sync monitoring, KYC queue verifications, and regulatory audit trail inspection.
              </p>

              <div className="text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span>IP Filter &amp; Session Audit Enabled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span>Restricted Superuser Role Required</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500">
              Demo Access: admin / admin
            </div>
          </div>

          {/* Right Column (7 cols) - Horizontal Form */}
          <div className="md:col-span-7 p-5 flex flex-col justify-center space-y-3.5">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Authenticate Super Administrator</h3>
              <p className="text-xs text-slate-400">Enter your root administrator credentials.</p>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-2 rounded-xl text-xs text-center">
                {error}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Horizontal 2-col inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Admin ID
                  </label>
                  <input
                    type="text"
                    required
                    className="block w-full px-3 py-2 border border-slate-700 rounded-xl text-xs bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    placeholder="admin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Security Key
                  </label>
                  <input
                    type="password"
                    required
                    className="block w-full px-3 py-2 border border-slate-700 rounded-xl text-xs bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-red-600/20"
                >
                  {loading ? "Authenticating..." : "Authorize Super Admin Access"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-slate-800 bg-slate-900/80 py-2 px-4 shrink-0 text-center text-[10px] text-slate-500 z-10">
        <span>Confidential Security Gateway · FinTrackPro Infrastructure Control Plane</span>
      </footer>
    </div>
  );
}
