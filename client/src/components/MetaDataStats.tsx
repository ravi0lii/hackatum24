import {TruckIcon} from "@heroicons/react/16/solid";

interface metaDataStatsProps {
    title: string
    data: string
}

export function MetaDataStats({ title, data }: metaDataStatsProps): any {
    return (
        <div className="w-64 bg-white rounded-lg shadow-md p-4 flex flex-col gap-4">
            {/* Header Section */}
            <div className="flex items-center justify-between">
    <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <div className="bg-blue-100 p-1 rounded-full">

            <div className="text-blue-500 text-lg">
                <TruckIcon className="size-6 text-blue-500"/>
            </div>
        </div>
        </div>

    {/* Main Content */}
    <div className="text-center">
    <h2 className="text-3xl font-bold text-gray-800">{data}</h2>
        </div>
    </div>
);
}