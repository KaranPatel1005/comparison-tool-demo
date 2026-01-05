import React from 'react';
import './ExportControls.css';

interface ExportControlsProps {
  onExportCurrentCSV: () => void;
  onExportCurrentExcel: () => void;
  onExportAllCSV: () => void;
  onExportAllExcel: () => void;
}

const ExportControls: React.FC<ExportControlsProps> = ({
  onExportCurrentCSV,
  onExportCurrentExcel,
  onExportAllCSV,
  onExportAllExcel,
}) => {
  return (
    <div className="controls-row export-controls">
      <button className="export-btn" onClick={onExportCurrentCSV}>
        Export Current Car CSV
      </button>
      <button className="export-btn" onClick={onExportCurrentExcel}>
        Export Current Car Excel
      </button>
      <button className="export-btn" onClick={onExportAllCSV}>
        Export All Cars CSV
      </button>
      <button className="export-btn" onClick={onExportAllExcel}>
        Export All Cars Excel
      </button>
    </div>
  );
};

export default ExportControls;
