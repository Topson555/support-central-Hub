import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AgentShell } from '../components/AgentShell';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  ArrowUpRight, 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { api } from '../lib/api';

export default function ReportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await api.getTickets();
      setTickets(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load metrics:", err);
      setError("Failed to load live metric stream.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Compute metrics based on live DB entries
  const total = tickets.length;
  const solved = tickets.filter(t => ['resolved', 'closed', 'Resolved', 'Closed'].includes(t.status)).length;
  const pending = tickets.filter(t => ['pending', 'Pending'].includes(t.status)).length;
  const open = tickets.filter(t => ['open', 'Open'].includes(t.status)).length;

  const ratedTickets = tickets.filter(t => t.rating && t.rating.score);
  const totalRatingsCount = ratedTickets.length;
  const avgRating = totalRatingsCount > 0 
    ? (ratedTickets.reduce((acc, t) => acc + t.rating.score, 0) / totalRatingsCount).toFixed(1)
    : "0.0";

  const highRatingsCount = ratedTickets.filter(t => t.rating.score >= 4).length;
  const satisfactionRate = totalRatingsCount > 0
    ? ((highRatingsCount / totalRatingsCount) * 100).toFixed(1)
    : "100.0";

  // Category counts
  const categories = ['Technical Support', 'Billing Inquiry', 'Feature Request', 'Account Access'];
  const categoryDistribution = categories.map(cat => {
    const count = tickets.filter(t => t.category === cat).length;
    const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
    return { name: cat, count, percentage };
  });

  return (
    <AgentShell 
      title="Analytics Engine" 
      subtitle="Performance metrics, routing throughput, and customer satisfaction."
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-650 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider mb-8">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { 
            icon: Clock, 
            label: 'Response SLA', 
            val: '11m 32s', 
            trend: 'Speedy Resolve', 
            color: 'text-emerald-500',
            bg: 'bg-emerald-50/20 border-emerald-100',
            iconColor: 'text-emerald-555'
          },
          { 
            icon: BarChart3, 
            label: 'Tickets Solved', 
            val: `${solved} / ${total}`, 
            trend: `${total - solved} active cases`, 
            color: 'text-[#1034A6]',
            bg: 'bg-indigo-50/20 border-indigo-150',
            iconColor: 'text-[#1034A6]'
          },
          { 
            icon: Users, 
            label: 'Avg Response Rating', 
            val: `${avgRating} ★`, 
            trend: `${totalRatingsCount} ratings registered`, 
            color: 'text-amber-500',
            bg: 'bg-amber-50/20 border-amber-100',
            iconColor: 'text-amber-555'
          },
          { 
            icon: TrendingUp, 
            label: 'Satisfaction index', 
            val: `${satisfactionRate}%`, 
            trend: 'Optimised', 
            color: 'text-[#1034A6]',
            bg: 'bg-purple-50/20 border-purple-100',
            iconColor: 'text-[#1034A6]'
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
             <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-50 text-[#1034A6] rounded-xl border border-slate-100">
                   <stat.icon className="h-6 w-6" />
                </div>
                <div className={cn("text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl border-dashed border", stat.bg, stat.color)}>
                   {stat.trend}
                </div>
             </div>
             <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{loading ? '...' : stat.val}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Category Triage Efficiency and Routing Bar list */}
        <div className="lg:col-span-6 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8 text-left">
          <div className="space-y-1.5 border-b border-slate-100 pb-5">
             <h3 className="text-xl font-black text-slate-900 uppercase italic">Routing Breakdown</h3>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Inbound Case Classification distribution</p>
          </div>

          <div className="space-y-6">
            {loading ? (
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic py-10">Parsing distributions...</p>
            ) : total === 0 ? (
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic py-10">No cases found in database.</p>
            ) : (
              categoryDistribution.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-slate-650">{item.name}</span>
                     <span className="text-[#1034A6]">{item.count} tickets ({item.percentage}%)</span>
                  </div>
                  <div className="h-3.5 bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${item.percentage}%` }}
                       transition={{ duration: 1.2, ease: "easeOut" }}
                       className="h-full bg-gradient-to-r from-[#1034A6] to-[#4068E0] rounded-full shadow-inner"
                     />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Satisfaction Feed / Feedbacks log (Algorithm 4 Output) */}
        <div className="lg:col-span-6 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8 text-left">
          <div className="space-y-1.5 border-b border-slate-100 pb-5">
             <h3 className="text-xl font-black text-slate-900 uppercase italic">Quality Audit Stream</h3>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Persisted customer satisfaction remarks</p>
          </div>

          <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic py-10">Syncing database feed...</p>
            ) : ratedTickets.length === 0 ? (
              <div className="py-12 text-center text-slate-400 italic font-bold text-xs uppercase tracking-widest bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                Awaiting resolution ratings from customers.
              </div>
            ) : (
              ratedTickets.map((t, idx) => (
                <div key={t._id || idx} className="p-6 bg-slate-50/50 hover:bg-slate-55 border border-slate-150 rounded-2xl transition-all space-y-2 relative">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#1034A6] uppercase tracking-wider line-clamp-1">{t.subject}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">By: {t.customer || t.email}</p>
                    </div>
                    <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 text-amber-600 px-2 py-0.5 rounded-lg text-[9px] font-black">
                       <span>{t.rating.score}</span>
                       <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    </div>
                  </div>
                  {t.rating.feedback && (
                    <p className="text-xs font-semibold text-slate-600 italic">"{t.rating.feedback}"</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </AgentShell>
  );
}
