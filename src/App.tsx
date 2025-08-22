import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import StudentDashboard from './components/dashboards/StudentDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (!user) {
    return isLoginMode ? (
      <LoginForm onToggleMode={() => setIsLoginMode(false)} />
    ) : (
      <SignupForm onToggleMode={() => setIsLoginMode(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {user.role === 'Student' && <StudentDashboard />}
        {user.role === 'Teacher' && <TeacherDashboard />}
        {user.role === 'Admin' && <AdminDashboard />}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;