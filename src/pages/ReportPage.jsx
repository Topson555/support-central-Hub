import React from 'react';
import { AgentShell } from '../components/AgentShell';
import { BarChart3, TrendingUp, Clock, Users, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ReportPage() {
  return (
    <AgentShell 
      title="Analytics Engine" 
      subtitle="Performance metrics and system throughput analysis."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Clock, label: 'Avg Resolution', val: '14m 22s', trend: '+2.4%', color: 'text-emerald-500' },
          { icon: BarChart3, label: 'Tickets Solved', val: '1,156', trend: '+12%', color: 'text-[#1034A6]' },
          { icon: Users, label: 'Satisfaction', val: '94.2%', trend: '+0.8%', color: 'text-emerald-500' },
          { icon: TrendingUp, label: 'System Load', val: 'Low', trend: '-15%', color: 'text-indigo-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
             <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-50 text-[#1034A6] rounded-xl border border-slate-100">
                   <stat.icon className="h-6 w-6" />
                </div>
                <div className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-1", stat.color)}>
                   {stat.trend} <ArrowUpRight className="h-3 w-3" />
                </div>
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm h-[400px] flex items-center justify-center text-center">
         <div className="max-w-md space-y-4">
            <div className="w-16 h-16 bg-[#F1F3F9] rounded-2xl flex items-center justify-center text-slate-300 mx-auto border border-slate-200">
               <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic underline underline-offset-4 decoration-[#1034A6]">Data Visualisation Module</h3>
            <p className="text-slate-500 font-bold text-sm">Interactive charts and heatmap visualisations are currently being generated for the weekly performance review cycle.</p>
         </div>
      </div>
    </AgentShell>
  );
}
