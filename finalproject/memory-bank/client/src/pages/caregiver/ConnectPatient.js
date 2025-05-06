// client/src/pages/caregiver/ConnectPatient.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserService } from '../../services/api';

const ConnectPatient = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const userService = useUserService();
  const navigate = useNavigate();

  // Update authAxios to include the connect patient endpoint
  const connectWithPatient = async (patientEmail) => {
    try {
      const response = await userService.connectWithPatient(patientEmail);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter the patient\'s email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await connectWithPatient(email);
      setSuccess(`Connection request sent to ${email}`);
      setEmail('');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/caregiver');
      }, 2000);
    } catch (error) {
      console.error('Connection error:', error);
      if (error.response?.status === 404) {
        setError('User with this email not found');
      } else if (error.response?.status === 409) {
        setError('You are already connected with this patient');
      } else {
        setError('Failed to connect with patient. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="connect-patient-page">
      <div className="page-header">
        <h1>Connect with a Patient</h1>
        <Link to="/caregiver" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
      
      <div className="connect-form-container">
        <div className="connect-instructions">
          <h2>How to Connect</h2>
          <ol>
            <li>Enter the patient's email address</li>
            <li>Submit the connection request</li>
            <li>The patient will receive a notification to approve your request</li>
            <li>Once approved, you'll be able to help manage their memories</li>
          </ol>
        </div>
        
        <form className="connect-form" onSubmit={handleSubmit}>
          <h2>Enter Patient's Email</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Patient Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patient@example.com"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Sending Request...' : 'Send Connection Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConnectPatient;