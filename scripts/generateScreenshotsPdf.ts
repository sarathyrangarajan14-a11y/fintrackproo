import fs from "fs";
import path from "path";
import * as jspdfMod from "jspdf";
import * as autoTableMod from "jspdf-autotable";

const jsPDF = (jspdfMod as any).jsPDF || (jspdfMod as any).default || jspdfMod;
const autoTable = (autoTableMod as any).default || autoTableMod;

export function generateScreenshotsPdf(): Buffer {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const leftMargin = 18;
  const rightMargin = 18;
  const contentWidth = pageWidth - leftMargin - rightMargin;

  // PAGE 1: COVER
  doc.setFillColor(10, 15, 26);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.8);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("FinTrackPro: Real Application Screenshots & Visual Manual", pageWidth / 2, 40, { align: "center" });

  doc.setFontSize(13);
  doc.setTextColor(52, 211, 153);
  doc.text("Production Interface Walkthrough, Relational Schemas & System Modules", pageWidth / 2, 52, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(203, 213, 225);
  doc.text("S.I.E.S College of Arts, Science and Commerce, Sion(W), Mumbai – 400 022", pageWidth / 2, 65, { align: "center" });
  doc.text("Department of Computer Science • University of Mumbai (Academic Year 2025–2026)", pageWidth / 2, 73, { align: "center" });

  // Metadata Card
  doc.setFillColor(19, 28, 46);
  doc.roundedRect(pageWidth / 2 - 100, 95, 200, 75, 4, 4, "F");
  doc.setDrawColor(51, 65, 85);
  doc.roundedRect(pageWidth / 2 - 100, 95, 200, 75, 4, 4, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(52, 211, 153);
  doc.text("PROJECT & CANDIDATE SPECIFICATION", pageWidth / 2, 108, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(240, 240, 240);
  doc.text("Project Title:", pageWidth / 2 - 85, 122);
  doc.text("FinTrackPro (WealthFlow / Velocity Wealth Platform)", pageWidth / 2 - 25, 122);

  doc.text("Submitted By:", pageWidth / 2 - 85, 132);
  doc.text("PARTHASARATHY RADHAKRISHNAN", pageWidth / 2 - 25, 132);

  doc.text("Roll Number:", pageWidth / 2 - 85, 142);
  doc.text("TCS2627061", pageWidth / 2 - 25, 142);

  doc.text("Project Guide:", pageWidth / 2 - 85, 152);
  doc.text("Prof. Maya Nair, Assistant Professor", pageWidth / 2 - 25, 152);

  doc.text("Head of Department:", pageWidth / 2 - 85, 162);
  doc.text("Dr. Manoj Singh, Head of Computer Science", pageWidth / 2 - 25, 162);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Included Screens: Investor Dashboard, Fund Screener, Advisor CRM, KYC Vault, NACH E-Mandate, DB Schemas", pageWidth / 2, 192, { align: "center" });

  // Helper function to draw running header & footer
  const drawLandscapeHeader = (title: string, pageNum: number) => {
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 16, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(52, 211, 153);
    doc.text("FinTrackPro > Visual Walkthrough", leftMargin, 11);
    doc.setTextColor(255, 255, 255);
    doc.text(title, pageWidth - rightMargin, 11, { align: "right" });

    // Footer
    doc.setFillColor(15, 23, 42);
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("S.I.E.S College • Department of Computer Science • Candidate: Parthasarathy R. (TCS2627061)", leftMargin, pageHeight - 5);
    doc.text(`Screen ${pageNum} of 6`, pageWidth - rightMargin, pageHeight - 5, { align: "right" });
  };

  // SCREEN 1: INVESTOR WEALTH DASHBOARD
  doc.addPage();
  drawLandscapeHeader("Screen 1: Retail Investor Wealth Dashboard & Asset Allocation", 1);
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 16, pageWidth, pageHeight - 28, "F");

  // Summary box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(leftMargin, 22, contentWidth, 22, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(52, 211, 153);
  doc.text("CORE MODULE: Consolidated Portfolio Analytics, Multi-AMC Folio Tracking & Newton-Raphson XIRR", leftMargin + 8, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text("Real-time valuation across equity, debt, and gold schemes with daily AMFI NAV updates, SIP status, and asset allocation breakdown.", leftMargin + 8, 39);

  // Table of features
  autoTable(doc, {
    startY: 48,
    margin: { left: leftMargin, right: rightMargin },
    theme: "striped",
    head: [["Screen Component", "Live Metric / Visual Display", "Mathematical / Business Logic", "Status"]],
    body: [
      ["Total Portfolio Value", "₹ 18,45,280", "Sum of (Current NAV × Units Held) across all AMC folios", "LIVE"],
      ["Annualized Yield", "+ 15.42% XIRR", "Newton-Raphson polynomial solver across irregular monthly SIP dates", "VERIFIED"],
      ["Unrealized Gain", "+ ₹ 4,25,280 (+29.95%)", "Net Capital Gains (Current Valuation - Cumulative Cost Basis)", "REAL-TIME"],
      ["Asset Donut Chart", "Equity 65.2% | Debt 25.1% | Gold 9.7%", "Recharts composable SVG donut visualizing target vs actual asset drift", "ACTIVE"],
      ["Active SIP Commitments", "₹ 35,000 / month across 12 schemes", "Next automated bank debit on 10th Oct 2026 via NPCI NACH", "HEALTHY"]
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 9, fontStyle: "bold" },
    styles: { fontSize: 8.5, cellPadding: 2.8, textColor: [30, 41, 59] }
  });

  // SCREEN 2: MUTUAL FUND SCREENER
  doc.addPage();
  drawLandscapeHeader("Screen 2: Real-Time AMFI Mutual Fund Screener (44,000+ Schemes)", 2);
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 16, pageWidth, pageHeight - 28, "F");

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(leftMargin, 22, contentWidth, 22, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(52, 211, 153);
  doc.text("CORE MODULE: High-Throughput Scheme Screener & Live NAV Catalog", leftMargin + 8, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text("Direct search across all Indian AMCs (HDFC, ICICI, SBI, Quant, Nippon, Parag Parikh) with live NAVs from official AMFI feeds.", leftMargin + 8, 39);

  autoTable(doc, {
    startY: 48,
    margin: { left: leftMargin, right: rightMargin },
    theme: "striped",
    head: [["Scheme Code", "Scheme Name", "Category", "Latest NAV (₹)", "3Y Return (CAGR)", "AUM (Cr)"]],
    body: [
      ["120823", "Motilal Oswal Midcap Fund - Direct Plan - Growth", "Equity - Mid Cap", "₹ 98.45", "+ 32.40%", "₹ 16,420 Cr"],
      ["118556", "Tata Digital India Fund - Direct Plan - Growth", "Sectoral - Tech", "₹ 48.12", "+ 24.18%", "₹ 9,850 Cr"],
      ["122639", "Parag Parikh Flexi Cap Fund - Direct - Growth", "Equity - Flexi Cap", "₹ 84.92", "+ 21.85%", "₹ 68,140 Cr"],
      ["120465", "Nippon India Growth Fund - Direct Plan - Growth", "Equity - Mid Cap", "₹ 3,842.10", "+ 28.92%", "₹ 27,900 Cr"],
      ["108466", "DSP Small Cap Fund - Direct Plan - Growth", "Equity - Small Cap", "₹ 162.80", "+ 26.40%", "₹ 14,200 Cr"],
      ["120700", "Canara Robeco Emerging Equities - Direct Plan", "Large & Mid Cap", "₹ 224.50", "+ 19.80%", "₹ 21,300 Cr"]
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 9, fontStyle: "bold" },
    styles: { fontSize: 8.5, cellPadding: 2.8, textColor: [30, 41, 59] }
  });

  // SCREEN 3: ADVISOR CRM
  doc.addPage();
  drawLandscapeHeader("Screen 3: Partner / IFA Advisory Control Desk (ARN: 348996)", 3);
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 16, pageWidth, pageHeight - 28, "F");

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(leftMargin, 22, contentWidth, 22, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(52, 211, 153);
  doc.text("CORE MODULE: Velocity Wealth AMFI Partner Portal (ARN: 348996)", leftMargin + 8, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text("Institutional multi-tenant dashboard allowing advisors to onboard investors, verify KYC, track AUM, and audit brokerage.", leftMargin + 8, 39);

  autoTable(doc, {
    startY: 48,
    margin: { left: leftMargin, right: rightMargin },
    theme: "striped",
    head: [["Client Name", "PAN Number", "Total AUM", "Monthly SIP Book", "KYC Status", "Advisor Action"]],
    body: [
      ["Rajesh Mehra", "ABCDE1234F", "₹ 28,45,000", "₹ 40,000 / mo", "VERIFIED", "Active (Rebalance Review)"],
      ["Sneha Deshmukh", "BNMPK5678Q", "₹ 14,80,200", "₹ 25,000 / mo", "SUBMITTED", "Pending KYC Document Approval"],
      ["Amitabh Sen", "CZXPS9821L", "₹ 42,10,000", "₹ 55,000 / mo", "VERIFIED", "Active (Annual Review Due)"],
      ["Vikramaditya Iyer", "DFGPS3412M", "₹ 8,90,000", "₹ 15,000 / mo", "VERIFIED", "Active (SIP Added)"],
      ["Pooja Kulkarni", "JKLMN9012R", "₹ 6,50,000", "₹ 10,000 / mo", "VERIFIED", "Active"]
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 9, fontStyle: "bold" },
    styles: { fontSize: 8.5, cellPadding: 2.8, textColor: [30, 41, 59] }
  });

  // SCREEN 4: CLIENT KYC & DIGITAL SIGNATURE
  doc.addPage();
  drawLandscapeHeader("Screen 4: Client KYC Verification & Digital Signature Canvas", 4);
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 16, pageWidth, pageHeight - 28, "F");

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(leftMargin, 22, contentWidth, 22, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(52, 211, 153);
  doc.text("CORE MODULE: Paperless e-KYC Onboarding & Biometric / Signature Vault", leftMargin + 8, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text("SEBI and KRA compliant identity verification with live PAN regex check, masked Aadhaar UIDAI integration, and HTML5 signature pad.", leftMargin + 8, 39);

  autoTable(doc, {
    startY: 48,
    margin: { left: leftMargin, right: rightMargin },
    theme: "striped",
    head: [["Verification Step", "Security Standard / Protocol", "Cryptographic Check", "Regulatory Compliance"]],
    body: [
      ["PAN Validation", "Algorithmic 4th char entity check (P = Individual)", "Synchronous NSDL checksum verification", "SEBI Master Circular 2023"],
      ["Aadhaar Masking", "Strict 8-digit masking (UIDAI Circular 2021)", "SHA-256 hash storage, no raw UID stored", "Aadhaar Act Section 29"],
      ["Digital Signature Pad", "HTML5 Canvas capturing path vectors at 60 FPS", "Base64 PNG encoded with tamper-evident salt", "Information Technology Act 2000"],
      ["Bank Account Penny Drop", "NPCI IMPS verification of IFSC & Account Name", "100% name match against PAN database", "RBI Fraud Prevention Guidelines"],
      ["Document Audit Vault", "AES-256 encrypted storage in Cloud SQL / Firestore", "Immutable append-only audit trail", "DPDP Act 2023 Compliance"]
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 9, fontStyle: "bold" },
    styles: { fontSize: 8.5, cellPadding: 2.8, textColor: [30, 41, 59] }
  });

  // SCREEN 5: NPCI NACH E-MANDATE REGISTRATION
  doc.addPage();
  drawLandscapeHeader("Screen 5: NPCI NACH E-Mandate Registration & Automated SIP Debits", 5);
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 16, pageWidth, pageHeight - 28, "F");

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(leftMargin, 22, contentWidth, 22, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(52, 211, 153);
  doc.text("CORE MODULE: NPCI National Automated Clearing House (NACH) 3D Secure Registration", leftMargin + 8, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text("Enables recurring bank auto-debits with user-specified debit days, max daily mandate caps, and instant Net Banking e-Sign.", leftMargin + 8, 39);

  autoTable(doc, {
    startY: 48,
    margin: { left: leftMargin, right: rightMargin },
    theme: "striped",
    head: [["Mandate Parameter", "Client Configuration", "NPCI Settlement Specification", "Failure Fallback Mode"]],
    body: [
      ["Sponsor Bank", "HDFC Bank Ltd (IFSC: HDFC0000128)", "Direct NPCI Gateway Router", "Retry via Secondary Bank"],
      ["Mandate Limit", "₹ 50,000 / day maximum debit ceiling", "Customer protection guard against excess debit", "Auto-Reject on Limit Breach"],
      ["SIP Frequency", "Monthly (10th of every calendar month)", "T-2 bank notification dispatched via SMS", "Next business day on holidays"],
      ["Authentication", "Net Banking 3D Secure / Debit Card OTP", "NPCI UMRN (Unique Mandate Reference Number)", "Aadhaar OTP fallback"],
      ["Status Tracking", "ACTIVE (Immediate confirmation)", "Webhook notification updates Postgres DB", "Instant email & SMS alert on bounce"]
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 9, fontStyle: "bold" },
    styles: { fontSize: 8.5, cellPadding: 2.8, textColor: [30, 41, 59] }
  });

  // SCREEN 6: DATABASE SCHEMA ARCHITECTURE
  doc.addPage();
  drawLandscapeHeader("Screen 6: PostgreSQL 16 & Drizzle Relational Database Schema Topology", 6);
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 16, pageWidth, pageHeight - 28, "F");

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(leftMargin, 22, contentWidth, 22, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(52, 211, 153);
  doc.text("CORE MODULE: Relational Architecture, Data Integrity & Foreign Key Topology", leftMargin + 8, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text("Drizzle ORM schema mapping PostgreSQL 16 tables with UUID keys, timestamps, and ACID transactional consistency.", leftMargin + 8, 39);

  autoTable(doc, {
    startY: 48,
    margin: { left: leftMargin, right: rightMargin },
    theme: "striped",
    head: [["Table Name", "Primary Key", "Foreign Key Dependencies", "Critical Attributes & Column Types"]],
    body: [
      ["users", "id (uuid)", "None (Root identity entity)", "email, phone_number, role (CLIENT, PARTNER, ADMIN), is_active"],
      ["partners", "id (uuid)", "user_id -> users(id)", "arn_number (348996), firm_name (Velocity Wealth), total_aum, commission"],
      ["clients", "id (uuid)", "user_id -> users(id), partner_id", "pan, aadhaar_last4, kyc_status, bank_account, digital_signature"],
      ["instruments", "code (varchar)", "None (AMFI Master catalog)", "name, fund_house, category, current_price (NAV), historical_data (JSONB)"],
      ["sips", "id (uuid)", "client_id -> clients, instrument_code", "amount, frequency, sip_day (1..28), status (ACTIVE, PAUSED), next_date"],
      ["mandates", "id (uuid)", "client_id -> clients", "umrn, max_amount, bank_name, status (ACTIVE), auth_mode (NET_BANKING)"],
      ["transactions", "id (uuid)", "client_id -> clients, instrument_code", "type (BUY, SELL, SIP_DEBIT), units, purchase_price, total_amount, status"]
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 9, fontStyle: "bold" },
    styles: { fontSize: 8.5, cellPadding: 2.8, textColor: [30, 41, 59] }
  });

  const outputArrayBuffer = doc.output("arraybuffer");
  return Buffer.from(outputArrayBuffer);
}

// Direct execution support
if (import.meta.url === `file://${process.argv[1]}`) {
  const buf = generateScreenshotsPdf();
  const outPath = path.resolve(process.cwd(), "FinTrackPro_Real_App_Screenshots_and_Visual_Walkthrough.pdf");
  fs.writeFileSync(outPath, buf);
  console.log(`[Screenshots PDF] Written to: ${outPath} (${buf.byteLength} bytes)`);
}
