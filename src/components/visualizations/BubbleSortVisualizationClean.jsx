import { useCallback } from 'react'
import SortingVisualizationBase from '../common/SortingVisualizationBase'

const SORT_COLORS = {
  default: '#6b7280',
  comparing: '#f59e0b', 
  swapping: '#ef4444',
  sorted: '#10b981'
}

export default function BubbleSortVisualizationClean() {
  const generateBubbleSortSteps = useCallback((inputArray) => {
    if (!Array.isArray(inputArray) || inputArray.length === 0) {
      return []
    }

    const steps = []
    const workingArray = Array.from(inputArray)
    const n = workingArray.length
    let totalComparisons = 0
    let totalSwaps = 0
    let sortedPositions = []

    // Initial step
    steps.push({
      array: Array.from(workingArray),
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      currentPass: 0,
      comparisons: 0,
      swaps: 0,
      description: `Starting Bubble Sort with ${n} elements`,
      operation: 'start'
    })

    for (let pass = 0; pass < n - 1; pass++) {
      let swapped = false
      
      for (let i = 0; i < n - pass - 1; i++) {
        // Compare adjacent elements
        totalComparisons++
        steps.push({
          array: Array.from(workingArray),
          comparingIndices: [i, i + 1],
          swappingIndices: [],
          sortedIndices: Array.from(sortedPositions),
          currentPass: pass + 1,
          comparisons: totalComparisons,
          swaps: totalSwaps,
          description: `Comparing ${workingArray[i]} and ${workingArray[i + 1]}`,
          operation: 'compare'
        })

        if (workingArray[i] > workingArray[i + 1]) {
          // Perform swap using traditional method
          const temp = workingArray[i]
          workingArray[i] = workingArray[i + 1]
          workingArray[i + 1] = temp
          totalSwaps++
          swapped = true

          steps.push({
            array: Array.from(workingArray),
            comparingIndices: [],
            swappingIndices: [i, i + 1],
            sortedIndices: Array.from(sortedPositions),
            currentPass: pass + 1,
            comparisons: totalComparisons,
            swaps: totalSwaps,
            description: `Swapped ${workingArray[i + 1]} and ${workingArray[i]}`,
            operation: 'swap'
          })
        }
      }

      // Mark the last element as sorted
      sortedPositions.push(n - pass - 1)
      steps.push({
        array: Array.from(workingArray),
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: Array.from(sortedPositions),
        currentPass: pass + 1,
        comparisons: totalComparisons,
        swaps: totalSwaps,
        description: `Pass ${pass + 1} complete!`,
        operation: 'pass-complete'
      })

      if (!swapped) break
    }

    // Final step
    steps.push({
      array: Array.from(workingArray),
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: Array.from({ length: n }, (_, i) => i),
      currentPass: 0,
      comparisons: totalComparisons,
      swaps: totalSwaps,
      description: `Bubble Sort complete! ${totalComparisons} comparisons, ${totalSwaps} swaps`,
      operation: 'complete'
    })

    return steps
  }, [])

  const getBarColor = (index, algorithmState) => {
    if (algorithmState.swappingIndices?.includes(index)) return SORT_COLORS.swapping
    if (algorithmState.comparingIndices?.includes(index)) return SORT_COLORS.comparing
    if (algorithmState.sortedIndices?.includes(index)) return SORT_COLORS.sorted
    return SORT_COLORS.default
  }

  const renderStats = (algorithmState) => (
    <div className="flex justify-center space-x-6 text-sm">
      <span>Pass: {algorithmState.currentPass || 0}</span>
      <span>Comparisons: {algorithmState.comparisons || 0}</span>
      <span>Swaps: {algorithmState.swaps || 0}</span>
    </div>
  )

  return (
    <SortingVisualizationBase
      algorithmName="Bubble Sort"
      generateSteps={generateBubbleSortSteps}
      getBarColor={getBarColor}
      renderStats={renderStats}
      contextKey="bubble"
    />
  )
}