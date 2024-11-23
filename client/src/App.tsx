import LeftPanel from "./components/LeftPanel.tsx";
import { useState } from "react";
import { Scenario } from "./type/scenario.ts";
import {DashboardOverview} from "./components/DashboardOverview.tsx";
import {Instructions} from "./components/Instructions.tsx";

function App() {
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

    return (
        <>
            {/* Vertical Layout */}
            <div className="flex flex-col h-screen w-screen">
                <div className="flex flex-grow">
                {/* Main Content Area: LeftPanel and Dashboard Content */}
                <div className="flex flex-grow overflow-hidden">
                    <LeftPanel setSelectedScenario={setSelectedScenario} />
                    <div className="flex-grow bg-gray-50 p-6 overflow-auto">
                        {selectedScenario ? (
                            <DashboardOverview scenario={selectedScenario}
                                               setSelectedScenario={setSelectedScenario} />
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