import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AgentShell = ({ children, title, subtitle, actions }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Guest", "role": "user"}');

  return (
    <div className="flex h-screen bg-[#F1F3F9] overflow-hidden text-slate-900 font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="relative w-full max-w-[400px] hidden sm:block">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
               <input 
                 type="text" 
                 placeholder="Search tickets, customers..."
                 className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] transition-all outline-none"
               />
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-4">
            <div className="flex items-center gap-1 md:gap-2">
              <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
              </button>
              <button className="hidden md:block p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                <HelpCircle className="h-5 w-5" />
              </button>
              <button className="hidden md:block p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 pl-4 md:pl-4 border-l border-slate-200">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 tracking-tight leading-none">{user.name}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">{user.role}</p>
               </div>
               <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-black text-[#1034A6] shadow-sm uppercase">
                 {user.name?.[0]}
               </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
              {subtitle && <p className="text-slate-500 font-medium text-sm">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3 w-full md:w-auto">{actions}</div>}
          </div>

          <div className="pb-8">
            {children}
          </div>
        </div>

        {/* Global Footer */}
        <footer className="w-full py-4 px-8 flex flex-col md:flex-row justify-between items-center bg-white border-t border-slate-200 shrink-0">
           <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-900 uppercase">Support Hub</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Portal Secure v4.2</span>
           </div>
           <div className="flex gap-6 text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-2 md:mt-0">
              <Link to="#" className="hover:text-[#1034A6] transition-colors">Documentation</Link>
              <Link to="#" className="hover:text-[#1034A6] transition-colors">Security</Link>
           </div>
        </footer>
      </main>
    </div>
  );
};
