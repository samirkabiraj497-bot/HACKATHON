import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  ClipboardList,
  Layers,
  Repeat,
  GitFork,
  CheckSquare,
  Bot,
  FileText,
  BarChart3,
  Sliders,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    { to: '/', label: 'Overview & Landing', icon: Home },
    { to: '/dashboard', label: 'AI Operations Center', icon: LayoutDashboard },
    { to: '/intake', label: 'Smart Request Intake', icon: Sparkles, badge: 'AI' },
    { to: '/requests', label: 'Requests & Tickets', icon: ClipboardList },
    { to: '/duplicates', label: 'Duplicate Incidents', icon: Layers, badge: 'Cluster' },
    { to: '/recurring', label: 'Recurring Defect Radar', icon: Repeat },
    { to: '/workflows', label: 'Workflow Builder', icon: GitFork, badge: 'NL' },
    { to: '/approvals', label: 'Approvals Queue', icon: CheckSquare },
    { to: '/copilot', label: 'AI Operations Copilot', icon: Bot, badge: 'Chat' },
    { to: '/reports', label: 'Daily AI Report', icon: FileText },
    { to: '/analytics', label: 'Analytics & Impact', icon: BarChart3 },
    { to: '/admin', label: 'Control Center', icon: Sliders },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-cyber-border min-h-[calc(100vh-4rem)] p-3 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          Operations Workflows
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 text-brand-300 border border-brand-500/30 font-semibold shadow-sm shadow-brand-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Operations Quick Card */}
      <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900/90 to-brand-950/40 border border-brand-500/20 mt-4">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
          <span>Automation Engine</span>
          <span className="text-emerald-400 font-mono">94.2% SLA</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full w-[87%]" />
        </div>
        <p className="text-[10px] text-slate-400 mt-2 font-mono">
          Autonomously orchestrating campus operations.
        </p>
      </div>
    </aside>
  );
}
