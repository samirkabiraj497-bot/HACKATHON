import React, { useState } from 'react';
import { 
  Bot, Send, Sparkles, CheckCircle2, User, Wrench, 
  AlertTriangle, RefreshCw, Zap, ArrowRight, ShieldCheck 
} from 'lucide-react';
import api from '../services/api';

export default function CopilotPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: "👋 Welcome to CampusFlow Operations Copilot! I am connected directly to live campus ticket databases, staff workloads, and SLA timers. How can I assist your operational oversight today?",
      actionProposal: null
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const samplePrompts = [
    "What are today's urgent issues?",
    "Which department has the most pending requests?",
    "Which tasks are close to their SLA?",
    "Show me unresolved IT requests.",
    "Which problems are recurring?",
    "Remind all assigned technicians."
  ];

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');

    try {
      setLoading(true);
      const res = await api.post('/ai/copilot/query', { query: textToSend });
      if (res.success && res.data) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'copilot',
            text: res.data.answer,
            actionProposal: res.data.actionProposal
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'copilot',
          text: "I experienced an issue fetching live records, but all background automation systems remain active."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = async (actionProposal) => {
    try {
      setLoading(true);
      const res = await api.post('/ai/copilot/action', {
        actionId: actionProposal.actionId
      });
      if (res.success) {
        setActionSuccess(res.data.message || 'Action executed successfully.');
        setMessages(prev => [
          ...prev,
          {
            sender: 'copilot',
            text: `✅ **Action Confirmed & Executed:** ${res.data.message || 'Operation executed across campus channels.'}`
          }
        ]);
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-400 mb-1">
          <Bot className="w-4 h-4 text-cyber-blue" />
          <span>OPERATIONAL DECISION COPILOT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Operations Copilot
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Conversational command assistant grounded in actual database metrics. Inquire about campus bottlenecks and authorize automated corrective actions.
        </p>

        {/* Suggestion Chips (Section 50) */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5">
          <span className="text-[11px] text-slate-400 font-medium">Try asking:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer text-left"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="glass-panel rounded-3xl p-5 border border-cyber-border min-h-[420px] max-h-[520px] overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${
              m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gradient-to-tr from-brand-600 to-cyber-blue text-white shadow-md shadow-brand-500/20'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed max-w-2xl ${
                m.sender === 'user'
                  ? 'bg-purple-600/30 text-white border border-purple-500/30 rounded-tr-none'
                  : 'bg-slate-900/80 text-slate-200 border border-white/10 rounded-tl-none space-y-3'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed font-sans">
                {m.text}
              </div>

              {/* Action Proposal Card (Section 27 & 28: Action-Based AI with Human Confirmation) */}
              {m.actionProposal && (
                <div className="p-3.5 rounded-xl bg-brand-950/60 border border-brand-500/40 text-xs space-y-2 mt-2">
                  <div className="flex items-center space-x-2 text-brand-300 font-bold uppercase text-[10px] font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Action-Based AI Proposal (Human Confirmation Required)</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {m.actionProposal.summary}
                  </p>
                  <button
                    onClick={() => handleExecuteAction(m.actionProposal)}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>{m.actionProposal.actionLabel}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-400" />
            <span>Copilot querying live operations database...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="glass-panel p-2.5 rounded-2xl border border-cyber-border flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask a question about campus tickets, technician load, or SLA risks..."
          className="flex-1 px-4 py-2 bg-transparent text-xs text-white placeholder-slate-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition disabled:opacity-40 cursor-pointer shadow-md shadow-brand-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
