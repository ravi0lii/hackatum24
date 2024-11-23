import { useState } from 'react';
import { Scenario } from '../type/scenario.ts';
import {AwaitingServiceTag} from "./AwaitingServiceTag.tsx";

interface CustomerTabProps {
    scenario: Scenario;
    scenarioSelectedId: string
}

export function CustomerTab({ scenario, scenarioSelectedId }: CustomerTabProps) {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null); // State to track the selected customer

    return (
        <>
            <h3 className="text-lg font-semibold mb-2">Customers</h3>
            <div className="flex space-x-4">
                {/* Left Panel: List of Customers */}
                <div className="w-1/2">
                    <ul className="space-y-2">
                        {scenario.customers.map((customer) => (
                            <li
                                key={customer.id}
                                onClick={() => setSelectedCustomer(customer)}
                                className={`p-4 bg-gray-100 rounded-md shadow-md flex justify-between cursor-pointer hover:bg-gray-200 ${
                                    selectedCustomer?.id === customer.id ? 'bg-gray-300' : ''
                                }`}
                            >
                                <span>Customer</span>
                                <span>Location: ({customer.coordX}, {customer.coordY})</span>
                                {
                                   (scenario.vehicles.find(vehicle => vehicle.customerId === customer.id))?
                                       <AwaitingServiceTag idle={false} completed={false}/> :
                                       customer.awaitingService?
                                           <AwaitingServiceTag idle={true} completed={false}/> :
                                           <AwaitingServiceTag idle={true} completed={true}/>
                                }
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Panel: Selected Customer Details */}
                <div className="w-1/2 bg-gray-50 p-4 rounded-md relative">
                    {selectedCustomer ? (
                        <div>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
                                {
                                    (scenario.vehicles.find(vehicle => vehicle.customerId === selectedCustomer.id))?
                                        <AwaitingServiceTag idle={false} completed={false}/> :
                                        selectedCustomer.awaitingService?
                                            <AwaitingServiceTag idle={true} completed={false}/> :
                                            <AwaitingServiceTag idle={true} completed={true}/>
                                }
                            </div>
                            <p>
                                <strong>Location:</strong> ({selectedCustomer.coordX},{' '}
                                {selectedCustomer.coordY})
                            </p>
                            <p>
                                <strong>Destination:</strong> ({selectedCustomer.destinationX},{' '}
                                {selectedCustomer.destinationY})
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-600">Select a customer to see details.</p>
                    )}
                </div>
            </div>
        </>
    );
}
