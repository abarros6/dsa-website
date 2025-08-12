import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext'

export default function DataPanel({ algorithm }) {
  const { state } = useApp()
  const [activeTab, setActiveTab] = useState('variables')

  const tabs = [
    { id: 'variables', label: 'Variables', icon: '📊' },
    { id: 'complexity', label: 'Complexity', icon: '⚡' },
    { id: 'stats', label: 'Statistics', icon: '📈' }
  ]

  const currentStepData = state.visualizationData[state.currentStep] || {}
  
  const mockVariables = {
    i: currentStepData.i || 0,
    j: currentStepData.j || 0,
    temp: currentStepData.temp || null,
    comparisons: currentStepData.comparisons || 0,
    swaps: currentStepData.swaps || 0
  }

  const complexityData = algorithm?.complexity || {
    time: {
      best: 'O(n)',
      average: 'O(n²)', 
      worst: 'O(n²)'
    },
    space: 'O(1)',
    stable: true,
    inPlace: true
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Algorithm Data</h3>
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'variables' && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Current Variables</h4>
              {Object.entries(mockVariables).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="font-mono text-sm text-gray-700">{key}</span>
                  <span className="font-mono text-sm font-semibold text-primary-600">
                    {value !== null ? value : 'null'}
                  </span>
                </div>
              ))}
              
              {currentStepData.description && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Current Step:</span> {currentStepData.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'complexity' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Time Complexity</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Best Case:</span>
                    <span className="font-mono text-sm text-green-600">{complexityData.time.best}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Case:</span>
                    <span className="font-mono text-sm text-yellow-600">{complexityData.time.average}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Worst Case:</span>
                    <span className="font-mono text-sm text-red-600">{complexityData.time.worst}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Space Complexity</h4>
                <span className="font-mono text-sm text-primary-600">{complexityData.space}</span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Properties</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Stable:</span>
                    <span className={`text-sm ${complexityData.stable ? 'text-green-600' : 'text-red-600'}`}>
                      {complexityData.stable ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">In-place:</span>
                    <span className={`text-sm ${complexityData.inPlace ? 'text-green-600' : 'text-red-600'}`}>
                      {complexityData.inPlace ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Execution Statistics</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {mockVariables.comparisons}
                  </div>
                  <div className="text-sm text-blue-800">Comparisons</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {mockVariables.swaps}
                  </div>
                  <div className="text-sm text-green-800">Swaps</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Progress:</span>
                  <span className="text-sm font-medium">
                    {state.visualizationData.length > 0 
                      ? Math.round(((state.currentStep + 1) / state.visualizationData.length) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: state.visualizationData.length > 0 
                        ? `${((state.currentStep + 1) / state.visualizationData.length) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}