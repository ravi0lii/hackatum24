import { Scenario } from "../type/scenario.ts";
import {useQuery} from "react-query";
import {scenarioService} from "../service/scenarioService.ts";
import {MetaDataStats} from "./MetaDataStats.tsx";
import CopyButton from "./CopyButton.tsx";
import {useEffect, useState} from "react";
import {CarTab} from "./CarTab.tsx";
import {CustomerTab} from "./CustomerTab.tsx";
import {ClockIcon, TruckIcon} from "@heroicons/react/16/solid";
import {GraphTab} from "./GraphTab.tsx";

interface DashboardOverviewProps {
    scenario: Scenario;
    scenarioSelectedId: string
    setSelectedScenario: (selectedScenario: Scenario) => void;
    remainingTravelTime: [string, number, number, number][]
}

export function DashboardOverview({ scenario, scenarioSelectedId, setSelectedScenario, remainingTravelTime }: DashboardOverviewProps) {

    const [activeTab, setActiveTab] = useState<"cars" | "customers" | "graph">("cars");

    const { isLoading, isError, data } = useQuery({
        queryKey: ['scenarioData', scenario.id],
        queryFn: ({ queryKey }) => {
            const [, id] = queryKey;
            return scenarioService.getScenarioById(id as string);
        },
        refetchInterval: 50,
    });

    useEffect(() => {
        if (data) {
            setSelectedScenario(data);
        }
    }, [data, setSelectedScenario]);

    if (isLoading) {
        return (<div className="flex items-start">
            <h2 className="text-2xl font-bold mb-4">Scenario Overview</h2>
            <CopyButton valueToCopy={scenario.id}></CopyButton>
        </div>)
    }

    if (isError) {
        return <div>Error: Unable to fetch scenario data</div>;
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
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            activeTab === "graph"
                                ? "text-gray-500 border-b-2 border-pink-500"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("graph")}
                    >
                        Graph
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "cars" && (
                    <CarTab scenario={scenario} scenarioSelectedId={scenarioSelectedId}
                            remainingTravelTime={remainingTravelTime}/>
                )}

                {activeTab === "customers" && (
                    <CustomerTab scenario={scenario} scenarioSelectedId={scenarioSelectedId}/>
                )}
                {activeTab === "graph" && (
                    <GraphTab scenario={scenario} remainingTravelTime={remainingTravelTime}/>
                )}
            </div>
        </div>
        </div>
    );
}

export default DashboardOverview;
