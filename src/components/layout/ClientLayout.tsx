import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PrefetchLink } from "../common/PrefetchLink";
import { scheduleIdlePrefetch } from "../../lib/prefetch";
import { LayoutDashboard, LogOut, PieChart, Wallet, LineChart, LogIn, TrendingUp, Search, Bell, User, Menu, X, FileText, Download } from "lucide-react";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import FloatingChat from "../chat/FloatingChat";
import LiveMarketTicker from "../LiveMarketTicker";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;
  const isFormPage = ['/login', '/kyc', '/profile-setup', '/verify-phone'].includes(location.pathname);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  useEffect(() => {
    scheduleIdlePrefetch(false);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setShowMobileMenu(false);
    navigate("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(globalSearchQuery.trim())}`);
      setGlobalSearchQuery("");
    }
  };

  return (
    <div className={`${isFormPage ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'} bg-[#020617] text-slate-200 flex flex-col relative overflow-hidden`} onClick={() => { setShowNotifications(false); setShowProfile(false); }}>
      <div className='absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none'></div>
      <div className='absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none'></div>

      <LiveMarketTicker />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/[0.03] backdrop-blur-2xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <PrefetchLink to="/" className="flex items-center gap-2">
              <div className="bg-emerald-500 rounded-xl p-1 shadow-lg shadow-emerald-500/20">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">FinTrack<span className="text-emerald-400">Pro</span></span>
            </PrefetchLink>
            
            <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
              <PrefetchLink to="/" className="text-slate-400 hover:text-white transition-colors">Home</PrefetchLink>
              <PrefetchLink to="/explore" className="text-slate-400 hover:text-white transition-colors">Explore Funds</PrefetchLink>
              <PrefetchLink to="/calculators" className="text-slate-400 hover:text-white transition-colors">Calculators</PrefetchLink>
              <PrefetchLink to="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</PrefetchLink>
              <PrefetchLink to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</PrefetchLink>
              {user && <PrefetchLink to="/goals" className="text-slate-400 hover:text-white transition-colors">Goal Planner</PrefetchLink>}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search mutual funds..."
                className="h-9 w-64 rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </form>
            
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <div className="relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowProfile(false); }}
                    className="text-slate-400 hover:text-white relative p-1 mt-1"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full"></span>
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-4 z-50">
                      <h3 className="font-bold text-white mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <p className="text-xs font-bold text-emerald-400 mb-1">Advisor Alert</p>
                          <p className="text-sm text-slate-300">Your KYC is fully verified by your advisor. You are ready to invest.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div 
                    onClick={(e) => { e.stopPropagation(); setShowProfile(!showProfile); setShowNotifications(false); }}
                    className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold shadow-xl cursor-pointer hover:bg-emerald-500/20 transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </div>
                  {showProfile && (
                    <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-4 z-50" onClick={(e) => e.stopPropagation()}>
                      <div className="text-sm text-white font-bold mb-1 truncate">{user.phoneNumber || user.email || "My Account"}</div>
                      <div className="text-xs text-slate-400 mb-4 pb-4 border-b border-white/10">Connected to Advisor PR</div>
                      
                      <PrefetchLink to="/kyc" className="block text-sm text-slate-300 hover:text-emerald-400 font-bold mb-3 transition-colors">
                        KYC Status
                      </PrefetchLink>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full inline-flex h-9 items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-white hover:bg-red-500/20 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <PrefetchLink
                to="/login"
                className="hidden md:inline-flex h-9 items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-black hover:bg-slate-200 transition-colors shadow-sm"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </PrefetchLink>
            )}
            
            <PrefetchLink to="/partner/login" className="hidden md:inline-flex text-xs text-slate-500 hover:text-slate-300 ml-2">
              Partner Portal
            </PrefetchLink>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setShowMobileMenu(true); setShowNotifications(false); setShowProfile(false); }}
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-[60] bg-[#020617]/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${showMobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowMobileMenu(false)}>
        <div 
          className={`fixed inset-y-0 right-0 w-72 max-w-[85vw] bg-[#0f172a] shadow-2xl transition-transform duration-300 transform ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="font-bold text-white text-base">Navigation</span>
            <button 
              onClick={() => setShowMobileMenu(false)} 
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
            <form onSubmit={(e) => { handleSearchSubmit(e); setShowMobileMenu(false); }} className="relative mb-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search..."
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-base text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </form>
            <PrefetchLink to="/" onClick={() => setShowMobileMenu(false)} className="text-slate-300 hover:text-white font-medium p-2.5 rounded-xl hover:bg-white/5 transition-colors">Home</PrefetchLink>
            <PrefetchLink to="/explore" onClick={() => setShowMobileMenu(false)} className="text-slate-300 hover:text-white font-medium p-2.5 rounded-xl hover:bg-white/5 transition-colors">Explore Funds</PrefetchLink>
            <PrefetchLink to="/calculators" onClick={() => setShowMobileMenu(false)} className="text-slate-300 hover:text-white font-medium p-2.5 rounded-xl hover:bg-white/5 transition-colors">Calculators</PrefetchLink>
            <PrefetchLink to="/dashboard" onClick={() => setShowMobileMenu(false)} className="text-slate-300 hover:text-white font-medium p-2.5 rounded-xl hover:bg-white/5 transition-colors">Dashboard</PrefetchLink>
            <PrefetchLink to="/about" onClick={() => setShowMobileMenu(false)} className="text-slate-300 hover:text-white font-medium p-2.5 rounded-xl hover:bg-white/5 transition-colors">About Us</PrefetchLink>
            {user && <PrefetchLink to="/goals" onClick={() => setShowMobileMenu(false)} className="text-slate-300 hover:text-white font-medium p-2.5 rounded-xl hover:bg-white/5 transition-colors">Goal Planner</PrefetchLink>}
            
            <div className="border-t border-white/10 my-2"></div>
            
            {!user ? (
              <>
                <PrefetchLink to="/login" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-2 text-emerald-400 font-bold p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <LogIn className="h-4 w-4" /> Login
                </PrefetchLink>
                <PrefetchLink to="/partner/login" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-2 text-slate-400 font-medium p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <User className="h-4 w-4" /> Partner Portal
                </PrefetchLink>
              </>
            ) : (
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 font-bold p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left cursor-pointer">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col z-10 w-full ${isFormPage ? 'overflow-hidden justify-center' : 'overflow-x-hidden'}`}>
        {children}
      </main>

      {/* Footer */}
      {isFormPage ? (
        <footer className="border-t border-white/10 bg-slate-950/90 backdrop-blur-md py-2.5 px-4 z-10 shrink-0">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white tracking-tight">FinTrack<span className="text-emerald-400">Pro</span></span>
              <span className="text-slate-600">·</span>
              <span>AMFI Registered Mutual Fund Distributor</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-mono font-semibold">ARN: 348996</span>
              <span className="hidden md:inline text-slate-600">·</span>
              <span className="hidden md:inline text-slate-400">PARTHASARATHY Radhakrishnan</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>256-bit TLS Bank-Grade Encryption</span>
            </div>
          </div>
        </footer>
      ) : (
        <footer className="border-t border-white/10 bg-white/[0.02] backdrop-blur-sm py-12 z-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-emerald-500 rounded-xl p-1 shadow-lg shadow-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">FinTrack<span className="text-emerald-400">Pro</span></span>
            </div>
            <p className="text-sm text-slate-400">
              Invest Smarter. Grow Consistently.
            </p>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><PrefetchLink to="/explore" className="hover:text-emerald-400 transition-colors">Mutual Funds</PrefetchLink></li>
              <li><PrefetchLink to="/explore" className="hover:text-emerald-400 transition-colors">Compare Funds</PrefetchLink></li>
              <li><PrefetchLink to="/calculators/sip" className="hover:text-emerald-400 transition-colors">Calculator's</PrefetchLink></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Learn</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><PrefetchLink to="/learn/what-is-mutual-fund" className="hover:text-emerald-400 transition-colors">What is a Mutual Fund?</PrefetchLink></li>
              <li><PrefetchLink to="/learn/sip-vs-lumpsum" className="hover:text-emerald-400 transition-colors">SIP vs Lumpsum</PrefetchLink></li>
              <li><PrefetchLink to="/learn/taxation" className="hover:text-emerald-400 transition-colors">Taxation Basics</PrefetchLink></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><PrefetchLink to="/about" className="hover:text-emerald-400 transition-colors">About Us</PrefetchLink></li>
              <li><PrefetchLink to="/contact" className="hover:text-emerald-400 transition-colors">Contact & Support</PrefetchLink></li>
              <li><PrefetchLink to="/partner/login" className="hover:text-emerald-400 transition-colors">Partner Login</PrefetchLink></li>
            </ul>
            <div className="mt-6 pt-6 border-t border-white/10 text-xs text-slate-500 space-y-1">
              <p className="text-slate-300 font-bold">PARTHASARATHY Radhakrishnan</p>
              <p>ARN: 348996</p>
              <p>Tel: <a href="tel:7045251730" className="hover:text-emerald-400">7045251730</a></p>
              <p>Email: <a href="mailto:sarathyrangarajan14@gmail.com" className="hover:text-emerald-400">sarathyrangarajan14@gmail.com</a></p>
            </div>
          </div>
        </div>
      </footer>
      )}

      <FloatingChat />
    </div>
  );
}
