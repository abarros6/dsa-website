import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const SEARCH_COLORS = {
  default: '#6b7280',
  current: '#3b82f6',
  found: '#10b981',
  eliminated: '#ef4444',
  low: '#8b5cf6',
  high: '#f59e0b',
  mid: '#06b6d4'
}

export default function BinarySearchVisualization() {
  const { state, setVisualizationData } = useApp()
  const [array, setArray] = useState([2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78])
  const [target, setTarget] = useState(23)
  const [low, setLow] = useState(-1)
  const [high, setHigh] = useState(-1)
  const [mid, setMid] = useState(-1)
  const [foundIndex, setFoundIndex] = useState(-1)
  const [eliminatedIndices, setEliminatedIndices] = useState([])
  const [comparisons, setComparisons] = useState(0)
  const [searchComplete, setSearchComplete] = useState(false)

  const generateBinarySearchSteps = useCallback((inputArray, searchTarget) => {
    if (!Array.isArray(inputArray) || inputArray.length === 0) {
      return []
    }

    const steps = []
    const workingArray = Array.from(inputArray).sort((a, b) => a - b)
    let totalComparisons = 0
    let foundAt = -1
    let eliminated = []
    
    let left = 0
    let right = workingArray.length - 1

    steps.push({
      array: Array.from(workingArray),
      target: searchTarget,
      low: left,
      high: right,
      mid: -1,
      foundIndex: -1,
      eliminatedIndices: [],
      comparisons: 0,
      searchComplete: false,
      description: `Starting Binary Search for ${searchTarget}. Array is sorted. Setting low=${left}, high=${right}`,
      operation: 'start'
    })

    while (left <= right) {
      const middle = Math.floor((left + right) / 2)
      totalComparisons++

      steps.push({
        array: Array.from(workingArray),
        target: searchTarget,
        low: left,
        high: right,
        mid: middle,
        foundIndex: -1,
        eliminatedIndices: Array.from(eliminated),
        comparisons: totalComparisons,
        searchComplete: false,
        description: `Calculating mid = floor((${left} + ${right}) / 2) = ${middle}. Checking ${workingArray[middle]}`,
        operation: 'calculate-mid'
      })

      if (workingArray[middle] === searchTarget) {
        foundAt = middle
        steps.push({
          array: Array.from(workingArray),
          target: searchTarget,
          low: left,
          high: right,
          mid: middle,
          foundIndex: middle,
          eliminatedIndices: Array.from(eliminated),
          comparisons: totalComparisons,
          searchComplete: true,
          description: `Found ${searchTarget} at index ${middle}! Binary search completed in ${totalComparisons} comparisons`,
          operation: 'found'
        })
        break
      } else if (workingArray[middle] < searchTarget) {
        for (let i = left; i <= middle; i++) {
          if (!eliminated.includes(i)) eliminated.push(i)
        }
        left = middle + 1
        steps.push({
          array: Array.from(workingArray),
          target: searchTarget,
          low: left,
          high: right,
          mid: middle,
          foundIndex: -1,
          eliminatedIndices: Array.from(eliminated),
          comparisons: totalComparisons,
          searchComplete: false,
          description: `${workingArray[middle]} < ${searchTarget}. Eliminating left half. New low = ${left}`,
          operation: 'eliminate-left'
        })
      } else {
        for (let i = middle; i <= right; i++) {
          if (!eliminated.includes(i)) eliminated.push(i)
        }
        right = middle - 1
        steps.push({
          array: Array.from(workingArray),
          target: searchTarget,
          low: left,
          high: right,
          mid: middle,
          foundIndex: -1,
          eliminatedIndices: Array.from(eliminated),
          comparisons: totalComparisons,
          searchComplete: false,
          description: `${workingArray[middle]} > ${searchTarget}. Eliminating right half. New high = ${right}`,
          operation: 'eliminate-right'
        })
      }
    }

    if (foundAt === -1) {
      steps.push({
        array: Array.from(workingArray),
        target: searchTarget,
        low: left,
        high: right,
        mid: -1,
        foundIndex: -1,
        eliminatedIndices: Array.from(eliminated),
        comparisons: totalComparisons,
        searchComplete: true,
        description: `${searchTarget} not found. Low > High (${left} > ${right}). Binary search completed in ${totalComparisons} comparisons`,
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
      const steps = generateBinarySearchSteps(array, target)
      setVisualizationData(steps, 'search-binary')
    } catch (error) {
      console.error('Error generating search steps:', error)
    }
  }

  const generateRandomArray = () => {
    const length = 8 + Math.floor(Math.random() * 5)
    const newArray = Array.from({ length }, () => Math.floor(Math.random() * 100))
    newArray.sort((a, b) => a - b)
    setArray(newArray)
    setTarget(newArray[Math.floor(Math.random() * newArray.length)])
  }

  const generateRandomTarget = () => {
    if (Math.random() > 0.3 && array.length > 0) {
      setTarget(array[Math.floor(Math.random() * array.length)])
    } else {
      setTarget(Math.floor(Math.random() * 100))
    }
  }

  const sortArray = () => {
    const sortedArray = Array.from(array).sort((a, b) => a - b)
    setArray(sortedArray)
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && Array.isArray(currentStep.array)) {
      setArray(currentStep.array)
      setTarget(currentStep.target || target)
      setLow(currentStep.low || -1)
      setHigh(currentStep.high || -1)
      setMid(currentStep.mid || -1)
      setFoundIndex(currentStep.foundIndex || -1)
      setEliminatedIndices(currentStep.eliminatedIndices || [])
      setComparisons(currentStep.comparisons || 0)
      setSearchComplete(currentStep.searchComplete || false)
    }
  }, [state.currentStep, state.visualizationData, target])

  const getBarColor = (index) => {
    if (foundIndex === index) return SEARCH_COLORS.found
    if (mid === index) return SEARCH_COLORS.mid
    if (low === index) return SEARCH_COLORS.low
    if (high === index) return SEARCH_COLORS.high
    if (eliminatedIndices.includes(index)) return SEARCH_COLORS.eliminated
    return SEARCH_COLORS.default
  }

  const isSorted = array.every((val, i, arr) => i === 0 || arr[i - 1] <= val)

  return (
    <div className="w-full">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap items-center gap-4 mb-3">
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
            disabled={!isSorted}
            className={`px-4 py-2 text-white rounded-md ${
              isSorted ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Start Binary Search
          </button>
          <button
            onClick={generateRandomArray}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Random Sorted Array
          </button>
          <button
            onClick={generateRandomTarget}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          >
            Random Target
          </button>
        </div>
        
        {!isSorted && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-orange-600 font-medium">⚠️ Array must be sorted for binary search!</span>
            <button
              onClick={sortArray}
              className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-xs"
            >
              Sort Array
            </button>
          </div>
        )}
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
        <span>Low: {low >= 0 ? low : '-'}</span>
        <span>Mid: {mid >= 0 ? mid : '-'}</span>
        <span>High: {high >= 0 ? high : '-'}</span>
        <span>Comparisons: {comparisons}</span>
        <span className={`font-semibold ${foundIndex >= 0 ? 'text-green-600' : searchComplete ? 'text-red-600' : 'text-gray-600'}`}>
          Status: {foundIndex >= 0 ? `Found at index ${foundIndex}` : searchComplete ? 'Not Found' : 'Searching...'}
        </span>
      </div>

      {/* Color Legend */}
      <div className="flex justify-center flex-wrap gap-6 text-xs mb-6">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: SEARCH_COLORS.low }}></div>
          <span>Low Pointer</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: SEARCH_COLORS.mid }}></div>
          <span>Mid Point</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: SEARCH_COLORS.high }}></div>
          <span>High Pointer</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: SEARCH_COLORS.found }}></div>
          <span>Found</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: SEARCH_COLORS.eliminated }}></div>
          <span>Eliminated</span>
        </div>
      </div>

      {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && state.visualizationContext === 'search-binary' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-800">
            {state.visualizationData[state.currentStep].description}
          </p>
        </div>
      )}
    </div>
  )
}