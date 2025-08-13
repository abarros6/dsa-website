import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const COMPLEXITY_COLORS = {
  'O(1)': '#10b981',        // Green - Constant
  'O(log n)': '#3b82f6',    // Blue - Logarithmic  
  'O(n)': '#f59e0b',        // Amber - Linear
  'O(n log n)': '#f97316',  // Orange - Linearithmic
  'O(n²)': '#ef4444',       // Red - Quadratic
  'O(n³)': '#7c2d12',       // Dark Red - Cubic
  'O(2ⁿ)': '#991b1b'        // Darkest Red - Exponential
}

const COMPLEXITY_FUNCTIONS = {
  'O(1)': (n) => 1,
  'O(log n)': (n) => Math.log2(n),
  'O(n)': (n) => n,
  'O(n log n)': (n) => n * Math.log2(n),
  'O(n²)': (n) => n * n,
  'O(n³)': (n) => n * n * n,
  'O(2ⁿ)': (n) => Math.pow(2, Math.min(n, 20)) // Cap exponential to prevent overflow
}

const ALGORITHM_COMPLEXITIES = {
  'Binary Search': {
    time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    space: 'O(1)',
    description: 'Divides search space in half each iteration'
  },
  'Linear Search': {
    time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(1)',
    description: 'Checks each element sequentially'
  },
  'Bubble Sort': {
    time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    space: 'O(1)',
    description: 'Repeatedly swaps adjacent elements'
  },
  'Quick Sort': {
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    space: 'O(log n)',
    description: 'Divide and conquer with pivot element'
  },
  'Merge Sort': {
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: 'O(n)',
    description: 'Divide and conquer with guaranteed performance'
  },
  'Insertion Sort': {
    time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    space: 'O(1)',
    description: 'Builds sorted array one element at a time'
  },
  'Dijkstra\'s Algorithm': {
    time: { best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)' },
    space: 'O(V)',
    description: 'Shortest path with priority queue'
  },
  'BFS/DFS': {
    time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
    space: 'O(V)',
    description: 'Graph traversal visiting each vertex and edge'
  }
}

export default function BigOVisualization() {
  const { state, setVisualizationData } = useApp()
  const [selectedComplexities, setSelectedComplexities] = useState(['O(1)', 'O(log n)', 'O(n)', 'O(n²)'])
  const [maxInputSize, setMaxInputSize] = useState(100)
  const [currentInputSize, setCurrentInputSize] = useState(10)
  const [showAlgorithms, setShowAlgorithms] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('Binary Search')
  const [caseType, setCaseType] = useState('average')

  const generateComplexityData = useCallback(() => {
    const steps = []
    const inputSizes = Array.from({ length: 20 }, (_, i) => Math.floor((maxInputSize / 19) * i) + 1)
    
    for (let i = 0; i < inputSizes.length; i++) {
      const n = inputSizes[i]
      const complexityValues = {}
      
      selectedComplexities.forEach(complexity => {
        const value = COMPLEXITY_FUNCTIONS[complexity](n)
        complexityValues[complexity] = Math.min(value, maxInputSize * 10) // Cap values for visualization
      })
      
      steps.push({
        inputSize: n,
        complexityValues,
        description: `Input size: ${n}, Computing complexity values`,
        operation: 'complexity-analysis',
        phase: 'computing'
      })
    }
    
    return steps
  }, [selectedComplexities, maxInputSize])

  const handleComplexityToggle = (complexity) => {
    setSelectedComplexities(prev => 
      prev.includes(complexity) 
        ? prev.filter(c => c !== complexity)
        : [...prev, complexity]
    )
  }

  const generateVisualizationData = useCallback(() => {
    return generateComplexityData()
  }, [generateComplexityData])

  const handleAnalyze = () => {
    const steps = generateVisualizationData()
    setVisualizationData(steps, 'big-o-analysis')
  }

  useEffect(() => {
    handleAnalyze()
  }, [selectedComplexities, maxInputSize])

  const renderComplexityChart = () => {
    if (state.visualizationData.length === 0) return null

    const maxValue = Math.max(...state.visualizationData.map(step => 
      Math.max(...Object.values(step.complexityValues))
    ))
    
    const chartHeight = 300
    const chartWidth = 600
    const margin = { top: 20, right: 60, bottom: 60, left: 60 }
    const innerWidth = chartWidth - margin.left - margin.right
    const innerHeight = chartHeight - margin.top - margin.bottom

    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-4">
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
            const value = Math.floor(maxValue - (maxValue / 5) * i)
            const y = margin.top + (innerHeight / 5) * i
            return (
              <text
                key={`y-label-${i}`}
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {value}
              </text>
            )
          })}
          
          {/* X-axis labels */}
          {state.visualizationData.filter((_, i) => i % 4 === 0).map((step, i) => {
            const actualIndex = i * 4
            const x = margin.left + (innerWidth / (state.visualizationData.length - 1)) * actualIndex
            return (
              <text
                key={`x-label-${i}`}
                x={x}
                y={chartHeight - margin.bottom + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {step.inputSize}
              </text>
            )
          })}
          
          {/* X-axis title */}
          <text
            x={chartWidth / 2}
            y={chartHeight - 10}
            textAnchor="middle"
            className="text-sm font-medium fill-gray-700"
          >
            Input Size (n)
          </text>
          
          {/* Y-axis title */}
          <text
            x={20}
            y={chartHeight / 2}
            textAnchor="middle"
            className="text-sm font-medium fill-gray-700"
            transform={`rotate(-90, 20, ${chartHeight / 2})`}
          >
            Operations / Time
          </text>

          {/* Complexity curves */}
          {selectedComplexities.map(complexity => {
            const points = state.visualizationData.map((step, i) => {
              const x = margin.left + (innerWidth / (state.visualizationData.length - 1)) * i
              const value = step.complexityValues[complexity]
              const y = margin.top + innerHeight - (value / maxValue) * innerHeight
              return `${x},${y}`
            }).join(' ')

            return (
              <motion.polyline
                key={complexity}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                points={points}
                fill="none"
                stroke={COMPLEXITY_COLORS[complexity]}
                strokeWidth={3}
                strokeLinecap="round"
              />
            )
          })}
          
          {/* Current input size indicator */}
          {currentInputSize <= maxInputSize && (
            <motion.line
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              x1={margin.left + (innerWidth / maxInputSize) * currentInputSize}
              y1={margin.top}
              x2={margin.left + (innerWidth / maxInputSize) * currentInputSize}
              y2={chartHeight - margin.bottom}
              stroke="#6366f1"
              strokeWidth={2}
              strokeDasharray="5,5"
            />
          )}
        </svg>
      </div>
    )
  }

  const renderAlgorithmComplexity = () => {
    const algorithm = ALGORITHM_COMPLEXITIES[selectedAlgorithm]
    if (!algorithm) return null

    return (
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{selectedAlgorithm} Complexity Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Complexity */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-3">Time Complexity</h4>
            <div className="space-y-2">
              {Object.entries(algorithm.time).map(([case_, complexity]) => (
                <div key={case_} className="flex justify-between items-center">
                  <span className={`capitalize ${caseType === case_ ? 'font-semibold' : ''}`}>
                    {case_}:
                  </span>
                  <span 
                    className="px-2 py-1 rounded text-white text-sm font-medium"
                    style={{ backgroundColor: COMPLEXITY_COLORS[complexity] || '#6b7280' }}
                  >
                    {complexity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Space Complexity */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-3">Space Complexity</h4>
            <div className="flex justify-between items-center">
              <span>Space:</span>
              <span 
                className="px-2 py-1 rounded text-white text-sm font-medium"
                style={{ backgroundColor: COMPLEXITY_COLORS[algorithm.space] || '#6b7280' }}
              >
                {algorithm.space}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Description:</strong> {algorithm.description}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Complexity Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Big O Complexities</label>
            <div className="space-y-2">
              {Object.keys(COMPLEXITY_COLORS).map(complexity => (
                <label key={complexity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedComplexities.includes(complexity)}
                    onChange={() => handleComplexityToggle(complexity)}
                    className="mr-2"
                  />
                  <span 
                    className="px-2 py-1 rounded text-white text-xs font-medium mr-2"
                    style={{ backgroundColor: COMPLEXITY_COLORS[complexity] }}
                  >
                    {complexity}
                  </span>
                  <span className="text-sm text-gray-700">
                    {complexity === 'O(1)' ? 'Constant' :
                     complexity === 'O(log n)' ? 'Logarithmic' :
                     complexity === 'O(n)' ? 'Linear' :
                     complexity === 'O(n log n)' ? 'Linearithmic' :
                     complexity === 'O(n²)' ? 'Quadratic' :
                     complexity === 'O(n³)' ? 'Cubic' : 'Exponential'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Parameters</label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max Input Size</label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  value={maxInputSize}
                  onChange={(e) => setMaxInputSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center">{maxInputSize}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Current Input Size</label>
                <input
                  type="range"
                  min="1"
                  max={maxInputSize}
                  value={currentInputSize}
                  onChange={(e) => setCurrentInputSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center">{currentInputSize}</div>
              </div>
            </div>
          </div>

          {/* Algorithm Analysis Toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Analysis Mode</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showAlgorithms}
                  onChange={(e) => setShowAlgorithms(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Show Algorithm Analysis</span>
              </label>
              
              {showAlgorithms && (
                <>
                  <select
                    value={selectedAlgorithm}
                    onChange={(e) => setSelectedAlgorithm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {Object.keys(ALGORITHM_COMPLEXITIES).map(algorithm => (
                      <option key={algorithm} value={algorithm}>{algorithm}</option>
                    ))}
                  </select>
                  
                  <div className="flex space-x-2">
                    {['best', 'average', 'worst'].map(case_ => (
                      <button
                        key={case_}
                        onClick={() => setCaseType(case_)}
                        className={`px-2 py-1 rounded text-xs ${
                          caseType === case_
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {case_}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Big O Info */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Big O Notation</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div><strong>Purpose:</strong> Describes algorithm performance as input size grows</div>
          <div><strong>Focus:</strong> Worst-case scenario and dominant terms</div>
          <div><strong>Usage:</strong> Compare algorithms and predict scalability</div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex flex-col items-center space-y-6">
        {/* Complexity Chart */}
        <div className="w-full">
          <h3 className="text-lg font-semibold text-center mb-4">Big O Complexity Comparison</h3>
          {renderComplexityChart()}
        </div>

        {/* Legend */}
        <div className="flex justify-center flex-wrap gap-4 text-sm">
          {selectedComplexities.map(complexity => (
            <div key={complexity} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: COMPLEXITY_COLORS[complexity] }}
              ></div>
              <span>{complexity}</span>
            </div>
          ))}
        </div>

        {/* Current Values Display */}
        {currentInputSize && (
          <div className="w-full max-w-4xl">
            <h4 className="font-semibold text-gray-800 mb-3 text-center">
              Operations at Input Size n = {currentInputSize}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {selectedComplexities.map(complexity => {
                const operations = Math.floor(COMPLEXITY_FUNCTIONS[complexity](currentInputSize))
                return (
                  <div key={complexity} className="p-3 bg-gray-50 rounded-lg text-center">
                    <div 
                      className="text-white text-xs font-bold px-2 py-1 rounded mb-1"
                      style={{ backgroundColor: COMPLEXITY_COLORS[complexity] }}
                    >
                      {complexity}
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      {operations.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">operations</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Algorithm Analysis */}
        {showAlgorithms && renderAlgorithmComplexity()}
      </div>
    </div>
  )
}