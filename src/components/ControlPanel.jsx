import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../contexts/AppContext'

export default function ControlPanel({ algorithm }) {
  const { state, playPause, stepForward, stepBackward, setStep, setSpeed, reset } = useApp()
  const [inputData, setInputData] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    let interval
    if (state.isPlaying && state.currentStep < state.visualizationData.length - 1) {
      interval = setInterval(() => {
        stepForward()
      }, 1000 / state.speed)
    }
    return () => clearInterval(interval)
  }, [state.isPlaying, state.currentStep, state.speed, state.visualizationData.length, stepForward])

  const generateRandomData = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const randomArray = Array.from(
        { length: 10 }, 
        () => Math.floor(Math.random() * 100) + 1
      )
      setInputData(randomArray.join(', '))
      setIsGenerating(false)
    }, 500)
  }

  const speedOptions = [
    { value: 0.25, label: '0.25x' },
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 4, label: '4x' }
  ]

  return (
    <div className="card">
      <div className="space-y-6">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input Data
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Enter numbers separated by commas (e.g., 64, 34, 25, 12, 22)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={generateRandomData}
              disabled={isGenerating}
              className="btn-secondary whitespace-nowrap"
            >
              {isGenerating ? '🎲...' : '🎲 Random'}
            </button>
          </div>
        </div>

        {/* Algorithm Controls */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Visualization Controls</h4>
          
          {/* Play Controls */}
          <div className="flex items-center space-x-2 mb-4">
            <button
              onClick={stepBackward}
              disabled={state.currentStep === 0}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Step Backward"
            >
              ⏮️
            </button>
            
            <button
              onClick={playPause}
              disabled={state.visualizationData.length === 0}
              className="p-2 rounded-md bg-primary-100 hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={state.isPlaying ? "Pause" : "Play"}
            >
              {state.isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <button
              onClick={stepForward}
              disabled={state.currentStep >= state.visualizationData.length - 1}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Step Forward"
            >
              ⏭️
            </button>
            
            <button
              onClick={reset}
              disabled={state.visualizationData.length === 0}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Reset"
            >
              🔄
            </button>
          </div>

          {/* Progress Slider */}
          {state.visualizationData.length > 0 && (
            <div className="mb-4">
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
                <span>Start</span>
                <span>Step {state.currentStep + 1}</span>
                <span>End</span>
              </div>
            </div>
          )}

          {/* Speed Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Playback Speed
            </label>
            <div className="flex space-x-2">
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSpeed(option.value)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    state.speed === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Algorithm Selection */}
        {!algorithm && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Quick Start Algorithms
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-secondary text-sm py-2">
                🫧 Bubble Sort
              </button>
              <button className="btn-secondary text-sm py-2">
                🔍 Binary Search  
              </button>
              <button className="btn-secondary text-sm py-2">
                🌳 BST Insert
              </button>
              <button className="btn-secondary text-sm py-2">
                📊 DFS Traversal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}