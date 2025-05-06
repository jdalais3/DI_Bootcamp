import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="btn" onClick={toggleSidebar}>
          ☰
        </button>
        <Link to="/dashboard" className="navbar-logo">
          🧠 Memory Bank
        </Link>
      </div>
      
      {currentUser && (
        <div className="navbar-actions">
          <div className="user-info">
            {currentUser.first_name} {currentUser.last_name}
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
