import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMemoryService } from '../../services/api';

const MemoriesPage = () => {
  const memoryService = useMemoryService();
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch memories on component mount
  useEffect(() => {
    fetchMemories();
  }, [page]);

  const fetchMemories = async () => {
    setIsLoading(true);
    try {
      const result = await memoryService.getMemories({ page, limit: 10 });
      setMemories(result.memories);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Error fetching memories:', err);
      setError('Failed to load memories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render memory card
  const renderMemoryCard = (memory) => (
    <div key={memory.id} className="memory-card">
      <div className="memory-card-header">
        <div className="memory-type-icon">
          {memory.memory_type === 'text' && '📝'}
          {memory.memory_type === 'photo' && '📷'}
          {memory.memory_type === 'audio' && '🎵'}
          {memory.memory_type === 'video' && '🎥'}
        </div>
        <h3 className="memory-title">{memory.title}</h3>
      </div>
      
      <div className="memory-text-preview">
        {memory.content.text && memory.content.text.substring(0, 150)}
        {memory.content.text && memory.content.text.length > 150 ? '...' : ''}
      </div>
      
      <div className="memory-card-footer">
        <div className="memory-date">
          {new Date(memory.date_of_memory).toLocaleDateString()}
        </div>
        <Link to={`/memories/${memory.id}`} className="btn btn-sm btn-primary">
          View
        </Link>
      </div>
    </div>
  );

  return (
    <div className="memories-page">
      <div className="page-header">
        <h1>Your Memories</h1>
        <Link to="/memories/create" className="btn btn-primary">
          Add New Memory
        </Link>
      </div>
      
      {isLoading ? (
        <div className="loading-indicator">Loading memories...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : memories.length > 0 ? (
        <div className="memory-grid">
          {memories.map(renderMemoryCard)}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No memories found</h3>
          <p>Start by creating your first memory.</p>
          <Link to="/memories/create" className="btn btn-primary">
            Create Memory
          </Link>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            className="btn btn-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoriesPage;