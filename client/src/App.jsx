import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Page Imports
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import ReportForm from './pages/ReportForm';
import AdminPanel from './pages/AdminPanel';

// Dedicated Sidebar handling hide/open toggle states natively
const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (window.innerWidth <= 768) setIsOpen(false); // Cleanly snap shut on mobile
  };

  const isActive = (path) => location.pathname === path ? 'sidebar-link active' : 'sidebar-link';

  // Automatically close sidebar on mobile when navigating pages for better UX
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  }, [location.pathname, setIsOpen]);

  return (
    <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
      <div className="flex justify-between items-center" style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        <div className="sidebar-title" style={{ margin: 0, border: 'none', padding: '0 0 0 60px', textAlign: 'left' }}>
          <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1.2rem' }}>🛡️ ElectoralWatch</Link>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {user ? (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')}>📊 Dashboard</Link>
            <Link to="/report" className={isActive('/report')}>📸 File Report</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className={isActive('/admin')} style={{ 
                color: 'var(--warning)', 
                marginTop: '15px', 
                background: location.pathname === '/admin' ? 'rgba(255, 209, 102, 0.2)' : 'rgba(255, 209, 102, 0.08)',
                border: '1px solid rgba(255, 209, 102, 0.2)',
                borderLeft: '4px solid var(--warning)',
                fontWeight: 'bold'
              }}>⚠️ Security Admin Console</Link>
            )}
          </>
        ) : (
          <>
            <Link to="/" className={isActive('/')}>🏠 Home / About</Link>
            <Link to="/login" className={isActive('/login')}>Login</Link>
            <Link to="/register" className={isActive('/register')}>Create Account</Link>
          </>
        )}
      </nav>

      {user && (
        <div className="sidebar-footer">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px' }}>Logged in as: <strong style={{color:'var(--text-primary)', display: 'block', fontSize: '1rem', marginTop: '5px'}}>{user.name}</strong></p>
          <button onClick={handleLogout} className="btn" style={{ width: '100%', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px' }}>Log out</button>
        </div>
      )}
    </aside>
  );
};

function App() {
  // Mobile defaults to closed, desktop defaults to open
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  return (
    <Router>
      <div className="app-layout">
        {/* State passed to the Sidebar component */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Floating Action Button — placed OUTSIDE main to prevent fixed-position breakage on mobile */}
        <button 
          className={`sidebar-toggle-btn ${isSidebarOpen ? 'open' : ''}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title="Toggle Sidebar"
        >
          {isSidebarOpen ? '✖' : '☰'}
        </button>

        <main className={`main-content animate-fade-in ${isSidebarOpen ? '' : 'expanded'}`}>
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
