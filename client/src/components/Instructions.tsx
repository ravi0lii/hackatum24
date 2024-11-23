export function Instructions() {
    return (
        <div className="p-6 bg-white shadow-lg rounded-lg w-full h-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">How to Use This Dashboard</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-4">
                <li>
                    <strong>Select a Scenario: </strong>
                    Click on one of the scenarios from the left panel. Each scenario displays the number of customers and vehicles currently associated with it.
                </li>
                <li>
                    <strong>Scenario Overview: </strong>
                    After selecting a scenario, you can view important metrics such as:
                    <ul className="list-disc list-inside ml-4">
                        <li><strong>Total Travel Time:</strong> The cumulative time spent by all vehicles in this scenario.</li>
                        <li><strong>Total Number of Trips:</strong> The total number of trips completed by vehicles in this scenario.</li>
                    </ul>
                </li>
                <li>
                    <strong>Tabs: Cars and Customers: </strong>
                    <ul className="list-disc list-inside ml-4">
                        <li>
                            <strong>Cars Tab: </strong>
                            Lists all vehicles operating in the selected scenario. Provides information such as:
                            <ul className="list-disc list-inside ml-4">
                                <li>Total travel time for each vehicle.</li>
                                <li>Total trips completed.</li>
                                <li>Current status (e.g., availability or activity).</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Customers Tab: </strong>
                            Lists all customers in the selected scenario. Displays the <strong>current location</strong> of each customer in terms of coordinates.
                        </li>
                    </ul>
                </li>
            </ol>
        </div>
    );
}
