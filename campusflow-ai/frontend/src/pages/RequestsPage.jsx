import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Search, Filter, Clock, MapPin, 
  ChevronRight, AlertTriangle, CheckCircle2, Shield, Eye, RefreshCw 
} from 'lucide-react';
import api from '../services/api';
import RequestTimelineModal from '../components/RequestTimelineModal';

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (department) params.department = department;
      if (priority) params.priority = priority;
      if (status) params.status = status;
      if (search) params.search = search;

      const res = await api.get('/requests', { params });
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [department, priority, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const getPriorityBadge = (prio) => {
    const map = {
      CRITICAL: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      HIGH: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      MEDIUM: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      LOW: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${map[prio] || map.MEDIUM}`}>
        {prio}
      </span>
    );
  };

  const getStatusBadge = (st) => {
    const map = {
      NEW: 'bg-slate-700/60 text-slate-300 border-slate-600',
      ASSIGNED: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      IN_PROGRESS: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      RESOLVED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      ESCALATED: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
      MERGED: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${map[st] || map.NEW}`}>
        {st?.replace('_', ' ')}
      </span>
    );
  };

  const departments = ['IT Support', 'Maintenance', 'Hostel', 'Academics', 'Administration', 'Examination', 'Library', 'Security'];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-400 mb-1">
            <ClipboardList className="w-4 h-4 text-cyber-blue" />
            <span>OPERATIONAL TICKETING & AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Requests & Incidents ({requests.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inspect autonomous workflow progression, SLA countdowns, and field status for all campus tickets.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition self-start sm:self-center"
          title="Refresh list"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-cyber-border flex flex-wrap items-center gap-3">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket #, equipment, location, title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-500"
          />
        </form>

        {/* Dept Filter */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-200 outline-none"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-200 outline-none"
        >
          <option value="">All Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-200 outline-none"
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="ESCALATED">Escalated</option>
          <option value="MERGED">Merged (Cluster)</option>
        </select>

      </div>

      {/* Requests Table / Cards */}
      <div className="glass-panel rounded-3xl border border-cyber-border overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-400" />
            Loading operational records...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No matching operational requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-cyber-border text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Problem Summary</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">SLA Watchdog</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-brand-400 whitespace-nowrap">
                      {req.request_number}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-200 max-w-xs truncate">
                      {req.title}
                    </td>

                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      {req.department_name}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {getPriorityBadge(req.priority)}
                    </td>

                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{req.location || 'Campus'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {req.sla_status === 'breached' ? (
                        <span className="text-rose-400 font-mono font-bold text-[11px] flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>BREACHED</span>
                        </span>
                      ) : req.sla_status === 'at_risk' ? (
                        <span className="text-amber-400 font-mono font-bold text-[11px] flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>80% AT RISK</span>
                        </span>
                      ) : req.sla_status === 'completed' ? (
                        <span className="text-emerald-400 font-mono text-[11px] flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>MET</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">ON TRACK</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(req);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition inline-flex items-center space-x-1 text-[11px]"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Timeline Modal */}
      {selectedRequest && (
        <RequestTimelineModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onRefresh={fetchRequests}
        />
      )}

    </div>
  );
}
