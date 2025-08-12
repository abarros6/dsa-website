import { useApp } from '../../contexts/AppContext'

export default function StepDescription({ context }) {
  const { state } = useApp()
  
  if (!state.visualizationData.length || 
      !state.visualizationData[state.currentStep] || 
      state.visualizationContext !== context) {
    return null
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
      <p className="text-blue-800">
        {state.visualizationData[state.currentStep].description}
      </p>
    </div>
  )
}