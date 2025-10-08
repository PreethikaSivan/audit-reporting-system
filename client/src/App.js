import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

// Main Login/Register Component
const AuthComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setMessage('Forgot Password link clicked!');
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setMessage('');
  try {
    const res = await axios.post('http://localhost:5000/api/users/login', { username, password });

    // Store token, username, lastLogin
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('username', username);
    localStorage.setItem('lastLogin', new Date().toISOString());

    // Determine role automatically
    if (username.toLowerCase() === 'admin') {
      localStorage.setItem('role', 'admin');
      navigate('/adminDashboard');
    } else {
      localStorage.setItem('role', 'user');
      navigate('/userDashboard');
    }

  } catch (err) {
    setMessage(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    console.error(err);
  }
};


  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/users/register', { username, password });
      setMessage('Registration successful! You can now log in.');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Registration failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Titan logo from public folder */}
        <img src="/titan-logo.png" alt="Titan Logo" className="titan-logo" />

        <h2 className="welcome-text">WELCOME TO</h2>
        <h1 className="system-name">LASER AUDIT REPORTING SYSTEM</h1>

        <form>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-row">
            <button type="submit" className="login-button" onClick={handleLogin}>
              LOGIN ▶
            </button>
            <button type="button" className="register-button" onClick={handleRegister}>
              REGISTER
            </button>
          </div>

          <p className="message-text">{message}</p>

          <a href="#" className="forgot-password" onClick={handleForgotPassword}>
            Forgot Password?
          </a>
        </form>
      </div>

      {/* Footer */}
      <div className="footer-bar">
        <span className="version-info">LARS Version 2.0</span>
        <span className="powered-by">Powered by ETrends Technologies</span>
      </div>
    </div>
  );
};

// App Component with Router
function App() {
  const username = localStorage.getItem('username');
  const lastLogin = localStorage.getItem('lastLogin');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthComponent />} />
        <Route path="/userDashboard" element={<UserDashboard username={username} lastLogin={lastLogin} />} />
        <Route path="/adminDashboard" element={<AdminDashboard username={username} lastLogin={lastLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
