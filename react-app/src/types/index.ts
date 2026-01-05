// Core data types
export interface CarData {
  [feature: string]: string;
}

export interface FileData {
  [carName: string]: CarData;
}

export interface CarFeaturesOrder {
  [carName: string]: string[];
}

// KPI metrics
export interface KPIMetrics {
  totalFeatures: number;
  sameCount: number;
  partialCount: number;
  diffCount: number;
  missingCellCount: number;
  diff2Percent: string;
  diff3Percent: string;
  diff4Percent: string;
}

// Row data for table
export interface RowData {
  feature: string;
  values: string[];
  colorClass: 'green' | 'yellow' | 'red' | '';
  finalValue: string;
  tooltip?: string;
}

// Chart data
export interface ChartData {
  sameCount: number;
  partialCount: number;
  diffCount: number;
  diff2Percent: number;
  diff3Percent: number;
  diff4Percent: number;
}

// Component props
export interface FileUploadProps {
  onFilesProcessed: (
    fileData: FileData[],
    carFeaturesOrder: CarFeaturesOrder,
    allCars: string[],
    fileNames: string[],
    isFile4Uploaded: boolean
  ) => void;
}

export interface KPISectionProps {
  metrics: KPIMetrics;
  isFile4Uploaded: boolean;
}

export interface ChartsSectionProps {
  chartData: ChartData | null;
  isFile4Uploaded: boolean;
}

export interface CarNavigationProps {
  allCars: string[];
  currentCarIndex: number;
  onCarChange: (index: number) => void;
}

export interface DataTableProps {
  carName: string;
  rows: RowData[];
  fileNames: string[];
  isFile4Uploaded: boolean;
  onFinalValueChange: (feature: string, value: string) => void;
  onCellValueChange: (feature: string, fileIndex: number, value: string) => void;
}

export interface LegendProps {}

export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ExportControlsProps {
  onExportCurrentCSV: () => void;
  onExportCurrentExcel: () => void;
  onExportAllCSV: () => void;
  onExportAllExcel: () => void;
}

export interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}
