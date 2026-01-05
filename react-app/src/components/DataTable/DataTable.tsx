import React, { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { RowData } from '../../types';
import type { LegendFilter } from '../Legend/Legend';
import './DataTable.css';

interface DataTableProps {
  carName: string;
  rows: RowData[];
  fileNames: string[];
  isFile4Uploaded: boolean;
  onFinalValueChange: (feature: string, value: string) => void;
  onCellValueChange: (feature: string, fileIndex: number, value: string) => void;
  searchValue: string;
  legendFilter: LegendFilter;
}

const DataTable: React.FC<DataTableProps> = ({
  carName,
  rows,
  fileNames,
  isFile4Uploaded,
  onFinalValueChange,
  onCellValueChange,
  searchValue,
  legendFilter,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // Filter rows based on search AND legend filter
  const filteredRows = useMemo(() => {
    let filtered = rows;

    // Apply legend filter
    if (legendFilter !== 'all') {
      filtered = filtered.filter((row) => {
        // For blue filter, check if any value is empty
        if (legendFilter === 'blue') {
          return row.values.some((val) => val === '');
        }
        // For other filters, match the color class
        return row.colorClass === legendFilter;
      });
    }

    // Apply search filter
    if (searchValue) {
      const lowerSearch = searchValue.toLowerCase();
      filtered = filtered.filter((row) => {
        // Search in feature name
        if (row.feature.toLowerCase().includes(lowerSearch)) return true;

        // Search in all values
        if (row.values.some((val) => val.toLowerCase().includes(lowerSearch))) return true;

        // Search in final value
        if (row.finalValue.toLowerCase().includes(lowerSearch)) return true;

        return false;
      });
    }

    return filtered;
  }, [rows, searchValue, legendFilter]);

  // Virtualization setup
  const rowVirtualizer = useVirtualizer({
    count: filteredRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Estimated row height in pixels
    overscan: 5, // Number of items to render outside of the visible area
  });

  if (!carName) {
    return null;
  }

  return (
    <>
      <div className="selected-car-title">{carName}</div>
      {(legendFilter !== 'all' || searchValue) && (
        <div className="filter-status">
          Showing {filteredRows.length} of {rows.length} features
          {legendFilter !== 'all' && (
            <span className="filter-badge">
              Filter: {legendFilter === 'green' ? 'All Match' : legendFilter === 'yellow' ? 'Partial' : legendFilter === 'red' ? 'Different' : 'Empty'}
            </span>
          )}
          {searchValue && (
            <span className="filter-badge">
              Search: "{searchValue}"
            </span>
          )}
        </div>
      )}
      <div id="table-scale-container">
        <div className="table-container" ref={parentRef}>
          <table id="data-table">
            <thead>
              <tr>
                <th style={{ backgroundColor: "white", width: "200px", minWidth: "200px" }}>Feature</th>
                <th style={{ backgroundColor: "white", width: "150px", minWidth: "150px" }}>{fileNames[0]}</th>
                <th style={{ backgroundColor: "white", width: "150px", minWidth: "150px" }}>{fileNames[1]}</th>
                <th style={{ backgroundColor: "white", width: "150px", minWidth: "150px" }}>{fileNames[2]}</th>
                {isFile4Uploaded && <th style={{ backgroundColor: "white", width: "150px", minWidth: "150px" }}>{fileNames[3]}</th>}
                <th style={{ backgroundColor: "white", width: "200px", minWidth: "200px" }}>Final Data (Editable)</th>
              </tr>
            </thead>
            <tbody>
              {/* Spacer for rows before visible area */}
              {rowVirtualizer.getVirtualItems().length > 0 && (
                <tr style={{ height: `${rowVirtualizer.getVirtualItems()[0]?.start || 0}px` }}>
                  <td colSpan={isFile4Uploaded ? 6 : 5} style={{ padding: 0, border: 'none' }} />
                </tr>
              )}

              {/* Render only visible rows */}
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = filteredRows[virtualRow.index];

                return (
                  <tr
                    key={virtualRow.index}
                    title={row.tooltip || ''}
                    data-index={virtualRow.index}
                  >
                    <td>{row.feature}</td>
                    {row.values.map((value, colIndex) => {
                      if (colIndex === 3 && !isFile4Uploaded) return null;

                      const cellClass = value === '' ? 'blue' : row.colorClass;

                      return (
                        <td key={colIndex} className={cellClass}>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => onCellValueChange(row.feature, colIndex, e.target.value)}
                          />
                        </td>
                      );
                    })}
                    <td className="final-cell">
                      <input
                        type="text"
                        value={row.finalValue}
                        onChange={(e) => onFinalValueChange(row.feature, e.target.value)}
                        style={{
                          backgroundColor:
                            row.colorClass === 'green'
                              ? '#c8e6c9'
                              : row.colorClass === 'yellow'
                                ? '#fff9c4'
                                : undefined,
                        }}
                      />
                    </td>
                  </tr>
                );
              })}

              {/* Spacer for rows after visible area */}
              {rowVirtualizer.getVirtualItems().length > 0 && (
                <tr style={{
                  height: `${rowVirtualizer.getTotalSize() -
                    (rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1]?.end || 0)
                    }px`
                }}>
                  <td colSpan={isFile4Uploaded ? 6 : 5} style={{ padding: 0, border: 'none' }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DataTable;
