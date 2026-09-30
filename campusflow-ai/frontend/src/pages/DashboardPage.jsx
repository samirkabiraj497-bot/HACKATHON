import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, Sparkles, CheckCircle2, Clock, AlertTriangle, 
  ArrowUpRight, BarChart2, Layers, Repeat, Bot, 
  ShieldAlert, UserCheck, Flame, TrendingUp 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import api from '../services/api';
import LiveActivityFeed from '../components/LiveActivityFeed';

export default function DashboardPage({ onOpenDemo }) {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics');
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const summary = analytics?.summary || {
    totalRequests: 142,
    completedRequests: 97,
    activeRequests: 31,
    urgentRequests: 14,
    escalatedCount: 6,
    automationRate: '87%',
    avgResolutionDisplay: '2h 14m',
    hoursSaved: '38.5 hrs',
    slaComplianceRate: '94.2%',
    duplicateRequestsMerged: 18
  };

  const weeklyData = analytics?.weeklyTrends || [
    { day: 'Mon', requests: 28, automated: 25, resolved: 24 },
    { day: 'Tue', requests: 34, automated: 30, resolved: 29 },
    { day: 'Wed', requests: 42, automated: 37, resolved: 36 },
    { day: 'Thu', requests: 38, automated: 34, resolved: 32 },
    { day: 'Fri', requests: 45, automated: 40, resolved: 38 },
    { day: 'Sat', requests: 19, automated: 18, resolved: 18 },
    { day: 'Sun', requests: 12, automated: 11, resolved: 11 },
  ];

  const deptData = analytics?.departmentDistribution || [
    { name: 'IT Support', value: 48 },
    { name: 'Maintenance', value: 42 },
    { name: 'Hostel', value: 24 },
    { name: 'Academics', value: 16 },
    { name: 'Admin', value: 12 },
  ];

  const priorityColors = {
    CRITICAL: '#f43f5e',
    HIGH: '#f59e0b',
    MEDIUM: '#38a8f6',
    LOW: '#10b981',
  };

  const priorityData = analytics?.priorityDistribution || [
    { name: 'CRITICAL', count: 14 },
    { name: 'HIGH', count: 38 },
    { name: 'MEDIUM', count: 68 },
    { name: 'LOW', count: 22 },
  ];

  const DEPT_COLORS = ['#38a8f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-6">
      
      {/* Top Header / Operations Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-cyber-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-400 mb-1">
            <Cpu className="w-4 h-4 text-cyber-blue" />
            <span>CAMPUSFLOW AI • AI OPERATIONS CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Operations Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time autonomous intake, intelligent technician dispatching, duplicate suppression, and SLA watchdog monitoring.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/intake')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Smart Intake</span>
          </button>

          <button
            onClick={onOpenDemo}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>RUN DEMO SCENARIOS</span>
          </button>
        </div>
      </div>

      {/* Today's Operations Primary Metrics (Section 11) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Requests */}
        <div className="glass-panel p-5 rounded-2xl border border-cyber-border relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Today's Requests</span>
            <Bot className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {summary.totalRequests}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1 mt-2 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+18% from last week</span>
          </div>
        </div>

        {/* Completed */}
        <div className="glass-panel p-5 rounded-2xl border border-cyber-border relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Completed Operations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-300 font-mono tracking-tight">
            {summary.completedRequests}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-mono">
            {summary.slaComplianceRate} within SLA
          </div>
        </div>

        {/* Active Workflows */}
        <div className="glass-panel p-5 rounded-2xl border border-cyber-border relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Active Tickets</span>
            <Clock className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-brand-300 font-mono tracking-tight">
            {summary.activeRequests}
          </div>
          <div className="text-[11px] text-brand-400 mt-2 font-mono">
            Autonomous queue dispatch
          </div>
        </div>

        {/* Urgent / Escalated */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Urgent / High</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-rose-300 font-mono tracking-tight">
            {summary.urgentRequests}
          </div>
          <div className="text-[11px] text-rose-400 mt-2 font-mono">
            {summary.escalatedCount} Escalated to HOD
          </div>
        </div>

      </div>

      {/* Secondary Automation KPI Row (Section 11 & 34) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-950/50 to-slate-900 border border-brand-500/20">
          <div className="text-[11px] text-slate-400 uppercase font-mono font-bold">Automation Rate</div>
          <div className="text-2xl font-bold text-cyber-blue font-mono mt-1">{summary.automationRate}</div>
          <div className="text-[10px] text-slate-400 mt-1">Autonomous triage with zero manual dispatch</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/20">
          <div className="text-[11px] text-slate-400 uppercase font-mono font-bold">Average Resolution</div>
          <div className="text-2xl font-bold text-indigo-300 font-mono mt-1">{summary.avgResolutionDisplay}</div>
          <div className="text-[10px] text-slate-400 mt-1">vs 18h 40m traditional manual delay</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-slate-900 border border-emerald-500/20">
          <div className="text-[11px] text-slate-400 uppercase font-mono font-bold">Labor Hours Saved</div>
          <div className="text-2xl font-bold text-emerald-300 font-mono mt-1">{summary.hoursSaved}</div>
          <div className="text-[10px] text-slate-400 mt-1">Eliminated manual routing & data entry</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/50 to-slate-900 border border-purple-500/20">
          <div className="text-[11px] text-slate-400 uppercase font-mono font-bold">Duplicates Merged</div>
          <div className="text-2xl font-bold text-purple-300 font-mono mt-1">{summary.duplicateRequestsMerged}</div>
          <div className="text-[10px] text-slate-400 mt-1">Clustered into single master work orders</div>
        </div>

      </div>

      {/* Main Charts & Activity Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Throughput Chart (2 Columns) */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-3xl border border-cyber-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Throughput & Autonomous Automation Volume</h3>
              <p className="text-xs text-slate-400">Total campus requests vs automated decisions</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              87% AI Handled
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38a8f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38a8f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAutomated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="requests" stroke="#38a8f6" fillOpacity={1} fill="url(#colorRequests)" name="Total Requests" />
                <Area type="monotone" dataKey="automated" stroke="#10b981" fillOpacity={1} fill="url(#colorAutomated)" name="Automated by AI" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live AI Activity Stream (Section 12) */}
        <div className="lg:col-span-1">
          <LiveActivityFeed />
        </div>

      </div>

      {/* Bottom Distribution Row (Department & Priority) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Operational Load */}
        <div className="glass-panel p-5 rounded-3xl border border-cyber-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Department Operational Distribution</h3>
              <p className="text-xs text-slate-400">Total tickets handled across specialized campus units</p>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={90} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#38a8f6" radius={[0, 8, 8, 0]}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="glass-panel p-5 rounded-3xl border border-cyber-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Priority Severity Distribution</h3>
              <p className="text-xs text-slate-400">Determined automatically via AI Priority Engine</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {priorityData.map((p) => (
              <div 
                key={p.name}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 text-center"
              >
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 mb-1">
                  {p.name}
                </div>
                <div className="text-2xl font-extrabold font-mono" style={{ color: priorityColors[p.name] || '#94a3b8' }}>
                  {p.count}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {p.name === 'CRITICAL' ? '2h Target' : p.name === 'HIGH' ? '8h Target' : 'Standard'}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-brand-500/20 text-xs text-slate-300 flex items-center justify-between">
            <span className="text-slate-400">High & Critical tickets monitored via autonomous 80% SLA timer</span>
            <button 
              onClick={() => navigate('/requests')}
              className="text-brand-400 hover:text-brand-300 font-semibold text-xs flex items-center space-x-1"
            >
              <span>View tickets</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
