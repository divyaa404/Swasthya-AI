// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Auth from './pages/Auth';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Medicine from './pages/Medicine';
import Scanner from './pages/Scanner';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes - No Layout */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected Routes with Layout (Top Navigation Bar) */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/appointments" element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              } />
              <Route path="/medicine" element={
                <ProtectedRoute>
                  <Medicine />
                </ProtectedRoute>
              } />
              <Route path="/scanner" element={
                <ProtectedRoute>
                  <Scanner />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;