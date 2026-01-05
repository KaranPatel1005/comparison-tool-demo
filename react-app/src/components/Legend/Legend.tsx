import React from 'react';
import './Legend.css';

const Legend: React.FC = () => {
  return (
    <div className="legend-section">
      <span className="legend-item">
        <span className="legend-box green"></span> All Values Match
      </span>
      <span className="legend-item">
        <span className="legend-box yellow"></span> Partial Match
      </span>
      <span className="legend-item">
        <span className="legend-box red"></span> All Different
      </span>
      <span className="legend-item">
        <span className="legend-box blue"></span> Empty
      </span>
    </div>
  );
};

export default Legend;
