import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext'

export default function VisualizationCanvas({ 
  width = 800, 
  height = 400, 
  className = '', 
  children 
}) {
  const canvasRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState({ width, height })
  const { state } = useApp()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateSize = () => {
      const container = canvas.parentElement
      if (container) {
        const rect = container.getBoundingClientRect()
        const newWidth = Math.max(400, Math.min(rect.width - 32, 1200))
        const newHeight = Math.max(300, Math.min(rect.height - 32, 800))
        
        setCanvasSize({ width: newWidth, height: newHeight })
        canvas.width = newWidth * 2 // For high DPI displays
        canvas.height = newHeight * 2
        canvas.style.width = `${newWidth}px`
        canvas.style.height = `${newHeight}px`
        
        const ctx = canvas.getContext('2d')
        ctx.scale(2, 2) // Scale for high DPI
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <div className={`visualization-canvas relative overflow-hidden ${className}`}>
      {/* Canvas for drawing algorithms */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Overlay for interactive elements */}
      <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {children || (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Ready to Visualize
              </h3>
              <p className="text-gray-500 max-w-md">
                Select an algorithm or data structure to begin exploring interactive visualizations.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Current algorithm indicator */}
      {state.currentAlgorithm && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <span className="text-sm font-medium text-gray-700">
            {state.currentAlgorithm.name}
          </span>
        </div>
      )}

      {/* Performance indicator */}
      {state.visualizationData.length > 0 && (
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <span className="text-sm text-gray-600">
            Step {state.currentStep + 1} of {state.visualizationData.length}
          </span>
        </div>
      )}
    </div>
  )
}