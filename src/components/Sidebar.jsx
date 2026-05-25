import React, { useState, useEffect } from 'react';
import { 
  Home, 
  LayoutList, 
  Ticket as TicketIcon, 
  PlusCircle, 
  Users, 
  Settings, 
  LogOut,
  BarChart3,
  History,
  X,
  HelpCircle,
  Bell,
  MessageSquare
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

const sidebarItems = [
  { icon: Home, label: 'Home', path: '/dashboard', roles: ['user', 'agent', 'admin'] },
  { icon: LayoutList, label: 'My Tickets', path: '/dashboard/my-tickets', roles: ['user', 'agent', 'admin'] },
  { icon: TicketIcon, label: 'Ticket Queue', path: '/dashboard/queue', roles: ['agent', 'admin'] },
  { icon: PlusCircle, label: 'Submit Ticket', path: '/submit', roles: ['user'] },
  { icon: PlusCircle, label: 'Create Ticket', path: '/dashboard/create', roles: ['agent', 'admin'] },
  { icon: History, label: 'Ticket History', path: '/dashboard/history', roles: ['agent', 'admin'] },
  { icon: BarChart3, label: 'Reports', path: '/dashboard/reports', roles: ['agent', 'admin'] },
  { icon: Users, label: 'User Management', path: '/dashboard/users', roles: ['admin'] },
  { icon: Bell, label: 'Notifications', path: '/dashboard/notifications', roles: ['user', 'agent', 'admin'] },
  { icon: MessageSquare, label: 'Discussions Hub', path: '/dashboard/discussions', roles: ['user', 'agent', 'admin'] },
  { icon: HelpCircle, label: 'Help Center', path: '/help', roles: ['user', 'agent', 'admin'] },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings', roles: ['user', 'agent', 'admin'] }
];

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{"name": "Guest", "role": "user"}'));

  useEffect(() => {
    const handleProfileUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user') || '{"name": "Guest", "role": "user"}');
      setUser(updatedUser);
    };
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const filteredItems = sidebarItems.filter(item => item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 lg:static lg:translate-x-0 shadow-2xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      <div className="p-6 pb-6 flex items-center justify-between lg:justify-start gap-3">
        <Link to="/" onClick={onClose} className="flex items-center gap-3">
          <div className="bg-[#1034A6] p-2 rounded-lg">
            <TicketIcon className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-sans font-bold text-slate-900 text-lg tracking-tight leading-none">Support Hub</span>
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{user.role} Portal</span>
          </div>
        </Link>
        {/* Close button for mobile */}
        <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-[13px] tracking-tight",
                isActive 
                  ? "bg-[#1034A6] text-white shadow-md shadow-indigo-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("h-4.5 w-4.5 transition-colors", isActive ? "text-white" : "text-slate-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-200/50 space-y-4">
        <div className="flex items-center gap-3 px-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
           <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-black text-[#1034A6] shadow-sm uppercase shrink-0 overflow-hidden">
             {user.avatar ? (
               <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             ) : (
               user.name?.[0]
             )}
           </div>
           <div className="text-left min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 tracking-tight leading-none truncate">{user.name}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 truncate">{user.role} Portal</p>
           </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all w-full font-bold text-[13px] tracking-tight group"
        >
          <LogOut className="h-4.5 w-4.5 text-slate-400 group-hover:text-red-500" />
          Logout System
        </button>
      </div>
    </aside>
    </>
  );
};
