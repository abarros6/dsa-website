import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const GRAPH_COLORS = {
  node: {
    default: '#e2e8f0',
    current: '#3b82f6',
    visited: '#10b981',
    processing: '#f59e0b',
    path: '#8b5cf6',
    start: '#059669',
    end: '#dc2626'
  },
  edge: {
    default: '#6b7280',
    active: '#3b82f6',
    path: '#8b5cf6',
    mst: '#10b981'
  }
}

class Graph {
  constructor(isDirected = false, isWeighted = false) {
    this.nodes = new Map()
    this.adjacencyList = new Map()
    this.isDirected = isDirected
    this.isWeighted = isWeighted
  }

  addNode(id, x, y, label = null) {
    const node = {
      id,
      x,
      y,
      label: label || id.toString()
    }
    this.nodes.set(id, node)
    if (!this.adjacencyList.has(id)) {
      this.adjacencyList.set(id, [])
    }
    return node
  }

  addEdge(from, to, weight = 1) {
    if (!this.adjacencyList.has(from)) this.adjacencyList.set(from, [])
    if (!this.adjacencyList.has(to)) this.adjacencyList.set(to, [])

    this.adjacencyList.get(from).push({ node: to, weight })
    
    if (!this.isDirected) {
      this.adjacencyList.get(to).push({ node: from, weight })
    }
  }

  getNeighbors(nodeId) {
    return this.adjacencyList.get(nodeId) || []
  }

  getAllNodes() {
    return Array.from(this.nodes.values())
  }

  getAllEdges() {
    const edges = []
    const seen = new Set()
    
    for (const [from, neighbors] of this.adjacencyList) {
      for (const { node: to, weight } of neighbors) {
        const edgeKey = this.isDirected ? `${from}->${to}` : [from, to].sort().join('-')
        if (!seen.has(edgeKey)) {
          edges.push({
            from,
            to,
            weight,
            key: edgeKey
          })
          seen.add(edgeKey)
        }
      }
    }
    return edges
  }

  bfs(startId, targetId = null, steps = []) {
    if (!this.nodes.has(startId)) return steps

    const queue = [startId]
    const visited = new Set()
    const parent = new Map()
    
    steps.push({
      graph: this.copy(),
      queue: [...queue],
      visited: [],
      currentNode: null,
      description: `Starting BFS from node ${startId}`,
      operation: 'bfs',
      phase: 'start'
    })

    while (queue.length > 0) {
      const currentId = queue.shift()
      
      if (visited.has(currentId)) continue
      
      visited.add(currentId)
      
      steps.push({
        graph: this.copy(),
        queue: [...queue],
        visited: Array.from(visited),
        currentNode: currentId,
        description: `Visiting node ${currentId}`,
        operation: 'bfs',
        phase: 'visiting'
      })

      if (targetId && currentId === targetId) {
        const path = this._reconstructPath(parent, startId, targetId)
        steps.push({
          graph: this.copy(),
          queue: [...queue],
          visited: Array.from(visited),
          currentNode: currentId,
          path: path,
          description: `Found target ${targetId}! Path: ${path.join(' → ')}`,
          operation: 'bfs',
          phase: 'found'
        })
        break
      }

      const neighbors = this.getNeighbors(currentId)
      for (const { node: neighborId } of neighbors) {
        if (!visited.has(neighborId) && !queue.includes(neighborId)) {
          queue.push(neighborId)
          parent.set(neighborId, currentId)
          
          steps.push({
            graph: this.copy(),
            queue: [...queue],
            visited: Array.from(visited),
            currentNode: currentId,
            processingNeighbor: neighborId,
            description: `Added ${neighborId} to queue`,
            operation: 'bfs',
            phase: 'processing'
          })
        }
      }
    }

    steps.push({
      graph: this.copy(),
      queue: [],
      visited: Array.from(visited),
      currentNode: null,
      description: targetId ? 
        (visited.has(targetId) ? `BFS Complete - Found ${targetId}` : `BFS Complete - ${targetId} not reachable`) :
        'BFS Complete - All reachable nodes visited',
      operation: 'bfs',
      phase: 'complete'
    })

    return steps
  }

  dfs(startId, targetId = null, steps = []) {
    if (!this.nodes.has(startId)) return steps

    const stack = [startId]
    const visited = new Set()
    const parent = new Map()
    
    steps.push({
      graph: this.copy(),
      stack: [...stack],
      visited: [],
      currentNode: null,
      description: `Starting DFS from node ${startId}`,
      operation: 'dfs',
      phase: 'start'
    })

    while (stack.length > 0) {
      const currentId = stack.pop()
      
      if (visited.has(currentId)) continue
      
      visited.add(currentId)
      
      steps.push({
        graph: this.copy(),
        stack: [...stack],
        visited: Array.from(visited),
        currentNode: currentId,
        description: `Visiting node ${currentId}`,
        operation: 'dfs',
        phase: 'visiting'
      })

      if (targetId && currentId === targetId) {
        const path = this._reconstructPath(parent, startId, targetId)
        steps.push({
          graph: this.copy(),
          stack: [...stack],
          visited: Array.from(visited),
          currentNode: currentId,
          path: path,
          description: `Found target ${targetId}! Path: ${path.join(' → ')}`,
          operation: 'dfs',
          phase: 'found'
        })
        break
      }

      const neighbors = this.getNeighbors(currentId).reverse() // Reverse for consistent ordering
      for (const { node: neighborId } of neighbors) {
        if (!visited.has(neighborId)) {
          stack.push(neighborId)
          if (!parent.has(neighborId)) {
            parent.set(neighborId, currentId)
          }
          
          steps.push({
            graph: this.copy(),
            stack: [...stack],
            visited: Array.from(visited),
            currentNode: currentId,
            processingNeighbor: neighborId,
            description: `Added ${neighborId} to stack`,
            operation: 'dfs',
            phase: 'processing'
          })
        }
      }
    }

    steps.push({
      graph: this.copy(),
      stack: [],
      visited: Array.from(visited),
      currentNode: null,
      description: targetId ? 
        (visited.has(targetId) ? `DFS Complete - Found ${targetId}` : `DFS Complete - ${targetId} not reachable`) :
        'DFS Complete - All reachable nodes visited',
      operation: 'dfs',
      phase: 'complete'
    })

    return steps
  }

  _reconstructPath(parent, start, end) {
    const path = []
    let current = end
    
    while (current !== undefined) {
      path.unshift(current)
      current = parent.get(current)
      if (current === start) {
        path.unshift(start)
        break
      }
    }
    
    return path
  }

  copy() {
    const newGraph = new Graph(this.isDirected, this.isWeighted)
    
    // Copy nodes
    for (const [id, node] of this.nodes) {
      newGraph.addNode(id, node.x, node.y, node.label)
    }
    
    // Copy edges
    const addedEdges = new Set()
    for (const [from, neighbors] of this.adjacencyList) {
      for (const { node: to, weight } of neighbors) {
        const edgeKey = this.isDirected ? `${from}->${to}` : [from, to].sort().join('-')
        if (!addedEdges.has(edgeKey)) {
          newGraph.addEdge(from, to, weight)
          addedEdges.add(edgeKey)
        }
      }
    }
    
    return newGraph
  }
}

export default function GraphVisualization() {
  const { state, setVisualizationData } = useApp()
  const [graph] = useState(() => new Graph(false, false))
  const [currentGraph, setCurrentGraph] = useState(null)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bfs')
  const [startNode, setStartNode] = useState('A')
  const [targetNode, setTargetNode] = useState('E')
  const [algorithmState, setAlgorithmState] = useState({})

  const generateVisualizationData = useCallback((algorithm, start, target = null) => {
    switch (algorithm) {
      case 'bfs':
        return graph.bfs(start, target)
      case 'dfs':
        return graph.dfs(start, target)
      default:
        return []
    }
  }, [graph])

  const handleAlgorithmRun = (algorithm) => {
    setSelectedAlgorithm(algorithm)
    const steps = generateVisualizationData(algorithm, startNode, targetNode)
    setVisualizationData(steps, `graph-${algorithm}`)
  }

  const generateSampleGraph = () => {
    // Clear existing graph
    graph.nodes.clear()
    graph.adjacencyList.clear()
    
    // Generate 6-8 nodes randomly positioned
    const nodeCount = 6 + Math.floor(Math.random() * 3) // 6-8 nodes
    const nodeIds = Array.from({ length: nodeCount }, (_, i) => String.fromCharCode(65 + i)) // A, B, C, etc.
    
    // Generate random positions ensuring nodes don't overlap
    const nodePositions = []
    for (let i = 0; i < nodeCount; i++) {
      let x, y, attempts = 0
      do {
        x = 100 + Math.random() * 400 // x between 100-500
        y = 80 + Math.random() * 240  // y between 80-320
        attempts++
      } while (
        attempts < 50 && 
        nodePositions.some(pos => 
          Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2) < 80
        )
      )
      
      nodePositions.push({ id: nodeIds[i], x, y })
    }

    // Add nodes
    nodePositions.forEach(({ id, x, y }) => {
      graph.addNode(id, x, y)
    })

    // Generate random edges ensuring connectivity
    const edges = new Set()
    
    // First ensure the graph is connected by creating a spanning tree
    const unconnected = new Set(nodeIds.slice(1))
    let connected = new Set([nodeIds[0]])
    
    while (unconnected.size > 0) {
      const connectedNode = Array.from(connected)[Math.floor(Math.random() * connected.size)]
      const unconnectedNode = Array.from(unconnected)[Math.floor(Math.random() * unconnected.size)]
      
      const edge = [connectedNode, unconnectedNode].sort().join('-')
      edges.add(edge)
      
      connected.add(unconnectedNode)
      unconnected.delete(unconnectedNode)
    }
    
    // Add additional random edges (30-60% more edges)
    const maxAdditionalEdges = Math.floor((nodeCount * (nodeCount - 1)) / 4)
    const additionalEdges = Math.floor(Math.random() * maxAdditionalEdges)
    
    for (let i = 0; i < additionalEdges; i++) {
      const from = nodeIds[Math.floor(Math.random() * nodeCount)]
      const to = nodeIds[Math.floor(Math.random() * nodeCount)]
      
      if (from !== to) {
        const edge = [from, to].sort().join('-')
        edges.add(edge)
      }
    }

    // Add edges to graph
    edges.forEach(edge => {
      const [from, to] = edge.split('-')
      graph.addEdge(from, to)
    })

    setCurrentGraph(graph.copy())
    setAlgorithmState({})
  }

  const clearGraph = () => {
    graph.nodes.clear()
    graph.adjacencyList.clear()
    setCurrentGraph(null)
    setAlgorithmState({})
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && state.visualizationContext?.startsWith('graph-')) {
      setCurrentGraph(currentStep.graph)
      setAlgorithmState(currentStep)
    }
  }, [state.currentStep, state.visualizationData, state.visualizationContext])

  const getNodeColor = (nodeId, currentStep) => {
    if (!currentStep) return GRAPH_COLORS.node.default
    
    if (currentStep.path && currentStep.path.includes(nodeId)) {
      return GRAPH_COLORS.node.path
    }
    if (currentStep.currentNode === nodeId) {
      return GRAPH_COLORS.node.current
    }
    if (currentStep.processingNeighbor === nodeId) {
      return GRAPH_COLORS.node.processing
    }
    if (currentStep.visited && currentStep.visited.includes(nodeId)) {
      return GRAPH_COLORS.node.visited
    }
    if (nodeId === startNode) {
      return GRAPH_COLORS.node.start
    }
    if (nodeId === targetNode) {
      return GRAPH_COLORS.node.end
    }
    
    return GRAPH_COLORS.node.default
  }

  const getEdgeColor = (edge, currentStep) => {
    if (!currentStep) return GRAPH_COLORS.edge.default
    
    if (currentStep.path) {
      for (let i = 0; i < currentStep.path.length - 1; i++) {
        const from = currentStep.path[i]
        const to = currentStep.path[i + 1]
        if ((edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)) {
          return GRAPH_COLORS.edge.path
        }
      }
    }
    
    if (currentStep.currentNode && 
        (edge.from === currentStep.currentNode || edge.to === currentStep.currentNode)) {
      return GRAPH_COLORS.edge.active
    }
    
    return GRAPH_COLORS.edge.default
  }

  const renderGraph = () => {
    if (!currentGraph) return null

    const nodes = currentGraph.getAllNodes()
    const edges = currentGraph.getAllEdges()
    const currentStep = state.visualizationData[state.currentStep]

    return (
      <svg 
        width="600" 
        height="400" 
        className="w-full h-96 bg-white rounded-lg shadow-sm"
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Render edges */}
        {edges.map((edge) => {
          const fromNode = currentGraph.nodes.get(edge.from)
          const toNode = currentGraph.nodes.get(edge.to)
          const edgeColor = getEdgeColor(edge, currentStep)
          
          return (
            <motion.line
              key={edge.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={edgeColor}
              strokeWidth={currentStep && currentStep.path ? 3 : 2}
              transition={{ duration: 0.3 }}
            />
          )
        })}

        {/* Render nodes */}
        {nodes.map((node) => {
          const nodeColor = getNodeColor(node.id, currentStep)
          const isHighlighted = currentStep && 
            (currentStep.currentNode === node.id || currentStep.processingNeighbor === node.id)
          
          return (
            <g key={node.id}>
              <motion.circle
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHighlighted ? 1.2 : 1, 
                  opacity: 1 
                }}
                transition={{ duration: 0.3 }}
                cx={node.x}
                cy={node.y}
                r={20}
                fill={nodeColor}
                stroke="#374151"
                strokeWidth={2}
              />
              <motion.text
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="text-sm font-bold fill-gray-800 select-none"
              >
                {node.label}
              </motion.text>
            </g>
          )
        })}
      </svg>
    )
  }

  useEffect(() => {
    generateSampleGraph()
  }, [])

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Algorithm Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Graph Traversal</label>
            <div className="space-y-2">
              <button
                onClick={() => handleAlgorithmRun('bfs')}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedAlgorithm === 'bfs'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Breadth-First Search (BFS)
              </button>
              <button
                onClick={() => handleAlgorithmRun('dfs')}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedAlgorithm === 'dfs'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Depth-First Search (DFS)
              </button>
            </div>
          </div>

          {/* Node Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search Parameters</label>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Node</label>
                <select
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {currentGraph?.getAllNodes().map(node => (
                    <option key={node.id} value={node.id}>{node.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Target Node</label>
                <select
                  value={targetNode}
                  onChange={(e) => setTargetNode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {currentGraph?.getAllNodes().map(node => (
                    <option key={node.id} value={node.id}>{node.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Utility Controls */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Graph Operations</label>
            <div className="space-y-2">
              <button
                onClick={generateSampleGraph}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
              >
                Generate Sample Graph
              </button>
              <button
                onClick={clearGraph}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Clear Graph
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Graph Traversal Algorithms</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div><strong>BFS (Queue):</strong> Explores neighbors level by level, guarantees shortest path</div>
          <div><strong>DFS (Stack):</strong> Goes as deep as possible, then backtracks</div>
          <div><strong>Applications:</strong> Pathfinding, connectivity, cycle detection</div>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full">
          {renderGraph()}
          
          {!currentGraph && (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">No graph to visualize</p>
                <p className="text-sm">Generate a sample graph to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* Algorithm State Display */}
        {algorithmState.operation && (
          <div className="w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {algorithmState.queue && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Queue (BFS)</h4>
                  <div className="flex space-x-1">
                    {algorithmState.queue.map((nodeId, index) => (
                      <div key={`queue-${index}`} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">
                        {nodeId}
                      </div>
                    ))}
                    {algorithmState.queue.length === 0 && (
                      <span className="text-blue-600">Empty</span>
                    )}
                  </div>
                </div>
              )}
              
              {algorithmState.stack && (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Stack (DFS)</h4>
                  <div className="flex space-x-1">
                    {algorithmState.stack.map((nodeId, index) => (
                      <div key={`stack-${index}`} className="px-2 py-1 bg-orange-500 text-white rounded text-xs">
                        {nodeId}
                      </div>
                    ))}
                    {algorithmState.stack.length === 0 && (
                      <span className="text-orange-600">Empty</span>
                    )}
                  </div>
                </div>
              )}
              
              {algorithmState.visited && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Visited Nodes</h4>
                  <div className="flex flex-wrap gap-1">
                    {algorithmState.visited.map((nodeId, index) => (
                      <div key={`visited-${index}`} className="px-2 py-1 bg-green-500 text-white rounded text-xs">
                        {nodeId}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {algorithmState.path && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Found Path</h4>
                  <div className="text-purple-700">
                    {algorithmState.path.join(' → ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-600"></div>
            <span>Start Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span>Target Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span>Path</span>
          </div>
        </div>

        {/* Current Operation Description */}
        <AnimatePresence>
          {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && 
          state.visualizationContext?.startsWith('graph-') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl text-center"
            >
              <p className="text-blue-800 font-medium">
                {state.visualizationData[state.currentStep].description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}