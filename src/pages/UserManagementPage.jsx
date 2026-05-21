import React from 'react';
import { AgentShell } from '../components/AgentShell';
import { Users, UserPlus, MoreVertical, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

export default function UserManagementPage() {
  return (
    <AgentShell 
      title="Access Control" 
      subtitle="Manage internal agents, permissions, and administrative roles."
      actions={
        <button className="flex items-center gap-3 px-8 py-4 bg-[#1034A6] hover:bg-[#0E2D8E] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 italic">
          <UserPlus className="h-4 w-4" />
          Provision Agent
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'Alex Rivera', role: 'System Admin', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
          { name: 'Sarah Jenkins', role: 'Support Agent', status: 'On Break', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
          { name: 'Marcus Thorne', role: 'Lead Specialist', status: 'Busy', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
        ].map((user, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 group hover:shadow-xl transition-all relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-300 hover:text-[#1034A6] hover:bg-slate-50 rounded-xl"><MoreVertical className="h-5 w-5" /></button>
             </div>
             
             <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                   <img src={user.avatar} className="w-24 h-24 rounded-[30px] object-cover border-4 border-slate-50 shadow-md grayscale group-hover:grayscale-0 transition-all duration-500" alt={user.name} />
                   <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100">
                      <Shield className="h-4 w-4 text-[#1034A6]" />
                   </div>
                </div>
                
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">{user.name}</h3>
                   <p className="text-[10px] font-black text-[#1034A6] uppercase tracking-widest mt-1">{user.role}</p>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                   <div className={cn("w-2 h-2 rounded-full", user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-400')} />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.status}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </AgentShell>
  );
}
