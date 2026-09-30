import React, { useState, useEffect } from 'react';
import { Bot, User, CheckCircle2, AlertTriangle, Clock, RefreshCw, Zap, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function LiveActivityFeed() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/audit-logs');
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (e) {
      // Fallback sample events
      setLogs([
        { id: '1', timestamp: new Date(Date.now() - 3 * 60000).toISOString(), actor_name: 'CampusFlow AI Agent', actor_type: 'AI_AGENT', action: 'AI_CLASSIFIED_REQUEST', details: 'Classified REQ-1042 as HIGH Priority under IT Support' },
        { id: '2', timestamp: new Date(Date.now() - 2.5 * 60000).toISOString(), actor_name: 'CampusFlow Dispatcher Engine', actor_type: 'AI_AGENT', action: 'ASSIGNED_EMPLOYEE', details: 'Assigned Rahul Sharma (96% AV skill match, 42% workload)' },
        { id: '3', timestamp: new Date(Date.now() - 2 * 60000).toISOString(), actor_name: 'Notification Gateway', actor_type: 'SYSTEM', action: 'NOTIFICATION_SENT', details: 'Push alert sent to Rahul Sharma via mobile terminal' },
        { id: '4', timestamp: new Date(Date.now() - 1.5 * 60000).toISOString(), actor_name: 'Rahul Sharma', actor_type: 'HUMAN', action: 'TASK_ACCEPTED', details: 'Technician accepted dispatch for Classroom B204' },
        { id: '5', timestamp: new Date(Date.now() - 1 * 60000).toISOString(), actor_name: 'CampusFlow SLA Watchdog', actor_type: 'AI_AGENT', action: 'SLA_RISK_MONITORED', details: 'Calculated 8-hour target resolution window' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, []);

  const getActorBadge = (actorType) => {
    if (actorType === 'AI_AGENT') {
      return (
        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
          <Bot className="w-3 h-3" />
          <span>AI ACTION</span>
        </span>
      );
    }
    if (actorType === 'HUMAN') {
      return (
        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          <User className="w-3 h-3" />
          <span>HUMAN</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-700/60 text-slate-300 border border-slate-600">
        <Zap className="w-3 h-3 text-amber-400" />
        <span>SYSTEM</span>
      </span>
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-cyber-border">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold tracking-tight text-white flex items-center space-x-2">
            <span>LIVE AI OPERATIONS STREAM</span>
          </h3>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-white p-1 rounded transition"
          title="Refresh activity"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {logs.map((log, index) => {
          const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <div
              key={log.id || index}
              className="flex items-start space-x-3 text-xs p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/60 border border-white/5 transition"
            >
              <div className="text-[11px] font-mono font-bold text-slate-400 shrink-0 w-12 pt-0.5">
                {time}
              </div>

              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{log.action?.replace(/_/g, ' ')}</span>
                  {getActorBadge(log.actor_type)}
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {log.details || log.action}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
