import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  MessageSquare,
  Menu,
  X,
  Ticket,
  ChevronDown,
  LogOut,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AgentShell = ({ children, title, subtitle, actions }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQueryState] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Guest", "role": "user"}');

  const handleSearchChange = (val) => {
    setSearchQueryState(val);
    const event = new CustomEvent('globalSearch', { detail: val });
    window.dispatchEvent(event);
  };

  return (
    <div className="flex h-screen bg-[#F1F3F9] overflow-hidden text-slate-900 font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 relative">
          {isMobileSearchOpen ? (
            <div className="flex-1 flex items-center gap-3 animate-fadeIn duration-150">
              <button 
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  handleSearchChange('');
                }}
                className="p-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close search"
              >
                <X className="h-4.5 w-4.5" />
              </button>
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                 <input 
                   type="text" 
                   autoFocus
                   placeholder="Search tickets, customers, categories..."
                   value={searchQuery}
                   onChange={(e) => handleSearchChange(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-11 pr-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] transition-all outline-none"
                 />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors mr-1 shrink-0"
                >
                  {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                {/* Mobile / Tablet Branding Logo */}
                <Link to="/dashboard" className="flex lg:hidden items-center gap-2 group mr-2 shrink-0">
                  <div className="bg-[#1034A6] p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
                    <Ticket className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col text-left hidden min-[460px]:flex">
                    <span className="font-sans font-bold text-slate-900 text-sm tracking-tight leading-none">Support Hub</span>
                    <span className="text-[8px] font-black text-slate-400 mt-0.5 uppercase tracking-widest">{user?.role || 'user'} Portal</span>
                  </div>
                </Link>

                <div className="relative w-full max-w-[400px] hidden sm:block">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                   <input 
                     type="text" 
                     placeholder="Search tickets, customers..."
                     value={searchQuery}
                     onChange={(e) => handleSearchChange(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#1034A6]/10 focus:border-[#1034A6] transition-all outline-none"
                   />
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:gap-4 shrink-0 shadow-none">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {/* Mobile Search Trigger */}
                  <button 
                    onClick={() => setIsMobileSearchOpen(true)}
                    className="group relative sm:hidden p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                    aria-label="Open search"
                  >
                    <Search className="h-5 w-5" />
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 px-2 py-1 bg-slate-900 text-white text-[10px] font-black tracking-wide rounded shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-30 uppercase">
                      Search
                    </span>
                  </button>

                  <button className="group relative p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 px-2 py-1 bg-slate-900 text-white text-[10px] font-black tracking-wide rounded shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-30 uppercase">
                      Notifications
                    </span>
                  </button>
                  <button className="group relative p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
                    <HelpCircle className="h-5 w-5" />
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 px-2 py-1 bg-slate-900 text-white text-[10px] font-black tracking-wide rounded shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-30 uppercase">
                      Help Center
                    </span>
                  </button>
                  <button className="group relative p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
                    <MessageSquare className="h-5 w-5" />
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 px-2 py-1 bg-slate-900 text-white text-[10px] font-black tracking-wide rounded shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-30 uppercase">
                      Discussions
                    </span>
                  </button>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 sm:gap-3 pl-3 border-l border-slate-200 hover:opacity-85 active:scale-95 transition-all text-left outline-none shrink-0 cursor-pointer"
                    aria-label="User menu"
                  >
                     <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 tracking-tight leading-none">{user.name}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1.5">{user.role}</p>
                     </div>
                     <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-black text-[#1034A6] shadow-sm uppercase shrink-0">
                       {user.name?.[0]}
                     </div>
                     <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:block shrink-0" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <>
                      {/* Invisible backdrop to close the dropdown when clicking outside */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-20 animate-fadeIn duration-150">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logged in as</p>
                          <p className="text-sm font-bold text-slate-900 truncate mt-1">{user.name}</p>
                          <p className="text-[10px] font-medium text-slate-500 capitalize mt-0.5">{user.role} Portal</p>
                        </div>
                        
                        <div className="p-1">
                          <Link 
                            to="/dashboard/settings"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors"
                          >
                            <Settings className="h-4 w-4 text-slate-400" />
                            Account Settings
                          </Link>
                          
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              localStorage.removeItem('token');
                              localStorage.removeItem('user');
                              window.location.href = '/login';
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors text-left cursor-pointer"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
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
