import React, { useState, useEffect } from 'react';
import { History, ArrowDownRight, PauseCircle, PlayCircle, Clock } from 'lucide-react';
import { auth } from '../lib/firebase';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch("/api/client/transactions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (err) {
        console.error("Error fetching transactions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'SELL':
        return <ArrowDownRight className="w-5 h-5 text-emerald-400" />;
      case 'SIP_STOP':
        return <PauseCircle className="w-5 h-5 text-red-400" />;
      case 'SIP_SKIP':
        return <PlayCircle className="w-5 h-5 text-amber-500" />;
      default:
        return <History className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTransactionTitle = (type: string) => {
    switch (type) {
      case 'SELL': return 'Redemption';
      case 'SIP_STOP': return 'SIP Stopped';
      case 'SIP_SKIP': return 'SIP Skipped';
      default: return type;
    }
  };

  const formatInr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format;

  if (loading) {
    return (
      <div className="bg-[#1a2035] border border-[#1e2437] rounded-[24px] p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700/50 rounded w-1/4 mx-auto"></div>
          <div className="h-16 bg-slate-700/30 rounded-xl"></div>
          <div className="h-16 bg-slate-700/30 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#111625] border border-[#1e2437] rounded-[24px] overflow-hidden mt-8">
      <div className="p-6 border-b border-[#1e2437] flex justify-between items-center bg-[#1a2035]">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-[#8b95a5]" />
          Recent Activity
        </h3>
      </div>
      
      <div className="divide-y divide-[#1e2437]">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#1a2035] transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1e2437] flex items-center justify-center shrink-0">
                {getTransactionIcon(tx.type)}
              </div>
              <div>
                <h4 className="text-white font-bold">{getTransactionTitle(tx.type)}</h4>
                <p className="text-sm text-[#8b95a5] mt-0.5">{tx.schemeCode}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {tx.orderId}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="sm:text-right pl-14 sm:pl-0">
              <p className="text-lg font-bold text-white">
                {tx.amount ? formatInr(Number(tx.amount)) : '-'}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#8b95a5] mt-1 sm:justify-end">
                <Clock className="w-3.5 h-3.5" />
                {new Date(tx.transactionDate).toLocaleString('en-GB', { 
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
