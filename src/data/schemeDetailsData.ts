export interface SchemeDetail {
  schemeInfo: {
    name: string;
    plan: string;
    amc: string;
    category: string;
    benchmark: string;
    nav: string;
    aum: string;
    expenseRatio: string;
    riskometer: string;
    turnoverRatio: string;
  };
  assetAllocation: {
    equity: number;
    debt: number;
    cashAndReceivables: number;
    reitsInvITs: number;
    hedgedEquity: number;
  };
  marketCapSplit: {
    largeCap: number;
    midCap: number;
    smallCap: number;
  };
  sectorAllocation: Array<{
    sector: string;
    weight: number;
  }>;
  topHoldings: Array<{
    name: string;
    type: string;
    allocation: string;
  }>;
  totalHoldingsCount: number;
  advancedRatios: {
    peRatio: string;
    pbRatio: string;
    standardDeviation: string;
    sharpeRatio: string;
    beta: string;
  };
  investmentDetails: {
    minLumpsum: string;
    minSIP: string;
    stampDuty: string;
    exitLoad: string[];
    taxation: {
      stcg: string;
      ltcg: string;
    };
  };
  peerComparison: Array<{
    name: string;
    ret1Y: string;
    ret3Y: string;
    ret5Y: string;
    ter: string;
    isCurrent?: boolean;
  }>;
  fundManagers: Array<{
    name: string;
    role: string;
    tenure: string;
  }>;
  faqs: Array<{
    q: string;
    a: string;
  }>;
}

// Map scheme code / ticker to their custom details
export const SCHEME_DETAILS_DB: Record<string, SchemeDetail> = {
  // Parag Parikh Flexi Cap Fund (Direct - Growth)
  "122639": {
    schemeInfo: {
      name: "Parag Parikh Flexi Cap Fund",
      plan: "Direct Plan - Growth",
      amc: "PPFAS Mutual Fund (PPFAS Asset Management Pvt. Ltd.)",
      category: "Flexi Cap Fund (Open-ended Equity Scheme)",
      benchmark: "NIFTY 500 Total Return Index (TRI)",
      nav: "₹91.05",
      aum: "₹1,48,429 Cr",
      expenseRatio: "0.53% (Base TER) / 0.63% (Total TER)",
      riskometer: "Very High",
      turnoverRatio: "14.2%"
    },
    assetAllocation: {
      equity: 81.19,
      debt: 7.95,
      cashAndReceivables: 4.69,
      reitsInvITs: 4.07,
      hedgedEquity: 2.10
    },
    marketCapSplit: {
      largeCap: 93.73,
      midCap: 2.87,
      smallCap: 3.40
    },
    sectorAllocation: [
      { sector: "Financial Services", weight: 31.74 },
      { sector: "Technology & Global Tech", weight: 27.08 },
      { sector: "Consumer Discretionary", weight: 11.26 },
      { sector: "Energy & Utilities", weight: 9.47 },
      { sector: "Consumer Staples", weight: 8.13 },
      { sector: "Materials", weight: 6.71 },
      { sector: "Healthcare", weight: 5.25 },
      { sector: "Industrials", weight: 0.34 }
    ],
    topHoldings: [
      { name: "HDFC Bank Ltd", type: "Equity", allocation: "7.8%" },
      { name: "Power Grid Corporation of India Ltd", type: "Equity", allocation: "6.1%" },
      { name: "ITC Ltd", type: "Equity", allocation: "5.7%" },
      { name: "ICICI Bank Ltd", type: "Equity", allocation: "5.6%" },
      { name: "Coal India Ltd", type: "Equity", allocation: "4.9%" },
      { name: "Bajaj Holdings & Investment Ltd", type: "Equity", allocation: "4.5%" },
      { name: "Alphabet Inc. (GOOGL)", type: "Foreign Equity", allocation: "4.1%" },
      { name: "HCL Technologies Ltd", type: "Equity", allocation: "3.8%" },
      { name: "Kotak Mahindra Bank Ltd", type: "Equity", allocation: "3.2%" },
      { name: "TREPS & Net Receivables", type: "Cash Equivalent", allocation: "4.69%" }
    ],
    totalHoldingsCount: 152,
    advancedRatios: {
      peRatio: "22.4x",
      pbRatio: "3.8x",
      standardDeviation: "9.93%",
      sharpeRatio: "1.24",
      beta: "0.68"
    },
    investmentDetails: {
      minLumpsum: "₹1,000",
      minSIP: "₹1,000",
      stampDuty: "0.005% (Applicable since July 1, 2020)",
      exitLoad: [
        "Up to 10% of units: Nil",
        "Redemption within 365 days: 2.00%",
        "Redemption between 366 and 730 days: 1.00%",
        "Redemption after 730 days: Nil"
      ],
      taxation: {
        stcg: "20% (Holding period ≤ 12 months)",
        ltcg: "12.5% on gains exceeding ₹1.25 Lakh / year (Holding period > 12 months)"
      }
    },
    peerComparison: [
      { name: "Parag Parikh Flexi Cap Fund", ret1Y: "-1.56%", ret3Y: "14.46%", ret5Y: "13.46%", ter: "0.53%", isCurrent: true },
      { name: "HDFC Flexi Cap Fund", ret1Y: "24.50%", ret3Y: "22.80%", ret5Y: "19.50%", ter: "0.81%" },
      { name: "Franklin India Flexi Cap Fund", ret1Y: "21.20%", ret3Y: "20.10%", ret5Y: "18.30%", ter: "0.94%" },
      { name: "Bank of India Flexi Cap Fund", ret1Y: "22.80%", ret3Y: "18.90%", ret5Y: "17.10%", ter: "0.62%" },
      { name: "ITI Flexi Cap Fund", ret1Y: "20.10%", ret3Y: "16.50%", ret5Y: "15.20%", ter: "0.48%" }
    ],
    fundManagers: [
      { name: "Rajeev Thakkar", role: "CIO & Equity Fund Manager", tenure: "May 2013 – Present" },
      { name: "Raunak Onkar", role: "Fund Manager - Foreign Securities", tenure: "May 2013 – Present" },
      { name: "Raj Mehta", role: "Fund Manager - Debt", tenure: "Jan 2016 – Present" },
      { name: "Rukun Tarachandani", role: "Co-Fund Manager - Equity", tenure: "May 2022 – Present" },
      { name: "Mansi Kariya", role: "Co-Fund Manager - Foreign Securities", tenure: "2022 – Present" }
    ],
    faqs: [
      {
        q: "How to Invest in Parag Parikh Flexi Cap Fund Direct Growth?",
        a: "Invest online via registered mutual fund platforms or directly through the PPFAS AMC investor portal using Net Banking, UPI, or e-Mandates."
      },
      {
        q: "What kind of returns does Parag Parikh Flexi Cap Fund provide?",
        a: "The fund targets long-term risk-adjusted wealth compounding, historical 3Y/5Y CAGR sits around 13.5%–14.5% with reduced portfolio volatility."
      },
      {
        q: "How much expense ratio is charged?",
        a: "The direct plan charges a Base Expense Ratio of 0.53% (Total TER approximately ~0.63%)."
      },
      {
        q: "What is the AUM of the fund?",
        a: "The scheme manages approximately ₹1,48,429 Crore in assets under management."
      },
      {
        q: "How to Redeem units from the fund?",
        a: "Place a redemption request through the platform. Redemptions follow a T+2 business day payout cycle to your linked primary bank account."
      },
      {
        q: "Can I invest in both SIP and Lump Sum?",
        a: "Yes, both SIP and Lump Sum options are available with a minimum starting amount of ₹1,000."
      },
      {
        q: "What is the NAV and valuation multiple (PE / PB)?",
        a: "The current Direct NAV is ~₹91.05. The portfolio trades at a P/E multiple of ~22.4x and a P/B ratio of ~3.8x."
      }
    ]
  }
};

// Procedural generator to provide beautiful dynamic data for ANY other mutual fund/ETF
export function getSchemeDetails(code: string, name: string, category: string, fundHouse: string, navOrLtp: number): SchemeDetail {
  const cleanCode = String(code).trim();
  
  // Return mock if explicitly defined
  if (SCHEME_DETAILS_DB[cleanCode]) {
    return SCHEME_DETAILS_DB[cleanCode];
  }

  // Determine if ETF or debt scheme or index
  const isEtf = cleanCode.toUpperCase().endsWith('.NS') || cleanCode.toUpperCase().endsWith('.BO') || cleanCode.toUpperCase().includes('ETF') || isNaN(Number(cleanCode));
  const isDebt = category.toUpperCase().includes('DEBT') || category.toUpperCase().includes('OVERNIGHT') || category.toUpperCase().includes('LIQUID') || category.toUpperCase().includes('MARKET');
  const isIndex = category.toUpperCase().includes('INDEX') || name.toUpperCase().includes('INDEX') || isEtf;

  // Let's seed based on the code characters to keep results stable for the same code
  let seed = 0;
  for (let i = 0; i < cleanCode.length; i++) {
    seed += cleanCode.charCodeAt(i);
  }

  const generatedNavStr = `₹${navOrLtp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  
  // Custom generated details
  let equityAlloc = 0;
  let debtAlloc = 0;
  let cashAlloc = 5.0;
  let reitAlloc = 0;

  if (isDebt) {
    debtAlloc = 92.5;
    cashAlloc = 7.5;
  } else if (isIndex) {
    equityAlloc = 99.1;
    cashAlloc = 0.9;
  } else {
    // Normal Equity scheme
    equityAlloc = 85.0 + (seed % 10);
    debtAlloc = 5.0 + (seed % 4);
    cashAlloc = 100 - equityAlloc - debtAlloc;
  }

  const generatedAum = isEtf 
    ? `₹${(200 + (seed % 800) + 120).toLocaleString('en-IN')} Cr`
    : `₹${(1200 + (seed % 15) * 2300 + 1500).toLocaleString('en-IN')} Cr`;

  const expenseVal = isEtf 
    ? "0.03% to 0.15%" 
    : isIndex 
      ? "0.12% to 0.25%" 
      : `${(0.40 + (seed % 30) / 100).toFixed(2)}% (Base TER)`;

  const risk = isDebt ? "Low to Moderate" : (isIndex ? "High" : "Very High");
  const turnover = isIndex ? "1.5%" : `${(10 + (seed % 45)).toFixed(1)}%`;

  // Sector allocation based on fund style
  let sectorAllocation = [];
  if (isDebt) {
    sectorAllocation = [
      { sector: "Sovereign G-Secs", weight: 45.0 + (seed % 15) },
      { sector: "Treasury Bills (T-Bills)", weight: 30.0 + (seed % 10) },
      { sector: "Corporate Debt (AAA)", weight: 15.0 + (seed % 5) },
      { sector: "Commercial Papers", weight: 5.0 + (seed % 3) },
      { sector: "TREPS / Triparty Repo", weight: 5.0 }
    ];
  } else if (name.toUpperCase().includes("TECH")) {
    sectorAllocation = [
      { sector: "Software & Technology Services", weight: 65.5 },
      { sector: "Consulting & Global Tech Services", weight: 15.4 },
      { sector: "Telecommunications", weight: 10.2 },
      { sector: "Internet Portals & E-commerce", weight: 5.4 },
      { sector: "Hardware", weight: 3.5 }
    ];
  } else {
    sectorAllocation = [
      { sector: "Financial Services", weight: 26.5 + (seed % 10) },
      { sector: "Technology & IT", weight: 14.5 + (seed % 6) },
      { sector: "Consumer Discretionary", weight: 12.0 + (seed % 5) },
      { sector: "Energy & Utilities", weight: 10.5 + (seed % 4) },
      { sector: "Consumer Staples", weight: 9.0 + (seed % 3) },
      { sector: "Materials & Commodities", weight: 8.5 + (seed % 3) },
      { sector: "Healthcare & Pharma", weight: 7.5 + (seed % 2) },
      { sector: "Industrials & Capital Goods", weight: 11.5 - (seed % 5) }
    ];
  }

  // Holdings generator
  let topHoldings = [];
  if (isDebt) {
    topHoldings = [
      { name: "Government of India (7.18% G-Sec 2033)", type: "Sovereign Debt", allocation: `${(25 + (seed % 10)).toFixed(1)}%` },
      { name: "91 Days Treasury Bills (2026)", type: "Treasury Bill", allocation: `${(18 + (seed % 8)).toFixed(1)}%` },
      { name: "NABARD Corporate Bond (AAA)", type: "Corporate Debt", allocation: "8.5%" },
      { name: "HDFC Bank Commercial Paper", type: "Commercial Paper", allocation: "7.2%" },
      { name: "SIDBI Certificate of Deposit", type: "Certificate of Deposit", allocation: "6.4%" },
      { name: "Power Finance Corp (AAA Debentures)", type: "Corporate Debt", allocation: "5.5%" },
      { name: "TREPS Clearing Corp India", type: "Cash Equivalent", allocation: `${cashAlloc.toFixed(2)}%` }
    ];
  } else {
    // Equity
    const candidates = [
      { name: "Reliance Industries Ltd", type: "Equity" },
      { name: "HDFC Bank Ltd", type: "Equity" },
      { name: "Infosys Ltd", type: "Equity" },
      { name: "ICICI Bank Ltd", type: "Equity" },
      { name: "Tata Consultancy Services Ltd", type: "Equity" },
      { name: "Larsen & Toubro Ltd", type: "Equity" },
      { name: "ITC Ltd", type: "Equity" },
      { name: "Bharti Airtel Ltd", type: "Equity" },
      { name: "State Bank of India", type: "Equity" },
      { name: "Axis Bank Ltd", type: "Equity" }
    ];
    
    // Shuffle candidates based on seed
    const shuffled = [...candidates].sort((a, b) => {
      return (a.name.charCodeAt(2) % 3) - (b.name.charCodeAt(2) % 3);
    });

    let currentSum = 0;
    topHoldings = shuffled.slice(0, 7).map((item, idx) => {
      const weight = 9.5 - (idx * 1.1) - (seed % 2) * 0.1;
      currentSum += weight;
      return {
        ...item,
        allocation: `${weight.toFixed(1)}%`
      };
    });

    topHoldings.push({
      name: "TREPS & Net Current Receivables",
      type: "Cash Equivalent",
      allocation: `${cashAlloc.toFixed(1)}%`
    });
  }

  const peerComparison = [
    { name: name, ret1Y: "+18.2%", ret3Y: "+16.8%", ret5Y: "+15.4%", ter: isEtf ? "0.05%" : "0.55%", isCurrent: true },
    { name: `${fundHouse.split(' ')[0]} Active Advantage Fund`, ret1Y: "+20.5%", ret3Y: "+15.2%", ret5Y: "+14.1%", ter: "0.72%" },
    { name: "Nippon India Large Cap Fund", ret1Y: "+19.8%", ret3Y: "+17.5%", ret5Y: "+15.9%", ter: "0.84%" },
    { name: "HDFC Index Opportunities Fund", ret1Y: "+17.6%", ret3Y: "+16.1%", ret5Y: "+14.8%", ter: "0.40%" },
    { name: "SBI Bluechip Direct Fund", ret1Y: "+18.9%", ret3Y: "+15.8%", ret5Y: "+15.2%", ter: "0.88%" }
  ];

  // Specific Jio BlackRock Peer Comparison if Jio BlackRock
  if (fundHouse.includes("Jio")) {
    peerComparison[0].name = name;
    peerComparison[1].name = "JioBlackRock Nifty 50 Index Fund";
    peerComparison[2].name = "HDFC Index Nifty 50 Fund";
    peerComparison[3].name = "ICICI Prudential Nifty 50 Index";
    peerComparison[4].name = "UTI Nifty 50 Index Fund";
  }

  const managerPool = [
    { name: "Rajesh K. Sharma", role: "Head of Equities", tenure: "June 2021 – Present" },
    { name: "Ananya Sen", role: "Fund Manager - Foreign Securities", tenure: "March 2022 – Present" },
    { name: "Vikram Malhotra", role: "Debt & Treasury Manager", tenure: "November 2018 – Present" },
    { name: "Priya Nair", role: "Co-Fund Manager", tenure: "January 2024 – Present" }
  ];

  const fundManagers = fundHouse.includes("Jio") 
    ? [
        { name: "Sandeep Sen", role: "Chief Investment Officer", tenure: "May 2025 – Present" },
        { name: "John Miller, CFA", role: "Global Passive Co-Advisor (BlackRock)", tenure: "May 2025 – Present" },
        { name: "Meera Deshmukh", role: "Equity Fund Manager", tenure: "May 2025 – Present" }
      ]
    : managerPool.slice(0, 2 + (seed % 2));

  return {
    schemeInfo: {
      name,
      plan: isEtf ? "Exchange Traded Fund" : "Direct Plan - Growth",
      amc: fundHouse,
      category,
      benchmark: isDebt ? "NIFTY Short Duration Debt Index" : "NIFTY 50 Total Return Index (TRI)",
      nav: generatedNavStr,
      aum: generatedAum,
      expenseRatio: expenseVal,
      riskometer: risk,
      turnoverRatio: turnover
    },
    assetAllocation: {
      equity: equityAlloc,
      debt: debtAlloc,
      cashAndReceivables: cashAlloc,
      reitsInvITs: isDebt ? 0 : 2.5,
      hedgedEquity: isDebt ? 0 : 1.5
    },
    marketCapSplit: {
      largeCap: isDebt ? 0 : 75.0 + (seed % 15),
      midCap: isDebt ? 0 : 15.0 + (seed % 8),
      smallCap: isDebt ? 0 : 10.0 - (seed % 5)
    },
    sectorAllocation,
    topHoldings,
    totalHoldingsCount: isDebt ? 28 : 45 + (seed % 110),
    advancedRatios: {
      peRatio: isDebt ? "N/A" : `${(18.5 + (seed % 8)).toFixed(1)}x`,
      pbRatio: isDebt ? "N/A" : `${(2.8 + (seed % 3)).toFixed(1)}x`,
      standardDeviation: isDebt ? "1.85%" : `${(9.2 + (seed % 4)).toFixed(2)}%`,
      sharpeRatio: isDebt ? "1.45" : `${(1.05 + (seed % 30)/100).toFixed(2)}`,
      beta: isDebt ? "0.12" : `${(0.72 + (seed % 20)/100).toFixed(2)}`
    },
    investmentDetails: {
      minLumpsum: isEtf ? "1 Unit" : "₹1,000",
      minSIP: isEtf ? "N/A (LTP Based)" : "₹1,000",
      stampDuty: "0.005% (Applicable since July 1, 2020)",
      exitLoad: isEtf ? [
        "Nil exit load for trades executed on National Exchanges.",
        "Authorised participants/distributors redeeming directly with the AMC may be subject to minimum basket size limits."
      ] : [
        "Redemption within 30 days: 1.00%",
        "Redemption after 30 days: Nil"
      ],
      taxation: {
        stcg: isDebt 
          ? "Taxed at investor's marginal income tax slab rate" 
          : "20% (Holding period ≤ 12 months)",
        ltcg: isDebt 
          ? "Taxed at slab rate (No indexation benefits since April 1, 2023)" 
          : "12.5% on gains exceeding ₹1.25 Lakh / year (Holding period > 12 months)"
      }
    },
    peerComparison,
    fundManagers,
    faqs: [
      {
        q: `How to invest in ${name}?`,
        a: isEtf 
          ? `You can buy or sell units of ${name} directly on the National Stock Exchange (NSE) or Bombay Stock Exchange (BSE) via your linked demat trading account using ticker symbol ${cleanCode}.`
          : `You can invest online by creating an instant paperless folio on our platform, setting up a recurring monthly SIP or Lump Sum order with 2FA OTP verification.`
      },
      {
        q: `What is the Expense Ratio of ${name}?`,
        a: `The expense ratio represents the annualized management fee charged. For this scheme, it sits at ${expenseVal}.`
      },
      {
        q: "What is the settlement and payout cycle?",
        a: isEtf 
          ? "ETF trades on the secondary exchange settle on a standard T+1 rolling cycle directly to your linked demat depository account."
          : "Mutual fund redemption requests follow a standard T+2 business day settlement cycle directly to your registered primary bank account."
      }
    ]
  };
}
