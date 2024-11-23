import { Scenario } from "../type/scenario.ts";
import {useQuery} from "react-query";
import {scenarioService} from "../service/scenarioService.ts";
import {MetaDataStats} from "./MetaDataStats.tsx";
import CopyButton from "./CopyButton.tsx";
import {useState} from "react";

interface DashboardOverviewProps {
    scenario: Scenario;
}

export function DashboardOverview({ scenario }: DashboardOverviewProps) {

    const [activeTab, setActiveTab] = useState<"cars" | "customers">("cars"); // Manage active tab

    // TODO i dont think this query is used RIGHT NOW
    const { isLoading, isError } = useQuery({
        queryKey: ['scenarioData', scenario.id], // Use dynamic ID
        queryFn: ({ queryKey }) => {
            const [, id] = queryKey;
            return scenarioService.getScenarioById(id as string);
        },
        refetchInterval: 5000,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: Failed to fetch scenarios</div>;
    }

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg w-full h-full">
            <div className="flex items-start">
                <h2 className="text-2xl font-bold mb-4">Scenario Overview</h2>
                <CopyButton valueToCopy={scenario.id}></CopyButton>
            </div>

            <div className="flex space-x-4">
                <MetaDataStats  title={"Total Travel Time"} data={String(scenario.vehicles.reduce((total, vehicle) => total + vehicle.distanceTravelled, 0))}/>
                <MetaDataStats  title={"Total Number of Trips"} data={String(scenario.vehicles.reduce((total, vehicle) => total + vehicle.numberOfTrips, 0))}/>
            </div>
            {/* Tab System */}
            <div className="mt-4">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-4">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            activeTab === "cars"
                                ? "text-gray-500 border-b-2 border-pink-500"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("cars")}
                    >
                        Cars
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            activeTab === "customers"
                                ? "text-gray-500 border-b-2 border-pink-500"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("customers")}
                    >
                        Customers
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "cars" && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Cars</h3>
                        <ul className="space-y-2">
                            {scenario.vehicles.map((vehicle) => (
                                <li
                                    key={vehicle.id}
                                    className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between"
                                >
                                    <span>ID: {vehicle.id}</span>
                                    <span>Trips: {vehicle.numberOfTrips}</span>
                                    <span>Distance: {vehicle.distanceTravelled} km</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === "customers" && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Customers</h3>
                        <ul className="space-y-2">
                            {scenario.customers.map((customer) => (
                                <li
                                    key={customer.id}
                                    className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between"
                                >
                                    <span>ID: {customer.id}</span>
                                    <span>Location: ({customer.coordX}, {customer.coordY})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>        </div>
    );
}

export default DashboardOverview;
