import { useEffect } from 'react'
import { useApp } from '../contexts/AppContext'

export default function SimpleControlPanel() {
  const { state, playPause, stepForward, stepBackward, setStep, setSpeed, reset } = useApp()

  useEffect(() => {
    let interval
    if (state.isPlaying && state.currentStep < state.visualizationData.length - 1) {
      interval = setInterval(() => {
        stepForward()
      }, 1000 / state.speed)
    }
    return () => clearInterval(interval)
  }, [state.isPlaying, state.currentStep, state.speed, state.visualizationData.length, stepForward])

  if (state.visualizationData.length === 0) {
    return null
  }

  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 4, label: '4x' }
  ]

  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
      {/* Play Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={stepBackward}
          disabled={state.currentStep === 0}
          className="p-2 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          title="Step Backward"
        >
          ⏮️
        </button>
        
        <button
          onClick={playPause}
          className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm"
          title={state.isPlaying ? "Pause" : "Play"}
        >
          {state.isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <button
          onClick={stepForward}
          disabled={state.currentStep >= state.visualizationData.length - 1}
          className="p-2 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          title="Step Forward"
        >
          ⏭️
        </button>
        
        <button
          onClick={reset}
          className="p-2 rounded-md bg-white hover:bg-gray-100 transition-colors shadow-sm"
          title="Reset"
        >
          🔄
        </button>
      </div>

      {/* Progress Slider */}
      <div className="flex-1 max-w-md">
        <input
          type="range"
          min="0"
          max={state.visualizationData.length - 1}
          value={state.currentStep}
          onChange={(e) => setStep(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
              (state.currentStep / (state.visualizationData.length - 1)) * 100
            }%, #E5E7EB ${
              (state.currentStep / (state.visualizationData.length - 1)) * 100
            }%, #E5E7EB 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Step 1</span>
          <span>Step {state.currentStep + 1} of {state.visualizationData.length}</span>
          <span>Step {state.visualizationData.length}</span>
        </div>
      </div>

      {/* Speed Control */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Speed:</span>
        {speedOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSpeed(option.value)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              state.speed === option.value
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}