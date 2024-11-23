import {Fragment, useEffect} from "react";
import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Icon} from 'leaflet'
import { Scenario } from "../type/scenario.ts";

interface GraphTabProps {
    scenario: Scenario;
}

export function GraphTab({ scenario }: GraphTabProps) {
    useEffect(() => {
        // Ensure Leaflet CSS is applied (optional debug)
        console.log("Leaflet CSS loaded");
    }, []);

    const customerIcon = new Icon({
        iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="35" height="35"><circle cx="12" cy="8" r="4"/><path d="M4,20 C4,16.6863 7.58172,14 12,14 C16.4183,14 20,16.6863 20,20"/></svg>`
        )}`,
        iconSize: [35, 35], // size of the icon
        iconAnchor: [17.5, 35], // center bottom
        popupAnchor: [0, -35], // above the icon
    });

    const startIcon = new Icon({
        iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" width="35" height="35"><path d="M12 2C8.13 2 5 5.13 5 9c0 3.53 3.43 8.39 6.23 11.55.48.56 1.06.56 1.54 0C15.57 17.39 19 12.53 19 9c0-3.87-3.13-7-7-7zm0 11c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>`
        )}`,
        iconSize: [35, 35],
        iconAnchor: [17.5, 35],
        popupAnchor: [0, -35],
    });

    const endIcon = new Icon({
        iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="35" height="35"><path d="M12 2C8.13 2 5 5.13 5 9c0 3.53 3.43 8.39 6.23 11.55.48.56 1.06.56 1.54 0C15.57 17.39 19 12.53 19 9c0-3.87-3.13-7-7-7zm0 11c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>`
        )}`,
        iconSize: [35, 35],
        iconAnchor: [17.5, 35],
        popupAnchor: [0, -35],
    });


    // Center the map on the first vehicle or default coordinates
    const defaultCenter = scenario.vehicles.length
        ? [scenario.vehicles[0].coordX, scenario.vehicles[0].coordY]
        : [51.505, -0.09];

    return (
        <div className="w-full h-full">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100vh", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {scenario.vehicles.map((vehicle) => (
                    <Marker position={[vehicle.coordX, vehicle.coordY]}
                            key={vehicle.id}
                            icon={startIcon}>
                        <Popup>
                            <div>
                                <p><strong>Vehicle ID:</strong> {vehicle.id}</p>
                                <p><strong>Trips:</strong> {vehicle.numberOfTrips}</p>
                                <p><strong>Speed:</strong> {vehicle.vehicleSpeed} km/h</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Customer Markers and Lines */}
                {scenario.customers.map((customer) => (
                    <Fragment key={customer.id}>
                        <Marker position={[customer.coordX, customer.coordY]}
                                icon={customerIcon}>
                            <Popup>
                                <div>
                                    <p><strong>Customer ID:</strong> {customer.id}</p>
                                    <p><strong>Awaiting Service:</strong> {customer.awaitingService ? "Yes" : "No"}</p>
                                </div>
                            </Popup>
                        </Marker>
                        {/* Line from customer start to destination */}
                        <Polyline
                            positions={[
                                [customer.coordX, customer.coordY],
                                [customer.destinationX, customer.destinationY],
                            ]}
                            color="green"
                        />
                    </Fragment>
                ))}
            </MapContainer>
        </div>
    );
}
