import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import RoleSelectionPage from './Components/RoleSelectionPage';
import Login from './Components/Login';
import TeacherDashboard from './Components/TeacherDashboard';
import StudentDashboard from './Components/StudentDashboard';
import SessionDebug from './Components/SessionDebug';
import GeminiWrapper from './Components/Gemini/GeminiWrapper';
import LandingPage from './Components/LandingPage/LandingPage';
import Loading from './Components/Loading';

// Role-based Auth Guard component for protected routes
const ProtectedRoute = ({ element, allowedRole }) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  const userRole = sessionStorage.getItem('userRole');
  
  // First check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Then check if user has the correct role for this route
  if (allowedRole && userRole !== allowedRole) {
    // Redirect to the appropriate dashboard based on their role
    if (userRole === 'teacher') {
      return <Navigate to="/teacher-dashboard" />;
    } else if (userRole === 'student') {
      return <Navigate to="/student-dashboard" />;
    } else {
      // If role is invalid, redirect to role selection
      return <Navigate to="/role-selection" />;
    }
  }
  
  // If authenticated and has correct role, render the component
  return element;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Only show loading animation on first visit to the landing page
    if (!isFirstLoad) {
      setLoading(false);
      return;
    }

    // Simulate loading time - shorter duration
    const timer = setTimeout(() => {
      setLoading(false);
      // Mark that we've shown the loading animation
      setIsFirstLoad(false);
      // Store in sessionStorage that we've shown the animation
      sessionStorage.setItem('loadingShown', 'true');
    }, 1800);

    return () => clearTimeout(timer);
  }, [isFirstLoad]);

  useEffect(() => {
    // Check if we've already shown the loading animation in this session
    const hasShownLoading = sessionStorage.getItem('loadingShown') === 'true';
    if (hasShownLoading) {
      setIsFirstLoad(false);
      setLoading(false);
    }
  }, []);

  return (
    <AnimatePresence mode="wait" initial={true}>
      {loading ? (
        <Loading key="loading" />
      ) : (
        <Router key="router">
          <Routes>
            {/* Default route is now the LandingPage */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Role selection is now a separate route */}
            <Route path="/role-selection" element={<RoleSelectionPage />} />
            
            <Route path="/login" element={<Login />} />
            <Route 
              path="/teacher-dashboard" 
              element={<ProtectedRoute element={<TeacherDashboard />} allowedRole="teacher" />} 
            />
            <Route 
              path="/student-dashboard" 
              element={<ProtectedRoute element={<StudentDashboard />} allowedRole="student" />} 
            />
            {/* Ask AI route */}
            <Route 
              path="/ask-ai" 
              element={
                <ProtectedRoute 
                  element={<GeminiWrapper userRole={sessionStorage.getItem('userRole')} />} 
                  allowedRole={null} 
                />
              } 
            />
            {/* Generic dashboard route that redirects based on role */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute 
                  element={
                    (() => {
                      const userRole = sessionStorage.getItem('userRole');
                      return userRole === 'student' 
                        ? <Navigate to="/student-dashboard" /> 
                        : <Navigate to="/teacher-dashboard" />;
                    })()
                  } 
                />
              } 
            />
            {/* Add debug route for session testing */}
            <Route path="/debug" element={<SessionDebug />} />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      )}
    </AnimatePresence>
  );
}

export default App;