import fs from "fs";
import path from "path";
import * as jspdfMod from "jspdf";
import * as autoTableMod from "jspdf-autotable";

const jsPDF = (jspdfMod as any).jsPDF || (jspdfMod as any).default || jspdfMod;
const autoTable = (autoTableMod as any).default || autoTableMod;

// Helper to add clean running header and footer on legal documents
function addLegalHeaderFooter(doc: any, title: string, pageNum: number, totalPages: number) {
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 14, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(52, 211, 153);
  doc.text("FINTRACKPRO LEGAL & REGULATORY REPOSITORY", margin, 9.5);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text(title, pageWidth - margin, 9.5, { align: "right" });

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("S.I.E.S College of Arts, Science and Commerce • Candidate: Parthasarathy Radhakrishnan (TCS2627061)", margin, pageHeight - 8);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: "right" });
}

// 1. SEBI RIA & AMFI Mutual Fund Advisory Regulatory Disclosure
export function generateSebiDisclosurePdf(): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Header styling
  addLegalHeaderFooter(doc, "SEBI & AMFI Regulatory Disclosure", 1, 2);

  let y = 28;

  // Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("SEBI REGISTERED ADVISORY & AMFI CODE OF CONDUCT DISCLOSURE", margin, y);

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text("REGULATORY COMPLIANCE CHARTER UNDER SEBI (INVESTMENT ADVISERS) REGULATIONS, 2013", margin, y);

  y += 5;
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  // Metadata Table
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    body: [
      ["Platform Name", "FinTrackPro (Enterprise Wealth Platform)", "AMFI ARN Identifier", "ARN-348996 (Velocity Wealth)"],
      ["Regulatory Authority", "Securities and Exchange Board of India (SEBI)", "Affiliated Body", "Association of Mutual Funds in India (AMFI)"],
      ["Academic Submitter", "PARTHASARATHY RADHAKRISHNAN (TCS2627061)", "Institution", "S.I.E.S College of Arts, Science and Commerce"],
      ["Academic Guides", "Prof. Maya Nair (Guide) & Dr. Manoj Singh (HOD)", "Submission Period", "Academic Year 2025–2026, Mumbai University"],
      ["Fiduciary Standard", "Section 15 of SEBI RIA Regulations (Fiduciary Duty)", "Commission Structure", "0% Direct Plan Zero-Brokerage Architecture"]
    ]
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // Sections
  const sections = [
    {
      title: "1. Fiduciary Duty & Independence of Advisory Engine",
      body: "FinTrackPro functions strictly as an execution, aggregation, and analytical platform. All mutual fund data ingested via the automated MFAPI.in synchronization pipeline adheres to AMFI standards. Under SEBI (Investment Advisers) Regulations, 2013, the platform separates direct execution and advisory workflows, ensuring investors receive unconflicted, transparent portfolio analytics."
    },
    {
      title: "2. Commission & Expense Ratio Disclosure (Direct vs Regular Plans)",
      body: "In accordance with SEBI Circular SEBI/HO/IMD/DF2/CIR/P/2018/137, FinTrackPro explicitly surfaces the Total Expense Ratio (TER) differential between Direct and Regular mutual fund schemes. Investors are notified that investing in Direct Plans bypasses distributor trailing commissions, yielding compounded savings of 0.5% to 1.5% per annum over investment horizons."
    },
    {
      title: "3. NAV Synchronization & Valuation Timelines",
      body: "Net Asset Values (NAVs) are published by Asset Management Companies (AMCs) and processed daily at 11:15 PM IST via FinTrackPro's automated batch synchronization engine. Historical valuations, CAGR computations, and Newton-Raphson XIRR calculations are derived from verified AMFI published data feeds with zero manual tampering."
    },
    {
      title: "4. Risk Profiling & Asset Allocation Suitability",
      body: "Before processing any mutual fund transaction or recurring SIP order, the system mandates a 5-dimension risk questionnaire evaluating investment horizon, loss tolerance, liquidity needs, and financial goals, adhering to SEBI circular CIR/MIRSD/66/2016."
    }
  ];

  sections.forEach((sec) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(sec.title, margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const splitText = doc.splitTextToSize(sec.body, contentWidth);
    doc.text(splitText, margin, y);
    y += splitText.length * 4.2 + 5;
  });

  // PAGE 2
  doc.addPage();
  addLegalHeaderFooter(doc, "SEBI & AMFI Regulatory Disclosure", 2, 2);
  y = 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("5. Grievance Redressal & Regulatory Escalation Matrix", margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    body: [
      ["Level 1 (Platform Compliance)", "FinTrackPro Internal Grievance Desk", "compliance@fintrackpro.in", "T+1 Business Day"],
      ["Level 2 (Principal Officer)", "Velocity Wealth Compliance Officer", "officer@velocitywealth.in", "T+3 Business Days"],
      ["Level 3 (SEBI SCORES Portal)", "SEBI Complaints Redress System", "scores.sebi.gov.in / Toll-Free 1800 22 7575", "Statutory Timeline"]
    ]
  });

  y = (doc as any).lastAutoTable.finalY + 12;

  // Attestation & Signatures Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 70, 3, 3, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 70, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("OFFICIAL ATTESTATION & COMPLIANCE SIGN-OFF", margin + 6, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("This document certifies full adherence to SEBI regulations for the FinTrackPro academic project.", margin + 6, y + 14);

  // Signatures columns
  const colW = (contentWidth - 12) / 3;
  const sigY = y + 42;

  // Candidate
  doc.line(margin + 6, sigY, margin + 6 + colW - 6, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Parthasarathy Radhakrishnan", margin + 6, sigY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Candidate • Roll: TCS2627061", margin + 6, sigY + 8);
  doc.text("S.I.E.S College of ASC", margin + 6, sigY + 12);

  // Project Guide
  doc.line(margin + 6 + colW, sigY, margin + 6 + colW * 2 - 6, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Prof. Maya Nair", margin + 6 + colW, sigY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Project Guide & Faculty", margin + 6 + colW, sigY + 8);
  doc.text("Dept. of Computer Science", margin + 6 + colW, sigY + 12);

  // Head of Dept
  doc.line(margin + 6 + colW * 2, sigY, margin + 6 + colW * 3 - 6, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Dr. Manoj Singh", margin + 6 + colW * 2, sigY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Head of the Department", margin + 6 + colW * 2, sigY + 8);
  doc.text("S.I.E.S College, Mumbai", margin + 6 + colW * 2, sigY + 12);

  return Buffer.from(doc.output("arraybuffer"));
}

// 2. RBI & NPCI E-Mandate / NACH Auto-Debit Legal Mandate Form
export function generateEmandateAgreementPdf(): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  addLegalHeaderFooter(doc, "RBI & NPCI E-Mandate Authorization", 1, 2);

  let y = 28;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("NPCI NACH E-MANDATE LEGAL AGREEMENT & AUTHORIZATION", margin, y);

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text("ELECTRONIC STANDING INSTRUCTION IN ACCORDANCE WITH RBI CIRCULAR DPSS.CO.OD.NO.1328", margin, y);

  y += 5;
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  // Metadata Table
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    body: [
      ["Sponsor Bank / Settlement Agency", "HDFC Bank Ltd. / ICICI Bank Ltd.", "Clearing House", "National Payments Corporation of India (NPCI)"],
      ["Mandate Scheme Type", "Monthly Recurring Systematic Investment Plan (SIP)", "E-Mandate Protocol", "NPCI NACH 3.2 (API Based NetBanking / Debit Card)"],
      ["Permissible Maximum Debit Limit", "₹1,00,000 per transaction per day", "Debit Frequency", "Monthly (Selected SIP Date e.g., 5th / 10th / 15th)"],
      ["Software Platform", "FinTrackPro Automated Wealth Engine", "Candidate / Developer", "Parthasarathy Radhakrishnan (TCS2627061)"],
      ["Institution", "S.I.E.S College of Arts, Science and Commerce", "Supervisors", "Prof. Maya Nair & Dr. Manoj Singh"]
    ]
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  const clauses = [
    {
      title: "1. Scope of Authorization & Bank Debits",
      text: "The investor authorizes FinTrackPro and the designated Asset Management Companies (AMCs) through the NPCI NACH network to periodically debit the registered bank account for the exact monthly SIP installment amount approved during scheme allocation."
    },
    {
      title: "2. Pre-Debit Notification (RBI 24-Hour Mandate)",
      text: "Strictly adhering to Reserve Bank of India circular RBI/2019-20/54 on processing e-mandates, an automated SMS and Email pre-debit advisory is dispatched to the registered investor at least 24 hours prior to the actual settlement trigger date."
    },
    {
      title: "3. Maximum Cap Limit & Security Containment",
      text: "Every individual mandate record stored in FinTrackPro's PostgreSQL relational database contains a cryptographic hash and a hard cap ceiling of ₹1,00,000. Under no circumstances can any automated batch job trigger debits exceeding this threshold."
    },
    {
      title: "4. Revocation & Pause Facility",
      text: "In compliance with consumer financial protection directives, the investor holds unconstrained authority to pause, cancel, or modify the recurring mandate at any time directly through the FinTrackPro Client Portal with zero exit fees."
    }
  ];

  clauses.forEach((c) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(c.title, margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const split = doc.splitTextToSize(c.text, contentWidth);
    doc.text(split, margin, y);
    y += split.length * 4.2 + 5;
  });

  // PAGE 2
  doc.addPage();
  addLegalHeaderFooter(doc, "RBI & NPCI E-Mandate Authorization", 2, 2);
  y = 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("5. Bank Verification & Customer Authentication Protocol", margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    body: [
      ["Authentication Method", "Net Banking 2FA / Debit Card OTP (Bank Hosted ACS Page)", "Security Rating", "Level 4 Highest"],
      ["UMRN Generation", "Unique Mandate Reference Number generated by NPCI upon validation", "Format", "UMRN4000000000000000"],
      ["Settlement Lifecycle", "T+1 Business Day settlement via Indian Clearing Corporation Ltd (ICCL)", "AMFI Verification", "Verified"]
    ]
  });

  y = (doc as any).lastAutoTable.finalY + 12;

  // Sign-off
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 70, 3, 3, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 70, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("MANDATE VALIDATION & INSTITUTIONAL SIGN-OFF", margin + 6, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("Approved for FinTrackPro Academic Capstone Project, University of Mumbai.", margin + 6, y + 14);

  const colW = (contentWidth - 12) / 3;
  const sigY = y + 42;

  doc.line(margin + 6, sigY, margin + 6 + colW - 6, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Parthasarathy Radhakrishnan", margin + 6, sigY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Candidate • TCS2627061", margin + 6, sigY + 8);

  doc.line(margin + 6 + colW, sigY, margin + 6 + colW * 2 - 6, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Prof. Maya Nair", margin + 6 + colW, sigY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Project Guide", margin + 6 + colW, sigY + 8);

  doc.line(margin + 6 + colW * 2, sigY, margin + 6 + colW * 3 - 6, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Dr. Manoj Singh", margin + 6 + colW * 2, sigY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Head of Department", margin + 6 + colW * 2, sigY + 8);

  return Buffer.from(doc.output("arraybuffer"));
}

// 3. DPDP Act 2023 Data Privacy & Consent Charter
export function generateDpdpConsentPdf(): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  addLegalHeaderFooter(doc, "DPDP Act 2023 Data Privacy Charter", 1, 2);

  let y = 28;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("DIGITAL PERSONAL DATA PROTECTION (DPDP) ACT 2023 CHARTER", margin, y);

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text("DATA FIDUCIARY COMPLIANCE POLICY FOR FINANCIAL INVESTOR DATA & SIGNATURE BIOMETRICS", margin, y);

  y += 5;
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    body: [
      ["Governing Legislation", "Digital Personal Data Protection Act, 2023 (No. 22 of 2023)", "Jurisdiction", "Republic of India"],
      ["Data Fiduciary", "FinTrackPro Wealth Management Platform", "Data Processor", "Google Cloud Asia-South1 (Mumbai Datacenter)"],
      ["Candidate Developer", "PARTHASARATHY RADHAKRISHNAN (TCS2627061)", "Institution", "S.I.E.S College of Arts, Science and Commerce"],
      ["Encryption Standard", "AES-256 at rest • TLS 1.3 in transit", "Masking Level", "Aadhaar First 8 Digits Masked (UIDAI Compliant)"]
    ]
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  const principles = [
    {
      title: "1. Purpose Limitation & Data Minimization",
      text: "Investor personal data, including Permanent Account Numbers (PAN), Bank Account Numbers, and IFSC codes, is processed exclusively for verifying KYC eligibility, NAV portfolio valuation, and submitting authorized investment orders to registered AMCs."
    },
    {
      title: "2. Vector Digital Signature Storage Protection",
      text: "Signatures captured on the HTML5 Vector Signature Canvas are converted into encrypted SVG paths and stored in isolated cloud buckets. They are never rendered unmasked to unauthorized operators or third-party marketing entities."
    },
    {
      title: "3. Zero-On-Screen OTP & Ephemeral Credentials",
      text: "To protect client identity, mobile authentication codes are strictly ephemeral (valid 5 minutes), stored in memory and hashed in PostgreSQL, and never echoed back to client browser inspect terminals or public logs."
    },
    {
      title: "4. Data Principal Rights (Right to Correction & Erasure)",
      text: "Under Sections 11 and 12 of the DPDP Act 2023, data principals (investors and partners) have the right to request access to personal data, request correction of inaccurate records, and request withdrawal of consent with full audit logging."
    }
  ];

  principles.forEach((p) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(p.title, margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const split = doc.splitTextToSize(p.text, contentWidth);
    doc.text(split, margin, y);
    y += split.length * 4.2 + 5;
  });

  // PAGE 2
  doc.addPage();
  addLegalHeaderFooter(doc, "DPDP Act 2023 Data Privacy Charter", 2, 2);
  y = 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("5. Data Protection Officer (DPO) Contact & Compliance Affirmation", margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    body: [
      ["Designated Data Protection Officer", "Grievance & Privacy Desk, FinTrackPro", "dpo@fintrackpro.in", "Mumbai, Maharashtra"],
      ["Data Retention Period", "7 Years from account deactivation as mandated by PMLA & SEBI rules", "Storage Region", "India Sovereign Cloud"],
      ["Breach Notification Window", "Within 72 hours to Data Protection Board of India and impacted users", "Status", "Fully Enforced"]
    ]
  });

  y = (doc as any).lastAutoTable.finalY + 12;

  // Attestation box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 70, 3, 3, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 70, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("DATA FIDUCIARY LEGAL SIGN-OFF & ATTESTATION", margin + 6, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("Attested for FinTrackPro Project at S.I.E.S College of Arts, Science and Commerce.", margin + 6, y + 14);

  const colW = (contentWidth - 12) / 3;
  const sigY = y + 42;

  doc.line(margin + 6, sigY, margin + 6 + colW - 6, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Parthasarathy Radhakrishnan", margin + 6, sigY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Candidate • Roll: TCS2627061", margin + 6, sigY + 8);

  doc.line(margin + 6 + colW, sigY, margin + 6 + colW * 2 - 6, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Prof. Maya Nair", margin + 6 + colW, sigY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Project Guide", margin + 6 + colW, sigY + 8);

  doc.line(margin + 6 + colW * 2, sigY, margin + 6 + colW * 3 - 6, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Dr. Manoj Singh", margin + 6 + colW * 2, sigY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Head of Department", margin + 6 + colW * 2, sigY + 8);

  return Buffer.from(doc.output("arraybuffer"));
}

// Generate all legal PDFs to disk
export function generateAllLegalPdfsToDisk() {
  const sebi = generateSebiDisclosurePdf();
  fs.writeFileSync(path.resolve(process.cwd(), "FinTrackPro_SEBI_Advisory_Regulatory_Disclosure.pdf"), sebi);

  const emandate = generateEmandateAgreementPdf();
  fs.writeFileSync(path.resolve(process.cwd(), "FinTrackPro_RBI_NPCI_EMandate_Agreement.pdf"), emandate);

  const dpdp = generateDpdpConsentPdf();
  fs.writeFileSync(path.resolve(process.cwd(), "FinTrackPro_DPDP_Act_2023_Data_Privacy_Charter.pdf"), dpdp);

  console.log("Successfully generated all 3 legal documents!");
}
