import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const SORT_COLORS = {
  default: '#6b7280',
  current: '#3b82f6',
  sorted: '#10b981',
  comparing: '#f59e0b',
  shifting: '#ef4444'
}

export default function InsertionSortVisualizationClean() {
  const { state, setVisualizationData } = useApp()
  const [array, setArray] = useState([12, 11, 13, 5, 6, 7])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [sortedBoundary, setSortedBoundary] = useState(0)
  const [comparingIndex, setComparingIndex] = useState(-1)
  const [comparisons, setComparisons] = useState(0)
  const [shifts, setShifts] = useState(0)

  const generateInsertionSortSteps = useCallback((inputArray) => {
    if (!Array.isArray(inputArray) || inputArray.length === 0) {
      return []
    }

    const steps = []
    const workingArray = Array.from(inputArray)
    const n = workingArray.length
    let totalComparisons = 0
    let totalShifts = 0

    steps.push({
      array: Array.from(workingArray),
      currentIndex: -1,
      sortedBoundary: 1,
      comparingIndex: -1,
      comparisons: 0,
      shifts: 0,
      description: `Starting Insertion Sort. First element ${workingArray[0]} is sorted`,
      operation: 'start'
    })

    for (let i = 1; i < n; i++) {
      const key = workingArray[i]
      
      steps.push({
        array: Array.from(workingArray),
        currentIndex: i,
        sortedBoundary: i,
        comparingIndex: -1,
        comparisons: totalComparisons,
        shifts: totalShifts,
        description: `Taking element ${key} to insert into sorted portion`,
        operation: 'take-element'
      })

      let j = i - 1

      while (j >= 0) {
        totalComparisons++
        
        steps.push({
          array: Array.from(workingArray),
          currentIndex: i,
          sortedBoundary: i,
          comparingIndex: j,
          comparisons: totalComparisons,
          shifts: totalShifts,
          description: `Comparing ${key} with ${workingArray[j]} at index ${j}`,
          operation: 'compare'
        })

        if (workingArray[j] > key) {
          workingArray[j + 1] = workingArray[j]
          totalShifts++
          
          steps.push({
            array: Array.from(workingArray),
            currentIndex: i,
            sortedBoundary: i,
            comparingIndex: j,
            comparisons: totalComparisons,
            shifts: totalShifts,
            description: `${workingArray[j]} > ${key}, shifting right`,
            operation: 'shift'
          })
          
          j--
        } else {
          steps.push({
            array: Array.from(workingArray),
            currentIndex: i,
            sortedBoundary: i,
            comparingIndex: j,
            comparisons: totalComparisons,
            shifts: totalShifts,
            description: `${workingArray[j]} ≤ ${key}, found insertion position`,
            operation: 'found-position'
          })
          break
        }
      }

      workingArray[j + 1] = key
      
      steps.push({
        array: Array.from(workingArray),
        currentIndex: -1,
        sortedBoundary: i + 1,
        comparingIndex: -1,
        comparisons: totalComparisons,
        shifts: totalShifts,
        description: `Inserted ${key} at position ${j + 1}. Sorted portion now extends to index ${i}`,
        operation: 'insert-complete'
      })
    }

    steps.push({
      array: Array.from(workingArray),
      currentIndex: -1,
      sortedBoundary: n,
      comparingIndex: -1,
      comparisons: totalComparisons,
      shifts: totalShifts,
      description: `Insertion Sort complete! ${totalComparisons} comparisons, ${totalShifts} shifts`,
      operation: 'complete'
    })

    return steps
  }, [])

  const handleSort = () => {
    if (!Array.isArray(array) || array.length === 0) {
      return
    }
    
    try {
      const steps = generateInsertionSortSteps(array)
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
      setCurrentIndex(currentStep.currentIndex || -1)
      setSortedBoundary(currentStep.sortedBoundary || 0)
      setComparingIndex(currentStep.comparingIndex || -1)
      setComparisons(currentStep.comparisons || 0)
      setShifts(currentStep.shifts || 0)
    }
  }, [state.currentStep, state.visualizationData])

  const getBarColor = (index) => {
    if (index === currentIndex) return SORT_COLORS.current
    if (index === comparingIndex) return SORT_COLORS.comparing
    if (index < sortedBoundary) return SORT_COLORS.sorted
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
            Start Insertion Sort
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
        <span>Current: {currentIndex >= 0 ? array[currentIndex] : '-'}</span>
        <span>Sorted: {sortedBoundary}</span>
        <span>Comparisons: {comparisons}</span>
        <span>Shifts: {shifts}</span>
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