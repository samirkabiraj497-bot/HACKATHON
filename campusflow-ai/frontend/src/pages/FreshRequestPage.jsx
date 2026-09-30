import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, Sparkles, Send, MapPin, Calendar, Paperclip, 
  CheckCircle2, ArrowRight, RefreshCw, Zap, User, 
  ShieldCheck, AlertTriangle, Clock, Layers, Check, 
  Building2, PlusCircle, HelpCircle, FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FreshRequestPage() {
  const navigate = useNavigate();
  const { user, switchRole } = useAuth();

  // Fresh Form State (Clean Slate - No presets)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('AUTO'); // 'AUTO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  const [manualDept, setManualDept] = useState('AUTO');
  const [deadline, setDeadline] = useState('');
  
  // Guest Profile Fields
  const [guestName, setGuestName] = useState(user?.role === 'guest' ? user.full_name : 'Guest Visitor');
  const [guestEmail, setGuestEmail] = useState(user?.role === 'guest' ? user.email : 'guest@campus.edu');
  const [isCustomizingGuest, setIsCustomizingGuest] = useState(false);

  // Live AI Feedback
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Quick Campus Location Chips
  const popularLocations = [
    'Classroom B204', 'Lab 3 (HVAC)', 'Central Library 2nd Floor',
    'Hostel Block B (3rd Flr)', 'Main Auditorium', 'Cafeteria Wing',
    'Sports Complex', 'Server Room A'
  ];

  // Auto-switch to guest profile on mount if not already in guest or student
  useEffect(() => {
    if (user?.role !== 'guest' && user?.role !== 'student') {
      // Optional toggle to easily run as guest
    }
  }, [user]);

  // Debounced Live AI Analysis as user types
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
        console.error('Live AI triage error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [title, description, location]);

  const handleSwitchToGuest = async () => {
    await switchRole('guest');
    setGuestName('Campus Guest (Visitor)');
    setGuestEmail('guest@campus.edu');
  };

  const handleClearForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setUrgency('AUTO');
    setManualDept('AUTO');
    setDeadline('');
    setAiAnalysis(null);
    setSubmissionSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await api.post('/requests', {
        title,
        description,
        location: location || 'Campus Main Ground',
        deadline: deadline || null,
        guestName,
        guestEmail,
        manualOverride: {
          priority: urgency !== 'AUTO' ? urgency : null,
          department: manualDept !== 'AUTO' ? manualDept : null
        }
      });

      if (res.success && res.data) {
        setSubmissionSuccess(res.data);
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-1">
            <PlusCircle className="w-4 h-4 text-rose-400" />
            <span>FRESH TICKET INTAKE & GUEST PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Open New Request
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Start completely fresh. Submit any facility, academic, IT, or infrastructure issue. CampusFlow AI will parse your description, compute priority, and dispatch technicians autonomously.
          </p>
        </div>

        {/* Profile Card Banner */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60 flex items-center space-x-3 shrink-0 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500/20 to-pink-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-white">{guestName}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 uppercase font-semibold">
                {user?.role === 'guest' ? 'Active Guest' : 'Guest Mode'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">{guestEmail}</div>
          </div>
          {user?.role !== 'guest' && (
            <button
              onClick={handleSwitchToGuest}
              className="ml-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition cursor-pointer border border-white/5"
              title="Switch user role to Guest"
            >
              Set as Guest
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Modal / Card */}
      {submissionSuccess ? (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-slate-900/60 to-slate-950/80 space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
              Autonomous Dispatch Complete
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Ticket {submissionSuccess.request?.request_number || 'REQ-NEW'} Created Successfully!
            </h2>
            <p className="text-xs text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
              Your request has been parsed, logged into the campus operational queue, and dispatched autonomously.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Assigned Technician</div>
              <div className="font-bold text-white mt-1">
                {submissionSuccess.assignment?.name || 'Rahul Sharma (AV Specialist)'}
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">
                Score: {submissionSuccess.assignment?.matchScore || 96}% Match
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Priority & Routing</div>
              <div className="font-bold text-white mt-1">
                {submissionSuccess.request?.priority || 'HIGH'} • {submissionSuccess.request?.department_name || 'IT Support'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Confidence: {Math.round((submissionSuccess.request?.ai_confidence || 0.95) * 100)}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Active SLA Deadline</div>
              <div className="font-bold text-amber-300 mt-1">
                {submissionSuccess.request?.sla_deadline 
                  ? new Date(submissionSuccess.request.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '8 Hours'
                }
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Autonomous Watchdog Active</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/requests')}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition flex items-center space-x-2 shadow-lg shadow-brand-600/30 cursor-pointer"
            >
              <span>View All Requests & SLA Timers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearForm}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center space-x-2 cursor-pointer border border-white/10"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Open Another Fresh Request</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form & Live AI Engine Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Input Form (7 Cols) */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-cyber-border space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-brand-400" />
                <span>Ticket Details Form</span>
              </span>
              <button
                type="button"
                onClick={handleClearForm}
                className="text-xs text-slate-400 hover:text-white transition flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Clear Form</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Guest Profile Inline Editor */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-rose-400" />
                    <span>Requester Profile (Guest Mode)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCustomizingGuest(!isCustomizingGuest)}
                    className="text-[11px] text-rose-300 hover:underline cursor-pointer"
                  >
                    {isCustomizingGuest ? 'Save Profile' : 'Edit Name / Email'}
                  </button>
                </div>

                {isCustomizingGuest ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 animate-in fade-in">
                    <div>
                      <label className="text-[10px] text-slate-400">Full Name</label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full mt-0.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-rose-500"
                        placeholder="Your Name (e.g. Samir Kabiraj)"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Email Address (for ticket updates)</label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full mt-0.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-rose-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-300 flex items-center justify-between">
                    <span>Submitting as: <strong>{guestName}</strong> ({guestEmail})</span>
                    <span className="text-[10px] text-emerald-400 font-mono">No password required</span>
                  </div>
                )}
              </div>

              {/* Request Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Request Summary / Issue Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Wi-Fi is failing in the Central Library 2nd floor study area"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 transition shadow-inner"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Detailed Description & Context <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what is broken, error codes, affected students, or specific equipment. The AI extracts details automatically..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-500 transition leading-relaxed resize-none shadow-inner"
                  required
                />
              </div>

              {/* Location with Quick Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Campus Location / Building / Room
                </label>
                <div className="relative mb-2">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Classroom B204 or Main Auditorium"
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-500 transition"
                  />
                </div>

                {/* Popular Location Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {popularLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        location === loc
                          ? 'bg-brand-600/30 border-brand-500 text-brand-300 font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency & Optional Deadline Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Urgency Override (Optional)
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="AUTO">🤖 Let AI Decide Urgency (Recommended)</option>
                    <option value="CRITICAL">🔴 Critical (Immediate Disruption - 2h SLA)</option>
                    <option value="HIGH">🟠 High (Urgent Attention - 8h SLA)</option>
                    <option value="MEDIUM">🟡 Medium (Standard - 24h SLA)</option>
                    <option value="LOW">🟢 Low (Routine Maintenance - 72h SLA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Department (Optional)
                  </label>
                  <select
                    value={manualDept}
                    onChange={(e) => setManualDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="AUTO">🤖 Let AI Route Department (Recommended)</option>
                    <option value="IT Support">IT Support (AV, Wi-Fi, Computers)</option>
                    <option value="Maintenance">Maintenance (HVAC, Electrical, Plumbing)</option>
                    <option value="Hostel">Hostel Administration</option>
                    <option value="Academics">Academics & Timetables</option>
                    <option value="Administration">General Administration</option>
                    <option value="Student Affairs">Student Affairs & Venues</option>
                    <option value="Library">Library Services</option>
                    <option value="Security">Campus Security</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold text-xs tracking-wide uppercase transition shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AUTONOMOUS AGENT DISPATCHING...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>LAUNCH AUTONOMOUS WORKFLOW</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

          {/* Live AI Understanding & Triage Side Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="glass-panel p-5 rounded-3xl border border-brand-500/30 bg-slate-950/70 space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Live AI Assistant</div>
                    <div className="text-[10px] text-slate-400 font-mono">Real-Time Triage Engine</div>
                  </div>
                </div>

                {isAnalyzing ? (
                  <span className="text-[10px] font-mono text-brand-400 flex items-center space-x-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Analyzing...</span>
                  </span>
                ) : aiAnalysis ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                    <Check className="w-2.5 h-2.5" />
                    <span>Entities Extracted</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">Waiting for text...</span>
                )}
              </div>

              {/* Dynamic Live Cards */}
              {aiAnalysis ? (
                <div className="space-y-3 animate-in fade-in">
                  
                  {/* Category & Department */}
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Target Department Routing</div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-white flex items-center space-x-1.5">
                        <Building2 className="w-4 h-4 text-brand-400" />
                        <span>{manualDept !== 'AUTO' ? manualDept : aiAnalysis.department}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-500/30">
                        {aiAnalysis.subcategory || aiAnalysis.category}
                      </span>
                    </div>
                  </div>

                  {/* Priority & SLA */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                      <div className="text-[10px] font-mono uppercase text-slate-400">Calculated Priority</div>
                      <div className="font-extrabold text-sm text-amber-300 mt-1 flex items-center space-x-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{urgency !== 'AUTO' ? urgency : aiAnalysis.priority}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                      <div className="text-[10px] font-mono uppercase text-slate-400">Target SLA Limit</div>
                      <div className="font-extrabold text-sm text-emerald-400 mt-1 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{aiAnalysis.slaHours || 8} Hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Autonomous Dispatch Preview */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-brand-950/40 to-slate-900/80 border border-brand-500/20 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-brand-300 font-semibold flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                      <span>Multi-Factor Technician Dispatch Preview</span>
                    </div>
                    <div className="text-xs text-slate-200">
                      Matches specialist in <strong>{aiAnalysis.department}</strong> with highest skill alignment and lowest pending task workload.
                    </div>
                  </div>

                  {/* AI Reasoning Summary */}
                  <div className="p-3 rounded-2xl bg-slate-900/40 border border-white/5 text-[11px] text-slate-400 leading-relaxed font-mono">
                    <strong className="text-slate-300">AI Logic:</strong> "{aiAnalysis.reasoning || 'Evaluated keyword urgency, physical asset impact, and academic schedule.'}"
                  </div>

                </div>
              ) : (
                <div className="py-10 text-center text-slate-500 text-xs space-y-2">
                  <Sparkles className="w-6 h-6 text-brand-400/40 mx-auto animate-pulse" />
                  <p>Type your request in the form. As you type, the AI parses your problem in real-time.</p>
                </div>
              )}

            </div>

            {/* Guest Guarantee Card */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-xs text-slate-400 space-y-1.5">
              <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Guest Submission Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Guest tickets are treated with equal SLA priority as registered users. The AI autonomous watchdog monitors all campus tickets 24/7.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
