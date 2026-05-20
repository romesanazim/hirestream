import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterJobs from './pages/RecruiterJobs';
import RecruiterInterviewers from './pages/RecruiterInterviewers';
import RecruiterApplications from './pages/RecruiterApplications';
import InterviewerDashboard from './pages/InterviewerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateJobs from './pages/CandidateJobs';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    // 1. Router must be the TOP level
    <Router>
      {/* 2. AuthProvider must be INSIDE Router so it can use useNavigate */}
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Recruiter Routes */}
          <Route path="/recruiter-dashboard" element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/jobs" element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterJobs />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/interviewers" element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterInterviewers />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/applications" element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterApplications />
            </ProtectedRoute>
          } />

          {/* Candidate Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <CandidateDashboard />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <CandidateJobs />
            </ProtectedRoute>
          } />

          {/* Interviewer Routes */}
          <Route path="/interviewer-dashboard" element={
            <ProtectedRoute allowedRoles={['interviewer']}>
              <InterviewerDashboard />
            </ProtectedRoute>
          } />

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;