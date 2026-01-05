import React from 'react';
import './CarNavigation.css';

interface CarNavigationProps {
  allCars: string[];
  currentCarIndex: number;
  onCarChange: (index: number) => void;
}

const CarNavigation: React.FC<CarNavigationProps> = ({ allCars, currentCarIndex, onCarChange }) => {
  const handlePrevious = () => {
    if (allCars.length === 0) return;
    const newIndex = (currentCarIndex - 1 + allCars.length) % allCars.length;
    onCarChange(newIndex);
  };

  const handleNext = () => {
    if (allCars.length === 0) return;
    const newIndex = (currentCarIndex + 1) % allCars.length;
    onCarChange(newIndex);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIndex = parseInt(e.target.value, 10);
    onCarChange(newIndex);
  };

  if (allCars.length === 0) {
    return null;
  }

  return (
    <div className="car-navigation">
      <button onClick={handlePrevious}>Previous Car</button>
      <select value={currentCarIndex} onChange={handleSelectChange}>
        {allCars.map((car, index) => (
          <option key={index} value={index}>
            {car}
          </option>
        ))}
      </select>
      <button onClick={handleNext}>Next Car</button>
    </div>
  );
};

export default CarNavigation;
