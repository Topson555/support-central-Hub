import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import TicketDetailPage from './pages/TicketDetailPage';
import SubmitTicketPage from './pages/SubmitTicketPage';
import TicketQueuePage from './pages/TicketQueuePage';
import ReportPage from './pages/ReportPage';
import UserManagementPage from './pages/UserManagementPage';
import SettingsPage from './pages/SettingsPage';
import AgentCreateTicketPage from './pages/AgentCreateTicketPage';
import HelpCenterPage from './pages/HelpCenterPage';
import PublicTicketPage from './pages/PublicTicketPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F1F3F9] font-sans text-slate-900 selection:bg-[#1034A6]/20 selection:text-[#1034A6]">
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        } />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/my-tickets" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/queue" element={
          <ProtectedRoute allowedRoles={['agent', 'admin']}>
            <TicketQueuePage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/create" element={
          <ProtectedRoute allowedRoles={['agent', 'admin']}>
            <AgentCreateTicketPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/history" element={
          <ProtectedRoute allowedRoles={['agent', 'admin']}>
            <TicketQueuePage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/reports" element={
          <ProtectedRoute allowedRoles={['agent', 'admin']}>
            <ReportPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />

        <Route path="/ticket/:id" element={
          <ProtectedRoute>
            <TicketDetailPage />
          </ProtectedRoute>
        } />

        <Route path="/submit" element={
          <ProtectedRoute>
            <SubmitTicketPage />
          </ProtectedRoute>
        } />

        {/* Public Routes */}
        <Route path="/track/:id" element={<PublicTicketPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/docs" element={<HelpCenterPage />} />
        <Route path="/privacy" element={<LandingPage />} />
        <Route path="/terms" element={<LandingPage />} />
        
        <Route path="*" element={<div className="flex min-h-screen items-center justify-center font-black bg-[#F1F3F9] text-slate-300 uppercase tracking-widest italic">404 - Zone Not Found</div>} />
      </Routes>
    </div>
  );
}

