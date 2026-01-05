import React from 'react';
import './LoadingOverlay.css';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, message = 'Exporting data, please wait...' }) => {
  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingOverlay;
