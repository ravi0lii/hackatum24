import LeftPanel from "./components/LeftPanel.tsx";
import { useState } from "react";
import { Scenario } from "./type/scenario.ts";
import TopPanel from "./components/TopPanel.tsx";
import {DashboardOverview} from "./components/DashboardOverview.tsx";

function App() {
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

    return (
        <>
            {/* Vertical Layout */}
            <div className="flex flex-col h-screen w-screen">
                {/* TopPanel */}
                <TopPanel />

                {/* Main Content Area: LeftPanel and Dashboard Content */}
                <div className="flex flex-grow">
                    <LeftPanel setSelectedScenario={setSelectedScenario} />
                    <div className="flex-grow bg-gray-50 flex items-center justify-center">
                        {selectedScenario ? (
                            <DashboardOverview scenario={selectedScenario} />
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