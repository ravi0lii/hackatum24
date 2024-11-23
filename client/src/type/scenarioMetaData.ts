type VehicleMetaData = {
    id: string;
    totalTravelTime: number;
    totalTrips: number;
    travelTimes: string;
};

type ScenarioMetaData = {
    endTime: string;
    id: string;
    startTime: string;
    status: string;
    vehicleData: VehicleMetaData[];
};