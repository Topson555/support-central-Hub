import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Clock, 
  ChevronRight, 
  Timer, 
  CheckCircle2, 
  Paperclip, 
  Sparkles,
  Send,
  MoreVertical,
  ExternalLink,
  PlusCircle,
  Cpu,
  Star
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { cn } from '../lib/utils';
import { mockTickets } from '../data/mockData';
import { AgentShell } from '../components/AgentShell';
import { api } from '../lib/api';
import { socket } from '../lib/socket';

function RatingForm({ ticketId, onRatingSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitRating = async () => {
    if (rating === 0) {
      setError('Please select a star rating between 1 and 5');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      const updated = await api.rateTicket(ticketId, {
        score: rating,
        feedback: comment
      });
      onRatingSubmitted(updated);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-xl">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Select Rating</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none focus:scale-110 transition-transform"
            >
              <Star 
                className={cn(
                  "h-8 w-8 transition-colors",
                  star <= (hoverRating || rating) ? "text-amber-500 fill-amber-400" : "text-slate-200"
                )} 
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-xs font-black text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-md ml-2 capitalize tracking-widest">{rating} Stars</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Feedback / Comments (Optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Let us know about your experience resolving this issue..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-semibold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none resize-none h-24 text-slate-900 placeholder:text-slate-300"
        />
      </div>

      <button
        onClick={submitRating}
        disabled={submitting || rating === 0}
        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 active:scale-95"
      >
        {submitting ? 'Submitting...' : 'Submit Resolution Feedback'}
      </button>
    </div>
  );
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [activeTab, setActiveTab] = useState('Reply to Customer');
  const [updating, setUpdating] = useState(false);

  // Parse user context from localStorage
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const tabs = currentUser?.role !== 'user' ? ['Reply to Customer', 'Internal Note'] : ['Reply to Customer'];

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      await api.updateTicket(id, { status });
      setTicket(prev => ({ ...prev, status }));
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  const dispatchResponse = async () => {
    if (!response.trim()) return;
    try {
      setUpdating(true);
      const isInternal = activeTab === 'Internal Note';
      const updatedTicket = await api.addReply(id, {
        body: response,
        isInternal
      });
      setTicket(updatedTicket);
      setResponse('');
    } catch (err) {
      console.error("Dispatch failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await api.getTicket(id);
        setTicket(data);
      } catch (err) {
        console.warn("Using mock data fallback:", err);
        const mockTicket = mockTickets.find(t => t.id === id) || mockTickets[0];
        setTicket(mockTicket);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  // Establish WebSockets bidirectional thread connection
  useEffect(() => {
    if (!id) return;

    const handleNewMessage = (newMessage) => {
      setTicket(prev => {
        if (!prev) return prev;
        
        // Prevent sync duplication loops
        const messages = prev.messages || [];
        const exists = messages.some(
          m => m._id === newMessage._id || (m.body === newMessage.body && m.senderEmail === newMessage.senderEmail)
        );
        if (exists) return prev;

        return {
          ...prev,
          messages: [...messages, newMessage]
        };
      });
    };

    const handleTicketUpdate = (updatedTicket) => {
      if (updatedTicket && (updatedTicket._id === id || updatedTicket.id === id)) {
        setTicket(updatedTicket);
      }
    };

    socket.on(`ticket:${id}:message`, handleNewMessage);
    socket.on("ticket:updated", handleTicketUpdate);

    return () => {
      socket.off(`ticket:${id}:message`, handleNewMessage);
      socket.off("ticket:updated", handleTicketUpdate);
    };
  }, [id]);

  if (loading) {
    return (
      <AgentShell title="Loading..." subtitle="Securely retrieving data">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 border-4 border-[#1034A6] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Syncing with encrypted mainframe...</p>
          </div>
        </div>
      </AgentShell>
    );
  }

  if (!ticket) return null;

  // Filter messages to hide internal notes from regular clients
  const visibleMessages = (ticket.messages || []).filter(msg => {
    if (!msg.isInternal) return true;
    return currentUser?.role !== 'user';
  });

  return (
    <AgentShell 
      title={`TICKET #${ticket._id?.substring(0,8).toUpperCase() || ticket.id}`} 
      subtitle={ticket.subject || ticket.title}
      actions={
        <div className="flex items-center gap-6">
           <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full border border-amber-200 shadow-sm">
              <Timer className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">SLA: 14m remaining</span>
           </div>
           {currentUser?.role !== 'user' ? (
             <div className="relative group">
                <select 
                  value={ticket.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  disabled={updating}
                  className="appearance-none bg-white border border-slate-200 text-[#1034A6] font-black text-[10px] uppercase tracking-[0.2em] rounded-xl px-6 py-3 pr-10 focus:ring-2 focus:ring-[#1034A6]/20 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                   <option value="open">Open Status</option>
                   <option value="pending">Pending Status</option>
                   <option value="resolved">Resolved Status</option>
                   <option value="closed">Closed Status</option>
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 h-3 w-3 text-slate-400 pointer-events-none" />
             </div>
           ) : (
             <div className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-[#D6E0F9] text-[#1034A6] rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm">
                Status: {ticket.status}
             </div>
           )}
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Communications */}
        <div className="xl:col-span-8 space-y-8 text-left">
           
           {/* Ticket Body Card */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm"
           >
              <div className="space-y-4 mb-10">
                 <h1 className="text-3xl font-black text-slate-900 leading-tight uppercase italic">{ticket.subject || ticket.title}</h1>
                 <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                       <Mail className="h-4 w-4 text-[#1034A6]" />
                       {ticket.email || ticket.customerEmail}
                    </div>
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-2">
                       <Clock className="h-4 w-4 text-[#1034A6]" />
                       Opened {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                 </div>
              </div>

              <div className="prose max-w-none text-slate-600 leading-relaxed font-bold text-lg bg-teal-50/20 p-8 rounded-3xl border border-teal-100/50">
                 <p className="whitespace-pre-line">{ticket.description}</p>
                 <p className="mt-8 font-black text-[#1034A6] uppercase italic tracking-widest text-sm">— {ticket.customer || ticket.customerName}</p>
              </div>
           </motion.div>

           {/* Rating Feedback Card */}
           {['resolved', 'closed'].includes(ticket.status?.toLowerCase()) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-8 rounded-[40px] border border-emerald-500/20 text-slate-800 space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white border border-emerald-100 rounded-2xl text-emerald-600 shadow-sm">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 leading-none mb-1">Support Quality Rating</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Help us improve our service quality</p>
                  </div>
                </div>

                {ticket.rating && ticket.rating.score ? (
                  // Display completed rating
                  <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={cn(
                            "h-6 w-6 transition-colors",
                            star <= ticket.rating.score ? "text-amber-500 fill-amber-400" : "text-slate-200"
                          )} 
                        />
                      ))}
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">({ticket.rating.score}/5 Stars)</span>
                    </div>
                    {ticket.rating.feedback && (
                      <p className="text-slate-600 text-sm font-semibold italic">"{ticket.rating.feedback}"</p>
                    )}
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Submitted on {new Date(ticket.rating.ratedAt || ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                ) : currentUser?.role === 'user' ? (
                  // Submit rating form (Only for customer)
                  <RatingForm ticketId={id} onRatingSubmitted={(updated) => setTicket(updated)} />
                ) : (
                  // Waiting for rating (For Agents)
                  <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm text-center py-6">
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">Awaiting customer resolution feedback</p>
                  </div>
                )}
              </motion.div>
           )}

           {/* Response Area */}
           <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="flex border-b border-slate-100 bg-slate-50/30">
                 {tabs.map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all",
                        activeTab === tab ? "text-[#1034A6] border-b-2 border-[#1034A6] bg-white italic" : "text-slate-400 hover:bg-slate-50"
                      )}
                    >
                       {tab}
                    </button>
                 ))}
              </div>
              <div className="p-10 space-y-8 text-left">
                 <textarea 
                   value={response}
                   onChange={(e) => setResponse(e.target.value)}
                   className="w-full bg-[#FAFBFF] border border-slate-200 rounded-[32px] p-8 text-md font-bold focus:bg-white focus:border-[#1034A6] focus:ring-4 focus:ring-[#1034A6]/5 transition-all outline-none resize-none min-h-[200px] text-slate-900 placeholder:text-slate-300 shadow-inner" 
                   placeholder={activeTab === 'Internal Note' ? "Draft an internal briefing memo for fellow support agents..." : "Formulate your response to the customer based on guidelines..."}
                 />
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <button className="p-4 bg-white text-slate-400 hover:text-[#1034A6] border border-slate-200 rounded-2xl transition-all shadow-sm">
                          <Paperclip className="h-6 w-6" />
                       </button>
                       <button className="p-4 bg-indigo-50 text-[#1034A6] hover:bg-indigo-100 rounded-2xl border border-indigo-100 transition-all shadow-sm">
                          <Sparkles className="h-6 w-6" />
                       </button>
                    </div>
                    <div className="flex items-center gap-6">
                       <button className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">Save Draft</button>
                       <button 
                        onClick={dispatchResponse}
                        disabled={updating || !response.trim()}
                        className="px-10 py-5 bg-[#1034A6] hover:bg-[#0E2D8E] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-4 italic disabled:opacity-50"
                       >
                          {updating ? 'Processing...' : 'Dispatch Communication'}
                          <Send className="h-4 w-4" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Activity log */}
           <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 px-2 flex items-center gap-6">
                 Transaction History
                 <div className="h-px flex-1 bg-slate-200 opacity-50" />
              </h3>

              <div className="space-y-8 px-2">
                 {visibleMessages.length === 0 ? (
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic py-4">No communication replies have been posted to this thread yet.</p>
                 ) : (
                   visibleMessages.map((msg, idx) => {
                     const isAgent = msg.senderRole !== 'user';
                     
                     let bubbleStyle = "bg-slate-50/50 border-slate-150";
                     let iconBg = "bg-slate-50 text-slate-600 border border-slate-200";
                     let authorColor = "text-slate-700";
                     let timeColor = "text-slate-400/60";
                     let IconComponent = Clock;

                     if (msg.isInternal) {
                       bubbleStyle = "bg-amber-50/30 border-amber-100/50";
                       iconBg = "bg-amber-50 text-amber-600 border border-amber-200";
                       authorColor = "text-amber-800";
                       timeColor = "text-amber-600/60";
                       IconComponent = MoreVertical;
                     } else if (isAgent) {
                       bubbleStyle = "bg-indigo-50/20 border-indigo-100/50";
                       iconBg = "bg-indigo-50 text-indigo-600 border border-[#CBD5E1]";
                       authorColor = "text-[#1034A6]";
                       timeColor = "text-indigo-400/60";
                       IconComponent = CheckCircle2;
                     } else {
                       bubbleStyle = "bg-[#FAFBFF] border-slate-100";
                       iconBg = "bg-teal-50 text-teal-600 border border-teal-200";
                       authorColor = "text-teal-800 font-bold";
                       timeColor = "text-teal-500/60";
                       IconComponent = Mail;
                     }

                     return (
                       <div key={msg._id || idx} className="relative pl-16">
                          <div className={cn("absolute left-0 top-0 w-10 h-10 rounded-2xl flex items-center justify-center z-10 shadow-sm", iconBg)}>
                             {msg.isInternal ? <IconComponent className="h-5 w-5 rotate-90" /> : <IconComponent className="h-5 w-5" />}
                          </div>
                          {idx < visibleMessages.length - 1 && <div className="absolute left-5 top-10 -bottom-10 w-px bg-slate-200" />}

                          <div className={cn("p-8 rounded-[32px] border shadow-sm", bubbleStyle)}>
                             <div className="flex justify-between mb-4 text-[10px] font-black uppercase tracking-widest">
                                <span className={authorColor}>
                                  {msg.senderName} ({msg.senderRole?.toUpperCase()})
                                  {msg.isInternal && <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md tracking-wider text-[9px]">Internal Note</span>}
                                </span>
                                <span className={cn("font-black italic", timeColor)}>{new Date(msg.createdAt).toLocaleString()}</span>
                             </div>
                             <p className="text-md font-medium text-slate-700 whitespace-pre-line leading-relaxed">
                                {msg.body}
                             </p>
                          </div>
                       </div>
                     );
                   })
                 )}
              </div>
           </div>
        </div>

        {/* Right Column: AI Insights & Data */}
        <div className="xl:col-span-4 space-y-8">
           
           {/* AI Insights Card */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-gradient-to-br from-[#1034A6] via-[#0E2D8E] to-[#0A2472] rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/10"
           >
              <div className="absolute -right-12 -top-12 text-white/5 group-hover:scale-110 transition-transform duration-1000">
                 <Cpu className="h-64 w-64" />
              </div>
              
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xl border border-white/10 shadow-inner">
                       <Sparkles className="h-5 w-5 text-indigo-200" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100 italic">Neural Engine Analysis</span>
                 </div>

                 <div className="space-y-10">
                    <div className="space-y-4">
                       <p className="text-[10px] uppercase font-black text-indigo-300/60 tracking-widest">Confidence Classification</p>
                       <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 shadow-sm">
                          {ticket.aiInsights?.suggestedCategory || ticket.category || 'Triage Pending'}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] uppercase font-black text-indigo-300/60 tracking-widest">Response Priority</p>
                       <div className="space-y-3">
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: "85%" }}
                               transition={{ duration: 1.5, ease: "easeOut" }}
                               className="h-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]" 
                             />
                          </div>
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-indigo-200">
                             <span>Urgency Level: 8.4</span>
                             <span className="text-red-400 animate-pulse italic">Immediate Action Required</span>
                          </div>
                       </div>
                    </div>

                    <div className="pt-10 border-t border-white/10">
                       <p className="text-md font-bold leading-relaxed italic text-indigo-50 opacity-90 first-letter:text-3xl first-letter:font-black first-letter:mr-1">
                          "{ticket.aiInsights?.suggestedResponse || 'Initial diagnostic report queued for analytical parsing.'}"
                       </p>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Customer Details Card */}
           <div className="bg-white rounded-[48px] border border-slate-200 shadow-sm overflow-hidden group">
              <div className="p-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Secure Identity Profile</h3>
                 <div className="flex items-center gap-6 mb-10">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                      className="w-20 h-20 rounded-[32px] object-cover border-4 border-slate-50 shadow-md group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0" 
                      alt="Customer" 
                    />
                    <div>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-2 italic">{ticket.customer || ticket.customerName}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">West Coast Hub · Tier 1</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-[#FAFBFF] rounded-[32px] border border-slate-100 flex flex-col gap-2">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Service Tier</p>
                       <p className="text-xs font-black text-[#1034A6] uppercase tracking-widest">Enterprise Plus</p>
                    </div>
                    <div className="p-6 bg-[#FAFBFF] rounded-[32px] border border-slate-100 flex flex-col gap-2">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Account LTV</p>
                       <p className="text-xs font-black text-slate-900 tracking-tighter tabular-nums">$12,450.00</p>
                    </div>
                 </div>
              </div>
              <button className="w-full py-8 bg-slate-50/50 hover:bg-[#1034A6] hover:text-white text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-t border-slate-100 transition-all flex items-center justify-center gap-4 italic">
                 Explore CRM Records
                 <ExternalLink className="h-4 w-4" />
              </button>
           </div>

           {/* Tags & Meta */}
           <div className="bg-white rounded-[48px] border border-slate-200 shadow-sm p-10 space-y-10">
              <div>
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">System Taxonomy</h3>
                    <button className="text-[#1034A6] hover:scale-125 transition-transform bg-indigo-50 p-2 rounded-xl border border-indigo-100 shadow-sm">
                       <PlusCircle className="h-5 w-5" />
                    </button>
                 </div>
                 <div className="flex flex-wrap gap-3">
                    {(ticket.tags || ['GENERAL', 'SUPPORT']).map((tag) => (
                       <span key={tag} className="px-5 py-2.5 bg-white shadow-sm text-slate-600 text-[9px] font-black uppercase tracking-[0.2em] border border-slate-200 rounded-2xl hover:border-[#1034A6] transition-all cursor-pointer italic">
                          {tag}
                       </span>
                    ))}
                 </div>
              </div>

              <div className="pt-10 border-t border-slate-100 space-y-6">
                 {[
                   { label: 'Assigned Agent', value: ticket.assignee || 'Unassigned' },
                   { label: 'Ingestion Point', value: 'API v4.2' },
                   { label: 'Network Origin', value: '192.168.1.45' }
                 ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-black">
                       <span className="text-slate-300 uppercase tracking-[0.3em]">{item.label}</span>
                       <span className="text-[#1034A6] uppercase italic tracking-widest">{item.value}</span>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </AgentShell>
  );
}
