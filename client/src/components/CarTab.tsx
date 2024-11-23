import { useState } from 'react';

export function CarTab({ scenario }) {
    const [selectedCar, setSelectedCar] = useState(null); // State to track the selected car

    const calculateProgress = (car, customer) => {
        const distanceToCustomer = Math.sqrt(
            Math.pow(customer.coordX - car.coordX, 2) + Math.pow(customer.coordY - car.coordY, 2)
        );
        const totalDistance = Math.sqrt(
            Math.pow(customer.coordX - car.destinationX, 2) + Math.pow(customer.coordY - car.destinationY, 2)
        );
        return (distanceToCustomer / totalDistance) * 100;
    };

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
                            <div className="mt-6">
                                <h4 className="text-md font-semibold mb-2">Progress</h4>
                                <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-blue-500 transition-all"
                                        style={{
                                            width: `${calculateProgress(selectedCar, scenario.customers[0])}%`
                                        }}
                                    ></div>
                                    <div
                                        className="absolute inset-0 flex justify-between text-xs text-gray-700 font-medium px-2">
                                        <span>Car ({selectedCar.coordX}, {selectedCar.coordY})</span>
                                        <span>Customer ({scenario.customers[0].coordX}, {scenario.customers[0].coordY})</span>
                                        <span>Destination ({selectedCar.destinationX}, {selectedCar.destinationY})</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-600">Select a car to see details.</p>
                    )}
                </div>
            </div>
        </>
    );
}
