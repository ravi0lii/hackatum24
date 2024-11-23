import ScenarioCard from './ScenarioCard.tsx';
import { useQuery } from "react-query";
import { scenarioService } from "../service/scenarioService.ts";
import { Scenario } from "../type/scenario.ts";
import {useState} from "react";

interface LeftPanelProps {
    setSelectedScenario: (scenario: Scenario) => void;
}

export function LeftPanel({ setSelectedScenario }: LeftPanelProps) {

    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);


    const { isLoading, isError, data } = useQuery({
        queryKey: ['allScenarios'],
        queryFn: scenarioService.getAllScenarios,
        refetchInterval: 5000,
    })

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: Failed to fetch scenarios</div>;
    }

    return (
        <div className="w-64 h-full bg-white-950 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold text-pink-500 mb-4">Scenarios</h2>
            <div className="flex flex-col gap-4">
                {data?.map((scenario) => (
                    <li
                        key={scenario.id}
                        className="list-none"
                        onClick={() => setSelectedScenario(scenario)}
                    >
                        <ScenarioCard
                            name={scenario.status}
                            customerCount={scenario.customers.length}
                            vehicleCount={scenario.vehicles.length}
                            isActive={selectedCardId === scenario.id}
                            onClick={() => setSelectedCardId(scenario.id)}
                        />
                    </li>
                ))}
            </div>
        </div>
    );
}

export default LeftPanel;
