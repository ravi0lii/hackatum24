package scenario

import (
	"backend/internal/utils"
	"strings"
	"time"
)

type ScenarioStatus string

const (
	ScenarioStatusCreated   ScenarioStatus = "CREATED"
	ScenarioStatusRunning   ScenarioStatus = "RUNNING"
	ScenarioStatusCompleted ScenarioStatus = "COMPLETED"
)

type Customer struct {
	Id              string  `json:"id"`
	PickupX         float64 `json:"coordX"`
	PickupY         float64 `json:"coordY"`
	DestinationX    float64 `json:"destinationX"`
	DestinationY    float64 `json:"destinationY"`
	AwaitingService bool    `json:"awaitingService"`
}

type Vehicle struct {
	Id                  string  `json:"id"`
	ServingCustomerId   string  `json:"customerId"`
	Available           bool    `json:"isAvailable"`
	NumberOfTrips       int     `json:"numberOfTrips"`
	RemainingTravelTime int     `json:"remainingTravelTime"`
	VehicleSpeed        float64 `json:"vehicleSpeed"`
	DistanceTravelled   float64 `json:"distanceTravelled"`
	ActiveTime          int     `json:"activeTime"`
	LastKnownX          float64 `json:"coordX"`
	LastKnownY          float64 `json:"coordY"`
}

type ScenarioTime struct {
	time.Time
}

func (st *ScenarioTime) UnmarshalJSON(b []byte) error {
	// Get rid of the " characters
	value := strings.Trim(string(b), `"`)
	if value == "" || value == "null" {
		return nil
	}

	t, err := time.Parse("2006-01-02T15:04:05.999999", value)
	if err != nil {
		return err
	}

	st.Time = t
	return nil
}

type Scenario struct {
	Id        string         `json:"id"`
	Customers []Customer     `json:"customers"`
	Vehicles  []Vehicle      `json:"vehicles"`
	Status    ScenarioStatus `json:"status"`
	StartTime ScenarioTime   `json:"startTime"`
	EndTime   ScenarioTime   `json:"endTime"`
}

func (s *Scenario) GetAvailableVehicles() (availableVehicles []*Vehicle) {
	for idx, v := range s.Vehicles {
		if v.Available {
			availableVehicles = append(availableVehicles, &s.Vehicles[idx])
		}
	}
	return
}

func (s *Scenario) GetPickupableCustomers() (customersWithoutVehicle []*Customer) {
	for idx, c := range s.Customers {
		// If the customer is not awaiting service, we have to skip him, otherwise we would get an error while
		// dispatching to this customer
		if !c.AwaitingService {
			continue
		}

		// If there is a vehicle that has its customer id set to the current customer id, it means that the customer is
		// waiting for pickup by this vehicle
		customerIsAssigned := false
		for _, v := range s.Vehicles {
			if v.ServingCustomerId == c.Id {
				customerIsAssigned = true
				break
			}
		}

		if !customerIsAssigned {
			customersWithoutVehicle = append(customersWithoutVehicle, &s.Customers[idx])
		}
	}
	return
}

func (s *Scenario) IsRunning() bool {
	return s.Status == ScenarioStatusRunning
}

func (s *Scenario) TimeElapsed() time.Duration {
	return s.EndTime.Sub(s.StartTime.Time)
}

func (c *Customer) DistanceToVehicle(v *Vehicle) float64 {
	return utils.EuclideanDistance(c.PickupX, c.PickupY, v.LastKnownX, v.LastKnownY)
}
