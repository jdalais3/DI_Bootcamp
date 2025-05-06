// client/src/pages/caregiver/CaregiverDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserService } from '../../services/api';

const CaregiverDashboard = () => {
  const userService = useUserService();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const result = await userService.getPatients();
        setPatients(result);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="caregiver-dashboard">
      <div className="page-header">
        <h1>Caregiver Dashboard</h1>
        <Link to="/caregiver/connect" className="btn btn-primary">
          Connect with Patient
        </Link>
      </div>

      <div className="dashboard-section">
        <h2>Your Patients</h2>
        
        {loading ? (
          <div className="loading-indicator">Loading patients...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : patients.length === 0 ? (
          <div className="empty-state">
            <h3>No Patients Found</h3>
            <p>You haven't been connected with any patients yet.</p>
            <p>Use the "Connect with Patient" button to start helping someone with their memories.</p>
          </div>
        ) : (
          <div className="patient-grid">
            {patients.map(patient => (
              <div key={patient.id} className="patient-card">
                <div className="patient-avatar">
                  {patient.first_name?.charAt(0)}{patient.last_name?.charAt(0)}
                </div>
                <div className="patient-details">
                  <h3>{patient.first_name} {patient.last_name}</h3>
                  <p className="patient-email">{patient.email}</p>
                  <p className="patient-access">
                    Access Level: <span className="access-badge">{patient.access_level}</span>
                  </p>
                </div>
                <div className="patient-actions">
                  <Link to={`/caregiver/patients/${patient.id}/memories`} className="btn btn-primary">
                    View Memories
                  </Link>
                  <Link to={`/caregiver/patients/${patient.id}/add-memory`} className="btn btn-secondary">
                    Add Memory
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Quick Guide for Caregivers</h2>
        <div className="guide-steps">
          <div className="guide-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Connect with a Patient</h3>
              <p>Use their email address to establish a connection and help manage their memories.</p>
            </div>
          </div>
          <div className="guide-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Create Memories</h3>
              <p>Add memories on behalf of your patients, including photos, audio recordings, or text entries.</p>
            </div>
          </div>
          <div className="guide-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Help Recall Memories</h3>
              <p>Browse through memories with patients to help exercise their recall abilities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard;