import { useState } from 'react';
import {ProgressBar} from "./ProgressBar.tsx";

export function CarTab({ scenario }) {
    const [selectedCar, setSelectedCar] = useState(null); // State to track the selected car

    return (
        <>
            <h3 className="text-lg font-semibold mb-2">Cars</h3>
            <div className="flex space-x-4">
                {/* Left Panel: List of Cars */}
                <div className="w-1/2">
                    <ul className="space-y-2">
                        {scenario.vehicles.map((vehicle) => (
                            <li
                                key={vehicle.id}
                                onClick={() => setSelectedCar(vehicle)}
                                className={`p-4 bg-gray-100 rounded-md shadow-md flex justify-between cursor-pointer hover:bg-gray-200 ${
                                    selectedCar?.id === vehicle.id ? 'bg-gray-300' : ''
                                }`}
                            >
                                <span>ID: {vehicle.isAvailable}</span>
                                <span>Trips: {vehicle.numberOfTrips}</span>
                                <span>Active Time: {vehicle.activeTime} min</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Panel: Selected Car Details */}
                <div className="w-1/2 bg-gray-50 p-4 rounded-md shadow-md">
                    {selectedCar ? (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Car Details</h3>
                            <p><strong>ID:</strong> {selectedCar.id}</p>
                            <p><strong>Trips:</strong> {selectedCar.numberOfTrips}</p>
                            <p><strong>Active Time:</strong> {selectedCar.activeTime} min</p>
                            <p><strong>Location:</strong> ({selectedCar.coordX}, {selectedCar.coordY})</p>
                            <p><strong>Destination:</strong> ({selectedCar.destinationX}, {selectedCar.destinationY})
                            </p>

                            {/* Progress Bar */}
                            <ProgressBar selectedCar={selectedCar} scenario={scenario} />
                        </div>
                    ) : (
                        <p className="text-gray-600">Select a car to see details.</p>
                    )}
                </div>
            </div>
        </>
    );
}
