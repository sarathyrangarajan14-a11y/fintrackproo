import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { SchemeDetailData } from '../../services/schemeDetails.service';

interface SchemeFaqAccordionProps {
  faqs: SchemeDetailData['faqs'];
}

export default function SchemeFaqAccordion({ faqs }: SchemeFaqAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => {
        const isOpen = expandedIndex === idx;

        return (
          <div 
            key={idx} 
            className="bg-[#0b1120] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggleFaq(idx)}
              className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-200 hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{faq.q}</span>
              </span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>
            
            {isOpen && (
              <div className="px-5 pb-5 pt-0 text-xs text-slate-400 leading-relaxed bg-slate-950/20 border-t border-white/[0.02] animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="pt-3">{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
