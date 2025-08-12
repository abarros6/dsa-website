import { useState } from 'react'
import VisualizationCanvas from './VisualizationCanvas'
import CodePanel from './CodePanel'
import ControlPanel from './ControlPanel'
import DataPanel from './DataPanel'
import { useApp } from '../contexts/AppContext'

export default function AlgorithmVisualization({ algorithm }) {
  const [layout, setLayout] = useState('desktop') // desktop, tablet, mobile
  const { state } = useApp()

  const layoutClasses = {
    desktop: 'grid grid-cols-12 gap-6',
    tablet: 'flex flex-col space-y-4',
    mobile: 'flex flex-col space-y-4'
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {algorithm?.name || 'Algorithm Visualization'}
        </h1>
        <p className="text-gray-600">
          {algorithm?.description || 'Select an algorithm to begin visualization'}
        </p>
      </div>

      {/* Layout Toggle for smaller screens */}
      <div className="lg:hidden mb-4">
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLayout('desktop')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              layout === 'desktop' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Viz
          </button>
          <button
            onClick={() => setLayout('tablet')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              layout === 'tablet' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💻 Code
          </button>
          <button
            onClick={() => setLayout('mobile')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              layout === 'mobile' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🎛️ Controls
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className={layoutClasses.desktop}>
        {/* Visualization Area */}
        <div className="col-span-8">
          <div className="space-y-4">
            <VisualizationCanvas algorithm={algorithm} />
            <ControlPanel algorithm={algorithm} />
          </div>
        </div>

        {/* Side Panels */}
        <div className="col-span-4 space-y-4">
          {state.visualizationSettings.showCode && (
            <CodePanel algorithm={algorithm} />
          )}
          <DataPanel algorithm={algorithm} />
        </div>
      </div>
    </div>
  )
}