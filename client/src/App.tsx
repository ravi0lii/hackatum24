import LeftPanel from "./components/LeftPanel.tsx";
import { useState } from "react";
import { Scenario } from "./type/scenario.ts";
import {DashboardOverview} from "./components/DashboardOverview.tsx";

function App() {
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

    return (
        <div className="flex h-screen w-screen">
            <LeftPanel setSelectedScenario={setSelectedScenario} />
            <div className="flex-grow bg-gray-50 flex items-center justify-center">
                {selectedScenario ? (
                    <div>
                        <DashboardOverview scenario={selectedScenario}></DashboardOverview>
                    </div>
                ) : (
                    <h1 className="text-2xl font-bold">Dashboard Content</h1>
                )}
            </div>
        </div>
    );
}

export default App;
