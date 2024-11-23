import {apiClient, postprocessResponse} from "../util/apiClient.ts";
import {Scenario} from "../type/scenario.ts";

export class scenarioService {

    static async getAllScenarios(): Promise<Scenario[]> {
        const response = await apiClient.get(`/scenarios`)
        console.log(response)
        return postprocessResponse<Scenario[]>(response.data)
    }

    static async getScenarioById(scenarioId: string): Promise<Scenario> {
        const response = await apiClient.get(`/scenarios/${scenarioId}`)
        return postprocessResponse<Scenario>(response.data)
    }
}