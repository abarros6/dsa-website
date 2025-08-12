import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useVisualizationState } from '../../hooks/useVisualizationState'
import VisualizationDescription from './VisualizationDescription'
import VisualizationControls, { ControlButton } from './VisualizationControls'

const SORT_COLORS = {
  default: '#6b7280',
  comparing: '#f59e0b',
  swapping: '#ef4444', 
  sorted: '#10b981',
  dividing: '#3b82f6',
  merging: '#8b5cf6'
}

export default function SortingVisualizationBase({
  algorithmName,
  initialArray = [64, 34, 25, 12, 22, 11, 90],
  generateSteps,
  getBarColor,
  renderStats,
  contextKey
}) {
  const { array, setArray, setVisualizationWithContext, globalState } = useVisualizationState(initialArray, 'sorting')
  const [algorithmState, setAlgorithmState] = useState({})

  // Sync algorithm-specific state from global state
  useEffect(() => {
    const currentStep = globalState.visualizationData[globalState.currentStep]
    if (currentStep) {
      // Extract algorithm-specific state from step data
      const newState = {}
      Object.keys(currentStep).forEach(key => {
        if (!['array', 'description', 'operation'].includes(key)) {
          newState[key] = currentStep[key]
        }
      })
      setAlgorithmState(newState)
    }
  }, [globalState.currentStep, globalState.visualizationData])

  const handleSort = () => {
    if (!Array.isArray(array) || array.length === 0) return
    
    try {
      const steps = generateSteps(array)
      setVisualizationWithContext(steps, contextKey || algorithmName.toLowerCase())
    } catch (error) {
      console.error('Error generating steps:', error)
    }
  }

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
    setArray(newArray)
  }

  const defaultGetBarColor = (index) => {
    if (algorithmState.sortedIndices?.includes(index)) return SORT_COLORS.sorted
    if (algorithmState.swappingIndices?.includes(index)) return SORT_COLORS.swapping  
    if (algorithmState.comparingIndices?.includes(index)) return SORT_COLORS.comparing
    if (algorithmState.dividingIndices?.includes(index)) return SORT_COLORS.dividing
    if (algorithmState.mergingIndices?.includes(index)) return SORT_COLORS.merging
    return SORT_COLORS.default
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <VisualizationControls>
        <ControlButton onClick={handleSort}>
          Start {algorithmName}
        </ControlButton>
        <ControlButton variant="secondary" onClick={generateRandomArray}>
          Random Array
        </ControlButton>
      </VisualizationControls>

      {/* Array Visualization */}
      <div className="flex justify-center mb-6">
        <div className="flex items-end space-x-2 p-4 bg-white rounded-lg shadow-sm">
          {Array.isArray(array) && array.map((value, index) => (
            <motion.div key={`bar-${index}`} className="flex flex-col items-center">
              <div
                className="w-12 rounded-t-md flex items-end justify-center text-white text-sm font-semibold pb-1"
                style={{
                  height: `${(value / Math.max(...array)) * 200 + 40}px`,
                  backgroundColor: getBarColor ? getBarColor(index, algorithmState) : defaultGetBarColor(index)
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
      {renderStats ? (
        renderStats(algorithmState)
      ) : (
        <div className="flex justify-center space-x-6 text-sm mb-4">
          {algorithmState.operations && <span>Operations: {algorithmState.operations}</span>}
          {algorithmState.comparisons && <span>Comparisons: {algorithmState.comparisons}</span>}
          {algorithmState.swaps && <span>Swaps: {algorithmState.swaps}</span>}
        </div>
      )}

      {/* Description */}
      <VisualizationDescription expectedContext={`sorting-${contextKey || algorithmName.toLowerCase()}`} />
    </div>
  )
}