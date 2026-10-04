const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '../public/screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Investor Wealth Dashboard SVG
const dashboardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#131c2e"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bgGrad)"/>

  <!-- Left Sidebar -->
  <rect x="0" y="0" width="220" height="675" fill="#0b1120" stroke="#1e293b" stroke-width="1"/>
  
  <!-- Logo -->
  <circle cx="45" cy="42" r="14" fill="url(#emeraldGrad)"/>
  <path d="M40 42 L44 46 L51 38" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
  <text x="70" y="44" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="bold">FinTrack<tspan fill="#10b981">Pro</tspan></text>
  <text x="70" y="56" fill="#64748b" font-family="sans-serif" font-size="9">BY VELOCITY WEALTH</text>

  <!-- Nav Items -->
  <g transform="translate(18, 90)">
    <rect x="0" y="0" width="184" height="38" rx="8" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-opacity="0.3"/>
    <text x="38" y="24" fill="#34d399" font-family="sans-serif" font-size="13" font-weight="600">📊 Dashboard</text>

    <text x="38" y="66" fill="#94a3b8" font-family="sans-serif" font-size="13">🔍 Explore Funds</text>
    <text x="38" y="106" fill="#94a3b8" font-family="sans-serif" font-size="13">💼 My Portfolio</text>
    <text x="38" y="146" fill="#94a3b8" font-family="sans-serif" font-size="13">🔄 SIP Orders</text>
    <text x="38" y="186" fill="#94a3b8" font-family="sans-serif" font-size="13">🎯 Goal Planner</text>
    <text x="38" y="226" fill="#94a3b8" font-family="sans-serif" font-size="13">📜 KYC &amp; Mandate</text>
    <text x="38" y="266" fill="#94a3b8" font-family="sans-serif" font-size="13">🧾 Tax Statements</text>
  </g>

  <!-- User Profile bottom of sidebar -->
  <rect x="14" y="615" width="192" height="46" rx="8" fill="#1e293b"/>
  <circle cx="36" cy="638" r="14" fill="#3b82f6"/>
  <text x="36" y="643" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">PR</text>
  <text x="60" y="634" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold">Parthasarathy R.</text>
  <text x="60" y="647" fill="#64748b" font-family="sans-serif" font-size="9">ARN: 348996</text>

  <!-- Top Navbar -->
  <rect x="220" y="0" width="980" height="65" fill="#0b1120" stroke="#1e293b" stroke-width="1"/>
  <text x="250" y="38" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Investor Wealth Dashboard</text>
  <rect x="680" y="18" width="230" height="30" rx="15" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="700" y="38" fill="#64748b" font-family="sans-serif" font-size="11">🔍 Search 44,000+ AMFI schemes...</text>
  <rect x="930" y="16" width="130" height="34" rx="8" fill="#10b981"/>
  <text x="995" y="38" fill="#022c22" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">+ Start New SIP</text>
  <circle cx="1085" cy="33" r="16" fill="#1e293b"/>
  <text x="1085" y="38" fill="#cbd5e1" font-family="sans-serif" font-size="14" text-anchor="middle">🔔</text>

  <!-- Metric Card 1: Total Portfolio Value -->
  <rect x="250" y="90" width="220" height="110" rx="12" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1"/>
  <text x="270" y="118" fill="#94a3b8" font-family="sans-serif" font-size="11" font-weight="600">TOTAL PORTFOLIO VALUE</text>
  <text x="270" y="152" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="bold">₹ 18,45,280</text>
  <rect x="270" y="168" width="75" height="20" rx="4" fill="#10b981" fill-opacity="0.2"/>
  <text x="307" y="182" fill="#34d399" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">+15.42% XIRR</text>

  <!-- Metric Card 2: Total Invested -->
  <rect x="490" y="90" width="210" height="110" rx="12" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1"/>
  <text x="510" y="118" fill="#94a3b8" font-family="sans-serif" font-size="11" font-weight="600">TOTAL INVESTED</text>
  <text x="510" y="152" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="bold">₹ 14,20,000</text>
  <text x="510" y="182" fill="#64748b" font-family="sans-serif" font-size="11">Across 12 Active SIPs</text>

  <!-- Metric Card 3: Unrealized Profit -->
  <rect x="720" y="90" width="210" height="110" rx="12" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1"/>
  <text x="740" y="118" fill="#94a3b8" font-family="sans-serif" font-size="11" font-weight="600">UNREALIZED PROFIT</text>
  <text x="740" y="152" fill="#34d399" font-family="sans-serif" font-size="24" font-weight="bold">+ ₹ 4,25,280</text>
  <text x="740" y="182" fill="#10b981" font-family="sans-serif" font-size="11">+29.95% Absolute</text>

  <!-- Metric Card 4: Monthly SIP Book -->
  <rect x="950" y="90" width="220" height="110" rx="12" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1"/>
  <text x="970" y="118" fill="#94a3b8" font-family="sans-serif" font-size="11" font-weight="600">MONTHLY SIP COMMITMENT</text>
  <text x="970" y="152" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="bold">₹ 35,000 / mo</text>
  <text x="970" y="182" fill="#38bdf8" font-family="sans-serif" font-size="11">Next Debit: 10th Oct 2026</text>

  <!-- Middle Left: Asset Allocation Chart Box -->
  <rect x="250" y="220" width="460" height="230" rx="12" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1"/>
  <text x="270" y="248" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Asset Allocation Breakdown</text>
  <text x="270" y="266" fill="#64748b" font-family="sans-serif" font-size="10">Target: 65% Equity / 25% Debt / 10% Gold</text>
  <!-- Donut Rings -->
  <circle cx="360" cy="340" r="60" fill="none" stroke="#1e293b" stroke-width="22"/>
  <circle cx="360" cy="340" r="60" fill="none" stroke="#10b981" stroke-width="22" stroke-dasharray="245 377" stroke-dashoffset="0"/>
  <circle cx="360" cy="340" r="60" fill="none" stroke="#3b82f6" stroke-width="22" stroke-dasharray="94 377" stroke-dashoffset="-245"/>
  <circle cx="360" cy="340" r="60" fill="none" stroke="#f59e0b" stroke-width="22" stroke-dasharray="38 377" stroke-dashoffset="-339"/>
  <text x="360" y="338" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle">₹ 18.45L</text>
  <text x="360" y="352" fill="#64748b" font-family="sans-serif" font-size="9" text-anchor="middle">Total Asset</text>

  <!-- Legend -->
  <g transform="translate(470, 280)">
    <rect x="0" y="0" width="12" height="12" rx="3" fill="#10b981"/>
    <text x="20" y="10" fill="#cbd5e1" font-family="sans-serif" font-size="11">Equity Funds (65.2%)</text>
    <text x="20" y="24" fill="#64748b" font-family="sans-serif" font-size="9">₹ 12,03,122</text>

    <rect x="0" y="40" width="12" height="12" rx="3" fill="#3b82f6"/>
    <text x="20" y="50" fill="#cbd5e1" font-family="sans-serif" font-size="11">Debt &amp; Liquid (25.1%)</text>
    <text x="20" y="64" fill="#64748b" font-family="sans-serif" font-size="9">₹ 4,63,165</text>

    <rect x="0" y="80" width="12" height="12" rx="3" fill="#f59e0b"/>
    <text x="20" y="90" fill="#cbd5e1" font-family="sans-serif" font-size="11">Sovereign Gold / Hybrid (9.7%)</text>
    <text x="20" y="104" fill="#64748b" font-family="sans-serif" font-size="9">₹ 1,78,993</text>
  </g>

  <!-- Middle Right: NAV Live Performance Ticker -->
  <rect x="730" y="220" width="440" height="230" rx="12" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1"/>
  <text x="750" y="248" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Live AMFI Market Feeds (Synced Daily 11:15 PM)</text>
  <text x="750" y="266" fill="#10b981" font-family="sans-serif" font-size="10">● 44,000+ SCHEMES REAL-TIME VIA MFAPI.IN</text>

  <!-- Line Items -->
  <g transform="translate(750, 280)">
    <rect x="0" y="0" width="400" height="36" rx="6" fill="#1e293b"/>
    <text x="12" y="22" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="600">Quant Small Cap Fund - Direct Growth</text>
    <text x="280" y="22" fill="#ffffff" font-family="sans-serif" font-size="11">NAV: ₹248.14</text>
    <text x="360" y="22" fill="#34d399" font-family="sans-serif" font-size="11">+1.42%</text>

    <rect x="0" y="44" width="400" height="36" rx="6" fill="#1e293b"/>
    <text x="12" y="66" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="600">Parag Parikh Flexi Cap Fund - Direct</text>
    <text x="280" y="66" fill="#ffffff" font-family="sans-serif" font-size="11">NAV: ₹84.92</text>
    <text x="360" y="66" fill="#34d399" font-family="sans-serif" font-size="11">+0.88%</text>

    <rect x="0" y="88" width="400" height="36" rx="6" fill="#1e293b"/>
    <text x="12" y="110" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="600">HDFC Top 100 Fund - Direct Growth</text>
    <text x="280" y="110" fill="#ffffff" font-family="sans-serif" font-size="11">NAV: ₹1,124.50</text>
    <text x="360" y="110" fill="#34d399" font-family="sans-serif" font-size="11">+0.65%</text>
  </g>

  <!-- Bottom Table: Top Holdings -->
  <rect x="250" y="470" width="920" height="185" rx="12" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1"/>
  <text x="270" y="498" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Top Folio Holdings &amp; Exact XIRR Performance</text>
  
  <!-- Table Header -->
  <rect x="270" y="515" width="880" height="26" fill="#1e293b" rx="4"/>
  <text x="285" y="532" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">SCHEME NAME</text>
  <text x="560" y="532" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">CATEGORY</text>
  <text x="710" y="532" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">INVESTED</text>
  <text x="830" y="532" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">CURRENT VALUE</text>
  <text x="980" y="532" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">XIRR (NEWTON-RAPHSON)</text>

  <!-- Row 1 -->
  <text x="285" y="560" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="600">Quant Small Cap Fund - Direct Plan</text>
  <text x="560" y="560" fill="#cbd5e1" font-family="sans-serif" font-size="11">Equity - Small Cap</text>
  <text x="710" y="560" fill="#cbd5e1" font-family="sans-serif" font-size="11">₹ 3,20,000</text>
  <text x="830" y="560" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold">₹ 4,82,310</text>
  <text x="980" y="560" fill="#34d399" font-family="sans-serif" font-size="11" font-weight="bold">+ 24.18% p.a.</text>

  <!-- Row 2 -->
  <text x="285" y="590" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="600">Parag Parikh Flexi Cap Fund - Direct</text>
  <text x="560" y="590" fill="#cbd5e1" font-family="sans-serif" font-size="11">Equity - Flexi Cap</text>
  <text x="710" y="590" fill="#cbd5e1" font-family="sans-serif" font-size="11">₹ 4,50,000</text>
  <text x="830" y="590" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold">₹ 5,98,400</text>
  <text x="980" y="590" fill="#34d399" font-family="sans-serif" font-size="11" font-weight="bold">+ 17.65% p.a.</text>

  <!-- Row 3 -->
  <text x="285" y="620" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="600">HDFC Top 100 Fund - Direct Growth</text>
  <text x="560" y="620" fill="#cbd5e1" font-family="sans-serif" font-size="11">Equity - Large Cap</text>
  <text x="710" y="620" fill="#cbd5e1" font-family="sans-serif" font-size="11">₹ 2,80,000</text>
  <text x="830" y="620" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold">₹ 3,42,150</text>
  <text x="980" y="620" fill="#34d399" font-family="sans-serif" font-size="11" font-weight="bold">+ 14.22% p.a.</text>
</svg>`;

// 2. Partner / Advisor CRM Portal SVG
const advisorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070a13"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#bgGrad2)"/>
  
  <!-- Left Sidebar -->
  <rect x="0" y="0" width="220" height="675" fill="#0b1120" stroke="#1e293b" stroke-width="1"/>
  <circle cx="45" cy="42" r="14" fill="url(#blueGrad)"/>
  <text x="45" y="47" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">VW</text>
  <text x="70" y="44" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="bold">Velocity<tspan fill="#6366f1">Wealth</tspan></text>
  <text x="70" y="56" fill="#64748b" font-family="sans-serif" font-size="9">ARN: 348996 PARTNER</text>

  <!-- Nav Items -->
  <g transform="translate(18, 90)">
    <rect x="0" y="0" width="184" height="38" rx="8" fill="#6366f1" fill-opacity="0.15" stroke="#6366f1" stroke-opacity="0.3"/>
    <text x="38" y="24" fill="#818cf8" font-family="sans-serif" font-size="13" font-weight="600">👔 Partner CRM</text>

    <text x="38" y="66" fill="#94a3b8" font-family="sans-serif" font-size="13">👥 Client Directory</text>
    <text x="38" y="106" fill="#94a3b8" font-family="sans-serif" font-size="13">📑 KYC Approvals (3)</text>
    <text x="38" y="146" fill="#94a3b8" font-family="sans-serif" font-size="13">⚖️ Rebalance Desk</text>
    <text x="38" y="186" fill="#94a3b8" font-family="sans-serif" font-size="13">💰 Commissions</text>
    <text x="38" y="226" fill="#94a3b8" font-family="sans-serif" font-size="13">⚙️ Firm Settings</text>
  </g>

  <!-- Top Navbar -->
  <rect x="220" y="0" width="980" height="65" fill="#0b1120" stroke="#1e293b" stroke-width="1"/>
  <text x="250" y="38" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">IFA Partner Control Desk (ARN: 348996)</text>
  <rect x="940" y="16" width="150" height="34" rx="8" fill="#6366f1"/>
  <text x="1015" y="38" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">+ Onboard Client</text>

  <!-- Stat Cards -->
  <g transform="translate(250, 90)">
    <!-- Card 1 -->
    <rect x="0" y="0" width="215" height="105" rx="12" fill="#131c2e" stroke="#1e293b"/>
    <text x="20" y="28" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">TOTAL CLIENT AUM</text>
    <text x="20" y="60" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="bold">₹ 52.40 Cr</text>
    <text x="20" y="85" fill="#10b981" font-family="sans-serif" font-size="10">↑ +14.8% YoY Growth</text>

    <!-- Card 2 -->
    <rect x="235" y="0" width="215" height="105" rx="12" fill="#131c2e" stroke="#1e293b"/>
    <text x="255" y="28" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">ACTIVE SIP BOOK</text>
    <text x="255" y="60" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="bold">₹ 42.80 L / mo</text>
    <text x="255" y="85" fill="#60a5fa" font-family="sans-serif" font-size="10">342 Registered Mandates</text>

    <!-- Card 3 -->
    <rect x="470" y="0" width="215" height="105" rx="12" fill="#131c2e" stroke="#1e293b"/>
    <text x="490" y="28" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">ONBOARDED CLIENTS</text>
    <text x="490" y="60" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="bold">186 Investors</text>
    <text x="490" y="85" fill="#a78bfa" font-family="sans-serif" font-size="10">3 Pending KYC Verification</text>

    <!-- Card 4 -->
    <rect x="705" y="0" width="215" height="105" rx="12" fill="#131c2e" stroke="#1e293b"/>
    <text x="725" y="28" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">TRAIL COMMISSION (MTD)</text>
    <text x="725" y="60" fill="#34d399" font-family="sans-serif" font-size="22" font-weight="bold">₹ 1,84,500</text>
    <text x="725" y="85" fill="#64748b" font-family="sans-serif" font-size="10">Payout Date: 15th Oct 2026</text>
  </g>

  <!-- Client Table -->
  <rect x="250" y="220" width="920" height="430" rx="12" fill="#131c2e" stroke="#1e293b"/>
  <text x="270" y="250" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold">Active Client Portfolio Directory &amp; KYC Workflow</text>
  
  <rect x="270" y="270" width="880" height="28" fill="#1e293b" rx="4"/>
  <text x="285" y="288" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">CLIENT NAME</text>
  <text x="460" y="288" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">PAN CARD</text>
  <text x="580" y="288" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">PORTFOLIO AUM</text>
  <text x="720" y="288" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">MONTHLY SIP</text>
  <text x="850" y="288" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">KYC STATUS</text>
  <text x="1000" y="288" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">ACTIONS</text>

  <!-- Client Row 1 -->
  <g transform="translate(270, 310)">
    <text x="15" y="20" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">Rajesh Mehra</text>
    <text x="190" y="20" fill="#cbd5e1" font-family="sans-serif" font-size="11">ABCDE1234F</text>
    <text x="310" y="20" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">₹ 28,45,000</text>
    <text x="450" y="20" fill="#cbd5e1" font-family="sans-serif" font-size="11">₹ 40,000 / mo</text>
    <rect x="580" y="4" width="75" height="20" rx="10" fill="#10b981" fill-opacity="0.2"/>
    <text x="617" y="18" fill="#34d399" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">VERIFIED</text>
    <rect x="730" y="2" width="75" height="24" rx="4" fill="#334155"/>
    <text x="767" y="17" fill="#ffffff" font-family="sans-serif" font-size="10" text-anchor="middle">View Folio</text>
  </g>

  <!-- Client Row 2 -->
  <g transform="translate(270, 350)">
    <text x="15" y="20" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">Sneha Deshmukh</text>
    <text x="190" y="20" fill="#cbd5e1" font-family="sans-serif" font-size="11">BNMPK5678Q</text>
    <text x="310" y="20" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">₹ 14,80,200</text>
    <text x="450" y="20" fill="#cbd5e1" font-family="sans-serif" font-size="11">₹ 25,000 / mo</text>
    <rect x="580" y="4" width="75" height="20" rx="10" fill="#f59e0b" fill-opacity="0.2"/>
    <text x="617" y="18" fill="#fbbf24" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">SUBMITTED</text>
    <rect x="730" y="2" width="75" height="24" rx="4" fill="#10b981"/>
    <text x="767" y="17" fill="#022c22" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">Approve KYC</text>
  </g>

  <!-- Client Row 3 -->
  <g transform="translate(270, 390)">
    <text x="15" y="20" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">Amitabh Sen</text>
    <text x="190" y="20" fill="#cbd5e1" font-family="sans-serif" font-size="11">CZXPS9821L</text>
    <text x="310" y="20" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">₹ 42,10,000</text>
    <text x="450" y="20" fill="#cbd5e1" font-family="sans-serif" font-size="11">₹ 55,000 / mo</text>
    <rect x="580" y="4" width="75" height="20" rx="10" fill="#10b981" fill-opacity="0.2"/>
    <text x="617" y="18" fill="#34d399" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">VERIFIED</text>
    <rect x="730" y="2" width="75" height="24" rx="4" fill="#334155"/>
    <text x="767" y="17" fill="#ffffff" font-family="sans-serif" font-size="10" text-anchor="middle">View Folio</text>
  </g>

  <!-- Client Row 4 -->
  <g transform="translate(270, 430)">
    <text x="15" y="20" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">Vikramaditya Iyer</text>
    <text x="190" y="20" fill="#cbd5e1" font-family="sans-serif" font-size="11">DFGPS3412M</text>
    <text x="310" y="20" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">₹ 8,90,000</text>
    <text x="450" y="20" fill="#cbd5e1" font-family="sans-serif" font-size="11">₹ 15,000 / mo</text>
    <rect x="580" y="4" width="75" height="20" rx="10" fill="#10b981" fill-opacity="0.2"/>
    <text x="617" y="18" fill="#34d399" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">VERIFIED</text>
    <rect x="730" y="2" width="75" height="24" rx="4" fill="#334155"/>
    <text x="767" y="17" fill="#ffffff" font-family="sans-serif" font-size="10" text-anchor="middle">View Folio</text>
  </g>
</svg>`;

// 3. Client KYC & Digital Signature Canvas SVG
const kycSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="kycBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#kycBg)"/>
  
  <!-- Header Bar -->
  <rect x="0" y="0" width="1200" height="65" fill="#0b1120" stroke="#1e293b" stroke-width="1"/>
  <text x="50" y="38" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Client KYC Verification &amp; SEBI e-Sign Desk</text>
  <rect x="980" y="16" width="170" height="34" rx="6" fill="#10b981"/>
  <text x="1065" y="38" fill="#022c22" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Export KYC Form (PDF)</text>

  <!-- Left Column: Verification Form -->
  <rect x="50" y="90" width="530" height="550" rx="12" fill="#131c2e" stroke="#1e293b"/>
  <text x="75" y="125" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold">1. Identity &amp; Statutory Details</text>
  
  <g transform="translate(75, 145)">
    <text x="0" y="18" fill="#94a3b8" font-family="sans-serif" font-size="11">Full Legal Name (as per PAN)</text>
    <rect x="0" y="26" width="480" height="34" rx="6" fill="#1e293b" stroke="#334155"/>
    <text x="14" y="48" fill="#ffffff" font-family="sans-serif" font-size="12">Parthasarathy Radhakrishnan</text>

    <text x="0" y="80" fill="#94a3b8" font-family="sans-serif" font-size="11">PAN Card Number</text>
    <rect x="0" y="88" width="230" height="34" rx="6" fill="#1e293b" stroke="#10b981"/>
    <text x="14" y="110" fill="#ffffff" font-family="sans-serif" font-size="12">AHWPR4582K</text>
    <text x="180" y="110" fill="#10b981" font-family="sans-serif" font-size="10">✓ VALID</text>

    <text x="250" y="80" fill="#94a3b8" font-family="sans-serif" font-size="11">Aadhaar Last 4 Digits</text>
    <rect x="250" y="88" width="230" height="34" rx="6" fill="#1e293b" stroke="#334155"/>
    <text x="264" y="110" fill="#ffffff" font-family="sans-serif" font-size="12">•••• •••• 8491</text>

    <text x="0" y="145" fill="#94a3b8" font-family="sans-serif" font-size="11">Bank Account &amp; IFSC Code</text>
    <rect x="0" y="153" width="230" height="34" rx="6" fill="#1e293b" stroke="#334155"/>
    <text x="14" y="175" fill="#ffffff" font-family="sans-serif" font-size="12">50100238491290 (HDFC)</text>
    <rect x="250" y="153" width="230" height="34" rx="6" fill="#1e293b" stroke="#334155"/>
    <text x="264" y="175" fill="#ffffff" font-family="sans-serif" font-size="12">HDFC0000128</text>

    <text x="0" y="210" fill="#94a3b8" font-family="sans-serif" font-size="11">Residential Address</text>
    <rect x="0" y="218" width="480" height="50" rx="6" fill="#1e293b" stroke="#334155"/>
    <text x="14" y="240" fill="#ffffff" font-family="sans-serif" font-size="11">Flat 402, Sea Green Apartments, Sion West, Mumbai</text>
    <text x="14" y="256" fill="#94a3b8" font-family="sans-serif" font-size="10">Maharashtra – 400 022</text>
  </g>

  <!-- Right Column: Document Vault & Signature Canvas -->
  <rect x="610" y="90" width="540" height="550" rx="12" fill="#131c2e" stroke="#1e293b"/>
  <text x="635" y="125" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold">2. Digital Signature &amp; Document Upload</text>

  <!-- Signature Canvas -->
  <g transform="translate(635, 145)">
    <text x="0" y="18" fill="#94a3b8" font-family="sans-serif" font-size="11">Digital Signature Pad (Draw with touch / mouse)</text>
    <rect x="0" y="26" width="490" height="150" rx="8" fill="#090d16" stroke="#334155" stroke-dasharray="4 4"/>
    <!-- Drawn Signature path -->
    <path d="M 50 120 C 70 80, 90 60, 110 95 C 130 130, 145 90, 180 85 C 210 80, 240 120, 290 90 Q 330 60, 380 110" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
    <text x="475" y="165" fill="#10b981" font-family="sans-serif" font-size="10" text-anchor="end">✓ Capturing at 60 FPS</text>
  </g>

  <!-- Document status list -->
  <g transform="translate(635, 345)">
    <text x="0" y="18" fill="#94a3b8" font-family="sans-serif" font-size="11">Uploaded Document Audit Trail</text>
    
    <rect x="0" y="26" width="490" height="38" rx="6" fill="#1e293b"/>
    <text x="14" y="49" fill="#ffffff" font-family="sans-serif" font-size="11">📄 PAN_Card_Front_AHWPR4582K.pdf</text>
    <text x="410" y="49" fill="#10b981" font-family="sans-serif" font-size="10" font-weight="bold">VERIFIED</text>

    <rect x="0" y="72" width="490" height="38" rx="6" fill="#1e293b"/>
    <text x="14" y="95" fill="#ffffff" font-family="sans-serif" font-size="11">📄 Aadhaar_Masked_E-KYC_UIDAI.pdf</text>
    <text x="410" y="95" fill="#10b981" font-family="sans-serif" font-size="10" font-weight="bold">VERIFIED</text>

    <rect x="0" y="118" width="490" height="38" rx="6" fill="#1e293b"/>
    <text x="14" y="141" fill="#ffffff" font-family="sans-serif" font-size="11">📄 Cancelled_Cheque_HDFC_Account.jpg</text>
    <text x="410" y="141" fill="#10b981" font-family="sans-serif" font-size="10" font-weight="bold">VERIFIED</text>
  </g>

  <!-- Submit Button -->
  <rect x="635" y="550" width="490" height="42" rx="8" fill="#10b981"/>
  <text x="880" y="576" fill="#022c22" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">Lock &amp; Submit KYC to AMFI Portal</text>
</svg>`;

// 4. Database Schema & Architecture Topology SVG
const schemaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="schBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#schBg)"/>
  
  <text x="600" y="40" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">FinTrackPro: PostgreSQL &amp; Drizzle Relational Database Schema</text>
  <text x="600" y="58" fill="#64748b" font-family="sans-serif" font-size="11" text-anchor="middle">Google Cloud SQL Managed PostgreSQL 16 • Strict Foreign Key Integrity</text>

  <!-- Table 1: users -->
  <g transform="translate(50, 90)">
    <rect x="0" y="0" width="230" height="240" rx="8" fill="#131c2e" stroke="#3b82f6" stroke-width="1.5"/>
    <rect x="0" y="0" width="230" height="32" rx="8" fill="#1d4ed8"/>
    <text x="12" y="21" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">TABLE: users</text>
    <text x="12" y="52" fill="#38bdf8" font-family="monospace" font-size="10">id: uuid (PK)</text>
    <text x="12" y="72" fill="#cbd5e1" font-family="monospace" font-size="10">email: varchar(255)</text>
    <text x="12" y="92" fill="#cbd5e1" font-family="monospace" font-size="10">phone_number: varchar(20)</text>
    <text x="12" y="112" fill="#cbd5e1" font-family="monospace" font-size="10">full_name: varchar(255)</text>
    <text x="12" y="132" fill="#cbd5e1" font-family="monospace" font-size="10">role: user_role_enum</text>
    <text x="12" y="152" fill="#cbd5e1" font-family="monospace" font-size="10">is_active: boolean</text>
    <text x="12" y="172" fill="#cbd5e1" font-family="monospace" font-size="10">two_factor_secret: text</text>
    <text x="12" y="192" fill="#cbd5e1" font-family="monospace" font-size="10">created_at: timestamp</text>
    <text x="12" y="212" fill="#cbd5e1" font-family="monospace" font-size="10">updated_at: timestamp</text>
  </g>

  <!-- Table 2: partners -->
  <g transform="translate(320, 90)">
    <rect x="0" y="0" width="230" height="240" rx="8" fill="#131c2e" stroke="#8b5cf6" stroke-width="1.5"/>
    <rect x="0" y="0" width="230" height="32" rx="8" fill="#6d28d9"/>
    <text x="12" y="21" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">TABLE: partners (ARN)</text>
    <text x="12" y="52" fill="#a78bfa" font-family="monospace" font-size="10">id: uuid (PK)</text>
    <text x="12" y="72" fill="#cbd5e1" font-family="monospace" font-size="10">user_id: uuid (FK -> users)</text>
    <text x="12" y="92" fill="#cbd5e1" font-family="monospace" font-size="10">arn_number: varchar(20)</text>
    <text x="12" y="112" fill="#cbd5e1" font-family="monospace" font-size="10">firm_name: varchar(255)</text>
    <text x="12" y="132" fill="#cbd5e1" font-family="monospace" font-size="10">euin: varchar(20)</text>
    <text x="12" y="152" fill="#cbd5e1" font-family="monospace" font-size="10">commission_rate: numeric</text>
    <text x="12" y="172" fill="#cbd5e1" font-family="monospace" font-size="10">total_aum: numeric(15,2)</text>
    <text x="12" y="192" fill="#cbd5e1" font-family="monospace" font-size="10">created_at: timestamp</text>
    <text x="12" y="212" fill="#cbd5e1" font-family="monospace" font-size="10">updated_at: timestamp</text>
  </g>

  <!-- Table 3: clients -->
  <g transform="translate(590, 90)">
    <rect x="0" y="0" width="260" height="240" rx="8" fill="#131c2e" stroke="#10b981" stroke-width="1.5"/>
    <rect x="0" y="0" width="260" height="32" rx="8" fill="#047857"/>
    <text x="12" y="21" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">TABLE: clients</text>
    <text x="12" y="52" fill="#34d399" font-family="monospace" font-size="10">id: uuid (PK)</text>
    <text x="12" y="72" fill="#cbd5e1" font-family="monospace" font-size="10">user_id: uuid (FK -> users)</text>
    <text x="12" y="92" fill="#cbd5e1" font-family="monospace" font-size="10">partner_id: uuid (FK -> partners)</text>
    <text x="12" y="112" fill="#cbd5e1" font-family="monospace" font-size="10">pan: varchar(10)</text>
    <text x="12" y="132" fill="#cbd5e1" font-family="monospace" font-size="10">kyc_status: kyc_status_enum</text>
    <text x="12" y="152" fill="#cbd5e1" font-family="monospace" font-size="10">bank_account_number: varchar(50)</text>
    <text x="12" y="172" fill="#cbd5e1" font-family="monospace" font-size="10">bank_ifsc: varchar(20)</text>
    <text x="12" y="192" fill="#cbd5e1" font-family="monospace" font-size="10">digital_signature: text</text>
    <text x="12" y="212" fill="#cbd5e1" font-family="monospace" font-size="10">created_at: timestamp</text>
  </g>

  <!-- Table 4: instruments (AMFI) -->
  <g transform="translate(890, 90)">
    <rect x="0" y="0" width="260" height="240" rx="8" fill="#131c2e" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="0" y="0" width="260" height="32" rx="8" fill="#b45309"/>
    <text x="12" y="21" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">TABLE: instruments (AMFI)</text>
    <text x="12" y="52" fill="#fbbf24" font-family="monospace" font-size="10">code: varchar(50) (PK)</text>
    <text x="12" y="72" fill="#cbd5e1" font-family="monospace" font-size="10">name: varchar(255)</text>
    <text x="12" y="92" fill="#cbd5e1" font-family="monospace" font-size="10">fund_house: varchar(255)</text>
    <text x="12" y="112" fill="#cbd5e1" font-family="monospace" font-size="10">category: varchar(100)</text>
    <text x="12" y="132" fill="#cbd5e1" font-family="monospace" font-size="10">current_price (NAV): numeric</text>
    <text x="12" y="152" fill="#cbd5e1" font-family="monospace" font-size="10">previous_close: numeric</text>
    <text x="12" y="172" fill="#cbd5e1" font-family="monospace" font-size="10">historical_data: jsonb</text>
    <text x="12" y="192" fill="#cbd5e1" font-family="monospace" font-size="10">last_synced_at: timestamp</text>
    <text x="12" y="212" fill="#cbd5e1" font-family="monospace" font-size="10">updated_at: timestamp</text>
  </g>

  <!-- Bottom Tables: sips, mandates, transactions -->
  <g transform="translate(50, 370)">
    <rect x="0" y="0" width="340" height="260" rx="8" fill="#131c2e" stroke="#1e293b"/>
    <rect x="0" y="0" width="340" height="30" rx="8" fill="#1e293b"/>
    <text x="12" y="20" fill="#38bdf8" font-family="sans-serif" font-size="11" font-weight="bold">TABLE: sips (Systematic Investment Plans)</text>
    <text x="12" y="50" fill="#cbd5e1" font-family="monospace" font-size="9">id: uuid (PK)</text>
    <text x="12" y="68" fill="#cbd5e1" font-family="monospace" font-size="9">client_id: uuid (FK -> clients)</text>
    <text x="12" y="86" fill="#cbd5e1" font-family="monospace" font-size="9">instrument_code: varchar(50) (FK -> instruments)</text>
    <text x="12" y="104" fill="#cbd5e1" font-family="monospace" font-size="9">amount: numeric(12,2)</text>
    <text x="12" y="122" fill="#cbd5e1" font-family="monospace" font-size="9">frequency: sip_freq_enum (MONTHLY)</text>
    <text x="12" y="140" fill="#cbd5e1" font-family="monospace" font-size="9">sip_day: integer (1..28)</text>
    <text x="12" y="158" fill="#cbd5e1" font-family="monospace" font-size="9">status: sip_status_enum (ACTIVE)</text>
    <text x="12" y="176" fill="#cbd5e1" font-family="monospace" font-size="9">next_execution_date: date</text>
  </g>

  <g transform="translate(430, 370)">
    <rect x="0" y="0" width="340" height="260" rx="8" fill="#131c2e" stroke="#1e293b"/>
    <rect x="0" y="0" width="340" height="30" rx="8" fill="#1e293b"/>
    <text x="12" y="20" fill="#34d399" font-family="sans-serif" font-size="11" font-weight="bold">TABLE: mandates (NPCI NACH)</text>
    <text x="12" y="50" fill="#cbd5e1" font-family="monospace" font-size="9">id: uuid (PK)</text>
    <text x="12" y="68" fill="#cbd5e1" font-family="monospace" font-size="9">client_id: uuid (FK -> clients)</text>
    <text x="12" y="86" fill="#cbd5e1" font-family="monospace" font-size="9">umrn: varchar(50) (NPCI Unique Number)</text>
    <text x="12" y="104" fill="#cbd5e1" font-family="monospace" font-size="9">max_amount: numeric(12,2)</text>
    <text x="12" y="122" fill="#cbd5e1" font-family="monospace" font-size="9">bank_name: varchar(100)</text>
    <text x="12" y="140" fill="#cbd5e1" font-family="monospace" font-size="9">status: mandate_status_enum (ACTIVE)</text>
    <text x="12" y="158" fill="#cbd5e1" font-family="monospace" font-size="9">auth_mode: nach_auth_enum (NET_BANKING / OTP)</text>
  </g>

  <g transform="translate(810, 370)">
    <rect x="0" y="0" width="340" height="260" rx="8" fill="#131c2e" stroke="#1e293b"/>
    <rect x="0" y="0" width="340" height="30" rx="8" fill="#1e293b"/>
    <text x="12" y="20" fill="#fbbf24" font-family="sans-serif" font-size="11" font-weight="bold">TABLE: transactions (Immutable Ledger)</text>
    <text x="12" y="50" fill="#cbd5e1" font-family="monospace" font-size="9">id: uuid (PK)</text>
    <text x="12" y="68" fill="#cbd5e1" font-family="monospace" font-size="9">client_id: uuid (FK -> clients)</text>
    <text x="12" y="86" fill="#cbd5e1" font-family="monospace" font-size="9">instrument_code: varchar(50)</text>
    <text x="12" y="104" fill="#cbd5e1" font-family="monospace" font-size="9">type: txn_type_enum (BUY / SELL / SIP_DEBIT)</text>
    <text x="12" y="122" fill="#cbd5e1" font-family="monospace" font-size="9">units: numeric(15,4)</text>
    <text x="12" y="140" fill="#cbd5e1" font-family="monospace" font-size="9">purchase_price (NAV): numeric(12,4)</text>
    <text x="12" y="158" fill="#cbd5e1" font-family="monospace" font-size="9">total_amount: numeric(15,2)</text>
    <text x="12" y="176" fill="#cbd5e1" font-family="monospace" font-size="9">status: txn_status_enum (COMPLETED)</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(outDir, 'dashboard.svg'), dashboardSvg);
fs.writeFileSync(path.join(outDir, 'advisor_portal.svg'), advisorSvg);
fs.writeFileSync(path.join(outDir, 'client_kyc.svg'), kycSvg);
fs.writeFileSync(path.join(outDir, 'database_schema.svg'), schemaSvg);

// 5. Fund Screener SVG
const screenerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <rect width="1200" height="675" fill="#090d16"/>
  <rect x="0" y="0" width="1200" height="65" fill="#0b1120" stroke="#1e293b" stroke-width="1"/>
  <text x="50" y="38" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Mutual Fund Screener &amp; Live AMFI NAV Directory</text>
  <rect x="750" y="16" width="300" height="34" rx="17" fill="#1e293b" stroke="#334155"/>
  <text x="770" y="38" fill="#94a3b8" font-family="sans-serif" font-size="12">🔍 Search by scheme, AMC or code...</text>

  <!-- Filter Chips -->
  <g transform="translate(50, 85)">
    <rect x="0" y="0" width="90" height="32" rx="16" fill="#10b981"/>
    <text x="45" y="21" fill="#022c22" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">All Funds</text>

    <rect x="105" y="0" width="110" height="32" rx="16" fill="#1e293b" stroke="#334155"/>
    <text x="160" y="21" fill="#cbd5e1" font-family="sans-serif" font-size="12" text-anchor="middle">Large Cap (84)</text>

    <rect x="230" y="0" width="110" height="32" rx="16" fill="#1e293b" stroke="#334155"/>
    <text x="285" y="21" fill="#cbd5e1" font-family="sans-serif" font-size="12" text-anchor="middle">Flexi Cap (72)</text>

    <rect x="355" y="0" width="110" height="32" rx="16" fill="#1e293b" stroke="#334155"/>
    <text x="410" y="21" fill="#cbd5e1" font-family="sans-serif" font-size="12" text-anchor="middle">Mid Cap (65)</text>

    <rect x="480" y="0" width="110" height="32" rx="16" fill="#1e293b" stroke="#334155"/>
    <text x="535" y="21" fill="#cbd5e1" font-family="sans-serif" font-size="12" text-anchor="middle">Small Cap (48)</text>

    <rect x="605" y="0" width="120" height="32" rx="16" fill="#1e293b" stroke="#334155"/>
    <text x="665" y="21" fill="#cbd5e1" font-family="sans-serif" font-size="12" text-anchor="middle">ELSS Tax Saver</text>
  </g>

  <!-- Table Box -->
  <rect x="50" y="140" width="1100" height="500" rx="12" fill="#131c2e" stroke="#1e293b"/>
  <rect x="65" y="155" width="1070" height="30" fill="#1e293b" rx="4"/>
  <text x="80" y="175" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">AMFI CODE</text>
  <text x="180" y="175" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">SCHEME NAME</text>
  <text x="550" y="175" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">CATEGORY</text>
  <text x="700" y="175" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">LATEST NAV</text>
  <text x="820" y="175" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">3Y RETURN (CAGR)</text>
  <text x="960" y="175" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">ACTION</text>

  <!-- Row 1 -->
  <text x="80" y="215" fill="#64748b" font-family="monospace" font-size="11">120823</text>
  <text x="180" y="215" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">Motilal Oswal Midcap Fund - Direct Plan - Growth</text>
  <text x="550" y="215" fill="#cbd5e1" font-family="sans-serif" font-size="11">Equity - Mid Cap</text>
  <text x="700" y="215" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">₹ 98.45</text>
  <text x="820" y="215" fill="#34d399" font-family="sans-serif" font-size="12" font-weight="bold">+ 32.40%</text>
  <rect x="960" y="198" width="90" height="26" rx="4" fill="#10b981"/>
  <text x="1005" y="215" fill="#022c22" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Invest SIP</text>

  <!-- Row 2 -->
  <text x="80" y="260" fill="#64748b" font-family="monospace" font-size="11">118556</text>
  <text x="180" y="260" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">Tata Digital India Fund - Direct Plan - Growth</text>
  <text x="550" y="260" fill="#cbd5e1" font-family="sans-serif" font-size="11">Sectoral - Technology</text>
  <text x="700" y="260" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">₹ 48.12</text>
  <text x="820" y="260" fill="#34d399" font-family="sans-serif" font-size="12" font-weight="bold">+ 24.18%</text>
  <rect x="960" y="243" width="90" height="26" rx="4" fill="#10b981"/>
  <text x="1005" y="260" fill="#022c22" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Invest SIP</text>

  <!-- Row 3 -->
  <text x="80" y="305" fill="#64748b" font-family="monospace" font-size="11">122639</text>
  <text x="180" y="305" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">Parag Parikh Flexi Cap Fund - Direct - Growth</text>
  <text x="550" y="305" fill="#cbd5e1" font-family="sans-serif" font-size="11">Equity - Flexi Cap</text>
  <text x="700" y="305" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">₹ 84.92</text>
  <text x="820" y="305" fill="#34d399" font-family="sans-serif" font-size="12" font-weight="bold">+ 21.85%</text>
  <rect x="960" y="288" width="90" height="26" rx="4" fill="#10b981"/>
  <text x="1005" y="305" fill="#022c22" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Invest SIP</text>
</svg>`;

// 6. SIP Mandate Registration Modal SVG
const mandateSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <rect width="1200" height="675" fill="#090d16"/>
  <!-- Modal Backdrop & Card -->
  <rect x="350" y="50" width="500" height="575" rx="16" fill="#131c2e" stroke="#334155" stroke-width="1.5"/>
  <text x="600" y="95" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">NPCI NACH E-Mandate Registration</text>
  <text x="600" y="115" fill="#64748b" font-family="sans-serif" font-size="11" text-anchor="middle">Authorize Automated Monthly SIP Debits via NPCI</text>

  <g transform="translate(385, 140)">
    <text x="0" y="16" fill="#94a3b8" font-family="sans-serif" font-size="11">Mutual Fund Scheme</text>
    <rect x="0" y="24" width="430" height="34" rx="6" fill="#1e293b"/>
    <text x="12" y="46" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold">Parag Parikh Flexi Cap Fund - Direct Growth</text>

    <text x="0" y="76" fill="#94a3b8" font-family="sans-serif" font-size="11">Monthly SIP Amount</text>
    <rect x="0" y="84" width="430" height="34" rx="6" fill="#1e293b"/>
    <text x="12" y="106" fill="#34d399" font-family="sans-serif" font-size="13" font-weight="bold">₹ 10,000 / month</text>

    <text x="0" y="136" fill="#94a3b8" font-family="sans-serif" font-size="11">SIP Auto-Debit Day</text>
    <rect x="0" y="144" width="430" height="34" rx="6" fill="#1e293b"/>
    <text x="12" y="166" fill="#ffffff" font-family="sans-serif" font-size="11">10th of every month</text>

    <text x="0" y="196" fill="#94a3b8" font-family="sans-serif" font-size="11">Bank Account for Mandate</text>
    <rect x="0" y="204" width="430" height="48" rx="6" fill="#1e293b" stroke="#10b981"/>
    <text x="12" y="224" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold">HDFC Bank Ltd (A/C: •••• 1290)</text>
    <text x="12" y="240" fill="#64748b" font-family="sans-serif" font-size="10">IFSC: HDFC0000128 • Maximum Limit: ₹ 50,000 / day</text>

    <text x="0" y="275" fill="#94a3b8" font-family="sans-serif" font-size="11">Authorization Authentication Mode</text>
    <rect x="0" y="283" width="205" height="34" rx="6" fill="#10b981" fill-opacity="0.2" stroke="#10b981"/>
    <text x="102" y="304" fill="#34d399" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">✓ Net Banking e-Sign</text>

    <rect x="225" y="283" width="205" height="34" rx="6" fill="#1e293b" stroke="#334155"/>
    <text x="327" y="304" fill="#cbd5e1" font-family="sans-serif" font-size="11" text-anchor="middle">Aadhaar OTP (UIDAI)</text>

    <!-- Consent & Submit -->
    <text x="0" y="345" fill="#64748b" font-family="sans-serif" font-size="9">☑ I authorize Velocity Wealth &amp; NPCI to debit my bank account on schedule.</text>
    <rect x="0" y="365" width="430" height="42" rx="8" fill="#10b981"/>
    <text x="215" y="391" fill="#022c22" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">Authorize Mandate &amp; Place 1st Order</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(outDir, 'fund_screener.svg'), screenerSvg);
fs.writeFileSync(path.join(outDir, 'sip_mandate.svg'), mandateSvg);

console.log('Screenshots generated in public/screenshots:');
console.log(fs.readdirSync(outDir));
