import React, { useState, useEffect } from 'react';
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
  Settings,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { socket } from '../lib/socket';
import { Sidebar } from './Sidebar';

export const AgentShell = ({ children, title, subtitle, actions }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQueryState] = useState('');
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Guest", "role": "user"}');

  useEffect(() => {
    const updateUnreadCount = () => {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const count = parsed.filter(n => !n.read).length;
          setUnreadNotificationsCount(count);
          setNotificationsList(parsed);
        } catch (e) {
          setUnreadNotificationsCount(0);
          setNotificationsList([]);
        }
      } else {
        // Default list fallback
        setUnreadNotificationsCount(2);
        setNotificationsList([]);
      }
    };

    updateUnreadCount();
    window.addEventListener('notificationsUpdated', updateUnreadCount);
    return () => {
      window.removeEventListener('notificationsUpdated', updateUnreadCount);
    };
  }, []);

  // Socket notification handling
  useEffect(() => {
    if (!socket || !user || !user.email) return;

    const handleTicketCreated = (ticket) => {
      const isStaff = user.role === 'agent' || user.role === 'admin';
      const isOwnTicket = ticket.email === user.email;

      if (isStaff || isOwnTicket) {
        const stored = localStorage.getItem('notifications');
        let currentList = [];
        if (stored) {
          try {
            currentList = JSON.parse(stored);
          } catch(e) {
            currentList = [];
          }
        }
        
        const notifId = `ticket-created-${ticket._id}`;
        if (currentList.some(n => n.id === notifId)) return;

        const ticketRef = `HLP-${ticket._id.substring(ticket._id.length - 4).toUpperCase()}`;
        const newNotif = {
          id: notifId,
          type: 'info',
          title: `🎫 New Ticket Queued: ${ticket.subject}`,
          message: isStaff 
            ? `Staff Alert: Customer ${ticket.customer} created a ticket under category "${ticket.category}".`
            : `Your incident ${ticketRef} has been received. Support Hub AI has initiated diagnostics!`,
          time: new Date().toISOString(),
          read: false,
          category: 'Tickets',
          link: `/ticket/${ticket._id}`
        };

        const updated = [newNotif, ...currentList];
        localStorage.setItem('notifications', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      }
    };

    const handleTicketUpdated = (ticket) => {
      const isStaff = user.role === 'agent' || user.role === 'admin';
      const isOwnTicket = ticket.email === user.email;

      if (isStaff || isOwnTicket) {
        const stored = localStorage.getItem('notifications');
        let currentList = [];
        if (stored) {
          try {
            currentList = JSON.parse(stored);
          } catch(e) {
            currentList = [];
          }
        }

        const ticketRef = `HLP-${ticket._id.substring(ticket._id.length - 4).toUpperCase()}`;
        const hasAIAssistantMsg = ticket.messages?.some(m => m.senderName === "Support Hub AI Assistant");

        let updatedList = [...currentList];

        // Status Alteration Notification
        const statusNotifId = `ticket-status-${ticket._id}-${ticket.status}`;
        if (!updatedList.some(n => n.id === statusNotifId)) {
          const statusNotif = {
            id: statusNotifId,
            type: ticket.status === 'resolved' ? 'success' : 'warning',
            title: `🔄 Ticket status: ${ticket.status.toUpperCase()}`,
            message: `Ticket ${ticketRef} ("${ticket.subject}") is now in status "${ticket.status.toUpperCase()}"`,
            time: new Date().toISOString(),
            read: false,
            category: 'Tickets',
            link: `/ticket/${ticket._id}`
          };
          updatedList = [statusNotif, ...updatedList];
        }

        // AI Response Generated Notification
        if (hasAIAssistantMsg) {
          const aiNotifId = `ticket-ai-${ticket._id}`;
          if (!updatedList.some(n => n.id === aiNotifId)) {
            const aiNotif = {
              id: aiNotifId,
              type: 'success',
              title: `✨ Smart AI Solution Ready`,
              message: `Support Hub AI has delivered a custom troubleshooting checklist for ${ticketRef}.`,
              time: new Date().toISOString(),
              read: false,
              category: 'Tickets',
              link: `/ticket/${ticket._id}`
            };
            updatedList = [aiNotif, ...updatedList];
          }
        }

        localStorage.setItem('notifications', JSON.stringify(updatedList));
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      }
    };

    socket.on("ticket:created", handleTicketCreated);
    socket.on("ticket:updated", handleTicketUpdated);

    return () => {
      socket.off("ticket:created", handleTicketCreated);
      socket.off("ticket:updated", handleTicketUpdated);
    };
  }, [user?.email, user?.role]);

  const handleMarkAsRead = (id) => {
    const updated = notificationsList.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('notifications', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  };

  const handleMarkAllAsRead = () => {
    const updated = notificationsList.map(n => ({ ...n, read: true }));
    localStorage.setItem('notifications', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  };

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

                  <div className="relative">
                    <button 
                      onClick={() => setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen)}
                      className="group relative p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors outline-none cursor-pointer"
                      aria-label="Open notifications"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadNotificationsCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white ring-2 ring-white animate-pulse leading-none">
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </button>

                    {isNotificationsDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-15" 
                          onClick={() => setIsNotificationsDropdownOpen(false)}
                        />
                        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-[20px] shadow-xl py-3 z-20 animate-fadeIn text-left">
                          <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Recent Alerts ({unreadNotificationsCount} unread)
                            </span>
                            {unreadNotificationsCount > 0 && (
                              <button
                                onClick={() => {
                                  handleMarkAllAsRead();
                                  setIsNotificationsDropdownOpen(false);
                                }}
                                className="text-[9px] font-black uppercase text-[#1034A6] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="h-3 w-3" /> Mark all read
                              </button>
                            )}
                          </div>

                          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                            {notificationsList.length === 0 ? (
                              <div className="px-6 py-8 text-center text-slate-400">
                                <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p className="text-xs font-bold">No active notifications</p>
                                <p className="text-[10px] text-slate-400/80 mt-1">SLA pipelines are healthy and quiet 24/7.</p>
                              </div>
                            ) : (
                              notificationsList.slice(0, 5).map((notif) => {
                                let IconComp = Info;
                                let colorClass = "bg-[#1034A6]/5 text-[#1034A6] border-slate-100";
                                if (notif.type === 'alert') {
                                  IconComp = Sparkles;
                                  colorClass = "bg-violet-50 text-violet-600 border-violet-100";
                                } else if (notif.type === 'success') {
                                  IconComp = CheckCircle2;
                                  colorClass = "bg-emerald-50 text-emerald-600 border-emerald-100";
                                } else if (notif.type === 'warning') {
                                  IconComp = AlertCircle;
                                  colorClass = "bg-amber-50 text-amber-500 border-amber-100";
                                }
                                return (
                                  <Link
                                    key={notif.id}
                                    to={notif.link || "/dashboard/notifications"}
                                    onClick={() => {
                                      handleMarkAsRead(notif.id);
                                      setIsNotificationsDropdownOpen(false);
                                    }}
                                    className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${!notif.read ? "bg-slate-50/40" : ""}`}
                                  >
                                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 border ${colorClass}`}>
                                      <IconComp className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <p className={`text-xs truncate ${!notif.read ? "font-bold text-slate-900" : "text-slate-500"}`}>
                                          {notif.title}
                                        </p>
                                        {!notif.read && (
                                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                                        )}
                                      </div>
                                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 font-medium leading-normal">
                                        {notif.message}
                                      </p>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                                        {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  </Link>
                                );
                              })
                            )}
                          </div>

                          <div className="pt-2 px-4 border-t border-slate-100 flex justify-center">
                            <Link 
                              to="/dashboard/notifications" 
                              onClick={() => setIsNotificationsDropdownOpen(false)}
                              className="text-[10px] font-black uppercase text-[#1034A6] hover:underline"
                            >
                              Go to Alert Center ➜
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <Link to="/help" className="group relative p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
                    <HelpCircle className="h-5 w-5" />
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 px-2 py-1 bg-slate-900 text-white text-[10px] font-black tracking-wide rounded shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-30 uppercase">
                      Help Center
                    </span>
                  </Link>
                  <Link to="/dashboard/discussions" className="group relative p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
                    <MessageSquare className="h-5 w-5" />
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 px-2 py-1 bg-slate-900 text-white text-[10px] font-black tracking-wide rounded shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-30 uppercase">
                      Discussions
                    </span>
                  </Link>
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
