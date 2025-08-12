import { useApp } from '../../contexts/AppContext'

export default function VisualizationDescription({ expectedContext, className = '' }) {
  const { state } = useApp()
  
  // Only show if we have data, a current step, and the context matches
  const shouldShow = (
    state.visualizationData.length > 0 && 
    state.visualizationData[state.currentStep] && 
    (
      // Exact match
      state.visualizationContext === expectedContext ||
      // Pattern match (for multi-operation components)
      (typeof expectedContext === 'string' && expectedContext.endsWith('-') && 
       state.visualizationContext?.startsWith(expectedContext))
    )
  )

  if (!shouldShow) return null

  const currentStep = state.visualizationData[state.currentStep]
  const isError = currentStep.error
  
  return (
    <div className={`mt-4 p-4 rounded-lg text-center ${
      isError 
        ? 'bg-red-50 border border-red-200' 
        : 'bg-blue-50 border border-blue-200'
    } ${className}`}>
      <p className={`font-medium ${
        isError ? 'text-red-800' : 'text-blue-800'
      }`}>
        {currentStep.description}
      </p>
    </div>
  )
}