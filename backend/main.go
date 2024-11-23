package main

import (
	"backend/internal/algorithms"
	"backend/internal/scenario"
	"fmt"
	"log"
)

func main() {
	// Get input from stdin
	var id string
	log.Println("Enter the scenario id:")
	_, err := fmt.Scan(&id)
	if err != nil {
		panic(err)
	}

	var algorithm string
	log.Println("Enter algorithm: (greedy/optimized)")
	_, err = fmt.Scan(&algorithm)
	if err != nil {
		panic(err)
	}

	// Start the scenario
	log.Printf("Starting %s algorithm scenario with id: %s", algorithm, id)
	err = scenario.StartScenario(id)
	if err != nil {
		panic(err)
	}

	var sc scenario.Scenario

	switch algorithm {
	case "greedy":
		sc = algorithms.RunGreedy(id)
	case "optimized":
		sc = algorithms.RunOptimized(id)
	default:
		log.Fatalf("Unknown algorithm: %s", algorithm)
	}

	log.Println()
	log.Printf("Finished scenario with id: %s", id)
	log.Println()
	log.Println("Statistics:")
	log.Printf("- Time elapsed: %s", sc.TimeElapsed().String())
	log.Printf("- Total distance travelled: %.2f", sc.TotalDistanceTravelled())
}
