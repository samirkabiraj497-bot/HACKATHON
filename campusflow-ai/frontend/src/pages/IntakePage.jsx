import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, Sparkles, Send, MapPin, Calendar, Paperclip, 
  CheckCircle2, ArrowRight, RefreshCw, Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import AIUnderstandingCard from '../components/AIUnderstandingCard';

export default function IntakePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Quick 1-Click Demo Prompts (Section 5, 24, 25)
  const samplePrompts = [
    {
      label: '📽️ Projector in B204 (Scenario 1)',
      title: "The projector in classroom B204 isn't working and we have an important presentation tomorrow morning.",
      desc: "The ceiling projector will not turn on and is blinking red lamp error. We have our final capstone presentation tomorrow at 9:00 AM.",
      loc: "Classroom B204"
    },
    {
      label: '❄️ AC Leak in Lab 3 (Scenario 2)',
      title: "The AC in Lab 3 has been leaking for two days and students cannot use the room.",
      desc: "Water is dripping continuously from ceiling AC unit onto student desks. Lab practical cannot be held due to dampness.",
      loc: "Lab 3"
    },
    {
      label: '📶 Hostel Wi-Fi Crash',
      title: "Hostel Block B 3rd floor Wi-Fi access point completely down.",
      desc: "No internet connectivity since 7 PM. Multiple students are preparing for semester midterms.",
      loc: "Hostel Block B"
    },
    {
      label: '📝 4-Day Leave & OD Request',
      title: "Request for On-Duty leave for 4 days to attend National Hackathon.",
      desc: "Selected as finalist for inter-college smart automation contest from Thursday to Sunday.",
      loc: "Computer Science Dept"
    }
  ];

  // Debounced Live AI Analysis
  useEffect(() => {
    if (!title.trim() && !description.trim()) {
      setAiAnalysis(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsAnalyzing(true);
        const res = await api.post('/ai/classify', {
          title,
          description: description || title,
          location
        });
        if (res.success && res.data) {
          setAiAnalysis(res.data);
          if (res.data.entities?.location && !location) {
            setLocation(res.data.entities.location);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [title, description, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await api.post('/requests', {
        title,
        description: description || title,
        location,
        deadline
      });

      if (res.success && res.data) {
        setSubmissionSuccess(res.data);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadSamplePrompt = (p) => {
    setTitle(p.title);
    setDescription(p.desc);
    setLocation(p.loc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-400 mb-1">
          <Sparkles className="w-4 h-4 text-cyber-blue" />
          <span>AUTONOMOUS REQUEST INTAKE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Natural Language Operational Request
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Students and faculty do not need to manually configure departments, categories, or technician rosters. Simply write the issue naturally.
        </p>

        {/* Quick Sample Prompts Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5">
          <span className="text-[11px] text-slate-400 font-medium">Quick Demo Scenarios:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadSamplePrompt(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {submissionSuccess ? (
        /* Submission Success Confirmation Card */
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white">
            Request Triaged & Dispatched Autonomously!
          </h2>

          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-xs space-y-2 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">Request Number:</span>
              <strong className="text-brand-300 font-mono text-sm">{submissionSuccess.request?.request_number}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Department:</span>
              <span className="text-slate-200 font-semibold">{submissionSuccess.request?.department_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Calculated Priority:</span>
              <span className="text-rose-400 font-bold">{submissionSuccess.request?.priority}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Assigned Technician:</span>
              <span className="text-emerald-400 font-bold">
                {submissionSuccess.assignment?.name || 'Rahul Sharma (AV Specialist)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">SLA Resolution Target:</span>
              <span className="text-cyan-300 font-mono">
                {new Date(submissionSuccess.request?.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => {
                setSubmissionSuccess(null);
                setTitle('');
                setDescription('');
                setLocation('');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              Submit Another Request
            </button>
            <button
              onClick={() => navigate('/requests')}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/30 transition flex items-center space-x-1.5"
            >
              <span>View All Requests</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Main Intake Two-Column Form & AI Preview Card */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form: 7 cols */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-cyber-border">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Title / Summary */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  What is the operational problem? *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The projector in classroom B204 isn't working and we have a presentation tomorrow"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Context & Observation
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you observed, error lights, urgency factors, or affected students..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-xs text-white placeholder-slate-500 outline-none transition resize-none leading-relaxed"
                />
              </div>

              {/* Location & Optional Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Location (Auto-Extracted)</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lab 3, Classroom B204"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-brand-500 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-400" />
                    <span>Event Deadline (Optional)</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-brand-500 text-xs text-slate-300 outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-brand-600/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{isSubmitting ? 'TRIAGING & DISPATCHING...' : 'SUBMIT OPERATIONAL REQUEST'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: AI Understanding Preview Card (5 cols) */}
          <div className="lg:col-span-5">
            <AIUnderstandingCard
              analysis={aiAnalysis}
              loading={isAnalyzing}
              onSelectDepartment={(d) => {
                if (aiAnalysis) {
                  setAiAnalysis({ ...aiAnalysis, department: d, isConfidenceLow: false });
                }
              }}
            />
          </div>

        </div>
      )}

    </div>
  );
}
