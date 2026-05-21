import { motion } from 'motion/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Mail, 
  Lock, 
  Github,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Ticket as TicketIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn, parseJsonSafe } from '../lib/utils';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginPage() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const response = await fetch('/api/auth/login', {
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
            'Login failed';
          throw new Error(message);
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        navigate('/dashboard');
      } catch (error) {
        setStatus({ error: error.message || 'Invalid credentials. Please try again.' });
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
          {/* Subtle dots pattern */}
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

        {/* Right Side: Login Form */}
        <div className="w-full md:w-[55%] p-10 md:p-20 flex flex-col justify-center bg-white relative">
          <div className="max-w-md w-full mx-auto space-y-10">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Welcome Back</h2>
              <p className="text-slate-500 font-medium">
                Enter your credentials to access your dashboard.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {formik.status?.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="h-5 w-5" />
                  {formik.status.error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block ml-1" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <Mail className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors",
                    formik.touched.email && formik.errors.email ? "text-red-400" : "text-slate-300 group-focus-within:text-[#1034A6]"
                  )} />
                  <input 
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:shadow-sm focus:border-[#1034A6] transition-all outline-none",
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

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400" htmlFor="password">Password</label>
                  <a className="text-[11px] font-bold text-[#1034A6] hover:underline" href="#">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors",
                    formik.touched.password && formik.errors.password ? "text-red-400" : "text-slate-300 group-focus-within:text-[#1034A6]"
                  )} />
                  <input 
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:shadow-sm focus:border-[#1034A6] transition-all outline-none",
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

              <button 
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full py-4 bg-[#003eb3] text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-100 hover:bg-[#003496] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? (
                  <>Authenticating... <Loader2 className="h-4 w-4 animate-spin" /></>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest text-slate-400">
                <span className="bg-white px-4 font-bold text-[10px]">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
                <Github className="h-5 w-5" />
                GitHub
              </button>
            </div>

            <p className="text-center text-sm font-medium text-slate-500">
              New to Support Hub? <Link to="/signup" className="text-[#1034A6] font-bold hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

