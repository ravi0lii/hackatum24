import { Scenario } from "../type/scenario.ts";
import {useQuery} from "react-query";
import {scenarioService} from "../service/scenarioService.ts";
import {MetaDataStats} from "./MetaDataStats.tsx";
import CopyButton from "./CopyButton.tsx";

interface DashboardOverviewProps {
    scenario: Scenario;
}

export function DashboardOverview({ scenario }: DashboardOverviewProps) {

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
            {/**/}
        </div>
    );
}

export default DashboardOverview;
