import { 
  PlusCircle, 
  Ticket as TicketIcon, 
  CheckCircle2,
  RefreshCw,
  MoreVertical,
  ClipboardList,
  Info,
  MessageSquare,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { cn } from '../lib/utils';
import { AgentShell } from '../components/AgentShell';
import { fetchApi } from '../lib/api';

// Socket connection
let socket;

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0
  });
  
  const navigate = useNavigate();

  const calculateStats = useCallback((data) => {
    const total = data.length;
    const open = data.filter(t => ['open', 'pending', 'Open', 'Pending'].includes(t.status)).length;
    const resolved = data.filter(t => ['resolved', 'closed', 'Resolved', 'Closed'].includes(t.status)).length;
    setStats({ total, open, resolved });
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/api/tickets');
      setTickets(data);
      calculateStats(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    fetchTickets();

    // Initialize socket
    try {
      socket = io();

      socket.on('ticket:created', (newTicket) => {
        setTickets(prev => {
          // If user is a regular user, only add if it belongs to them
          const currentStoredUser = localStorage.getItem('user');
          if (currentStoredUser) {
            const u = JSON.parse(currentStoredUser);
            if (u.role === 'user' && newTicket.email !== u.email) return prev;
          }
          const next = [newTicket, ...prev];
          calculateStats(next);
          return next;
        });
      });

      socket.on('ticket:updated', (updatedTicket) => {
        setTickets(prev => {
          const next = prev.map(t => t._id === updatedTicket._id ? updatedTicket : t);
          calculateStats(next);
          return next;
        });
      });

      socket.on('ticket:deleted', (deletedId) => {
        setTickets(prev => {
          const next = prev.filter(t => t._id !== deletedId);
          calculateStats(next);
          return next;
        });
      });
    } catch (e) {
      console.warn("Socket initialization issue:", e.message);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [calculateStats]);

  const updateTicketStatus = async (id, status) => {
    try {
      // Optimistic update
      setTickets(prev => {
        const next = prev.map(t => t._id === id ? { ...t, status } : t);
        calculateStats(next);
        return next;
      });
      
      await fetchApi(`/api/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error("Update error:", err);
      // Revert on error
      fetchTickets();
    }
  };

  return (
    <AgentShell 
      title={user?.role === 'user' ? "My Support Hub" : "Command Center"} 
      subtitle={user?.role === 'user' ? "Track your active inquiries and support history." : "Real-time overview of your support ecosystem."}
      actions={
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchTickets}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-lg font-bold text-xs text-slate-600 transition-all border border-slate-200"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </button>
          <Link 
            to={user?.role === 'user' ? "/submit" : "/dashboard/create"} 
            className="flex items-center gap-2 px-5 py-2 bg-[#1034A6] hover:bg-[#0E2D8E] text-white rounded-lg font-bold text-xs transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            {user?.role === 'user' ? "Submit New Inquiry" : "New Ticket"}
          </Link>
        </div>
      }
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Total Tickets */}
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
               <div className="p-2.5 bg-indigo-50 text-[#1034A6] rounded-xl border border-indigo-100">
                 <TicketIcon className="h-5 w-5" />
               </div>
               <span className="text-xs font-medium text-slate-500">{user?.role === 'user' ? 'Account History' : 'Live Database'}</span>
            </div>
            <div className="space-y-1 text-left">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Cases</p>
               <p className="text-4xl font-sans font-bold text-slate-900 tracking-tight">{stats.total}</p>
            </div>
         </div>

         {/* Pending / Open */}
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group border-r-4 border-r-red-500">
            <div className="flex items-center justify-between mb-8">
               <div className="p-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100">
                 <ClipboardList className="h-5 w-5" />
               </div>
               <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-2.5 py-1 rounded-md tracking-wider">Active</span>
            </div>
            <div className="space-y-1 text-left">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Action</p>
               <p className="text-4xl font-sans font-bold text-slate-900 tracking-tight">{stats.open}</p>
            </div>
         </div>

         {/* Resolved */}
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
               <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                 <CheckCircle2 className="h-5 w-5" />
               </div>
               <span className="text-xs font-medium text-slate-500">{user?.role === 'user' ? 'Case Resolution' : 'Global Resolution'}</span>
            </div>
            <div className="space-y-1 text-left">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Resolved</p>
               <p className="text-4xl font-sans font-bold text-slate-900 tracking-tight">{stats.resolved}</p>
            </div>
         </div>
      </div>

      {/* Ticket Management Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
         <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{user?.role === 'user' ? 'Recent Inquiries' : 'Ticket Management'}</h3>
            <div className="flex items-center gap-4">
               <button className="text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical className="h-5 w-5" /></button>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-50">
                     <th className="pl-12 pr-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ticket ID</th>
                     <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Customer / Title</th>
                     <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                     <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Assignee</th>
                     <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                     <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right pr-12">Date</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center text-slate-400 font-medium tracking-widest uppercase text-[10px]">Syncing with mainframe...</td>
                    </tr>
                  ) : tickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center text-slate-400 font-medium">No records found.</td>
                    </tr>
                  ) : tickets.map((t) => (
                    <tr 
                      key={t._id} 
                      onClick={() => navigate(`/ticket/${t._id}`)}
                      className="group hover:bg-slate-50/50 transition-all cursor-pointer relative" 
                    >
                       <td className="pl-12 pr-6 py-6 font-mono text-xs text-[#1034A6] font-bold">
                          #{t._id.substring(t._id.length - 8).toUpperCase()}
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex flex-col text-left">
                             <span className="font-bold text-slate-900 text-sm group-hover:text-[#1034A6] transition-colors line-clamp-1">{t.subject}</span>
                             <span className="text-[11px] font-medium text-slate-500 mt-1">{t.customer || t.email}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6 text-sm text-slate-600 font-medium">{t.category}</td>
                       <td className="px-6 py-6 italic">
                          <div className="flex items-center gap-2">
                             <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase">
                                {t.assignee ? t.assignee[0] : 'U'}
                             </div>
                             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{t.assignee || 'Unassigned'}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6" onClick={(e) => e.stopPropagation()}>
                         {user?.role === 'user' ? (
                           <div className={cn(
                             "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border w-fit mx-auto",
                             (t.status?.toLowerCase() === 'open') ? "text-red-600 bg-red-50 border-red-100" :
                             (t.status?.toLowerCase() === 'pending') ? "text-indigo-600 bg-indigo-50 border-indigo-100" :
                             "text-emerald-500 bg-emerald-50 border-emerald-100"
                           )}>
                             {t.status}
                           </div>
                         ) : (
                           <select 
                             value={t.status}
                             onChange={(e) => updateTicketStatus(t._id, e.target.value)}
                             className={cn(
                               "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border outline-none cursor-pointer hover:shadow-sm transition-all",
                               (t.status?.toLowerCase() === 'open') ? "text-red-600 bg-red-50 border-red-100" :
                               (t.status?.toLowerCase() === 'pending') ? "text-indigo-600 bg-indigo-50 border-indigo-100" :
                               "text-emerald-500 bg-emerald-50 border-emerald-100"
                             )}
                           >
                             <option value="open">Open</option>
                             <option value="pending">Pending</option>
                             <option value="resolved">Resolved</option>
                             <option value="closed">Closed</option>
                           </select>
                         )}
                       </td>
                       <td className="px-6 py-6 text-right pr-12">
                          <div className="flex flex-col items-end">
                             <span className="text-sm font-medium text-slate-600">
                               {new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                             </span>
                             <span className="text-[10px] font-bold mt-1 text-slate-400 uppercase tracking-widest">
                               {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="px-10 py-6 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Showing {tickets.length} of {stats.total} records
            </span>
            <div className="flex items-center gap-2">
               <button onClick={() => {}} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-30"><ChevronLeft className="h-4 w-4 text-slate-400" /></button>
               <button onClick={() => {}} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-30"><ChevronRight className="h-4 w-4 text-slate-400" /></button>
            </div>
         </div>
      </div>


      {(user?.role === 'agent' || user?.role === 'admin') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
           {/* Internal Memo */}
           <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-10 flex flex-col justify-between">
              <div className="space-y-8 text-left">
                 <h3 className="text-xl font-bold text-slate-900 tracking-tight">Internal Memo</h3>
                 <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-8 flex items-start gap-6">
                    <div className="p-2.5 bg-white border border-indigo-100 rounded-xl text-[#1034A6] shadow-sm shrink-0">
                       <Info className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                       <h4 className="font-bold text-[#1034A6] text-base">System Maintenance Schedule</h4>
                       <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                          Scheduled maintenance for the API Gateway will occur this Saturday at 02:00 AM UTC. Expect intermittent delays in ticket syncing for roughly 45 minutes. Please notify enterprise clients if active integrations are affected.
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Active Agents */}
           <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-10 space-y-8 text-left">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Active Agents</h3>
              <div className="space-y-6">
                 {[
                   { name: 'Sarah J.', status: 'Handling 4 tickets', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', online: true },
                   { name: 'Marcus T.', status: 'On a Break', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', online: true },
                 ].map((agent, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="relative">
                            <img src={agent.avatar} className="w-12 h-12 rounded-full border border-slate-200 object-cover" alt={agent.name} />
                            {agent.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{agent.name}</span>
                            <span className="text-[11px] font-medium text-slate-500">{agent.status}</span>
                         </div>
                      </div>
                      <button className="p-2.5 text-slate-400 hover:text-[#1034A6] hover:bg-slate-50 rounded-xl transition-all">
                         <MessageSquare className="h-5 w-5" />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

    </AgentShell>
  );
}
