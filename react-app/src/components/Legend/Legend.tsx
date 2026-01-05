import React from 'react';
import './Legend.css';

export type LegendFilter = 'all' | 'green' | 'yellow' | 'red' | 'blue';

interface LegendProps {
  activeFilter: LegendFilter;
  onFilterChange: (filter: LegendFilter) => void;
}

const Legend: React.FC<LegendProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="legend-section">
      <span
        className={`legend-item clickable ${activeFilter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
        title="Click to show all records"
      >
        <span className="legend-box all"></span> Show All
      </span>
      <span
        className={`legend-item clickable ${activeFilter === 'green' ? 'active' : ''}`}
        onClick={() => onFilterChange('green')}
        title="Click to filter: All Values Match"
      >
        <span className="legend-box green"></span> All Values Match
      </span>
      <span
        className={`legend-item clickable ${activeFilter === 'yellow' ? 'active' : ''}`}
        onClick={() => onFilterChange('yellow')}
        title="Click to filter: Partial Match"
      >
        <span className="legend-box yellow"></span> Partial Match
      </span>
      <span
        className={`legend-item clickable ${activeFilter === 'red' ? 'active' : ''}`}
        onClick={() => onFilterChange('red')}
        title="Click to filter: All Different"
      >
        <span className="legend-box red"></span> All Different
      </span>
      <span
        className={`legend-item clickable ${activeFilter === 'blue' ? 'active' : ''}`}
        onClick={() => onFilterChange('blue')}
        title="Click to filter: Empty cells"
      >
        <span className="legend-box blue"></span> Empty
      </span>
    </div>
  );
};

export default Legend;
