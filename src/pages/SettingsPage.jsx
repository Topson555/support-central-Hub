import React from 'react';
import { AgentShell } from '../components/AgentShell';
import { Settings, Shield, Bell, Globe, Monitor, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SettingsPage() {
  return (
    <AgentShell 
      title="System Configuration" 
      subtitle="Define environment variables, notification logic, and security protocols."
    >
      <div className="max-w-4xl space-y-8">
        {[
          { icon: Shield, title: 'Security & Auth', desc: 'Manage 2FA, session duration, and IP whitelisting settings.' },
          { icon: Bell, title: 'Notifications', desc: 'Configure escalation alerts and automatic customer replies.' },
          { icon: Globe, title: 'Regional Support', desc: 'Define business hours, holidays, and timezone routing.' },
          { icon: Monitor, title: 'Interface Customization', desc: 'System-wide theme, accessibility, and high-density mode toggle.' },
          { icon: Lock, title: 'Compliance Hub', desc: 'GDPR, SOC2, and data retention policy management.' },
        ].map((setting, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-start gap-8 group hover:bg-[#FBFCFF] transition-all cursor-pointer">
             <div className="p-4 bg-[#F1F3F9] text-[#1034A6] rounded-2xl group-hover:bg-[#1034A6] group-hover:text-white transition-all shadow-sm">
                <setting.icon className="h-7 w-7" />
             </div>
             <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center justify-between">
                  {setting.title}
                  <span className="text-[10px] font-black text-[#1034A6] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-[0.2em] italic">Maintain Settings</span>
                </h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed">{setting.desc}</p>
             </div>
          </div>
        ))}

        <div className="pt-8 flex justify-end">
           <button className="px-10 py-5 bg-[#1034A6] text-white rounded-[24px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-indigo-900/30 hover:scale-105 active:scale-95 transition-all italic">
              Commit System Changes
           </button>
        </div>
      </div>
    </AgentShell>
  );
}
