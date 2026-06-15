// src/components/common/Navbar.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarLeft}>
        <h1 style={styles.welcomeText}>
          Welcome back, <span style={styles.userName}>{user?.name || 'Guest'}!</span>
        </h1>
        <p style={styles.subtitle}>Here's your health overview for today</p>
      </div>

      <div style={styles.navbarRight}>
        {/* User Dropdown */}
        <div style={styles.userMenu}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)} 
            style={styles.userButton}
          >
            <div style={styles.userAvatar}>
              {user?.name?.[0] || 'U'}
            </div>
            <div style={styles.userInfo}>
              <span style={styles.userNameText}>{user?.name || 'User'}</span>
              <span style={styles.userEmail}>{user?.email || 'user@example.com'}</span>
            </div>
          </button>

          {showDropdown && (
            <div style={styles.dropdown}>
              <button onClick={() => navigate('/profile')} style={styles.dropdownItem}>
                👤 Profile
              </button>
              <button onClick={() => navigate('/settings')} style={styles.dropdownItem}>
                ⚙️ Settings
              </button>
              <hr style={styles.dropdownDivider} />
              <button onClick={handleLogout} style={{...styles.dropdownItem, ...styles.logoutItem}}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 32px',
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    borderBottom: '1px solid #e0e7ff',
  },
  navbarLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  userName: {
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  navbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userMenu: {
    position: 'relative' as const,
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '12px',
    transition: 'background 0.2s',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '16px',
  },
  userInfo: {
    textAlign: 'left' as const,
  },
  userNameText: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  userEmail: {
    display: 'block',
    fontSize: '12px',
    color: '#64748b',
  },
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    marginTop: '8px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    minWidth: '200px',
    overflow: 'hidden',
    zIndex: 1000,
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    width: '100%',
    border: 'none',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#1e293b',
    transition: 'background 0.2s',
  },
  logoutItem: {
    color: '#dc2626',
  },
  dropdownDivider: {
    margin: 0,
    border: 'none',
    borderTop: '1px solid #e2e8f0',
  },
};

// Add hover effects with CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  button:hover {
    background: #f1f5f9 !important;
    transform: translateY(-1px);
  }
  
  .dropdown-item:hover {
    background: #f8fafc !important;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);

export default Navbar;