import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Cpu, Bell, Play, User, CheckCircle2, AlertTriangle, 
  ExternalLink, ChevronDown, Check, Zap, Sparkles, PlusCircle 
} from 'lucide-react';

export default function Navbar({ onOpenDemo }) {
  const { user, switchRole } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles = [
    { key: 'admin', label: 'Campus Administrator', name: 'Dr. Vikram Patel', color: 'text-purple-400 border-purple-500/30' },
    { key: 'department_head', label: 'Department Head (IT)', name: 'Dr. Sunita Rao', color: 'text-blue-400 border-blue-500/30' },
    { key: 'faculty', label: 'Faculty Advisor', name: 'Prof. Rajesh Nair', color: 'text-emerald-400 border-emerald-500/30' },
    { key: 'staff', label: 'Staff Technician (AV)', name: 'Rahul Sharma', color: 'text-amber-400 border-amber-500/30' },
    { key: 'student', label: 'Student', name: 'Aarav Mehta', color: 'text-cyan-400 border-cyan-500/30' },
    { key: 'guest', label: 'Guest / Public Visitor', name: 'Campus Guest', color: 'text-rose-400 border-rose-500/30' },
  ];

  const currentRoleObj = roles.find(r => r.key === (user?.role || 'admin')) || roles[0];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyber-border bg-[#070b14]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Active Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-600 to-cyber-blue p-0.5 shadow-lg shadow-brand-500/20">
              <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyber-blue animate-pulse" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                CAMPUSFLOW <span className="text-cyber-blue">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold hidden sm:block">
                AI College Operations Agent
              </p>
            </div>
          </div>

          {/* AI AGENT ACTIVE BEACON */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>AI AGENT ACTIVE</span>
          </div>
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Open New Fresh Request */}
          <Link
            to="/new"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition shadow-sm shadow-emerald-500/10 cursor-pointer"
            title="Open a fresh ticket without demo presets"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Open New (Fresh)</span>
            <span className="sm:hidden">New</span>
          </Link>

          {/* Quick 1-Click Judge Demo Button */}
          <button
            id="run-demo-btn"
            onClick={onOpenDemo}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>RUN LIVE DEMO</span>
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition"
              title="Switch demo user role"
            >
              <div className="w-2 h-2 rounded-full bg-brand-400" />
              <span className="capitalize hidden sm:inline">{user?.role?.replace('_', ' ') || 'Admin'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 glass-dropdown rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5 mb-1">
                  Test As Persona
                </div>
                {roles.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      switchRole(r.key);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                      user?.role === r.key
                        ? 'bg-brand-600/20 text-brand-300 font-semibold border border-brand-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{r.label}</div>
                      <div className="text-[10px] text-slate-400">{r.name}</div>
                    </div>
                    {user?.role === r.key && <Check className="w-3.5 h-3.5 text-brand-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              id="notifications-bell"
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 hover:text-white transition"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-dropdown rounded-xl p-3 z-50 shadow-2xl max-h-[460px] overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-brand-400" />
                    <span className="text-xs font-semibold text-white">Notifications ({unreadCount} unread)</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-brand-400 hover:text-brand-300 transition"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">No notifications yet</div>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`p-2.5 rounded-lg text-xs transition cursor-pointer ${
                          !n.is_read
                            ? 'bg-slate-800/90 border-l-2 border-brand-500 text-slate-100'
                            : 'bg-slate-900/40 text-slate-400 opacity-80'
                        }`}
                      >
                        <div className="font-semibold text-slate-200">{n.title}</div>
                        <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{n.message}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <img
              src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover border border-brand-500/40"
            />
            <span className="text-xs font-medium text-slate-300 hidden lg:inline max-w-[110px] truncate">
              {user?.full_name?.split(' ')[0] || 'User'}
            </span>
          </div>

        </div>
      </div>
    </header>
  );
}
