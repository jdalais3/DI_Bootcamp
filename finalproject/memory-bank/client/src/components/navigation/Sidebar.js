// client/src/components/navigation/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul className="sidebar-nav">
        <li className="sidebar-nav-item">
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink to="/memories">All Memories</NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink to="/memories/create">Add Memory</NavLink>
        </li>
        {currentUser.role === 'caregiver' && (
          <li className="sidebar-nav-item">
            <NavLink to="/caregiver">Caregiver Dashboard</NavLink>
          </li>
        )}
        <li className="sidebar-nav-item">
          <NavLink to="/profile">Profile</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;