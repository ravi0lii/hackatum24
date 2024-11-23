interface AwaitingServiceTagProps {
    idle: boolean
    completed: boolean
}

export function AwaitingServiceTag({idle, completed}: AwaitingServiceTagProps) {
    return (
        <div className="relative">
            {!idle ? (
                <div
                    className="flex items-center gap-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Being Transported
                </div>
            ) : completed ? (
                <div
                    className="flex items-center gap-2 px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Done
                </div>
            ) : (
                <div
                    className="flex items-center gap-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Waiting
                </div>
            )}
        </div>
    )
}