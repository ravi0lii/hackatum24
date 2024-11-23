package scenario

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type VehicleDispatch struct {
	Vehicle  *Vehicle
	Customer *Customer
}

type vehicleDispatchRequest struct {
	VehicleId  string `json:"id"`
	CustomerId string `json:"customerId"`
}

type dispatchRequest struct {
	Vehicles []vehicleDispatchRequest `json:"vehicles"`
}

type dispatchResponse struct {
	FailedToUpdate []string `json:"failedToUpdate"`
}

type DispatchResponse struct {
	FailedToUpdate []*VehicleDispatch
}

func Dispatch(scenario *Scenario, dispatches []VehicleDispatch) (DispatchResponse, error) {
	request := dispatchRequest{}
	for _, d := range dispatches {
		request.Vehicles = append(request.Vehicles, vehicleDispatchRequest{
			VehicleId:  d.Vehicle.Id,
			CustomerId: d.Customer.Id,
		})
	}

	jsonBody, err := json.Marshal(request)
	if err != nil {
		return DispatchResponse{}, err
	}

	req, err := http.NewRequest(
		http.MethodPut,
		fmt.Sprintf("http://localhost:8090/Scenarios/update_scenario/%s", scenario.Id),
		bytes.NewReader(jsonBody),
	)
	if err != nil {
		return DispatchResponse{}, err
	}
	req.Header.Set("Content-Type", "application/json")

	client := http.Client{}
	r, err := client.Do(req)
	if err != nil {
		return DispatchResponse{}, err
	}

	defer r.Body.Close()

	bodyRead, err := io.ReadAll(r.Body)
	if err != nil {
		return DispatchResponse{}, err
	}

	// Parse the response into json
	var responseBody dispatchResponse
	err = json.Unmarshal(bodyRead, &responseBody)
	if err != nil {
		return DispatchResponse{}, err
	}

	// Create the response
	var failedToUpdate []*VehicleDispatch
	for _, failedId := range responseBody.FailedToUpdate {
		for _, d := range dispatches {
			if d.Vehicle.Id == failedId {
				failedToUpdate = append(failedToUpdate, &d)
				break
			}
		}
	}

	return DispatchResponse{
		FailedToUpdate: failedToUpdate,
	}, nil
}
