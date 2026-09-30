import React, { useState } from 'react';
import { 
  X, Play, Sparkles, CheckCircle2, Bot, ArrowRight, 
  Layers, AlertTriangle, MessageSquare, RefreshCw, ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';

export default function LiveDemoModal({ onClose }) {
  const [activeScenario, setActiveScenario] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [scenarioResult, setScenarioResult] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const scenarios = [
    {
      id: 1,
      title: 'Scenario 1: Flagship Autonomous Workflow',
      desc: 'Projector broken in Classroom B204 with presentation tomorrow',
      tagline: 'Understand → Classify → Prioritize → Assign → Dispatch',
      icon: Sparkles
    },
    {
      id: 2,
      title: 'Scenario 2: Duplicate Incident Clustering',
      desc: '8 separate students submit complaints for Lab 3 AC leak',
      tagline: '8 Duplicate Reports → 1 Master Incident → 1 Single Work Order',
      icon: Layers
    },
    {
      id: 3,
      title: 'Scenario 3: SLA Warning & Autonomous Escalation',
      desc: 'Technician inactive -> 80% SLA reminder -> Escalation to HOD',
      tagline: 'SLA Watchdog → Auto Reminder → Supervisor Escalation',
      icon: AlertTriangle
    },
    {
      id: 4,
      title: 'Scenario 4: Grounded AI Copilot & Live Data Q&A',
      desc: 'Admin asks for real-time operational bottlenecks & report',
      tagline: 'Grounded Analysis → Anomaly Synthesis → Action Proposal',
      icon: MessageSquare
    }
  ];

  const handleRunScenario = async (scenarioId) => {
    setIsRunning(true);
    setScenarioResult(null);
    setCurrentStepIndex(0);

    try {
      const res = await api.post('/demo/run-scenario', { scenarioId });
      if (res.success && res.data) {
        setScenarioResult(res.data);

        // Step-by-step sequential animation
        const stepsCount = res.data.steps?.length || 5;
        for (let i = 0; i <= stepsCount; i++) {
          await new Promise((r) => setTimeout(r, 600));
          setCurrentStepIndex(i);
        }

        // Trigger celebratory confetti
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="glass-dropdown rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-brand-500/40 shadow-2xl p-6 text-white relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyber-blue flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              🚀 JUDGE LIVE DEMONSTRATION CENTER
            </h2>
            <p className="text-xs text-slate-400">
              Select any scenario to execute live autonomous operations on actual database records
            </p>
          </div>
        </div>

        {/* Scenario Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isSelected = activeScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveScenario(sc.id);
                  setScenarioResult(null);
                  setCurrentStepIndex(0);
                }}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-brand-600/25 border-brand-500 text-white shadow-lg shadow-brand-500/10'
                    : 'bg-slate-900/60 border-cyber-border text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    S{sc.id}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-200 mb-1 line-clamp-1">{sc.title}</div>
                <div className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{sc.tagline}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Scenario Execution Panel */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-brand-500/30 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-400">
                Active Demonstration Script
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {scenarios.find(s => s.id === activeScenario)?.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {scenarios.find(s => s.id === activeScenario)?.desc}
              </p>
            </div>

            <button
              onClick={() => handleRunScenario(activeScenario)}
              disabled={isRunning}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'AUTONOMOUS AGENT RUNNING...' : 'EXECUTE SCENARIO NOW'}</span>
            </button>
          </div>

          {/* Sequential Live Steps Output */}
          {scenarioResult ? (
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Autonomous Execution Sequence Complete</span>
              </div>

              <div className="space-y-2.5">
                {scenarioResult.steps?.map((step, idx) => {
                  const isVisible = idx < currentStepIndex;
                  if (!isVisible) return null;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs flex items-start space-x-3 animate-in fade-in slide-in-from-left-2"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-[10px] font-bold border border-emerald-500/40">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-200">{step.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-mono">
                          {step.detail}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Extra Result Details */}
              {scenarioResult.liveRequest && (
                <div className="p-3 rounded-xl bg-brand-950/40 border border-brand-500/30 text-xs text-brand-200 mt-3 flex items-center justify-between">
                  <span>Created Live Ticket: <strong>{scenarioResult.liveRequest.request_number}</strong> ({scenarioResult.liveRequest.status})</span>
                  <span className="text-[10px] font-mono text-emerald-400">Assigned: Rahul Sharma (AV Specialist)</span>
                </div>
              )}

              {scenarioResult.copilotOutput && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-accent-500/30 text-xs text-slate-200 mt-3 space-y-2">
                  <div className="font-mono text-[10px] text-accent-400 uppercase font-bold">Copilot Real-Time Analysis</div>
                  <div className="whitespace-pre-line text-[11px] leading-relaxed text-slate-300">
                    {scenarioResult.copilotOutput.answer}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Bot className="w-8 h-8 text-brand-400/60 mx-auto animate-bounce" />
              <p>Click "EXECUTE SCENARIO NOW" to watch the CampusFlow AI agent operate this workflow live.</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>CampusFlow AI • Smart Automation Scenario-Based Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
          >
            Close Demonstration
          </button>
        </div>

      </div>
    </div>
  );
}
