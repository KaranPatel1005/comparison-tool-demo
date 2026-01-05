import  { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header/Header';
import FileUpload from './components/FileUpload/FileUpload';
import KPISection from './components/KPISection/KPISection';
import ChartsSection from './components/ChartsSection/ChartsSection';
import CarNavigation from './components/CarNavigation/CarNavigation';
import SearchBar from './components/SearchBar/SearchBar';
import ExportControls from './components/ExportControls/ExportControls';
import Legend from './components/Legend/Legend';
import DataTable from './components/DataTable/DataTable';
import HelpModal from './components/HelpModal/HelpModal';
import LoadingOverlay from './components/LoadingOverlay/LoadingOverlay';
import { useLocalStorage } from './hooks/useLocalStorage';
import { processRowData, calcDiffPercent, exportCurrentCarToCSV, exportCurrentCarToExcel, exportAllCarsToCSV, exportAllCarsToExcel } from './utils/dataProcessor';
import type { FileData, CarFeaturesOrder, KPIMetrics, ChartData, RowData } from './types';
import './App.css';

function App() {
  // State management
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Data state
  const [fileData, setFileData] = useState<FileData[]>([{}, {}, {}, {}]);
  const [carFeaturesOrder, setCarFeaturesOrder] = useState<CarFeaturesOrder>({});
  const [allCars, setAllCars] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>(['Data 1', 'Data 2', 'Data 3', 'Data 4']);
  const [isFile4Uploaded, setIsFile4Uploaded] = useState(false);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);

  // Custom hooks
  const { saveFinalValue, getFinalValue, saveCellValue, clearAllStorage } = useLocalStorage();

  // Current car name
  const currentCarName = allCars[currentCarIndex] || '';

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Handle dark mode toggle with pixelate effect
  const handleDarkModeToggle = () => {
    document.body.classList.add('pixelate-transition');

    setTimeout(() => {
      setIsDarkMode(!isDarkMode);
    }, 200);

    setTimeout(() => {
      document.body.classList.remove('pixelate-transition');
    }, 600);
  };

  // Handle files processed
  const handleFilesProcessed = useCallback(
    (
      newFileData: FileData[],
      newCarFeaturesOrder: CarFeaturesOrder,
      newAllCars: string[],
      newFileNames: string[],
      newIsFile4Uploaded: boolean
    ) => {
      setFileData(newFileData);
      setCarFeaturesOrder(newCarFeaturesOrder);
      setAllCars(newAllCars);
      setFileNames(newFileNames);
      setIsFile4Uploaded(newIsFile4Uploaded);
      setCurrentCarIndex(0);
    },
    []
  );

  // Handle reset
  const handleReset = useCallback(() => {
    if (!confirm('Are you sure you want to reset all data? This clears local storage.')) return;

    setFileData([{}, {}, {}, {}]);
    setCarFeaturesOrder({});
    setAllCars([]);
    setFileNames(['Data 1', 'Data 2', 'Data 3', 'Data 4']);
    setIsFile4Uploaded(false);
    setCurrentCarIndex(0);
    setSearchValue('');
    clearAllStorage();
  }, [clearAllStorage]);

  // Build rows for current car
  const currentCarRows = useMemo((): RowData[] => {
    if (!currentCarName) return [];

    const featureList = carFeaturesOrder[currentCarName] || [];
    const rows: RowData[] = [];

    featureList.forEach((feature, rowIndex) => {
      // Gather up to 4 values
      const rowValues: string[] = [];
      for (let i = 0; i < 4; i++) {
        if (i === 3 && !isFile4Uploaded) break;
        const carObj = fileData[i][currentCarName] || {};
        const val = carObj[feature] || '';
        rowValues.push(val);
      }

      // Process row data
      const { colorClass, finalValue: calculatedFinalValue, tooltip } = processRowData(
        feature,
        rowValues,
        rowIndex
      );

      // Check localStorage for override
      const savedFinalValue = getFinalValue(currentCarName, feature);
      const finalValue = savedFinalValue !== null ? savedFinalValue : calculatedFinalValue;

      rows.push({
        feature,
        values: rowValues,
        colorClass,
        finalValue,
        tooltip,
      });
    });

    return rows;
  }, [currentCarName, carFeaturesOrder, fileData, isFile4Uploaded, getFinalValue]);

  // Calculate KPI metrics
  const kpiMetrics = useMemo((): KPIMetrics => {
    if (!currentCarName || currentCarRows.length === 0) {
      return {
        totalFeatures: 0,
        sameCount: 0,
        partialCount: 0,
        diffCount: 0,
        missingCellCount: 0,
        diff2Percent: '0%',
        diff3Percent: '0%',
        diff4Percent: '0%',
      };
    }

    let sameCount = 0;
    let partialCount = 0;
    let diffCount = 0;
    let missingCellCount = 0;

    let diffFile2 = 0,
      diffFile3 = 0,
      diffFile4 = 0;
    let compareCount2 = 0,
      compareCount3 = 0,
      compareCount4 = 0;

    currentCarRows.forEach((row) => {
      // Count missing cells
      missingCellCount += row.values.filter((v) => v === '').length;

      // Count color classes
      if (row.colorClass === 'green') sameCount++;
      else if (row.colorClass === 'yellow') partialCount++;
      else if (row.colorClass === 'red') diffCount++;

      // Compare files vs file1
      const valFile1 = row.values[0];
      if (valFile1) {
        const lowerFile1 = valFile1.toLowerCase();

        if (row.values[1]) {
          compareCount2++;
          if (row.values[1].toLowerCase() !== lowerFile1) diffFile2++;
        }

        if (row.values[2]) {
          compareCount3++;
          if (row.values[2].toLowerCase() !== lowerFile1) diffFile3++;
        }

        if (isFile4Uploaded && row.values[3]) {
          compareCount4++;
          if (row.values[3].toLowerCase() !== lowerFile1) diffFile4++;
        }
      }
    });

    return {
      totalFeatures: currentCarRows.length,
      sameCount,
      partialCount,
      diffCount,
      missingCellCount,
      diff2Percent: calcDiffPercent(diffFile2, compareCount2),
      diff3Percent: calcDiffPercent(diffFile3, compareCount3),
      diff4Percent: calcDiffPercent(diffFile4, compareCount4),
    };
  }, [currentCarName, currentCarRows, isFile4Uploaded]);

  // Calculate chart data
  const chartData = useMemo((): ChartData | null => {
    if (!currentCarName || currentCarRows.length === 0) return null;

    return {
      sameCount: kpiMetrics.sameCount,
      partialCount: kpiMetrics.partialCount,
      diffCount: kpiMetrics.diffCount,
      diff2Percent: parseFloat(kpiMetrics.diff2Percent),
      diff3Percent: parseFloat(kpiMetrics.diff3Percent),
      diff4Percent: parseFloat(kpiMetrics.diff4Percent),
    };
  }, [currentCarName, currentCarRows, kpiMetrics]);

  // Handle final value change
  const handleFinalValueChange = useCallback(
    (feature: string, value: string) => {
      saveFinalValue(currentCarName, feature, value);
      // Force re-render by updating a dummy state or use a ref
      // For simplicity, we'll rely on the next render cycle
    },
    [currentCarName, saveFinalValue]
  );

  // Handle cell value change
  const handleCellValueChange = useCallback(
    (feature: string, fileIndex: number, value: string) => {
      saveCellValue(currentCarName, feature, fileIndex, value);
      // Update fileData
      setFileData((prev) => {
        const updated = [...prev];
        if (!updated[fileIndex][currentCarName]) {
          updated[fileIndex][currentCarName] = {};
        }
        updated[fileIndex][currentCarName][feature] = value;
        return updated;
      });
    },
    [currentCarName, saveCellValue]
  );

  // Export handlers
  const handleExportCurrentCSV = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      exportCurrentCarToCSV(currentCarRows, currentCarName);
      setIsLoading(false);
    }, 50);
  }, [currentCarRows, currentCarName]);

  const handleExportCurrentExcel = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      exportCurrentCarToExcel(currentCarRows, currentCarName);
      setIsLoading(false);
    }, 50);
  }, [currentCarRows, currentCarName]);

  const handleExportAllCSV = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      exportAllCarsToCSV(allCars, carFeaturesOrder, (carName, feature) => {
        const saved = getFinalValue(carName, feature);
        if (saved !== null) return saved;

        // Calculate default
        const featureList = carFeaturesOrder[carName] || [];
        const rowIndex = featureList.indexOf(feature);
        if (rowIndex === -1) return '';

        const rowValues: string[] = [];
        for (let i = 0; i < 4; i++) {
          if (i === 3 && !isFile4Uploaded) break;
          const carObj = fileData[i][carName] || {};
          const val = carObj[feature] || '';
          rowValues.push(val);
        }

        const { finalValue } = processRowData(feature, rowValues, rowIndex);
        return finalValue;
      });
      setIsLoading(false);
    }, 50);
  }, [allCars, carFeaturesOrder, fileData, isFile4Uploaded, getFinalValue]);

  const handleExportAllExcel = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      exportAllCarsToExcel(allCars, carFeaturesOrder, (carName, feature) => {
        const saved = getFinalValue(carName, feature);
        if (saved !== null) return saved;

        // Calculate default
        const featureList = carFeaturesOrder[carName] || [];
        const rowIndex = featureList.indexOf(feature);
        if (rowIndex === -1) return '';

        const rowValues: string[] = [];
        for (let i = 0; i < 4; i++) {
          if (i === 3 && !isFile4Uploaded) break;
          const carObj = fileData[i][carName] || {};
          const val = carObj[feature] || '';
          rowValues.push(val);
        }

        const { finalValue } = processRowData(feature, rowValues, rowIndex);
        return finalValue;
      });
      setIsLoading(false);
    }, 50);
  }, [allCars, carFeaturesOrder, fileData, isFile4Uploaded, getFinalValue]);

  return (
    <div className="container">
      <Header
        isDarkMode={isDarkMode}
        onDarkModeToggle={handleDarkModeToggle}
        onHelpClick={() => setIsHelpOpen(true)}
      />

      <FileUpload onFilesProcessed={handleFilesProcessed} onReset={handleReset} />

      <KPISection metrics={kpiMetrics} isFile4Uploaded={isFile4Uploaded} />

      <ChartsSection chartData={chartData} isFile4Uploaded={isFile4Uploaded} />

      <CarNavigation
        allCars={allCars}
        currentCarIndex={currentCarIndex}
        onCarChange={setCurrentCarIndex}
      />

      <SearchBar searchValue={searchValue} onSearchChange={setSearchValue} />

      <ExportControls
        onExportCurrentCSV={handleExportCurrentCSV}
        onExportCurrentExcel={handleExportCurrentExcel}
        onExportAllCSV={handleExportAllCSV}
        onExportAllExcel={handleExportAllExcel}
      />

      <Legend />

      <DataTable
        carName={currentCarName}
        rows={currentCarRows}
        fileNames={fileNames}
        isFile4Uploaded={isFile4Uploaded}
        onFinalValueChange={handleFinalValueChange}
        onCellValueChange={handleCellValueChange}
        searchValue={searchValue}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
}

export default App;
