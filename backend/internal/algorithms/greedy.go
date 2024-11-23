package algorithms

import (
	"backend/internal/scenario"
	"backend/internal/utils"
	"log"
	"time"
)

func RunGreedy(id string) scenario.Scenario {
	var sc scenario.Scenario
	var err error

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

		for _, v := range availableVehicles {
			// Find the nearest customer
			var nearestCustomer *scenario.Customer
			var minDistance float64
			for _, c := range customersForPickup {
				distance := c.DistanceToVehicle(v)
				if nearestCustomer == nil || distance < minDistance {
					nearestCustomer = c
					minDistance = distance
				}
			}

			// Assign nearest customer to vehicle
			if nearestCustomer != nil {
				log.Printf(
					"Dispatching vehicle %s to customer %s",
					utils.ShortenUUID(v.Id),
					utils.ShortenUUID(nearestCustomer.Id),
				)

				dispatches = append(dispatches, scenario.VehicleDispatch{
					Vehicle:  v,
					Customer: nearestCustomer,
				})

				// Remove the customer from the list of customers that can be picked up
				for idx, c := range customersForPickup {
					if c.Id == nearestCustomer.Id {
						customersForPickup = append(customersForPickup[:idx], customersForPickup[idx+1:]...)
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

	return sc
}
