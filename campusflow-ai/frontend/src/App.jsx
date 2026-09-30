import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LiveDemoModal from './components/LiveDemoModal';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import IntakePage from './pages/IntakePage';
import RequestsPage from './pages/RequestsPage';
import DuplicatesPage from './pages/DuplicatesPage';
import RecurringPage from './pages/RecurringPage';
import WorkflowBuilderPage from './pages/WorkflowBuilderPage';
import ApprovalsPage from './pages/ApprovalsPage';
import CopilotPage from './pages/CopilotPage';
import ReportsPage from './pages/ReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminControlPage from './pages/AdminControlPage';

function AppLayout() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar onOpenDemo={() => setShowDemoModal(true)} />

      {/* Main Body */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {!isLandingPage && <Sidebar />}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${isLandingPage ? 'w-full' : ''}`}>
          <Routes>
            <Route path="/" element={<LandingPage onOpenDemo={() => setShowDemoModal(true)} />} />
            <Route path="/dashboard" element={<DashboardPage onOpenDemo={() => setShowDemoModal(true)} />} />
            <Route path="/intake" element={<IntakePage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/duplicates" element={<DuplicatesPage />} />
            <Route path="/recurring" element={<RecurringPage />} />
            <Route path="/workflows" element={<WorkflowBuilderPage />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/copilot" element={<CopilotPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/admin" element={<AdminControlPage />} />
          </Routes>
        </main>
      </div>

      {/* Judge 1-Click Interactive Demo Modal */}
      {showDemoModal && (
        <LiveDemoModal onClose={() => setShowDemoModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
