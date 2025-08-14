import { useApp } from '../contexts/AppContext'
import SimpleControlPanel from './SimpleControlPanel'

export default function ConditionalControlPanel({ 
  forceHide = false, 
  requiredContext = null,
  minSteps = 2 
}) {
  const { state } = useApp()
  
  // Don't render if explicitly hidden
  if (forceHide) {
    return null
  }
  
  // Don't render if no visualization data
  if (!state.visualizationData || state.visualizationData.length < minSteps) {
    return null
  }
  
  // Don't render if required context doesn't match
  if (requiredContext && !state.visualizationContext?.includes(requiredContext)) {
    return null
  }
  
  // Only render if we have actual algorithmic step-by-step data that makes sense to control
  // Exclude educational/demo content that doesn't need step controls
  const hasAlgorithmicSteps = state.visualizationData.some(step => {
    if (!step) return false
    
    // Look for indicators of algorithmic steps
    const hasAlgorithmicIndicators = 
      step.operation?.includes('sort') || 
      step.operation?.includes('search') ||
      step.operation?.includes('insert') ||
      step.operation?.includes('delete') ||
      step.operation?.includes('traverse') ||
      step.operation === 'push' ||
      step.operation === 'pop' ||
      step.operation === 'peek' ||
      step.operation === 'enqueue' ||
      step.operation === 'dequeue' ||
      step.operation?.includes('add') ||
      step.operation?.includes('remove') ||
      step.arraySnapshot ||
      step.comparisons !== undefined ||
      step.swaps !== undefined ||
      step.currentIndices ||
      (step.description && (
        step.description.includes('comparing') ||
        step.description.includes('swapping') ||
        step.description.includes('moving') ||
        step.description.includes('inserting') ||
        step.description.includes('deleting') ||
        step.description.includes('searching') ||
        step.description.includes('push') ||
        step.description.includes('pop') ||
        step.description.includes('enqueue') ||
        step.description.includes('dequeue') ||
        step.description.includes('Step ')
      ))
    
    return hasAlgorithmicIndicators
  })
  
  // Also check if this is educational content or has built-in controls that shouldn't have additional controls
  const isEducationalContent = state.visualizationContext?.includes('oop-') ||
    state.visualizationContext?.includes('java-') ||
    state.visualizationContext?.includes('collections-')
  
  // Stack and Queue have their own built-in control panels, so exclude them
  const hasBuiltInControls = state.visualizationContext?.includes('stack') ||
    state.visualizationContext?.includes('queue')
  
  if (!hasAlgorithmicSteps || isEducationalContent || hasBuiltInControls) {
    return null
  }
  
  return (
    <div className="card">
      <SimpleControlPanel />
    </div>
  )
}