import { motion } from 'motion/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  User,
  Mail, 
  Lock, 
  Github,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Ticket as TicketIcon,
  Loader2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn, parseJsonSafe } from '../lib/utils';
import { fetchApi } from '../lib/api';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  staffCode: Yup.string(),
});

export default function SignupPage() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      staffCode: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const response = await fetchApi('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await parseJsonSafe(response);

        if (!response.ok) {
          const message =
            data?.error ||
            data?.message ||
            (typeof data?.text === 'string' ? data.text : null) ||
            response.statusText ||
            'Signup failed';
          throw new Error(message);
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        navigate('/dashboard');
      } catch (error) {
        setStatus({ error: error.message || 'Account creation failed. Please try again.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#F1F3F9] flex items-center justify-center p-4 md:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-slate-200"
      >
        {/* Left Side: Branding & Features */}
        <div className="w-full md:w-[45%] bg-[#121417] p-10 md:p-16 flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-20 group">
              <div className="bg-[#1034A6] p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <TicketIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white uppercase">Support Hub</span>
            </Link>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
                Join the future of <br />
                <span className="text-[#3b82f6]">Customer Excellence</span>
              </h1>

              <div className="space-y-10 pt-12">
                <div className="flex items-start gap-5">
                  <div className="mt-1 text-[#3b82f6]">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">AI-Powered Triage</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Automate your workflow with intelligent ticket routing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="mt-1 text-[#3b82f6]">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Enterprise Security</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Granular permissions and SOC2 compliant infrastructure.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="mt-1 text-[#3b82f6]">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Global Scale</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Serve millions of customers with sub-second resolution time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-16 mt-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop'
                ].map((url, i) => (
                  <img key={i} src={url} className="w-10 h-10 rounded-full border-2 border-[#121417] object-cover" />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#121417] bg-[#1a1d21] flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                  +5k
                </div>
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Trusted by 5,000+ support teams
            </p>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full md:w-[55%] p-10 md:p-20 flex flex-col justify-center bg-white relative">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Create Account</h2>
              <p className="text-slate-500 font-medium">
                Start your 14-day free trial today.
              </p>
            </div>

            <div className="relative flex justify-center text-xs uppercase tracking-widest text-slate-400">
              <span className="bg-white px-4 font-bold text-[10px]">Use your credentials</span>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {formik.status?.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="h-5 w-5" />
                  {formik.status.error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block ml-1" htmlFor="name">Full Name</label>
                <div className={cn(
                  "relative group text-slate-300 focus-within:text-[#1034A6] transition-colors",
                  formik.touched.name && formik.errors.name && "text-red-400"
                )}>
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                  <input 
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:shadow-sm focus:border-[#1034A6] transition-all outline-none text-slate-900",
                      formik.touched.name && formik.errors.name && "border-red-300 bg-red-50/30"
                    )}
                    id="name" 
                    placeholder="Emmanuel" 
                    type="text" 
                  />
                </div>
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-[10px] font-bold uppercase px-2 tracking-wider">{formik.errors.name}</div>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block ml-1" htmlFor="email">Email Address</label>
                <div className={cn(
                  "relative group text-slate-300 focus-within:text-[#1034A6] transition-colors",
                  formik.touched.email && formik.errors.email && "text-red-400"
                )}>
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                  <input 
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:shadow-sm focus:border-[#1034A6] transition-all outline-none text-slate-900",
                      formik.touched.email && formik.errors.email && "border-red-300 bg-red-50/30"
                    )}
                    id="email" 
                    placeholder="name@company.com" 
                    type="email" 
                  />
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-[10px] font-bold uppercase px-2 tracking-wider">{formik.errors.email}</div>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block ml-1" htmlFor="password">Password</label>
                <div className={cn(
                  "relative group text-slate-300 focus-within:text-[#1034A6] transition-colors",
                  formik.touched.password && formik.errors.password && "text-red-400"
                )}>
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                  <input 
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:shadow-sm focus:border-[#1034A6] transition-all outline-none text-slate-900",
                      formik.touched.password && formik.errors.password && "border-red-300 bg-red-50/30"
                    )}
                    id="password" 
                    placeholder="••••••••" 
                    type="password" 
                  />
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-[10px] font-bold uppercase px-2 tracking-wider">{formik.errors.password}</div>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block ml-1" htmlFor="staffCode">Staff Invite Code (Optional)</label>
                <div className={cn(
                  "relative group text-slate-300 focus-within:text-[#1034A6] transition-colors"
                )}>
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                  <input 
                    name="staffCode"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.staffCode}
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:shadow-sm focus:border-[#1034A6] transition-all outline-none text-slate-900"
                    )}
                    id="staffCode" 
                    placeholder="For Agents/Admins" 
                    type="text" 
                  />
                </div>
                <p className="text-[9px] text-slate-400 px-2">Leave blank if you are a customer.</p>
              </div>

              <button 
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full py-4 bg-[#003eb3] text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-100 hover:bg-[#003496] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? (
                  <>Creating Account... <Loader2 className="h-4 w-4 animate-spin" /></>
                ) : (
                  <>
                    Get Started
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm font-medium text-slate-500">
              Already have an account? <Link to="/login" className="text-[#1034A6] font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
