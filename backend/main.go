package main

import (
	"backend/internal/scenario"
	"log"
	"time"
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
		customersForPickup := sc.GetPickupableCustomers()

		log.Printf("Available vehicles: %d", len(availableVehicles))
		log.Printf("Customers that can be picked up: %d", len(customersForPickup))

		for _, c := range customersForPickup {
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
				result, err := scenario.Dispatch(&sc, []scenario.VehicleDispatch{
					{
						Vehicle:  nearestVehicle,
						Customer: c,
					},
				})
				if err != nil {
					panic(err)
				}

				// Check if the dispatch failed for some vehicles
				if len(result.FailedToUpdate) > 0 {
					for _, f := range result.FailedToUpdate {
						log.Printf("Failed to dispatch vehicle %s to customer %s", f.Vehicle.Id, f.Customer.Id)
					}
				}

				// Remove the vehicle from the list of available vehicles
				for idx, v := range availableVehicles {
					if v.Id == nearestVehicle.Id {
						availableVehicles = append(availableVehicles[:idx], availableVehicles[idx+1:]...)
						break
					}
				}
			}
		}

		// if the scenario is not running anymore, break the loop
		if !sc.IsRunning() {
			break
		}

		time.Sleep(1000 * time.Millisecond)
	}

	log.Printf("Finished scenario with id: %s", id)
	log.Println()
	log.Println("Statistics:")
	log.Printf("- Time elapsed: %s", sc.TimeElapsed().String())
}
