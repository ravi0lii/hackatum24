package algorithms

import (
	"backend/internal/scenario"
	"backend/internal/utils"
	"github.com/muesli/clusters"
	"github.com/muesli/kmeans"
	"log"
	"time"
)

type optimizedVehicleRoute struct {
	vehicle   scenario.Vehicle
	customers []scenario.Customer
}

func RunOptimized(id string) scenario.Scenario {
	sc, err := scenario.GetScenario(id)
	if err != nil {
		panic(err)
	}

	amountOfClusters := len(sc.Vehicles)

	// We cannot run the k means grouping algorithm if there are fewer customers than vehicles since we want to have the
	// same amount of clusters as vehicles
	// Therefore, we will just run our greedy algorithm in this case
	if len(sc.Customers) < amountOfClusters {
		log.Println("Less customers than vehicles, running greedy algorithm instead")
		return RunGreedy(id)
	}

	customerClusters := groupByKMeans(&sc, amountOfClusters)

	availableVehicles := sc.GetAvailableVehicles()
	var routes []*optimizedVehicleRoute

	for clusterIdx := 0; clusterIdx < amountOfClusters; clusterIdx++ {
		// Find the customers that belong to this cluster
		var customersInCluster []*scenario.Customer
		for _, c := range sc.Customers {
			if customerClusters[c.Id] == clusterIdx {
				customersInCluster = append(customersInCluster, &c)
			}
		}

		// Create a path with the lowest costs between all customers in this cluster
		pickupDestinationMatrix := createPickupDestinationMatrix(customersInCluster)
		pathIdx := pickupDestinationMatrix.FindLowestCostPath()

		// Map the path indices to the actual customers
		var path []scenario.Customer
		for _, idx := range pathIdx {
			path = append(path, *customersInCluster[idx])
		}
		startCustomer := path[0]

		// Find the nearest vehicle to the starting point of the first customer
		var nearestVehicle *scenario.Vehicle
		var minDistance float64
		for _, v := range availableVehicles {
			distance := startCustomer.DistanceToVehicle(v)
			if nearestVehicle == nil || distance < minDistance {
				nearestVehicle = v
				minDistance = distance
			}
		}

		// Remove the nearest vehicle from the list of available vehicles
		for idx, v := range availableVehicles {
			if v.Id == nearestVehicle.Id {
				availableVehicles = append(availableVehicles[:idx], availableVehicles[idx+1:]...)
				break
			}
		}

		// Add the vehicle route with the customers to the list of all routes
		routes = append(routes, &optimizedVehicleRoute{
			vehicle:   *nearestVehicle,
			customers: path,
		})
	}

	for {
		sc, err = scenario.GetScenario(id)
		if err != nil {
			panic(err)
		}

		// If the scenario is not running anymore, we can break the loop
		if !sc.IsRunning() {
			break
		}

		var dispatches []scenario.VehicleDispatch

		for _, r := range routes {
			// We need to get the vehicle from the scenario since the vehicle in the route is a copy and we need the new
			// data
			routeVehicle := sc.GetVehicleById(r.vehicle.Id)

			// If the vehicle for this route is available again, and we still have customers left, we want to dispatch
			// it to the next customer on that route
			if routeVehicle.Available && len(r.customers) > 0 {
				dispatchingTo := r.customers[0]
				r.customers = r.customers[1:]

				dispatches = append(dispatches, scenario.VehicleDispatch{
					Vehicle:  &r.vehicle,
					Customer: &dispatchingTo,
				})
				log.Printf(
					"Dispatching vehicle %s to customer %s",
					utils.ShortenUUID(r.vehicle.Id),
					utils.ShortenUUID(dispatchingTo.Id),
				)
			}
		}

		if len(dispatches) > 0 {
			dispatchResult, err := scenario.Dispatch(&sc, dispatches)
			if err != nil {
				panic(err)
			}

			if len(dispatchResult.FailedToUpdate) > 0 {
				for _, f := range dispatchResult.FailedToUpdate {
					log.Fatalf(
						"Failed to dispatch vehicle %s to customer %s",
						utils.ShortenUUID(f.Vehicle.Id),
						utils.ShortenUUID(f.Customer.Id),
					)
				}
			}
		}

		time.Sleep(3 * time.Second)
	}

	return sc
}

func createPickupDestinationMatrix(customers []*scenario.Customer) (m squareMatrix) {
	for i := 0; i < len(customers); i++ {
		m.AddEmpty()
	}

	// Add edges between all end points
	// Since we can only reach the endpoint of a customer by going through the pickup point, we have to also consider
	// the distance it takes to go from the pickup point to the destination point of the customer
	for i, c1 := range customers {
		for j, c2 := range customers {
			if i != j {
				m.Set(i, j, c1.DistanceMyEndToStartOf(*c2)+c2.Distance())
				m.Set(j, i, c2.DistanceMyEndToStartOf(*c1)+c1.Distance())
			}
		}
	}

	return
}

func groupByKMeans(sc *scenario.Scenario, k int) (groups map[string]int) {
	groups = make(map[string]int)

	// Map all customers to the coordinates of their destination
	var d clusters.Observations
	for _, c := range sc.Customers {
		d = append(d, clusters.Coordinates{c.DestinationX, c.DestinationY})
	}

	km := kmeans.New()
	foundClusters, err := km.Partition(d, k)
	if err != nil {
		panic(err)
	}

	// Create a map that maps the ids of customers to the cluster they belong to
	for clusterIdx, cluster := range foundClusters {
		for _, o := range cluster.Observations {
			for _, c := range sc.Customers {
				if c.DestinationX == o.Coordinates()[0] && c.DestinationY == o.Coordinates()[1] {
					groups[c.Id] = clusterIdx
				}
			}
		}
	}

	return
}
