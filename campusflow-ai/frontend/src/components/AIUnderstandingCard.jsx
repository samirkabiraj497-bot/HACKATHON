import React from 'react';
import { Bot, AlertTriangle, CheckCircle2, MapPin, Tag, ShieldAlert, Building2, Clock, Sparkles } from 'lucide-react';

export default function AIUnderstandingCard({ analysis, loading, onSelectDepartment }) {
  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-brand-500/30 animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-brand-400 animate-spin" />
          </div>
          <div>
            <div className="h-4 w-36 bg-slate-700 rounded mb-1" />
            <div className="h-3 w-48 bg-slate-800 rounded" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 w-full bg-slate-800 rounded" />
          <div className="h-3 w-3/4 bg-slate-800 rounded" />
          <div className="h-3 w-1/2 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-cyber-border text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 mx-auto flex items-center justify-center mb-3 text-brand-400">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">AI Live Intent Extractor</h4>
        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
          Start typing your request naturally. CampusFlow AI will automatically extract entities, diagnose urgency, and map department routing in real time.
        </p>
      </div>
    );
  }

  const priorityColors = {
    CRITICAL: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    HIGH: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    MEDIUM: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    LOW: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  };

  const confidencePct = Math.round((analysis.confidence || 0.94) * 100);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-brand-500/40 shadow-xl shadow-brand-500/5 relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-cyber-blue flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-300 font-mono">
              AI UNDERSTANDING
            </h4>
            <span className="text-[10px] text-slate-400">Autonomous Intent Extraction</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-[10px] text-slate-400">Confidence</div>
            <div className="text-xs font-mono font-bold text-emerald-400">{confidencePct}%</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
            <div
              className={`w-3 h-3 rounded-full ${
                confidencePct >= 80 ? 'bg-emerald-400' : confidencePct >= 65 ? 'bg-amber-400' : 'bg-rose-400'
              } animate-ping`}
            />
          </div>
        </div>
      </div>

      {/* Grid of Extracted Attributes */}
      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
        
        {/* Category */}
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] mb-1 font-semibold uppercase">
            <Tag className="w-3 h-3 text-brand-400" />
            <span>Category</span>
          </div>
          <div className="font-semibold text-slate-100 truncate">{analysis.category}</div>
          <div className="text-[10px] text-slate-400 truncate">{analysis.subcategory || 'General'}</div>
        </div>

        {/* Suggested Department */}
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] mb-1 font-semibold uppercase">
            <Building2 className="w-3 h-3 text-indigo-400" />
            <span>Target Dept</span>
          </div>
          <div className="font-semibold text-indigo-300 truncate">{analysis.department}</div>
          <div className="text-[10px] text-emerald-400 font-mono">Auto-Routing Enabled</div>
        </div>

        {/* Priority */}
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] mb-1 font-semibold uppercase">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Priority</span>
          </div>
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${priorityColors[analysis.priority] || priorityColors.MEDIUM}`}>
            {analysis.priority}
          </span>
        </div>

        {/* Location & Entities */}
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] mb-1 font-semibold uppercase">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Detected Location</span>
          </div>
          <div className="font-semibold text-slate-200 truncate">
            {analysis.entities?.location || 'Campus Facility'}
          </div>
        </div>

      </div>

      {/* Impact & Concise Reasoning (Section 51: No hidden reasoning, concise explanation) */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-brand-500/20 text-xs text-slate-300 space-y-1 mb-3">
        <div className="text-[10px] uppercase font-mono font-bold text-slate-400">AI Operational Rationale</div>
        <p className="text-[11px] leading-relaxed text-slate-200">
          {analysis.reasoning || `Detected ${analysis.priority} operational impact.`}
        </p>
      </div>

      {/* Low Confidence Fallback Selector (Section 29) */}
      {analysis.isConfidenceLow && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs mb-3">
          <div className="flex items-center space-x-2 text-amber-300 font-semibold mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>AI CONFIDENCE LOW ({confidencePct}%)</span>
          </div>
          <p className="text-[11px] text-amber-200/80 mb-2">
            The AI requests human confirmation for department routing. Please select the appropriate team:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['IT Support', 'Maintenance', 'Hostel', 'Academics', 'Administration'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onSelectDepartment && onSelectDepartment(d)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  analysis.department === d
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
