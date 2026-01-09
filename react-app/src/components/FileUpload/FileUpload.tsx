import React, { useState, useRef } from "react";
import type { FileData, CarFeaturesOrder } from "../../types";
import {
  isCSV,
  isExcel,
  readFileAsText,
  readFileAsArrayBuffer,
  parseMultiColumnCSV,
  parseExcel,
} from "../../utils/fileParser";
import "./FileUpload.css";

interface FileUploadProps {
  onFilesProcessed: (
    fileData: FileData[],
    carFeaturesOrder: CarFeaturesOrder,
    allCars: { _id: string; carName: string }[],
    fileNames: string[],
    isFile4Uploaded: boolean
  ) => void;
  onReset: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesProcessed,
  onReset,
}) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const handleFileChange = (index: number) => {
    const fileInput = fileInputRefs.current[index];
    if (fileInput?.files?.[0]) {
      const newName = fileInput.files[0].name;
      setFileNames((prev) => {
        const updated = [...prev];
        updated[index] = newName;
        return updated;
      });
    }
  };

  const handleProcessFiles = async () => {
    const files = fileInputRefs.current.map((ref) => ref?.files?.[0] || null);

    if (!files[0] || !files[1] || !files[2]) {
      alert(
        "Please upload at least three CSV or Excel files (File1, File2, File3)."
      );
      return;
    }

    const isFile4Uploaded = !!files[3];

    // Initialize data structures
    const fileData: FileData[] = [{}, {}, {}, {}];
    const carFeaturesOrder: CarFeaturesOrder = {};

    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;

        if (isCSV(file.name)) {
          const text = await readFileAsText(file);
          parseMultiColumnCSV(text, i, fileData, carFeaturesOrder);
        } else if (isExcel(file.name)) {
          const arrayBuffer = await readFileAsArrayBuffer(file);
          parseExcel(arrayBuffer, i, fileData, carFeaturesOrder);
        } else {
          alert(
            `Unsupported file format: ${file.name}. Please upload CSV or Excel files.`
          );
          return;
        }
      }

      const allCars = Object.keys(carFeaturesOrder).map((key) => ({
        _id: String(key),
        carName: key,
      }));

      // Notify parent component
      onFilesProcessed(
        fileData,
        carFeaturesOrder,
        allCars,
        fileNames,
        isFile4Uploaded
      );
    } catch (error) {
      console.error("Error processing files:", error);
      alert(
        "Error processing files. Please check the file format and try again."
      );
    }
  };

  const handleReset = () => {
    // Clear file inputs
    fileInputRefs.current.forEach((ref) => {
      if (ref) ref.value = "";
    });

    // Reset file names
    setFileNames([]);

    // Call parent reset
    onReset();
  };

  return (
    <>
      <div className="upload-section">
        {[0, 1, 2, 3].map((index) => (
          <label key={index}>
            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              ref={(el) => {
                fileInputRefs.current[index] = el;
              }}
              onChange={() => handleFileChange(index)}
            />
            <span>
              File {index + 1}{" "}
              {index === 3 ? "(Optional)" : index === 0 ? "(Original)" : ""}
            </span>
          </label>
        ))}
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={handleProcessFiles}>Upload & Compare</button>
        <button onClick={handleReset} style={{ marginLeft: "10px" }}>
          Reset Data
        </button>
      </div>
    </>
  );
};

export default FileUpload;
