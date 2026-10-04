import React from 'react';
import { ShieldCheck, Calendar } from 'lucide-react';
import { SchemeDetailData } from '../../services/schemeDetails.service';

interface FundManagersListProps {
  managers: SchemeDetailData['fundManagers'];
}

export default function FundManagersList({ managers }: FundManagersListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {managers.map((m, idx) => {
        // Compute manager name initials
        const initials = m.name
          .split(' ')
          .map(word => word[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();

        return (
          <div 
            key={idx} 
            className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 flex items-start gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/[0.01] transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-sky-500/10 border border-white/10 flex items-center justify-center font-black text-emerald-400 text-sm tracking-widest uppercase shrink-0">
              {initials}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <h4 className="text-sm font-black text-white truncate tracking-tight">{m.name}</h4>
              <p className="text-xs text-slate-400 font-bold leading-tight">{m.role}</p>
              
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wider pt-1 border-t border-white/[0.03]">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">Tenure: {m.tenure}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
