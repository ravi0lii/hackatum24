package main

import (
	"backend/internal/scenario"
	"log"
)

func main() {
	id := "38e8e73b-d52e-42d3-a6c3-3986f63c6cd6"

	// Start the scenario
	log.Printf("Starting scenario with id: %s", id)
	err := scenario.StartScenario(id)
	if err != nil {
		panic(err)
	}

	var sc scenario.Scenario

	for {
		// Retrieve a current version of the scenario
		sc, err = scenario.GetScenario(id)
		if err != nil {
			panic(err)
		}

		availableVehicles := sc.GetAvailableVehicles()
		customersWithoutVehicleAssignment := sc.GetCustomersWithoutVehicleAssignment()

		for _, c := range customersWithoutVehicleAssignment {
			// Find the nearest vehicle
			var nearestVehicle *scenario.Vehicle
			var minDistance float64
			for _, v := range availableVehicles {
				distance := c.DistanceToVehicle(v)
				if nearestVehicle == nil || distance < minDistance {
					nearestVehicle = v
					minDistance = distance
				}
			}

			// Assign nearest vehicle to customer
			if nearestVehicle != nil {
				log.Printf("Dispatching vehicle %s to customer %s", nearestVehicle.Id, c.Id)
				err := scenario.Dispatch(&sc, []scenario.VehicleDispatch{
					{
						Vehicle:  nearestVehicle,
						Customer: c,
					},
				})
				if err != nil {
					panic(err)
				}
			}
		}

		// if the scenario is not running anymore, break the loop
		if !sc.IsRunning() {
			break
		}
	}

	log.Printf("Finished scenario with id: %s", id)
	log.Println()
	log.Println("Statistics:")
	log.Printf("- Time elapsed: %s", sc.TimeElapsed().String())
}
