import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Play, Cpu, ShieldCheck, Zap, 
  GitFork, Layers, Repeat, BarChart3, Bot, CheckCircle2 
} from 'lucide-react';

export default function LandingPage({ onOpenDemo }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 overflow-hidden">
      
      {/* Background Neon Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-brand-600/15 via-accent-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-cyber-blue" />
          <span>SMART AUTOMATION CHALLENGE • CAMPUS OPERATIONS AGENT</span>
        </div>

        {/* Main Headline (Section 46) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          LET AI RUN YOUR <br className="hidden sm:inline" />
          <span className="shimmer-text">COLLEGE OPERATIONS.</span>
        </h1>

        {/* Subtitle (Section 46) */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
          CampusFlow AI transforms unstructured campus requests into intelligent, automated workflows.
          Turn every student and faculty complaint into autonomous resolution.
        </p>

        {/* Call to Actions (Section 46) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Explore Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-panel hover:bg-slate-800/80 border border-white/20 text-slate-200 font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-cyber-blue" />
            <span>Run Live Demo</span>
          </button>
        </div>

        {/* Core Workflow Visual Flow (Section 46 & 62) */}
        <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-cyber-border max-w-4xl mx-auto mb-16 shadow-2xl">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-4 font-bold">
            Autonomous Operational Pipeline
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-semibold">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
              <div className="text-brand-400 font-mono text-[10px] mb-1">STEP 1</div>
              <div className="text-white">REQUEST</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-brand-500/30 text-brand-300">
              <div className="text-brand-400 font-mono text-[10px] mb-1">STEP 2</div>
              <div className="text-white">AI AGENT</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
              <div className="text-indigo-400 font-mono text-[10px] mb-1">STEP 3</div>
              <div className="text-white">DECISION</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
              <div className="text-purple-400 font-mono text-[10px] mb-1">STEP 4</div>
              <div className="text-white">AUTOMATION</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
              <div className="text-amber-400 font-mono text-[10px] mb-1">STEP 5</div>
              <div className="text-white">ACTION</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-emerald-300">
              <div className="text-emerald-400 font-mono text-[10px] mb-1">STEP 6</div>
              <div className="text-white">RESULT</div>
            </div>
          </div>
        </div>

        {/* Core Innovation Statement (Section 57) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-950/60 via-slate-900/80 to-accent-950/60 border border-brand-500/30 max-w-3xl mx-auto mb-20 text-left">
          <div className="text-xs font-mono font-bold text-cyber-blue uppercase tracking-wider mb-2">
            The Fundamental Innovation
          </div>
          <blockquote className="text-base sm:text-lg font-medium text-slate-100 italic leading-snug">
            "CampusFlow AI doesn't just digitize college workflows. It understands requests and autonomously orchestrates the next actions required to resolve them."
          </blockquote>
          <div className="mt-3 text-xs text-slate-400">
            Traditional software waits for humans to operate it. <strong>CampusFlow AI operates the workflow.</strong>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto mb-20">
          
          <div className="p-5 rounded-2xl glass-panel border border-cyber-border hover:border-brand-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-3">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">Intelligent Entity Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Students write unstructured complaints naturally. AI extracts category, location, equipment, deadline, and sets priority automatically.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-cyber-border hover:border-indigo-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">Multi-Factor Dispatch Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scored matching algorithm pairs tickets with staff based on verified skills (96%), current workload (42%), and facility proximity.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-cyber-border hover:border-purple-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">Duplicate Incident Clustering</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When 8 students report the same broken AC or projector, AI collapses them into a single Master Incident to prevent redundant labor.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-cyber-border hover:border-amber-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">Autonomous SLA Watchdog</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Background timers monitor response elapsed times. Issues 80% threshold reminders and escalates overdue tickets to Department Heads.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-cyber-border hover:border-emerald-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Repeat className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">Recurring Defect Radar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies chronically failing rooms and hardware (e.g. Lab 3 with 17 AC complaints) and recommends preventive work orders.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-cyber-border hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">NL Workflow Builder</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {"Admins type in plain English (\"If leave > 3 days send to advisor...\") and the AI compiles it into an executable node-based workflow graph."}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
