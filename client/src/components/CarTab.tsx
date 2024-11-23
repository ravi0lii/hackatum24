import { useState } from 'react';
import {ProgressBar} from "./ProgressBar.tsx";
import {AvailabilityTag} from "./AvailabilityTag.tsx";
import {Scenario} from "../type/scenario.ts";

interface CarTabProps {
    scenario: Scenario
    scenarioSelectedId: string
    remainingTravelTime: [string, number,number, number][]
}

export function CarTab({ scenario,scenarioSelectedId, remainingTravelTime } : CarTabProps) {
    const [selectedCar, setSelectedCar] = useState<Vehicle| null>(null); // State to track the selected car

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
                                <span>Car</span>
                                <span>Total Trips: {vehicle.numberOfTrips}</span>
                                <AvailabilityTag isAvailable={vehicle.isAvailable as boolean}/>
                            </li>
                        ))}
                    </ul>
                </div>

                {
                    scenarioSelectedId === scenario.id ? (
                            <div className="w-1/2 bg-gray-50 p-4 rounded-md relative">
                                {selectedCar ? (
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold mb-4">Car Details</h3>
                                            <AvailabilityTag isAvailable={selectedCar.isAvailable}/>

                                        </div>
                                        <p><strong>Distance
                                            Travelled:</strong> {Math.round(selectedCar.distanceTravelled) / 1000} km</p>
                                        <p><strong>Total Trips:</strong> {selectedCar.numberOfTrips}</p>
                                        <p><strong>Active Time:</strong> {Math.round(selectedCar.activeTime / 60)} min</p>
                                        <p><strong>Location:</strong> ({selectedCar.coordX}, {selectedCar.coordY})</p>

                                        <ProgressBar selectedCar={selectedCar} scenario={scenario}
                                                     remainingTravelTime={remainingTravelTime}/>
                                    </div>
                                ) : (
                                    <p className="text-gray-600">Select a car to see details.</p>
                                )}
                            </div>
                        ) :
                        <p className="text-gray-600">Select a car to see details.</p>
                }


            </div>
        </>
    );
}
