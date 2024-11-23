
interface ScenarioCardProps {
    name: string;
    customerCount: number;
    vehicleCount: number;
}

export function ScenarioCard({ name, customerCount, vehicleCount }) {
    return (
        <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{name}</h3>
            <div className="flex justify-between items-center text-sm text-gray-700">
    <div className="flex items-center gap-1">
    <div className="text-blue-500" />
        <span>{customerCount} Customers</span>
    </div>
    <div className="flex items-center gap-1">
    <div className="text-green-500" />
        <span>{vehicleCount} Vehicles</span>
    </div>
    </div>
    </div>
);
}

export default ScenarioCard;
