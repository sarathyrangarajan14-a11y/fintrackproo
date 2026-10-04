import { useState, useEffect } from "react";
import { Search, Filter, Activity, TrendingUp, IndianRupee, ArrowUpRight, Share, CheckCircle2, X, AlertCircle, ChevronLeft, ChevronRight, LineChart as LineChartIcon, Loader2, Copy, ExternalLink, Send, Check, Mail, Sparkles, MessageCircle, FileText, SendHorizontal } from "lucide-react";
import { mfapiService } from "../../services/mfapi.service";
import AdvancedFundChart from "../../components/AdvancedFundChart";
import { getAuthHeaders } from "../../lib/auth-helpers";

const ITEMS_PER_PAGE = 15;

export default function Products() {
  const [funds, setFunds] = useState<any[]>([]);
  const [allSchemes, setAllSchemes] = useState<any[]>([]);
  const [searching, setSearching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Equity", "Debt", "Hybrid", "Index Funds", "ELSS (Tax Saving)"];

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allSchemes.length / ITEMS_PER_PAGE) || 1;

  // Modals
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<any>(null);
  const [clientEmail, setClientEmail] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [proposalNotes, setProposalNotes] = useState("");
  const [isSendingQuote, setIsSendingQuote] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [proposalResult, setProposalResult] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  
  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Load all schemes once
  useEffect(() => {
    mfapiService.getAllSchemes()
      .then(data => setAllSchemes(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset pagination on search
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    const fetchFunds = async () => {
      setSearching(true);
      try {
        let targetSchemes = [];
        
        // Create effective query combining active category and search input
        const effectiveQuery = activeCategory === "All" 
          ? debouncedQuery 
          : debouncedQuery.trim() !== "" 
            ? `${activeCategory.replace(" Funds", "")} ${debouncedQuery}` 
            : activeCategory.replace(" Funds", "");

        if (effectiveQuery.trim() !== "") {
          const res = await mfapiService.searchSchemes(effectiveQuery);
          targetSchemes = res.slice(0, ITEMS_PER_PAGE);
        } else {
          if (allSchemes.length === 0) return;
          const start = (currentPage - 1) * ITEMS_PER_PAGE;
          targetSchemes = allSchemes.slice(start, start + ITEMS_PER_PAGE);
        }

        const enrichedResults = await Promise.all(
          targetSchemes.map(async (fund: any) => {
            try {
              const data = await mfapiService.getLatestNAV(fund.schemeCode);
              
              let cat = "Mutual Fund";
              const nameLower = fund.schemeName.toLowerCase();
              if (nameLower.includes("equity")) cat = "Equity";
              else if (nameLower.includes("debt") || nameLower.includes("liquid")) cat = "Debt";
              else if (nameLower.includes("hybrid") || nameLower.includes("balanced")) cat = "Hybrid";
              else if (nameLower.includes("index") || nameLower.includes("nifty") || nameLower.includes("sensex")) cat = "Index Fund";
              else if (nameLower.includes("elss") || nameLower.includes("tax")) cat = "ELSS";

              return {
                schemeCode: fund.schemeCode,
                schemeName: fund.schemeName,
                nav: data?.nav,
                date: data?.date,
                category: data?.meta?.scheme_category || cat
              };
            } catch (err) {
              return {
                schemeCode: fund.schemeCode,
                schemeName: fund.schemeName,
                nav: null,
                category: "Mutual Fund"
              };
            }
          })
        );
        setFunds(enrichedResults);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearching(false);
      }
    };
    
    fetchFunds();
  }, [debouncedQuery, activeCategory, allSchemes, currentPage]);

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail.trim() || !selectedFund) return;
    
    setIsSendingQuote(true);
    try {
      const headers = await getAuthHeaders();
      const payload = {
        clientEmail: clientEmail.trim(),
        schemeCode: String(selectedFund.schemeCode),
        schemeName: selectedFund.schemeName,
        fundCode: String(selectedFund.schemeCode),
        fundName: selectedFund.schemeName,
        nav: selectedFund.nav,
        date: selectedFund.date || new Date().toLocaleDateString('en-IN'),
        investmentAmount: investmentAmount ? Number(investmentAmount) : undefined,
        notes: proposalNotes || undefined
      };

      const response = await fetch('/api/partner/send-quote', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        setProposalResult(result);
        setQuoteSent(true);
        setNotification({ 
          message: `Quotation proposal dispatched to ${clientEmail}`, 
          type: 'success' 
        });
      } else {
        const errorMsg = result?.error || "Failed to dispatch quotation.";
        setNotification({ message: errorMsg, type: 'error' });
      }
    } catch (e: any) {
      console.error("Error sending quotation:", e);
      setNotification({ message: e?.message || "Error sending quote. Please check connection.", type: 'error' });
    } finally {
      setIsSendingQuote(false);
    }
  };

  const openQuoteModal = (fund: any) => {
    setSelectedFund(fund);
    setIsQuoteModalOpen(true);
    setQuoteSent(false);
    setProposalResult(null);
    setCopiedLink(false);
    setInvestmentAmount("");
    setProposalNotes("");
  };

  const handleCopyProposalLink = () => {
    if (!proposalResult) return;
    const proposalUrl = `${window.location.origin}/explore?scheme=${proposalResult.schemeCode}&ref=${proposalResult.proposalId}`;
    navigator.clipboard.writeText(proposalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyEmailText = () => {
    if (!proposalResult) return;
    const text = proposalResult?.emailDelivery?.plainText || `Investment Proposal: ${proposalResult.schemeName}\nNAV: ₹${proposalResult.nav}\nScheme Code: ${proposalResult.schemeCode}\nLink: ${window.location.origin}/explore?scheme=${proposalResult.schemeCode}&ref=${proposalResult.proposalId}`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleOpenMailClient = () => {
    if (!proposalResult) return;
    const mailto = proposalResult?.emailDelivery?.mailtoUrl;
    if (mailto) {
      window.location.href = mailto;
    } else {
      const subject = encodeURIComponent(`Investment Proposal: ${proposalResult.schemeName}`);
      const body = encodeURIComponent(`Dear Investor,\n\nPlease review your personalized investment proposal for ${proposalResult.schemeName} (NAV: ₹${proposalResult.nav}).\n\nDirect Link: ${window.location.origin}/explore?scheme=${proposalResult.schemeCode}&ref=${proposalResult.proposalId}`);
      window.location.href = `mailto:${encodeURIComponent(proposalResult.clientEmail)}?subject=${subject}&body=${body}`;
    }
  };

  const handleShareWhatsApp = () => {
    if (!proposalResult) return;
    const message = encodeURIComponent(`*FinTrackPro Investment Proposal (VELOCITY WEALTH)*\n\nScheme: *${proposalResult.schemeName}*\nCode: ${proposalResult.schemeCode}\nLive AMFI NAV: ₹${proposalResult.nav}\n\nReview & Invest Online:\n${window.location.origin}/explore?scheme=${proposalResult.schemeCode}&ref=${proposalResult.proposalId}`);
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6 relative z-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Mutual Fund Explorer</h2>
          <p className="text-slate-400">Discover and analyze mutual funds from all AMCs.</p>
        </div>
        <div className="bg-white/[0.05] px-4 py-2 border border-white/10 rounded-xl text-sm font-bold text-slate-400 flex items-center">
          <Activity className="h-4 w-4 mr-2 text-emerald-400" />
          Live Market Data
        </div>
      </div>

      {/* Global Search */}
      <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[32px] mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Scheme Name, AMC, or Code (e.g., Parag Parikh Flexi Cap)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xl"
          />
          {searching && <div className="absolute right-4 top-4 text-xs text-emerald-400 font-bold animate-pulse">Searching...</div>}
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <span className="text-sm font-bold text-slate-500 mr-2 flex items-center"><Filter className="h-4 w-4 mr-1"/> Filters:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results or Default View */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            {activeCategory === "All" && debouncedQuery === "" ? "All India Mutual Funds" : "Search Results"}
            <span className="ml-3 text-sm px-2 py-1 bg-white/10 text-slate-300 rounded-lg">{debouncedQuery === "" ? allSchemes.length.toLocaleString() : funds.length} funds</span>
          </h3>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 font-bold">
              Page {currentPage} of {debouncedQuery === "" ? totalPages : 1}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || searching}
                className="p-2 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={(debouncedQuery !== "" && funds.length < ITEMS_PER_PAGE) || currentPage === totalPages || searching}
                className="p-2 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden p-2">
          <div className="overflow-x-auto rounded-[24px]">
            <table className="w-full text-left text-sm min-w-[650px]">
              <thead className="bg-white/[0.02] text-slate-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Scheme Name</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Category</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Current NAV</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {searching ? (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-400 font-bold">Loading mutual fund schemes...</td></tr>
                ) : funds.length === 0 ? (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-400 font-bold">No schemes found.</td></tr>
                ) : funds.map((fund, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm max-w-md line-clamp-2">{fund.schemeName}</div>
                      <div className="text-xs text-slate-500 mt-1 uppercase tracking-tight">Code: {fund.schemeCode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-300">
                        {fund.category || "Equity"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {fund.nav ? (
                        <>
                          <div className="font-bold text-white flex items-center">
                            <IndianRupee className="h-3 w-3 mr-0.5" />{fund.nav}
                          </div>
                          <div className="text-slate-500 text-[10px] mt-1 uppercase">As of {fund.date}</div>
                        </>
                      ) : (
                        <span className="text-slate-500 italic text-xs">Fetching...</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedFund(fund);
                            setIsChartModalOpen(true);
                          }}
                          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
                        >
                          <LineChartIcon className="h-3.5 w-3.5 mr-1" /> Chart
                        </button>
                        <button 
                          onClick={() => openQuoteModal(fund)}
                          className="inline-flex items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        >
                          <Share className="h-3.5 w-3.5 mr-1.5" /> Send Quote
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl flex items-start gap-4">
        <AlertCircle className="h-6 w-6 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-white font-bold mb-2">Comprehensive Scheme Coverage</h4>
          <p className="text-sm text-blue-200/70 leading-relaxed">
            Explore and track thousands of mutual fund schemes across 40+ fund houses with daily updated NAVs and performance insights.
          </p>
        </div>
      </div>

      {/* Advanced Presentation-Grade Chart Modal */}
      {isChartModalOpen && selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0b1120] border border-white/15 rounded-[32px] p-6 md:p-8 w-full max-w-5xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative max-h-[95vh] overflow-y-auto">
            <button 
              onClick={() => setIsChartModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors z-10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <AdvancedFundChart
              schemeCode={selectedFund.schemeCode}
              schemeName={selectedFund.schemeName}
              category={selectedFund.category}
              initialTimeframe="1Y"
              isModal={true}
              onClose={() => setIsChartModalOpen(false)}
            />

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Partner Client Presentation Module • Verified Market Pricing
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsChartModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsChartModalOpen(false);
                    openQuoteModal(selectedFund);
                  }}
                  className="inline-flex items-center justify-center py-2.5 px-6 border border-transparent text-xs font-bold rounded-xl text-black bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
                >
                  <Share className="h-3.5 w-3.5 mr-1.5" /> Send Client Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {isQuoteModalOpen && selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
          <div className="bg-[#0b1120] border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors z-10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Direct Client Proposal
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-0.5">Send Fund Quotation</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">Send an immediate investment proposal directly to your client with latest NAV valuation.</p>

            {quoteSent ? (
               <div className="space-y-5 animate-in zoom-in duration-300">
                 <div className="flex flex-col items-center justify-center pt-2 pb-4 text-center">
                   <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                     <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                   </div>
                   <h4 className="text-xl font-bold text-white mb-1">Quotation Dispatched!</h4>
                   <p className="text-slate-400 text-xs max-w-sm">
                     An investment proposal with live NAV and direct portal access has been recorded and dispatched to <span className="text-white font-semibold">{clientEmail}</span>.
                   </p>
                 </div>

                 {/* Proposal Summary Card */}
                 <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                   <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                     <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Proposal Ref</span>
                     <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                       {proposalResult?.proposalId || `WF-PROP-${selectedFund.schemeCode}`}
                     </span>
                   </div>

                   <div className="flex items-start justify-between gap-4">
                     <div>
                       <p className="text-[11px] text-slate-400 uppercase tracking-wider">Fund Name</p>
                       <p className="text-xs font-bold text-white line-clamp-2 mt-0.5">{selectedFund.schemeName}</p>
                       <p className="text-[10px] text-slate-500 font-mono mt-0.5">Code #{selectedFund.schemeCode}</p>
                     </div>
                     <div className="text-right shrink-0">
                       <p className="text-[11px] text-slate-400 uppercase tracking-wider">Current NAV</p>
                       <p className="text-sm font-bold text-emerald-400 flex items-center justify-end mt-0.5">
                         <IndianRupee className="h-3 w-3 mr-0.5" />{selectedFund.nav || 'N/A'}
                       </p>
                     </div>
                   </div>

                   {investmentAmount && (
                     <div className="flex items-center justify-between pt-2 border-t border-white/5">
                       <span className="text-xs text-slate-400">Proposed Investment</span>
                       <span className="text-xs font-bold text-white">₹{Number(investmentAmount).toLocaleString('en-IN')}</span>
                     </div>
                   )}
                 </div>

                 {/* Quick Delivery & Share Options */}
                 <div className="space-y-2">
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Multi-Channel Client Delivery</p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                     <button
                       type="button"
                       onClick={handleOpenMailClient}
                       className="py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                       title="Open default email app with pre-filled proposal"
                     >
                       <Mail className="w-3.5 h-3.5" />
                       <span>Open Mail App</span>
                     </button>

                     <button
                       type="button"
                       onClick={handleCopyEmailText}
                       className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                       title="Copy full formatted email text"
                     >
                       {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
                       <span>{copiedText ? "Text Copied!" : "Copy Email"}</span>
                     </button>

                     <button
                       type="button"
                       onClick={handleShareWhatsApp}
                       className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                       title="Send proposal via WhatsApp"
                     >
                       <MessageCircle className="w-3.5 h-3.5" />
                       <span>WhatsApp</span>
                     </button>
                   </div>
                 </div>

                 {/* Quick Share Link Box */}
                 <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3">
                   <div className="truncate text-xs text-slate-400 font-mono">
                     {`${window.location.origin}/explore?scheme=${selectedFund.schemeCode}&ref=${proposalResult?.proposalId || ''}`}
                   </div>
                   <button
                     type="button"
                     onClick={handleCopyProposalLink}
                     className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                   >
                     {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                     <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                   </button>
                 </div>

                 {/* Modal Actions */}
                 <div className="flex items-center gap-3 pt-2">
                   <button
                     type="button"
                     onClick={() => {
                       setQuoteSent(false);
                       setClientEmail("");
                       setInvestmentAmount("");
                       setProposalNotes("");
                     }}
                     className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors cursor-pointer text-center"
                   >
                     Send Another Quote
                   </button>
                   <button
                     type="button"
                     onClick={() => setIsQuoteModalOpen(false)}
                     className="flex-1 py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer text-center"
                   >
                     Done
                   </button>
                 </div>
               </div>
            ) : (
              <form onSubmit={handleSendQuote} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                {/* Left Column: Fund Snapshot & Rationale */}
                <div className="md:col-span-5 bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div className="bg-white/[0.03] border border-white/10 p-3 rounded-xl">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Selected Mutual Fund</span>
                    <h4 className="font-bold text-white text-xs mt-0.5 line-clamp-2">{selectedFund.schemeName}</h4>
                    <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/5">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Current NAV</p>
                        <p className="text-sm font-bold text-emerald-400 flex items-center">
                          <IndianRupee className="h-3 w-3 mr-0.5" />{selectedFund.nav || '10.0000'}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        Code: {selectedFund.schemeCode}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Advisor Rationale / Note <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Recommended for long-term compounding..."
                      value={proposalNotes}
                      onChange={(e) => setProposalNotes(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>

                {/* Right Column: Client Email & Proposed Amount & Submit */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                  {/* Client Email Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Client Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        placeholder="client@example.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Optional Proposed Amount */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Proposed Amount (₹)
                      </label>
                      <input
                        type="number"
                        min="500"
                        step="500"
                        placeholder="e.g. 25000"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Investment Mode
                      </label>
                      <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-semibold text-slate-300 flex items-center justify-between">
                        <span>SIP / Lumpsum</span>
                        <span className="text-[10px] text-emerald-400 font-bold">Direct Plan</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={!clientEmail.trim() || isSendingQuote}
                      className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent text-xs font-bold rounded-xl text-black bg-emerald-400 hover:bg-emerald-300 focus:outline-none disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                    >
                      {isSendingQuote ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          <span>Dispatching Quotation...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          <span>Dispatch Quotation</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${notification.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400' : 'bg-red-950/80 border-red-500/30 text-red-400'} backdrop-blur-xl animate-in slide-in-from-bottom-5 fade-in duration-300`}>
          <div className="font-bold text-sm">
            {notification.message}
          </div>
          <button onClick={() => setNotification(null)} className="opacity-50 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
