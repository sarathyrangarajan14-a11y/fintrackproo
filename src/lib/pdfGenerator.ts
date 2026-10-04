import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HEAD_COMPANY_NAME = "VELOCITY WEALTH";
const APP_NAME = "FinTrackPro";
const COMPANY_ADDRESS = "Room 603, E-Wing, Bld-1 CHS Flank Road, Indranagar, Sion Koliwada, Mumbai, Maharashtra - 400037";
const ARN = "ARN-348996";

export interface ReportMetadata {
  pan?: string;
  email?: string;
  phone?: string;
  asOnDate?: string;
  period?: string;
  totals?: {
    invested?: string;
    currentValue?: string;
    gain?: string;
    returns?: string;
  };
}

export function generateReportPdf(clientName: string, reportType: string, data: any[], metadata?: ReportMetadata): jsPDF {
  const doc = new jsPDF();
  
  // Header Logo & Branding Bar
  // Left: Velocity Wealth (Head Company)
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129); // Emerald 500
  doc.setFont("helvetica", "bold");
  doc.text(HEAD_COMPANY_NAME, 14, 18);
  
  // App Sub-header: Powered by FinTrackPro
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.text(`${APP_NAME} Advisory & Investment Portal`, 14, 25);

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_ADDRESS, 14, 31, { maxWidth: 120 });
  
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(`AMFI Registered Mutual Fund Distributor | ${ARN}`, 14, 40);

  // Top Right Logo Badge
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(152, 12, 44, 16, 3, 3, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(APP_NAME, 157, 20);
  doc.setFontSize(7);
  doc.text("by Velocity Wealth", 157, 25);
  
  // Report Title Badge
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(`${reportType.toUpperCase()}`, 14, 49);

  // Client Details Bar
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 53, 182, 18, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 53, 182, 18, "S");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Client Name: ${clientName}`, 18, 60);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  if (metadata?.pan) {
    doc.text(`PAN: ${metadata.pan}`, 18, 67);
  } else {
    doc.text(`Client ID: CLT-${Math.abs(clientName.split('').reduce((a,b)=>(((a<<5)-a)+b.charCodeAt(0))|0, 0) % 9000 + 1000)}`, 18, 67);
  }

  if (metadata?.email) {
    doc.text(`Email: ${metadata.email}`, 105, 60);
  }
  if (metadata?.phone) {
    doc.text(`Phone: +91 ${metadata.phone.slice(-10)}`, 105, 67);
  }
  
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 148, 60);
  if (metadata?.period) {
    doc.text(`Period: ${metadata.period}`, 148, 67);
  }

  // Table
  const tableColumn = Object.keys(data[0] || {});
  const tableRows = data.map(item => Object.values(item));
  
  autoTable(doc, {
    startY: 75,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { top: 75, left: 14, right: 14 }
  });

  let finalY = (doc as any).lastAutoTable?.finalY || 150;

  // Totals Summary Box if present
  if (metadata?.totals && finalY < 240) {
    doc.setFillColor(241, 245, 249);
    doc.rect(14, finalY + 6, 182, 16, "F");
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, finalY + 6, 182, 16, "S");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    
    if (metadata.totals.invested) {
      doc.text(`Total Invested: ${metadata.totals.invested}`, 18, finalY + 16);
    }
    if (metadata.totals.currentValue) {
      doc.text(`Current Value: ${metadata.totals.currentValue}`, 70, finalY + 16);
    }
    if (metadata.totals.gain) {
      doc.text(`Total Gain: ${metadata.totals.gain}`, 125, finalY + 16);
    }
    if (metadata.totals.returns) {
      doc.setTextColor(16, 185, 129);
      doc.text(`Returns: ${metadata.totals.returns}`, 165, finalY + 16);
    }
  }
  
  // Footer setup
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const text = "Disclaimer: Mutual fund investments are subject to market risks. Read all scheme related documents carefully.";
    doc.text(text, 14, doc.internal.pageSize.height - 10);
    doc.text(`${APP_NAME} by ${HEAD_COMPANY_NAME} | Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 70, doc.internal.pageSize.height - 10);
  }

  return doc;
}

/**
 * Generates a highly detailed, professional Website Technical Specification Document in PDF format.
 */
export function generateTechnicalSpecPdf(): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- COVER PAGE ---
  // Large decorative background block (Indigo accent)
  doc.setFillColor(30, 27, 75); // Dark Indigo
  doc.rect(0, 0, 80, pageHeight, "F");

  // Title Column (Right Side)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(30, 27, 75);
  doc.text("WEBSITE TECHNICAL", 90, 80);
  doc.text("SPECIFICATION", 90, 92);
  
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129); // Emerald Accent
  doc.text("SYSTEM ARCHITECTURE & MANUAL", 90, 105);

  // Sub-details
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1.5);
  doc.line(90, 115, 190, 115);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text("Platform:", 90, 130);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("FinTrackPro (by Velocity Wealth)", 125, 130);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Head Company:", 90, 138);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("VELOCITY WEALTH", 125, 138);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Core Stack:", 90, 146);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("React v19, TypeScript, Express v4, Tailwind CSS, Firestore", 125, 146);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Environment:", 90, 154);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Google Cloud Run (Docker-Managed, Port 3000 Ingress)", 125, 154);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Version Status:", 90, 162);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("v1.4.0 (Enterprise Deployment Ready)", 125, 162);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Target Date:", 90, 170);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 125, 170);

  // Decorative text on vertical banner
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("FINTRACKPRO • VELOCITY WEALTH", 25, 250, { angle: 90 });

  // Add Page 2: System Architecture overview
  doc.addPage();
  drawPageHeader(doc, "1. Architecture & Technology Stack", pageWidth);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(51, 65, 85);
  
  const archIntro = "The FinTrackPro platform is engineered as a highly responsive, modern, full-stack single-page application (SPA) developed for Velocity Wealth. It is built with React 19 and Vite on the client side, connected directly to a high-performance Express.js server on the backend. It integrates seamlessly with Google Cloud Run containers and utilizes Firebase Firestore and Auth as its secure persistent data cloud layer.";
  doc.text(archIntro, 15, 42, { maxWidth: 180, align: "justify" });

  // Table of Core Technology components
  autoTable(doc, {
    startY: 68,
    head: [["Component", "Technology / Framework", "Strategic Purpose & Details"]],
    body: [
      ["Frontend SPA", "React 19 + Vite + TypeScript", "Provides dynamic client-side rendering with Type safety and ultra-fast hot module replacement. Compiled cleanly to modern ECMA static modules."],
      ["Backend Layer", "Express.js v4 + TS Node", "Handles API proxy requests, secure authorization token validation, backend data transformation, and protects confidential API keys."],
      ["Styling System", "Tailwind CSS v4", "Ensures responsive layout delivery, elegant modern typography scale, zero-runtime overhead, and crisp UI container aesthetics."],
      ["Database Cloud", "Firebase Firestore + Drizzle ORM", "Guarantees distributed multi-device synchronization, secure persistence of transaction ledgers, SIP lists, and client portfolios."],
      ["Ingress Router", "Nginx Gateway (Port 3000)", "Guarantees single accessible ingress mapped to Port 3000. Forwards all web sockets, client assets, and secure backend endpoints."]
    ],
    theme: "striped",
    headStyles: { fillColor: [30, 27, 75] },
    styles: { fontSize: 8.5 }
  });

  // Flow details
  const flowText = "Client requests are routed exclusively through Nginx on Port 3000. Static assets (React build files) are served straight from disk in production, while any custom APIs starting with '/api' are handled natively by the Express framework. The application employs lazy-loading optimization to ensure optimal core vitals and sub-second paint milestones.";
  doc.text(flowText, 15, (doc as any).lastAutoTable.finalY + 12, { maxWidth: 180, align: "justify" });

  // Add Page 3: Security & Database Blueprints
  doc.addPage();
  drawPageHeader(doc, "2. Security & Database Blueprint", pageWidth);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 27, 75);
  doc.text("2.1 Identity & Encryption Perimeter", 15, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const securityDesc = "Security is integrated directly into both the transport layer and the transaction endpoints. All data transfer is wrapped in SSL/TLS. Firebase Auth tokens are passed dynamically from the client in authorization headers and verified on the server side using the secure Admin SDK.";
  doc.text(securityDesc, 15, 49, { maxWidth: 180, align: "justify" });

  doc.setFont("helvetica", "bold");
  doc.text("2.2 Firestore Database Collection Schemas", 15, 68);

  // Firestore Collections table
  autoTable(doc, {
    startY: 74,
    head: [["Collection ID", "Document Fields", "Type / Rules", "Security Controls"]],
    body: [
      ["users", "uid, email, phone, role, kycStatus", "Document Schema", "Readable only by self and assigned manager. Created via Auth hook."],
      ["holdings", "id, clientUid, fundId, units, value", "Array Object", "Read-only for users; updated via background transactional api."],
      ["transactions", "id, clientUid, amount, type, date", "Transactional Log", "Write restricted to verified payment callback authorization."],
      ["sips", "id, clientUid, amount, frequency, status", "Automation Ledger", "Allows edit/skip parameters controlled by partner and client OTP auth."],
      ["partners", "arn, firmName, email, activeClients", "Enterprise Metadata", "Read globally for verification; write reserved for Administrator roles."]
    ],
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129] },
    styles: { fontSize: 8.5 }
  });

  // Add Page 4: APIs & Build Pipeline
  doc.addPage();
  drawPageHeader(doc, "3. API Specifications & DevOps Pipeline", pageWidth);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 27, 75);
  doc.text("3.1 Backend Proxy & Integration Endpoints", 15, 42);

  autoTable(doc, {
    startY: 48,
    head: [["HTTP Method", "API Route", "Integration Source", "Payload / Return Schema"]],
    body: [
      ["GET", "/api/market-indices", "Yahoo Finance (Real-time)", "Returns Live Nifty 50, Sensex indices, market trend data and changes."],
      ["GET", "/api/stocks/search", "Yahoo Finance API (Direct)", "Filters stocks by ticker or name and returns full pricing details."],
      ["POST", "/api/sip/create-order", "Instamojo Gateway API", "Initiates an authorized fund transfer and returns Instamojo checkout order."],
      ["POST", "/api/kyc/verify-otp", "Firebase Phone Auth SDK", "Performs two-factor phone auth to finalize digital KYC enrollment."],
      ["GET", "/api/mutual-funds/details", "MF API India Engine", "Returns NAV data, historical performance charts and tracking records."]
    ],
    theme: "striped",
    headStyles: { fillColor: [30, 27, 75] },
    styles: { fontSize: 8.5 }
  });

  doc.setFont("helvetica", "bold");
  doc.text("3.2 DevOps Build & Run Specification", 15, (doc as any).lastAutoTable.finalY + 12);
  
  doc.setFont("helvetica", "normal");
  const buildDesc = "The container uses a custom layered Dockerfile build pipeline. The server is dynamically compiled with esbuild to target standard CommonJS (dist/server.cjs) output, resolving all modular relative paths at compile time. This bypasses runtime Node relative loading constraints and guarantees extremely fast startup times under 100ms.";
  doc.text(buildDesc, 15, (doc as any).lastAutoTable.finalY + 19, { maxWidth: 180, align: "justify" });

  // Draw Page Numbers and Footers across all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    doc.setPage(pageNum);
    
    // Header line (Skip cover page)
    if (pageNum > 1) {
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(15, 30, pageWidth - 15, 30);
    }

    // Footer line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

    // Footer Text
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.text("FinTrackPro by VELOCITY WEALTH • System Architecture Specification", 15, pageHeight - 10);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
  }

  return doc;
}

// Utility to draw consistent page headers on inner sheets
function drawPageHeader(doc: jsPDF, title: string, pageWidth: number) {
  doc.setFillColor(30, 27, 75); // Dark Indigo
  doc.rect(0, 0, pageWidth, 24, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(title.toUpperCase(), 15, 16);

  // Logo icon
  doc.setFillColor(16, 185, 129); // Emerald
  doc.rect(pageWidth - 36, 6, 22, 12, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("FTP", pageWidth - 31, 14);
}
