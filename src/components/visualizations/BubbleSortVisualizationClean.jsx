import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const SORT_COLORS = {
  default: '#6b7280',
  comparing: '#f59e0b',
  swapping: '#ef4444',
  sorted: '#10b981',
  current: '#3b82f6'
}

export default function BubbleSortVisualizationClean() {
  const { state, setVisualizationData } = useApp()
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90])
  const [comparingIndices, setComparingIndices] = useState([])
  const [swappingIndices, setSwappingIndices] = useState([])
  const [sortedIndices, setSortedIndices] = useState([])
  const [currentPass, setCurrentPass] = useState(0)
  const [comparisons, setComparisons] = useState(0)
  const [swaps, setSwaps] = useState(0)

  const generateBubbleSortSteps = useCallback((inputArray) => {
    console.log('Starting bubble sort with array:', inputArray)
    
    if (!Array.isArray(inputArray) || inputArray.length === 0) {
      console.error('Invalid input array')
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

    console.log('Generated', steps.length, 'steps')
    return steps
  }, [])

  const handleSort = () => {
    if (!Array.isArray(array) || array.length === 0) {
      console.error('Invalid array for sorting')
      return
    }
    
    try {
      const steps = generateBubbleSortSteps(array)
      setVisualizationData(steps)
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
      setComparingIndices(currentStep.comparingIndices || [])
      setSwappingIndices(currentStep.swappingIndices || [])
      setSortedIndices(currentStep.sortedIndices || [])
      setCurrentPass(currentStep.currentPass || 0)
      setComparisons(currentStep.comparisons || 0)
      setSwaps(currentStep.swaps || 0)
    }
  }, [state.currentStep, state.visualizationData])

  const getBarColor = (index) => {
    if (swappingIndices.includes(index)) return SORT_COLORS.swapping
    if (comparingIndices.includes(index)) return SORT_COLORS.comparing
    if (sortedIndices.includes(index)) return SORT_COLORS.sorted
    return SORT_COLORS.default
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex space-x-4">
          <button
            onClick={handleSort}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Start Bubble Sort
          </button>
          <button
            onClick={generateRandomArray}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Random Array
          </button>
        </div>
      </div>

      {/* Array Visualization */}
      <div className="flex justify-center mb-6">
        <div className="flex items-end space-x-2 p-4 bg-white rounded-lg shadow-sm">
          {Array.isArray(array) && array.map((value, index) => (
            <motion.div
              key={`bar-${index}`}
              className="flex flex-col items-center"
            >
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

      {/* Stats */}
      <div className="flex justify-center space-x-6 text-sm">
        <span>Pass: {currentPass}</span>
        <span>Comparisons: {comparisons}</span>
        <span>Swaps: {swaps}</span>
      </div>

      {/* Description */}
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