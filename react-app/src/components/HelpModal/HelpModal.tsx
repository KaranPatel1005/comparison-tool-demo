import React from 'react';
import './HelpModal.css';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Help / Instructions</h2>
        <p>
          <strong>Steps to Use the Tool:</strong>
          <ul>
            <li>Upload up to 4 files: at least 3 are required.</li>
            <li>
              Click <em>Upload & Compare</em> to parse data.
            </li>
            <li>
              Select a car from the dropdown or use <em>Previous/Next Car</em>.
            </li>
            <li>
              Review each feature row. <em>Final Data</em> is editable and autosaves to your browser.
            </li>
            <li>
              Use the search box to filter features by text in <em>any column</em>.
            </li>
            <li>Export data to CSV/Excel for the current car or all cars side-by-side.</li>
            <li>
              If you want to start fresh, click <em>Reset Data</em>.
            </li>
          </ul>
        </p>
        <p>
          <strong>Colors:</strong>
          <br />
          <span style={{ background: '#c8e6c9', padding: '3px 6px' }}>Green</span> = All values match
          <br />
          <span style={{ background: '#fff59d', padding: '3px 6px' }}>Yellow</span> = Partial match
          <br />
          <span style={{ background: '#ffccbc', padding: '3px 6px' }}>Red</span> = All different
          <br />
          <span style={{ background: '#bbdefb', padding: '3px 6px' }}>Blue</span> = Empty cell
        </p>
      </div>
    </div>
  );
};

export default HelpModal;
