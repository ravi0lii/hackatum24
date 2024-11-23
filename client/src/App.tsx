import LeftPanel from "./components/LeftPanel.tsx";
import {useEffect, useRef, useState} from "react";
import { Scenario } from "./type/scenario.ts";
import {DashboardOverview} from "./components/DashboardOverview.tsx";
import {Instructions} from "./components/Instructions.tsx";
import "leaflet/dist/leaflet.css";

function App() {
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    let vehicleRemainingTravelTime = useRef<[string, number, number, number][]>([]); // vehicle id, current, total, prev

    const handleSetScenario = (scenario) => setSelectedScenario(scenario)

    useEffect(() => {
        if (selectedScenario) {
            selectedScenario.vehicles.forEach((vehicle) => {
                const existingIndex = vehicleRemainingTravelTime.current.findIndex(
                    (item) => item[0] === vehicle.id
                );

                if (existingIndex >= 0) {
                    // Get the current tuple for the vehicle
                    const currentTuple = vehicleRemainingTravelTime.current[existingIndex];

                    // Update the previous remaining time (4th element)
                    currentTuple[3] = currentTuple[1];

                    // Update the current remaining time (2nd element)
                    currentTuple[1] = vehicle.remainingTravelTime;

                    // If the current remaining time increases, update the total remaining time (3rd element)
                    if (vehicle.remainingTravelTime > currentTuple[3]) {
                        currentTuple[2] = vehicle.remainingTravelTime;
                    }

                    // Reflect the changes back into the array
                    vehicleRemainingTravelTime.current[existingIndex] = currentTuple;
                } else {
                    // Add a new entry for vehicles not already in the list
                    vehicleRemainingTravelTime.current.push([
                        vehicle.id,
                        vehicle.remainingTravelTime, // Current remaining time
                        vehicle.remainingTravelTime, // Total remaining time starts as current time
                        vehicle.remainingTravelTime, // Previous remaining time starts as current time
                    ]);
                }
            });

        }
    }, [selectedScenario]); // Re-run whenever selectedScenario changes



    return (
        <>
            {/* Vertical Layout */}
            <div className="flex flex-col h-screen w-screen">
                <div className="flex flex-grow">
                {/* Main Content Area: LeftPanel and Dashboard Content */}
                <div className="flex flex-grow overflow-hidden">
                    <LeftPanel setSelectedScenario={handleSetScenario} />
                    <div className="flex-grow bg-gray-50 p-6 overflow-auto">
                        {selectedScenario ? (
                            <DashboardOverview scenario={selectedScenario}
                                               setSelectedScenario={handleSetScenario}
                                                remainingTravelTime={vehicleRemainingTravelTime.current}
                                               scenarioSelectedId={selectedScenario.id}/>
                        ) : (
                            <div><h1 className="text-2xl font-bold">Welcome</h1>
                                <Instructions/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default App;