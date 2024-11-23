import ScenarioCard from './ScenarioCard.tsx';
import {useQuery} from "react-query";
import {scenarioService} from "../service/scenarioService.ts";

export function LeftPanel() {

    const { isLoading, isError, data } = useQuery({
        queryKey: ['allScenarios'],
        queryFn: scenarioService.getAllScenarios,
    })

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: Failed to fetch users</div>;
    }

    return (
        <div className="w-64 h-full bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Scenarios</h2>
            <div className="flex flex-col gap-4">
        <ul>
        </ul>
        {data?.map((scenario) => (
            <li key={scenario.id} className='list-none'><ScenarioCard
                name={scenario.status}
                customerCount={scenario.customers.length}
                vehicleCount={scenario.vehicles.length}
            /></li>
        ))}
            </div>
        </div>
        )
}

export default LeftPanel;
