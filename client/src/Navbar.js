import React from 'react';
import './Navbar.css';

const Navbar = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="navbar-container">
      <ul className="nav-links-list">
        <li>
          <a
            href="#"
            onClick={() => setCurrentPage('dashboard')}
            className={currentPage === 'dashboard' ? 'active-link' : ''}
          >
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => setCurrentPage('observations')}
            className={currentPage === 'observations' ? 'active-link' : ''}
          >
            Observations
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => setCurrentPage('apps')}
            className={currentPage === 'apps' ? 'active-link' : ''}
          >
            Apps
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
