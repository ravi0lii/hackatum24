package scenario

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

const scenarioSpeed float32 = 0.2

func StartScenario(id string) error {
	// First, initialize the scenario
	_, err := http.Post(fmt.Sprintf("http://localhost:8090/Scenarios/initialize_scenario?db_scenario_id=%s", id), "application/json", strings.NewReader("{}"))
	if err != nil {
		return err
	}

	// Then, launch the scenario
	_, err = http.Post(fmt.Sprintf("http://localhost:8090/Runner/launch_scenario/%s?speed=%f", id, scenarioSpeed), "application/json", nil)
	return err
}

func GetScenario(id string) (Scenario, error) {
	res, err := http.Get(fmt.Sprintf("http://localhost:8090/Scenarios/get_scenario/%s", id))
	if err != nil {
		return Scenario{}, err
	}

	var scenario Scenario
	err = json.NewDecoder(res.Body).Decode(&scenario)
	if err != nil {
		return Scenario{}, err
	}

	return scenario, nil
}
