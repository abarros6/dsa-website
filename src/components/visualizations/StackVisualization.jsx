import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const STACK_COLORS = {
  element: '#3b82f6',
  highlight: '#f59e0b',
  top: '#10b981',
  empty: '#e5e7eb'
}

export default function StackVisualization() {
  const { state, setVisualizationData } = useApp()
  const [stack, setStack] = useState([42, 17, 8, 23])
  const [maxSize] = useState(10)
  const [highlightedIndex, setHighlightedIndex] = useState(null)
  const [operation, setOperation] = useState(null)

  const generateVisualizationData = useCallback((currentStack, op) => {
    const steps = []
    
    switch (op?.type) {
      case 'push':
        const pushValue = op.value
        
        if (currentStack.length >= maxSize) {
          steps.push({
            stack: [...currentStack],
            highlightedIndex: null,
            description: `Stack is full! Cannot push ${pushValue}`,
            operation: 'push',
            error: true
          })
          break
        }
        
        steps.push({
          stack: [...currentStack],
          highlightedIndex: null,
          description: `Preparing to push ${pushValue} onto stack`,
          operation: 'push'
        })
        
        const newStackPush = [...currentStack, pushValue]
        steps.push({
          stack: newStackPush,
          highlightedIndex: newStackPush.length - 1,
          description: `Pushed ${pushValue} onto stack. New top element is ${pushValue}`,
          operation: 'push',
          completed: true
        })
        break
        
      case 'pop':
        if (currentStack.length === 0) {
          steps.push({
            stack: [...currentStack],
            highlightedIndex: null,
            description: 'Stack is empty! Cannot pop from empty stack',
            operation: 'pop',
            error: true
          })
          break
        }
        
        const topElement = currentStack[currentStack.length - 1]
        steps.push({
          stack: [...currentStack],
          highlightedIndex: currentStack.length - 1,
          description: `Popping top element: ${topElement}`,
          operation: 'pop'
        })
        
        const newStackPop = currentStack.slice(0, -1)
        steps.push({
          stack: newStackPop,
          highlightedIndex: newStackPop.length > 0 ? newStackPop.length - 1 : null,
          description: `Popped ${topElement}. ${newStackPop.length > 0 ? `New top: ${newStackPop[newStackPop.length - 1]}` : 'Stack is now empty'}`,
          operation: 'pop',
          completed: true,
          poppedValue: topElement
        })
        break
        
      case 'peek':
        if (currentStack.length === 0) {
          steps.push({
            stack: [...currentStack],
            highlightedIndex: null,
            description: 'Stack is empty! No element to peek',
            operation: 'peek',
            error: true
          })
          break
        }
        
        const peekValue = currentStack[currentStack.length - 1]
        steps.push({
          stack: [...currentStack],
          highlightedIndex: currentStack.length - 1,
          description: `Peeking at top element: ${peekValue}`,
          operation: 'peek',
          completed: true,
          peekedValue: peekValue
        })
        break
    }
    
    return steps
  }, [maxSize])

  const handlePush = (value) => {
    const pushValue = parseInt(value)
    const op = { type: 'push', value: pushValue }
    
    if (stack.length >= maxSize) {
      // Generate error step but don't update stack
      const steps = generateVisualizationData(stack, op)
      setVisualizationData(steps, 'stack-push')
      setOperation(op)
      return
    }
    
    // Update the actual stack
    const newStack = [...stack, pushValue]
    setStack(newStack)
    setHighlightedIndex(newStack.length - 1)
    
    // Generate steps for visualization
    const steps = generateVisualizationData(stack, op)
    setVisualizationData(steps, 'stack-push')
    setOperation(op)
    
    // Clear highlight after animation
    setTimeout(() => setHighlightedIndex(null), 1000)
  }

  const handlePop = () => {
    const op = { type: 'pop' }
    
    if (stack.length === 0) {
      // Generate error step but don't update stack
      const steps = generateVisualizationData(stack, op)
      setVisualizationData(steps, 'stack-pop')
      setOperation(op)
      return
    }
    
    // Highlight the element being popped
    setHighlightedIndex(stack.length - 1)
    
    // Update the actual stack after a brief delay
    setTimeout(() => {
      const newStack = stack.slice(0, -1)
      setStack(newStack)
      setHighlightedIndex(newStack.length > 0 ? newStack.length - 1 : null)
      
      // Clear highlight after another brief moment
      setTimeout(() => setHighlightedIndex(null), 500)
    }, 500)
    
    // Generate steps for visualization
    const steps = generateVisualizationData(stack, op)
    setVisualizationData(steps, 'stack-pop')
    setOperation(op)
  }

  const handlePeek = () => {
    const op = { type: 'peek' }
    
    if (stack.length === 0) {
      // Generate error step
      const steps = generateVisualizationData(stack, op)
      setVisualizationData(steps, 'stack-peek')
      setOperation(op)
      return
    }
    
    // Highlight the top element
    setHighlightedIndex(stack.length - 1)
    
    // Generate steps for visualization
    const steps = generateVisualizationData(stack, op)
    setVisualizationData(steps, 'stack-peek')
    setOperation(op)
    
    // Clear highlight after animation
    setTimeout(() => setHighlightedIndex(null), 1500)
  }

  const clearStack = () => {
    setStack([])
    setHighlightedIndex(null)
  }

  const generateSampleStack = () => {
    const sampleStack = Array.from({ length: 3 + Math.floor(Math.random() * 5) }, 
      () => Math.floor(Math.random() * 100))
    setStack(sampleStack)
    setHighlightedIndex(null)
  }


  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Push Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Push</label>
            <input
              type="number"
              id="push-value"
              placeholder="Value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={() => {
                const value = document.getElementById('push-value').value
                if (value !== '') {
                  handlePush(value)
                  document.getElementById('push-value').value = ''
                }
              }}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              disabled={stack.length >= maxSize}
            >
              Push
            </button>
          </div>

          {/* Pop Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pop</label>
            <div className="h-10"></div>
            <button
              onClick={handlePop}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm disabled:bg-gray-300"
              disabled={stack.length === 0}
            >
              Pop
            </button>
          </div>

          {/* Peek Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Peek</label>
            <div className="h-10"></div>
            <button
              onClick={handlePeek}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm disabled:bg-gray-300"
              disabled={stack.length === 0}
            >
              Peek
            </button>
          </div>

          {/* Utility Controls */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Utilities</label>
            <div className="h-10"></div>
            <div className="flex space-x-2">
              <button
                onClick={generateSampleStack}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Sample
              </button>
              <button
                onClick={clearStack}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stack Visualization */}
      <div className="flex flex-col items-center space-y-4">
        {stack.length === 0 ? (
          /* Empty Stack State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-64 h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
          >
            <div className="text-center">
              <span className="text-gray-500 text-lg">📚</span>
              <p className="text-gray-500 text-sm mt-1">Stack is empty</p>
              <p className="text-gray-400 text-xs">Push elements to see the stack</p>
            </div>
          </motion.div>
        ) : (
          /* Stack with Elements */
          <div className="relative">
            {/* Stack Elements */}
            <div className="flex flex-col-reverse relative z-10">
              <AnimatePresence initial={false}>
                {stack.map((value, index) => (
                  <motion.div
                    key={`stack-${index}-${value}`}
                    initial={{ y: 50, opacity: 0, scale: 0.8 }}
                    animate={{ 
                      y: 0, 
                      opacity: 1, 
                      scale: 1,
                      backgroundColor: highlightedIndex === index ? STACK_COLORS.highlight :
                                      index === stack.length - 1 ? STACK_COLORS.top :
                                      STACK_COLORS.element
                    }}
                    exit={{ y: -50, opacity: 0, scale: 0.8 }}
                    transition={{ 
                      duration: 0.4, 
                      type: 'spring',
                      damping: 15 
                    }}
                    className={`
                      w-32 h-12 border-2 border-white flex items-center justify-center
                      text-white font-bold text-lg shadow-md
                      ${highlightedIndex === index ? 'ring-4 ring-yellow-300 scale-105' : ''}
                    `}
                    style={{
                      backgroundColor: highlightedIndex === index ? STACK_COLORS.highlight :
                                      index === stack.length - 1 ? STACK_COLORS.top :
                                      STACK_COLORS.element
                    }}
                  >
                    {value}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Stack Base */}
            <div className="w-32 h-8 bg-gray-800 rounded-b-lg absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
            
            {/* Top Indicator */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute -left-16 flex items-center"
              style={{ 
                top: '0px', // Position to align with the topmost element (last in array, first visually)
                height: '48px' // Match the height of stack elements
              }}
            >
              <span className="text-sm font-medium text-green-600">TOP</span>
              <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-green-600 ml-2"></div>
            </motion.div>
          </div>
        )}

        {/* Stack Info */}
        <div className="flex space-x-6 text-sm text-gray-600 mt-4">
          <span>Size: <span className="font-medium text-gray-900">{stack.length}</span></span>
          <span>Capacity: <span className="font-medium text-gray-900">{maxSize}</span></span>
          <span>Top: <span className="font-medium text-gray-900">
            {stack.length > 0 ? stack[stack.length - 1] : 'None'}
          </span></span>
        </div>

        {/* Current Operation Description */}
        <AnimatePresence>
          {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && 
            state.visualizationContext?.startsWith('stack-') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-4 p-4 rounded-lg max-w-lg text-center ${
                state.visualizationData[state.currentStep].error 
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <p className={`font-medium ${
                state.visualizationData[state.currentStep].error 
                  ? 'text-red-800'
                  : 'text-blue-800'
              }`}>
                {state.visualizationData[state.currentStep].description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LIFO Explanation */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl">
          <h4 className="font-medium text-yellow-800 mb-2">Stack Properties (LIFO)</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Last In, First Out:</strong> The last element pushed is the first to be popped</li>
            <li>• <strong>Push:</strong> Add element to the top of the stack</li>
            <li>• <strong>Pop:</strong> Remove and return the top element</li>
            <li>• <strong>Peek/Top:</strong> View the top element without removing it</li>
            <li>• <strong>Applications:</strong> Function calls, undo operations, expression evaluation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}