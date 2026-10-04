import { BlackBookContext, autoTable, startNewPage, drawParagraph } from "./helpers.js";

export function generatePreliminaryPages(ctx: BlackBookContext) {
  const { doc, pageWidth, pageHeight, leftMargin, rightMargin, contentWidth, blackCoverBg, goldPrimary, goldSecondary, textDark, borderLight } = ctx;

  // ============================================================
  // PAGE 1: MUMBAI UNIVERSITY BLACK BOOK OUTER COVER (Gold on Black)
  // ============================================================
  doc.setFillColor(blackCoverBg[0], blackCoverBg[1], blackCoverBg[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Double Embossed Golden Border
  doc.setDrawColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.setLineWidth(1.2);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
  doc.setLineWidth(0.4);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.text("UNIVERSITY OF MUMBAI", pageWidth / 2, 24, { align: "center" });

  doc.setFontSize(9.5);
  doc.setTextColor(240, 240, 240);
  doc.text("PROJECT REPORT SUBMITTED TO THE DEPARTMENT OF COMPUTER SCIENCE", pageWidth / 2, 31, { align: "center" });

  doc.setFontSize(10.5);
  doc.setTextColor(goldSecondary[0], goldSecondary[1], goldSecondary[2]);
  doc.text("S.I.E.S College of Arts, Science and Commerce, Sion(W), Mumbai – 400 022", pageWidth / 2, 38, { align: "center" });

  // University Emblem
  doc.setDrawColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.setLineWidth(0.6);
  doc.circle(pageWidth / 2, 53, 9, "S");
  doc.setFont("times", "bold");
  doc.setFontSize(8.5);
  doc.text("SIES", pageWidth / 2, 54.5, { align: "center" });
  doc.setFontSize(6);
  doc.text("ESTD 1960", pageWidth / 2, 58.5, { align: "center" });

  // Project Title
  doc.setFont("times", "bold");
  doc.setFontSize(19);
  doc.setTextColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.text("FinTrackPro", pageWidth / 2, 75, { align: "center" });

  doc.setFontSize(10.5);
  doc.setTextColor(245, 245, 245);
  const subTitleLines = doc.splitTextToSize(
    "An Enterprise Wealth Management, Multi-Asset Mutual Fund Advisory & NACH Mandate Execution Platform",
    contentWidth - 10
  );
  doc.text(subTitleLines, pageWidth / 2, 84, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(180, 190, 205);
  doc.text("For the Partial Fulfilment for the Degree of", pageWidth / 2, 104, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(goldSecondary[0], goldSecondary[1], goldSecondary[2]);
  doc.text("Bachelor of Science (Computer Science) 2025–2026", pageWidth / 2, 112, { align: "center" });

  // Candidate Details Card
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(leftMargin + 5, 126, contentWidth - 10, 68, 2, 2, "F");
  doc.setDrawColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(leftMargin + 5, 126, contentWidth - 10, 68, 2, 2, "S");

  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.setTextColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.text("SUBMISSION CREDENTIALS", pageWidth / 2, 134, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(240, 240, 240);
  doc.text("SUBMITTED BY:", leftMargin + 12, 144);
  doc.setFont("times", "bold");
  doc.text("PARTHASARATHY RADHAKRISHNAN", leftMargin + 60, 144);

  doc.setFont("times", "normal");
  doc.text("Roll Number:", leftMargin + 12, 152);
  doc.setFont("times", "bold");
  doc.text("TCS2627061", leftMargin + 60, 152);

  doc.setFont("times", "normal");
  doc.text("Project Guide:", leftMargin + 12, 160);
  doc.setFont("times", "bold");
  doc.text("Prof. Maya Nair", leftMargin + 60, 160);

  doc.setFont("times", "normal");
  doc.text("Head of Department:", leftMargin + 12, 168);
  doc.setFont("times", "bold");
  doc.text("Dr. Manoj Singh", leftMargin + 60, 168);

  doc.setFont("times", "normal");
  doc.text("Academic Year:", leftMargin + 12, 176);
  doc.text("2025 – 2026", leftMargin + 60, 176);

  doc.text("Industry Mentor:", leftMargin + 12, 184);
  doc.text("Velocity Wealth Advisory (ARN: 348996)", leftMargin + 60, 184);

  doc.setFont("times", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.text("DEPARTMENT OF COMPUTER SCIENCE", pageWidth / 2, 255, { align: "center" });
  doc.setFontSize(9.5);
  doc.setTextColor(245, 245, 245);
  doc.text("S.I.E.S College of Arts, Science and Commerce, Sion(W), Mumbai – 400 022", pageWidth / 2, 262, { align: "center" });
  doc.text("AFFILIATED TO UNIVERSITY OF MUMBAI — ACADEMIC YEAR 2025–2026", pageWidth / 2, 269, { align: "center" });

  // ============================================================
  // PAGE 2: INNER WHITE TITLE PAGE
  // ============================================================
  doc.addPage();
  ctx.curY = 22;
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.setLineWidth(0.4);
  doc.rect(leftMargin - 5, 12, contentWidth + 10, pageHeight - 24);

  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text("S.I.E.S College of Arts, Science and Commerce", pageWidth / 2, 22, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text("Sion(W), Mumbai – 400 022", pageWidth / 2, 28, { align: "center" });
  doc.text("(Affiliated to University of Mumbai)", pageWidth / 2, 34, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(17);
  doc.text("FinTrackPro", pageWidth / 2, 48, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text("An Enterprise Wealth Management, Mutual Fund Advisory & Mandate Execution System", pageWidth / 2, 56, { align: "center" });

  doc.setFontSize(9.5);
  doc.text("PROJECT REPORT SUBMITTED TO THE DEPARTMENT OF COMPUTER SCIENCE", pageWidth / 2, 78, { align: "center" });
  doc.text("For the Partial Fulfilment for the Degree of", pageWidth / 2, 85, { align: "center" });
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text("Bachelor of Science (Computer Science) 2025–2026", pageWidth / 2, 93, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.text("SUBMITTED BY:", pageWidth / 2, 114, { align: "center" });
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("PARTHASARATHY RADHAKRISHNAN", pageWidth / 2, 123, { align: "center" });
  doc.setFontSize(10);
  doc.text("Roll No: TCS2627061", pageWidth / 2, 130, { align: "center" });

  // Guide and HOD Card
  const boxY = 152;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(leftMargin + 5, boxY, contentWidth - 10, 48, 2, 2, "F");
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(leftMargin + 5, boxY, contentWidth - 10, 48, 2, 2, "S");

  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("PROJECT GUIDE", leftMargin + 25, boxY + 14, { align: "center" });
  doc.text("HEAD OF DEPARTMENT", pageWidth - rightMargin - 25, boxY + 14, { align: "center" });

  doc.setFontSize(11);
  doc.text("Prof. Maya Nair", leftMargin + 25, boxY + 24, { align: "center" });
  doc.text("Dr. Manoj Singh", pageWidth - rightMargin - 25, boxY + 24, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.text("Assistant Professor", leftMargin + 25, boxY + 32, { align: "center" });
  doc.text("Department of Computer Science", leftMargin + 25, boxY + 38, { align: "center" });
  doc.text("Head of Department", pageWidth - rightMargin - 25, boxY + 32, { align: "center" });
  doc.text("Department of Computer Science", pageWidth - rightMargin - 25, boxY + 38, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("DEPARTMENT OF COMPUTER SCIENCE", pageWidth / 2, 240, { align: "center" });
  doc.setFont("times", "normal");
  doc.setFontSize(9.5);
  doc.text("S.I.E.S College of Arts, Science and Commerce, Sion(W), Mumbai – 400 022", pageWidth / 2, 248, { align: "center" });
  doc.text("ACADEMIC YEAR 2025–2026", pageWidth / 2, 255, { align: "center" });

  // ============================================================
  // PAGE 3: CERTIFICATE (SIES College Exact Format)
  // ============================================================
  startNewPage(ctx, "Institutional Certificate", "iii");
  ctx.curY = 22;
  doc.setFont("times", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text("S.I.E.S College of Arts, Science and Commerce", pageWidth / 2, ctx.curY, { align: "center" });
  ctx.curY += 6;
  doc.setFontSize(10.5);
  doc.text("Sion(W), Mumbai – 400 022.", pageWidth / 2, ctx.curY, { align: "center" });
  ctx.curY += 12;

  doc.setFontSize(15);
  doc.text("CERTIFICATE", pageWidth / 2, ctx.curY, { align: "center" });
  doc.setLineWidth(0.6);
  doc.line(pageWidth / 2 - 25, ctx.curY + 2, pageWidth / 2 + 25, ctx.curY + 2);
  ctx.curY += 18;

  doc.setFont("times", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  const certText1 = "This is to certify that Mr. Parthasarathy Radhakrishnan Roll No TCS2627061 has successfully completed the project work entitled FinTrackPro as the partial fulfilment of Bachelor of Science (Computer Science) during the academic year 2025- 2026 Complying with the requirements of University of Mumbai.";
  const certLines1 = doc.splitTextToSize(certText1, contentWidth);
  doc.text(certLines1, leftMargin, ctx.curY);
  ctx.curY += certLines1.length * 5.5 + 40;

  // Signatures
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("Project Guide", leftMargin + 20, ctx.curY, { align: "center" });
  doc.text("Head of the Department", pageWidth - rightMargin - 30, ctx.curY, { align: "center" });
  ctx.curY += 14;
  doc.text("Prof. MAYA NAIR", leftMargin + 20, ctx.curY, { align: "center" });
  doc.text("DR. MANOJ SINGH", pageWidth - rightMargin - 30, ctx.curY, { align: "center" });
  ctx.curY += 32;

  doc.setFont("times", "normal");
  doc.setFontSize(9.5);
  doc.text("Examination Date: ___________________", leftMargin, ctx.curY);
  ctx.curY += 10;
  doc.text("Examiner's Signature: ________________", leftMargin, ctx.curY);
  ctx.curY += 16;
  doc.setFont("times", "bold");
  doc.text("College Seal & Date", leftMargin, ctx.curY);

  // ============================================================
  // PAGE 4: DECLARATION (SIES College Exact Format)
  // ============================================================
  startNewPage(ctx, "Candidate Declaration", "iv");
  ctx.curY = 24;
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("DECLARATION", pageWidth / 2, ctx.curY, { align: "center" });
  doc.line(pageWidth / 2 - 25, ctx.curY + 2, pageWidth / 2 + 25, ctx.curY + 2);
  ctx.curY += 16;

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);

  const declP1 = "I, Parthasarathy Radhakrishnan, a student of Bachelor of Science in Computer Science (B.Sc. CS) at S.I.E.S College of Arts, Science and Commerce, hereby declare that the project entitled \"FinTrackPro – Enterprise Wealth Management & Mutual Fund Advisory Platform\" has been carried out by me under the guidance of Prof. Maya Nair, in partial fulfillment of the requirements for the award of the degree of Bachelor of Science in Computer Science under University of Mumbai.";
  const declP1Lines = doc.splitTextToSize(declP1, contentWidth);
  doc.text(declP1Lines, leftMargin, ctx.curY);
  ctx.curY += declP1Lines.length * 5.2 + 8;

  const declP2 = "I further declare that this project is the result of my own independent work and has not been submitted previously, in part or full, for the award of any degree, diploma, or similar title at this or any other institution.";
  const declP2Lines = doc.splitTextToSize(declP2, contentWidth);
  doc.text(declP2Lines, leftMargin, ctx.curY);
  ctx.curY += declP2Lines.length * 5.2 + 8;

  const declP3 = "All the information, data, and content presented in this project are genuine to the best of my knowledge and belief.";
  const declP3Lines = doc.splitTextToSize(declP3, contentWidth);
  doc.text(declP3Lines, leftMargin, ctx.curY);
  ctx.curY += declP3Lines.length * 5.2 + 45;

  doc.setFont("times", "normal");
  doc.text("Place: Mumbai, India", leftMargin, ctx.curY);
  doc.text("Date: September 2026", leftMargin, ctx.curY + 6);

  doc.setFont("times", "bold");
  doc.text("_______________________________", pageWidth - rightMargin - 60, ctx.curY);
  doc.text("Parthasarathy Radhakrishnan", pageWidth - rightMargin - 60, ctx.curY + 6);
  doc.setFont("times", "normal");
  doc.text("Roll No: TCS2627061", pageWidth - rightMargin - 60, ctx.curY + 12);
  doc.text("Candidate Signature", pageWidth - rightMargin - 60, ctx.curY + 18);

  // ============================================================
  // PAGE 5: ACKNOWLEDGEMENT (SIES College Exact Format)
  // ============================================================
  startNewPage(ctx, "Acknowledgements", "v");
  ctx.curY = 24;
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("ACKNOWLEDGEMENT", pageWidth / 2, ctx.curY, { align: "center" });
  doc.line(pageWidth / 2 - 25, ctx.curY + 2, pageWidth / 2 + 25, ctx.curY + 2);
  ctx.curY += 16;

  const ackP1 = "I would like to express my sincere gratitude to Prof. Maya Nair my project guide, for their valuable guidance, constant support, and encouragement throughout the development of my project titled \"FinTrackPro – Enterprise Wealth Management & Mutual Fund Advisory Platform.\"";
  const ackP1Lines = doc.splitTextToSize(ackP1, contentWidth);
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.text(ackP1Lines, leftMargin, ctx.curY);
  ctx.curY += ackP1Lines.length * 5.2 + 8;

  const ackP2 = "Their insights and feedback were crucial in shaping this project and helping me overcome challenges during its implementation.";
  const ackP2Lines = doc.splitTextToSize(ackP2, contentWidth);
  doc.text(ackP2Lines, leftMargin, ctx.curY);
  ctx.curY += ackP2Lines.length * 5.2 + 8;

  const ackP3 = "I am also thankful to Dr. Manoj Singh, Head of the Department of Computer Science, for providing the necessary facilities and support to carry out this project successfully.";
  const ackP3Lines = doc.splitTextToSize(ackP3, contentWidth);
  doc.text(ackP3Lines, leftMargin, ctx.curY);
  ctx.curY += ackP3Lines.length * 5.2 + 8;

  const ackP4 = "My heartfelt thanks to all the faculty members of the Computer Science Department for their continuous help and motivation.";
  const ackP4Lines = doc.splitTextToSize(ackP4, contentWidth);
  doc.text(ackP4Lines, leftMargin, ctx.curY);
  ctx.curY += ackP4Lines.length * 5.2 + 8;

  const ackP5 = "I would also like to extend my gratitude to my family and friends for their understanding, inspiration, and constant encouragement during the entire duration of this project.";
  const ackP5Lines = doc.splitTextToSize(ackP5, contentWidth);
  doc.text(ackP5Lines, leftMargin, ctx.curY);
  ctx.curY += ackP5Lines.length * 5.2 + 28;

  doc.setFont("times", "bold");
  doc.text("_______________________________", pageWidth - rightMargin - 60, ctx.curY);
  doc.text("Parthasarathy Radhakrishnan", pageWidth - rightMargin - 60, ctx.curY + 6);
  doc.setFont("times", "normal");
  doc.text("Roll No: TCS2627061", pageWidth - rightMargin - 60, ctx.curY + 12);
  doc.text("B.Sc. (Computer Science), S.I.E.S College", pageWidth - rightMargin - 60, ctx.curY + 18);

  // ============================================================
  // PAGE 6: ABSTRACT / EXECUTIVE SUMMARY
  // ============================================================
  startNewPage(ctx, "Executive Abstract", "vi");
  ctx.curY = 25;
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("ABSTRACT", pageWidth / 2, ctx.curY, { align: "center" });
  doc.line(pageWidth / 2 - 15, ctx.curY + 2, pageWidth / 2 + 15, ctx.curY + 2);
  ctx.curY += 14;

  const absParagraphs = [
    "Over the past decade, retail mutual fund investing in India has grown significantly, with total industry Assets Under Management (AUM) crossing ₹50 lakh crore (approximately $600 billion USD). Despite this massive expansion, retail investors and independent financial advisors (IFAs) continue to face practical hurdles: fragmented portfolio tracking across more than 40 separate Asset Management Companies (AMCs); mathematically inaccurate return figures caused by applying simple CAGR to recurring monthly SIPs; manual onboarding bottlenecks; and widespread web security flaws where One-Time Passwords (OTPs) are inadvertently exposed on client screens or in browser network payloads.",
    "To address these challenges, this capstone project dissertation submitted by Parthasarathy Radhakrishnan (Roll No: TCS2627061) to the Department of Computer Science at S.I.E.S College of Arts, Science and Commerce, affiliated with the University of Mumbai, under the guidance of Prof. Maya Nair and Head of Department Dr. Manoj Singh, presents FinTrackPro — a modern, cloud-native wealth management and mutual fund advisory platform.",
    "Built using a clean 4-tier architecture comprising React 19, TypeScript, Tailwind CSS, Node.js, Express, Drizzle ORM, and PostgreSQL Cloud SQL, the system delivers: (1) An automated daily AMFI NAV synchronization pipeline ingesting official NAV feeds across 44,000+ schemes with in-flight deduplication; (2) A sub-50ms Extended Internal Rate of Return (XIRR) solver implementing the Newton-Raphson numerical algorithm for irregular cashflows; (3) A Zero-On-Screen OTP security architecture where 6-digit tokens are salted and hashed using PBKDF2 (SHA-256) and dispatched strictly through cellular SMS gateways, ensuring zero credential leakage; and (4) An integrated partner portal for AMFI-registered distributors (such as Velocity Wealth, ARN 348996) providing digital KYC verification, digital signature capture, NPCI NACH e-mandate setup, and client billing PDF generation via jsPDF.",
    "Empirical load testing confirms that FinTrackPro sustains over 1,200 req/sec under concurrent traffic with mean database query latencies below 30ms and 100% compliance with SEBI and RBI security guidelines.",
    "Keywords: Mutual Funds, AMFI NAV, XIRR Engine, Newton-Raphson Solver, Zero-On-Screen OTP, SIES College, B.Sc. Computer Science, SEBI Compliance, NACH E-Mandate, PostgreSQL, React 19."
  ];

  absParagraphs.forEach((p) => {
    const s = doc.splitTextToSize(p, contentWidth);
    doc.setFont("times", "normal");
    doc.setFontSize(9.5);
    doc.text(s, leftMargin, ctx.curY);
    ctx.curY += s.length * 4.8 + 4;
  });

  // ============================================================
  // PAGE 7: LIST OF ABBREVIATIONS / ACRONYMS
  // ============================================================
  startNewPage(ctx, "List of Abbreviations", "vii");
  ctx.curY = 25;
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("LIST OF ABBREVIATIONS & ACRONYMS", pageWidth / 2, ctx.curY, { align: "center" });
  doc.line(pageWidth / 2 - 40, ctx.curY + 2, pageWidth / 2 + 40, ctx.curY + 2);
  ctx.curY += 10;

  const abbrevList = [
    ["AAUM", "Average Assets Under Management"],
    ["AMC", "Asset Management Company"],
    ["AMFI", "Association of Mutual Funds in India"],
    ["API", "Application Programming Interface"],
    ["ARN", "AMFI Registration Number (Distributor License)"],
    ["BSE", "Bombay Stock Exchange"],
    ["CAGR", "Compound Annual Growth Rate"],
    ["DFD", "Data Flow Diagram"],
    ["DPDP", "Digital Personal Data Protection Act (2023)"],
    ["ERD", "Entity-Relationship Diagram"],
    ["IFA", "Independent Financial Advisor"],
    ["JWT", "JSON Web Token"],
    ["KYC", "Know Your Customer"],
    ["MFA", "Multi-Factor Authentication"],
    ["NACH", "National Automated Clearing House"],
    ["NAV", "Net Asset Value"],
    ["NPCI", "National Payments Corporation of India"],
    ["NSE", "National Stock Exchange"],
    ["ORM", "Object-Relational Mapping (Drizzle)"],
    ["OTP", "One-Time Password"],
    ["PBKDF2", "Password-Based Key Derivation Function 2"],
    ["RBAC", "Role-Based Access Control"],
    ["RBI", "Reserve Bank of India"],
    ["REST", "Representational State Transfer"],
    ["SEBI", "Securities and Exchange Board of India"],
    ["SIP", "Systematic Investment Plan"],
    ["SPA", "Single Page Application"],
    ["SQL", "Structured Query Language"],
    ["TLS", "Transport Layer Security"],
    ["UML", "Unified Modeling Language"],
    ["XIRR", "Extended Internal Rate of Return"]
  ];

  autoTable(doc, {
    startY: ctx.curY,
    margin: { left: leftMargin, right: rightMargin },
    theme: "striped",
    head: [["Acronym", "Full Expansion & Operational Meaning"]],
    body: abbrevList,
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8.5, fontStyle: "bold" },
    styles: { fontSize: 8, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: { 0: { cellWidth: 32, fontStyle: "bold" }, 1: { cellWidth: 138 } }
  });

  // ============================================================
  // PAGE 8: LIST OF FIGURES
  // ============================================================
  startNewPage(ctx, "List of Figures", "viii");
  ctx.curY = 25;
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("LIST OF FIGURES & ARCHITECTURAL DIAGRAMS", pageWidth / 2, ctx.curY, { align: "center" });
  doc.line(pageWidth / 2 - 45, ctx.curY + 2, pageWidth / 2 + 45, ctx.curY + 2);
  ctx.curY += 10;

  const figuresList = [
    ["Figure 4.1", "FinTrackPro 4-Tier Distributed Enterprise System Architecture", "Page 24"],
    ["Figure 4.2", "System Use Case Diagram (Investor, Advisor, Super-Admin)", "Page 25"],
    ["Figure 4.3", "Sequence Diagram for 3D Secure / NACH Mandate Execution", "Page 27"],
    ["Figure 4.4", "Entity-Relationship (ER) Normalized Relational Schema Diagram", "Page 28"],
    ["Figure 4.5", "Data Flow Diagram — Level 0 (Context Level DFD)", "Page 30"],
    ["Figure 4.6", "Data Flow Diagram — Level 1 (Sub-system Functional Decomposition)", "Page 31"],
    ["Figure 4.7", "Data Flow Diagram — Level 2 (SIP Order Processing & NAV Reconciliation)", "Page 32"],
    ["Figure 4.8", "Activity Diagram for Client KYC Verification & Onboarding", "Page 33"],
    ["Figure 4.9", "Collaboration / Communication Diagram for Advisor Portfolio Rebalance", "Page 34"],
    ["Figure 4.10", "Component Diagram: Microservices & External Cloud Gateways", "Page 35"],
    ["Figure 4.11", "Class Diagram: Object-Oriented Domain Entities & ORM Mapping", "Page 36"],
    ["Figure 4.12", "State Machine Diagram for Recurring SIP Mandate Lifecycle", "Page 37"],
    ["Figure 4.13", "Deployment Diagram: Cloud Run Container & Cloud SQL Topology", "Page 38"],
    ["Figure 4.14", "Package Diagram: Modular System Architecture Organization", "Page 38"],
    ["Figure 5.1", "Website UI Walkthrough: Public Landing Portal & Asset Aggregator", "Page 44"],
    ["Figure 5.2", "Website UI Walkthrough: Mutual Fund Screener & Scheme Catalog", "Page 44"],
    ["Figure 5.3", "Website UI Walkthrough: Scheme Deep Dive with Live NAV Growth Graph", "Page 45"],
    ["Figure 5.4", "Website UI Walkthrough: Interactive SIP Compounding & Goal Calculator", "Page 45"],
    ["Figure 5.5", "Website UI Walkthrough: Client Portfolio Valuation & Asset Allocation", "Page 46"],
    ["Figure 5.6", "Website UI Walkthrough: 6-Box Segmented Telephony OTP Security Modal", "Page 46"],
    ["Figure 5.7", "Website UI Walkthrough: Client KYC Verification & Document Upload Desk", "Page 47"],
    ["Figure 5.8", "Website UI Walkthrough: Partner / Advisor Management Portal & Client AUM", "Page 47"],
    ["Figure 5.9", "Website UI Walkthrough: Portfolio Rebalancing & Allocation Advisory Desk", "Page 48"],
    ["Figure 5.10", "Website UI Walkthrough: Client Statement & High-Fidelity PDF Generator", "Page 48"],
    ["Figure 5.11", "Website UI Walkthrough: System Admin MFAPI Synchronization Controller", "Page 49"],
    ["Figure 6.1", "Benchmark Graph: API Response Latency vs Concurrent Connections (100–1000)", "Page 52"],
    ["Figure 6.2", "Convergence Graph: Newton-Raphson XIRR Convergence Rate across Batches", "Page 52"],
    ["Figure 6.3", "Performance Chart: PostgreSQL Connection Pooling & Indexing Latency Gains", "Page 53"],
  ];

  autoTable(doc, {
    startY: ctx.curY,
    margin: { left: leftMargin, right: rightMargin },
    theme: "striped",
    head: [["Figure No.", "Title & Description of Diagram / Screenshot", "Page"]],
    body: figuresList,
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8, fontStyle: "bold" },
    styles: { fontSize: 7.5, cellPadding: 1.8, textColor: [30, 41, 59] },
    columnStyles: { 0: { cellWidth: 28, fontStyle: "bold" }, 1: { cellWidth: 122 }, 2: { cellWidth: 20, halign: "right", fontStyle: "bold" } }
  });

  // ============================================================
  // PAGE 9: LIST OF TABLES
  // ============================================================
  startNewPage(ctx, "List of Tables", "ix");
  ctx.curY = 25;
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("LIST OF TABLES", pageWidth / 2, ctx.curY, { align: "center" });
  doc.line(pageWidth / 2 - 20, ctx.curY + 2, pageWidth / 2 + 20, ctx.curY + 2);
  ctx.curY += 10;

  const tablesList = [
    ["Table 1.1", "Structural Deficiencies of Legacy Retail Wealth Platforms", "Page 12"],
    ["Table 2.1", "Comprehensive Feature Matrix: FinTrackPro vs Commercial Competitors", "Page 16"],
    ["Table 3.1", "Functional Requirements Specification Matrix (FR-01 to FR-12)", "Page 19"],
    ["Table 3.2", "Non-Functional Requirements & Performance SLAs (NFR-01 to NFR-08)", "Page 20"],
    ["Table 3.3", "Hardware and Software Environment Specifications", "Page 21"],
    ["Table 3.4", "Agile Scrum 5-Sprint Schedule & Story Velocity Allocation", "Page 23"],
    ["Table 4.1", "Detailed Use Case Specifications Matrix (UC-01 to UC-08)", "Page 26"],
    ["Table 4.2", "Relational Database Data Dictionary & Attribute Specifications", "Page 29"],
    ["Table 4.3", "Level 1 DFD Process Decomposition & Data Store Mapping", "Page 31"],
    ["Table 4.4", "State Machine Transition Matrix for SIP Mandates", "Page 37"],
    ["Table 5.1", "Technology Stack Evaluation, Version Matrix & Rationale", "Page 39"],
    ["Table 6.1", "Sample Input / Output Test Execution Matrix (Part 1: Unit & Boundary)", "Page 50"],
    ["Table 6.2", "Sample Input / Output Test Execution Matrix (Part 2: Integration & Stress)", "Page 51"],
    ["Table 6.3", "Comparative Benchmark Summary: FinTrackPro vs Legacy Monoliths", "Page 53"],
    ["Table 9.1", "Comprehensive REST API Endpoints & Request-Response Matrix", "Page 59"],
    ["Table 9.2", "SEBI & RBI Cybersecurity Statutory Compliance Audit Checklist", "Page 60"],
  ];

  autoTable(doc, {
    startY: ctx.curY,
    margin: { left: leftMargin, right: rightMargin },
    theme: "striped",
    head: [["Table No.", "Table Title & Specification Detail", "Page"]],
    body: tablesList,
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8, fontStyle: "bold" },
    styles: { fontSize: 7.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: { 0: { cellWidth: 28, fontStyle: "bold" }, 1: { cellWidth: 122 }, 2: { cellWidth: 20, halign: "right", fontStyle: "bold" } }
  });

  // ============================================================
  // PAGE 10: TABLE OF CONTENTS
  // ============================================================
  startNewPage(ctx, "Table of Contents", "x");
  ctx.curY = 25;
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("TABLE OF CONTENTS", pageWidth / 2, ctx.curY, { align: "center" });
  doc.line(pageWidth / 2 - 25, ctx.curY + 2, pageWidth / 2 + 25, ctx.curY + 2);
  ctx.curY += 8;

  const tocList = [
    ["Preliminary Pages", "Title Page, Certificate, Declaration, Acknowledgements, Abstract, Lists", "Pages i–x"],
    ["Chapter 1", "Introduction (Background, Problem Definition, Objectives, Scope, Motivation)", "Pages 11–14"],
    ["Chapter 2", "Literature Review (Related Works, Comparative Matrix, Research Gap, Proposed System)", "Pages 15–18"],
    ["Chapter 3", "System Analysis (System Requirements, Feasibility Study, Agile Methodology)", "Pages 19–23"],
    ["Chapter 4", "System Design & UML Diagrams (Architecture, 14 UML Diagrams & Data Dictionary)", "Pages 24–38"],
    ["Chapter 5", "Implementation (Tech Stack, Mathematical Algorithms, Pseudocode & Screenshots)", "Pages 39–49"],
    ["Chapter 6", "Results and Discussion (Sample I/O Matrix, Benchmark Graphs, Statistical Analysis)", "Pages 50–53"],
    ["Chapter 7", "Conclusion and Future Scope (Summary of Work, Achievements, Limitations, Roadmap)", "Pages 54–55"],
    ["Chapter 8", "References (45+ IEEE & Regulatory Standards Citations)", "Pages 56–57"],
    ["Chapter 9", "Appendix (Database DDL Schemas, REST API Matrix, SEBI Audit, Mathematical Proofs)", "Pages 58–60"],
  ];

  autoTable(doc, {
    startY: ctx.curY,
    margin: { left: leftMargin, right: rightMargin },
    theme: "striped",
    head: [["Chapter / Section", "Title & Detailed Topic Coverage", "Page No."]],
    body: tocList,
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8.5, fontStyle: "bold" },
    styles: { fontSize: 8, cellPadding: 3, textColor: [30, 41, 59] },
    columnStyles: { 0: { cellWidth: 32, fontStyle: "bold" }, 1: { cellWidth: 118 }, 2: { cellWidth: 20, halign: "right", fontStyle: "bold" } }
  });
}
