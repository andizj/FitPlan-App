import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/workouts', icon: '💪', label: 'Workouts' },
    { path: '/exercises', icon: '🏋️', label: 'Übungen' },
    { path: '/progress', icon: '📈', label: 'Fortschritt' },
    { path: '/notifications', icon: '🔔', label: 'Benachrichtigungen' },
    { path: '/profile', icon: '👤', label: 'Profil' }
  ];

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Fehler beim Ausloggen:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="mobile-nav">
        <div className="nav-header">
          <Link to="/dashboard" className="nav-brand" onClick={closeMenu}>
            FitPlan
          </Link>
          <button 
            className={`burger-menu ${isMenuOpen ? 'open' : ''}`} 
            onClick={toggleMenu}
            aria-label="Menü öffnen"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={`nav-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>

      <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-menu-content">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
          <button className="logout-button" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Ausloggen</span>
          </button>
        </div>
      </div>

      <div className="desktop-nav">
        <div className="nav-brand">FitPlan</div>
        <div className="nav-items">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Ausloggen</span>
        </button>
      </div>
    </>
  );
};

export default Navigation; 