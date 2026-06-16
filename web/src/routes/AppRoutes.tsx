// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/common/Layout';
import Dashboard from '../pages/Dashboard';
import Medicine from '../pages/Medicine';
import Scanner from '../pages/Scanner';
import Appointments from '../pages/Appointments';
import Profile from '../pages/Profile';
import Auth from '../pages/Auth';
import SignUp from '../pages/SignUp';
import Landing from '../pages/Landing';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes - WITH Layout (Top Nav Bar) */}
        <Route element={<Layout />}>
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/medicine" 
            element={isAuthenticated ? <Medicine /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/scanner" 
            element={isAuthenticated ? <Scanner /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/appointments" 
            element={isAuthenticated ? <Appointments /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
          />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;