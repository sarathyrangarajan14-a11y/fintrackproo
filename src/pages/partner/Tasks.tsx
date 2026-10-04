import { useState, useEffect } from "react";
import { CheckSquare, AlertCircle, Clock, CheckCircle2, User, Phone, Mail, Plus, Search, Calendar, FileText } from "lucide-react";
import { auth } from "../../lib/firebase";
import { getAuthHeaders } from "../../lib/auth-helpers";
import PendingSips from "../../components/PendingSips";

export default function Tasks() {
  const [activeTab, setActiveTab] = useState('Tasks');
  const [stats, setStats] = useState({ totalClients: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/partner/stats", { headers });
        if (res.ok) {
          setStats(await res.json());
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchStats();
    });
    return () => unsubscribe();
  }, []);

  const hasClients = stats.totalClients > 0;
  
  const tasks: any[] = [];

  const opportunities: any[] = [];

  return (
    <div className="space-y-6 relative z-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">CRM & Opportunities</h2>
          <p className="text-slate-400">Manage daily tasks and uncover automated business opportunities.</p>
        </div>
        <button className="flex items-center bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Plus className="w-5 h-5 mr-2" /> New Task
        </button>
      </div>

      <div className="flex space-x-2 border-b border-white/10 pb-4 mb-6">
        <button 
          onClick={() => setActiveTab('Tasks')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'Tasks' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}
        >
          My Tasks ({tasks.length})
        </button>
        <button 
          onClick={() => setActiveTab('Opportunities')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'Opportunities' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}
        >
          Smart Opportunities ({opportunities.length})
        </button>
        <button 
          onClick={() => setActiveTab('SIP Approvals')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'SIP Approvals' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}
        >
          SIP Approvals
        </button>
      </div>

      {activeTab === 'Tasks' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Task List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              
              {loading ? (
                <div className="text-slate-400 font-bold py-8 text-center">Loading...</div>
              ) : tasks.length === 0 ? (
                <div className="text-slate-400 py-12 text-center bg-white/[0.02] rounded-[24px] border border-white/5 border-dashed">
                  <CheckSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="font-bold">No tasks to display.</p>
                  <p className="text-sm mt-1">Once clients register, their tasks will appear here.</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors p-5 rounded-2xl flex items-start gap-4">
                    <button className="mt-1 w-6 h-6 rounded-md border-2 border-slate-500 hover:border-emerald-500 hover:bg-emerald-500/20 flex flex-shrink-0 transition-colors"></button>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-white text-base">{task.title}</h4>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${task.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <span className="flex items-center text-xs text-slate-400 font-bold"><User className="w-3 h-3 mr-1" /> {task.client}</span>
                        <span className="flex items-center text-xs text-slate-400 font-bold"><Calendar className="w-3 h-3 mr-1" /> {task.due}</span>
                        <span className="flex items-center text-xs text-slate-400 font-bold bg-white/5 px-2 py-0.5 rounded">{task.type}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sidebar Summary */}
            <div className="space-y-6">
               <div className="bg-white/[0.04] border border-white/10 p-6 rounded-[32px]">
                 <h3 className="text-white font-bold mb-4 flex items-center"><Clock className="w-5 h-5 mr-2 text-emerald-400" /> Upcoming Deadlines</h3>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400 font-bold">Today</span>
                     <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs">{tasks.length > 0 ? 1 : 0}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400 font-bold">Tomorrow</span>
                     <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs">{tasks.length > 0 ? 1 : 0}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400 font-bold">This Week</span>
                     <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs">{tasks.length > 0 ? 1 : 0}</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Opportunities' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-[32px] mb-8 flex items-start gap-4">
             <AlertCircle className="h-6 w-6 text-indigo-400 shrink-0 mt-0.5" />
             <div>
               <h4 className="text-white font-bold mb-2">AI-Driven Opportunity Engine</h4>
               <p className="text-sm text-indigo-200/70 leading-relaxed">
                 FinTrackPro automatically scans your client portfolios to detect idle cash, missed tax-saving limits, SIP step-up possibilities, and portfolio imbalances.
                </p>
             </div>
           </div>

           {loading ? (
             <div className="text-slate-400 font-bold py-8 text-center">Scanning portfolios...</div>
           ) : opportunities.length === 0 ? (
             <div className="text-slate-400 py-12 text-center bg-white/[0.02] rounded-[24px] border border-white/5 border-dashed">
               <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
               <p className="font-bold">No opportunities detected.</p>
               <p className="text-sm mt-1">Register clients to start receiving automated suggestions.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {opportunities.map((opp) => (
                 <div key={opp.id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col h-full">
                   <div className="mb-4">
                     <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider inline-block mb-3">
                       {opp.type}
                     </span>
                     <h4 className="font-bold text-white text-lg leading-tight mb-2">{opp.title}</h4>
                     <p className="text-sm text-slate-400">{opp.desc}</p>
                   </div>
                   <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
                     <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-500 uppercase">Client</span>
                       <span className="text-sm font-bold text-white">{opp.client}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-500 uppercase">Potential</span>
                       <span className="text-sm font-bold text-emerald-400">{opp.potential}</span>
                     </div>
                     <button className="w-full mt-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl text-white text-sm font-bold transition-colors">
                       Create Task & Notify
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}

      {activeTab === 'SIP Approvals' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <PendingSips />
        </div>
      )}
    </div>
  );
}
