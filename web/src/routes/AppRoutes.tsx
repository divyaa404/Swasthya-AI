// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Layout from '../components/common/Layout';
import Landing from '../pages/Landing';
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Appointments from '../pages/Appointments';
import Medicine from '../pages/Medicine';
import Scanner from '../pages/Scanner';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/medicine" element={<Medicine />} />
          <Route path="/scanner" element={<Scanner />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;