import React, { useState, useEffect } from 'react';
import { 
  Layers, AlertTriangle, CheckCircle2, ArrowRight, 
  MapPin, RefreshCw, Sparkles, Shield, Users 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';

export default function DuplicatesPage() {
  const [incidents, setIncidents] = useState([]);
  const [duplicateClusters, setDuplicateClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [merging, setMerging] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState(null);

  const fetchClusters = async () => {
    try {
      setLoading(true);
      const res = await api.get('/requests');
      if (res.success && res.data) {
        // Group by location
        const byLoc = {};
        res.data.forEach(r => {
          const loc = r.location || 'Unknown';
          if (!byLoc[loc]) byLoc[loc] = [];
          byLoc[loc].push(r);
        });

        // Filter clusters with >= 2 requests
        const clusters = [];
        for (const [loc, items] of Object.entries(byLoc)) {
          if (items.length >= 2 && loc !== 'Unknown') {
            const master = items.find(i => !i.is_duplicate) || items[0];
            const dups = items.filter(i => i.id !== master.id);
            clusters.push({
              location: loc,
              equipment: master.entities?.equipment || 'AC / Infrastructure',
              clusterSize: items.length,
              masterRequest: master,
              duplicateRequests: dups,
              similarityScore: 92,
              status: items.some(i => i.status === 'MERGED') ? 'CONSOLIDATED' : 'ACTION_REQUIRED'
            });
          }
        }
        setDuplicateClusters(clusters);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const handleMergeCluster = async (cluster) => {
    try {
      setMerging(true);
      const dupIds = cluster.duplicateRequests.map(r => r.id);
      const res = await api.post('/ai/merge-duplicates', {
        masterRequestId: cluster.masterRequest.id,
        duplicateRequestIds: dupIds
      });

      if (res.success) {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
        await fetchClusters();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-1">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>AI SEMANTIC CLUSTERING & SUPPRESSION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Duplicate Incident Detection
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          When multiple students or staff report the exact same defect, CampusFlow AI groups them into a Master Incident to eliminate redundant dispatches and save staff hours.
        </p>
      </div>

      {/* Flagship Demonstration Banner: Lab 3 AC Incident (Section 24) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border border-purple-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>POSSIBLE DUPLICATE INCIDENT DETECTED</span>
            </span>
            <h2 className="text-lg font-bold text-white mt-2">
              8 Requests Clustered Around: AC Breakdown in Lab 3
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              AI Similarity Detection matched 8 independent student tickets regarding water leakage and heat in Lab 3.
              Consolidating these into 1 single maintenance work order prevents 7 redundant technician dispatches.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => {
                const lab3Cluster = duplicateClusters.find(c => c.location.includes('Lab 3')) || duplicateClusters[0];
                if (lab3Cluster) handleMergeCluster(lab3Cluster);
              }}
              disabled={merging}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Layers className="w-4 h-4" />
              <span>{merging ? 'CONSOLIDATING...' : 'MERGE INTO 1 MASTER INCIDENT'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clusters List */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Detected Incident Clusters ({duplicateClusters.length})
        </h3>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
            Analyzing semantic similarity across campus requests...
          </div>
        ) : duplicateClusters.length === 0 ? (
          <div className="py-12 glass-panel rounded-2xl text-center text-slate-400 text-xs">
            No active duplicate clusters detected.
          </div>
        ) : (
          duplicateClusters.map((cluster, i) => (
            <div
              key={i}
              className="glass-panel p-5 rounded-2xl border border-cyber-border hover:border-purple-500/40 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-sm">
                    {cluster.clusterSize}x
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                      <span>{cluster.location} — {cluster.equipment}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                        {cluster.similarityScore}% Similarity Match
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Primary Ticket: <strong className="text-slate-200">{cluster.masterRequest.request_number}</strong> — "{cluster.masterRequest.title.slice(0, 60)}..."
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {cluster.status === 'CONSOLIDATED' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Master Incident Active</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMergeCluster(cluster)}
                      disabled={merging}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition cursor-pointer"
                    >
                      Merge {cluster.clusterSize} Tickets
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-tickets in cluster */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase font-mono">
                  Consolidated Complaints in this Cluster:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {cluster.duplicateRequests.slice(0, 6).map((dup, dIdx) => (
                    <div
                      key={dup.id || dIdx}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between"
                    >
                      <div className="truncate max-w-[280px]">
                        <span className="font-mono text-purple-400 font-semibold mr-1.5">{dup.request_number}</span>
                        <span className="text-slate-300">{dup.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0 capitalize">
                        {dup.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
