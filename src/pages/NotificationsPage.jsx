import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Trash2, 
  Filter, 
  Check, 
  LifeBuoy,
  Megaphone,
  UserCheck
} from 'lucide-react';
import { AgentShell } from '../components/AgentShell';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');

  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Guest", "role": "user"}');
  const storageKey = user && user.email ? `notifications_${user.email}` : 'notifications';

  // Load and cache
  useEffect(() => {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      setNotifications(JSON.parse(cached));
    } else {
      const isStaff = user.role === 'agent' || user.role === 'admin';
      const welcomeNotif = {
        id: `welcome-${user.email || 'guest'}`,
        type: 'info',
        title: '✨ Welcome to Support Hub 24/7!',
        message: isStaff 
          ? 'Access your unified response desk. Live tickets, automatic SLA escalations, and AI copilot drafts are routed here instantly.'
          : `Hello ${user.name || 'Valued Customer'}! Your live dashboard is connected. Any ticket you submit will show status updates and instant AI diagnostic help here.`,
        time: new Date().toISOString(),
        read: false,
        category: 'Systems',
        link: isStaff ? '/dashboard' : '/dashboard/submit-ticket'
      };
      const defaultNotifications = [welcomeNotif];
      setNotifications(defaultNotifications);
      localStorage.setItem(storageKey, JSON.stringify(defaultNotifications));
    }
  }, [storageKey]);

  const saveNotifications = (updated) => {
    setNotifications(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    // Dispatch a global event to keep other headers synced
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const markSingleAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const deleteSingle = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.read;
    return n.category.toLowerCase() === filter.toLowerCase();
  });

  return (
    <AgentShell
      title="Alert Center"
      subtitle="Overview of important support events, assigned tickets, and system statuses."
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={markAllAsRead}
            disabled={notifications.length === 0 || !notifications.some(n => !n.read)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4 text-emerald-600" />
            Check All Read
          </button>
          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 border border-slate-200 hover:border-red-100 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column filter */}
        <div className="lg:col-span-3">
          <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Filters</h3>
            <div className="space-y-1">
              {['All', 'Unread', 'Tickets', 'Discussions', 'Systems', 'Security'].map((f) => {
                const isActive = filter.toLowerCase() === f.toLowerCase();
                const count = f === 'All' ? notifications.length : 
                              f === 'Unread' ? notifications.filter(n => !n.read).length :
                              notifications.filter(n => n.category.toLowerCase() === f.toLowerCase()).length;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all text-left",
                      isActive 
                        ? "bg-[#1034A6] text-white" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <span>{f}</span>
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full",
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column list */}
        <div className="lg:col-span-9 space-y-4">
          {filteredNotifs.length === 0 ? (
            <div className="bg-white p-16 text-center rounded-[32px] border border-slate-200 shadow-sm">
              <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4 animate-bounce" />
              <p className="text-sm font-bold text-slate-500">Inbox is empty</p>
              <p className="text-xs text-slate-400 mt-1">Hooray! No pending system notifications or warnings.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifs.map((n) => {
                const isUrgent = n.type === 'alert' || n.category === 'Tickets';
                return (
                  <div
                    key={n.id}
                    onClick={() => markSingleAsRead(n.id)}
                    className={cn(
                      "bg-white p-5 md:p-6 rounded-[24px] border transition-all text-left flex items-start gap-4 md:gap-5 relative group",
                      !n.read 
                        ? "border-l-4 border-l-[#1034A6] border-slate-200" 
                        : "border-slate-100 opacity-80"
                    )}
                  >
                    {/* Status icon helper */}
                    <div className={cn(
                      "p-3 rounded-2xl shrink-0 mt-0.5 border",
                      n.type === 'alert' ? "bg-rose-50 border-rose-100 text-rose-500" :
                      n.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-500" :
                      n.type === 'warning' ? "bg-amber-50 border-amber-100 text-amber-500" :
                      "bg-blue-50 border-blue-100 text-blue-500"
                    )}>
                      {n.type === 'alert' && <AlertCircle className="h-5 w-5" />}
                      {n.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                      {n.type === 'warning' && <AlertCircle className="h-5 w-5" />}
                      {n.type === 'info' && <Info className="h-5 w-5" />}
                    </div>

                    <div className="flex-1 min-w-0 pr-8 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={cn(
                          "text-sm font-bold leading-tight truncate",
                          !n.read ? "text-slate-900" : "text-slate-500"
                        )}>
                          {n.title}
                        </h4>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        )}
                        <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded ml-auto">
                          {n.category}
                        </span>
                      </div>
                      
                      <p className="text-xs font-semibold text-slate-600 leading-relaxed max-w-4xl">
                        {n.message}
                      </p>

                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                        {n.link && (
                          <Link 
                            to={n.link} 
                            className="text-[10px] font-black uppercase text-[#1034A6] hover:underline"
                          >
                            View Source Thread ➜
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Single notification delete */}
                    <button
                      onClick={(e) => deleteSingle(n.id, e)}
                      className="absolute right-6 top-6 p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Delete alert"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AgentShell>
  );
}
