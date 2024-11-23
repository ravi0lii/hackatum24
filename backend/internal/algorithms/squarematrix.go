package algorithms

import (
	"fmt"
	"math"
	"os"
	"text/tabwriter"
)

var positiveInf = math.Inf(0)

type squareMatrix struct {
	matrix [][]float64
}

func (m *squareMatrix) AddEmpty() int {
	if len(m.matrix) == 0 {
		m.matrix = append(m.matrix, []float64{positiveInf})
		return 0
	}

	// Add a new row with only positive infinities to the matrix
	row := make([]float64, len(m.matrix[0]))
	for i := 0; i < len(row); i++ {
		row[i] = positiveInf
	}
	m.matrix = append(m.matrix, row)

	// Add the positive infinity as the last row
	for i := 0; i < len(m.matrix); i++ {
		m.matrix[i] = append(m.matrix[i], positiveInf)
	}

	return len(m.matrix) - 1
}

func (m *squareMatrix) Print() {
	w := tabwriter.NewWriter(os.Stdout, 1, 1, 1, ' ', 0)

	for rowIdx, row := range m.matrix {
		// Print column headers
		if rowIdx == 0 {
			for i := 0; i < len(row); i++ {
				fmt.Fprintf(w, "\t\t%d", i)
			}
			fmt.Fprintln(w)
		}

		// Print row index
		fmt.Fprintf(w, "%d\t\t", rowIdx)

		// Print row values
		for _, cell := range row {
			if cell == positiveInf {
				fmt.Fprint(w, "∞\t\t")
			} else {
				fmt.Fprintf(w, "%.4f\t\t", cell)
			}
		}
		fmt.Fprintln(w)
	}

	w.Flush()
}

func (m *squareMatrix) Set(row, col int, value float64) {
	m.matrix[row][col] = value
}

func (m *squareMatrix) Length() int {
	return len(m.matrix)
}

func (m *squareMatrix) FindLowestCostPath() (path []int) {
	lowestCost := positiveInf

	for potentialStartNodeIdx := 0; potentialStartNodeIdx < m.Length(); potentialStartNodeIdx++ {
		currentCost, lowestCostPath := m.FindLowestCostPathFromNode(potentialStartNodeIdx)

		// If the found path has a lower cost than the current lowest cost, we found a more viable path
		if currentCost < lowestCost {
			lowestCost = currentCost
			path = lowestCostPath
		}
	}

	return
}

func (m *squareMatrix) FindLowestCostPathFromNode(startIdx int) (cost float64, path []int) {
	visited := make([]bool, m.Length())
	currentNodeIdx := startIdx
	for {
		visited[currentNodeIdx] = true
		path = append(path, currentNodeIdx)

		// Find the next node to visit, we visit the next node that has the lowest cost on the edge to it
		minCost := positiveInf
		nextNodeIdx := -1
		for i := 0; i < m.Length(); i++ {
			if !visited[i] && m.matrix[currentNodeIdx][i] < minCost {
				minCost = m.matrix[currentNodeIdx][i]
				nextNodeIdx = i
			}
		}

		// All nodes were visited: break the loop
		if nextNodeIdx == -1 {
			break
		}

		currentNodeIdx = nextNodeIdx
		cost += minCost
	}

	return
}
