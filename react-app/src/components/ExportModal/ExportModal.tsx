import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import { toast } from "sonner";
import type { ComparisonState } from "../../types";
import { InfoIcon, CloseIcon, CopyIcon, CheckIcon, XIcon } from "./icons";
import "./ExportModal.css";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (country: string, carBrand: string, carModel: string) => void;
  comparisonStateData: ComparisonState;
}

interface Country {
  _id: string;
  name: string;
}

interface Car {
  _id: string;
  name: string;
}

interface CarModel {
  _id: string;
  name: string;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  comparisonStateData,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCars, setIsLoadingCars] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const [showAddCar, setShowAddCar] = useState(false);
  const [showAddModel, setShowAddModel] = useState(false);
  const [newCarName, setNewCarName] = useState("");
  const [newModelName, setNewModelName] = useState("");

  const fetchCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const response = await apiRequest({
        method: "GET",
        url: "/api/v1/comparison-tool/get-countries",
      });
      setCountries(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load countries";
      toast.error(errorMessage);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const fetchCars = async () => {
    setIsLoadingCars(true);
    try {
      const response = await apiRequest({
        method: "GET",
        url: `/api/v1/comparison-tool/get-brands?countryId=${selectedCountry}`,
      });
      setCars(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load cars";
      toast.error(errorMessage);
    } finally {
      setIsLoadingCars(false);
    }
  };

  const fetchModels = async () => {
    setIsLoadingModels(true);
    try {
      const response = await apiRequest({
        method: "GET",
        url: `/api/v1/comparison-tool/get-models?brandId=${selectedCar}`,
      });
      setCarModels(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load models";
      toast.error(errorMessage);
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Fetch countries on mount and auto-select if data exists
  useEffect(() => {
    if (!isOpen) return;

    fetchCountries();
  }, [isOpen]);

  // Auto-select country after countries are fetched
  useEffect(() => {
    if (countries.length === 0 || !comparisonStateData.country) return;

    const matchingCountry = countries.find(
      (c) => c.name.toLowerCase() === comparisonStateData.country.toLowerCase()
    );

    if (matchingCountry && !selectedCountry) {
      setSelectedCountry(matchingCountry._id);
    }
  }, [countries, comparisonStateData.country]);

  // Fetch cars when country changes
  useEffect(() => {
    if (!selectedCountry) {
      setCars([]);
      setSelectedCar("");
      return;
    }

    fetchCars();
  }, [selectedCountry]);

  // Auto-select car after cars are fetched
  useEffect(() => {
    if (cars.length === 0 || !comparisonStateData.brand) return;

    const matchingCar = cars.find(
      (c) => c.name.toLowerCase() === comparisonStateData.brand.toLowerCase()
    );

    if (matchingCar && !selectedCar) {
      setSelectedCar(matchingCar._id);
    }
  }, [cars, comparisonStateData.brand]);

  // Fetch models when car changes
  useEffect(() => {
    if (!selectedCar) {
      setCarModels([]);
      setSelectedModel("");
      return;
    }

    fetchModels();
  }, [selectedCar]);

  // Auto-select model after models are fetched
  useEffect(() => {
    if (carModels.length === 0 || !comparisonStateData.model) return;

    const matchingModel = carModels.find(
      (m) => m.name.toLowerCase() === comparisonStateData.model.toLowerCase()
    );

    if (matchingModel && !selectedModel) {
      setSelectedModel(matchingModel._id);
    }
  }, [carModels, comparisonStateData.model]);

  const handleAddCar = async () => {
    if (!newCarName.trim()) {
      toast.error("Please enter a car name");
      return;
    }

    try {
      const response = await apiRequest({
        method: "POST",
        url: "/api/v1/comparison-tool/add-brand",
        data: { brandName: newCarName, countryId: selectedCountry },
      });

      setCars([...cars, response.data]);
      setSelectedCar(response.data._id);
      setNewCarName("");
      setShowAddCar(false);
      toast.success("Car added successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add car";
      toast.error(errorMessage);
    }
  };

  const handleAddModel = async () => {
    if (!newModelName.trim()) {
      toast.error("Please enter a model name");
      return;
    }

    try {
      const response = await apiRequest({
        method: "POST",
        url: "/api/v1/comparison-tool/add-model",
        data: { modelName: newModelName, brandId: selectedCar },
      });

      setCarModels([...carModels, response.data]);
      setSelectedModel(response.data._id);
      setNewModelName("");
      setShowAddModel(false);
      toast.success("Model added successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add model";
      toast.error(errorMessage);
    }
  };

  const handleExport = () => {
    if (!selectedCountry || !selectedCar || !selectedModel) {
      toast.error("Please select all fields");
      return;
    }

    onExport(selectedCountry, selectedCar, selectedModel);

    // Reset all values after successful export
    setSelectedCountry("");
    setSelectedCar("");
    setSelectedModel("");
    setShowAddCar(false);
    setShowAddModel(false);
    setNewCarName("");
    setNewModelName("");
  };

  const handleClose = () => {
    // Only reset "add new" states, keep dropdown selections
    setShowAddCar(false);
    setShowAddModel(false);
    setNewCarName("");
    setNewModelName("");
    onClose();
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Export to Database</h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <InfoIcon className="text-blue-500 flex-shrink-0 mt-0.5 w-5 h-5" />
            <div className="flex-1">
              <p className="text-blue-800 text-sm leading-relaxed mb-3">
                Select the target country, car brand, and model for exporting to
                the database.
              </p>
              {comparisonStateData &&
                (comparisonStateData.country ||
                  comparisonStateData.brand ||
                  comparisonStateData.model) && (
                  <div className="bg-white border border-blue-300 rounded-md p-3 mt-2">
                    <p className="text-xs font-semibold text-blue-900 mb-2">
                      Current Car Data:
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="font-medium text-gray-600">
                          Country:
                        </span>
                        <p className="text-gray-900 font-semibold">
                          {comparisonStateData.country || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Brand:
                        </span>
                        <div className="flex items-center gap-1">
                          <p className="text-gray-900 font-semibold">
                            {comparisonStateData.brand || "N/A"}
                          </p>
                          {comparisonStateData.brand && (
                            <div className="relative group">
                              <button
                                onClick={() =>
                                  handleCopy(comparisonStateData.brand, "Brand")
                                }
                                className="p-1 hover:bg-blue-100 rounded transition-colors"
                                style={{
                                  background: "transparent",
                                  border: "none",
                                }}
                              >
                                <CopyIcon className="w-3 h-3 text-blue-600" />
                              </button>
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Copy brand
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Model:
                        </span>
                        <div className="flex items-center gap-1">
                          <p className="text-gray-900 font-semibold">
                            {comparisonStateData.model || "N/A"}
                          </p>
                          {comparisonStateData.model && (
                            <div className="relative group">
                              <button
                                onClick={() =>
                                  handleCopy(comparisonStateData.model, "Model")
                                }
                                className="p-1 hover:bg-blue-100 rounded transition-colors"
                                style={{
                                  background: "transparent",
                                  border: "none",
                                }}
                              >
                                <CopyIcon className="w-3 h-3 text-blue-600" />
                              </button>
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Copy model
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Country Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              disabled={isLoadingCountries}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">
                {isLoadingCountries
                  ? "Loading countries..."
                  : "Select a country"}
              </option>
              {countries.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Car Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Car Brand <span className="text-red-500">*</span>
            </label>
            {!showAddCar ? (
              <div className="flex gap-2">
                <select
                  value={selectedCar}
                  onChange={(e) => setSelectedCar(e.target.value)}
                  disabled={!selectedCountry || isLoadingCars}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {isLoadingCars ? "Loading cars..." : "Select a car brand"}
                  </option>
                  {cars.map((car) => (
                    <option key={car._id} value={car._id}>
                      {car.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowAddCar(true)}
                  disabled={!selectedCountry}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  + Add New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCarName}
                  onChange={(e) => setNewCarName(e.target.value)}
                  placeholder="Enter car brand name"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                />
                <button
                  onClick={handleAddCar}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                  title="Save"
                >
                  <CheckIcon />
                </button>
                <button
                  onClick={() => {
                    setShowAddCar(false);
                    setNewCarName("");
                  }}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  title="Cancel"
                >
                  <XIcon />
                </button>
              </div>
            )}
          </div>

          {/* Model Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Car Model <span className="text-red-500">*</span>
            </label>
            {!showAddModel ? (
              <div className="flex gap-2">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedCar || isLoadingModels}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {isLoadingModels
                      ? "Loading models..."
                      : "Select a car model"}
                  </option>
                  {carModels.map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowAddModel(true)}
                  disabled={!selectedCar}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  + Add New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  placeholder="Enter car model name"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                />
                <button
                  onClick={handleAddModel}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                  title="Save"
                >
                  <CheckIcon />
                </button>
                <button
                  onClick={() => {
                    setShowAddModel(false);
                    setNewModelName("");
                  }}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  title="Cancel"
                >
                  <XIcon />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={!selectedCountry || !selectedCar || !selectedModel}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            Export to Database
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
