export function CustomerTab({scenario}) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Customers</h3>
            <ul className="space-y-2">
                {scenario.customers.map((customer) => (
                    <li
                        key={customer.id}
                        className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between"
                    >
                        <span>ID: {customer.id}</span>
                        <span>Location: ({customer.coordX}, {customer.coordY})</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}