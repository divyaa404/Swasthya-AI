// src/components/common/Sidebar.tsx (or Navbar.tsx)
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <nav className="sidebar">
      <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
        Dashboard
      </Link>
      <Link to="/medicine" className={location.pathname === '/medicine' ? 'active' : ''}>
        Medicine
      </Link>
      <Link to="/appointments" className={location.pathname === '/appointments' ? 'active' : ''}>
        Appointments
      </Link>
      <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
        Profile
      </Link>
    </nav>
  );
};

export default Sidebar;