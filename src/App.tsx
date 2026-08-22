import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContentManager from './pages/admin/ContentManager';
import UsersManagement from './pages/admin/Users';
import QuestionBank from './pages/admin/QuestionBank';
import ClassesAndBoards from './pages/admin/ClassesAndBoards';
import ChaptersAndTopics from './pages/admin/ChaptersAndTopics';
import StudentLayout from './components/student/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import StudyMaterial from './pages/student/StudyMaterial';

// Triggering a small code change to force GitHub sync
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersManagement />} />
              <Route path="/admin/classes" element={<ClassesAndBoards />} />
              <Route path="/admin/content" element={<ContentManager />} />
              <Route path="/admin/questions" element={<QuestionBank />} />
              <Route path="/admin/courses" element={<ChaptersAndTopics />} />
              <Route path="/admin/analytics" element={<div className="p-8">Analytics coming soon</div>} />
              <Route path="/admin/notifications" element={<div className="p-8">Notifications coming soon</div>} />
              <Route path="/admin/settings" element={<div className="p-8">Settings coming soon</div>} />
            </Route>
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
            <Route element={<StudentLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/study-materials" element={<StudyMaterial />} />
              <Route path="/videos" element={<StudyMaterial />} />
              <Route path="/questions" element={<StudyMaterial />} />
              <Route path="/downloads" element={<StudyMaterial />} />
              <Route path="/profile" element={<div className="p-8 text-slate-500">Student Profile Form coming soon</div>} />
            </Route>
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
