// client/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './components/layouts/MainLayout';

// Public pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Protected pages
import Dashboard from './pages/Dashboard';
import MemoriesPage from './pages/memories/MemoriesPage';
import CreateMemory from './pages/memories/CreateMemory';

// Placeholder for missing pages
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '20px' }}>
    <h1>{title}</h1>
    <p>This page is under construction.</p>
  </div>
);

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/memories" element={<MemoriesPage />} />
        <Route path="/memories/create" element={<CreateMemory />} />
        <Route path="/memories/:id" element={<PlaceholderPage title="Memory Detail" />} />
        <Route path="/memories/:id/edit" element={<PlaceholderPage title="Edit Memory" />} />
        <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
        <Route path="/caregiver" element={<PlaceholderPage title="Caregiver Dashboard" />} />
        <Route path="/caregiver/patients/:patientId/memories" element={<PlaceholderPage title="Patient Memories" />} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
    </Routes>
  );
}

export default App;