import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Ticket as TicketIcon, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Star,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';

export default function PublicTicketPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isRated, setIsRated] = useState(false);

  useEffect(() => {
    // Mock fetch for public view
    const mockTicket = {
      id: id || 'TKT-7742',
      subject: 'Dashboard access latency in EMEA region',
      status: 'resolved', // Set to resolved to show rating feature
      category: 'Technical Support',
      description: 'We are seeing significant delays when loading the main dashboard specifically from our London and Berlin offices. Other regions seem fine.',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updates: [
        { date: new Date(Date.now() - 86400000).toISOString(), message: 'Technician assigned to investigate server logs.' },
        { date: new Date(Date.now() - 43200000).toISOString(), message: 'Issue identified: CDN cache mismatch in Western Europe. Fix being deployed.' },
        { date: new Date(Date.now() - 3600000).toISOString(), message: 'Fix verified. Ticket marked as Resolved. Please let us know if the issue persists.' },
      ]
    };
    setTicket(mockTicket);
  }, [id]);

  const handleRate = (value) => {
    setRating(value);
    setIsRated(true);
    // In a real app, this would hit the API
  };

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
             <div className="bg-[#1034A6] p-2 rounded-lg">
                <TicketIcon className="h-4 w-4 text-white" />
             </div>
             <span className="text-lg font-bold text-slate-900 italic uppercase tracking-tight">SupportHub</span>
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
             <ShieldCheck className="h-3 w-3" /> Encrypted View
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 mt-12">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#1034A6] transition-colors mb-8 group">
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          BACK TO HOME
        </Link>

        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          {/* Status Header */}
          <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#1034A6] uppercase tracking-[0.2em]">Reference: {ticket.id}</span>
              <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">{ticket.subject}</h1>
            </div>
            <div className={cn(
              "px-6 py-3 rounded-2xl border font-black text-xs uppercase tracking-widest flex items-center gap-3",
              ticket.status === 'resolved' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-blue-50 border-blue-100 text-[#1034A6]"
            )}>
              {ticket.status === 'resolved' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4 animate-pulse" />}
              {ticket.status}
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Description */}
            <div className="space-y-4">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <MessageSquare className="h-3.5 w-3.5" /> Initial Request
               </h3>
               <p className="text-slate-600 text-sm leading-relaxed font-medium bg-slate-50 p-8 rounded-3xl border border-slate-100">
                 {ticket.description}
               </p>
            </div>

            {/* Step 4: Rating Feature */}
            {ticket.status === 'resolved' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-indigo-50 border border-indigo-100 rounded-[32px] p-8 text-center space-y-6"
              >
                <div>
                   <h3 className="text-lg font-black text-slate-900 uppercase italic">Rate our Support Quality</h3>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Algorithm Step 4: Final Evaluation</p>
                </div>

                {!isRated ? (
                  <div className="flex items-center justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => handleRate(star)}
                        className="transition-all transform hover:scale-125 hover:-translate-y-1"
                      >
                        <Star 
                          className={cn(
                            "h-10 w-10 transition-colors",
                            (hoveredRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                          )} 
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={cn("h-6 w-6", s <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200")} />
                      ))}
                    </div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Thank you for your feedback!</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Timeline */}
            <div className="space-y-8">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Update Timeline</h3>
              <div className="space-y-8 border-l-2 border-slate-100 pl-8 ml-2">
                {ticket.updates.map((update, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-white border-2 border-[#1034A6]" />
                    <span className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-tighter">
                      {new Date(update.date).toLocaleString()}
                    </span>
                    <p className="text-sm font-bold text-slate-700">{update.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
