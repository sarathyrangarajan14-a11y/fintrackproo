import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, LogOut, Database, ShieldAlert, Settings, TrendingUp, 
  Menu, X, FileText, Download, ExternalLink, Code, Image as ImageIcon 
} from "lucide-react";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <ShieldAlert className="h-6 w-6 text-red-500 mr-2" />
          <span className="text-lg font-bold text-white tracking-tight">System Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-slate-800 text-white">
            <LayoutDashboard className="mr-3 h-5 w-5 text-red-500" />
            Dashboard
          </Link>

          <a 
            href="/admin/dashboard#kyc-verification-area" 
            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-300"
          >
            <ShieldAlert className="mr-3 h-5 w-5 text-amber-400" />
            <div className="flex-1">
              <div>KYC Verification Desk</div>
              <div className="text-[10px] text-amber-400 font-normal">Review &amp; Approve Client Docs</div>
            </div>
          </a>

          <a 
            href="/admin/dashboard#legal-documents-area" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-300"
          >
            <Settings className="mr-3 h-5 w-5 text-indigo-400" />
            <div className="flex-1">
              <div>Settings &amp; Legal</div>
              <div className="text-[10px] text-indigo-400 font-normal">Create Legal Docs &amp; Artifacts</div>
            </div>
          </a>

          <a 
            href="/admin/dashboard#source-code-area" 
            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-300"
          >
            <Code className="mr-3 h-5 w-5 text-emerald-400" />
            <div className="flex-1">
              <div>Real Source Files</div>
              <div className="text-[10px] text-emerald-400 font-normal">Frontend • Backend • Schema</div>
            </div>
          </a>

          <a 
            href="/admin/dashboard#screenshots-area" 
            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-300"
          >
            <ImageIcon className="mr-3 h-5 w-5 text-sky-400" />
            <div className="flex-1">
              <div>App Screenshots</div>
              <div className="text-[10px] text-sky-400 font-normal">Real Running UI Walkthrough</div>
            </div>
          </a>

          <a 
            href="/api/academic-report/download" 
            className="flex items-center px-4 py-3 text-sm font-semibold rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all my-2"
            title="Download Academic Project Report PDF with all 9 Chapters & UML Diagrams"
          >
            <FileText className="mr-3 h-5 w-5 text-emerald-400" />
            <div className="flex-1">
              <div>Academic Report</div>
              <div className="text-[10px] text-emerald-300 font-normal">60 Pages Black Book • Mumbai Univ</div>
            </div>
            <Download className="h-4 w-4 shrink-0 text-emerald-400" />
          </a>

          <a 
            href="/admin/dashboard#sync-status" 
            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-400"
          >
            <Database className="mr-3 h-5 w-5 text-blue-400" />
            MFAPI Sync Status
          </a>
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-400"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Open Admin Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">Admin Control Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/academic-report/download"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all shadow-sm"
              title="Download Full Project Report PDF"
            >
              <Download className="h-3.5 w-3.5 text-emerald-600" />
              <span>Download Academic Report (PDF)</span>
            </a>
            <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded border border-red-200">
              SUPER_ADMIN
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          showMobileSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowMobileSidebar(false)}
      >
        <div 
          className={`fixed inset-y-0 left-0 w-64 bg-slate-950 text-slate-300 shadow-2xl transition-transform duration-300 transform flex flex-col ${
            showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center">
              <ShieldAlert className="h-6 w-6 text-red-500 mr-2" />
              <span className="text-lg font-bold text-white tracking-tight">System Admin</span>
            </div>
            <button 
              onClick={() => setShowMobileSidebar(false)} 
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex-1 py-6 px-4 space-y-1">
            <Link 
              to="/admin/dashboard" 
              onClick={() => setShowMobileSidebar(false)}
              className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-slate-800 text-white"
            >
              <LayoutDashboard className="mr-3 h-5 w-5 text-red-500" />
              Dashboard
            </Link>

            <a 
              href="/admin/dashboard#kyc-verification-area" 
              onClick={() => setShowMobileSidebar(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-300"
            >
              <ShieldAlert className="mr-3 h-5 w-5 text-amber-400" />
              <div className="flex-1">
                <div>KYC Verification Desk</div>
                <div className="text-[10px] text-amber-400 font-normal">Review &amp; Approve Client Docs</div>
              </div>
            </a>

            <a 
              href="/admin/dashboard#legal-documents-area" 
              onClick={() => setShowMobileSidebar(false)}
              className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-300"
            >
              <Settings className="mr-3 h-5 w-5 text-indigo-400" />
              <div className="flex-1">
                <div>Settings &amp; Legal</div>
                <div className="text-[10px] text-indigo-400 font-normal">Create Legal Docs &amp; Artifacts</div>
              </div>
            </a>

            <a 
              href="/admin/dashboard#source-code-area" 
              onClick={() => setShowMobileSidebar(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-300"
            >
              <Code className="mr-3 h-5 w-5 text-emerald-400" />
              <div className="flex-1">
                <div>Real Source Files</div>
                <div className="text-[10px] text-emerald-400 font-normal">Frontend • Backend • Schema</div>
              </div>
            </a>

            <a 
              href="/admin/dashboard#screenshots-area" 
              onClick={() => setShowMobileSidebar(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-300"
            >
              <ImageIcon className="mr-3 h-5 w-5 text-sky-400" />
              <div className="flex-1">
                <div>App Screenshots</div>
                <div className="text-[10px] text-sky-400 font-normal">Real Running UI Walkthrough</div>
              </div>
            </a>

            <a 
              href="/api/academic-report/download" 
              onClick={() => setShowMobileSidebar(false)}
              className="flex items-center px-4 py-3 text-sm font-semibold rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all my-2"
            >
              <FileText className="mr-3 h-5 w-5 text-emerald-400" />
              <div className="flex-1">
                <div>Academic Report</div>
                <div className="text-[10px] text-emerald-300 font-normal">60 Pages Black Book • Mumbai Univ</div>
              </div>
              <Download className="h-4 w-4 shrink-0 text-emerald-400" />
            </a>

            <a 
              href="/admin/dashboard#sync-status" 
              onClick={() => setShowMobileSidebar(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-400"
            >
              <Database className="mr-3 h-5 w-5 text-blue-400" />
              MFAPI Sync Status
            </a>
          </nav>
          
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={() => { setShowMobileSidebar(false); handleLogout(); }}
              className="flex w-full items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-400"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
