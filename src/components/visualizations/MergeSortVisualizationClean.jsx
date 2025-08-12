import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const SORT_COLORS = {
  default: '#6b7280',
  dividing: '#3b82f6',
  merging: '#f59e0b',
  comparing: '#8b5cf6',
  sorted: '#10b981',
  leftSubarray: '#60a5fa',
  rightSubarray: '#fbbf24'
}

export default function MergeSortVisualizationClean() {
  const { state, setVisualizationData } = useApp()
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10])
  const [operations, setOperations] = useState(0)

  const generateMergeSortSteps = useCallback((inputArray) => {
    if (!Array.isArray(inputArray) || inputArray.length === 0) {
      return []
    }

    const steps = []
    const workingArray = Array.from(inputArray)
    let totalOperations = 0

    steps.push({
      array: Array.from(workingArray),
      operations: 0,
      description: `Starting Merge Sort with ${workingArray.length} elements`,
      operation: 'start'
    })

    const mergeSort = (arr, left, right) => {
      if (left >= right) return

      const mid = Math.floor((left + right) / 2)

      steps.push({
        array: Array.from(arr),
        operations: totalOperations,
        description: `Dividing array from ${left} to ${right} at midpoint ${mid}`,
        operation: 'divide'
      })

      mergeSort(arr, left, mid)
      mergeSort(arr, mid + 1, right)
      merge(arr, left, mid, right)
    }

    const merge = (arr, left, mid, right) => {
      const leftArr = []
      const rightArr = []

      for (let i = left; i <= mid; i++) {
        leftArr.push(arr[i])
      }
      for (let j = mid + 1; j <= right; j++) {
        rightArr.push(arr[j])
      }

      steps.push({
        array: Array.from(arr),
        operations: totalOperations,
        description: `Merging [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`,
        operation: 'merge-start'
      })

      let i = 0, j = 0, k = left

      while (i < leftArr.length && j < rightArr.length) {
        totalOperations++
        
        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i]
          steps.push({
            array: Array.from(arr),
            operations: totalOperations,
            description: `${leftArr[i]} ≤ ${rightArr[j]}, placed ${leftArr[i]} at position ${k}`,
            operation: 'place-left'
          })
          i++
        } else {
          arr[k] = rightArr[j]
          steps.push({
            array: Array.from(arr),
            operations: totalOperations,
            description: `${rightArr[j]} < ${leftArr[i]}, placed ${rightArr[j]} at position ${k}`,
            operation: 'place-right'
          })
          j++
        }
        k++
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i]
        steps.push({
          array: Array.from(arr),
          operations: totalOperations,
          description: `Copying remaining ${leftArr[i]} from left array`,
          operation: 'copy-left'
        })
        i++
        k++
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j]
        steps.push({
          array: Array.from(arr),
          operations: totalOperations,
          description: `Copying remaining ${rightArr[j]} from right array`,
          operation: 'copy-right'
        })
        j++
        k++
      }

      steps.push({
        array: Array.from(arr),
        operations: totalOperations,
        description: `Merge complete for range [${left}..${right}]`,
        operation: 'merge-complete'
      })
    }

    mergeSort(workingArray, 0, workingArray.length - 1)

    steps.push({
      array: Array.from(workingArray),
      operations: totalOperations,
      description: `Merge Sort complete! Array sorted in ${totalOperations} operations`,
      operation: 'complete'
    })

    return steps
  }, [])

  const handleSort = () => {
    if (!Array.isArray(array) || array.length === 0) {
      return
    }
    
    try {
      const steps = generateMergeSortSteps(array)
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
      setOperations(currentStep.operations || 0)
    }
  }, [state.currentStep, state.visualizationData])

  return (
    <div className="w-full">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex space-x-4">
          <button
            onClick={handleSort}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Start Merge Sort
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
                  backgroundColor: SORT_COLORS.default
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
        <span>Operations: {operations}</span>
        <span>Array Size: {array.length}</span>
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