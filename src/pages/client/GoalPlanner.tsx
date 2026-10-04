import { useState, useEffect } from "react";
import { Target, Plus, CheckCircle2, Circle, Trophy, Plane, Home, GraduationCap, Car, X, Loader2 } from "lucide-react";
import { auth } from "../../lib/firebase";

const ICONS = {
  Home,
  Plane,
  GraduationCap,
  Car,
  Trophy
};

export default function GoalPlanner() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "Trophy",
    targetAmount: "",
    currentSavings: "0",
    targetDate: ""
  });
  
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchGoals(user);
      } else {
        setGoals([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchGoals = async (user = auth.currentUser) => {
    try {
      if (!user) return;
      setLoading(true);
      const token = await user.getIdToken();
      
      const res = await fetch("/api/client/goals", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error("Failed to fetch goals");
      
      const data = await res.json();
      setGoals(data);
    } catch (error) {
      console.error(error);
      setNotification({ message: "Failed to load goals", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      
      const res = await fetch("/api/client/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          targetAmount: Number(formData.targetAmount),
          currentSavings: Number(formData.currentSavings)
        })
      });
      
      if (!res.ok) throw new Error("Failed to create goal");
      
      await fetchGoals();
      setIsModalOpen(false);
      setFormData({ name: "", type: "Trophy", targetAmount: "", currentSavings: "0", targetDate: "" });
      setNotification({ message: "Goal created successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      setNotification({ message: "Failed to create goal", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num || 0);
  };

  const calculateProgress = (current: string | number, target: string | number) => {
    const c = typeof current === 'string' ? parseFloat(current) : current;
    const t = typeof target === 'string' ? parseFloat(target) : target;
    if (!t) return 0;
    return Math.min(Math.round((c / t) * 100), 100);
  };

  return (
    <div className="flex-1 p-4 md:p-8 relative z-10 min-h-[70vh]">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl border font-bold shadow-2xl transition-all flex items-center gap-3 ${
          notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <X className="h-5 w-5" />}
          {notification.message}
          <button onClick={() => setNotification(null)} className="ml-4 hover:opacity-70"><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Target className="h-8 w-8 text-emerald-400" />
              Goal Planner
            </h1>
            <p className="text-slate-400 mt-2">Set financial targets and track your progress</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-black hover:bg-slate-200 transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" /> New Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
              <p className="font-bold">Loading your financial goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white/[0.02] rounded-[32px] border border-white/5">
              <Target className="h-12 w-12 mx-auto text-slate-500 mb-4 opacity-50" />
              <p className="font-bold text-lg text-white mb-2">No goals set yet</p>
              <p className="text-sm">Click 'New Goal' to start planning your financial future.</p>
            </div>
          ) : (
            goals.map((goal) => {
              const Icon = ICONS[goal.type as keyof typeof ICONS] || Trophy;
              const progress = calculateProgress(goal.currentSavings, goal.targetAmount);
              
              return (
                <div key={goal.id} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 rounded-[32px] flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-white/10 p-3 rounded-2xl text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full">
                      {new Date(goal.targetDate).getFullYear()}
                    </span>
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white mb-1">{goal.name}</h3>
                    <p className="text-sm font-bold text-emerald-400 mb-6">
                      Target: {formatCurrency(goal.targetAmount)}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-white">{formatCurrency(goal.currentSavings)}</span>
                        <span className="text-slate-400">{progress}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-emerald-400 h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase">Shortfall</span>
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(Math.max(0, parseFloat(goal.targetAmount) - parseFloat(goal.currentSavings)))}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* New Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl sm:max-w-3xl rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900 p-5 sm:p-6 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:bg-white/5 hover:text-white rounded-full transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Create New Financial Goal</h2>
              <p className="text-xs text-slate-400">Map your wealth creation target with inflation-adjusted milestones.</p>
            </div>
            
            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              {/* Row 1: Goal Name & Icon Category */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-7">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Goal Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. Buy Luxury Apartment"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Goal Category Icon</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {Object.keys(ICONS).map(iconName => (
                      <option key={iconName} value={iconName}>{iconName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Target Amount, Current Savings, Target Date in 3 horizontal columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">₹</span>
                    <input 
                      type="number" 
                      required
                      min="1000"
                      value={formData.targetAmount}
                      onChange={e => setFormData({...formData, targetAmount: e.target.value})}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-7 pr-3 py-2.5 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="15000000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Savings (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">₹</span>
                    <input 
                      type="number" 
                      min="0"
                      value={formData.currentSavings}
                      onChange={e => setFormData({...formData, currentSavings: e.target.value})}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-7 pr-3 py-2.5 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.targetDate}
                    onChange={e => setFormData({...formData, targetDate: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-900 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Financial Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
