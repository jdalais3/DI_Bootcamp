import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Your Profile</h1>
      </div>
      
      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-info">
            <div className="info-item">
              <label>Name</label>
              <p>{currentUser?.first_name} {currentUser?.last_name}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{currentUser?.email}</p>
            </div>
            <div className="info-item">
              <label>Role</label>
              <p>{currentUser?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
