import LeftPanel from "./components/LeftPanel.tsx";
import { useState } from "react";
import { Scenario } from "./type/scenario.ts";
import {DashboardOverview} from "./components/DashboardOverview.tsx";

function App() {
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

    return (
        <>
            {/* Vertical Layout */}
            <div className="flex flex-col h-screen w-screen">
                <div className="flex flex-grow">
                    <LeftPanel setSelectedScenario={setSelectedScenario} />
                    <div className="flex-grow bg-gray-50 flex items-center justify-center">
                        {selectedScenario ? (
                            <DashboardOverview scenario={selectedScenario}
                                               setSelectedScenario={setSelectedScenario} />
                        ) : (
                            <h1 className="text-2xl font-bold">Dashboard Content</h1>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;