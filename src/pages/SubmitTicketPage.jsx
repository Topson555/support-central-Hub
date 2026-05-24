import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Send, 
  Paperclip, 
  BookOpen, 
  MessageSquare, 
  Target, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  Mail,
  List,
  Type,
  Headset,
  Ticket as TicketIcon,
  ChevronRight,
  Menu,
  X,
  PlusCircle,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { api } from '../lib/api';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Work email is required'),
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .required('Subject is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Detailed description is required'),
});

export default function SubmitTicketPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      subject: '',
      category: 'Technical Support',
      description: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      try {
        setStatus(null);
        const ticket = await api.createTicket({
          ...values,
          priority: 'medium'
        });
        setTicketId(ticket._id.substring(0, 8).toUpperCase());
        setIsSubmitted(true);
        resetForm();
      } catch (error) {
        console.warn("Submission failed:", error);
        setStatus({ error: "Failed to submit ticket. Please check your connection." });
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] p-6 text-slate-900 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full bg-white p-12 rounded-[44px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-slate-100 text-center space-y-10"
        >
          <div className="w-24 h-24 bg-[#E6FEEF] text-[#42DA88] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Ticket Created</h2>
            <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Reference: {ticketId}
            </div>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              Your inquiry has been successfully queued. **Support Hub AI has initiated an instant diagnostic analysis**—you will find an immediate smart answer and troubleshooting steps waiting in your ticket progress thread right now!
            </p>
          </div>
          <div className="pt-4 space-y-4">
            <Link 
              to={`/track/${ticketId}`}
              className="block w-full py-5 bg-[#0038A8] text-white font-bold text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-100 transition-all hover:bg-[#002d87] active:scale-[0.98]"
            >
              Track Ticket Progress
            </Link>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="block w-full py-5 text-slate-400 font-bold uppercase tracking-[0.15em] text-[11px] hover:text-[#0038A8] transition-colors"
            >
              Submit Another Ticket
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFF] font-sans text-slate-900">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="h-20 flex items-center justify-between px-8 md:px-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-[#1034A6] p-2 rounded-xl group-hover:rotate-6 transition-transform">
              <TicketIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-slate-900">Support <span className="text-[#1034A6] italic font-serif">Hub</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Documentation', path: '/docs' },
              { label: 'System Status', path: '#' },
            ].map((item) => (
              <Link key={item.label} to={item.path} className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">{item.label}</Link>
            ))}
            {localStorage.getItem('token') ? (
              <Link to="/dashboard" className="bg-[#1034A6] text-white py-2.5 px-6 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#0E2D8E] transition-all">Portal Dashboard</Link>
            ) : (
              <Link to="/login" className="bg-[#1034A6] text-white py-2.5 px-6 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#0E2D8E] transition-all">Agent Login</Link>
            )}
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-[#1034A6] transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <motion.div 
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden bg-white border-t border-slate-100"
        >
          <div className="px-8 py-6 flex flex-col gap-6">
            <Link 
              to="/docs" 
              className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#1034A6] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link 
              to="#" 
              className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#1034A6] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              System Status
            </Link>
            <div className="pt-4 border-t border-slate-100">
              {localStorage.getItem('token') ? (
                <Link 
                  to="/dashboard" 
                  className="block text-center bg-[#1034A6] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#0E2D8E] transition-all shadow-md animate-pulse"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Portal Dashboard
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="block text-center bg-[#1034A6] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#0E2D8E] transition-all shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Agent Login
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </header>

      <main className="pt-20">
        <section className="relative pt-16 md:pt-24 pb-48 overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
          
          <div className="mx-auto max-w-7xl px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Content: Title & Info */}
            <div className="lg:col-span-5 space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center py-2 px-5 rounded-full bg-[#EBF3FF] text-[#3B82F6] font-bold text-[10px] uppercase tracking-[0.2em] mb-10">
                  Secure Submission Portal
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-[1.05] tracking-tight">
                  How can we <br />
                  <span className="text-[#1034A6] italic font-serif">help</span> today?
                </h1>
                <p className="text-xl text-slate-500 leading-relaxed font-medium">
                  Provide the details of your inquiry below. Our team of specialists is ready to assist you with rapid response and expert resolution.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 gap-6 pt-4">
                {[
                  { icon: ShieldCheck, title: "Enterprise Security", text: "End-to-end encrypted submissions." },
                  { icon: Target, title: "Precision Triage", text: "Routed directly to specialized teams." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex gap-5 items-start"
                  >
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 text-[#1034A6]">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-none mb-1.5">{item.title}</h4>
                      <p className="text-sm text-slate-400 font-medium">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Content: Submission Form */}
            <div className="lg:col-span-7 relative">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="bg-white p-8 md:p-14 rounded-[44px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.12)] border border-slate-50"
              >
                <form onSubmit={formik.handleSubmit} className="space-y-10">
                  {formik.status?.error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold">
                      <AlertCircle className="h-5 w-5" />
                      {formik.status.error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</label>
                      <input 
                        name="email"
                        type="email" 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        placeholder="john@company.com"
                        className={cn(
                          "w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#1034A6] transition-all outline-none text-slate-900 placeholder:text-slate-300",
                          formik.touched.email && formik.errors.email && "border-red-300 ring-red-50"
                        )}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500 text-[10px] font-black uppercase px-2">{formik.errors.email}</div>
                      ) : null}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Case Category</label>
                      <select 
                        name="category" 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.category}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#1034A6] transition-all outline-none text-slate-900 appearance-none cursor-pointer"
                      >
                        <option>Technical Support</option>
                        <option>Billing Inquiry</option>
                        <option>Feature Request</option>
                        <option>Account Access</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Subject Line</label>
                    <input 
                      name="subject"
                      type="text" 
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.subject}
                      placeholder="e.g. Dashboard access latency in EMEA region"
                      className={cn(
                        "w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#1034A6] transition-all outline-none text-slate-900 placeholder:text-slate-300",
                        formik.touched.subject && formik.errors.subject && "border-red-300 ring-red-50"
                      )}
                    />
                    {formik.touched.subject && formik.errors.subject ? (
                      <div className="text-red-500 text-[10px] font-black uppercase px-2">{formik.errors.subject}</div>
                    ) : null}
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Detailed Description</label>
                    <textarea 
                      name="description"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.description}
                      rows={6}
                      placeholder="Describe the issue in detail..."
                      className={cn(
                        "w-full p-8 bg-slate-50 border border-slate-100 rounded-[32px] font-medium text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#1034A6] transition-all outline-none text-slate-900 placeholder:text-slate-300 resize-none",
                        formik.touched.description && formik.errors.description && "border-red-300 ring-red-50"
                      )}
                    />
                    {formik.touched.description && formik.errors.description ? (
                      <div className="text-red-500 text-[10px] font-black uppercase px-2">{formik.errors.description}</div>
                    ) : null}
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                    <button type="button" className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors group">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:bg-slate-100 transition-all">
                        <Paperclip className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest">Attach Assets</span>
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="w-full md:w-auto bg-[#0038A8] text-white font-bold py-5 px-14 rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#002d87] hover:-translate-y-0.5 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formik.isSubmitting ? (
                        <>Processing... <Loader2 className="h-4 w-4 animate-spin" /></>
                      ) : (
                        <>Submit Case <ArrowRight className="h-5 w-5" /></>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Floating Support Info */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute -bottom-12 -right-8 md:-right-12 bg-white p-6 md:p-8 rounded-[32px] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center gap-6 z-20"
              >
                <div className="bg-[#E6F0FF] text-[#1034A6] p-4 rounded-full shadow-inner">
                  <Headset className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Support Hours</div>
                  <div className="text-xl font-bold text-slate-900 tracking-tight leading-none">24/7 Priority</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="bg-white py-24 border-t border-slate-50">
          <div className="mx-auto max-w-7xl px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Need immediate answers?</h2>
              <p className="text-slate-500 font-medium">Browse our most popular support resources.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: BookOpen, title: "Knowledge Base", desc: "Detailed guides and technical documentation for all system features." },
                { icon: MessageSquare, title: "Community Forum", desc: "Collaborate with other users and share best practices." },
                { icon: HelpCircle, title: "Status Dashboard", desc: "Real-time updates on system performance and maintenance." }
              ].map((item, i) => (
                <div key={i} className="p-10 rounded-[40px] bg-[#FBFCFF] border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all group overflow-hidden relative">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-[#1034A6] w-fit mb-8 group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">{item.desc}</p>
                  <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1034A6] hover:gap-4 transition-all">
                    Explore Now <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black py-20 px-8 text-center md:text-left border-t border-white/5">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="bg-[#1034A6] p-2 rounded-xl">
                <TicketIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">Support <span className="text-[#1034A6] italic font-serif">Hub</span></span>
            </div>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed font-medium">
              Revolutionizing enterprise support with AI-driven triage and rapid resolution systems.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10">
            {['Privacy', 'Terms', 'Security', 'Contact'].map(link => (
              <Link key={link} to="#" className="text-zinc-500 hover:text-white font-bold text-[11px] uppercase tracking-[0.2em] transition-colors">{link}</Link>
            ))}
          </div>
          
          <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.25em]">
            © 2024 Portal System Secure
          </div>
        </div>
      </footer>
    </div>
  );
}
