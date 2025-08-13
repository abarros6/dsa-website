import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const BENCHMARK_COLORS = {
  running: '#f59e0b',
  completed: '#10b981',
  error: '#ef4444',
  pending: '#6b7280'
}

// Simulated algorithm implementations for benchmarking
const SORTING_ALGORITHMS = {
  'Bubble Sort': (arr) => {
    const array = [...arr]
    let operations = 0
    const n = array.length
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        operations++
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]]
          operations++
        }
      }
    }
    return { sorted: array, operations }
  },
  
  'Selection Sort': (arr) => {
    const array = [...arr]
    let operations = 0
    const n = array.length
    
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i
      for (let j = i + 1; j < n; j++) {
        operations++
        if (array[j] < array[minIdx]) {
          minIdx = j
        }
      }
      if (minIdx !== i) {
        [array[i], array[minIdx]] = [array[minIdx], array[i]]
        operations++
      }
    }
    return { sorted: array, operations }
  },
  
  'Insertion Sort': (arr) => {
    const array = [...arr]
    let operations = 0
    
    for (let i = 1; i < array.length; i++) {
      let current = array[i]
      let j = i - 1
      operations++
      
      while (j >= 0 && array[j] > current) {
        operations++
        array[j + 1] = array[j]
        j--
      }
      array[j + 1] = current
      operations++
    }
    return { sorted: array, operations }
  },
  
  'Quick Sort': (arr) => {
    let operations = 0
    
    const quickSort = (array, low = 0, high = array.length - 1) => {
      if (low < high) {
        const pi = partition(array, low, high)
        quickSort(array, low, pi - 1)
        quickSort(array, pi + 1, high)
      }
    }
    
    const partition = (array, low, high) => {
      const pivot = array[high]
      let i = low - 1
      
      for (let j = low; j < high; j++) {
        operations++
        if (array[j] < pivot) {
          i++
          [array[i], array[j]] = [array[j], array[i]]
          operations++
        }
      }
      [array[i + 1], array[high]] = [array[high], array[i + 1]]
      operations++
      return i + 1
    }
    
    const array = [...arr]
    quickSort(array)
    return { sorted: array, operations }
  },
  
  'Merge Sort': (arr) => {
    let operations = 0
    
    const mergeSort = (array) => {
      if (array.length <= 1) return array
      
      const mid = Math.floor(array.length / 2)
      const left = mergeSort(array.slice(0, mid))
      const right = mergeSort(array.slice(mid))
      
      return merge(left, right)
    }
    
    const merge = (left, right) => {
      const result = []
      let i = 0, j = 0
      
      while (i < left.length && j < right.length) {
        operations++
        if (left[i] <= right[j]) {
          result.push(left[i])
          i++
        } else {
          result.push(right[j])
          j++
        }
      }
      
      return result.concat(left.slice(i)).concat(right.slice(j))
    }
    
    const sorted = mergeSort([...arr])
    return { sorted, operations }
  }
}

const SEARCH_ALGORITHMS = {
  'Linear Search': (arr, target) => {
    let operations = 0
    for (let i = 0; i < arr.length; i++) {
      operations++
      if (arr[i] === target) {
        return { found: true, index: i, operations }
      }
    }
    return { found: false, index: -1, operations }
  },
  
  'Binary Search': (arr, target) => {
    const sortedArr = [...arr].sort((a, b) => a - b)
    let operations = 0
    let left = 0
    let right = sortedArr.length - 1
    
    while (left <= right) {
      operations++
      const mid = Math.floor((left + right) / 2)
      
      if (sortedArr[mid] === target) {
        return { found: true, index: mid, operations }
      } else if (sortedArr[mid] < target) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
    
    return { found: false, index: -1, operations }
  }
}

export default function AlgorithmBenchmark() {
  const { state, setVisualizationData } = useApp()
  const [benchmarkType, setBenchmarkType] = useState('sorting')
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(['Bubble Sort', 'Quick Sort', 'Merge Sort'])
  const [inputSizes, setInputSizes] = useState([100, 500, 1000, 2000])
  const [benchmarkResults, setBenchmarkResults] = useState({})
  const [isRunning, setIsRunning] = useState(false)
  const [currentProgress, setCurrentProgress] = useState({ algorithm: '', size: 0, progress: 0 })

  const generateRandomArray = (size) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 1000))
  }

  const runBenchmark = async () => {
    setIsRunning(true)
    setBenchmarkResults({})
    const results = {}
    
    const steps = []
    let stepIndex = 0
    
    const totalTests = selectedAlgorithms.length * inputSizes.length
    
    for (const algorithm of selectedAlgorithms) {
      results[algorithm] = {}
      
      for (const size of inputSizes) {
        setCurrentProgress({ 
          algorithm, 
          size, 
          progress: Math.floor((stepIndex / totalTests) * 100) 
        })
        
        // Generate test data
        const testArray = generateRandomArray(size)
        const target = testArray[Math.floor(Math.random() * testArray.length)]
        
        // Run algorithm and measure performance
        const startTime = performance.now()
        let result
        
        try {
          if (benchmarkType === 'sorting') {
            result = SORTING_ALGORITHMS[algorithm](testArray)
          } else {
            result = SEARCH_ALGORITHMS[algorithm](testArray, target)
          }
          
          const endTime = performance.now()
          const executionTime = endTime - startTime
          
          results[algorithm][size] = {
            executionTime: executionTime.toFixed(3),
            operations: result.operations,
            status: 'completed'
          }
          
          steps.push({
            algorithm,
            size,
            result: results[algorithm][size],
            description: `${algorithm} completed for size ${size}: ${executionTime.toFixed(2)}ms, ${result.operations} operations`,
            operation: 'benchmark',
            phase: 'completed',
            progress: Math.floor(((stepIndex + 1) / totalTests) * 100)
          })
          
        } catch (error) {
          results[algorithm][size] = {
            executionTime: 'Error',
            operations: 0,
            status: 'error',
            error: error.message
          }
          
          steps.push({
            algorithm,
            size,
            result: results[algorithm][size],
            description: `${algorithm} failed for size ${size}: ${error.message}`,
            operation: 'benchmark',
            phase: 'error',
            progress: Math.floor(((stepIndex + 1) / totalTests) * 100)
          })
        }
        
        stepIndex++
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    setBenchmarkResults(results)
    setVisualizationData(steps, 'algorithm-benchmark')
    setIsRunning(false)
    setCurrentProgress({ algorithm: '', size: 0, progress: 100 })
  }

  const handleAlgorithmToggle = (algorithm) => {
    setSelectedAlgorithms(prev => 
      prev.includes(algorithm)
        ? prev.filter(a => a !== algorithm)
        : [...prev, algorithm]
    )
  }

  const renderBenchmarkTable = () => {
    if (Object.keys(benchmarkResults).length === 0) return null

    return (
      <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Algorithm
                </th>
                {inputSizes.map(size => (
                  <th key={size} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    n = {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedAlgorithms.map((algorithm, algorithmIndex) => (
                <motion.tr
                  key={algorithm}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: algorithmIndex * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {algorithm}
                  </td>
                  {inputSizes.map(size => {
                    const result = benchmarkResults[algorithm]?.[size]
                    if (!result) return <td key={size} className="px-4 py-3 text-center">-</td>
                    
                    return (
                      <td key={size} className="px-4 py-3 text-center">
                        <div className="space-y-1">
                          <div className={`text-sm font-medium ${
                            result.status === 'completed' ? 'text-gray-900' :
                            result.status === 'error' ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {result.executionTime}ms
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.operations?.toLocaleString()} ops
                          </div>
                        </div>
                      </td>
                    )
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderPerformanceChart = () => {
    if (Object.keys(benchmarkResults).length === 0) return null

    const chartHeight = 300
    const chartWidth = 600
    const margin = { top: 20, right: 60, bottom: 60, left: 80 }
    const innerWidth = chartWidth - margin.left - margin.right
    const innerHeight = chartHeight - margin.top - margin.bottom

    // Find max time for scaling
    const maxTime = Math.max(...selectedAlgorithms.flatMap(algorithm => 
      inputSizes.map(size => parseFloat(benchmarkResults[algorithm]?.[size]?.executionTime || 0))
    ))

    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-center mb-4">Performance Comparison</h3>
        <svg width={chartWidth} height={chartHeight} className="w-full">
          {/* Grid lines */}
          {Array.from({ length: 6 }, (_, i) => {
            const y = margin.top + (innerHeight / 5) * i
            return (
              <line
                key={`grid-${i}`}
                x1={margin.left}
                y1={y}
                x2={chartWidth - margin.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
            )
          })}
          
          {/* Y-axis labels */}
          {Array.from({ length: 6 }, (_, i) => {
            const value = (maxTime - (maxTime / 5) * i).toFixed(1)
            const y = margin.top + (innerHeight / 5) * i
            return (
              <text
                key={`y-label-${i}`}
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {value}ms
              </text>
            )
          })}
          
          {/* X-axis labels */}
          {inputSizes.map((size, i) => {
            const x = margin.left + (innerWidth / (inputSizes.length - 1)) * i
            return (
              <text
                key={`x-label-${i}`}
                x={x}
                y={chartHeight - margin.bottom + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {size}
              </text>
            )
          })}
          
          {/* Algorithm lines */}
          {selectedAlgorithms.map((algorithm, algorithmIndex) => {
            const points = inputSizes.map((size, i) => {
              const x = margin.left + (innerWidth / (inputSizes.length - 1)) * i
              const time = parseFloat(benchmarkResults[algorithm]?.[size]?.executionTime || 0)
              const y = margin.top + innerHeight - (time / maxTime) * innerHeight
              return `${x},${y}`
            }).join(' ')

            return (
              <g key={algorithm}>
                <motion.polyline
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: algorithmIndex * 0.2 }}
                  points={points}
                  fill="none"
                  stroke={colors[algorithmIndex % colors.length]}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                
                {/* Data points */}
                {inputSizes.map((size, i) => {
                  const x = margin.left + (innerWidth / (inputSizes.length - 1)) * i
                  const time = parseFloat(benchmarkResults[algorithm]?.[size]?.executionTime || 0)
                  const y = margin.top + innerHeight - (time / maxTime) * innerHeight
                  
                  return (
                    <motion.circle
                      key={`${algorithm}-${size}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: algorithmIndex * 0.2 + i * 0.1 }}
                      cx={x}
                      cy={y}
                      r={4}
                      fill={colors[algorithmIndex % colors.length]}
                    />
                  )
                })}
              </g>
            )
          })}
          
          {/* Axis labels */}
          <text
            x={chartWidth / 2}
            y={chartHeight - 10}
            textAnchor="middle"
            className="text-sm font-medium fill-gray-700"
          >
            Input Size
          </text>
          
          <text
            x={20}
            y={chartHeight / 2}
            textAnchor="middle"
            className="text-sm font-medium fill-gray-700"
            transform={`rotate(-90, 20, ${chartHeight / 2})`}
          >
            Execution Time (ms)
          </text>
        </svg>
      </div>
    )
  }

  const availableAlgorithms = benchmarkType === 'sorting' 
    ? Object.keys(SORTING_ALGORITHMS)
    : Object.keys(SEARCH_ALGORITHMS)

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Benchmark Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Benchmark Type</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="sorting"
                  checked={benchmarkType === 'sorting'}
                  onChange={(e) => setBenchmarkType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Sorting Algorithms</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="searching"
                  checked={benchmarkType === 'searching'}
                  onChange={(e) => setBenchmarkType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Search Algorithms</span>
              </label>
            </div>
          </div>

          {/* Algorithm Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Algorithms</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableAlgorithms.map(algorithm => (
                <label key={algorithm} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedAlgorithms.includes(algorithm)}
                    onChange={() => handleAlgorithmToggle(algorithm)}
                    className="mr-2"
                  />
                  <span className="text-sm">{algorithm}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Input Sizes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Input Sizes</label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="e.g., 100,500,1000,2000"
                value={inputSizes.join(',')}
                onChange={(e) => {
                  const sizes = e.target.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
                  setInputSizes(sizes)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <button
                onClick={runBenchmark}
                disabled={isRunning || selectedAlgorithms.length === 0}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm font-medium"
              >
                {isRunning ? 'Running...' : 'Run Benchmark'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      {isRunning && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">
              Testing: {currentProgress.algorithm} (n = {currentProgress.size})
            </span>
            <span className="text-sm text-blue-600">{currentProgress.progress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {/* Performance Chart */}
        {Object.keys(benchmarkResults).length > 0 && renderPerformanceChart()}

        {/* Results Table */}
        {Object.keys(benchmarkResults).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Results</h3>
            {renderBenchmarkTable()}
          </div>
        )}

        {/* Legend */}
        {Object.keys(benchmarkResults).length > 0 && (
          <div className="flex justify-center flex-wrap gap-4 text-sm">
            {selectedAlgorithms.map((algorithm, index) => {
              const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
              return (
                <div key={algorithm} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <span>{algorithm}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Benchmarking Notes</h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <div><strong>Execution Time:</strong> Real browser JavaScript performance</div>
          <div><strong>Operations:</strong> Algorithm-specific operation count</div>
          <div><strong>Note:</strong> Results may vary based on browser and system performance</div>
        </div>
      </div>
    </div>
  )
}