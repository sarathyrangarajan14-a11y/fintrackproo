import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PrefetchLink } from "../common/PrefetchLink";
import { scheduleIdlePrefetch } from "../../lib/prefetch";
import { 
  LayoutDashboard, LogOut, Users, PieChart, Settings, TrendingUp, 
  Package, ArrowRightLeft, Briefcase, FileText, Search, BarChart2, 
  Lightbulb, Bell, MessageSquare, CheckSquare, Megaphone, Mail, Menu, X, Download 
} from "lucide-react";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import FloatingChat from "../chat/FloatingChat";
import LiveMarketTicker from "../LiveMarketTicker";

export default function PartnerLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    scheduleIdlePrefetch(true);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("partnerUser");
    localStorage.removeItem("partnerToken");
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out notice:", e);
    }
    window.dispatchEvent(new Event("auth-state-changed"));
    navigate("/partner/login");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearchQuery.trim()) {
      navigate(`/partner/products?q=${encodeURIComponent(globalSearchQuery.trim())}`);
      setGlobalSearchQuery("");
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/partner/dashboard", icon: LayoutDashboard },
    { label: "Clients", path: "/partner/clients", icon: Users },
    { label: "Products", path: "/partner/products", icon: Package },
    { label: "Transactions", path: "/partner/transactions", icon: ArrowRightLeft },
    { label: "Portfolio", path: "/partner/portfolio", icon: Briefcase },
    { label: "Reports", path: "/partner/reports", icon: FileText },
    { label: "Email Status", path: "/partner/email-logs", icon: Mail },
    { label: "Research", path: "/partner/research", icon: Search },
    { label: "Business Analytics", path: "/partner/analytics", icon: BarChart2 },
    { label: "Tasks & CRM", path: "/partner/tasks", icon: CheckSquare },
    { label: "Settings", path: "/partner/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex relative overflow-hidden">
      <div className='absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none'></div>
      <div className='absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none'></div>

      {/* Sidebar */}
      <aside className="w-72 bg-white/[0.03] backdrop-blur-2xl border-r border-white/10 flex flex-col hidden lg:flex z-20">
        <PrefetchLink to="/partner/dashboard" className="h-20 flex shrink-0 items-center px-8 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
          <div className="bg-emerald-500 rounded-xl p-1 shadow-lg shadow-emerald-500/20 mr-3">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">FinTrack<span className="text-emerald-400">Pro</span></span>
        </PrefetchLink>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {navItems.map((item, i) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <PrefetchLink 
                key={i} 
                to={item.path} 
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-colors ${
                  isActive 
                    ? 'bg-white/10 text-emerald-400 border border-white/10' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-transparent'}`}></div>
                <Icon className="h-5 w-5" />
                {item.label}
              </PrefetchLink>
            )
          })}
        </div>
        
        <div className="p-4 border-t border-white/10 shrink-0 space-y-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <FileText className="w-4 h-4 shrink-0" />
              <span>Academic Report (PDF)</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
              60-page Mumbai University Black Book dissertation with all 14 UML diagrams, mathematical proofs & benchmarks.
            </p>
            <div className="flex items-center gap-1.5">
              <a
                href="/api/academic-report/download"
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] transition-colors shadow-sm"
                title="Download Full Project Report PDF"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </a>
              <a
                href="/api/academic-report/view"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-medium text-[10px] transition-colors"
                title="Preview in Browser"
              >
                Preview
              </a>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2.5 text-sm font-bold rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden z-10">
        <LiveMarketTicker />
        <header className="h-20 shrink-0 bg-transparent border-b border-white/10 flex items-center justify-between px-4 sm:px-8 relative">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Hamburger Toggle (< lg) */}
            <button
              onClick={() => { setShowMobileSidebar(true); setShowNotifications(false); setShowProfile(false); }}
              className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Open partner navigation"
            >
              <Menu className="h-6 w-6" />
            </button>

            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search schemes, AMCs (Ctrl+K)..."
                className="h-9 w-80 rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-base md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </form>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/api/academic-report/download"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all shadow-sm"
              title="Download Full Project Report PDF with all 9 Chapters & UML Diagrams"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Academic Report (PDF)</span>
            </a>

            <div className="flex gap-4 text-slate-400">
              <div className="relative">
                <button 
                  onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                  className="hover:text-white relative p-1"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-4 z-50">
                    <h3 className="font-bold text-white mb-3">Notifications</h3>
                    <div className="space-y-3">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <p className="text-xs font-bold text-emerald-400 mb-1">System Update</p>
                        <p className="text-sm text-slate-300">New Client Portal features are now live and synced automatically.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="relative">
              <div 
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="h-10 w-10 rounded-full bg-[#1e293b] border border-white/10 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-xl shadow-emerald-500/10 cursor-pointer hover:border-emerald-500 transition-colors"
              >
                PR
              </div>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-5 z-50">
                  <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                      PR
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">PARTHASARATHY Radhakrishnan</h4>
                      <p className="text-xs text-slate-400">ARN: 348996</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="text-slate-300">
                      <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Email</span>
                      sarathyrangarajan14@gmail.com
                    </div>
                    <div className="text-slate-300">
                      <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Phone</span>
                      +91 7045251730
                    </div>
                  </div>
                  <a
                    href="/api/academic-report/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full mt-3 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Academic Report (PDF)</span>
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="w-full mt-3 bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 font-bold py-2 rounded-xl transition-colors text-sm border border-transparent hover:border-red-500/30"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8" onClick={() => { setShowNotifications(false); setShowProfile(false); }}>
          {children}
        </div>
      </main>

      {/* Mobile Drawer Navigation (< lg) */}
      <div 
        className={`fixed inset-0 z-[60] bg-[#020617]/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          showMobileSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowMobileSidebar(false)}
      >
        <div 
          className={`fixed inset-y-0 left-0 w-72 bg-[#090d16] border-r border-white/10 shadow-2xl transition-transform duration-300 transform flex flex-col ${
            showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-20 flex shrink-0 items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center">
              <div className="bg-emerald-500 rounded-xl p-1 shadow-lg shadow-emerald-500/20 mr-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">FinTrack<span className="text-emerald-400">Pro</span></span>
            </div>
            <button 
              onClick={() => setShowMobileSidebar(false)} 
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
            {navItems.map((item, i) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <PrefetchLink 
                  key={i} 
                  to={item.path} 
                  onClick={() => setShowMobileSidebar(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-colors ${
                    isActive 
                      ? 'bg-white/10 text-emerald-400 border border-white/10' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-transparent'}`}></div>
                  <Icon className="h-5 w-5" />
                  {item.label}
                </PrefetchLink>
              );
            })}
          </div>

          <div className="p-4 border-t border-white/10 shrink-0 space-y-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Academic Report (PDF)</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
                60-Page Mumbai University Black Book Dissertation with all 14 UML diagrams & algorithms.
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="/api/academic-report/download"
                  onClick={() => setShowMobileSidebar(false)}
                  className="flex-1 text-center py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] transition-colors shadow-sm"
                >
                  Download PDF
                </a>
                <a
                  href="/api/academic-report/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowMobileSidebar(false)}
                  className="text-center py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-medium text-[10px] transition-colors"
                >
                  Preview
                </a>
              </div>
            </div>

            <button
              onClick={() => { setShowMobileSidebar(false); handleLogout(); }}
              className="flex w-full items-center px-4 py-2.5 text-sm font-bold rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <FloatingChat isPartner={true} />
    </div>
  );
}
