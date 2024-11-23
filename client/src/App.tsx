import LeftPanel from "./components/LeftPanel.tsx";
import TopPanel from "./components/TopPanel.tsx";

function App() {
    return (
        <>
            {/* Vertical Layout */}
            <div className="flex flex-col h-screen w-screen">
                {/* TopPanel */}
                <TopPanel />

                {/* Main Content Area: LeftPanel and Dashboard Content */}
                <div className="flex flex-grow">
                    <LeftPanel />
                    <div className="flex-grow bg-gray-50 flex items-center justify-center">
                        <h1 className="text-2xl font-bold">Dashboard Content</h1>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App
