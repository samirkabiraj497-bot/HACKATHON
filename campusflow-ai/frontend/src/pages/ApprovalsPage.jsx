import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, CheckCircle2, XCircle, Clock, User, 
  Sparkles, AlertCircle, RefreshCw 
} from 'lucide-react';
import api from '../services/api';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/approvals');
      if (res.success && res.data) {
        setApprovals(res.data);
      }
    } catch (err) {
      console.error(err);
      // Fallback sample approvals
      setApprovals([
        {
          id: 'app-1',
          requestNumber: 'REQ-1064',
          requestTitle: 'On-Duty leave approval for inter-college debate tournament (4 days)',
          departmentName: 'Academics',
          approverRole: 'faculty_advisor',
          approverName: 'Prof. Rajesh Nair',
          status: 'pending',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'app-2',
          requestNumber: 'REQ-1071',
          requestTitle: 'Permission for Tech Club annual hackathon venue booking in Main Auditorium',
          departmentName: 'Student Affairs',
          approverRole: 'dean_student_affairs',
          approverName: 'Dr. Sunita Rao',
          status: 'pending',
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/approvals/${id}/approve`, { comments: 'Approved via Faculty Advisor portal.' });
      await fetchApprovals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) return;
    try {
      await api.post(`/approvals/${id}/reject`, { comments: rejectReason });
      setRejectingId(null);
      setRejectReason('');
      await fetchApprovals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <span>FACULTY & ADVISOR APPROVAL QUEUE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Approval Automation Center
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Multi-tier sign-off engine for On-Duty (OD) passes, event permits, and administrative leaves. AI validates criteria before human authorization.
        </p>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
            Loading approval queue...
          </div>
        ) : approvals.length === 0 ? (
          <div className="py-12 glass-panel rounded-2xl text-center text-slate-400 text-xs">
            No pending approval requests.
          </div>
        ) : (
          approvals.map((app) => (
            <div
              key={app.id}
              className="glass-panel p-5 rounded-2xl border border-cyber-border hover:border-emerald-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-brand-400">
                    {app.requestNumber}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {app.departmentName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Target Approver: <strong className="text-slate-200 capitalize">{app.approverRole?.replace('_', ' ')}</strong>
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{app.requestTitle}</h3>
                <p className="text-xs text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Submitted {new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                {app.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => setRejectingId(app.id)}
                      className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 font-semibold text-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize ${
                    app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {app.status}
                  </span>
                )}
              </div>

              {/* Rejection Reason Modal Inline */}
              {rejectingId === app.id && (
                <div className="w-full mt-3 pt-3 border-t border-white/10 flex items-center space-x-2">
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection (required)..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    onClick={() => handleReject(app.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold"
                  >
                    Confirm Reject
                  </button>
                  <button
                    onClick={() => setRejectingId(null)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
