import * as XLSX from 'xlsx';
import type { RowData, CarFeaturesOrder } from '../types';

/**
 * Calculate diff percentage
 */
export const calcDiffPercent = (diffCount: number, compareCount: number): string => {
  if (!compareCount) return '0%';
  return ((diffCount / compareCount) * 100).toFixed(1) + '%';
};

/**
 * Generate tooltip text for rows with differences
 */
export const generateTooltipText = (rowValues: string[]): string => {
  const file1 = rowValues[0] || '';
  if (!file1) return 'File1 empty';
  const lowerFile1 = file1.toLowerCase();
  const differences: string[] = [];
  
  for (let i = 1; i < rowValues.length; i++) {
    if (rowValues[i] && rowValues[i].toLowerCase() !== lowerFile1) {
      differences.push(`File${i + 1} != File1`);
    }
  }
  
  if (differences.length === 0) {
    return 'No differences from File1 (ignoring case)';
  }
  return differences.join(', ');
};

/**
 * Process row data and determine color class
 */
export const processRowData = (
  feature: string,
  rowValues: string[],
  rowIndex: number
): { colorClass: 'green' | 'yellow' | 'red' | ''; finalValue: string; tooltip?: string } => {
  // Case-insensitive array
  const lowerVals = rowValues.map((v) => v.toLowerCase());
  
  // Convert empty to placeholders
  const transformedVals = lowerVals.map((v, colIndex) =>
    v === '' ? `_EMPTY_${rowIndex}_${colIndex}` : v
  );

  const uniqueVals = new Set(transformedVals);
  let colorClass: 'green' | 'yellow' | 'red' | '' = '';
  let finalValue = '';

  // Are all non-empty ignoring case the same?
  const allNonEmptyAreSame =
    uniqueVals.size === 1 && ![...uniqueVals][0].startsWith('_EMPTY_');

  if (allNonEmptyAreSame) {
    colorClass = 'green';
    finalValue = rowValues[0];
  } else if (uniqueVals.size === rowValues.length) {
    colorClass = 'red';
  } else {
    colorClass = 'yellow';

    // Most common ignoring case, preserve original
    const freqMap: { [key: string]: number } = {};
    rowValues.forEach((origVal) => {
      if (origVal !== '') {
        const lowerVal = origVal.toLowerCase();
        freqMap[lowerVal] = (freqMap[lowerVal] || 0) + 1;
      }
    });

    let bestVal = '';
    let maxFreq = 0;
    rowValues.forEach((origVal) => {
      if (origVal !== '') {
        const lowerVal = origVal.toLowerCase();
        if (freqMap[lowerVal] >= maxFreq) {
          maxFreq = freqMap[lowerVal];
          bestVal = origVal;
        }
      }
    });
    finalValue = bestVal;
  }

  const tooltip = (colorClass === 'yellow' || colorClass === 'red') 
    ? generateTooltipText(rowValues) 
    : undefined;

  return { colorClass, finalValue, tooltip };
};

/**
 * Export current car data to CSV
 */
export const exportCurrentCarToCSV = (rows: RowData[], carName: string): void => {
  let csvContent = 'Feature,Final Data\n';

  rows.forEach((row) => {
    csvContent += `"${row.feature}","${row.finalValue}"\n`;
  });

  downloadCSV(csvContent, `final_data_${carName}_${getTimestamp()}.csv`);
};

/**
 * Export all cars data to CSV
 */
export const exportAllCarsToCSV = (
  allCars: string[],
  carFeaturesOrder: CarFeaturesOrder,
  getFinalValue: (carName: string, feature: string) => string
): void => {
  // Build header
  let csvContent = 'Feature';
  allCars.forEach((carName) => {
    csvContent += `,"${carName}"`;
  });
  csvContent += '\n';

  // Gather all features
  const allFeaturesSet = new Set<string>();
  allCars.forEach((carName) => {
    const flist = carFeaturesOrder[carName] || [];
    flist.forEach((f) => allFeaturesSet.add(f));
  });
  const allFeatures = Array.from(allFeaturesSet);

  // For each feature
  allFeatures.forEach((feature) => {
    let rowData = [`"${feature}"`];

    allCars.forEach((carName) => {
      const finalValue = getFinalValue(carName, feature);
      rowData.push(`"${finalValue}"`);
    });

    csvContent += rowData.join(',') + '\n';
  });

  downloadCSV(csvContent, `all_cars_side_by_side_${getTimestamp()}.csv`);
};

/**
 * Export current car data to Excel
 */
export const exportCurrentCarToExcel = (rows: RowData[], carName: string): void => {
  const dataRows = [['Feature', 'Final Data']];
  
  rows.forEach((row) => {
    dataRows.push([row.feature, row.finalValue]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(dataRows);
  XLSX.utils.book_append_sheet(wb, ws, 'FinalData');

  XLSX.writeFile(wb, `final_data_${carName}_${getTimestamp()}.xlsx`);
};

/**
 * Export all cars data to Excel
 */
export const exportAllCarsToExcel = (
  allCars: string[],
  carFeaturesOrder: CarFeaturesOrder,
  getFinalValue: (carName: string, feature: string) => string
): void => {
  const header = ['Feature', ...allCars];

  const allFeaturesSet = new Set<string>();
  allCars.forEach((carName) => {
    const flist = carFeaturesOrder[carName] || [];
    flist.forEach((f) => allFeaturesSet.add(f));
  });
  const allFeatures = Array.from(allFeaturesSet);

  const dataRows = [header];

  allFeatures.forEach((feature) => {
    const row = [feature];
    allCars.forEach((carName) => {
      const finalValue = getFinalValue(carName, feature);
      row.push(finalValue);
    });
    dataRows.push(row);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(dataRows);
  XLSX.utils.book_append_sheet(wb, ws, 'AllCars');

  XLSX.writeFile(wb, `all_cars_side_by_side_${getTimestamp()}.xlsx`);
};

/**
 * Download CSV file
 */
const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const a = document.createElement('a');
  a.download = filename;
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Get timestamp for file naming
 */
const getTimestamp = (): string => {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
};
