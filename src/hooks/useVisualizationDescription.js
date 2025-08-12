import { useApp } from '../contexts/AppContext'

export function useVisualizationDescription(expectedContext) {
  const { state } = useApp()
  
  // Only return description if context matches and data exists
  if (
    state.visualizationData.length > 0 && 
    state.visualizationData[state.currentStep] && 
    state.visualizationContext === expectedContext
  ) {
    return state.visualizationData[state.currentStep].description
  }
  
  return null
}

export function useShouldShowDescription(expectedContext) {
  const { state } = useApp()
  
  return (
    state.visualizationData.length > 0 && 
    state.visualizationData[state.currentStep] && 
    state.visualizationContext === expectedContext
  )
}