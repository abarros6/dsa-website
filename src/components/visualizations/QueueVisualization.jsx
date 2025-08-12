import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const QUEUE_COLORS = {
  element: '#8b5cf6',
  highlight: '#f59e0b',
  front: '#10b981',
  rear: '#ef4444',
  empty: '#e5e7eb'
}

export default function QueueVisualization() {
  const { state, setVisualizationData } = useApp()
  const [queue, setQueue] = useState([12, 45, 78, 23])
  const [maxSize] = useState(8)
  const [frontIndex, setFrontIndex] = useState(0)
  const [rearIndex, setRearIndex] = useState(3)
  const [highlightedIndex, setHighlightedIndex] = useState(null)
  const [operation, setOperation] = useState(null)

  const generateVisualizationData = useCallback((currentQueue, front, rear, op) => {
    const steps = []
    
    switch (op?.type) {
      case 'enqueue':
        const enqueueValue = op.value
        
        if (currentQueue.length >= maxSize) {
          steps.push({
            queue: [...currentQueue],
            frontIndex: front,
            rearIndex: rear,
            highlightedIndex: null,
            description: `Queue is full! Cannot enqueue ${enqueueValue}`,
            operation: 'enqueue',
            error: true
          })
          break
        }
        
        steps.push({
          queue: [...currentQueue],
          frontIndex: front,
          rearIndex: rear,
          highlightedIndex: null,
          description: `Preparing to enqueue ${enqueueValue} at the rear`,
          operation: 'enqueue'
        })
        
        const newQueueEnqueue = [...currentQueue, enqueueValue]
        const newRear = rear + 1
        steps.push({
          queue: newQueueEnqueue,
          frontIndex: front,
          rearIndex: newRear,
          highlightedIndex: newRear,
          description: `Enqueued ${enqueueValue} at rear. Queue size is now ${newQueueEnqueue.length}`,
          operation: 'enqueue',
          completed: true
        })
        break
        
      case 'dequeue':
        if (currentQueue.length === 0) {
          steps.push({
            queue: [...currentQueue],
            frontIndex: front,
            rearIndex: rear,
            highlightedIndex: null,
            description: 'Queue is empty! Cannot dequeue from empty queue',
            operation: 'dequeue',
            error: true
          })
          break
        }
        
        const frontElement = currentQueue[0]
        steps.push({
          queue: [...currentQueue],
          frontIndex: front,
          rearIndex: rear,
          highlightedIndex: 0,
          description: `Dequeuing front element: ${frontElement}`,
          operation: 'dequeue'
        })
        
        const newQueueDequeue = currentQueue.slice(1)
        const newFront = newQueueDequeue.length > 0 ? 0 : 0
        const newRearDequeue = newQueueDequeue.length - 1
        steps.push({
          queue: newQueueDequeue,
          frontIndex: newFront,
          rearIndex: newRearDequeue,
          highlightedIndex: null,
          description: `Dequeued ${frontElement}. ${newQueueDequeue.length > 0 ? `New front: ${newQueueDequeue[0]}` : 'Queue is now empty'}`,
          operation: 'dequeue',
          completed: true,
          dequeuedValue: frontElement
        })
        break
        
      case 'front':
        if (currentQueue.length === 0) {
          steps.push({
            queue: [...currentQueue],
            frontIndex: front,
            rearIndex: rear,
            highlightedIndex: null,
            description: 'Queue is empty! No front element',
            operation: 'front',
            error: true
          })
          break
        }
        
        const frontValue = currentQueue[0]
        steps.push({
          queue: [...currentQueue],
          frontIndex: front,
          rearIndex: rear,
          highlightedIndex: 0,
          description: `Front element is: ${frontValue}`,
          operation: 'front',
          completed: true,
          frontValue: frontValue
        })
        break

      case 'rear':
        if (currentQueue.length === 0) {
          steps.push({
            queue: [...currentQueue],
            frontIndex: front,
            rearIndex: rear,
            highlightedIndex: null,
            description: 'Queue is empty! No rear element',
            operation: 'rear',
            error: true
          })
          break
        }
        
        const rearValue = currentQueue[currentQueue.length - 1]
        steps.push({
          queue: [...currentQueue],
          frontIndex: front,
          rearIndex: rear,
          highlightedIndex: currentQueue.length - 1,
          description: `Rear element is: ${rearValue}`,
          operation: 'rear',
          completed: true,
          rearValue: rearValue
        })
        break
    }
    
    return steps
  }, [maxSize])

  const handleEnqueue = (value) => {
    const op = { type: 'enqueue', value: parseInt(value) }
    const steps = generateVisualizationData(queue, frontIndex, rearIndex, op)
    setVisualizationData(steps)
    setOperation(op)
  }

  const handleDequeue = () => {
    const op = { type: 'dequeue' }
    const steps = generateVisualizationData(queue, frontIndex, rearIndex, op)
    setVisualizationData(steps)
    setOperation(op)
  }

  const handleFront = () => {
    const op = { type: 'front' }
    const steps = generateVisualizationData(queue, frontIndex, rearIndex, op)
    setVisualizationData(steps)
    setOperation(op)
  }

  const handleRear = () => {
    const op = { type: 'rear' }
    const steps = generateVisualizationData(queue, frontIndex, rearIndex, op)
    setVisualizationData(steps)
    setOperation(op)
  }

  const clearQueue = () => {
    setQueue([])
    setFrontIndex(0)
    setRearIndex(-1)
    setHighlightedIndex(null)
  }

  const generateSampleQueue = () => {
    const sampleQueue = Array.from({ length: 3 + Math.floor(Math.random() * 4) }, 
      () => Math.floor(Math.random() * 100))
    setQueue(sampleQueue)
    setFrontIndex(0)
    setRearIndex(sampleQueue.length - 1)
    setHighlightedIndex(null)
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep) {
      setQueue(currentStep.queue)
      setFrontIndex(currentStep.frontIndex)
      setRearIndex(currentStep.rearIndex)
      setHighlightedIndex(currentStep.highlightedIndex)
    }
  }, [state.currentStep, state.visualizationData])

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Enqueue Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Enqueue</label>
            <input
              type="number"
              id="enqueue-value"
              placeholder="Value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={() => {
                const value = document.getElementById('enqueue-value').value
                if (value !== '') {
                  handleEnqueue(value)
                  document.getElementById('enqueue-value').value = ''
                }
              }}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
              disabled={queue.length >= maxSize}
            >
              Add
            </button>
          </div>

          {/* Dequeue Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Dequeue</label>
            <div className="h-10"></div>
            <button
              onClick={handleDequeue}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm disabled:bg-gray-300"
              disabled={queue.length === 0}
            >
              Remove
            </button>
          </div>

          {/* Front Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Front</label>
            <div className="h-10"></div>
            <button
              onClick={handleFront}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm disabled:bg-gray-300"
              disabled={queue.length === 0}
            >
              View Front
            </button>
          </div>

          {/* Rear Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rear</label>
            <div className="h-10"></div>
            <button
              onClick={handleRear}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm disabled:bg-gray-300"
              disabled={queue.length === 0}
            >
              View Rear
            </button>
          </div>

          {/* Utility Controls */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Utilities</label>
            <div className="h-10"></div>
            <div className="flex space-x-2">
              <button
                onClick={generateSampleQueue}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Sample
              </button>
              <button
                onClick={clearQueue}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Visualization */}
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          {/* Queue Container */}
          <div className="flex items-center space-x-1">
            {/* Front Arrow */}
            <div className="flex flex-col items-center mr-4">
              <span className="text-sm font-medium text-green-600 mb-1">FRONT</span>
              <div className="w-0 h-0 border-t-6 border-b-6 border-l-12 border-transparent border-l-green-600"></div>
            </div>

            {/* Queue Elements */}
            <div className="flex space-x-1">
              <AnimatePresence initial={false}>
                {queue.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                  >
                    <span className="text-gray-400 text-xs">Empty</span>
                  </motion.div>
                ) : (
                  queue.map((value, index) => (
                    <motion.div
                      key={`queue-${index}-${value}`}
                      initial={{ x: 100, opacity: 0, scale: 0.8 }}
                      animate={{ 
                        x: 0, 
                        opacity: 1, 
                        scale: 1,
                        backgroundColor: highlightedIndex === index ? QUEUE_COLORS.highlight :
                                        index === 0 ? QUEUE_COLORS.front :
                                        index === queue.length - 1 ? QUEUE_COLORS.rear :
                                        QUEUE_COLORS.element
                      }}
                      exit={{ x: -100, opacity: 0, scale: 0.8 }}
                      transition={{ 
                        duration: 0.4,
                        type: 'spring',
                        damping: 15
                      }}
                      className={`
                        w-16 h-16 border-2 border-white flex items-center justify-center
                        text-white font-bold text-lg rounded-lg shadow-md
                        ${highlightedIndex === index ? 'ring-4 ring-yellow-300 scale-110' : ''}
                      `}
                      style={{
                        backgroundColor: highlightedIndex === index ? QUEUE_COLORS.highlight :
                                        index === 0 ? QUEUE_COLORS.front :
                                        index === queue.length - 1 ? QUEUE_COLORS.rear :
                                        QUEUE_COLORS.element
                      }}
                    >
                      {value}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Rear Arrow */}
            <div className="flex flex-col items-center ml-4">
              <span className="text-sm font-medium text-red-600 mb-1">REAR</span>
              <div className="w-0 h-0 border-t-6 border-b-6 border-r-12 border-transparent border-r-red-600"></div>
            </div>
          </div>

          {/* Index Labels */}
          <div className="flex items-center space-x-1 mt-2 ml-20">
            {queue.map((_, index) => (
              <div key={`index-${index}`} className="w-16 flex justify-center">
                <span className="text-xs text-gray-500 font-medium">{index}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Queue Info */}
        <div className="flex space-x-6 text-sm text-gray-600">
          <span>Size: <span className="font-medium text-gray-900">{queue.length}</span></span>
          <span>Capacity: <span className="font-medium text-gray-900">{maxSize}</span></span>
          <span>Front: <span className="font-medium text-gray-900">
            {queue.length > 0 ? queue[0] : 'None'}
          </span></span>
          <span>Rear: <span className="font-medium text-gray-900">
            {queue.length > 0 ? queue[queue.length - 1] : 'None'}
          </span></span>
        </div>

        {/* Current Operation Description */}
        <AnimatePresence>
          {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && (
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

        {/* FIFO Explanation */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl">
          <h4 className="font-medium text-blue-800 mb-2">Queue Properties (FIFO)</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>First In, First Out:</strong> The first element added is the first to be removed</li>
            <li>• <strong>Enqueue:</strong> Add element to the rear of the queue</li>
            <li>• <strong>Dequeue:</strong> Remove and return the front element</li>
            <li>• <strong>Front:</strong> View the front element without removing it</li>
            <li>• <strong>Rear:</strong> View the rear element without removing it</li>
            <li>• <strong>Applications:</strong> Process scheduling, breadth-first search, buffering</li>
          </ul>
        </div>
      </div>
    </div>
  )
}