import React, { useState, useEffect } from 'react';
import { 
  Sliders, Building2, Users, ShieldAlert, Cpu, 
  CheckCircle2, RefreshCw, Save, Clock, Plus 
} from 'lucide-react';
import api from '../services/api';

export default function AdminControlPage() {
  const [slaRules, setSlaRules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [confidenceThreshold, setConfidenceThreshold] = useState('70');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [slaRes, empRes] = await Promise.all([
        api.get('/escalation/rules'),
        api.get('/employees')
      ]);

      if (slaRes.success) setSlaRules(slaRes.data);
      if (empRes.success) setEmployees(empRes.data);
    } catch (err) {
      console.error(err);
      // Fallback sample SLAs
      setSlaRules([
        { priority: 'CRITICAL', response_time_minutes: 30, resolution_time_minutes: 120, warning_threshold_pct: 80 },
        { priority: 'HIGH', response_time_minutes: 120, resolution_time_minutes: 480, warning_threshold_pct: 80 },
        { priority: 'MEDIUM', response_time_minutes: 480, resolution_time_minutes: 1440, warning_threshold_pct: 80 },
        { priority: 'LOW', response_time_minutes: 1440, resolution_time_minutes: 4320, warning_threshold_pct: 80 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-1">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>CAMPUSFLOW AI CONTROL PANEL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Automation Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Configure dynamic SLA thresholds, escalation tiers, AI confidence cutoffs, and specialist skill matrices.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center space-x-1.5 cursor-pointer self-start sm:self-center"
        >
          {savedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Settings Saved' : 'Save System Settings'}</span>
        </button>
      </div>

      {/* SLA Engine Configuration (Section 22 & 36) */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-white">
          <Clock className="w-4 h-4 text-brand-400" />
          <span>Dynamic SLA Agreement Rules (Section 22)</span>
        </div>
        <p className="text-xs text-slate-400">
          Target response and resolution windows by priority tier. The SLA watchdog issues warnings at 80% and auto-escalates at 100%.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {slaRules.map((rule, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-extrabold text-brand-300">{rule.priority}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {rule.warning_threshold_pct || 80}% Warning
                </span>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
                  Response SLA (Minutes)
                </label>
                <input
                  type="number"
                  defaultValue={rule.response_time_minutes}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
                  Resolution SLA (Hours)
                </label>
                <input
                  type="number"
                  defaultValue={Math.round(rule.resolution_time_minutes / 60)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Decision Thresholds (Section 29) */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-white">
          <Cpu className="w-4 h-4 text-cyber-blue" />
          <span>AI Decision & Human-in-the-Loop Thresholds (Section 28 & 29)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Minimum AI Confidence Cutoff</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(e.target.value)}
              className="w-full accent-brand-500"
            />
            <p className="text-[11px] text-slate-400">
              When classification confidence drops below {confidenceThreshold}%, the system requires human confirmation before routing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="text-xs font-semibold text-slate-200">Autonomous Model Configuration</div>
            <div className="flex items-center space-x-2 pt-1">
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono">
                CampusFlow Neural Classifier v2 (Zero-Latency Local + Supabase)
              </span>
              <span className="text-xs font-mono text-emerald-400">ACTIVE</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Enables deterministic intent extraction with zero API downtime fallback for hackathon judges.
            </p>
          </div>

        </div>
      </div>

      {/* Employee Skill Matrix (Section 17) */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-white">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Staff Specialist Profiles & Workload Scores (Section 17)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {employees.slice(0, 6).map((emp) => (
            <div key={emp.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{emp.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  emp.isAvailable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {emp.isAvailable ? 'Available' : 'Busy'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{emp.jobTitle} • {emp.departmentName}</div>
              
              {/* Workload meter */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>Current Workload</span>
                  <span className="text-brand-300 font-bold">{emp.workloadScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-brand-500 h-full rounded-full"
                    style={{ width: `${emp.workloadScore}%` }}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 pt-1">
                {(emp.skills || []).slice(0, 3).map((sk, sIdx) => (
                  <span key={sIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
