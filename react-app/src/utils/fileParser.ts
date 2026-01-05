import * as XLSX from 'xlsx';
import type { FileData, CarFeaturesOrder } from '../types';

/**
 * Check if file is CSV
 */
export const isCSV = (filename: string): boolean => {
  return /\.(csv)$/i.test(filename);
};

/**
 * Check if file is Excel
 */
export const isExcel = (filename: string): boolean => {
  return /\.(xls|xlsx)$/i.test(filename);
};

/**
 * Safely split CSV line handling quoted values
 */
export const safeSplitCSVLine = (line: string): string[] => {
  const tokens = line.match(/(\".*?\"|[^\",]+)(?=\s*,|\s*$)/g);
  if (!tokens) return [];
  return tokens.map((t) => t.replace(/^\"|\"$/g, '').trim());
};

/**
 * Parse CSV file with multi-column format
 */
export const parseMultiColumnCSV = (
  csvText: string,
  fileIndex: number,
  fileData: FileData[],
  carFeaturesOrder: CarFeaturesOrder
): void => {
  const lines = csvText.split('\n');
  if (lines.length < 1) return;

  // Header row
  const headerRow = safeSplitCSVLine(lines[0]);
  const carNames = headerRow.slice(1);

  // Setup data structures
  carNames.forEach((car) => {
    if (!fileData[fileIndex][car]) {
      fileData[fileIndex][car] = {};
    }
    if (fileIndex === 0 && !carFeaturesOrder[car]) {
      carFeaturesOrder[car] = [];
    }
  });

  // For each subsequent line
  for (let i = 1; i < lines.length; i++) {
    const row = safeSplitCSVLine(lines[i]);
    if (!row || row.length === 0) continue;

    const feature = (row[0] || '').trim();
    if (!feature) continue;

    // If fileIndex === 0, add this feature to every car's list
    if (fileIndex === 0) {
      carNames.forEach((car) => {
        if (!carFeaturesOrder[car].includes(feature)) {
          carFeaturesOrder[car].push(feature);
        }
      });
    }

    // Read data from columns
    for (let colIndex = 1; colIndex < row.length; colIndex++) {
      const carName = (headerRow[colIndex] || '').trim();
      if (carName && fileData[fileIndex][carName]) {
        const cellValue = row[colIndex] ? row[colIndex].trim() : '';
        fileData[fileIndex][carName][feature] = cellValue;
      }
    }
  }
};

/**
 * Parse Excel file
 */
export const parseExcel = (
  arrayBuffer: ArrayBuffer,
  fileIndex: number,
  fileData: FileData[],
  carFeaturesOrder: CarFeaturesOrder
): void => {
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  parseMultiColumnArray(sheetData, fileIndex, fileData, carFeaturesOrder);
};

/**
 * Parse multi-column array (from Excel)
 */
export const parseMultiColumnArray = (
  sheetData: any[][],
  fileIndex: number,
  fileData: FileData[],
  carFeaturesOrder: CarFeaturesOrder
): void => {
  if (!sheetData || sheetData.length < 1) return;

  // The first row is the header
  const headerRow = sheetData[0];
  const carNames = headerRow.slice(1);

  // Setup data structures
  carNames.forEach((car) => {
    if (!fileData[fileIndex][car]) {
      fileData[fileIndex][car] = {};
    }
    if (fileIndex === 0 && !carFeaturesOrder[car]) {
      carFeaturesOrder[car] = [];
    }
  });

  // For each subsequent row
  for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i] || [];
    if (row.length === 0) continue;

    const feature = (row[0] || '').toString().trim();
    if (!feature) continue;

    // If fileIndex === 0, add this feature to every car's list
    if (fileIndex === 0) {
      carNames.forEach((car) => {
        if (!carFeaturesOrder[car].includes(feature)) {
          carFeaturesOrder[car].push(feature);
        }
      });
    }

    // Read data columns
    for (let colIndex = 1; colIndex < row.length; colIndex++) {
      const carName = (headerRow[colIndex] || '').toString().trim();
      if (carName && fileData[fileIndex][carName]) {
        const cellValue = (row[colIndex] || '').toString().trim();
        fileData[fileIndex][carName][feature] = cellValue;
      }
    }
  }
};

/**
 * Read file as text (for CSV)
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

/**
 * Read file as array buffer (for Excel)
 */
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as ArrayBuffer);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
