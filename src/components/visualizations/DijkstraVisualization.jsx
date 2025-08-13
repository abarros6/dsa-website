import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const DIJKSTRA_COLORS = {
  node: {
    default: '#e2e8f0',
    start: '#059669',
    current: '#3b82f6',
    visited: '#10b981',
    unvisited: '#fbbf24',
    path: '#8b5cf6'
  },
  edge: {
    default: '#6b7280',
    current: '#3b82f6',
    path: '#8b5cf6',
    relaxing: '#f59e0b'
  }
}

class WeightedGraph {
  constructor() {
    this.nodes = new Map()
    this.adjacencyList = new Map()
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

  addEdge(from, to, weight) {
    if (!this.adjacencyList.has(from)) this.adjacencyList.set(from, [])
    if (!this.adjacencyList.has(to)) this.adjacencyList.set(to, [])

    this.adjacencyList.get(from).push({ node: to, weight })
    this.adjacencyList.get(to).push({ node: from, weight })
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
        const edgeKey = [from, to].sort().join('-')
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

  dijkstra(startId, steps = []) {
    if (!this.nodes.has(startId)) return steps

    const distances = new Map()
    const previous = new Map()
    const unvisited = new Set()
    
    // Initialize distances
    for (const nodeId of this.nodes.keys()) {
      distances.set(nodeId, nodeId === startId ? 0 : Infinity)
      unvisited.add(nodeId)
    }

    steps.push({
      graph: this.copy(),
      distances: new Map(distances),
      previous: new Map(previous),
      unvisited: new Set(unvisited),
      currentNode: null,
      description: `Starting Dijkstra's algorithm from ${startId}. All distances initialized.`,
      operation: 'dijkstra',
      phase: 'initialize'
    })

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let currentNode = null
      let minDistance = Infinity
      
      for (const nodeId of unvisited) {
        if (distances.get(nodeId) < minDistance) {
          minDistance = distances.get(nodeId)
          currentNode = nodeId
        }
      }

      if (currentNode === null || minDistance === Infinity) {
        steps.push({
          graph: this.copy(),
          distances: new Map(distances),
          previous: new Map(previous),
          unvisited: new Set(unvisited),
          description: 'No more reachable nodes. Algorithm complete.',
          operation: 'dijkstra',
          phase: 'complete'
        })
        break
      }

      unvisited.delete(currentNode)

      steps.push({
        graph: this.copy(),
        distances: new Map(distances),
        previous: new Map(previous),
        unvisited: new Set(unvisited),
        currentNode: currentNode,
        description: `Visiting node ${currentNode} with distance ${distances.get(currentNode)}`,
        operation: 'dijkstra',
        phase: 'visiting'
      })

      // Check neighbors
      const neighbors = this.getNeighbors(currentNode)
      for (const { node: neighborId, weight } of neighbors) {
        if (!unvisited.has(neighborId)) continue

        const currentDistance = distances.get(currentNode)
        const newDistance = currentDistance + weight
        const neighborDistance = distances.get(neighborId)

        steps.push({
          graph: this.copy(),
          distances: new Map(distances),
          previous: new Map(previous),
          unvisited: new Set(unvisited),
          currentNode: currentNode,
          checkingNeighbor: neighborId,
          currentEdge: { from: currentNode, to: neighborId, weight },
          description: `Checking neighbor ${neighborId}. Current distance: ${neighborDistance}, new distance: ${newDistance}`,
          operation: 'dijkstra',
          phase: 'checking'
        })

        if (newDistance < neighborDistance) {
          distances.set(neighborId, newDistance)
          previous.set(neighborId, currentNode)

          steps.push({
            graph: this.copy(),
            distances: new Map(distances),
            previous: new Map(previous),
            unvisited: new Set(unvisited),
            currentNode: currentNode,
            relaxedNeighbor: neighborId,
            currentEdge: { from: currentNode, to: neighborId, weight },
            description: `Updated distance to ${neighborId}: ${newDistance} (via ${currentNode})`,
            operation: 'dijkstra',
            phase: 'relax'
          })
        }
      }
    }

    // Final step showing all shortest paths
    const shortestPaths = new Map()
    for (const nodeId of this.nodes.keys()) {
      if (nodeId !== startId && distances.get(nodeId) !== Infinity) {
        shortestPaths.set(nodeId, this._reconstructPath(previous, startId, nodeId))
      }
    }

    steps.push({
      graph: this.copy(),
      distances: new Map(distances),
      previous: new Map(previous),
      shortestPaths: shortestPaths,
      description: `Dijkstra's algorithm complete. Shortest paths from ${startId} calculated.`,
      operation: 'dijkstra',
      phase: 'complete'
    })

    return steps
  }

  _reconstructPath(previous, start, end) {
    const path = []
    let current = end
    
    while (current !== undefined) {
      path.unshift(current)
      current = previous.get(current)
      if (current === start) {
        path.unshift(start)
        break
      }
    }
    
    return path
  }

  copy() {
    const newGraph = new WeightedGraph()
    
    // Copy nodes
    for (const [id, node] of this.nodes) {
      newGraph.addNode(id, node.x, node.y, node.label)
    }
    
    // Copy edges
    const addedEdges = new Set()
    for (const [from, neighbors] of this.adjacencyList) {
      for (const { node: to, weight } of neighbors) {
        const edgeKey = [from, to].sort().join('-')
        if (!addedEdges.has(edgeKey)) {
          newGraph.addEdge(from, to, weight)
          addedEdges.add(edgeKey)
        }
      }
    }
    
    return newGraph
  }
}

export default function DijkstraVisualization() {
  const { state, setVisualizationData } = useApp()
  const [graph] = useState(() => new WeightedGraph())
  const [currentGraph, setCurrentGraph] = useState(null)
  const [startNode, setStartNode] = useState('A')
  const [algorithmState, setAlgorithmState] = useState({})
  const [selectedPath, setSelectedPath] = useState(null)

  const generateVisualizationData = useCallback(() => {
    return graph.dijkstra(startNode)
  }, [graph, startNode])

  const handleAlgorithmRun = () => {
    const steps = generateVisualizationData()
    setVisualizationData(steps, 'dijkstra')
    setSelectedPath(null)
  }

  const showPathTo = (targetNode) => {
    if (algorithmState.shortestPaths?.has(targetNode)) {
      setSelectedPath(algorithmState.shortestPaths.get(targetNode))
    }
  }

  const generateSampleGraph = () => {
    // Clear existing graph
    graph.nodes.clear()
    graph.adjacencyList.clear()
    
    // Generate 5-7 nodes randomly positioned
    const nodeCount = 5 + Math.floor(Math.random() * 3) // 5-7 nodes
    const nodeIds = Array.from({ length: nodeCount }, (_, i) => String.fromCharCode(65 + i))
    
    // Generate random positions ensuring nodes don't overlap
    const nodePositions = []
    for (let i = 0; i < nodeCount; i++) {
      let x, y, attempts = 0
      do {
        x = 80 + Math.random() * 440 // x between 80-520
        y = 80 + Math.random() * 190 // y between 80-270
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

    // Generate weighted edges ensuring connectivity
    const edges = new Set()
    const edgeWeights = new Map()
    
    // First ensure connectivity with a spanning tree
    const unconnected = new Set(nodeIds.slice(1))
    let connected = new Set([nodeIds[0]])
    
    while (unconnected.size > 0) {
      const connectedNode = Array.from(connected)[Math.floor(Math.random() * connected.size)]
      const unconnectedNode = Array.from(unconnected)[Math.floor(Math.random() * unconnected.size)]
      
      const edge = [connectedNode, unconnectedNode].sort().join('-')
      const weight = 1 + Math.floor(Math.random() * 9) // weights 1-9
      
      edges.add(edge)
      edgeWeights.set(edge, weight)
      
      connected.add(unconnectedNode)
      unconnected.delete(unconnectedNode)
    }
    
    // Add additional random weighted edges
    const maxAdditionalEdges = Math.floor(nodeCount * 0.8) // Add up to 80% more edges
    const additionalEdges = Math.floor(Math.random() * maxAdditionalEdges)
    
    for (let i = 0; i < additionalEdges; i++) {
      const from = nodeIds[Math.floor(Math.random() * nodeCount)]
      const to = nodeIds[Math.floor(Math.random() * nodeCount)]
      
      if (from !== to) {
        const edge = [from, to].sort().join('-')
        if (!edges.has(edge)) {
          const weight = 1 + Math.floor(Math.random() * 9) // weights 1-9
          edges.add(edge)
          edgeWeights.set(edge, weight)
        }
      }
    }

    // Add edges to graph
    edges.forEach(edge => {
      const [from, to] = edge.split('-')
      const weight = edgeWeights.get(edge)
      graph.addEdge(from, to, weight)
    })

    setCurrentGraph(graph.copy())
    setAlgorithmState({})
    setSelectedPath(null)
  }

  const clearGraph = () => {
    graph.nodes.clear()
    graph.adjacencyList.clear()
    setCurrentGraph(null)
    setAlgorithmState({})
    setSelectedPath(null)
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && state.visualizationContext === 'dijkstra') {
      setCurrentGraph(currentStep.graph)
      setAlgorithmState(currentStep)
    }
  }, [state.currentStep, state.visualizationData, state.visualizationContext])

  const getNodeColor = (nodeId, currentStep) => {
    if (!currentStep) return DIJKSTRA_COLORS.node.default
    
    if (selectedPath && selectedPath.includes(nodeId)) {
      return DIJKSTRA_COLORS.node.path
    }
    if (nodeId === startNode) {
      return DIJKSTRA_COLORS.node.start
    }
    if (currentStep.currentNode === nodeId) {
      return DIJKSTRA_COLORS.node.current
    }
    if (currentStep.unvisited && currentStep.unvisited.has(nodeId)) {
      return DIJKSTRA_COLORS.node.unvisited
    }
    if (currentStep.unvisited && !currentStep.unvisited.has(nodeId)) {
      return DIJKSTRA_COLORS.node.visited
    }
    
    return DIJKSTRA_COLORS.node.default
  }

  const getEdgeColor = (edge, currentStep) => {
    if (!currentStep) return DIJKSTRA_COLORS.edge.default
    
    if (selectedPath) {
      for (let i = 0; i < selectedPath.length - 1; i++) {
        const from = selectedPath[i]
        const to = selectedPath[i + 1]
        if ((edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)) {
          return DIJKSTRA_COLORS.edge.path
        }
      }
    }
    
    if (currentStep.currentEdge && 
        ((edge.from === currentStep.currentEdge.from && edge.to === currentStep.currentEdge.to) ||
         (edge.from === currentStep.currentEdge.to && edge.to === currentStep.currentEdge.from))) {
      if (currentStep.phase === 'relax') {
        return DIJKSTRA_COLORS.edge.relaxing
      }
      return DIJKSTRA_COLORS.edge.current
    }
    
    return DIJKSTRA_COLORS.edge.default
  }

  const renderGraph = () => {
    if (!currentGraph) return null

    const nodes = currentGraph.getAllNodes()
    const edges = currentGraph.getAllEdges()
    const currentStep = state.visualizationData[state.currentStep]

    return (
      <svg 
        width="600" 
        height="350" 
        className="w-full h-80 bg-white rounded-lg shadow-sm"
        viewBox="0 0 600 350"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Render edges */}
        {edges.map((edge) => {
          const fromNode = currentGraph.nodes.get(edge.from)
          const toNode = currentGraph.nodes.get(edge.to)
          const edgeColor = getEdgeColor(edge, currentStep)
          
          // Calculate midpoint for weight label
          const midX = (fromNode.x + toNode.x) / 2
          const midY = (fromNode.y + toNode.y) / 2
          
          return (
            <g key={edge.key}>
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={edgeColor}
                strokeWidth={3}
                transition={{ duration: 0.3 }}
              />
              {/* Weight label */}
              <motion.circle
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                cx={midX}
                cy={midY}
                r={12}
                fill="white"
                stroke="#6b7280"
                strokeWidth={1}
              />
              <motion.text
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x={midX}
                y={midY + 4}
                textAnchor="middle"
                className="text-xs font-bold fill-gray-700"
              >
                {edge.weight}
              </motion.text>
            </g>
          )
        })}

        {/* Render nodes */}
        {nodes.map((node) => {
          const nodeColor = getNodeColor(node.id, currentStep)
          const isHighlighted = currentStep && 
            (currentStep.currentNode === node.id || currentStep.checkingNeighbor === node.id)
          
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
              
              {/* Distance label */}
              {currentStep?.distances && (
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  x={node.x}
                  y={node.y - 30}
                  textAnchor="middle"
                  className="text-xs font-bold fill-blue-600"
                >
                  d: {currentStep.distances.get(node.id) === Infinity ? '∞' : currentStep.distances.get(node.id)}
                </motion.text>
              )}
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
          {/* Algorithm Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Dijkstra's Algorithm</label>
            <button
              onClick={handleAlgorithmRun}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
            >
              Find Shortest Paths
            </button>
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
          </div>

          {/* Path Display */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Show Path To</label>
            <div className="grid grid-cols-2 gap-2">
              {currentGraph?.getAllNodes()
                .filter(node => node.id !== startNode)
                .map(node => (
                  <button
                    key={node.id}
                    onClick={() => showPathTo(node.id)}
                    className={`px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedPath && selectedPath.includes(node.id)
                        ? 'bg-purple-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {node.label}
                  </button>
                ))}
            </div>
            <button
              onClick={() => setSelectedPath(null)}
              className="w-full px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-xs"
            >
              Clear Path
            </button>
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
        <h3 className="font-semibold text-blue-800 mb-2">Dijkstra's Shortest Path Algorithm</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div><strong>Purpose:</strong> Finds shortest paths from source to all other vertices</div>
          <div><strong>Approach:</strong> Greedy algorithm using priority queue (min-heap)</div>
          <div><strong>Time Complexity:</strong> O((V + E) log V) with binary heap</div>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full">
          {renderGraph()}
          
          {!currentGraph && (
            <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">No graph to visualize</p>
                <p className="text-sm">Generate a sample graph to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* Distance Table */}
        {algorithmState.distances && (
          <div className="w-full max-w-4xl">
            <h4 className="font-semibold text-gray-800 mb-3 text-center">Distance Table</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {Array.from(algorithmState.distances.entries()).map(([nodeId, distance]) => (
                <div key={nodeId} className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="font-bold text-gray-800">{nodeId}</div>
                  <div className="text-sm text-gray-600">
                    {distance === Infinity ? '∞' : distance}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Path Display */}
        {selectedPath && (
          <div className="w-full max-w-2xl">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <h4 className="font-semibold text-purple-800 mb-2">Selected Path</h4>
              <div className="text-purple-700 text-lg">
                {selectedPath.join(' → ')}
              </div>
              <div className="text-sm text-purple-600 mt-1">
                Total Distance: {algorithmState.distances?.get(selectedPath[selectedPath.length - 1]) || 0}
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-600"></div>
            <span>Start</span>
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
            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
            <span>Unvisited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span>Path</span>
          </div>
        </div>

        {/* Current Operation Description */}
        <AnimatePresence>
          {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && 
          state.visualizationContext === 'dijkstra' && (
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