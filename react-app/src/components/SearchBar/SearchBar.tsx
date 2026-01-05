import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchValue, onSearchChange }) => {
  return (
    <div className="controls-row">
      <div className="search-wrapper">
        <label htmlFor="searchInput">Search All Columns:</label>
        <input
          type="text"
          id="searchInput"
          placeholder="Type to filter..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
