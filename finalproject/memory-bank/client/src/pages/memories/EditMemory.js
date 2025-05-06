import React from 'react';
import { useParams, Link } from 'react-router-dom';

const EditMemory = () => {
  const { id } = useParams();
  
  return (
    <div className="edit-memory-page">
      <div className="page-header">
        <h1>Edit Memory</h1>
      </div>
      
      <form className="memory-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter memory title"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="memory_type">Memory Type</label>
          <select id="memory_type" name="memory_type">
            <option value="text">Text</option>
            <option value="photo">Photo</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Memory Content</label>
          <textarea
            id="content"
            name="content"
            rows="6"
            placeholder="Describe your memory..."
          ></textarea>
        </div>
        
        <div className="form-actions">
         <Link to={`/memories/${id}`} className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Update Memory
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMemory;
