import {apiClient, postprocessResponse} from "../util/apiClient.ts";

export class customerService {

    static async getCustomerById(customerId: string): Promise<Customer> {
        const response = await apiClient.get(`/customers/${customerId}`)
        return postprocessResponse<Customer>(response.data)
    }

    static async getCustomersForScenario(scenarioId: string): Promise<Customer[]> {
        const response = await apiClient.get(`/scenarios/${scenarioId}/customers`)
        return postprocessResponse<Customer[]>(response.data)
    }
}