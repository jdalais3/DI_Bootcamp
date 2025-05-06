import React from 'react';
import { useParams, Link } from 'react-router-dom';

const PatientMemories = () => {
  const { patientId } = useParams();
  
  return (
    <div className="patient-memories-page">
      <div className="page-header">
        <h1>Patient Memories</h1>
        <Link to="/caregiver" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
      
      <div className="patient-info">
        <h2>Patient ID: {patientId}</h2>
      </div>
      
      <div className="memories-section">
        <p>No memories available for this patient.</p>
      </div>
    </div>
  );
};

export default PatientMemories;
