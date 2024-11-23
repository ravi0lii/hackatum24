package scenario

import (
	"bytes"
	"encoding/json"
	"fmt"
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

func Dispatch(scenario *Scenario, dispatches []VehicleDispatch) error {
	request := dispatchRequest{}
	for _, d := range dispatches {
		request.Vehicles = append(request.Vehicles, vehicleDispatchRequest{
			VehicleId:  d.Vehicle.Id,
			CustomerId: d.Customer.Id,
		})
	}

	jsonBody, err := json.Marshal(request)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(
		http.MethodPut,
		fmt.Sprintf("http://localhost:8090/Scenarios/update_scenario/%s", scenario.Id),
		bytes.NewReader(jsonBody),
	)
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	client := http.Client{}
	_, err = client.Do(req)
	return err
}
