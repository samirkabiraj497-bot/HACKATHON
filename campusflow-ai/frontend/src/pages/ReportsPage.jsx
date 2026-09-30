import React, { useState, useEffect } from 'react';
import { 
  FileText, Printer, Copy, Check, Sparkles, 
  TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, BarChart2 
} from 'lucide-react';
import api from '../services/api';

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/daily');
      if (res.success && res.data) {
        setReport(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!report) return;
    const text = `CAMPUSFLOW AI — DAILY OPERATIONS REPORT (${report.reportDate})\nTotal Requests: ${report.metrics.totalRequests}\nCompleted: ${report.metrics.completedRequests}\nAutomation Rate: ${report.metrics.automationRate}\nAverage Resolution: ${report.metrics.avgResolutionTime}\nHours Saved: ${report.metrics.hoursSaved}\n\nOBSERVATIONS:\n${report.observations.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nRECOMMENDATIONS:\n${report.recommendations.map(r => `• ${r}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-400 mb-1">
            <FileText className="w-4 h-4 text-cyber-blue" />
            <span>EXECUTIVE SYNTHESIS BRIEFING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Daily AI Operations Report
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Synthesized operational intelligence compiled autonomously from cross-department ticket logs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition flex items-center space-x-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-400" />
          Compiling daily telemetry and synthesizing recommendations...
        </div>
      ) : report ? (
        <div className="glass-panel rounded-3xl p-8 border border-cyber-border space-y-8 bg-[#0a0f1d]">
          
          {/* Top Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-brand-400 uppercase">
                CAMPUS OPERATIONS DIRECTIVE
              </span>
              <h2 className="text-xl font-bold text-white mt-1">Executive Summary for {report.reportDate}</h2>
              <div className="text-xs text-slate-400">Generated autonomously at {new Date(report.generatedAt).toLocaleTimeString()}</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold self-start">
              Status: VERIFIED
            </div>
          </div>

          {/* Metric KPI Blocks (Section 32) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Total Requests</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">{report.metrics.totalRequests}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Completed</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{report.metrics.completedRequests}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Pending</div>
              <div className="text-2xl font-bold text-brand-400 font-mono mt-1">{report.metrics.pendingRequests}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Urgent</div>
              <div className="text-2xl font-bold text-rose-400 font-mono mt-1">{report.metrics.urgentRequests}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Escalations</div>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{report.metrics.escalatedRequests}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Avg Resolution</div>
              <div className="text-2xl font-bold text-cyber-blue font-mono mt-1">{report.metrics.avgResolutionTime}</div>
            </div>
          </div>

          {/* AI Observations (Section 32) */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyber-blue" />
              <span>AI Operational Observations</span>
            </h3>
            <div className="space-y-2">
              {report.observations.map((obs, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900/50 border border-white/5 text-xs text-slate-300 flex items-start space-x-3 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 font-mono font-bold text-[10px]">
                    {i + 1}
                  </span>
                  <span>{obs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations (Section 32) */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Actionable Operational Recommendations</span>
            </h3>
            <div className="space-y-2">
              {report.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200/90 flex items-start space-x-3 leading-relaxed"
                >
                  <span className="text-emerald-400 font-bold shrink-0">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Model: {report.aiModel}</span>
            <span>CampusFlow AI • Autonomous College Operations</span>
          </div>

        </div>
      ) : null}

    </div>
  );
}
