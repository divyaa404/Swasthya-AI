import { Routes, Route } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Dashboard from '../pages/Dashboard';
import Appointments from '../pages/Appointments';
import Medicine from '../pages/Medicine';
import Scanner from '../pages/Scanner';
import Profile from '../pages/Profile';
import Auth from '../pages/Auth';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Auth />} />
      
      {/* Protected routes - wrap them with ProtectedRoute */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="medicine" element={<Medicine />} />
        <Route path="scanner" element={<Scanner />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;