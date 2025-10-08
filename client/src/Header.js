import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ username, lastLogin }) => {
  const navigate = useNavigate();

  const formatLastLogin = () => {
    if (!lastLogin) return 'N/A';
    const date = new Date(lastLogin);
    return date.toLocaleString();
  };

  const handleMyAccount = () => {
    alert('My Account functionality not implemented.');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('role'); // clear role as well
    navigate('/');
  };

  // Get role from localStorage (set during login)
  const role = localStorage.getItem('role');

  // Determine welcome text
  const welcomeText =
    role === 'admin' ? 'Admin' : username || 'User';

  return (
    <header className="header-container">
      <div className="header-left">
        <div className="logo-placeholder">
          <p>TITAN COMPANY</p>
          <p>Internal Audit</p>
        </div>
      </div>
      <div className="header-right">
        <div className="user-info">
          <span className="last-login">Last Login: {formatLastLogin()}</span>
          <span className="welcome-user">Welcome, {welcomeText}</span>
          <span className="header-separator">|</span>
          <a href="#" onClick={handleMyAccount} className="header-link">My Account</a>
          <span className="header-separator">|</span>
          <a href="#" onClick={handleLogout} className="header-link">Logout</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
