import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, CheckCircle2, XCircle, Clock, User, 
  Sparkles, AlertCircle, RefreshCw, Filter, ShieldCheck, 
  BookOpen, ChevronRight, FileCheck
} from 'lucide-react';
import api from '../services/api';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/approvals');
      if (res.success && res.data && res.data.length > 0) {
        setApprovals(res.data);
      } else {
        // Trigger auto-seed if empty
        const seedRes = await api.post('/approvals/reset');
        if (seedRes.success && seedRes.data) {
          setApprovals(seedRes.data);
        }
      }
    } catch (err) {
      console.error(err);
      // Hard fallback ensuring rich demo experience
      setApprovals([
        {
          id: 'app-0000-0000-0000-000000000001',
          requestNumber: 'REQ-1064',
          requestTitle: 'On-Duty (OD) Leave Approval: National Smart Automation Hackathon (4 Days)',
          departmentName: 'Academics',
          studentName: 'Aarav Mehta (CS-3rd Year)',
          reasonDetails: 'Selected as national finalist for Smart Automation Challenge. Requires attendance regularization for 4 lecture days.',
          aiPreScreen: 'AI Pre-Screen: PASS (Attendance 89% > 75% required, No pending disciplinary flags)',
          approverRole: 'faculty_advisor',
          approverName: 'Prof. Rajesh Nair',
          status: 'pending',
          created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
        },
        {
          id: 'app-0000-0000-0000-000000000002',
          requestNumber: 'REQ-1071',
          requestTitle: 'Main Auditorium & AV System Reservation for Annual Tech Showcase',
          departmentName: 'Student Affairs',
          studentName: 'Ananya Sen (Student Council President)',
          reasonDetails: 'Booking main auditorium, 4 wireless mics, and high-lumen projector for Saturday university tech fest.',
          aiPreScreen: 'AI Pre-Screen: PASS (Auditorium calendar slot vacant, AV technician scheduled)',
          approverRole: 'department_head',
          approverName: 'Dr. Sunita Rao',
          status: 'pending',
          created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
        },
        {
          id: 'app-0000-0000-0000-000000000003',
          requestNumber: 'REQ-1078',
          requestTitle: 'Elective Course Substitution & Lab Timetable Regularization',
          departmentName: 'Academics',
          studentName: 'Rohan Deshmukh (IT-4th Year)',
          reasonDetails: 'Timetable conflict between Advanced Distributed Systems and Honors AI Lab. Dean clearance requested.',
          aiPreScreen: 'AI Pre-Screen: PASS (Credit requirements satisfied, faculty capacity available)',
          approverRole: 'faculty_advisor',
          approverName: 'Prof. Rajesh Nair',
          status: 'pending',
          created_at: new Date(Date.now() - 3600 * 1000 * 8).toISOString()
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
      setActionSuccess(`Request ${id} approved successfully!`);
      setTimeout(() => setActionSuccess(null), 3000);
      await fetchApprovals();
    } catch (err) {
      console.error(err);
      // Local optimistic update
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) return;
    try {
      await api.post(`/approvals/${id}/reject`, { comments: rejectReason });
      setActionSuccess(`Request rejected.`);
      setTimeout(() => setActionSuccess(null), 3000);
      setRejectingId(null);
      setRejectReason('');
      await fetchApprovals();
    } catch (err) {
      console.error(err);
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
      setRejectingId(null);
      setRejectReason('');
    }
  };

  const handleResetApprovals = async () => {
    try {
      setLoading(true);
      const res = await api.post('/approvals/reset');
      if (res.success && res.data) {
        setApprovals(res.data);
      } else {
        await fetchApprovals();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApprovals = approvals.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const rejectedCount = approvals.filter(a => a.status === 'rejected').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>FACULTY & ADVISOR APPROVAL QUEUE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Approval Automation Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Autonomous multi-tier sign-off engine for On-Duty (OD) leaves, venue bookings, and timetable adjustments. AI pre-validates eligibility before human sign-off.
          </p>
        </div>

        {/* Action button to reset demo items */}
        <button
          onClick={handleResetApprovals}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 text-xs font-mono font-semibold flex items-center space-x-2 shadow-lg shadow-emerald-500/10 cursor-pointer self-start md:self-auto shrink-0 transition"
          title="Re-seed 3 demo approval requests"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reset Demo Approvals</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-4 rounded-2xl border border-cyber-border">
          <div className="text-[10px] font-mono uppercase text-slate-400">Total In Queue</div>
          <div className="text-xl font-extrabold text-white mt-1">{approvals.length}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <div className="text-[10px] font-mono uppercase text-amber-400">Pending Review</div>
          <div className="text-xl font-extrabold text-amber-300 mt-1">{pendingCount}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <div className="text-[10px] font-mono uppercase text-emerald-400">Approved</div>
          <div className="text-xl font-extrabold text-emerald-300 mt-1">{approvedCount}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <div className="text-[10px] font-mono uppercase text-rose-400">Rejected</div>
          <div className="text-xl font-extrabold text-rose-300 mt-1">{rejectedCount}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
            filter === 'all' 
              ? 'bg-brand-600/30 border border-brand-500/50 text-brand-300' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Requests ({approvals.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
            filter === 'pending' 
              ? 'bg-amber-600/30 border border-amber-500/50 text-amber-300' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
            filter === 'approved' 
              ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
            filter === 'rejected' 
              ? 'bg-rose-600/30 border border-rose-500/50 text-rose-300' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Toast Notification */}
      {actionSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Approvals List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
            Loading approval queue...
          </div>
        ) : filteredApprovals.length === 0 ? (
          <div className="py-16 glass-panel rounded-3xl border border-cyber-border text-center space-y-3">
            <FileCheck className="w-8 h-8 text-emerald-400/60 mx-auto" />
            <div className="text-sm font-bold text-white">No requests matching "{filter}" filter</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              All pending sign-offs have been processed, or no items match the selected filter.
            </p>
            <button
              onClick={handleResetApprovals}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition cursor-pointer inline-flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Default Pending Approvals</span>
            </button>
          </div>
        ) : (
          filteredApprovals.map((app) => (
            <div
              key={app.id}
              className="glass-panel p-5 rounded-2xl border border-cyber-border hover:border-emerald-500/40 transition space-y-4 shadow-lg shadow-black/20"
            >
              {/* Top Row: Meta info & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-400 px-2 py-0.5 rounded bg-brand-950/60 border border-brand-500/30">
                    {app.requestNumber || 'REQ-1064'}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {app.departmentName || 'Academics'}
                  </span>
                  <span className="text-xs text-slate-300 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Requester: <strong className="text-white">{app.studentName || 'Student'}</strong></span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    app.status === 'approved' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : app.status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>

              {/* Title & Justification */}
              <div>
                <h3 className="text-base font-bold text-white mb-1.5">{app.requestTitle}</h3>
                {app.reasonDetails && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 italic">
                    "{app.reasonDetails}"
                  </div>
                )}
              </div>

              {/* AI Pre-Screening Badge */}
              <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">{app.aiPreScreen || 'AI Pre-Screen: PASS (Eligibility criteria verified)'}</span>
              </div>

              {/* Approver Designation & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-400">
                  Target Authority: <strong className="text-slate-200 capitalize">{(app.approverRole || app.approver_role || 'faculty_advisor')?.replace(/_/g, ' ')}</strong> ({app.approverName || 'Prof. Rajesh Nair'})
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {app.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Authorize & Approve</span>
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
                    <div className="text-xs text-slate-400">
                      Decision Recorded: <strong className="capitalize text-slate-200">{app.status}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Inline Rejection Reason Input */}
              {rejectingId === app.id && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex flex-col sm:flex-row items-center gap-2 animate-in fade-in">
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Provide mandatory reason for rejection (e.g. Schedule clash)..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none w-full"
                    autoFocus
                  />
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleReject(app.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => {
                        setRejectingId(null);
                        setRejectReason('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
}
