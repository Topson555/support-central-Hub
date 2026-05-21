import { motion } from 'motion/react';
import { 
  Search, 
  Book, 
  HelpCircle, 
  LifeBuoy, 
  Shield, 
  CreditCard, 
  Settings, 
  ArrowRight,
  ChevronRight,
  Ticket as TicketIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { icon: Book, title: 'Getting Started', count: '12 articles', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { icon: CreditCard, title: 'Billing & Plans', count: '8 articles', color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
    { icon: Settings, title: 'Configuration', count: '15 articles', color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
    { icon: Shield, title: 'Security', count: '6 articles', color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
    { icon: LifeBuoy, title: 'Troubleshooting', count: '24 articles', color: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
    { icon: HelpCircle, title: 'General FAQ', count: '31 articles', color: 'bg-slate-50 text-slate-600', border: 'border-slate-100' },
  ];

  const popularArticles = [
    'How to reset your corporate password',
    'Configuring API webhooks for real-time events',
    'Understanding our data retention policy',
    'Integrating with Slack and Microsoft Teams',
    'Troubleshooting 403 Forbidden errors',
    'Managing multi-factor authentication'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans tracking-tight">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
             <div className="bg-[#1034A6] p-2 rounded-lg">
                <TicketIcon className="h-5 w-5 text-white" />
             </div>
             <span className="text-xl font-bold">Help Center</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/submit" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#1034A6] transition-colors">Submit Ticket</Link>
            <Link to="/login" className="rounded-xl bg-[#1034A6] px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#0E2D8E] transition-all">Agent Login</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Banner */}
        <section className="bg-[#1034A6] py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          </div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">How can we help you today?</h1>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search for articles, guides, and more..."
                className="w-full pl-16 pr-8 py-6 bg-white rounded-[24px] shadow-2xl shadow-black/10 outline-none text-slate-900 font-medium focus:ring-4 focus:ring-white/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="max-w-7xl mx-auto px-6 -mt-12 mb-24 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.color} ${cat.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
                <p className="text-sm font-medium text-slate-400 mb-6">{cat.count}</p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1034A6]">
                  Browse Articles <ArrowRight className="h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular Articles & Sidebar */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24">
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Popular Articles</h2>
            <div className="bg-white rounded-[32px] border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
              {popularArticles.map((article, i) => (
                <div key={i} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                  <span className="font-bold text-slate-700 group-hover:text-[#1034A6] transition-colors">{article}</span>
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#1034A6] transform group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#1034A6] p-8 rounded-[32px] text-white shadow-xl shadow-blue-100">
              <h3 className="text-xl font-bold mb-4">Can't find what you're looking for?</h3>
              <p className="text-indigo-100/80 text-sm font-medium leading-relaxed mb-8">
                Our support experts are available around the clock to help you resolve any issues or answer your questions.
              </p>
              <Link 
                to="/submit"
                className="block w-full text-center bg-white text-[#1034A6] font-bold py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-200">
               <h3 className="text-lg font-bold text-slate-900 mb-6">Service Status</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Ticketing System</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">AI Triage Engine</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">API Gateways</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Operational
                    </span>
                  </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2024 Support Hub Help Center. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
