import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const SORT_COLORS = {
  default: '#6b7280',
  current: '#3b82f6',
  minimum: '#f59e0b',
  sorted: '#10b981',
  comparing: '#8b5cf6'
}

export default function SelectionSortVisualizationClean() {
  const { state, setVisualizationData } = useApp()
  const [array, setArray] = useState([64, 25, 12, 22, 11, 90, 34])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [minIndex, setMinIndex] = useState(-1)
  const [comparingIndex, setComparingIndex] = useState(-1)
  const [sortedIndices, setSortedIndices] = useState([])
  const [comparisons, setComparisons] = useState(0)
  const [swaps, setSwaps] = useState(0)

  const generateSelectionSortSteps = useCallback((inputArray) => {
    if (!Array.isArray(inputArray) || inputArray.length === 0) {
      return []
    }

    const steps = []
    const workingArray = Array.from(inputArray)
    const n = workingArray.length
    let totalComparisons = 0
    let totalSwaps = 0
    const sortedPositions = []

    steps.push({
      array: Array.from(workingArray),
      currentIndex: -1,
      minIndex: -1,
      comparingIndex: -1,
      sortedIndices: [],
      comparisons: 0,
      swaps: 0,
      description: `Starting Selection Sort with ${n} elements`,
      operation: 'start'
    })

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i

      steps.push({
        array: Array.from(workingArray),
        currentIndex: i,
        minIndex: minIdx,
        comparingIndex: -1,
        sortedIndices: Array.from(sortedPositions),
        comparisons: totalComparisons,
        swaps: totalSwaps,
        description: `Finding minimum in unsorted portion starting at index ${i}`,
        operation: 'start-iteration'
      })

      for (let j = i + 1; j < n; j++) {
        totalComparisons++
        
        steps.push({
          array: Array.from(workingArray),
          currentIndex: i,
          minIndex: minIdx,
          comparingIndex: j,
          sortedIndices: Array.from(sortedPositions),
          comparisons: totalComparisons,
          swaps: totalSwaps,
          description: `Comparing ${workingArray[j]} with current minimum ${workingArray[minIdx]}`,
          operation: 'compare'
        })

        if (workingArray[j] < workingArray[minIdx]) {
          minIdx = j
          steps.push({
            array: Array.from(workingArray),
            currentIndex: i,
            minIndex: minIdx,
            comparingIndex: j,
            sortedIndices: Array.from(sortedPositions),
            comparisons: totalComparisons,
            swaps: totalSwaps,
            description: `Found new minimum: ${workingArray[j]} at index ${j}`,
            operation: 'new-minimum'
          })
        }
      }

      if (minIdx !== i) {
        const temp = workingArray[i]
        workingArray[i] = workingArray[minIdx]
        workingArray[minIdx] = temp
        totalSwaps++

        steps.push({
          array: Array.from(workingArray),
          currentIndex: i,
          minIndex: minIdx,
          comparingIndex: -1,
          sortedIndices: Array.from(sortedPositions),
          comparisons: totalComparisons,
          swaps: totalSwaps,
          description: `Swapped ${workingArray[i]} with ${workingArray[minIdx]}`,
          operation: 'swap'
        })
      }

      sortedPositions.push(i)
      steps.push({
        array: Array.from(workingArray),
        currentIndex: -1,
        minIndex: -1,
        comparingIndex: -1,
        sortedIndices: Array.from(sortedPositions),
        comparisons: totalComparisons,
        swaps: totalSwaps,
        description: `Position ${i} is now sorted with value ${workingArray[i]}`,
        operation: 'position-sorted'
      })
    }

    sortedPositions.push(n - 1)
    steps.push({
      array: Array.from(workingArray),
      currentIndex: -1,
      minIndex: -1,
      comparingIndex: -1,
      sortedIndices: Array.from(sortedPositions),
      comparisons: totalComparisons,
      swaps: totalSwaps,
      description: `Selection Sort complete! ${totalComparisons} comparisons, ${totalSwaps} swaps`,
      operation: 'complete'
    })

    return steps
  }, [])

  const handleSort = () => {
    if (!Array.isArray(array) || array.length === 0) {
      return
    }
    
    try {
      const steps = generateSelectionSortSteps(array)
      setVisualizationData(steps, 'sorting-selection')
    } catch (error) {
      console.error('Error generating steps:', error)
    }
  }

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
    setArray(newArray)
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && Array.isArray(currentStep.array)) {
      setArray(currentStep.array)
      setCurrentIndex(currentStep.currentIndex || -1)
      setMinIndex(currentStep.minIndex || -1)
      setComparingIndex(currentStep.comparingIndex || -1)
      setSortedIndices(currentStep.sortedIndices || [])
      setComparisons(currentStep.comparisons || 0)
      setSwaps(currentStep.swaps || 0)
    }
  }, [state.currentStep, state.visualizationData])

  const getBarColor = (index) => {
    if (sortedIndices.includes(index)) return SORT_COLORS.sorted
    if (index === minIndex) return SORT_COLORS.minimum
    if (index === currentIndex) return SORT_COLORS.current
    if (index === comparingIndex) return SORT_COLORS.comparing
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
            Start Selection Sort
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
        <span>Current: {currentIndex >= 0 ? currentIndex : '-'}</span>
        <span>Comparisons: {comparisons}</span>
        <span>Swaps: {swaps}</span>
      </div>

      {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && state.visualizationContext === 'sorting-selection' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-800">
            {state.visualizationData[state.currentStep].description}
          </p>
        </div>
      )}
    </div>
  )
}