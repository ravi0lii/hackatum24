package main

import (
	"backend/internal/scenario"
	"backend/internal/utils"
	"fmt"
	"log"
	"strings"
	"time"
)

func main() {
	// Get input from stdin
	var id string
	log.Println("Enter the scenario id:")
	_, err := fmt.Scan(&id)
	if err != nil {
		panic(err)
	}

	id = strings.TrimSpace(id)

	// Start the scenario
	log.Printf("Starting scenario with id: %s", id)
	err = scenario.StartScenario(id)
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

		log.Printf("Available vehicles: %d - Customers that can be picked up: %d", len(availableVehicles), len(customersForPickup))

		var dispatches []scenario.VehicleDispatch

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
				log.Printf(
					"Dispatching vehicle %s to customer %s",
					utils.ShortenUUID(nearestVehicle.Id),
					utils.ShortenUUID(c.Id),
				)

				dispatches = append(dispatches, scenario.VehicleDispatch{
					Vehicle:  nearestVehicle,
					Customer: c,
				})

				// Remove the vehicle from the list of available vehicles
				for idx, v := range availableVehicles {
					if v.Id == nearestVehicle.Id {
						availableVehicles = append(availableVehicles[:idx], availableVehicles[idx+1:]...)
						break
					}
				}
			}
		}

		// Dispatch the vehicles if there are any
		if len(dispatches) > 0 {
			result, err := scenario.Dispatch(&sc, dispatches)
			if err != nil {
				panic(err)
			}

			// Check if the dispatch failed for some vehicles
			if len(result.FailedToUpdate) > 0 {
				for _, f := range result.FailedToUpdate {
					log.Printf(
						"Failed to dispatch vehicle %s to customer %s",
						utils.ShortenUUID(f.Vehicle.Id),
						utils.ShortenUUID(f.Customer.Id),
					)
				}
			}
		}

		// if the scenario is not running anymore, break the loop
		if !sc.IsRunning() {
			break
		}

		time.Sleep(3000 * time.Millisecond)
	}

	log.Println()
	log.Printf("Finished scenario with id: %s", id)
	log.Println()
	log.Println("Statistics:")
	log.Printf("- Time elapsed: %s", sc.TimeElapsed().String())
	log.Printf("- Total distance travelled: %.2f", sc.TotalDistanceTravelled())
}
