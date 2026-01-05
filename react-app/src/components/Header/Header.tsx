import React from 'react';
import './Header.css';

interface HeaderProps {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onHelpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onDarkModeToggle, onHelpClick }) => {
  return (
    <div className="header-row">
      <h1>BXL Data Comparison Tool V3</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div className="toggle-dark-mode">
          <input
            type="checkbox"
            id="darkModeToggle"
            checked={isDarkMode}
            onChange={onDarkModeToggle}
          />
          <label htmlFor="darkModeToggle">Dark Mode</label>
        </div>
        <button className="help-btn" onClick={onHelpClick}>
          Help
        </button>
      </div>
    </div>
  );
};

export default Header;
