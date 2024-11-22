import {apiClient, postprocessResponse} from "../util/apiClient.ts";

export class vehicleService {

    static async getAllVehiclesForScenario(scenarioId: string): Promise<Vehicle[]> {
        const response = await apiClient.get(`/scenarios/${scenarioId}/vehicles`)
        return postprocessResponse<Vehicle[]>(response.data)
    }

    static async getVehicleById(vehicleId: string): Promise<Vehicle> {
        const response = await apiClient.get(`/vehicles/${vehicleId}`)
        return postprocessResponse<Vehicle>(response.data)
    }
}