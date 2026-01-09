import { useState, useCallback, useMemo, useEffect } from "react";
import { toast, Toaster } from "sonner";
import Header from "./components/Header/Header";
import FileUpload from "./components/FileUpload/FileUpload";
import KPISection from "./components/KPISection/KPISection";
import ChartsSection from "./components/ChartsSection/ChartsSection";
import CarNavigation from "./components/CarNavigation/CarNavigation";
import SearchBar from "./components/SearchBar/SearchBar";
import ExportControls from "./components/ExportControls/ExportControls";
import Legend, { type LegendFilter } from "./components/Legend/Legend";
import DataTable from "./components/DataTable/DataTable";
import HelpModal from "./components/HelpModal/HelpModal";
import LoadingOverlay from "./components/LoadingOverlay/LoadingOverlay";
import SaveModal from "./components/SaveModal/SaveModal";
import ExportModal from "./components/ExportModal/ExportModal";
import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  processRowData,
  calcDiffPercent,
  exportCurrentCarToCSV,
  exportCurrentCarToExcel,
  exportAllCarsToCSV,
  exportAllCarsToExcel,
} from "./utils/dataProcessor";
import {
  type FileData,
  type CarFeaturesOrder,
  type KPIMetrics,
  type ChartData,
  type RowData,
  GENERAL_FEATURE_MAP,
  type Features,
  type Row,
  type Specs,
  type FeatureMapping,
  type FeatureEntry,
  type SpecFeatures,
  BATTERY_FEATURE_MAP,
  ACCESS_STORAGE_FEATURE_MAP,
  ADAS_FEATURE_MAP,
  LIGHT_FEATURE_MAP,
  INTERIOR_FEATURE_MAP,
  GLASS_FEATURE_MAP,
  SAFETY_TECHNICAL_FEATURE_MAP,
  CONNECTIVITY_FEATURES_MAP,
  CONNECTIVITY_PACKAGES_FEATURE_MAP,
  type User,
  type ComparisonState,
} from "./types";
import "./App.css";
import { apiRequest } from "./api/api";
import { normalizeValue, parseValue } from "./utils/utils";

function App() {
  // State management
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [legendFilter, setLegendFilter] = useState<LegendFilter>("all");

  // Data state
  const [fileData, setFileData] = useState<FileData[]>([{}, {}, {}, {}]);
  const [carFeaturesOrder, setCarFeaturesOrder] = useState<CarFeaturesOrder>(
    {}
  );
  const [allCars, setAllCars] = useState<{ _id: string; carName: string }[]>(
    []
  );
  const [fileNames, setFileNames] = useState<string[]>([]);

  const [isFile4Uploaded, setIsFile4Uploaded] = useState(false);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [finalValueTrigger, setFinalValueTrigger] = useState(0); // Trigger re-render on final value change

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [comparisonStateData, setComparisonStateData] =
    useState<ComparisonState>({
      _id: "",
      country: "",
      brand: "",
      model: "",
      is_exported: false,
      exported_at: null,
    });

  // Mode state: 'upload' or 'user'
  const [mode, setMode] = useState<"upload" | "user">("upload");

  // Format date utility
  const formatExportDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  };

  // Custom hooks
  const { saveFinalValue, getFinalValue, saveCellValue, clearAllStorage } =
    useLocalStorage();

  // Current car name
  const currentCarName = allCars[currentCarIndex]?.carName || "";

  useEffect(() => {
    setFileData([{}, {}, {}, {}]);
    setCarFeaturesOrder({});
    setAllCars([]);
    setFileNames([]);
    setIsFile4Uploaded(false);
    setCurrentCarIndex(0);
    setSearchValue("");
    setLegendFilter("all");
    clearAllStorage();
  }, []);

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await apiRequest({
        method: "GET",
        url: "/api/v1/comparison-tool/get-users",
      });
      setUsers(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setUsersError(errorMessage);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch users on mount
  useEffect(() => {
    if (mode === "user") fetchUsers();
  }, [mode]);

  const getCarList = async (selectedUserId: string) => {
    try {
      const response = await apiRequest({
        method: "GET",
        url: `/api/v1/comparison-tool/get-cars-list?userId=${selectedUserId}`,
      });
      console.log("🚀 ~ App.tsx:107 ~ fetchData ~ response:", response);
      setAllCars(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(errorMessage);
    }
  };

  const onUserChange = (userId: string) => {
    setSelectedUserId(userId);
    getCarList(userId);
  };

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // Handle dark mode toggle with smooth transition
  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const fetchComparisonData = async (collectionId: string) => {
    try {
      const response = await apiRequest({
        method: "GET",
        url: `/api/v1/comparison-tool/get-comparison-data?collectionId=${collectionId}`,
      });

      setFileNames(response.data.fileNames);
      setCarFeaturesOrder({
        [response.data.carName]: Object.values(response.data.features).flatMap(
          (feature: any) => {
            return feature.map((i: any) => i.label);
          }
        ),
      });

      // Create fileData array with proper structure and populate with feature values
      const newFileData = Array.from(
        { length: response.data.no_of_file_uploads },
        (_, fileIndex) => {
          const carData: { [feature: string]: string } = {};
          // Iterate through all feature categories (general, battery_motor, etc.)
          Object.values(response.data.features).forEach((featureArray: any) => {
            // Iterate through each feature in the category
            featureArray.forEach((feature: any) => {
              // Get the value for this specific file index from fileValues array
              const value = feature.fileValues[fileIndex] || "";
              carData[feature.label] = value;
            });
          });

          return {
            [response.data.carName]: carData,
          };
        }
      );

      setFileData(newFileData);

      setComparisonStateData({
        _id: response.data._id,
        country: response.data.country,
        brand: response.data.brand,
        model: response.data.model,
        is_exported: response.data.is_exported || false,
        exported_at: response.data.exported_at || null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(errorMessage);
    }
  };

  const onCarChange = (index: number) => {
    setCurrentCarIndex(index);
    const findCarId = allCars[index]._id;
    fetchComparisonData(findCarId);
  };

  // Fetch data for the first car when allCars is populated
  useEffect(() => {
    if (allCars.length > 0 && currentCarIndex === 0) {
      const firstCarId = allCars[0]._id;
      fetchComparisonData(firstCarId);
    }
  }, [allCars]);

  // Handle files processed
  const handleFilesProcessed = useCallback(
    (
      newFileData: FileData[],
      newCarFeaturesOrder: CarFeaturesOrder,
      newAllCars: { _id: string; carName: string }[],
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
  const handleReset = useCallback(
    (confirmState: boolean = true) => {
      if (confirmState) {
        const userConfirmed = confirm(
          "Are you sure you want to reset all data? This clears local storage."
        );
        if (!userConfirmed) {
          return;
        }
      }

      setFileData([{}, {}, {}, {}]);
      setCarFeaturesOrder({});
      setAllCars([]);
      setFileNames([]);
      setIsFile4Uploaded(false);
      setCurrentCarIndex(0);
      setSearchValue("");
      setLegendFilter("all");
      setUsers([]);
      setSelectedUserId("");
      setUsersLoading(false);
      setUsersError(null);
      setComparisonStateData({
        _id: "",
        country: "",
        brand: "",
        model: "",
        is_exported: false,
        exported_at: null,
      });
      clearAllStorage();
    },
    [clearAllStorage]
  );

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
        const val = carObj[feature] || "";
        rowValues.push(val);
      }

      // Process row data
      const {
        colorClass,
        finalValue: calculatedFinalValue,
        tooltip,
      } = processRowData(feature, rowValues, rowIndex);

      // Check localStorage for override
      const savedFinalValue = getFinalValue(currentCarName, feature);
      const finalValue =
        savedFinalValue !== null ? savedFinalValue : calculatedFinalValue;

      rows.push({
        feature,
        values: rowValues,
        colorClass,
        finalValue,
        tooltip,
      });
    });

    return rows;
  }, [
    currentCarName,
    carFeaturesOrder,
    fileData,
    isFile4Uploaded,
    getFinalValue,
    finalValueTrigger,
  ]);

  // Calculate KPI metrics
  const kpiMetrics = useMemo((): KPIMetrics => {
    if (!currentCarName || currentCarRows.length === 0) {
      return {
        totalFeatures: 0,
        sameCount: 0,
        partialCount: 0,
        diffCount: 0,
        missingCellCount: 0,
        diff2Percent: "0%",
        diff3Percent: "0%",
        diff4Percent: "0%",
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
      missingCellCount += row.values.filter((v) => v === "").length;

      // Count color classes
      if (row.colorClass === "green") sameCount++;
      else if (row.colorClass === "yellow") partialCount++;
      else if (row.colorClass === "red") diffCount++;

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
  const chartData = useMemo((): ChartData => {
    if (!currentCarName || currentCarRows.length === 0) {
      return {
        sameCount: 0,
        partialCount: 0,
        diffCount: 0,
        diff2Percent: 0,
        diff3Percent: 0,
        diff4Percent: 0,
      };
    }

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
      // Trigger re-render to update the displayed value
      setFinalValueTrigger((prev) => prev + 1);
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

  // Handle save data
  const handleSaveData = useCallback(
    async (country: string, brand: string, model: string) => {
      try {
        setIsLoading(true);

        const features: Features = {
          general: [],
          battery_motor: [],
          access_storage: [],
          adas: [],
          lights: [],
          interior: [],
          glasses: [],
          safety_technical: [],
          connectivity_features: [],
          connectivity_packages: [],
        };

        const specs: Specs = {
          general: {},
          battery_motor: {},
          access_storage: {},
          adas: {},
          lights: {},
          interior: {},
          glasses: {},
          safety_technical: {},
          connectivity_features: {},
          connectivity_packages: {},
        };

        const upsertFeature = <T,>(
          arr: FeatureEntry<T>[],
          key: keyof T,
          label: string,
          fileValues: (number | string | boolean | null)[],
          value: T[keyof T] | null
        ) => {
          const idx = arr.findIndex((f) => f.key === key);

          if (idx >= 0) {
            arr[idx].value = value;
            arr[idx].fileValues = fileValues;
          } else {
            arr.push({ key, label, value, fileValues });
          }
        };

        function processCategoryData<T>(
          row: Row,
          featureMap: Record<string, FeatureMapping<T>>,
          featureArray: FeatureEntry<T>[],
          specObject: SpecFeatures<T>
        ) {
          const mapping = featureMap[row.feature];
          if (!mapping) return;

          const normalizedValue = normalizeValue(row.finalValue);
          const parsedValue = parseValue(normalizedValue, mapping.type) as
            | T[keyof T]
            | null;

          upsertFeature(
            featureArray,
            mapping.key,
            row.feature,
            row.values,
            parsedValue
          );

          specObject[mapping.key] = parsedValue;
        }

        const processRowFeature = (row: Row) => {
          processCategoryData(
            row,
            GENERAL_FEATURE_MAP,
            features.general,
            specs.general
          );
          processCategoryData(
            row,
            BATTERY_FEATURE_MAP,
            features.battery_motor,
            specs.battery_motor
          );
          processCategoryData(
            row,
            ACCESS_STORAGE_FEATURE_MAP,
            features.access_storage,
            specs.access_storage
          );
          processCategoryData(row, ADAS_FEATURE_MAP, features.adas, specs.adas);
          processCategoryData(
            row,
            LIGHT_FEATURE_MAP,
            features.lights,
            specs.lights
          );

          processCategoryData(
            row,
            INTERIOR_FEATURE_MAP,
            features.interior,
            specs.interior
          );
          processCategoryData(
            row,
            GLASS_FEATURE_MAP,
            features.glasses,
            specs.glasses
          );
          processCategoryData(
            row,
            SAFETY_TECHNICAL_FEATURE_MAP,
            features.safety_technical,
            specs.safety_technical
          );
          processCategoryData(
            row,
            CONNECTIVITY_FEATURES_MAP,
            features.connectivity_features,
            specs.connectivity_features
          );
          processCategoryData(
            row,
            CONNECTIVITY_PACKAGES_FEATURE_MAP,
            features.connectivity_packages,
            specs.connectivity_packages
          );
        };

        currentCarRows.forEach(processRowFeature);

        const payload = {
          no_of_file_uploads: fileData.reduce(
            (acc, i) => acc + (Object.values(i).length > 0 ? 1 : 0),
            0
          ),
          fileNames,
          country,
          brand,
          model,
          carName: brand + " " + model,
          features,
          specs,
        };

        const url =
          mode === "upload"
            ? "/api/v1/comparison-tool/save-data"
            : `/api/v1/comparison-tool/update-data?comparisonId=${allCars[currentCarIndex]?._id}`;

        await apiRequest({
          method: "POST",
          url,
          data: payload,
        });

        setIsSaveModalOpen(false);

        if (mode === "user") {
          handleReset(false);
          fetchUsers();
        }
      } catch (error) {
        console.error("Error saving data:", error);
        alert("Failed to save data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [currentCarName, currentCarRows, fileNames]
  );

  // Export to Database handler
  const handleExportToDatabase = useCallback(() => {
    setIsExportModalOpen(true);
  }, []);

  const handleExportSubmit = useCallback(
    async (countryId: string, brandId: string, modelId: string) => {
      try {
        setIsLoading(true);
        const collectionId = allCars[currentCarIndex]?._id;

        const response = await apiRequest({
          method: "POST",
          url: `/api/v1/comparison-tool/export-to-database?comparisonId=${collectionId}`,
          data: {
            countryId,
            brandId,
            modelId,
          },
        });

        setComparisonStateData({
          _id: response.data._id,
          brand: response.data.brand,
          model: response.data.model,
          country: response.data.country,
          exported_at: response.data.exported_at,
          is_exported: response.data.is_exported,
        });

        toast.success("Successfully exported to database!");
        setIsExportModalOpen(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to export to database";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [allCars, currentCarIndex]
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
        if (rowIndex === -1) return "";

        const rowValues: string[] = [];
        for (let i = 0; i < 4; i++) {
          if (i === 3 && !isFile4Uploaded) break;
          const carObj = fileData[i][carName] || {};
          const val = carObj[feature] || "";
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
        if (rowIndex === -1) return "";

        const rowValues: string[] = [];
        for (let i = 0; i < 4; i++) {
          if (i === 3 && !isFile4Uploaded) break;
          const carObj = fileData[i][carName] || {};
          const val = carObj[feature] || "";
          rowValues.push(val);
        }

        const { finalValue } = processRowData(feature, rowValues, rowIndex);
        return finalValue;
      });
      setIsLoading(false);
    }, 50);
  }, [allCars, carFeaturesOrder, fileData, isFile4Uploaded, getFinalValue]);

  const onModeChange = (mode: "upload" | "user") => {
    setMode(mode);
    handleReset(false);
  };

  return (
    <div className="container">
      <Header
        isDarkMode={isDarkMode}
        onDarkModeToggle={handleDarkModeToggle}
        onHelpClick={() => setIsHelpOpen(true)}
      />

      {/* Mode Toggle Button */}
      {/* Mode Toggle Button */}
      <div className="text-center mb-5">
        <div className="inline-flex border-2 border-[#007aff] rounded-lg overflow-hidden">
          <button
            onClick={() => onModeChange("upload")}
            className={`px-5 py-2.5 border-none cursor-pointer transition-all duration-300 ${
              mode === "upload"
                ? "bg-[#007aff] text-white font-bold"
                : "bg-transparent text-[#007aff] font-normal"
            }`}
          >
            📁 File Upload
          </button>
          <button
            onClick={() => onModeChange("user")}
            className={`px-5 py-2.5 border-none cursor-pointer transition-all duration-300 ${
              mode === "user"
                ? "bg-[#007aff] text-white font-bold"
                : "bg-transparent text-[#007aff] font-normal"
            }`}
          >
            👤 User Selection
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <FileUpload
          onFilesProcessed={handleFilesProcessed}
          onReset={handleReset}
        />
      ) : (
        <CarNavigation
          allCars={allCars}
          currentCarIndex={currentCarIndex}
          onCarChange={onCarChange}
          users={users}
          selectedUserId={selectedUserId}
          onUserChange={onUserChange}
          usersLoading={usersLoading}
          usersError={usersError}
          mode={mode}
          onReset={handleReset}
        />
      )}

      <KPISection metrics={kpiMetrics} isFile4Uploaded={isFile4Uploaded} />

      <ChartsSection chartData={chartData} isFile4Uploaded={isFile4Uploaded} />

      {mode === "upload" && (
        <CarNavigation
          allCars={allCars}
          currentCarIndex={currentCarIndex}
          onCarChange={onCarChange}
          users={users}
          selectedUserId={selectedUserId}
          onUserChange={onUserChange}
          usersLoading={usersLoading}
          usersError={usersError}
          mode={mode}
          onReset={handleReset}
        />
      )}

      {/* Export Status Badge */}
      {mode === "user" && comparisonStateData._id && (
        <div className="mb-4">
          <div
            className={`w-full inline-flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-medium shadow-sm ${
              comparisonStateData.is_exported
                ? "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-2 border-green-300"
                : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-2 border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {comparisonStateData.is_exported ? (
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="font-semibold">
                {comparisonStateData.is_exported
                  ? "Exported to Database"
                  : "Not Exported"}
              </span>
            </div>
            {comparisonStateData.is_exported &&
              comparisonStateData.exported_at && (
                <div className="flex items-center gap-1.5 text-xs text-green-700 bg-white bg-opacity-60 px-3 py-1 rounded-md">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {formatExportDate(comparisonStateData.exported_at)}
                  </span>
                </div>
              )}
          </div>
        </div>
      )}

      <div className="flex gap-2 items-center justify-between mb-2">
        <SearchBar searchValue={searchValue} onSearchChange={setSearchValue} />

        <div className="flex gap-2 items-center">
          {allCars.length > 0 && (
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="export-btn"
            >
              {mode === "upload" ? "Save Data" : "Update Data"}
            </button>
          )}

          {mode === "user" && allCars.length > 0 && (
            <button
              onClick={handleExportToDatabase}
              className="export-btn"
              style={{ backgroundColor: "#10b981" }}
            >
              Export to Database
            </button>
          )}
        </div>
      </div>
      <ExportControls
        onExportCurrentCSV={handleExportCurrentCSV}
        onExportCurrentExcel={handleExportCurrentExcel}
        onExportAllCSV={handleExportAllCSV}
        onExportAllExcel={handleExportAllExcel}
      />

      <Legend activeFilter={legendFilter} onFilterChange={setLegendFilter} />

      <DataTable
        carName={currentCarName}
        rows={currentCarRows}
        fileNames={fileNames}
        isFile4Uploaded={isFile4Uploaded}
        onFinalValueChange={handleFinalValueChange}
        onCellValueChange={handleCellValueChange}
        searchValue={searchValue}
        legendFilter={legendFilter}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {isSaveModalOpen && (
        <SaveModal
          carName={currentCarName}
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          onSave={handleSaveData}
          mode={mode}
          comparisonStateData={comparisonStateData}
        />
      )}

      {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExportSubmit}
          comparisonStateData={comparisonStateData}
        />
      )}

      <LoadingOverlay isVisible={isLoading} />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
