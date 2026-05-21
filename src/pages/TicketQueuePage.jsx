import React, { useState, useEffect } from 'react';
import { AgentShell } from '../components/AgentShell';
import { Filter, RefreshCw, MoreVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import { socket, subscribeToTickets } from '../lib/socket';

export default function TicketQueuePage() {
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToTickets((update) => {
      if (update.type === 'CREATED') {
        setTickets(prev => [update.ticket, ...prev]);
      } else if (update.type === 'UPDATED') {
        setTickets(prev => prev.map(t => t._id === update.ticket._id ? update.ticket : t));
      } else if (update.type === 'DELETED') {
        setTickets(prev => prev.filter(t => t._id !== update.ticketId));
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AgentShell 
      title="Main Repository" 
      subtitle="The global queue of all active support requests."
      actions={
        <div className="flex items-center gap-4">
           <button 
             onClick={fetchTickets}
             className="flex items-center gap-2 px-6 py-3 bg-[#E9EDF7] hover:bg-slate-200 rounded-xl font-bold text-sm text-[#1034A6] transition-colors border border-slate-300/50 uppercase tracking-widest italic"
           >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Refresh
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-[#1034A6] hover:bg-[#0E2D8E] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest italic">
              Auto-Assign Next
           </button>
        </div>
      }
    >
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
         <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-[#FAFBFF]">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Active Queue
              <span className="px-2 py-0.5 bg-indigo-50 text-[#1034A6] text-[10px] rounded-md border border-indigo-100 tracking-widest">
                {tickets.length} TICKETS
              </span>
            </h3>
            {error && <span className="text-red-500 text-xs font-bold uppercase">{error}</span>}
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-100">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Urgency</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assigned To</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Age</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading && tickets.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center font-bold text-slate-300 uppercase tracking-widest">Loading records...</td>
                    </tr>
                  ) : tickets.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center font-bold text-slate-300 uppercase tracking-widest">No tickets found</td>
                    </tr>
                  ) : tickets.map((t) => (
                    <tr key={t._id} className="group hover:bg-[#F8FAFF] transition-colors cursor-pointer" onClick={() => window.location.href = `/ticket/${t._id}`}>
                       <td className="px-8 py-6">
                          <span className="font-bold text-sm text-[#1034A6]">{t._id}</span>
                       </td>
                       <td className="px-8 py-6">
                          <span className="font-black text-slate-900 text-sm leading-tight">{t.subject}</span>
                       </td>
                       <td className="px-8 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm",
                            t.priority === 'urgent' || t.priority === 'high' ? "bg-red-50 border-red-200 text-red-600" :
                            "bg-indigo-50 border-indigo-200 text-[#1034A6]"
                          )}>
                             {t.priority}
                          </span>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.assignee}</span>
                       </td>
                       <td className="px-8 py-6 text-right font-black text-slate-400 tabular-nums">
                          {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-white text-slate-400 font-bold text-xs uppercase tracking-widest">
            Last updated: {new Date().toLocaleTimeString()}
         </div>
      </div>
    </AgentShell>
  );
}
