import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const ARRAY_COLORS = {
  default: '#e2e8f0',
  highlight: '#3b82f6',
  comparing: '#f59e0b',
  found: '#10b981',
  empty: '#f8fafc'
}

export default function ArrayVisualization() {
  const { state, setVisualizationData } = useApp()
  const [array, setArray] = useState([10, 25, 3, 47, 18, 92, 33, 7])
  const [capacity, setCapacity] = useState(12)
  const [highlightedIndices, setHighlightedIndices] = useState([])
  const [operation, setOperation] = useState(null)

  const generateVisualizationData = useCallback((arr, op) => {
    const steps = []
    
    switch (op?.type) {
      case 'insert':
        const insertIndex = op.index
        const value = op.value
        
        for (let i = 0; i < arr.length; i++) {
          steps.push({
            array: [...arr],
            highlightedIndices: i === insertIndex ? [i] : [],
            description: i === insertIndex ? 
              `Inserting ${value} at index ${insertIndex}` : 
              `Checking index ${i}`,
            operation: 'insert',
            currentIndex: i
          })
        }
        
        const newArr = [...arr]
        newArr[insertIndex] = value
        steps.push({
          array: newArr,
          highlightedIndices: [insertIndex],
          description: `Successfully inserted ${value} at index ${insertIndex}`,
          operation: 'insert',
          completed: true
        })
        break
        
      case 'search':
        const searchValue = op.value
        
        for (let i = 0; i < arr.length; i++) {
          steps.push({
            array: [...arr],
            highlightedIndices: [i],
            description: `Checking index ${i}: ${arr[i]} ${arr[i] === searchValue ? '==' : '!='} ${searchValue}`,
            operation: 'search',
            currentIndex: i,
            found: arr[i] === searchValue
          })
          
          if (arr[i] === searchValue) {
            steps.push({
              array: [...arr],
              highlightedIndices: [i],
              description: `Found ${searchValue} at index ${i}!`,
              operation: 'search',
              completed: true,
              found: true,
              foundIndex: i
            })
            break
          }
        }
        break
        
      case 'resize':
        const newCapacity = op.newCapacity
        steps.push({
          array: [...arr],
          capacity: capacity,
          highlightedIndices: [],
          description: `Current capacity: ${capacity}, need to resize to ${newCapacity}`,
          operation: 'resize'
        })
        
        steps.push({
          array: [...arr],
          capacity: newCapacity,
          highlightedIndices: [],
          description: `Resized array capacity from ${capacity} to ${newCapacity}`,
          operation: 'resize',
          completed: true
        })
        break
    }
    
    return steps
  }, [capacity])

  const handleInsert = (index, value) => {
    const op = { type: 'insert', index: parseInt(index), value: parseInt(value) }
    const steps = generateVisualizationData(array, op)
    setVisualizationData(steps, 'array-insert')
    setOperation(op)
  }

  const handleSearch = (value) => {
    const op = { type: 'search', value: parseInt(value) }
    const steps = generateVisualizationData(array, op)
    setVisualizationData(steps, 'array-search')
    setOperation(op)
  }

  const handleResize = (newCapacity) => {
    const op = { type: 'resize', newCapacity: parseInt(newCapacity) }
    const steps = generateVisualizationData(array, op)
    setVisualizationData(steps, 'array-resize')
    setOperation(op)
    setCapacity(parseInt(newCapacity))
  }

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 6 + Math.floor(Math.random() * 6) }, 
      () => Math.floor(Math.random() * 100))
    setArray(newArray)
    setHighlightedIndices([])
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep) {
      setArray(currentStep.array)
      setHighlightedIndices(currentStep.highlightedIndices || [])
      if (currentStep.capacity) {
        setCapacity(currentStep.capacity)
      }
    }
  }, [state.currentStep, state.visualizationData])

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Insert Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Insert</label>
            <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
              <input
                type="number"
                id="insert-index"
                placeholder="Index"
                className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                min="0"
                max={array.length}
              />
              <input
                type="number"
                id="insert-value"
                placeholder="Value"
                className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <button
              onClick={() => {
                const index = document.getElementById('insert-index').value
                const value = document.getElementById('insert-value').value
                if (index !== '' && value !== '') {
                  handleInsert(index, value)
                }
              }}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Insert
            </button>
          </div>

          {/* Search Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="number"
              id="search-value"
              placeholder="Value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={() => {
                const value = document.getElementById('search-value').value
                if (value !== '') {
                  handleSearch(value)
                }
              }}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
            >
              Search
            </button>
          </div>

          {/* Utility Controls */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Utilities</label>
            <div className="flex space-x-2 mb-2">
              <button
                onClick={generateRandomArray}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Random
              </button>
              <input
                type="number"
                id="new-capacity"
                placeholder="New size"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                min={array.length}
                max="20"
              />
            </div>
            <button
              onClick={() => {
                const newCap = document.getElementById('new-capacity').value
                if (newCap !== '') {
                  handleResize(newCap)
                }
              }}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
            >
              Resize
            </button>
          </div>
        </div>
      </div>

      {/* Array Visualization */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full overflow-x-auto">
          <div className="flex items-center justify-center space-x-1 p-4 pb-8 bg-white rounded-lg shadow-sm min-w-max">
            {Array.from({ length: capacity }, (_, index) => {
            const hasValue = index < array.length
            const value = hasValue ? array[index] : null
            const isHighlighted = highlightedIndices.includes(index)
            
            return (
              <motion.div
                key={`cell-${index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  backgroundColor: isHighlighted ? ARRAY_COLORS.highlight : 
                                  hasValue ? ARRAY_COLORS.default : ARRAY_COLORS.empty
                }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative"
              >
                {/* Array Cell */}
                <div className={`
                  w-16 h-16 border-2 border-gray-300 flex items-center justify-center
                  text-lg font-semibold rounded-lg transition-all duration-300
                  ${isHighlighted ? 'text-white shadow-lg scale-110' : 'text-gray-700'}
                  ${!hasValue ? 'border-dashed border-gray-200 bg-gray-50' : ''}
                `}>
                  {hasValue ? value : ''}
                </div>
                
                {/* Index Label */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
                  {index}
                </div>
              </motion.div>
            )
          })}
          </div>
        </div>

        {/* Array Info */}
        <div className="flex space-x-6 text-sm text-gray-600">
          <span>Length: <span className="font-medium text-gray-900">{array.length}</span></span>
          <span>Capacity: <span className="font-medium text-gray-900">{capacity}</span></span>
          <span>Usage: <span className="font-medium text-gray-900">{((array.length / capacity) * 100).toFixed(1)}%</span></span>
        </div>

        {/* Current Operation Description */}
        <AnimatePresence>
          {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && 
          state.visualizationContext?.startsWith('array-') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-lg text-center"
            >
              <p className="text-blue-800 font-medium">
                {state.visualizationData[state.currentStep].description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}