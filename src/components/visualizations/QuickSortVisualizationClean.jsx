import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const SORT_COLORS = {
  default: '#6b7280',
  pivot: '#ef4444',
  less: '#3b82f6',
  greater: '#f59e0b',
  comparing: '#8b5cf6',
  sorted: '#10b981'
}

export default function QuickSortVisualizationClean() {
  const { state, setVisualizationData } = useApp()
  const [array, setArray] = useState([10, 7, 8, 9, 1, 5])
  const [pivotIndex, setPivotIndex] = useState(-1)
  const [sortedIndices, setSortedIndices] = useState([])
  const [comparisons, setComparisons] = useState(0)
  const [swaps, setSwaps] = useState(0)

  const generateQuickSortSteps = useCallback((inputArray) => {
    if (!Array.isArray(inputArray) || inputArray.length === 0) {
      return []
    }

    const steps = []
    const workingArray = Array.from(inputArray)
    let totalComparisons = 0
    let totalSwaps = 0
    const sortedPositions = []

    steps.push({
      array: Array.from(workingArray),
      pivotIndex: -1,
      sortedIndices: [],
      comparisons: 0,
      swaps: 0,
      description: `Starting Quick Sort with ${workingArray.length} elements`,
      operation: 'start'
    })

    const quickSort = (arr, low, high) => {
      if (low < high) {
        const pi = partition(arr, low, high)
        sortedPositions.push(pi)
        
        steps.push({
          array: Array.from(arr),
          pivotIndex: pi,
          sortedIndices: Array.from(sortedPositions),
          comparisons: totalComparisons,
          swaps: totalSwaps,
          description: `Pivot ${arr[pi]} is now in correct position at index ${pi}`,
          operation: 'pivot-placed'
        })

        quickSort(arr, low, pi - 1)
        quickSort(arr, pi + 1, high)
      } else if (low === high && !sortedPositions.includes(low)) {
        sortedPositions.push(low)
        steps.push({
          array: Array.from(arr),
          pivotIndex: -1,
          sortedIndices: Array.from(sortedPositions),
          comparisons: totalComparisons,
          swaps: totalSwaps,
          description: `Single element ${arr[low]} at index ${low} is sorted`,
          operation: 'single-element'
        })
      }
    }

    const partition = (arr, low, high) => {
      const pivot = arr[high]
      
      steps.push({
        array: Array.from(arr),
        pivotIndex: high,
        sortedIndices: Array.from(sortedPositions),
        comparisons: totalComparisons,
        swaps: totalSwaps,
        description: `Chosen pivot: ${pivot} at index ${high}`,
        operation: 'choose-pivot'
      })

      let i = low - 1

      for (let j = low; j < high; j++) {
        totalComparisons++
        
        steps.push({
          array: Array.from(arr),
          pivotIndex: high,
          sortedIndices: Array.from(sortedPositions),
          comparisons: totalComparisons,
          swaps: totalSwaps,
          description: `Comparing ${arr[j]} with pivot ${pivot}`,
          operation: 'compare'
        })

        if (arr[j] < pivot) {
          i++
          if (i !== j) {
            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
            totalSwaps++
            
            steps.push({
              array: Array.from(arr),
              pivotIndex: high,
              sortedIndices: Array.from(sortedPositions),
              comparisons: totalComparisons,
              swaps: totalSwaps,
              description: `${arr[i]} < ${pivot}, swapped with element at index ${i}`,
              operation: 'swap'
            })
          }
        }
      }

      const temp = arr[i + 1]
      arr[i + 1] = arr[high]
      arr[high] = temp
      totalSwaps++

      steps.push({
        array: Array.from(arr),
        pivotIndex: i + 1,
        sortedIndices: Array.from(sortedPositions),
        comparisons: totalComparisons,
        swaps: totalSwaps,
        description: `Placed pivot ${pivot} at its final position ${i + 1}`,
        operation: 'place-pivot'
      })

      return i + 1
    }

    quickSort(workingArray, 0, workingArray.length - 1)

    for (let i = 0; i < workingArray.length; i++) {
      if (!sortedPositions.includes(i)) {
        sortedPositions.push(i)
      }
    }

    steps.push({
      array: Array.from(workingArray),
      pivotIndex: -1,
      sortedIndices: Array.from(sortedPositions),
      comparisons: totalComparisons,
      swaps: totalSwaps,
      description: `Quick Sort complete! ${totalComparisons} comparisons, ${totalSwaps} swaps`,
      operation: 'complete'
    })

    return steps
  }, [])

  const handleSort = () => {
    if (!Array.isArray(array) || array.length === 0) {
      return
    }
    
    try {
      const steps = generateQuickSortSteps(array)
      setVisualizationData(steps)
    } catch (error) {
      console.error('Error generating steps:', error)
    }
  }

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100))
    setArray(newArray)
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && Array.isArray(currentStep.array)) {
      setArray(currentStep.array)
      setPivotIndex(currentStep.pivotIndex || -1)
      setSortedIndices(currentStep.sortedIndices || [])
      setComparisons(currentStep.comparisons || 0)
      setSwaps(currentStep.swaps || 0)
    }
  }, [state.currentStep, state.visualizationData])

  const getBarColor = (index) => {
    if (index === pivotIndex) return SORT_COLORS.pivot
    if (sortedIndices.includes(index)) return SORT_COLORS.sorted
    return SORT_COLORS.default
  }

  return (
    <div className="w-full">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex space-x-4">
          <button
            onClick={handleSort}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Start Quick Sort
          </button>
          <button
            onClick={generateRandomArray}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Random Array
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex items-end space-x-2 p-4 bg-white rounded-lg shadow-sm">
          {Array.isArray(array) && array.map((value, index) => (
            <motion.div key={`bar-${index}`} className="flex flex-col items-center">
              <div
                className="w-12 rounded-t-md flex items-end justify-center text-white text-sm font-semibold pb-1"
                style={{
                  height: `${(value / Math.max(...array)) * 200 + 40}px`,
                  backgroundColor: getBarColor(index)
                }}
              >
                {value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{index}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-6 text-sm">
        <span>Comparisons: {comparisons}</span>
        <span>Swaps: {swaps}</span>
        <span>Sorted: {sortedIndices.length}</span>
      </div>

      {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-800">
            {state.visualizationData[state.currentStep].description}
          </p>
        </div>
      )}
    </div>
  )
}