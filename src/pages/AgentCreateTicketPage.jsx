import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AgentShell } from '../components/AgentShell';
import { User, Mail, Ticket as TicketIcon, Send, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { api } from '../lib/api';

const validationSchema = Yup.object({
  customer: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Customer name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .required('Subject is required'),
  category: Yup.string().required('Category is required'),
  priority: Yup.string().required('Priority is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
});

export default function AgentCreateTicketPage() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      customer: '',
      email: '',
      subject: '',
      category: 'Technical Issue',
      priority: 'low',
      description: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      try {
        setStatus(null);
        await api.createTicket({
          ...values,
          priority: values.priority.toLowerCase()
        });
        resetForm();
        navigate('/dashboard/queue');
      } catch (error) {
        setStatus({ error: error.message || 'Something went wrong. Please try again.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AgentShell 
      title="Create Ticket" 
      subtitle="Generate internal tickets or document customer requests."
    >
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
         <div className="px-8 py-6 border-b border-slate-100 bg-[#FAFBFF]">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <TicketIcon className="h-5 w-5 text-[#1034A6]" />
              New Ticket Details
            </h3>
         </div>
         
         <form onSubmit={formik.handleSubmit} className="p-8 space-y-6">
            {formik.status?.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle className="h-5 w-5" />
                {formik.status.error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 ml-1 flex items-center gap-2">
                     <User className="h-3.5 w-3.5" />
                     Customer Name
                  </label>
                  <input 
                    name="customer"
                    type="text" 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.customer}
                    className={cn(
                      "w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] transition-all outline-none",
                      formik.touched.customer && formik.errors.customer && "border-red-300 ring-red-50"
                    )}
                    placeholder="Full name"
                  />
                  {formik.touched.customer && formik.errors.customer ? (
                    <div className="text-red-500 text-[10px] font-bold uppercase px-2">{formik.errors.customer}</div>
                  ) : null}
               </div>
               <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 ml-1 flex items-center gap-2">
                     <Mail className="h-3.5 w-3.5" />
                     Email Address
                  </label>
                  <input 
                    name="email"
                    type="email" 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={cn(
                      "w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] transition-all outline-none",
                      formik.touched.email && formik.errors.email && "border-red-300 ring-red-50"
                    )}
                    placeholder="email@example.com"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-[10px] font-bold uppercase px-2">{formik.errors.email}</div>
                  ) : null}
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 ml-1 flex items-center gap-2">
                  <TicketIcon className="h-3.5 w-3.5" />
                  Subject
               </label>
               <input 
                 name="subject"
                 type="text" 
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.subject}
                 className={cn(
                   "w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] transition-all outline-none",
                   formik.touched.subject && formik.errors.subject && "border-red-300 ring-red-50"
                 )}
                 placeholder="Brief description of the issue"
               />
               {formik.touched.subject && formik.errors.subject ? (
                 <div className="text-red-500 text-[10px] font-bold uppercase px-2">{formik.errors.subject}</div>
               ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 ml-1">Classification</label>
                  <select 
                    name="category"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.category}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] transition-all outline-none appearance-none"
                  >
                     <option>Technical Issue</option>
                     <option>Billing / Account</option>
                     <option>Feature Request</option>
                     <option>Urgent Bug</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 ml-1">Priority</label>
                  <select 
                    name="priority"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.priority}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] transition-all outline-none appearance-none"
                  >
                     <option value="low">Low</option>
                     <option value="medium">Medium</option>
                     <option value="high">High</option>
                     <option value="urgent">Urgent</option>
                  </select>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 ml-1 flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Description
               </label>
               <textarea 
                 name="description"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.description}
                 className={cn(
                   "w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] transition-all outline-none min-h-[120px] resize-none",
                   formik.touched.description && formik.errors.description && "border-red-300 ring-red-50"
                 )}
                 placeholder="Provide as much detail as possible..."
               />
               {formik.touched.description && formik.errors.description ? (
                 <div className="text-red-500 text-[10px] font-bold uppercase px-2">{formik.errors.description}</div>
               ) : null}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-2 text-[#1034A6] font-bold text-xs uppercase tracking-wider animate-pulse">
                  <Sparkles className="h-4 w-4" />
                  AI Optimization Active
               </div>
               <button 
                 type="submit"
                 disabled={formik.isSubmitting}
                 className="w-full sm:w-auto px-8 py-4 bg-[#1034A6] hover:bg-[#0E2D8E] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                  {formik.isSubmitting ? (
                    <>Processing... <Loader2 className="h-4 w-4 animate-spin" /></>
                  ) : (
                    <>Submit Ticket <Send className="h-4 w-4" /></>
                  )}
               </button>
            </div>
         </form>
      </div>
    </AgentShell>
  );
}
