import React from 'react';
import { useParams, Link } from 'react-router-dom';

const MemoryDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="memory-detail-page">
      <div className="memory-header">
        <div className="memory-title-section">
          <h1>Memory Title</h1>
          <div className="memory-date">Date of memory</div>
        </div>
      </div>
      
      <div className="memory-content-container">
        <p>This is a placeholder for memory content with ID: {id}</p>
      </div>
      
      <div className="page-actions">
        <Link to="/memories" className="btn btn-secondary">
          Back to All Memories
        </Link>
      </div>
    </div>
  );
};

export default MemoryDetail;
