import {Scenario} from "../type/scenario.ts";

interface ProgressBarProps {
    scenario: Scenario;
    selectedCar: Vehicle;
    remainingTravelTime: [string, number, number, number][]
}

export function ProgressBar({scenario, selectedCar, remainingTravelTime} : ProgressBarProps) {

    function calculateProgress(car : Vehicle, remainingTravelTime: [string,number, number, number][]) {
        if (!remainingTravelTime || !Array.isArray(remainingTravelTime)) {
            return 0;
        }

        const tuple = remainingTravelTime.find((entry) => entry[0] === car.id);
        if (!tuple) {
            return 0; // No data found for this car
        }
        const [_, timeLeft, totalTime] = tuple;

        return ((totalTime - timeLeft) / totalTime) * 100;    }

    return (
        <>
            <div className="flex justify-between">
                <p>Start</p>
                <p>end</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 shadow-inner overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold transition-all duration-300"
                    style={{width: `${calculateProgress(selectedCar, remainingTravelTime)}%`}}
                >
                    {/*{calculateProgress(scenario, selectedCar)}% /!* Display percentage *!/*/}
                </div>
            </div>
        </>
    )
}