import { useCallback } from 'react';

/**
 * Custom hook for managing localStorage for final data and cell edits
 */
export const useLocalStorage = () => {
  /**
   * Save final value for a feature
   */
  const saveFinalValue = useCallback((carName: string, feature: string, value: string) => {
    const key = `finalData_${carName}_${feature}`;
    localStorage.setItem(key, value);
  }, []);

  /**
   * Get final value for a feature
   */
  const getFinalValue = useCallback((carName: string, feature: string): string | null => {
    const key = `finalData_${carName}_${feature}`;
    return localStorage.getItem(key);
  }, []);

  /**
   * Save cell data value
   */
  const saveCellValue = useCallback(
    (carName: string, feature: string, fileIndex: number, value: string) => {
      const key = `colData_${carName}_${feature}_${fileIndex}`;
      localStorage.setItem(key, value);
    },
    []
  );

  /**
   * Get cell data value
   */
  const getCellValue = useCallback(
    (carName: string, feature: string, fileIndex: number): string | null => {
      const key = `colData_${carName}_${feature}_${fileIndex}`;
      return localStorage.getItem(key);
    },
    []
  );

  /**
   * Clear all localStorage
   */
  const clearAllStorage = useCallback(() => {
    localStorage.clear();
  }, []);

  return {
    saveFinalValue,
    getFinalValue,
    saveCellValue,
    getCellValue,
    clearAllStorage,
  };
};
