import React, { useState } from 'react';
import { 
  GitFork, Sparkles, Send, Play, CheckCircle2, 
  Clock, Shield, ArrowDown, Bot, Layers, Save, Plus, Trash2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';

export default function WorkflowBuilderPage() {
  const [nlPrompt, setNlPrompt] = useState(
    'When a student submits a leave request longer than three days, send it to the faculty advisor. If approved, notify the student and update the attendance record. If it isn\'t reviewed within 24 hours, remind the advisor.'
  );
  const [isCompiling, setIsCompiling] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sample prompt chips (Section 19)
  const samplePrompts = [
    {
      label: '📝 3-Day Leave Approval Flow',
      text: 'When a student submits a leave request longer than three days, send it to the faculty advisor. If approved, notify the student and update the attendance record. If it isn\'t reviewed within 24 hours, remind the advisor.'
    },
    {
      label: '📽️ Urgent Classroom AV Dispatch',
      text: 'When classroom equipment fails before a presentation deadline, prioritize as HIGH, assign nearest available AV technician, start a 2-hour SLA timer, and escalate to HOD if unresolved in 60 minutes.'
    },
    {
      label: '🚿 Hostel Plumbing Emergency',
      text: 'When water flooding or pipe leakage is reported in hostel, classify as CRITICAL, dispatch senior plumber immediately, ping hostel warden, and send confirmation notice to affected students.'
    }
  ];

  const handleCompile = async () => {
    if (!nlPrompt.trim()) return;
    try {
      setIsCompiling(true);
      const res = await api.post('/workflows/generate', { prompt: nlPrompt });
      if (res.success && res.data) {
        setActiveWorkflow(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSaveWorkflow = async () => {
    if (!activeWorkflow) return;
    try {
      await api.post('/workflows', {
        name: activeWorkflow.name,
        description: activeWorkflow.description,
        triggerEvent: activeWorkflow.triggerEvent,
        definition: activeWorkflow
      });
      setSaveSuccess(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const getNodeColor = (type) => {
    const map = {
      TRIGGER: 'border-cyan-500 bg-cyan-950/40 text-cyan-300',
      AI_CLASSIFICATION: 'border-brand-500 bg-brand-950/40 text-brand-300',
      CONDITION: 'border-amber-500 bg-amber-950/40 text-amber-300',
      APPROVAL: 'border-purple-500 bg-purple-950/40 text-purple-300',
      ASSIGN: 'border-indigo-500 bg-indigo-950/40 text-indigo-300',
      NOTIFICATION: 'border-blue-500 bg-blue-950/40 text-blue-300',
      WAIT: 'border-yellow-500 bg-yellow-950/40 text-yellow-300',
      ESCALATE: 'border-rose-500 bg-rose-950/40 text-rose-300',
      END: 'border-emerald-500 bg-emerald-950/40 text-emerald-300',
    };
    return map[type] || 'border-slate-700 bg-slate-900 text-slate-300';
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
          <GitFork className="w-4 h-4 text-cyan-400" />
          <span>NATURAL LANGUAGE AUTOMATION BUILDER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Describe Your Automation
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          State your college operational policy in plain English. The AI compiler will automatically translate your text into an executable node-based workflow graph.
        </p>

        {/* Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5">
          <span className="text-[11px] text-slate-400 font-medium">Example Policies:</span>
          {samplePrompts.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setNlPrompt(s.text)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Natural Language Input Box */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Natural Language Automation Prompt
        </label>
        <textarea
          rows={3}
          value={nlPrompt}
          onChange={(e) => setNlPrompt(e.target.value)}
          placeholder="Describe your workflow in English..."
          className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition resize-none leading-relaxed"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            AI detects Triggers, Conditions, Assignments, Approvals, Timers, and Escalations.
          </span>

          <button
            onClick={handleCompile}
            disabled={isCompiling || !nlPrompt.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isCompiling ? 'animate-spin' : ''}`} />
            <span>{isCompiling ? 'COMPILING WORKFLOW...' : 'COMPILE INTO NODE GRAPH'}</span>
          </button>
        </div>
      </div>

      {/* Visual Node Workflow Graph (Section 20) */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>VISUAL WORKFLOW NODE GRAPH</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive node orchestration generated from your natural language instructions
            </p>
          </div>

          {activeWorkflow && (
            <div className="flex items-center space-x-3">
              {saveSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Workflow Saved!</span>
                </span>
              )}
              <button
                onClick={handleSaveWorkflow}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Workflow</span>
              </button>
            </div>
          )}
        </div>

        {activeWorkflow ? (
          <div className="max-w-xl mx-auto py-4 space-y-3">
            {activeWorkflow.nodes?.map((node, idx) => (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  className={`p-4 rounded-2xl border-2 ${getNodeColor(node.type)} shadow-lg transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40">
                      {node.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Step {idx + 1}</span>
                  </div>
                  <div className="font-bold text-xs text-white mt-1">{node.label}</div>
                  {node.config && Object.keys(node.config).length > 0 && (
                    <div className="mt-2 text-[10px] font-mono text-slate-300 bg-black/30 p-2 rounded-lg">
                      {JSON.stringify(node.config)}
                    </div>
                  )}
                </div>

                {/* Arrow Connector */}
                {idx < activeWorkflow.nodes.length - 1 && (
                  <div className="flex justify-center text-slate-500">
                    <ArrowDown className="w-5 h-5 animate-bounce" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs space-y-3">
            <GitFork className="w-8 h-8 text-cyan-400/60 mx-auto animate-pulse" />
            <p>Click "COMPILE INTO NODE GRAPH" above to generate your visual workflow flowchart.</p>
          </div>
        )}
      </div>

    </div>
  );
}
