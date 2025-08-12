import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const LIST_COLORS = {
  node: '#6366f1',
  highlight: '#f59e0b',
  head: '#10b981',
  pointer: '#374151',
  null: '#ef4444'
}

export default function LinkedListVisualization() {
  const { state, setVisualizationData } = useApp()
  const [nodes, setNodes] = useState([
    { id: 1, value: 10, next: 2 },
    { id: 2, value: 25, next: 3 },
    { id: 3, value: 17, next: 4 },
    { id: 4, value: 8, next: null }
  ])
  const [head, setHead] = useState(1)
  const [highlightedNode, setHighlightedNode] = useState(null)
  const [operation, setOperation] = useState(null)

  const generateVisualizationData = useCallback((currentNodes, currentHead, op) => {
    const steps = []
    
    switch (op?.type) {
      case 'insert':
        const insertValue = op.value
        const insertIndex = op.index
        
        if (insertIndex === 0) {
          // Insert at head
          steps.push({
            nodes: [...currentNodes],
            head: currentHead,
            highlightedNode: null,
            description: `Creating new node with value ${insertValue}`,
            operation: 'insert'
          })
          
          const newNodeId = Math.max(...currentNodes.map(n => n.id), 0) + 1
          const newNode = { id: newNodeId, value: insertValue, next: currentHead }
          const newNodes = [...currentNodes, newNode]
          
          steps.push({
            nodes: newNodes,
            head: newNodeId,
            highlightedNode: newNodeId,
            description: `Inserted ${insertValue} at head. New head points to ${insertValue}`,
            operation: 'insert',
            completed: true
          })
        } else {
          // Insert at specific position
          let current = currentNodes.find(n => n.id === currentHead)
          let position = 0
          
          // Traverse to find insertion point
          while (current && position < insertIndex - 1) {
            steps.push({
              nodes: [...currentNodes],
              head: currentHead,
              highlightedNode: current.id,
              description: `Traversing to position ${insertIndex}. Currently at position ${position}`,
              operation: 'insert'
            })
            
            current = currentNodes.find(n => n.id === current.next)
            position++
          }
          
          if (!current) {
            steps.push({
              nodes: [...currentNodes],
              head: currentHead,
              highlightedNode: null,
              description: `Position ${insertIndex} is out of bounds`,
              operation: 'insert',
              error: true
            })
            break
          }
          
          const newNodeId = Math.max(...currentNodes.map(n => n.id), 0) + 1
          const newNode = { id: newNodeId, value: insertValue, next: current.next }
          const updatedNodes = currentNodes.map(n => 
            n.id === current.id ? { ...n, next: newNodeId } : n
          )
          const finalNodes = [...updatedNodes, newNode]
          
          steps.push({
            nodes: finalNodes,
            head: currentHead,
            highlightedNode: newNodeId,
            description: `Inserted ${insertValue} at position ${insertIndex}`,
            operation: 'insert',
            completed: true
          })
        }
        break
        
      case 'delete':
        const deleteValue = op.value
        
        if (currentNodes.length === 0) {
          steps.push({
            nodes: [...currentNodes],
            head: currentHead,
            highlightedNode: null,
            description: 'List is empty! Cannot delete from empty list',
            operation: 'delete',
            error: true
          })
          break
        }
        
        // Check if head needs to be deleted
        const headNode = currentNodes.find(n => n.id === currentHead)
        if (headNode && headNode.value === deleteValue) {
          steps.push({
            nodes: [...currentNodes],
            head: currentHead,
            highlightedNode: currentHead,
            description: `Found ${deleteValue} at head. Deleting head node`,
            operation: 'delete'
          })
          
          const remainingNodes = currentNodes.filter(n => n.id !== currentHead)
          const newHead = headNode.next
          
          steps.push({
            nodes: remainingNodes,
            head: newHead,
            highlightedNode: newHead,
            description: `Deleted ${deleteValue} from head. New head: ${newHead ? remainingNodes.find(n => n.id === newHead)?.value : 'null'}`,
            operation: 'delete',
            completed: true
          })
          break
        }
        
        // Search for node to delete
        let current = currentNodes.find(n => n.id === currentHead)
        let prev = null
        let found = false
        
        while (current && !found) {
          steps.push({
            nodes: [...currentNodes],
            head: currentHead,
            highlightedNode: current.id,
            description: `Checking node with value ${current.value}`,
            operation: 'delete'
          })
          
          if (current.value === deleteValue) {
            found = true
            const updatedNodes = currentNodes.filter(n => n.id !== current.id)
            if (prev) {
              const finalNodes = updatedNodes.map(n => 
                n.id === prev.id ? { ...n, next: current.next } : n
              )
              
              steps.push({
                nodes: finalNodes,
                head: currentHead,
                highlightedNode: prev.id,
                description: `Deleted ${deleteValue}. Previous node now points to next node`,
                operation: 'delete',
                completed: true
              })
            }
          } else {
            prev = current
            current = currentNodes.find(n => n.id === current.next)
          }
        }
        
        if (!found) {
          steps.push({
            nodes: [...currentNodes],
            head: currentHead,
            highlightedNode: null,
            description: `Value ${deleteValue} not found in the list`,
            operation: 'delete',
            error: true
          })
        }
        break
        
      case 'search':
        const searchValue = op.value
        let searchCurrent = currentNodes.find(n => n.id === currentHead)
        let searchPosition = 0
        let searchFound = false
        
        while (searchCurrent && !searchFound) {
          steps.push({
            nodes: [...currentNodes],
            head: currentHead,
            highlightedNode: searchCurrent.id,
            description: `Checking position ${searchPosition}: ${searchCurrent.value} ${searchCurrent.value === searchValue ? '==' : '!='} ${searchValue}`,
            operation: 'search'
          })
          
          if (searchCurrent.value === searchValue) {
            searchFound = true
            steps.push({
              nodes: [...currentNodes],
              head: currentHead,
              highlightedNode: searchCurrent.id,
              description: `Found ${searchValue} at position ${searchPosition}!`,
              operation: 'search',
              completed: true,
              found: true,
              foundPosition: searchPosition
            })
          } else {
            searchCurrent = currentNodes.find(n => n.id === searchCurrent.next)
            searchPosition++
          }
        }
        
        if (!searchFound) {
          steps.push({
            nodes: [...currentNodes],
            head: currentHead,
            highlightedNode: null,
            description: `Value ${searchValue} not found in the list`,
            operation: 'search',
            completed: true,
            found: false
          })
        }
        break
    }
    
    return steps
  }, [])

  const handleInsert = (index, value) => {
    const op = { type: 'insert', index: parseInt(index), value: parseInt(value) }
    const steps = generateVisualizationData(nodes, head, op)
    setVisualizationData(steps)
    setOperation(op)
  }

  const handleDelete = (value) => {
    const op = { type: 'delete', value: parseInt(value) }
    const steps = generateVisualizationData(nodes, head, op)
    setVisualizationData(steps)
    setOperation(op)
  }

  const handleSearch = (value) => {
    const op = { type: 'search', value: parseInt(value) }
    const steps = generateVisualizationData(nodes, head, op)
    setVisualizationData(steps)
    setOperation(op)
  }

  const clearList = () => {
    setNodes([])
    setHead(null)
    setHighlightedNode(null)
  }

  const generateSampleList = () => {
    const sampleNodes = []
    const length = 3 + Math.floor(Math.random() * 4)
    
    for (let i = 0; i < length; i++) {
      sampleNodes.push({
        id: i + 1,
        value: Math.floor(Math.random() * 100),
        next: i === length - 1 ? null : i + 2
      })
    }
    
    setNodes(sampleNodes)
    setHead(sampleNodes.length > 0 ? 1 : null)
    setHighlightedNode(null)
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep) {
      setNodes(currentStep.nodes)
      setHead(currentStep.head)
      setHighlightedNode(currentStep.highlightedNode)
    }
  }, [state.currentStep, state.visualizationData])

  const getNodeSequence = () => {
    if (!head) return []
    
    const sequence = []
    let current = nodes.find(n => n.id === head)
    
    while (current) {
      sequence.push(current)
      current = nodes.find(n => n.id === current.next)
    }
    
    return sequence
  }

  const nodeSequence = getNodeSequence()

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Insert Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Insert</label>
            <div className="flex space-x-2">
              <input
                type="number"
                id="insert-position"
                placeholder="Position"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                min="0"
              />
              <input
                type="number"
                id="insert-value"
                placeholder="Value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <button
                onClick={() => {
                  const position = document.getElementById('insert-position').value || '0'
                  const value = document.getElementById('insert-value').value
                  if (value !== '') {
                    handleInsert(position, value)
                    document.getElementById('insert-position').value = ''
                    document.getElementById('insert-value').value = ''
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Insert
              </button>
            </div>
          </div>

          {/* Delete Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Delete</label>
            <div className="flex space-x-2">
              <input
                type="number"
                id="delete-value"
                placeholder="Value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <button
                onClick={() => {
                  const value = document.getElementById('delete-value').value
                  if (value !== '') {
                    handleDelete(value)
                    document.getElementById('delete-value').value = ''
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                disabled={nodes.length === 0}
              >
                Delete
              </button>
            </div>
          </div>

          {/* Search Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <div className="flex space-x-2">
              <input
                type="number"
                id="search-value"
                placeholder="Value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <button
                onClick={() => {
                  const value = document.getElementById('search-value').value
                  if (value !== '') {
                    handleSearch(value)
                    document.getElementById('search-value').value = ''
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                disabled={nodes.length === 0}
              >
                Search
              </button>
            </div>
          </div>

          {/* Utility Controls */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Utilities</label>
            <div className="flex space-x-2">
              <button
                onClick={generateSampleList}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Sample
              </button>
              <button
                onClick={clearList}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Linked List Visualization */}
      <div className="flex flex-col items-center space-y-6">
        {/* Head Pointer */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-green-600">HEAD</span>
            <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-green-600"></div>
          </div>
        </div>

        {/* Nodes */}
        <div className="flex items-center space-x-8 overflow-x-auto p-4">
          {nodeSequence.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
            >
              <span className="text-gray-500 text-sm">Empty List</span>
            </motion.div>
          ) : (
            nodeSequence.map((node, index) => (
              <div key={`node-${node.id}`} className="flex items-center space-x-4">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    backgroundColor: highlightedNode === node.id ? LIST_COLORS.highlight : 
                                    node.id === head ? LIST_COLORS.head : LIST_COLORS.node
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`
                    relative flex rounded-lg shadow-md overflow-hidden
                    ${highlightedNode === node.id ? 'ring-4 ring-yellow-300 scale-110' : ''}
                  `}
                  style={{
                    backgroundColor: highlightedNode === node.id ? LIST_COLORS.highlight : 
                                    node.id === head ? LIST_COLORS.head : LIST_COLORS.node
                  }}
                >
                  {/* Data Section */}
                  <div className="w-16 h-16 flex items-center justify-center text-white font-bold text-lg">
                    {node.value}
                  </div>
                  
                  {/* Pointer Section */}
                  <div className="w-8 h-16 bg-gray-600 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Node ID */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                    {index}
                  </div>
                </motion.div>

                {/* Arrow */}
                {node.next !== null ? (
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                    className="flex items-center space-x-1"
                  >
                    <div className="w-8 h-0.5 bg-gray-400"></div>
                    <div className="w-0 h-0 border-t-2 border-b-2 border-l-4 border-transparent border-l-gray-400"></div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                    className="flex items-center space-x-1"
                  >
                    <div className="w-8 h-0.5 bg-red-400"></div>
                    <div className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                      NULL
                    </div>
                  </motion.div>
                )}
              </div>
            ))
          )}
        </div>

        {/* List Info */}
        <div className="flex space-x-6 text-sm text-gray-600">
          <span>Length: <span className="font-medium text-gray-900">{nodeSequence.length}</span></span>
          <span>Head: <span className="font-medium text-gray-900">
            {head ? nodes.find(n => n.id === head)?.value : 'null'}
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

        {/* Linked List Explanation */}
        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg max-w-2xl">
          <h4 className="font-medium text-indigo-800 mb-2">Linked List Properties</h4>
          <ul className="text-sm text-indigo-700 space-y-1">
            <li>• <strong>Dynamic Size:</strong> Can grow and shrink during runtime</li>
            <li>• <strong>Sequential Access:</strong> Must traverse from head to reach any element</li>
            <li>• <strong>Node Structure:</strong> Each node contains data and a pointer to the next node</li>
            <li>• <strong>Memory:</strong> Elements stored in non-contiguous memory locations</li>
            <li>• <strong>Insertion/Deletion:</strong> O(1) at head, O(n) at arbitrary position</li>
            <li>• <strong>Applications:</strong> Dynamic memory allocation, implementing other data structures</li>
          </ul>
        </div>
      </div>
    </div>
  )
}