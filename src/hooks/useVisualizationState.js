import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../contexts/AppContext'

export function useVisualizationState(initialArray, contextPrefix) {
  const { state, setVisualizationData } = useApp()
  const [array, setArray] = useState(initialArray)

  // Sync with global visualization state
  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && Array.isArray(currentStep.array)) {
      setArray(currentStep.array)
    }
  }, [state.currentStep, state.visualizationData])

  // Helper to set visualization data with context
  const setVisualizationWithContext = useCallback((steps, operation) => {
    const context = contextPrefix ? `${contextPrefix}-${operation}` : operation
    setVisualizationData(steps, context)
  }, [setVisualizationData, contextPrefix])

  return {
    array,
    setArray,
    setVisualizationWithContext,
    globalState: state
  }
}