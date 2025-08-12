import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const SEARCH_COLORS = {
  default: '#6b7280',
  current: '#3b82f6',
  found: '#10b981',
  notFound: '#ef4444',
  target: '#f59e0b'
}

export default function LinearSearchVisualization() {
  const { state, setVisualizationData } = useApp()
  const [array, setArray] = useState([34, 7, 23, 32, 5, 62, 32, 12, 9, 45])
  const [target, setTarget] = useState(32)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [foundIndex, setFoundIndex] = useState(-1)
  const [comparisons, setComparisons] = useState(0)
  const [searchComplete, setSearchComplete] = useState(false)

  const generateLinearSearchSteps = useCallback((inputArray, searchTarget) => {
    if (!Array.isArray(inputArray) || inputArray.length === 0) {
      return []
    }

    const steps = []
    const workingArray = Array.from(inputArray)
    let totalComparisons = 0
    let foundAt = -1

    steps.push({
      array: Array.from(workingArray),
      target: searchTarget,
      currentIndex: -1,
      foundIndex: -1,
      comparisons: 0,
      searchComplete: false,
      description: `Starting Linear Search for ${searchTarget} in array of ${workingArray.length} elements`,
      operation: 'start'
    })

    for (let i = 0; i < workingArray.length; i++) {
      totalComparisons++
      
      steps.push({
        array: Array.from(workingArray),
        target: searchTarget,
        currentIndex: i,
        foundIndex: -1,
        comparisons: totalComparisons,
        searchComplete: false,
        description: `Checking element ${workingArray[i]} at index ${i}`,
        operation: 'compare'
      })

      if (workingArray[i] === searchTarget) {
        foundAt = i
        steps.push({
          array: Array.from(workingArray),
          target: searchTarget,
          currentIndex: i,
          foundIndex: i,
          comparisons: totalComparisons,
          searchComplete: true,
          description: `Found ${searchTarget} at index ${i}! Search completed in ${totalComparisons} comparisons`,
          operation: 'found'
        })
        break
      } else {
        steps.push({
          array: Array.from(workingArray),
          target: searchTarget,
          currentIndex: i,
          foundIndex: -1,
          comparisons: totalComparisons,
          searchComplete: false,
          description: `${workingArray[i]} ≠ ${searchTarget}, continue searching...`,
          operation: 'not-match'
        })
      }
    }

    if (foundAt === -1) {
      steps.push({
        array: Array.from(workingArray),
        target: searchTarget,
        currentIndex: -1,
        foundIndex: -1,
        comparisons: totalComparisons,
        searchComplete: true,
        description: `${searchTarget} not found in array. Searched all ${workingArray.length} elements`,
        operation: 'not-found'
      })
    }

    return steps
  }, [])

  const handleSearch = () => {
    if (!Array.isArray(array) || array.length === 0) {
      return
    }
    
    try {
      const steps = generateLinearSearchSteps(array, target)
      setVisualizationData(steps)
    } catch (error) {
      console.error('Error generating search steps:', error)
    }
  }

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))
    setArray(newArray)
    setTarget(newArray[Math.floor(Math.random() * newArray.length)])
  }

  const generateRandomTarget = () => {
    if (Math.random() > 0.5 && array.length > 0) {
      setTarget(array[Math.floor(Math.random() * array.length)])
    } else {
      setTarget(Math.floor(Math.random() * 100))
    }
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && Array.isArray(currentStep.array)) {
      setArray(currentStep.array)
      setTarget(currentStep.target || target)
      setCurrentIndex(currentStep.currentIndex || -1)
      setFoundIndex(currentStep.foundIndex || -1)
      setComparisons(currentStep.comparisons || 0)
      setSearchComplete(currentStep.searchComplete || false)
    }
  }, [state.currentStep, state.visualizationData, target])

  const getBarColor = (index) => {
    if (foundIndex === index) return SEARCH_COLORS.found
    if (currentIndex === index) return SEARCH_COLORS.current
    if (searchComplete && foundIndex === -1) return SEARCH_COLORS.notFound
    return SEARCH_COLORS.default
  }

  return (
    <div className="w-full">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="target" className="text-sm font-medium">
              Search for:
            </label>
            <input
              id="target"
              type="number"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
              className="w-20 px-2 py-1 border rounded-md text-center"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Start Linear Search
          </button>
          <button
            onClick={generateRandomArray}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Random Array
          </button>
          <button
            onClick={generateRandomTarget}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          >
            Random Target
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex items-end space-x-1 p-4 bg-white rounded-lg shadow-sm">
          {Array.isArray(array) && array.map((value, index) => (
            <motion.div key={`bar-${index}`} className="flex flex-col items-center">
              <div
                className="w-10 rounded-t-md flex items-end justify-center text-white text-xs font-semibold pb-1"
                style={{
                  height: `${(value / Math.max(...array)) * 150 + 30}px`,
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

      <div className="flex justify-center space-x-8 text-sm mb-4">
        <span>Target: <span className="font-semibold text-yellow-600">{target}</span></span>
        <span>Current Index: {currentIndex >= 0 ? currentIndex : '-'}</span>
        <span>Comparisons: {comparisons}</span>
        <span className={`font-semibold ${foundIndex >= 0 ? 'text-green-600' : searchComplete ? 'text-red-600' : 'text-gray-600'}`}>
          Status: {foundIndex >= 0 ? `Found at index ${foundIndex}` : searchComplete ? 'Not Found' : 'Searching...'}
        </span>
      </div>

      {/* Color Legend */}
      <div className="flex justify-center space-x-6 text-xs mb-6">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: SEARCH_COLORS.current }}></div>
          <span>Current</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: SEARCH_COLORS.found }}></div>
          <span>Found</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: SEARCH_COLORS.default }}></div>
          <span>Unchecked</span>
        </div>
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