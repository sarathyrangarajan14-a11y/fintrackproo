import { BlackBookContext, autoTable, startNewPage, drawChapterHeading, drawSectionHeading, drawParagraph, drawBullet } from "./helpers.js";

export function generateChapters1and2(ctx: BlackBookContext) {
  const { doc, leftMargin, rightMargin, contentWidth } = ctx;

  // ============================================================
  // CHAPTER 1: INTRODUCTION (PAGES 11 TO 14)
  // ============================================================

  // PAGE 11: 1.1 Background of Study
  startNewPage(ctx, "Chapter 1: Introduction");
  drawChapterHeading(ctx, "CHAPTER 1", "INTRODUCTION");

  drawSectionHeading(ctx, "1.1", "Background of Study", "Chapter 1: Introduction");
  drawParagraph(ctx, "Over the past decade, mutual fund investing in India has transitioned rapidly from manual paper applications and physical cheque clearances to direct digital execution powered by Aadhaar-based e-KYC and UPI. Retail assets under management (AUM) across the Indian mutual fund industry have crossed ₹50 lakh crore (over $600 billion USD), driven primarily by millions of salaried households participating through monthly Systematic Investment Plans (SIPs).", "Chapter 1: Introduction");
  drawParagraph(ctx, "Traditionally, retail investors bought mutual funds through local distributors or commercial bank branches. These legacy routes sold 'Regular' plans carrying embedded distributor commissions between 1.0% and 2.25% annually. Over a 20-year horizon, these ongoing fees can erode an investor's terminal wealth by up to 30%. While SEBI mandated zero-commission 'Direct' plans in 2013, self-directed investors soon encountered friction: keeping track of different folios across more than 40 Asset Management Companies (AMCs) meant managing dozens of separate portal logins, PINs, and statement formats.", "Chapter 1: Introduction");
  drawParagraph(ctx, "Modern consumer investment apps like Zerodha Coin and Groww helped make mutual fund purchases accessible from a smartphone. However, as investors accumulate schemes across equity, debt, and hybrid categories, new operational gaps become apparent: fragmented portfolio visibility, inaccurate return metrics, and a total lack of tools for independent financial advisors who help families manage long-term goals.", "Chapter 1: Introduction");
  drawParagraph(ctx, "FinTrackPro was developed to bridge this gap. Engineered as a full-stack, cloud-native wealth management platform, it combines real-time AMFI NAV tracking, mathematical XIRR calculation using the Newton-Raphson method, bank-grade multi-factor authentication, and a dedicated partner portal for AMFI-registered mutual fund distributors (like Velocity Wealth, ARN 348996) to manage client onboarding, KYC, and portfolio reviews in one place.", "Chapter 1: Introduction");

  // PAGE 12: 1.2 Problem Definition
  startNewPage(ctx, "Chapter 1: Introduction");
  drawSectionHeading(ctx, "1.2", "Problem Definition", "Chapter 1: Introduction");
  drawParagraph(ctx, "A thorough study of existing retail wealth management tools revealed four major technical and operational problems that affect both everyday investors and independent advisors:", "Chapter 1: Introduction");

  drawBullet(ctx, "Fragmented Multi-AMC Account Aggregation", "Investors typically hold mutual funds across multiple fund houses (HDFC, ICICI Prudential, SBI, Parag Parikh, Nippon India). Because each AMC issues separate statements, users must manually copy transaction entries into spreadsheets or wait for monthly CAS statements, leaving them with an outdated view of their true asset allocation.", "Chapter 1: Introduction");
  drawBullet(ctx, "Mathematical Inaccuracy in Return Calculations", "Most retail portals calculate returns using simple absolute percentage or point-to-point Compound Annual Growth Rate (CAGR). However, mutual fund SIPs consist of staggered cash flows deposited on different dates. Applying CAGR to recurring SIP installments is mathematically invalid. Computing the exact Extended Internal Rate of Return (XIRR) requires finding the root of a non-linear polynomial equation, which many lightweight web apps skip due to algorithm complexity.", "Chapter 1: Introduction");
  drawBullet(ctx, "Advisor Disconnect & Manual Onboarding Friction", "Independent Financial Advisors (IFAs) lack integrated software to monitor client portfolios, track pending KYC approvals, or schedule periodic rebalancing. Most advisors still collect physical document copies or exchange sensitive PAN and bank proofs over unencrypted chat apps, creating compliance and privacy risks.", "Chapter 1: Introduction");
  drawBullet(ctx, "Security Flaws & OTP Exposure in Web Authentication", "A widespread vulnerability in modern web apps is careless OTP handling. During development or due to poor backend design, verification codes are often returned inside the HTTP JSON response payload or logged to browser developer consoles, completely undermining the two-factor authentication guarantee mandated by SEBI guidelines.", "Chapter 1: Introduction");

  // Table 1.1: Structural Deficiencies
  autoTable(doc, {
    startY: ctx.curY + 2,
    margin: { left: leftMargin, right: rightMargin },
    theme: "grid",
    head: [["Vulnerability Dimension", "Legacy System Manifestation", "FinTrackPro Architectural Solution"]],
    body: [
      ["Portfolio Valuation", "Manual spreadsheet tracking / T+3 delayed statements", "Automated AMFI NAV ingestion across 44,000+ schemes"],
      ["Performance Metric", "Misleading point-to-point CAGR on SIPs", "Sub-50ms Newton-Raphson exact XIRR numerical engine"],
      ["Mandate Authorization", "Physical NACH paper slips taking 15 to 21 days", "Instant 3D Secure NPCI e-mandate registration with SMS OTP"],
      ["Cybersecurity", "Plaintext OTP in debug consoles or JSON payloads", "Zero-On-Screen cellular telephony OTP with PBKDF2 hashing"],
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2.2, textColor: [30, 41, 59] }
  });
  ctx.curY = (doc as any).lastAutoTable.finalY + 6;

  // PAGE 13: 1.3 Objectives of the Project
  startNewPage(ctx, "Chapter 1: Introduction");
  drawSectionHeading(ctx, "1.3", "Objectives of the Project", "Chapter 1: Introduction");
  drawParagraph(ctx, "The primary aim of FinTrackPro is to design, develop, benchmark, and deploy a secure, cloud-native enterprise wealth management and mutual fund advisory platform. The overarching goal is deconstructed into the following verifiable engineering objectives:", "Chapter 1: Introduction");

  drawBullet(ctx, "Objective 1: High-Throughput AMFI NAV Synchronization", "Engineer an automated background microservice to parse, validate, and ingest official daily Net Asset Value (NAV) data from AMFI across all 44,000+ active mutual fund schemes by 11:30 PM IST with 99.9% fault tolerance.", "Chapter 1: Introduction");
  drawBullet(ctx, "Objective 2: Precision Newton-Raphson XIRR Engine", "Implement a numerical solver executing the Newton-Raphson polynomial convergence algorithm to compute exact Extended Internal Rate of Return (XIRR) across irregular, multi-year cash inflows and partial redemptions in sub-50 milliseconds per portfolio.", "Chapter 1: Introduction");
  drawBullet(ctx, "Objective 3: SEBI-Compliant Zero-On-Screen OTP Architecture", "Architect a zero-trust multi-factor authentication pipeline where 6-digit numeric tokens are cryptographically generated, salted, hashed via PBKDF2 (SHA-256), and dispatched strictly via cellular SMS gateways (Fast2SMS / Twilio). Enforce zero on-screen display or JSON payload reflection.", "Chapter 1: Introduction");
  drawBullet(ctx, "Objective 4: Institutional Role-Based Access Control (RBAC)", "Deliver distinct, cryptographically isolated functional dashboards for three primary user personas: Retail Investors (portfolio tracking, SIP orders, KYC), AMFI Partners/Advisors (AUM monitoring, client rebalancing, transaction auditing), and Compliance Super-Admins (feed sync, system health).", "Chapter 1: Introduction");
  drawBullet(ctx, "Objective 5: Automated E-Mandate Registration & Digital Billing", "Integrate NPCI NACH e-mandate and UPI auto-debit workflows for recurring monthly investments, accompanied by deterministic client-side and server-side PDF generation via jsPDF for digitally verifiable investment receipts.", "Chapter 1: Introduction");

  // PAGE 14: 1.4 Scope, 1.5 Motivation & 1.6 Report Organization
  startNewPage(ctx, "Chapter 1: Introduction");
  drawSectionHeading(ctx, "1.4", "Scope of the Project", "Chapter 1: Introduction");
  drawParagraph(ctx, "The project scope encompasses the complete software development lifecycle (SDLC) of the FinTrackPro platform: relational database architecture using PostgreSQL and Drizzle ORM, asynchronous Node.js Express microservices, responsive web user interface using React 19 and Tailwind CSS, telephony SMS gateway integration, and regulatory compliance aligned with SEBI (Mutual Funds) Regulations 1996 and the Digital Personal Data Protection (DPDP) Act 2023. Explicitly out of scope for this version is direct dematerialized equity trading on exchange floors and algorithmic high-frequency trading.", "Chapter 1: Introduction");

  drawSectionHeading(ctx, "1.5", "Motivation", "Chapter 1: Introduction");
  drawParagraph(ctx, "The primary motivation stems from bridging the digital wealth divide. While ultra-high-net-worth individuals access family-office platforms offering customized asset allocation, retail investors are subjected to ad-heavy consumer applications that monetize user data. FinTrackPro delivers family-office security, transparent analytics, and zero-compromise confidentiality to everyday households.", "Chapter 1: Introduction");

  drawSectionHeading(ctx, "1.6", "Organization of the Dissertation", "Chapter 1: Introduction");
  drawParagraph(ctx, "This dissertation is organized into nine sequential chapters: Chapter 1 outlines the introductory context; Chapter 2 reviews literature and comparative systems; Chapter 3 conducts system analysis and feasibility studies; Chapter 4 presents system design and 14 UML models; Chapter 5 details implementation, algorithms, and UI walkthroughs; Chapter 6 reports empirical results and benchmark graphs; Chapter 7 concludes the study; Chapter 8 provides IEEE references; and Chapter 9 contains technical appendices.", "Chapter 1: Introduction");

  // ============================================================
  // CHAPTER 2: LITERATURE REVIEW (PAGES 15 TO 18)
  // ============================================================

  // PAGE 15: 2.1 Existing Systems & Literature Survey
  startNewPage(ctx, "Chapter 2: Literature Review");
  drawChapterHeading(ctx, "CHAPTER 2", "LITERATURE REVIEW");

  drawSectionHeading(ctx, "2.1", "Existing Systems / Related Works", "Chapter 2: Literature Review");
  drawParagraph(ctx, "Modern computerized portfolio management is theoretically rooted in Harry Markowitz's seminal paper 'Portfolio Selection' (1952), which introduced Modern Portfolio Theory (MPT). Markowitz demonstrated that risk-averse investors can construct optimal portfolios maximizing expected return for a given level of market risk. William Sharpe (1964) expanded this framework through the Capital Asset Pricing Model (CAPM) and the Sharpe Ratio, establishing mathematical formulations to evaluate risk-adjusted return relative to risk-free treasury yields.", "Chapter 2: Literature Review");
  drawParagraph(ctx, "In the domain of web systems and financial technology, Treleaven et al. (2013) demonstrated that multi-tier web platforms substantially lower transaction costs and improve retail investor diversification. In the Indian FinTech space, multiple commercial platforms operate today:", "Chapter 2: Literature Review");

  drawBullet(ctx, "Zerodha Coin", "A pioneer in direct mutual fund distribution via demat accounts. While offering zero commissions, Coin mandates maintaining a demat equity account, subjecting investors to annual maintenance charges (AMC) and non-demat transfer restrictions.", "Chapter 2: Literature Review");
  drawBullet(ctx, "Groww", "A widely adopted mobile-first investing portal. Although highly accessible, Groww heavily cross-sells high-risk speculative intraday equities and Futures & Options (F&O), frequently distracting long-term mutual fund investors from goal-based planning.", "Chapter 2: Literature Review");
  drawBullet(ctx, "Kuvera", "An early innovator in goal-based financial advisory. However, following its acquisition by Cred, user focus has shifted toward credit card reward monetization, degrading the core advisory experience.", "Chapter 2: Literature Review");
  drawBullet(ctx, "Traditional Banking Portals (HDFC / ICICI Direct)", "Plagued by high expense ratio regular plans, complex 30-step KYC processes, and high-latency legacy mainframe architectures.", "Chapter 2: Literature Review");

  // PAGE 16: 2.2 Limitations of Existing Systems (Table 2.1)
  startNewPage(ctx, "Chapter 2: Literature Review");
  drawSectionHeading(ctx, "2.2", "Limitations of Existing Systems", "Chapter 2: Literature Review");
  drawParagraph(ctx, "To systematically evaluate the competitive landscape, Table 2.1 summarizes an empirical comparative analysis of eight commercial platforms against key technical, financial, and cybersecurity parameters:", "Chapter 2: Literature Review");

  autoTable(doc, {
    startY: ctx.curY + 2,
    margin: { left: leftMargin, right: rightMargin },
    theme: "grid",
    head: [["Platform", "Direct Plans", "XIRR Solver", "Zero-Screen OTP", "Advisor RBAC", "E-Mandate", "AMFI Sync"]],
    body: [
      ["Zerodha Coin", "Yes (Demat)", "Periodic", "No (App Push)", "No", "Yes", "T+1 Daily"],
      ["Groww", "Yes (SOA)", "Basic", "No (Email/SMS)", "No", "Yes", "T+1 Daily"],
      ["Kuvera", "Yes (SOA)", "Yes", "No (Screen/SMS)", "Limited", "Yes", "T+1 Daily"],
      ["ET Money", "Mixed", "Basic", "No (SMS)", "No", "Yes", "T+1 Daily"],
      ["HDFC NetBank", "No (Regular)", "No (CAGR)", "Yes (Bank SMS)", "Yes", "Paper/Net", "T+2 Delay"],
      ["ICICI Direct", "No (Regular)", "No (CAGR)", "Yes (Bank SMS)", "Yes", "Yes", "T+2 Delay"],
      ["Paytm Money", "Yes (SOA)", "Basic", "No (App)", "No", "Yes", "T+1 Daily"],
      ["FinTrackPro", "Yes (Direct)", "Real-Time Exact", "Yes (PBKDF2 SMS)", "Yes (3 Personas)", "Instant NACH", "Real-Time Live"],
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 7.5, fontStyle: "bold" },
    styles: { fontSize: 7, cellPadding: 2, textColor: [30, 41, 59] }
  });
  ctx.curY = (doc as any).lastAutoTable.finalY + 6;

  drawParagraph(ctx, "As demonstrated in the empirical evaluation, none of the contemporary retail systems synthesize exact real-time Newton-Raphson XIRR calculations with zero-on-screen telephony SMS authentication and independent distributor collaboration portals.", "Chapter 2: Literature Review");

  // PAGE 17: 2.3 Research Gap
  startNewPage(ctx, "Chapter 2: Literature Review");
  drawSectionHeading(ctx, "2.3", "Research Gap", "Chapter 2: Literature Review");
  drawParagraph(ctx, "Extensive review of academic literature and enterprise software practices reveals three critical research and engineering gaps:", "Chapter 2: Literature Review");

  drawBullet(ctx, "Research Gap 1: Mathematical Approximation Over Precision", "Published academic models often assume uniform cashflow intervals (annual or quarterly), allowing simple geometric CAGR approximations. In real-world retail mutual fund investments, cashflows occur at irregular intervals due to flexible SIP dates, bank holiday postponements, ad-hoc dividend reinvestments, and sudden emergency withdrawals. There is a lack of production-grade implementations of the Newton-Raphson algorithm capable of sub-50ms execution on distributed web servers.", "Chapter 2: Literature Review");
  drawBullet(ctx, "Research Gap 2: Client-Side Credential Reflection Vulnerabilities", "While zero-trust architecture is widely discussed in network security literature, practical web implementations frequently violate security protocols during multi-factor authentication (MFA). To simplify frontend debugging, developers often return verification codes in the HTTP response JSON. An adversary with access to browser developer tools can bypass authentication without possessing the target mobile device.", "Chapter 2: Literature Review");
  drawBullet(ctx, "Research Gap 3: Bifurcation of Client Portals and Advisory CRM", "Commercial platforms either cater exclusively to direct self-directed investors (excluding advisors entirely) or provide legacy distributor back-office tools disconnected from client mobile interfaces. A unified, multi-tenant RBAC platform reconciling advisor portfolio rebalancing with client mobile execution remains unexplored in open-source academic research.", "Chapter 2: Literature Review");

  // PAGE 18: 2.4 Proposed Architectural Approach & Innovations
  startNewPage(ctx, "Chapter 2: Literature Review");
  drawSectionHeading(ctx, "2.4", "Proposed Architectural Approach & Innovations", "Chapter 2: Literature Review");
  drawParagraph(ctx, "FinTrackPro addresses these research gaps by introducing a four-tier distributed financial system designed for institutional resilience, compliance, and user clarity:", "Chapter 2: Literature Review");

  drawBullet(ctx, "Decoupled Reactive Presentation Tier", "Built with React 19, TypeScript, and Tailwind CSS v4, enforcing strict typing across financial entities and achieving zero hydration lag through concurrent rendering pipelines.", "Chapter 2: Literature Review");
  drawBullet(ctx, "High-Concurrency API Gateway & Numerical Engine", "Powered by Node.js 22 and Express, incorporating the Newton-Raphson polynomial solver for XIRR, token-bucket rate limiting, and automated AMFI daily synchronization workers.", "Chapter 2: Literature Review");
  drawBullet(ctx, "Zero-On-Screen Telephony Authentication Service", "A secure OTP dispatch engine that cryptographically generates 6-digit tokens, salts and hashes them using PBKDF2 (SHA-256) into PostgreSQL, and transmits them exclusively through cellular carrier SMS gateways (Fast2SMS / Twilio). The client browser receives only a masked phone confirmation, preventing any on-screen credential interception.", "Chapter 2: Literature Review");
  drawBullet(ctx, "ACID Relational Ledger & E-Mandate Gateway", "PostgreSQL 16 Cloud SQL managed via Drizzle ORM, maintaining immutable audit trails of all client transactions, folio allocations, and NPCI NACH mandate states.", "Chapter 2: Literature Review");
}
