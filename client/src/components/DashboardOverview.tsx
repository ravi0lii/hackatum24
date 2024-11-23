import { Scenario } from "../type/scenario.ts";
import {useQuery} from "react-query";
import {scenarioService} from "../service/scenarioService.ts";
import {MetaDataStats} from "./MetaDataStats.tsx";
import CopyButton from "./CopyButton.tsx";
import {useState} from "react";
import {CarTab} from "./CarTab.tsx";
import {CustomerTab} from "./CustomerTab.tsx";
import {ClockIcon, TruckIcon} from "@heroicons/react/16/solid";

interface DashboardOverviewProps {
    scenario: Scenario;
    setSelectedScenario: (selectedScenario: Scenario) => void;
}

export function DashboardOverview({ scenario, setSelectedScenario }: DashboardOverviewProps) {

    const [activeTab, setActiveTab] = useState<"cars" | "customers">("cars");

    const { isLoading, isError, data } = useQuery({
        queryKey: ['scenarioData', scenario.id],
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
        setSelectedScenario(scenario)
    }

    if (data) {
        setSelectedScenario(data)
    }

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <div className="flex items-start">
                <h2 className="text-2xl font-bold mb-4">Scenario Overview</h2>
                <CopyButton valueToCopy={scenario.id}></CopyButton>
            </div>

        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Scenario Overview</h2>
            <div className="flex space-x-4">
                <MetaDataStats  title={"Total Travel Time"} data={String(scenario.vehicles.reduce((total, vehicle) => Math.round((total + vehicle.distanceTravelled)/60), 0))}
                Icon={ClockIcon}/>
                <MetaDataStats  title={"Total Number of Trips"} data={String(scenario.vehicles.reduce((total, vehicle) => total + vehicle.numberOfTrips, 0))}
                Icon={TruckIcon}/>
            </div>
            {/* Tab System */}
            <div className="mt-4">
                {/* Tabs */}
                <div className="flex border-b mb-4">
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
                    <CarTab scenario={scenario} />
                )}

                {activeTab === "customers" && (
                    <CustomerTab scenario={scenario}/>
                )}
            </div>
        </div>
        </div>
    );
}

export default DashboardOverview;
