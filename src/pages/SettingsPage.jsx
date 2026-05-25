import React, { useState, useEffect } from 'react';
import { AgentShell } from '../components/AgentShell';
import { 
  User, 
  Camera, 
  Phone, 
  Briefcase, 
  Building, 
  Mail, 
  Shield, 
  Bell, 
  Globe, 
  Monitor, 
  Lock, 
  Check, 
  Loader2, 
  Upload, 
  Trash2,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getSystemTheme, setSystemTheme } from '../lib/theme';
// 1. Changed import to tap into your centralized API collection object
import { api } from '../lib/api'; 

const AVATAR_PRESETS = [
  { name: 'Classic Indigo', class: 'bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white' },
  { name: 'Warm Amber', class: 'bg-gradient-to-tr from-amber-500 to-amber-300 text-white' },
  { name: 'Midnight Charcoal', class: 'bg-gradient-to-tr from-slate-900 to-slate-700 text-white' },
  { name: 'Emerald Soft', class: 'bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white' },
  { name: 'Rose Petal', class: 'bg-gradient-to-tr from-rose-500 to-rose-300 text-white' },
  { name: 'Royal Violet', class: 'bg-gradient-to-tr from-purple-700 to-purple-400 text-white' },
];

export default function SettingsPage() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{"name": "Guest", "role": "user"}'));
  
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [jobTitle, setJobTitle] = useState(user.jobTitle || '');
  const [department, setDepartment] = useState(user.department || '');
  const [avatar, setAvatar] = useState(user.avatar || '');

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [theme, setThemeState] = useState(() => getSystemTheme());

  useEffect(() => {
    const handleThemeUpdate = (e) => {
      setThemeState(e.detail?.theme || getSystemTheme());
    };
    window.addEventListener('themeUpdated', handleThemeUpdate);
    return () => {
      window.removeEventListener('themeUpdated', handleThemeUpdate);
    };
  }, []);

  useEffect(() => {
    const updatedUser = JSON.parse(localStorage.getItem('user') || '{"name": "Guest", "role": "user"}');
    setUser(updatedUser);
  }, []);

  const handleFileUpload = (file) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File is too large. Choose a picture under 2MB.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    if (!file.type.match('image.*')) {
      setError('Only image files (JPEG, PNG, WEBP) are supported.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Submit Profile Changes to Server database & Client Store
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 2. Clean call straight to your endpoint mapping wrapper
      const data = await api.updateProfile({
        name,
        email,
        avatar,
        phoneNumber,
        jobTitle,
        department
      });

      // 3. Removed 'const data = await response.json();' entirely since it's pre-parsed.

      // Update Session Stores and notify layout UI components
      const updatedUser = {
        ...user,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar,
        phoneNumber: data.user.phoneNumber,
        jobTitle: data.user.jobTitle,
        department: data.user.department
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      window.dispatchEvent(new CustomEvent('userProfileUpdated'));
      
      setSuccess('Your profile was updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while saving profile info.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AgentShell 
      title={activeTab === 'profile' ? "My Profile Settings" : "System Configuration"} 
      subtitle={activeTab === 'profile' ? "Review and customize your personal contact credentials, public bio, and avatar portrait." : "Define environment variables, notification logic, and security protocols."}
    >
      <div className="max-w-4xl space-y-8">
        
        {/* Horizontal Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              "px-6 py-3.5 border-b-2 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer",
              activeTab === 'profile' 
                ? "border-[#1034A6] text-[#1034A6]" 
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            <User className="h-4 w-4" /> Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={cn(
              "px-6 py-3.5 border-b-2 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer",
              activeTab === 'system' 
                ? "border-[#1034A6] text-[#1034A6]" 
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            <Shield className="h-4 w-4" /> System Preferences
          </button>
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="space-y-8">
            
            {/* Notifications and Alerts Banners */}
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800 animate-fadeIn text-xs font-bold shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                  <Check className="h-4 w-4" />
                </div>
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-800 animate-fadeIn text-xs font-bold shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600 shrink-0">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <span>{error}</span>
              </div>
            )}

            {/* AVATAR AND PHOTO BLOCK */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center gap-2">
                <Camera className="h-4 w-4 text-[#1034A6]" /> Portrait & Avatar Graphics
              </h3>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "relative w-36 h-36 rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all overflow-hidden group select-none shrink-0",
                    dragOver ? "border-[#1034A6] bg-blue-50/50 scale-102" : "border-slate-200 hover:border-[#1034A6] bg-slate-50/30"
                  )}
                >
                  {avatar ? (
                    <>
                      <img src={avatar} alt={name || 'Profile'} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer">
                        <Upload className="h-4 w-4 mb-1" />
                        Replace Photo
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-3 flex flex-col items-center">
                      <Camera className="h-5 w-5 text-slate-400 group-hover:text-[#1034A6] transition-colors mb-1" />
                      <span className="text-[10px] font-bold text-slate-400 leading-tight">Drag image here or click</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700">Display Photograph</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      Drag-and-drop a profile photo file in the circular tray or click to browse. Max size 2MB (formats: JPEG, PNG, WEBP). Profiles are safely bound to your support desk record.
                    </p>
                  </div>
                  
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove Profile Picture
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-3">Or choose a stylish solid palette background:</p>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {AVATAR_PRESETS.map((preset, index) => {
                    const sampleAvatarValue = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}&backgroundColor=${preset.class.match(/from-(\w+)-/)?.[1] || 'indigo'}`;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setAvatar(sampleAvatarValue);
                        }}
                        className="text-[10px] font-bold p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-2 leading-none"
                      >
                        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black", preset.class)}>
                          {(name || 'U')[0].toUpperCase()}
                        </div>
                        <span className="truncate text-slate-600">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* FORM INPUT FIELDS AREA */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-[#1034A6]" /> Contact Details & Desk Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full bg-white border border-slate-250 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 019-3847"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Job Title */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Job Title / Designation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder={user.role === 'agent' ? "Support Desk Officer" : "Business Account Associate"}
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Department / Team</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Technical Operations, Accounts Management, Human Resources"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Roles Read-Only Indicator */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-700 uppercase tracking-wide">System Authorization Role</p>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Assigned clearance group determining layout capabilities and workflow assignments.</p>
                    </div>
                    <span className="px-4 py-2 bg-[#1034A6]/10 text-[#1034A6] text-[10px] font-black rounded-lg uppercase tracking-widest border border-[#1034A6]/20">
                      {user.role} Clearances
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* BUTTON BAR */}
            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="px-10 py-5 bg-[#1034A6] disabled:bg-slate-400 text-white rounded-[24px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-indigo-900/30 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer outline-none select-none italic"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uplinking changes...
                  </>
                ) : (
                  <>
                    Apply Profile Changes
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {/* MOCK SYSTEM SETTINGS TAB */}
        {activeTab === 'system' && (
          <div className="space-y-4">
            {[
              { id: 'security', icon: Shield, title: 'Security & Auth', desc: 'Manage 2FA status, session idle limits, IP restrictions, and audit logs routing.' },
              { id: 'notifications', icon: Bell, title: 'Notifications', desc: 'Configure automatic emails, critical SMS notifications, and system webhook URLs.' },
              { id: 'regional', icon: Globe, title: 'Regional Support', desc: 'Define default organization business hours, holiday exclusions, and automated time-out replies.' },
              { id: 'interface', icon: Monitor, title: 'Interface Customization', desc: 'Configure theme specifications, dynamic accessibility contrast scales, and system layouts.' },
              { id: 'compliance', icon: Lock, title: 'Compliance Hub', desc: 'Manage strict GDPR consent requests, private database backups, SOC2 compliance reporting, and manual clean data deletes.' },
            ].map((setting, i) => {
              const isInterface = setting.id === 'interface';
              return (
                <div key={i} className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-start gap-6 sm:gap-8 group transition-all">
                  <div className="p-4 bg-[#F1F3F9] text-[#1034A6] rounded-2xl shadow-sm shrink-0 flex items-center justify-center self-start">
                     <setting.icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1 space-y-4">
                     <div className="space-y-1">
                       <h3 className="text-xl font-black text-slate-900 tracking-tight">
                         {setting.title}
                       </h3>
                       <p className="text-slate-500 font-bold text-sm leading-relaxed">{setting.desc}</p>
                     </div>

                     {isInterface && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg pt-2">
                         {/* Light Mode */}
                         <button
                           type="button"
                           onClick={() => setSystemTheme('light')}
                           className={cn(
                             "p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer outline-none select-none",
                             theme === 'light' 
                               ? "border-[#1034A6] bg-blue-50/50 shadow-sm" 
                               : "border-slate-200 bg-white hover:bg-slate-50"
                           )}
                         >
                           <div className={cn(
                             "p-2.5 rounded-xl border transition-colors",
                             theme === 'light' ? "bg-white border-blue-200 text-[#1034A6]" : "bg-slate-50 border-slate-100 text-slate-400"
                           )}>
                             <Sun className="h-4 w-4" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Light Mode</p>
                             <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Classic Workspace</p>
                           </div>
                           {theme === 'light' && (
                             <div className="w-1.5 h-1.5 rounded-full bg-[#1034A6] shrink-0" />
                           )}
                         </button>

                         {/* Dark Mode */}
                         <button
                           type="button"
                           onClick={() => setSystemTheme('dark')}
                           className={cn(
                             "p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer outline-none select-none",
                             theme === 'dark' 
                               ? "border-[#1034A6] bg-indigo-950/25 shadow-sm" 
                               : "border-slate-200 bg-white hover:bg-slate-50"
                           )}
                         >
                           <div className={cn(
                             "p-2.5 rounded-xl border transition-colors",
                             theme === 'dark' ? "bg-slate-800 border-indigo-900 text-amber-400" : "bg-slate-50 border-slate-100 text-slate-400"
                           )}>
                             <Moon className="h-4 w-4" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Dark Mode</p>
                             <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Cosmic Workspace</p>
                           </div>
                           {theme === 'dark' && (
                             <div className="w-1.5 h-1.5 rounded-full bg-[#1034A6] shrink-0" />
                           )}
                         </button>
                       </div>
                     )}
                  </div>
                </div>
              );
            })}



            <div className="pt-8 flex justify-end">
               <button 
                 type="button"
                 onClick={() => {
                   setSuccess('System configuration saved safely.');
                   setTimeout(() => setSuccess(''), 3000);
                 }}
                 className="px-10 py-5 bg-[#1034A6] text-white rounded-[24px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-indigo-900/30 hover:scale-105 active:scale-95 transition-all italic cursor-pointer"
               >
                  Commit System Changes
               </button>
            </div>
          </div>
        )}


      </div>
    </AgentShell>
  );
}