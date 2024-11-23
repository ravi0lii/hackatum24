interface AvailabilityTagProps {
    isAvailable: boolean
}

export function AvailabilityTag({isAvailable}: AvailabilityTagProps) {
    return (
        <div className="relative">
            {isAvailable ? (
                <div
                    className="flex items-center gap-2 px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Available
                </div>
            ) : (
                <div
                    className="flex items-center gap-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Not Available
                </div>
            )}
        </div>
    )
}