// src/components/common/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/appointments', icon: '📅', label: 'Appointments' },
    { path: '/medicine', icon: '💊', label: 'Medicine' },
    { path: '/scanner', icon: '📷', label: 'Scanner' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <aside style={{
      ...styles.sidebar,
      width: collapsed ? '80px' : '280px',
    }}>
      {/* Logo Section */}
      <div style={styles.logoContainer}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🏥</span>
          {!collapsed && <span style={styles.logoText}>Swasthya-AI</span>}
        </div>
        <button onClick={onToggle} style={styles.toggleButton}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav style={styles.nav}>
        <ul style={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.path} style={styles.menuItem}>
              <NavLink 
                to={item.path} 
                style={({ isActive }) => ({
                  ...styles.navLink,
                  background: isActive ? 'linear-gradient(135deg, #1e3c7210 0%, #2a529810 100%)' : 'transparent',
                  borderLeft: isActive ? '3px solid #2a5298' : '3px solid transparent',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '12px' : '12px 20px',
                })}
                title={collapsed ? item.label : ''}
              >
                <span style={styles.icon}>{item.icon}</span>
                {!collapsed && <span style={styles.linkText}>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Section */}
      {!collapsed && (
        <div style={styles.footer}>
          <div style={styles.version}>
            <span>Version 2.0.0</span>
          </div>
        </div>
      )}
    </aside>
  );
};

const styles = {
  sidebar: {
    background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
    height: '100vh',
    position: 'fixed' as const,
    left: 0,
    top: 0,
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: 1000,
  },
  logoContainer: {
    padding: '24px 20px',
    borderBottom: '1px solid #e0e7ff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative' as const,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    fontSize: '28px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  toggleButton: {
    background: 'white',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#475569',
    position: 'absolute' as const,
    right: '-14px',
    top: '32px',
    zIndex: 10,
    fontSize: '14px',
  },
  nav: {
    flex: 1,
    padding: '20px 0',
  },
  menuList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  menuItem: {
    marginBottom: '8px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: '#475569',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s',
    borderRadius: '0 12px 12px 0',
    marginRight: '16px',
    position: 'relative' as const,
  },
  icon: {
    fontSize: '20px',
  },
  linkText: {
    flex: 1,
  },
  footer: {
    padding: '20px',
    borderTop: '1px solid #e0e7ff',
    textAlign: 'center' as const,
  },
  version: {
    fontSize: '12px',
    color: '#94a3b8',
  },
};

// Add hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .nav-link:hover {
    background: linear-gradient(135deg, #1e3c7210 0%, #2a529810 100%);
    transform: translateX(4px);
  }
  
  .toggle-button:hover {
    background: #f1f5f9;
    transform: scale(1.05);
  }
`;
document.head.appendChild(styleSheet);

export default Sidebar;