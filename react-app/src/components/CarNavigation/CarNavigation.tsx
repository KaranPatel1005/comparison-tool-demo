import React, { useEffect } from "react";
import { toast } from "sonner";
import "./CarNavigation.css";
import { cn } from "../../utils/utils";

interface CarNavigationProps {
  allCars: { _id: string; carName: string }[];
  currentCarIndex: number;
  onCarChange: (index: number) => void;
  users: { _id: string; name: string }[];
  selectedUserId: string;
  onUserChange: (userId: string) => void;
  usersLoading: boolean;
  usersError: string | null;
  mode: "upload" | "user";
  onReset: () => void;
}

const CarNavigation: React.FC<CarNavigationProps> = ({
  allCars,
  currentCarIndex,
  onCarChange,
  users,
  selectedUserId,
  onUserChange,
  usersLoading,
  usersError,
  mode,
  onReset,
}) => {
  // Show error toast when there's an error
  useEffect(() => {
    if (usersError) {
      toast.error(`Failed to load users: ${usersError}`);
    }
  }, [usersError]);

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
    const selectedCar = e.target.value;
    // Find the index of the selected car
    const newIndex = allCars.findIndex((car) => car._id === selectedCar);

    if (newIndex !== -1) {
      onCarChange(newIndex);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUserChange(e.target.value);
  };

  // if (allCars.length === 0) {
  //   return null;
  // }

  return (
    <div className="flex gap-3 justify-center">
      <div className="car-navigation">
        {mode === "user" && (
          <div className="save-modal-field">
            <label htmlFor="user-select">Select User</label>
            <select
              id="user-select"
              value={selectedUserId}
              onChange={handleUserChange}
              disabled={usersLoading}
              className="save-modal-select"
              style={{ marginRight: "10px" }}
            >
              <option value="">
                {usersLoading ? "Loading users..." : "-- Select User --"}
              </option>
              {!usersLoading &&
                users &&
                users.length > 0 &&
                users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
            </select>
          </div>
        )}
        <button
          disabled={allCars.length === 0}
          onClick={handlePrevious}
          className={cn(allCars.length < 2 && "cursor-not-allowed opacity-50")}
        >
          Previous Car
        </button>
        <div className="save-modal-field">
          <label htmlFor="car-select">Select Car</label>
          <select
            id="car-select"
            value={allCars[currentCarIndex]?._id}
            className="save-modal-select"
            onChange={handleSelectChange}
          >
            <option value="">-- Select Car --</option>
            {allCars.map((car) => (
              <option key={car._id} value={car._id}>
                {car.carName}
              </option>
            ))}
          </select>
        </div>
        <button
          disabled={allCars.length === 0}
          onClick={handleNext}
          className={cn(allCars.length < 2 && "cursor-not-allowed opacity-50")}
        >
          Next Car
        </button>
        {mode === "user" && (
          <button
            className="export-btn"
            onClick={onReset}
            style={{ marginLeft: "10px" }}
          >
            Reset Data
          </button>
        )}
      </div>
    </div>
  );
};

export default CarNavigation;
