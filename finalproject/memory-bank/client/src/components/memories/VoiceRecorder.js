// client/src/components/memories/VoiceRecorder.js
import React, { useState, useRef, useEffect } from 'react';

const VoiceRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  // Start recording
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      setError('');
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        // Create blob from audio chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Create audio URL for playback
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
        
        // Send the audio blob to parent component
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob);
        }
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  return (
    <div className="voice-recorder">
      <div className="recorder-controls">
        {!isRecording ? (
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={startRecording}
          >
            🎤 Start Recording
          </button>
        ) : (
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={stopRecording}
          >
            ⏹️ Stop Recording
          </button>
        )}
        
        {isRecording && (
          <div className="recording-indicator">
            <div className="recording-dot"></div>
            <div className="recording-time">{formatTime(recordingTime)}</div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      {audioUrl && (
        <div className="recorder-playback">
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;