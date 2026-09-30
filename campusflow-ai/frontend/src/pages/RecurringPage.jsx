import React, { useState, useEffect } from 'react';
import { 
  Repeat, AlertTriangle, Wrench, ShieldAlert, CheckCircle2, 
  MapPin, Sparkles, ArrowRight, RefreshCw, BarChart2 
} from 'lucide-react';
import api from '../services/api';

export default function RecurringPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dispatchedActions, setDispatchedActions] = useState({});

  const fetchRecurring = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ai/recurring');
      if (res.success && res.data) {
        setInsights(res.data.insights || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, []);

  const handleAction = async (insightId) => {
    try {
      await api.post('/ai/copilot/action', {
        actionId: 'CREATE_PREVENTIVE_WORK_ORDER'
      });
      setDispatchedActions(prev => ({ ...prev, [insightId]: true }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-1">
          <Repeat className="w-4 h-4 text-amber-400" />
          <span>CAMPUS DEFECT RADAR & ASSET FATIGUE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Recurring Problem Detection
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          AI continuously correlates historical ticket telemetry to uncover chronic hardware breakdowns and systemic bottlenecks before they trigger emergency failures.
        </p>
      </div>

      {/* Flagship Highlight Card: Lab 3 AC with 17 complaints (Section 25) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/40 border border-amber-500/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>CHRONIC EQUIPMENT FATIGUE DETECTED</span>
            </span>
            <h2 className="text-xl font-bold text-white">
              Lab 3: 17 AC Complaints in the Last 30 Days
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              This repeated failure pattern indicates a deep compressor seal leak and condensate line block rather than an isolated incident.
              CampusFlow AI recommends scheduling a comprehensive preventive maintenance overhaul.
            </p>
          </div>

          <div className="shrink-0">
            {dispatchedActions['recurring-lab3-ac'] ? (
              <span className="px-5 py-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Preventive Overhaul Scheduled</span>
              </span>
            ) : (
              <button
                onClick={() => handleAction('recurring-lab3-ac')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition flex items-center space-x-2 cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>Dispatch Preventive Work Order</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* All Recurring Insights */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          AI Equipment & Facility Anomaly Hotspots ({insights.length})
        </h3>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
            Analyzing 30-day historical ticket clusters...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((ins) => (
              <div
                key={ins.id}
                className="glass-panel p-5 rounded-2xl border border-cyber-border hover:border-amber-500/30 transition space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm text-white">{ins.location}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    ins.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {ins.occurrences} Reports ({ins.timeframe})
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-slate-200">{ins.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {ins.observation}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-[11px] space-y-1">
                  <span className="font-semibold text-brand-300 uppercase tracking-wide text-[10px] font-mono">
                    AI Preventive Recommendation:
                  </span>
                  <p className="text-slate-300">{ins.recommendation}</p>
                </div>

                {ins.actionable && (
                  <div className="pt-1">
                    {dispatchedActions[ins.id] ? (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Action Dispatched to Facilities</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAction(ins.id)}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5 text-amber-400" />
                        <span>Apply AI Recommendation</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
