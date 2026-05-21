import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Bolt, 
  Zap, 
  Globe, 
  ShieldCheck, 
  BarChart3, 
  Inbox, 
  CheckCircle2, 
  Ticket as TicketIcon,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col bg-[#F1F3F9] text-slate-900 font-sans tracking-tight overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 group transition-all shrink-0">
            <div className="bg-[#1034A6] p-2 rounded-lg shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
              <TicketIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#1034A6] transition-colors">Support Hub</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-[11px] font-bold uppercase tracking-widest text-[#1034A6]">Overview</Link>
            <a href="#features" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#1034A6] transition-colors">Solutions</a>
            <Link to="/help" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#1034A6] transition-colors">Resources</Link>
          </nav>

          <div className="flex items-center gap-4">
            {localStorage.getItem('token') ? (
              <Link to="/dashboard" className="rounded-xl bg-[#1034A6] px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#0E2D8E] active:scale-95 shadow-indigo-100">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden xs:block text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-[#1034A6] transition-colors px-2">Login</Link>
                <Link to="/signup" 
                  className="rounded-xl bg-[#1034A6] px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#0E2D8E] active:scale-95 shadow-indigo-100"
                >
                  Get Started
                </Link>
              </>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-slate-500 hover:text-[#1034A6] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <motion.div 
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          className="lg:hidden overflow-hidden bg-white border-t border-slate-100"
        >
          <div className="px-6 py-8 flex flex-col gap-6">
            <Link 
              to="/" 
              className="text-xs font-bold uppercase tracking-widest text-[#1034A6]"
              onClick={() => setIsMenuOpen(false)}
            >
              Overview
            </Link>
            <a 
              href="#features" 
              className="text-xs font-bold uppercase tracking-widest text-slate-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Solutions
            </a>
            <Link 
              to="/help" 
              className="text-xs font-bold uppercase tracking-widest text-slate-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
              <Link 
                to="/login" 
                className="text-xs font-bold uppercase tracking-widest text-slate-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Agent Login
              </Link>
              <Link 
                to="/submit" 
                className="text-xs font-bold uppercase tracking-widest text-[#1034A6]"
                onClick={() => setIsMenuOpen(false)}
              >
                Submit Ticket
              </Link>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-48 bg-[#FBFCFF]">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="z-10 text-center md:text-left"
            >
              <div className="inline-flex items-center py-2 px-5 rounded-full bg-[#EBF3FF] text-[#3B82F6] font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-12">
                Powered by AI Insights
              </div>
              <h1 className="text-6xl md:text-[88px] font-bold text-slate-900 mb-10 leading-[0.98] tracking-tight">
                Support that <span className="text-[#1034A6] italic font-serif font-medium">Scales</span> <br />
                with You
              </h1>
              <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-lg mx-auto md:ml-0 leading-relaxed font-medium">
                Streamline your customer experience with an intelligent ticketing system designed for high-density environments and rapid resolution.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-5 justify-center md:justify-start">
                <Link 
                  to="/submit" 
                  className="bg-[#0038A8] hover:bg-[#002d87] text-white font-bold py-5 px-10 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-4 text-sm"
                >
                  Submit a Ticket
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/dashboard" className="bg-white border border-slate-100 text-slate-900 font-bold py-5 px-10 rounded-2xl hover:bg-slate-50 transition-all text-sm text-center justify-center shadow-md">
                  View Dashboard
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative"
            >
              {/* Main Dashboard Image with thick white frame */}
              <div className="rounded-[44px] md:rounded-[56px] overflow-hidden shadow-[0_60px_100px_-20px_rgba(0,0,0,0.18)] border-[16px] md:border-[32px] border-white bg-white relative">
                <img 
                  alt="AI Support Dashboard" 
                  className="w-full h-auto rounded-[24px]"
                  src="https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=1600" 
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Floating Avg. Resolution Card - Precisely styled to match user screenshot */}
              <motion.div 
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                className="absolute -bottom-10 -left-10 md:-bottom-16 md:-left-20 bg-white p-8 md:p-12 rounded-[32px] md:rounded-[44px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-slate-50 flex items-center gap-8 md:gap-10 z-20"
              >
                <div className="bg-[#DCFCE7] text-[#16A34A] p-5 md:p-6 rounded-full shadow-inner flex items-center justify-center shrink-0">
                  <Zap className="h-10 w-10 md:h-12 md:w-12 fill-current" />
                </div>
                <div>
                  <div className="text-[10px] md:text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 leading-none">Avg. Resolution</div>
                  <div className="text-4xl md:text-[72px] font-bold text-slate-900 tracking-tighter leading-none">14m 22s</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Engineered for Efficiency</h2>
            <p className="text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
              A centralized hub for your support team to manage, track, and resolve issues with unprecedented speed and precision.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: Inbox,
                  title: 'AI Auto-Assignment',
                  desc: 'Categorizing tickets instantly using natural language processing. Route requests to the right experts without manual intervention.',
                  color: 'bg-[#3b82f6]',
                  shadow: 'shadow-blue-200'
                },
                {
                  icon: Globe,
                  title: '24/7 Global Support',
                  desc: 'Our team and platform are always active. Experience seamless coverage across timezones with automated escalation paths.',
                  color: 'bg-[#f97316]',
                  shadow: 'shadow-orange-200'
                },
                {
                  icon: ShieldCheck,
                  title: 'Role-Based Access',
                  desc: 'Secure and efficient dashboard for agents. Control permissions and visibility with granular, enterprise-grade security tools.',
                  color: 'bg-[#1e293b]',
                  shadow: 'shadow-slate-300'
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white p-12 rounded-[40px] shadow-sm border border-slate-100 text-left hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 shadow-lg ${feature.color} ${feature.shadow}`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-[#1034A6] transition-colors">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium opacity-80">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Grid Section */}
        <section id="docs" className="py-24 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[650px]">
            {/* Left Big Card */}
            <div className="md:col-span-8 bg-[#121417] text-white p-10 md:p-16 rounded-[40px] flex flex-col justify-between overflow-hidden relative border border-slate-800 shadow-2xl">
              <div className="z-10">
                <div className="bg-[#1034A6] p-3 rounded-2xl w-fit mb-8 shadow-lg shadow-indigo-500/20">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Advanced SLA Monitoring</h3>
                <p className="text-lg text-slate-400 font-medium max-w-md leading-relaxed opacity-90">
                  Never miss a deadline again. Our real-time countdowns and visual heatmaps prioritize your most urgent tasks automatically.
                </p>
              </div>
              <div className="mt-12 overflow-hidden rounded-3xl relative h-72 border border-slate-800 bg-slate-900/50 p-4">
                 <img 
                  alt="Analytics" 
                  className="w-full h-full object-cover rounded-2xl opacity-60" 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-4 grid grid-rows-2 gap-6">
              {/* Top Right: Unified Inbox */}
              <div className="bg-[#eff6ff] text-slate-900 p-10 rounded-[40px] flex flex-col justify-center border border-blue-100 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-blue-900 leading-tight">Unified Inbox</h3>
                <p className="text-sm text-blue-800/70 font-medium leading-[1.6]">
                  Omnichannel support from email, chat, and social media integrated into one high-performance interface.
                </p>
              </div>

              {/* Bottom Right Split */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-200 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="text-4xl font-bold text-[#1034A6] mb-2 tabular-nums">99.9%</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Uptime</div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-200 flex flex-col justify-center shadow-sm items-center text-center">
                  <div className="flex -space-x-3 mb-6">
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop',
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop'
                    ].map((url, i) => (
                      <img key={i} src={url} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      +12k
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-normal">Global support teams thrive here.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-white">
          <div className="mx-auto max-w-5xl bg-[#1034A6] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-100">
            {/* Abstract Background shapes */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">Elevate your customer support experience</h2>
              <p className="text-lg text-indigo-100 mb-10 max-w-xl mx-auto font-medium opacity-90 leading-relaxed">
                Join over 5,000 companies that have transformed their customer support into a competitive advantage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/signup" 
                  className="w-full sm:w-auto bg-white text-[#1034A6] hover:bg-slate-50 font-bold py-4 px-10 rounded-xl shadow-lg transition-all active:scale-95 text-xs uppercase tracking-widest"
                >
                  Get Started Free
                </Link>
                <button className="w-full sm:w-auto border-2 border-white/20 text-white font-bold py-4 px-10 rounded-xl hover:bg-white/5 transition-all text-xs uppercase tracking-widest">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0B] py-24 px-10 border-t border-white/5">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 text-white">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <TicketIcon className="h-7 w-7 text-indigo-500" />
              <span className="text-xl font-bold tracking-tight text-white uppercase italic">Support Hub</span>
            </div>
            <p className="text-sm text-zinc-500 font-bold leading-relaxed max-w-xs">
              Elevating customer relations through intelligent, data-driven automation and human-centric design.
            </p>
          </div>
          <div>
            <h4 className="font-black text-white mb-8 uppercase tracking-[0.2em] text-[10px]">Product</h4>
            <ul className="space-y-4">
              <li><Link to="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/submit" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Submit Ticket</Link></li>
              <li><Link to="/docs" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Status</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white mb-8 uppercase tracking-[0.2em] text-[10px]">Resources</h4>
            <ul className="space-y-4">
              <li><Link to="/help" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/help" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/help" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">API Reference</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white mb-8 uppercase tracking-[0.2em] text-[10px]">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
            © 2024 Support Hub. Professional Identity Systems.
          </p>
          <div className="flex gap-10">
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors hover:underline underline-offset-4">Agent Login Interface</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
