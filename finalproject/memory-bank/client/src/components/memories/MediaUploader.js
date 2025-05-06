// client/src/components/memories/MediaUploader.js
import React, { useState, useRef } from 'react';
import { useMemoryService } from '../../services/api';

const MediaUploader = ({ acceptedTypes, onUploadComplete, error }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const memoryService = useMemoryService();
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    setFile(selectedFile);
    setUploadError('');
    
    // Create preview URL for images, videos, and audio
    if (selectedFile.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview({ type: 'image', url: previewUrl });
    } else if (selectedFile.type.startsWith('video/')) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview({ type: 'video', url: previewUrl });
    } else if (selectedFile.type.startsWith('audio/')) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview({ type: 'audio', url: previewUrl });
    } else {
      setPreview(null);
    }
    
    // Auto-upload the file
    handleUpload(selectedFile);
  };
  
  // Upload the file
  const handleUpload = async (fileToUpload) => {
    if (!fileToUpload) {
      return;
    }
    
    setUploading(true);
    
    try {
      const result = await memoryService.uploadFile(fileToUpload);
      
      // Call the parent component's callback
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  // Render file preview
  const renderPreview = () => {
    if (!preview) {
      return null;
    }
    
    if (preview.type === 'image') {
      return (
        <div className="media-preview image-preview">
          <img src={preview.url} alt="Preview" />
        </div>
      );
    }
    
    if (preview.type === 'video') {
      return (
        <div className="media-preview video-preview">
          <video controls width="100%">
            <source src={preview.url} type={file?.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    if (preview.type === 'audio') {
      return (
        <div className="media-preview audio-preview">
          <audio controls>
            <source src={preview.url} type={file?.type} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="media-uploader">
      <input
        type="file"
        ref={fileInputRef}
        accept={acceptedTypes}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      {!file && (
        <div 
          className={`upload-area ${error ? 'error' : ''}`}
          onClick={triggerFileInput}
        >
          <div className="upload-icon">📤</div>
          <div className="upload-text">
            Click to upload {acceptedTypes === 'image/*' ? 'an image' : 
              acceptedTypes === 'audio/*' ? 'audio' : 
              acceptedTypes === 'video/*' ? 'a video' : 'a file'}
          </div>
          <div className="upload-subtext">
            or drag and drop here
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
      )}
      
      {file && (
        <div className="upload-preview">
          <div className="preview-header">
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <button 
              type="button" 
              className="btn btn-sm btn-secondary"
              onClick={triggerFileInput}
            >
              Change File
            </button>
          </div>
          
          {renderPreview()}
          
          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div className="progress-bar-inner indeterminate"></div>
              </div>
              <div className="progress-text">Uploading...</div>
            </div>
          )}
          
          {uploadError && (
            <div className="upload-error">{uploadError}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;