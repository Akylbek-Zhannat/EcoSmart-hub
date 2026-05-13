import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Cpu, BarChart3, Lightbulb,
  FileText, User, LogOut, Zap, Settings
} from 'lucide-react';

const navItems = [
  { path: '/dashboard',        label: 'Dashboard',       icon: LayoutDashboard },
  { path: '/devices',          label: 'Devices',          icon: Cpu },
  { path: '/analytics',        label: 'Analytics',        icon: BarChart3 },
  { path: '/recommendations',  label: 'Recommendations',  icon: Lightbulb },
  { path: '/reports',          label: 'Monthly Report',   icon: FileText },
];

const bottomNav = [
  { path: '/profile', label: 'Profile & Settings', icon: Settings },
];

export default function Layout({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">⚡</div>
            <div>
              <div className="logo-text">EcoSmart Hub</div>
              <div className="logo-sub">Smart Home Platform</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {navItems.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              className={`nav-item ${location.pathname === path ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              <Icon className="nav-icon" />
              {label}
            </button>
          ))}

          <div className="nav-section-label" style={{ marginTop: 8 }}>Account</div>
          {bottomNav.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              className={`nav-item ${location.pathname === path ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              <Icon className="nav-icon" />
              {label}
            </button>
          ))}

          <button className="nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <LogOut className="nav-icon" />
            Sign Out
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill" onClick={() => navigate('/profile')}>
            <div className="user-avatar">{user?.avatar || 'ZA'}</div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'Zhanibek A.'}</div>
              <div className="user-role">Home Owner</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-right">
            <div className="topbar-badge">
              <div className="status-dot" />
              8 devices online
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
              <Zap size={14} color="var(--warning)" />
              312.4 kWh this month
            </div>
          </div>
        </header>

        <main className="page-body">
          {children}
        </main>
      </div>
    </div>
  );
}
