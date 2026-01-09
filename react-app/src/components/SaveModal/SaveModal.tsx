import { useEffect, useState } from "react";
import "./SaveModal.css";
import { apiRequest } from "../../api/api";
import type { ComparisonState } from "../../types";

interface SaveModalProps {
  carName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (country: string, brand: string, model: string) => void;
  mode: "upload" | "user";
  comparisonStateData: ComparisonState;
}

const SaveModal: React.FC<SaveModalProps> = ({
  carName,
  isOpen,
  onClose,
  onSave,
  mode,
  comparisonStateData,
}) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);

  const [carData, setCarData] = useState<{ brand: string; model: string }>({
    brand: "",
    model: "",
  });

  const handleSave = () => {
    if (!selectedCountry) {
      alert("Please select a country");
      return;
    }
    onSave(selectedCountry, carData.brand, carData.model);
    setSelectedCountry("");
  };

  const handleClose = () => {
    setSelectedCountry("");

    onClose();
  };

  if (!isOpen) return null;

  const getData = async () => {
    try {
      setIsLoadingCountries(true);
      const response = await apiRequest({
        method: "GET",
        url: "/api/v1/countries/newLeasingCountryWiseLists",
      });
      // Update countries if API returns data
      if (response.data) {
        setCountries(Object.keys(response.data).map((i) => i));
      }
    } catch (error) {
      console.error("Error loading countries:", error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (comparisonStateData && mode === "user") {
      setSelectedCountry(comparisonStateData.country);
      setCarData({
        brand: comparisonStateData.brand,
        model: comparisonStateData.model,
      });
    }
  }, [comparisonStateData, mode]);

  useEffect(() => {
    // TODO: here just want to split first space first word will brand and other model
    if (!carName) return;
    const brand = carName.split(" ")[0];
    const model = carName.split(" ").slice(1).join(" ");
    setCarData({ brand, model });
  }, [carName]);

  const onSelectCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  return (
    <div className="save-modal-overlay" onClick={handleClose}>
      <div className="save-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="save-modal-header">
          <h2>{mode === "upload" ? "Save" : "Update"} Table Data</h2>
          <button
            className="save-modal-close p-0 !text-white"
            onClick={handleClose}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="save-modal-body">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-blue-800 text-sm leading-relaxed">
              {mode === "upload"
                ? "Select a country and confirm car brand and model before saving data."
                : "Please verify or change the car brand and model before updating data."}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="save-modal-field">
              <label htmlFor="country-select">Country</label>
              <select
                id="country-select"
                value={selectedCountry}
                onChange={onSelectCountry}
                className="save-modal-select"
                disabled={isLoadingCountries}
              >
                <option value="">
                  {isLoadingCountries
                    ? "-- Loading countries... --"
                    : "-- Select a country --"}
                </option>
                {!isLoadingCountries &&
                  countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
              </select>
            </div>
            <div className="save-modal-field">
              <label htmlFor="brand-input">Brand</label>
              <input
                id="brand-input"
                value={carData.brand}
                className="save-modal-select"
                onChange={(e) =>
                  setCarData({ ...carData, brand: e.target.value })
                }
              />
            </div>
            <div className="save-modal-field">
              <label htmlFor="model-input">Model</label>
              <input
                id="model-input"
                className="save-modal-select"
                value={carData.model}
                onChange={(e) =>
                  setCarData({ ...carData, model: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="save-modal-footer">
          <button
            className="save-modal-btn save-modal-btn-cancel"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="save-modal-btn save-modal-btn-save"
            onClick={handleSave}
            disabled={!selectedCountry}
          >
            {mode === "upload" ? "Save Data" : "Update Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;
