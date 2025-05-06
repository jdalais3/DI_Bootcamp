// client/src/pages/memories/CreateMemory.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMemoryService } from '../../services/api';
import MediaUploader from '../../components/memories/MediaUploader';
import VoiceRecorder from '../../components/memories/VoiceRecorder';

const CreateMemory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const memoryService = useMemoryService();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Parse URL parameters
  const queryParams = new URLSearchParams(location.search);
  
  // Form state
  const [formData, setFormData] = useState({
    title: queryParams.get('title') || '',
    content: { text: queryParams.get('content') || '' },
    memory_type: queryParams.get('memory_type') || 'text',
    importance: 3,
    date_of_memory: new Date().toISOString().split('T')[0],
    tags: []
  });
  
  const [mediaUploadError, setMediaUploadError] = useState('');
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'content') {
      setFormData({
        ...formData,
        content: { ...formData.content, text: value }
      });
    } else if (name === 'memory_type') {
      // Reset content when changing memory type
      setFormData({
        ...formData,
        memory_type: value,
        content: value === 'text' ? { text: formData.content.text || '' } : { text: '' }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle media upload completion
  const handleMediaUploadComplete = (fileInfo) => {
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        mediaUrl: fileInfo.path,
        mediaType: fileInfo.mimetype
      }
    });
  };
  
  // Handle voice recording completion
  const handleVoiceRecordingComplete = async (audioBlob) => {
    try {
      // Convert audio blob to file
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
      
      // Upload the file
      const result = await memoryService.uploadFile(audioFile);
      
      // Update form data with the uploaded audio
      setFormData({
        ...formData,
        content: {
          ...formData.content,
          mediaUrl: result.path,
          mediaType: result.mimetype
        }
      });
    } catch (error) {
      console.error('Failed to upload audio recording:', error);
      setMediaUploadError('Failed to upload recording. Please try again.');
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    
    if (formData.memory_type === 'text' && !formData.content.text?.trim()) {
      setError('Memory content is required for text memories');
      return false;
    }
    
    if (formData.memory_type !== 'text' && !formData.content.mediaUrl) {
      setError(`Please upload a ${formData.memory_type} file`);
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await memoryService.createMemory(formData);
      navigate('/memories');
    } catch (error) {
      console.error('Failed to create memory:', error);
      setError('Failed to create memory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render the appropriate content input based on memory type
  const renderContentInput = () => {
    switch (formData.memory_type) {
      case 'text':
        return (
          <div className="form-group">
            <label htmlFor="content">Memory Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content.text || ''}
              onChange={handleInputChange}
              rows="6"
              placeholder="Describe your memory..."
              required={formData.memory_type === 'text'}
            ></textarea>
          </div>
        );
      case 'photo':
        return (
          <div className="form-group">
            <label>Upload Photo</label>
            <MediaUploader 
              acceptedTypes="image/*"
              onUploadComplete={handleMediaUploadComplete}
              error={mediaUploadError}
            />
            <div className="form-group">
              <label htmlFor="content">Caption (Optional)</label>
              <textarea
                id="content"
                name="content"
                value={formData.content.text || ''}
                onChange={handleInputChange}
                rows="3"
                placeholder="Add a caption to your photo..."
              ></textarea>
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="form-group">
            <label>Record or Upload Audio</label>
            <div className="audio-options">
              <VoiceRecorder onRecordingComplete={handleVoiceRecordingComplete} />
              <div className="separator">OR</div>
              <MediaUploader 
                acceptedTypes="audio/*"
                onUploadComplete={handleMediaUploadComplete}
                error={mediaUploadError}
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Transcription/Notes (Optional)</label>
              <textarea
                id="content"
                name="content"
                value={formData.content.text || ''}
                onChange={handleInputChange}
                rows="3"
                placeholder="Add notes about this audio..."
              ></textarea>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="form-group">
            <label>Upload Video</label>
            <MediaUploader 
              acceptedTypes="video/*"
              onUploadComplete={handleMediaUploadComplete}
              error={mediaUploadError}
            />
            <div className="form-group">
              <label htmlFor="content">Description (Optional)</label>
              <textarea
                id="content"
                name="content"
                value={formData.content.text || ''}
                onChange={handleInputChange}
                rows="3"
                placeholder="Add a description for your video..."
              ></textarea>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="create-memory-page">
      <div className="page-header">
        <h1>Create New Memory</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="memory-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter memory title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="memory_type">Memory Type</label>
          <select 
            id="memory_type" 
            name="memory_type"
            value={formData.memory_type}
            onChange={handleInputChange}
          >
            <option value="text">Text</option>
            <option value="photo">Photo</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </div>
        
        {renderContentInput()}
        
        <div className="form-group">
          <label htmlFor="importance">Importance (1-5)</label>
          <input
            type="range"
            id="importance"
            name="importance"
            min="1"
            max="5"
            value={formData.importance}
            onChange={handleInputChange}
          />
          <div className="range-value">{formData.importance}</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="date_of_memory">Date of Memory</label>
          <input
            type="date"
            id="date_of_memory"
            name="date_of_memory"
            value={formData.date_of_memory}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-actions">
          <Link to="/memories" className="btn btn-secondary">
            Cancel
          </Link>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Memory'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMemory;