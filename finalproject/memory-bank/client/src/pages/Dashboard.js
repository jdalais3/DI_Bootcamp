// client/src/pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard">
      <h1>Welcome, {currentUser?.first_name || 'User'}!</h1>
      <p>This is your Memory Bank dashboard.</p>
      
      <div className="dashboard-actions" style={{ marginTop: '20px' }}>
        <Link to="/memories/create" className="btn btn-primary" style={{ marginRight: '10px' }}>
          Create New Memory
        </Link>
        <Link to="/memories" className="btn btn-secondary">
          View All Memories
        </Link>
      </div>
      
      {currentUser?.role === 'caregiver' && (
        <div style={{ marginTop: '30px' }}>
          <h2>Caregiver Functions</h2>
          <p>You have caregiver access. You can help manage memories for others.</p>
          <Link to="/caregiver" className="btn btn-primary">
            Go to Caregiver Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;