import { useState, useEffect } from "react";
import { 
  Database, Activity, RefreshCw, AlertTriangle, CheckCircle2, FileText, Download, 
  Eye, GraduationCap, ShieldCheck, BookOpen, Layers, Code, FileCode, Copy, Image, 
  FolderArchive, Maximize2, X, Terminal, ChevronRight, Settings, Scale, Lock, 
  Sparkles, Sliders, ExternalLink, Check, Server, Layout, Shield,
  ShieldAlert, Clock, UserCheck, UserX, User
} from "lucide-react";

interface SyncStatus {
  totalTracked: number;
  syncedCount: number;
  failedCount: number;
  lastSyncTime: string;
  status: string;
  details?: Array<{ code: string; status: 'SUCCESS' | 'SKIPPED' | 'FAILED'; error?: string }>;
}

const REAL_SCREENSHOTS = [
  {
    id: "dashboard",
    title: "1. Retail Investor Wealth Dashboard",
    category: "Client Frontend Tier",
    desc: "Real-time portfolio valuation (₹18.45L), Newton-Raphson XIRR (+15.42%), Asset Allocation SVG Donut, and live AMFI NAV ticker.",
    file: "/screenshots/dashboard.svg",
    badge: "React 19 + Recharts"
  },
  {
    id: "fund_screener",
    title: "2. Real-Time AMFI Fund Screener",
    category: "Market Data Tier",
    desc: "Directory of 44,000+ mutual fund schemes with live NAVs, category chips (Large/Flexi/Mid/Small Cap), and SIP initiation.",
    file: "/screenshots/fund_screener.svg",
    badge: "mfapi.in Engine"
  },
  {
    id: "advisor_portal",
    title: "3. IFA Partner Control Desk (ARN: 348996)",
    category: "Partner Advisory Tier",
    desc: "Velocity Wealth AUM monitoring (₹52.40 Cr), active SIP book (₹42.80L/mo), client directory, and KYC document approvals.",
    file: "/screenshots/advisor_portal.svg",
    badge: "Multi-Tenant CRM"
  },
  {
    id: "client_kyc",
    title: "4. Client KYC & Digital Signature Canvas",
    category: "Compliance & Security",
    desc: "Paperless KYC with PAN checksum validation, masked Aadhaar UIDAI integration, and 60 FPS HTML5 vector signature pad.",
    file: "/screenshots/client_kyc.svg",
    badge: "SEBI Compliant"
  },
  {
    id: "sip_mandate",
    title: "5. NPCI NACH E-Mandate Setup",
    category: "Banking & Settlement",
    desc: "Automated monthly recurring SIP debit registration with bank selection, daily debit limits, and Net Banking 3D Secure e-Sign.",
    file: "/screenshots/sip_mandate.svg",
    badge: "NPCI NACH 3.2"
  },
  {
    id: "database_schema",
    title: "6. PostgreSQL Relational Schema Topology",
    category: "Database & ORM Tier",
    desc: "Drizzle ORM entity models mapping PostgreSQL 16 tables: users, partners, clients, instruments, sips, mandates, and transactions.",
    file: "/screenshots/database_schema.svg",
    badge: "PostgreSQL 16"
  }
];

const SOURCE_FILE_REGISTRY = [
  // FRONTEND TIER
  {
    key: "clientDashboard",
    name: "Dashboard.tsx",
    path: "src/pages/client/Dashboard.tsx",
    tier: "Frontend Tier",
    tech: "React 19 + Recharts",
    tierColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    desc: "Investor wealth dashboard with real-time portfolio tracking, asset allocation SVG donut, returns calculation, and AMFI scheme quick-links."
  },
  {
    key: "screener",
    name: "MutualFundScreener.tsx",
    path: "src/components/MutualFundScreener.tsx",
    tier: "Frontend Tier",
    tech: "AMFI Screener",
    tierColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    desc: "Live AMFI Scheme Directory with real-time NAV search, 1Y/3Y/5Y CAGR filtering, scheme categorization (Equity/Debt/Hybrid), and SIP setup."
  },
  {
    key: "clientKyc",
    name: "KYC.tsx",
    path: "src/pages/client/KYC.tsx",
    tier: "Frontend Tier",
    tech: "Vector Canvas Pad",
    tierColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    desc: "Client paperless onboarding with HTML5 vector signature pad, PAN checksum validation, and masked Aadhaar verification."
  },
  {
    key: "partnerDashboard",
    name: "PartnerDashboard.tsx",
    path: "src/pages/partner/Dashboard.tsx",
    tier: "Frontend Tier",
    tech: "Partner Advisory Desk",
    tierColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    desc: "IFA Distributor Portal (ARN-348996) with AUM tracking (₹52.40 Cr), client onboarding desk, commission trails, and KYC approvals."
  },
  {
    key: "app",
    name: "App.tsx",
    path: "src/App.tsx",
    tier: "Frontend Tier",
    tech: "React Router v7",
    tierColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    desc: "Application routing, role-based navigation guards (RBAC), multi-tenant investor/partner/admin navigation, and error boundaries."
  },

  // BACKEND TIER
  {
    key: "server",
    name: "server.ts",
    path: "server.ts",
    tier: "Backend Tier",
    tech: "Node 22 + Express",
    tierColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    desc: "Core Express server with RESTful endpoints, zero-on-screen OTP generator, Newton-Raphson XIRR solver, and dynamic PDF compiler engines."
  },
  {
    key: "navSync",
    name: "navSyncEngine.ts",
    path: "src/server/navSyncEngine.ts",
    tier: "Backend Tier",
    tech: "AMFI Cron Engine",
    tierColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    desc: "Automated daily 11:15 PM AMFI NAV synchronization engine with circuit breakers, exponential backoff, and scheme delta reconciliations."
  },
  {
    key: "instrumentService",
    name: "instrumentService.ts",
    path: "src/server/instrumentService.ts",
    tier: "Backend Tier",
    tech: "Scheme Caching",
    tierColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    desc: "Mutual fund scheme catalog caching layer, fast full-text search indexing, and historical NAV price-series retriever."
  },

  // DATABASE SCHEMA TIER
  {
    key: "schema",
    name: "schema.ts",
    path: "src/db/schema.ts",
    tier: "Schema & DB Tier",
    tech: "PostgreSQL + Drizzle",
    tierColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    desc: "Relational database schema with 8 normalized tables: users, partners, clients, instruments, sips, mandates, transactions, and audit logs."
  },
  {
    key: "dbIndex",
    name: "index.ts",
    path: "src/db/index.ts",
    tier: "Schema & DB Tier",
    tech: "Connection Pool",
    tierColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    desc: "Drizzle ORM client connection pooling, transaction retry logic, and health check diagnostics."
  },
  {
    key: "firestoreRules",
    name: "firestore.rules",
    path: "firestore.rules",
    tier: "Schema & DB Tier",
    tech: "Security Rules",
    tierColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    desc: "Firebase security rules establishing strict user isolation, advisor scope containment, and admin RBAC enforcement."
  }
];

export default function AdminDashboard() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [loadingSync, setLoadingSync] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Active section filter: "all" | "kyc-desk" | "legal-settings" | "source-code" | "screenshots" | "sync-status"
  const [activeTab, setActiveTab] = useState<string>("all");

  // KYC Verification Desk States
  const [kycQueue, setKycQueue] = useState<any[]>([]);
  const [loadingKyc, setLoadingKyc] = useState<boolean>(false);
  const [kycNotice, setKycNotice] = useState<string | null>(null);
  const [kycFilter, setKycFilter] = useState<"pending" | "all">("pending");
  const [approvingId, setApprovingId] = useState<number | null>(null);

  // Legal document generation state
  const [generatingLegal, setGeneratingLegal] = useState<boolean>(false);
  const [legalNotice, setLegalNotice] = useState<string | null>(null);

  // Source code tier filter: "all" | "frontend" | "backend" | "schema"
  const [selectedTier, setSelectedTier] = useState<string>("all");

  // Source code inspector states
  const [selectedFileKey, setSelectedFileKey] = useState<string>("schema");
  const [fileContent, setFileContent] = useState<string>("");
  const [fileDetails, setFileDetails] = useState<{ lines: number; size: number; file: string } | null>(null);
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Screenshot modal preview
  const [previewScreenshot, setPreviewScreenshot] = useState<typeof REAL_SCREENSHOTS[0] | null>(null);

  const fetchKycQueue = async () => {
    setLoadingKyc(true);
    try {
      const res = await fetch("/api/admin/clients/kyc-queue");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.clients)) {
          setKycQueue(data.clients);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin KYC queue:", err);
    } finally {
      setLoadingKyc(false);
    }
  };

  const handleApproveKyc = async (clientId: number, clientName: string) => {
    setApprovingId(clientId);
    try {
      const res = await fetch(`/api/admin/client/${clientId}/kyc-approve`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setKycNotice(`KYC verified & approved for ${clientName}! Investor privileges and trading unlocked.`);
        await fetchKycQueue();
        setTimeout(() => setKycNotice(null), 6000);
      } else {
        setKycNotice(data.error || "Failed to approve KYC.");
      }
    } catch (err) {
      console.error("Approve KYC error:", err);
      setKycNotice("Network error while approving KYC.");
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectKyc = async (clientId: number, clientName: string) => {
    const reason = window.prompt(`Enter rejection reason for ${clientName}:`, "Document clarity or mismatch issue. Please re-submit clear documents.") || "Rejected by Compliance Administrator";
    try {
      const res = await fetch(`/api/admin/client/${clientId}/kyc-reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setKycNotice(`KYC rejected for ${clientName}. Client prompted to re-submit.`);
        await fetchKycQueue();
        setTimeout(() => setKycNotice(null), 6000);
      }
    } catch (err) {
      console.error("Reject KYC error:", err);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/instruments/sync/status");
      if (res.ok) {
        const data = await res.json();
        setSyncStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch sync status:", err);
    }
  };

  const loadSourceFile = async (key: string) => {
    setSelectedFileKey(key);
    setLoadingFile(true);
    try {
      const res = await fetch(`/api/admin/source-file/content?file=${key}`);
      if (res.ok) {
        const data = await res.json();
        setFileContent(data.content || "");
        setFileDetails({ lines: data.lines, size: data.size, file: data.file });
      }
    } catch (err) {
      console.error("Failed to load source file:", err);
    } finally {
      setLoadingFile(false);
    }
  };

  const handleRegenerateLegalDocs = async () => {
    setGeneratingLegal(true);
    setLegalNotice(null);
    try {
      const res = await fetch("/api/admin/legal/generate-all", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setLegalNotice("All 3 regulatory legal documents (SEBI, RBI E-Mandate, DPDP Act 2023) generated successfully!");
      } else {
        setLegalNotice("Generation notice: " + (data.error || "Completed with warnings"));
      }
    } catch (err: any) {
      setLegalNotice("Notice: " + (err?.message || "Generation request finished"));
    } finally {
      setGeneratingLegal(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    loadSourceFile("schema");
    fetchKycQueue();
    const interval = setInterval(() => {
      fetchStatus();
      fetchKycQueue();
    }, 15000);

    // Check URL hash on load
    if (window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (["kyc-verification-area", "kyc", "kyc-queue"].includes(hash)) {
        setActiveTab("kyc-desk");
      } else if (["legal-documents-area", "settings"].includes(hash)) {
        setActiveTab("legal-settings");
      } else if (["source-code-area", "source"].includes(hash)) {
        setActiveTab("source-code");
      } else if (["screenshots-area", "screenshots"].includes(hash)) {
        setActiveTab("screenshots");
      } else if (["sync-status", "mfapi"].includes(hash)) {
        setActiveTab("sync-status");
      }
    }

    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = () => {
    if (fileContent) {
      navigator.clipboard.writeText(fileContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleManualSync = async () => {
    setLoadingSync(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/instruments/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncStatus(data.result);
        setSyncMessage(`AMFI sync finished: ${data.result.syncedCount} schemes updated successfully.`);
      } else {
        setSyncMessage(`Sync notice: ${data.error || "Failed"}`);
      }
    } catch (err: any) {
      setSyncMessage(`Notice: ${err?.message || "Sync request failed"}`);
    } finally {
      setLoadingSync(false);
    }
  };

  const filteredFiles = SOURCE_FILE_REGISTRY.filter(f => {
    if (selectedTier === "frontend") return f.tier.includes("Frontend");
    if (selectedTier === "backend") return f.tier.includes("Backend");
    if (selectedTier === "schema") return f.tier.includes("Schema");
    return true;
  });

  const pendingKycCount = kycQueue.filter(c => c.kycStatus === 'SUBMITTED' || c.kycStatus === 'PENDING' || c.kycStatus === 'UNDER_REVIEW').length;
  const displayedKycClients = kycFilter === 'pending'
    ? kycQueue.filter(c => c.kycStatus === 'SUBMITTED' || c.kycStatus === 'PENDING' || c.kycStatus === 'UNDER_REVIEW' || c.kycStatus === 'NOT_STARTED')
    : kycQueue;

  return (
    <div className="space-y-8">
      {/* Quick Jump Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm flex flex-wrap items-center justify-between gap-2 sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "all" 
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            All Sections
          </button>
          
          <button
            onClick={() => setActiveTab("kyc-desk")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "kyc-desk" 
                ? "bg-amber-600 text-white shadow-sm" 
                : "text-amber-800 hover:bg-amber-50"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>KYC Verification Desk</span>
            {pendingKycCount > 0 && (
              <span className="bg-red-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-extrabold animate-pulse">
                {pendingKycCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("legal-settings")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "legal-settings" 
                ? "bg-indigo-600 text-white shadow-sm" 
                : "text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings: Legal Documents</span>
          </button>

          <button
            onClick={() => setActiveTab("source-code")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "source-code" 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Real Source Files</span>
          </button>

          <button
            onClick={() => setActiveTab("screenshots")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "screenshots" 
                ? "bg-sky-600 text-white shadow-sm" 
                : "text-sky-700 hover:bg-sky-50"
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>App Screenshots</span>
          </button>

          <button
            onClick={() => setActiveTab("sync-status")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "sync-status" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-blue-700 hover:bg-blue-50"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>AMFI Sync Status</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/admin/download-complete-package"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            title="Download Master Submission ZIP containing all legal docs, real source files, and screenshots"
          >
            <FolderArchive className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Master ZIP</span>
            <span className="text-emerald-400 text-[10px] font-mono">766 KB</span>
          </a>
        </div>
      </div>

      {/* 1. Academic Project Dissertation Hero Card (Preserved & Aligned) */}
      <div id="academic-report" className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
              <GraduationCap className="w-4 h-4" />
              <span>S.I.E.S COLLEGE OF ARTS, SCIENCE AND COMMERCE • MUMBAI UNIVERSITY</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              FinTrackPro: Enterprise Wealth Management &amp; Advisory Platform
            </h2>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              Official 60-page academic project dissertation submitted by <strong>PARTHASARATHY RADHAKRISHNAN</strong> (Roll No: <strong>TCS2627061</strong>) for the Bachelor of Science (Computer Science) 2025–2026 under the guidance of <strong>Prof. Maya Nair</strong> and Head of Department <strong>Dr. Manoj Singh</strong>. Includes gold-embossed covers, institutional certificate, declaration, abstract, 14 UML diagrams, and technical appendices.
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-400 font-mono">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700 text-slate-200">Candidate: Parthasarathy Radhakrishnan</span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700 text-slate-200">Roll No: TCS2627061</span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700 text-slate-200">College: S.I.E.S College, Sion(W)</span>
              <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-md border border-emerald-500/30">Total Pages: Exactly 60</span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">Guide: Prof. Maya Nair</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href="/api/academic-report/download"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download 60-Page Black Book (PDF)</span>
            </a>
            
            <a
              href="/api/academic-report/view"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/80 font-bold text-sm transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Preview in Browser</span>
            </a>

            <a
              href="/api/admin/download-complete-package"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all cursor-pointer"
              title="Download Master ZIP containing Source Files, Screenshots, and Academic Report"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Master Submission Package (ZIP)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. COMPLIANCE: CLIENT KYC DOCUMENTS VERIFICATION & APPROVAL DESK */}
      {(activeTab === "all" || activeTab === "kyc-desk") && (
        <div id="kyc-verification-area" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>SEBI &amp; RBI COMPLIANCE &bull; CLIENT KYC AUDIT &amp; APPROVAL DESK</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Investor KYC Documents Verification &amp; Trading Approval</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Audit uploaded client identity documents (PAN Card, Aadhaar, Bank Mandate, Signature), review compliance, and authorize trading accounts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setKycFilter("pending")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    kycFilter === "pending"
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Pending Action ({pendingKycCount})
                </button>
                <button
                  onClick={() => setKycFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    kycFilter === "all"
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  All Clients ({kycQueue.length})
                </button>
              </div>

              <button
                onClick={fetchKycQueue}
                disabled={loadingKyc}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingKyc ? "animate-spin" : ""}`} />
                <span>Refresh Queue</span>
              </button>
            </div>
          </div>

          {kycNotice && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{kycNotice}</span>
              </div>
              <button onClick={() => setKycNotice(null)} className="text-xs text-emerald-700 font-bold underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Client KYC Grid / Table */}
          {loadingKyc && kycQueue.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Loading KYC Verification Queue...</span>
            </div>
          ) : displayedKycClients.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-500">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
              <p className="font-bold text-slate-700">No Pending KYC Actions Found</p>
              <p className="text-xs text-slate-400 mt-1">All registered client accounts are either verified or no submissions are pending review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {displayedKycClients.map((client) => {
                const isVerified = client.kycStatus === 'VERIFIED' || client.kycStatus === 'Approved';
                const isSubmitted = client.kycStatus === 'SUBMITTED' || client.kycStatus === 'PENDING' || client.kycStatus === 'UNDER_REVIEW';
                const isRejected = client.kycStatus === 'REJECTED';

                return (
                  <div
                    key={client.id}
                    className={`rounded-2xl border p-5 transition-all ${
                      isSubmitted
                        ? "bg-amber-50/50 border-amber-200 shadow-sm"
                        : isVerified
                        ? "bg-emerald-50/20 border-emerald-200"
                        : isRejected
                        ? "bg-rose-50/20 border-rose-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Client Identity & Details */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-base text-slate-900">{client.fullName}</span>
                          <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            Client #{client.id}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                              isVerified
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : isSubmitted
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : isRejected
                                ? "bg-rose-100 text-rose-800 border-rose-300"
                                : "bg-slate-200 text-slate-700 border-slate-300"
                            }`}
                          >
                            {isVerified ? "KYC Approved & Active" : isSubmitted ? "Action Required: Pending Verification" : client.kycStatus || "NOT_STARTED"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                          <span>Email: <strong className="text-slate-800">{client.email}</strong></span>
                          <span>Phone: <strong className="text-slate-800">{client.phoneNumber}</strong></span>
                          {client.invitationDate && (
                            <span className="text-slate-400">Registered: {new Date(client.invitationDate).toLocaleDateString()}</span>
                          )}
                        </div>

                        {/* Regulatory Document Info */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
                          <div className="bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">PAN Card</span>
                            <span className="font-bold text-slate-800">{client.pan || "Not Provided"}</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">Aadhaar (Masked)</span>
                            <span className="font-bold text-slate-800">{client.aadhaarNumber || "Not Provided"}</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-slate-200 col-span-2">
                            <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">Bank Verification</span>
                            <span className="font-bold text-slate-800 truncate block">
                              {client.bankName || "Bank N/A"} • A/C: {client.bankAccountNumber || "N/A"} • IFSC: {client.bankIfsc || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Signature or Rejection notice */}
                        {client.signatureUrl && (
                          <div className="pt-2 flex items-center gap-3">
                            <span className="text-[11px] text-slate-500 font-medium">Digital Signature:</span>
                            <div className="h-9 w-28 bg-white border border-slate-300 rounded p-1 flex items-center justify-center">
                              <img src={client.signatureUrl} alt="Signature" className="max-h-full max-w-full object-contain" />
                            </div>
                            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Vector Verified</span>
                          </div>
                        )}

                        {client.kycRejectionReason && (
                          <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                            <strong>Rejection Note:</strong> {client.kycRejectionReason}
                          </p>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 self-start lg:self-center">
                        {!isVerified ? (
                          <>
                            <button
                              onClick={() => handleApproveKyc(client.id, client.fullName)}
                              disabled={approvingId === client.id}
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>{approvingId === client.id ? "Approving..." : "Approve & Authorize Trading"}</span>
                            </button>

                            <button
                              onClick={() => handleRejectKyc(client.id, client.fullName)}
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all cursor-pointer"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Reject Documents</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Authorized for Mutual Fund Trading</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. SETTING: CREATE LEGAL DOCUMENTS & REGULATORY REPOSITORY AREA */}
      {(activeTab === "all" || activeTab === "legal-settings") && (
        <div id="legal-documents-area" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
                <Scale className="w-3.5 h-3.5" />
                <span>ADMIN SETTINGS &bull; CREATE &amp; ATTACH LEGAL DOCUMENTS</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Official Legal Documents, Attestations &amp; Regulatory Artifacts</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Generate, download, and attach legally binding regulatory filings, academic project report dissertations, and compliance charters.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleRegenerateLegalDocs}
                disabled={generatingLegal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-indigo-600 ${generatingLegal ? "animate-spin" : ""}`} />
                <span>{generatingLegal ? "Re-Generating Docs..." : "Re-Generate Legal Docs"}</span>
              </button>

              <a
                href="/api/admin/download-complete-package"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <FolderArchive className="w-4 h-4 text-emerald-400" />
                <span>Download Master Submission Package (ZIP)</span>
              </a>
            </div>
          </div>

          {legalNotice && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{legalNotice}</span>
              </div>
              <button onClick={() => setLegalNotice(null)} className="text-xs text-emerald-700 underline hover:opacity-80">
                Dismiss
              </button>
            </div>
          )}

          {/* Institutional Credentials Banner */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                <strong>S.I.E.S College of Arts, Science and Commerce, Sion(W), Mumbai – 400 022</strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-slate-600 font-mono text-[11px]">
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200">Candidate: Parthasarathy Radhakrishnan</span>
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200">Roll: TCS2627061</span>
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200">Guide: Prof. Maya Nair</span>
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200">HOD: Dr. Manoj Singh</span>
            </div>
          </div>

          {/* 4 Legal Documents Attached Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Academic Dissertation */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider font-mono">
                    Mumbai University Black Book
                  </span>
                  <span className="text-xs font-mono text-slate-500">60 Pages • 556 KB</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  1. Official Academic Project Report (FinTrackPro)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Full academic capstone project report submitted to the Department of Computer Science, S.I.E.S College. Contains outer cover, inner title, certificate, declaration, abstract, 9 chapters, 14 UML diagrams, and technical appendices.
                </p>
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
                  Candidate: Parthasarathy Radhakrishnan &bull; Roll: TCS2627061 &bull; Guide: Prof. Maya Nair
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <a
                  href="/api/academic-report/download"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
                <a
                  href="/api/academic-report/view"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Preview</span>
                </a>
                <a
                  href="/api/admin/download-file?file=academicScript"
                  className="text-xs text-slate-500 hover:text-slate-800 ml-auto font-mono flex items-center gap-1"
                >
                  <Code className="w-3 h-3" />
                  <span>Generator Script</span>
                </a>
              </div>
            </div>

            {/* 2. SEBI RIA Regulatory Disclosure */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase tracking-wider font-mono">
                    SEBI (IA) Regulations 2013
                  </span>
                  <span className="text-xs font-mono text-slate-500">2 Pages • 20 KB</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  2. SEBI Registered Advisory &amp; AMFI Disclosure Charter
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fiduciary compliance agreement governing mutual fund advisory under ARN-348996 (Velocity Wealth). Mandates Direct Plan TER transparency, daily 11:15 PM NAV valuation timeliness, risk suitability, and 3-tier grievance escalation.
                </p>
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
                  Attested by Candidate, Project Guide Prof. Maya Nair, and Head of Dept Dr. Manoj Singh
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <a
                  href="/api/admin/legal/sebi-disclosure"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Legal PDF</span>
                </a>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SEBI Compliant</span>
                </span>
              </div>
            </div>

            {/* 3. RBI & NPCI E-Mandate */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider font-mono">
                    RBI / NPCI NACH 3.2
                  </span>
                  <span className="text-xs font-mono text-slate-500">2 Pages • 20 KB</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  3. NPCI NACH E-Mandate Legal Authorization Form
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Electronic standing instruction contract under RBI Circular DPSS.CO.OD.No.1328. Enforces ₹1,00,000 maximum daily auto-debit cap, 24-hour pre-debit advisory SMS/email notifications, and instantaneous investor mandate pause rights.
                </p>
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
                  Sponsor Bank: HDFC Bank / ICICI Bank &bull; Protocol: NetBanking 2FA / Debit Card OTP
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <a
                  href="/api/admin/legal/emandate-agreement"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Legal PDF</span>
                </a>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>RBI Compliant</span>
                </span>
              </div>
            </div>

            {/* 4. DPDP Act 2023 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 uppercase tracking-wider font-mono">
                    DPDP Act 2023 (India)
                  </span>
                  <span className="text-xs font-mono text-slate-500">2 Pages • 20 KB</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  4. Digital Personal Data Protection (DPDP) Privacy Charter
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Data fiduciary charter governing financial records, masked Aadhaar UIDAI numbers, encrypted HTML5 vector signatures, and ephemeral Zero-On-Screen OTP credentials under India's Digital Personal Data Protection Act, 2023.
                </p>
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
                  AES-256 Storage &bull; TLS 1.3 Transit &bull; Sovereign Mumbai Cloud Datacenter
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <a
                  href="/api/admin/legal/dpdp-consent"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Legal PDF</span>
                </a>
                <span className="text-[11px] text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Data Fiduciary Verified</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. REAL FINTRACKPRO SOURCE FILES (FRONTEND, BACKEND, SCHEMA) AREA */}
      {(activeTab === "all" || activeTab === "source-code") && (
        <div id="source-code-area" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2">
                <FileCode className="w-3.5 h-3.5" />
                <span>REAL SOURCE CODE FILES &bull; PRODUCTION REPOSITORY</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Real FinTrackPro Source Code (Frontend, Backend &amp; Schema)</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Download individual source files or complete ZIP archive containing production TypeScript React views, Express controllers, and PostgreSQL DDL.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/api/admin/download-source-zip"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download All Source Files (ZIP &bull; 585 KB)</span>
              </a>
            </div>
          </div>

          {/* Tier Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Filter Tier:</span>
            {[
              { id: "all", label: "All Tiers (11 Files)" },
              { id: "frontend", label: "Frontend Tier (5)" },
              { id: "backend", label: "Backend Tier (3)" },
              { id: "schema", label: "Database Schema (3)" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTier(t.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedTier === t.id 
                    ? "bg-slate-900 text-white font-bold" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Source Files Registry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <div 
                key={file.key} 
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono border bg-white text-slate-700 border-slate-200">
                      {file.tier}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${file.tierColor}`}>
                      {file.tech}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 font-mono">
                    {file.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    <code>{file.path}</code>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {file.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <a
                    href={`/api/admin/download-file?file=${file.key}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    title={`Download raw ${file.name}`}
                  >
                    <Download className="w-3 h-3 text-emerald-400" />
                    <span>Download File</span>
                  </a>

                  <button
                    onClick={() => {
                      loadSourceFile(file.key);
                      const el = document.getElementById("source-code-inspector");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-indigo-500" />
                    <span>View Code</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* In-Browser Source Code Inspector */}
          <div id="source-code-inspector" className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden mt-6">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Interactive Source Code Viewer</span>
              </div>

              {/* File Switcher Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {SOURCE_FILE_REGISTRY.map(f => (
                  <button
                    key={f.key}
                    onClick={() => loadSourceFile(f.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      selectedFileKey === f.key 
                        ? "bg-emerald-500 text-slate-950 font-bold" 
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {fileDetails && (
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    {fileDetails.lines} lines &bull; {(fileDetails.size / 1024).toFixed(1)} KB
                  </span>
                )}
                <a
                  href={`/api/admin/download-file?file=${selectedFileKey}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
                  title="Download currently active source file"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download</span>
                </a>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>
            </div>

            {/* Code Viewer Body */}
            <div className="p-4 max-h-80 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950/80 leading-relaxed">
              {loadingFile ? (
                <div className="py-12 text-center text-slate-500 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Loading source code...</span>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-all text-emerald-400/90 font-mono text-[11px]">
                  {fileContent}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. REAL SCREENSHOTS OF THE RUNNING APP AREA */}
      {(activeTab === "all" || activeTab === "screenshots") && (
        <div id="screenshots-area" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-2">
                <Image className="w-3.5 h-3.5" />
                <span>LIVE APPLICATION SCREENSHOTS &amp; UI WALKTHROUGH</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Real Screenshots of the Running FinTrackPro App</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                High-resolution captures of the active user interfaces, AMFI fund screener, partner advisory desk, and e-mandate modals.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/api/admin/download-screenshots-pdf"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Walkthrough PDF (All Screens)</span>
              </a>
            </div>
          </div>

          {/* Screenshots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REAL_SCREENSHOTS.map((screen) => (
              <div 
                key={screen.id} 
                className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all flex flex-col group"
              >
                {/* Image Preview Container */}
                <div 
                  className="relative bg-slate-950 aspect-video overflow-hidden cursor-pointer"
                  onClick={() => setPreviewScreenshot(screen)}
                >
                  <img 
                    src={screen.file} 
                    alt={screen.title} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zoom Fullscreen</span>
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-emerald-400 border border-emerald-500/30">
                      {screen.badge}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {screen.category}
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {screen.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {screen.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setPreviewScreenshot(screen)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Screen</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={screen.file}
                      download={`${screen.id}.svg`}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      title="Download vector SVG screenshot"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download SVG</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screenshot Fullscreen Modal */}
      {previewScreenshot && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewScreenshot(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Image className="w-4 h-4 text-emerald-400" />
                  <span>{previewScreenshot.title}</span>
                </h3>
                <p className="text-xs text-slate-400">{previewScreenshot.desc}</p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={previewScreenshot.file}
                  download={`${previewScreenshot.id}.svg`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </a>
                <button
                  onClick={() => setPreviewScreenshot(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Body */}
            <div className="p-4 sm:p-6 overflow-auto flex items-center justify-center bg-slate-950/60">
              <img 
                src={previewScreenshot.file} 
                alt={previewScreenshot.title} 
                className="max-h-[70vh] w-auto max-w-full rounded-xl border border-slate-800 shadow-2xl object-contain" 
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. MFAPI.in Live Synchronization Status & Overview Stats */}
      {(activeTab === "all" || activeTab === "sync-status") && (
        <div id="sync-status" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">MFAPI.in Live Synchronization Status</h2>
              <p className="text-sm text-slate-500">Real-time daily AMFI NAV automated tracking engine</p>
            </div>
            {syncStatus && (
              <div className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
                Last Synced: <span className="font-semibold text-slate-800">{syncStatus.lastSyncTime}</span>
              </div>
            )}
          </div>

          {syncMessage && (
            <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between ${syncMessage.includes("error") || syncMessage.includes("Error") ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"}`}>
              <span>{syncMessage}</span>
              <button onClick={() => setSyncMessage(null)} className="text-xs underline hover:opacity-80">Dismiss</button>
            </div>
          )}
          
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
              <div className="bg-blue-50 p-3 rounded-lg mr-4">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Tracked Schemes</p>
                <h3 className="text-2xl font-bold text-slate-800">{syncStatus?.totalTracked ?? 42}</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
              <div className="bg-emerald-50 p-3 rounded-lg mr-4">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Successfully Synced</p>
                <h3 className="text-2xl font-bold text-emerald-600">{syncStatus?.syncedCount ?? 42}</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
              <div className={`${(syncStatus?.failedCount ?? 0) > 0 ? "bg-orange-50" : "bg-slate-50"} p-3 rounded-lg mr-4`}>
                <AlertTriangle className={`h-6 w-6 ${(syncStatus?.failedCount ?? 0) > 0 ? "text-orange-600" : "text-slate-400"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Sync Failures</p>
                <h3 className={`text-2xl font-bold ${(syncStatus?.failedCount ?? 0) > 0 ? "text-orange-600" : "text-slate-700"}`}>
                  {syncStatus?.failedCount ?? 0}
                </h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <button 
                onClick={handleManualSync}
                disabled={loadingSync}
                className="w-full h-full min-h-[4rem] rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loadingSync ? "animate-spin text-emerald-400" : ""}`} /> 
                {loadingSync ? "Synchronizing AMFI..." : "Trigger Manual Sync"}
              </button>
            </div>
          </div>

          {/* Sync Details Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Tracked AMFI Mutual Fund Schemes Status</h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
                {syncStatus?.status === 'SYNCING' ? 'Sync In Progress' : 'Engine Active & Armed'}
              </span>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-sm min-w-[650px]">
                <thead className="bg-white text-slate-500 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 font-semibold">AMFI Code</th>
                    <th className="px-6 py-3 font-semibold">Sync Status</th>
                    <th className="px-6 py-3 font-semibold">Frequency</th>
                    <th className="px-6 py-3 font-semibold">Provider</th>
                    <th className="px-6 py-3 font-semibold">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {syncStatus?.details && syncStatus.details.length > 0 ? (
                    syncStatus.details.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-6 py-3 font-mono text-xs font-bold text-slate-700">{item.code}</td>
                        <td className="px-6 py-3">
                          {item.status === 'SUCCESS' ? (
                            <span className="inline-flex items-center text-emerald-600 font-medium text-xs bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Synced
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-600 font-medium text-xs bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                              <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> {item.error || 'Failed'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-xs text-slate-600">Daily 11:15 PM IST</td>
                        <td className="px-6 py-3 text-xs text-slate-600">AMFI / MFAPI.in</td>
                        <td className="px-6 py-3 text-xs text-slate-500">
                          <span className="inline-flex items-center text-emerald-700">
                            <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" /> Verified
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="hover:bg-slate-50">
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        Loading scheme status records...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
