import React from 'react';
import { Scenario } from "../type/scenario.ts";
import {useQuery} from "react-query";
import {scenarioService} from "../service/scenarioService.ts";
import {MetaDataStats} from "./MetaDataStats.tsx";

interface DashboardOverviewProps {
    scenario: Scenario;
}

export function DashboardOverview({ scenario }: DashboardOverviewProps) {

    const { isLoading, isError, data } = useQuery({
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
            <h2 className="text-2xl font-bold mb-4">Scenario Overview</h2>
            <div className="flex space-x-4">
                <MetaDataStats  title={"Total Travel Time"} data={String(scenario.vehicles.reduce((total, vehicle) => total + vehicle.distanceTravelled, 0))}/>
                <MetaDataStats  title={"Total Number of Trips"} data={String(scenario.vehicles.reduce((total, vehicle) => total + vehicle.numberOfTrips, 0))}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {/* Basic Details */}
                <div>
                    <h3 className="text-lg font-semibold">Details</h3>
                    <p><span className="font-medium">Status:</span> {scenario.status}</p>
                    <p><span className="font-medium">Start Time:</span> {scenario.startTime}</p>
                    <p><span className="font-medium">End Time:</span> {scenario.endTime}</p>
                </div>

                {/* Vehicle and Customer Counts */}
                <div>
                    <h3 className="text-lg font-semibold">Summary</h3>
                    <p><span className="font-medium">Vehicles:</span> {scenario.vehicles.length}</p>
                    <p><span className="font-medium">Customers:</span> {scenario.customers.length}</p>
                </div>
            </div>

            {/* Vehicle Data Table */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Vehicle Data</h3>
                <table className="w-full text-left border-collapse border border-gray-200">
                    <thead>
                    <tr>
                        <th className="border border-gray-200 px-4 py-2">ID</th>
                        <th className="border border-gray-200 px-4 py-2">Total Travel Time</th>
                        <th className="border border-gray-200 px-4 py-2">Total Trips</th>
                        <th className="border border-gray-200 px-4 py-2">Travel Times</th>
                    </tr>
                    </thead>
                    <tbody>
                    {scenario.vehicles.map((vehicle) => (
                        <tr key={vehicle.id}>
                            <td className="border border-gray-200 px-4 py-2">{vehicle.id}</td>
                            <td className="border border-gray-200 px-4 py-2">{vehicle.vehicleSpeed}</td>
                            <td className="border border-gray-200 px-4 py-2">{vehicle.isAvailable}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DashboardOverview;
