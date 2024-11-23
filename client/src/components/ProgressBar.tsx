import {c} from "vite/dist/node/types.d-aGj9QkWt";

export function ProgressBar({scenario, selectedCar}) {

    const customer : Customer = scenario.customers.find((customer) => customer.id === selectedCar.customerId)

    function calculateProgress(car : Vehicle, customer: Customer) {
        if (!customer) {
            return -1;
        }
        const distanceToCustomer = Math.sqrt(
            Math.pow(customer.coordX - car.coordX, 2) + Math.pow(customer.coordY - car.coordY, 2)
        );
        const distanceFromCustomerToEndpoint = Math.sqrt(
            Math.pow(customer.coordX - customer.destinationX, 2) + Math.pow(customer.coordY - customer.destinationY, 2)
        );
        function calculateTotalDistance() {
            if (customer.awaitingService) {
                return distanceToCustomer + distanceFromCustomerToEndpoint
            } else {
                return distanceFromCustomerToEndpoint;
            }
        }
        return (car.distanceTravelled / calculateTotalDistance()) * 100;
    }

    return (
        <>
            <div className="flex justify-between">
                <p>start</p>
                <p>end</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 shadow-inner overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold transition-all duration-300"
                    style={{width: `${calculateProgress(scenario, selectedCar)}%`}}
                >
                    {calculateProgress(scenario, selectedCar)}% {/* Display percentage */}
                </div>
            </div>
        </>
    )
}