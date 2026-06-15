import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="layout" style={styles.layout}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{
        ...styles.mainContent,
        marginLeft: sidebarCollapsed ? '80px' : '280px'
      }}>
        <Navbar />
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  },
  mainContent: {
    flex: 1,
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh',
  },
  content: {
    padding: '24px',
    animation: 'fadeIn 0.5s ease-in',
  },
};

export default Layout;