import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User, Bot } from "lucide-react";
import { auth } from "../../lib/firebase";

export default function FloatingChat({ isPartner = false }: { isPartner?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{id: number, text: string, sender: 'me' | 'them', time: string, isAi?: boolean}[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const user = auth.currentUser;

  const quickPrompts = [
    "Which funds are underperforming?",
    "Show asset allocation breakdown",
    "Summarize tax saving investments"
  ];

  // Initialize with some fake history
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { 
          id: 1, 
          text: isPartner ? "Hello! I am your VelocityWealth AI Assistant. Ask me to analyze client portfolios, detect underperforming assets, or generate rebalancing recommendations." : "Hello! I am your dedicated advisor. How can I help you today?", 
          sender: 'them', 
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          isAi: isPartner
        }
      ]);
    }
  }, [isOpen, isPartner, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      text,
      sender: 'me' as const,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate reply
    setTimeout(() => {
      let replyText = isPartner ? "Thank you for the update. I will check my portfolio." : "I have received your message. I am currently reviewing your account and will get back to you shortly.";
      
      if (isPartner) {
        if (text.includes("underperforming")) {
          replyText = "Based on current data, the 'SBI Small Cap Fund' in Ramesh's portfolio is trailing its benchmark by 1.2% over the last quarter. Consider a review.";
        } else if (text.includes("allocation")) {
          replyText = "Across your active client base: 60% Equity (Large Cap 30%, Mid 20%, Small 10%), 30% Debt, and 10% Gold.";
        } else if (text.includes("tax")) {
          replyText = "Currently, 45 of your clients have active ELSS SIPs. 12 clients have not maxed out their ₹1.5L 80C limit for this financial year.";
        } else {
          replyText = "I've analyzed your query. Running a deep dive on the portfolio metrics. I'll flag any anomalies shortly.";
        }
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: replyText,
        sender: 'them',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        isAi: isPartner
      }]);
    }, 1500);
  };

  if (!user && !isPartner) return null;

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full ${isPartner ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'} text-black flex items-center justify-center hover:scale-105 transition-transform z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        {isPartner ? <Bot className="h-6 w-6 text-white" /> : <MessageSquare className="h-6 w-6" />}
        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-[#020617]"></span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 sm:bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 h-[500px] sm:h-[550px] max-h-[75vh] sm:max-h-[80vh] bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 shrink-0 bg-white/[0.02] rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`h-10 w-10 rounded-full ${isPartner ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'} flex items-center justify-center font-bold`}>
                {isPartner ? <Bot className="h-5 w-5" /> : "PR"}
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-400 rounded-full border-2 border-[#0f172a]"></div>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{isPartner ? "VelocityWealth AI" : "Parthasarathy R."}</h3>
              <p className={`text-[10px] ${isPartner ? 'text-indigo-400' : 'text-emerald-400'} font-bold uppercase tracking-wider`}>{isPartner ? "AI Assistant" : "Advisor • Online"}</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2 -mr-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#020617]/50">
          <div className="text-center text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Today</div>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                msg.sender === 'me' 
                  ? `${isPartner ? 'bg-indigo-500' : 'bg-emerald-500'} text-black rounded-br-none` 
                  : 'bg-white/5 border border-white/10 text-white rounded-bl-none'
              }`}>
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                <div className={`text-[10px] mt-2 font-bold ${msg.sender === 'me' ? 'text-black/60' : 'text-slate-500'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts (Partner Only) */}
        {isPartner && messages.length < 3 && (
          <div className="px-4 pb-2 bg-white/[0.02] overflow-x-auto whitespace-nowrap hide-scrollbar space-x-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="inline-block px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold hover:bg-indigo-500/20 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-white/[0.02] rounded-b-3xl">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything..."
              className={`w-full bg-white/[0.03] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-${isPartner ? 'indigo' : 'emerald'}-500 focus:ring-1 focus:ring-${isPartner ? 'indigo' : 'emerald'}-500 transition-all`}
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className={`absolute right-2 p-2 ${isPartner ? 'text-indigo-400 hover:text-indigo-300' : 'text-emerald-400 hover:text-emerald-300'} disabled:text-slate-600 disabled:cursor-not-allowed transition-colors`}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
