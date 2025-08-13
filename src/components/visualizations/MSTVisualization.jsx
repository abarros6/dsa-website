import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const MST_COLORS = {
  node: {
    default: '#e2e8f0',
    inMST: '#10b981',
    current: '#3b82f6',
    considering: '#f59e0b'
  },
  edge: {
    default: '#6b7280',
    inMST: '#10b981',
    current: '#3b82f6',
    considering: '#f59e0b',
    rejected: '#ef4444'
  }
}

class UnionFind {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i)
    this.rank = Array(size).fill(0)
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x])
    }
    return this.parent[x]
  }

  union(x, y) {
    const rootX = this.find(x)
    const rootY = this.find(y)
    
    if (rootX !== rootY) {
      if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY
      } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX
      } else {
        this.parent[rootY] = rootX
        this.rank[rootX]++
      }
      return true
    }
    return false
  }

  connected(x, y) {
    return this.find(x) === this.find(y)
  }
}

class MSTGraph {
  constructor() {
    this.nodes = new Map()
    this.adjacencyList = new Map()
    this.nodeIdMap = new Map() // Maps node IDs to indices for Union-Find
    this.nextIndex = 0
  }

  addNode(id, x, y, label = null) {
    const node = {
      id,
      x,
      y,
      label: label || id.toString(),
      index: this.nextIndex
    }
    this.nodes.set(id, node)
    this.nodeIdMap.set(id, this.nextIndex)
    this.nextIndex++
    
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
    
    // Sort edges by weight for Kruskal's algorithm
    return edges.sort((a, b) => a.weight - b.weight)
  }

  kruskalMST(steps = []) {
    const edges = this.getAllEdges()
    const nodeCount = this.nodes.size
    const unionFind = new UnionFind(nodeCount)
    const mstEdges = []
    let totalWeight = 0

    steps.push({
      graph: this.copy(),
      sortedEdges: edges.slice(),
      mstEdges: [],
      currentEdge: null,
      description: `Starting Kruskal's MST. ${edges.length} edges sorted by weight.`,
      operation: 'kruskal',
      phase: 'start',
      totalWeight: 0
    })

    for (let i = 0; i < edges.length && mstEdges.length < nodeCount - 1; i++) {
      const edge = edges[i]
      const fromIndex = this.nodeIdMap.get(edge.from)
      const toIndex = this.nodeIdMap.get(edge.to)

      steps.push({
        graph: this.copy(),
        sortedEdges: edges.slice(),
        mstEdges: mstEdges.slice(),
        currentEdge: edge,
        description: `Considering edge ${edge.from}-${edge.to} with weight ${edge.weight}`,
        operation: 'kruskal',
        phase: 'considering',
        totalWeight: totalWeight
      })

      if (!unionFind.connected(fromIndex, toIndex)) {
        unionFind.union(fromIndex, toIndex)
        mstEdges.push(edge)
        totalWeight += edge.weight

        steps.push({
          graph: this.copy(),
          sortedEdges: edges.slice(),
          mstEdges: mstEdges.slice(),
          currentEdge: edge,
          description: `Added edge ${edge.from}-${edge.to} to MST. Total weight: ${totalWeight}`,
          operation: 'kruskal',
          phase: 'added',
          totalWeight: totalWeight
        })
      } else {
        steps.push({
          graph: this.copy(),
          sortedEdges: edges.slice(),
          mstEdges: mstEdges.slice(),
          currentEdge: edge,
          description: `Rejected edge ${edge.from}-${edge.to} - would create cycle`,
          operation: 'kruskal',
          phase: 'rejected',
          totalWeight: totalWeight
        })
      }
    }

    steps.push({
      graph: this.copy(),
      sortedEdges: edges.slice(),
      mstEdges: mstEdges.slice(),
      currentEdge: null,
      description: `Kruskal's MST complete! Total weight: ${totalWeight}`,
      operation: 'kruskal',
      phase: 'complete',
      totalWeight: totalWeight
    })

    return steps
  }

  primMST(startId, steps = []) {
    if (!this.nodes.has(startId)) return steps

    const inMST = new Set()
    const mstEdges = []
    const nodeCount = this.nodes.size
    let totalWeight = 0

    // Priority queue simulation - we'll use a simple array and sort
    const edges = []
    
    // Start with the first node
    inMST.add(startId)

    steps.push({
      graph: this.copy(),
      inMST: new Set([startId]),
      mstEdges: [],
      availableEdges: [],
      currentEdge: null,
      description: `Starting Prim's MST from node ${startId}`,
      operation: 'prim',
      phase: 'start',
      totalWeight: 0
    })

    // Add all edges from the starting node
    for (const { node: to, weight } of this.adjacencyList.get(startId)) {
      if (!inMST.has(to)) {
        edges.push({ from: startId, to, weight })
      }
    }

    while (edges.length > 0 && mstEdges.length < nodeCount - 1) {
      // Sort edges by weight to get minimum
      edges.sort((a, b) => a.weight - b.weight)
      
      // Find the minimum weight edge that doesn't create a cycle
      let selectedEdge = null
      let selectedIndex = -1
      
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i]
        if (inMST.has(edge.from) && !inMST.has(edge.to)) {
          selectedEdge = edge
          selectedIndex = i
          break
        } else if (!inMST.has(edge.from) && inMST.has(edge.to)) {
          selectedEdge = { from: edge.to, to: edge.from, weight: edge.weight }
          selectedIndex = i
          break
        }
      }

      if (selectedEdge) {
        steps.push({
          graph: this.copy(),
          inMST: new Set(inMST),
          mstEdges: mstEdges.slice(),
          availableEdges: edges.slice(),
          currentEdge: selectedEdge,
          description: `Selecting minimum edge ${selectedEdge.from}-${selectedEdge.to} with weight ${selectedEdge.weight}`,
          operation: 'prim',
          phase: 'selecting',
          totalWeight: totalWeight
        })

        // Add the new node to MST
        const newNode = selectedEdge.to
        inMST.add(newNode)
        mstEdges.push(selectedEdge)
        totalWeight += selectedEdge.weight

        steps.push({
          graph: this.copy(),
          inMST: new Set(inMST),
          mstEdges: mstEdges.slice(),
          availableEdges: edges.slice(),
          currentEdge: selectedEdge,
          description: `Added node ${newNode} to MST. Total weight: ${totalWeight}`,
          operation: 'prim',
          phase: 'added',
          totalWeight: totalWeight
        })

        // Remove the selected edge
        edges.splice(selectedIndex, 1)

        // Add new edges from the newly added node
        for (const { node: to, weight } of this.adjacencyList.get(newNode)) {
          if (!inMST.has(to)) {
            edges.push({ from: newNode, to, weight })
          }
        }

        // Remove edges that are no longer useful (both endpoints in MST)
        const filteredEdges = edges.filter(edge => 
          !(inMST.has(edge.from) && inMST.has(edge.to))
        )
        edges.length = 0
        edges.push(...filteredEdges)
      } else {
        break
      }
    }

    steps.push({
      graph: this.copy(),
      inMST: new Set(inMST),
      mstEdges: mstEdges.slice(),
      availableEdges: [],
      currentEdge: null,
      description: `Prim's MST complete! Total weight: ${totalWeight}`,
      operation: 'prim',
      phase: 'complete',
      totalWeight: totalWeight
    })

    return steps
  }

  copy() {
    const newGraph = new MSTGraph()
    
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

export default function MSTVisualization() {
  const { state, setVisualizationData } = useApp()
  const [graph] = useState(() => new MSTGraph())
  const [currentGraph, setCurrentGraph] = useState(null)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('kruskal')
  const [startNode, setStartNode] = useState('A')
  const [algorithmState, setAlgorithmState] = useState({})

  const generateVisualizationData = useCallback((algorithm) => {
    switch (algorithm) {
      case 'kruskal':
        return graph.kruskalMST()
      case 'prim':
        return graph.primMST(startNode)
      default:
        return []
    }
  }, [graph, startNode])

  const handleAlgorithmRun = (algorithm) => {
    setSelectedAlgorithm(algorithm)
    const steps = generateVisualizationData(algorithm)
    setVisualizationData(steps, `mst-${algorithm}`)
  }

  const generateSampleGraph = () => {
    // Clear existing graph
    graph.nodes.clear()
    graph.adjacencyList.clear()
    graph.nodeIdMap.clear()
    graph.nextIndex = 0
    
    // Generate 5-7 nodes randomly positioned
    const nodeCount = 5 + Math.floor(Math.random() * 3) // 5-7 nodes
    const nodeIds = Array.from({ length: nodeCount }, (_, i) => String.fromCharCode(65 + i))
    
    // Generate random positions ensuring nodes don't overlap
    const nodePositions = []
    for (let i = 0; i < nodeCount; i++) {
      let x, y, attempts = 0
      do {
        x = 100 + Math.random() * 400 // x between 100-500
        y = 80 + Math.random() * 190  // y between 80-270
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

    // Generate weighted edges ensuring connectivity and good MST demonstration
    const edges = new Set()
    const edgeWeights = new Map()
    
    // First ensure connectivity with a spanning tree using varied weights
    const unconnected = new Set(nodeIds.slice(1))
    let connected = new Set([nodeIds[0]])
    
    while (unconnected.size > 0) {
      const connectedNode = Array.from(connected)[Math.floor(Math.random() * connected.size)]
      const unconnectedNode = Array.from(unconnected)[Math.floor(Math.random() * unconnected.size)]
      
      const edge = [connectedNode, unconnectedNode].sort().join('-')
      const weight = 1 + Math.floor(Math.random() * 8) // weights 1-8 for variety
      
      edges.add(edge)
      edgeWeights.set(edge, weight)
      
      connected.add(unconnectedNode)
      unconnected.delete(unconnectedNode)
    }
    
    // Add additional edges with higher weights to show MST selection
    const maxAdditionalEdges = Math.floor(nodeCount * 1.2) // Add up to 120% more edges
    const additionalEdges = Math.floor(Math.random() * maxAdditionalEdges)
    
    for (let i = 0; i < additionalEdges; i++) {
      const from = nodeIds[Math.floor(Math.random() * nodeCount)]
      const to = nodeIds[Math.floor(Math.random() * nodeCount)]
      
      if (from !== to) {
        const edge = [from, to].sort().join('-')
        if (!edges.has(edge)) {
          // Bias towards higher weights for additional edges to make MST interesting
          const weight = 3 + Math.floor(Math.random() * 7) // weights 3-9
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
  }

  const clearGraph = () => {
    graph.nodes.clear()
    graph.adjacencyList.clear()
    graph.nodeIdMap.clear()
    graph.nextIndex = 0
    setCurrentGraph(null)
    setAlgorithmState({})
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && state.visualizationContext?.startsWith('mst-')) {
      setCurrentGraph(currentStep.graph)
      setAlgorithmState(currentStep)
    }
  }, [state.currentStep, state.visualizationData, state.visualizationContext])

  const getNodeColor = (nodeId, currentStep) => {
    if (!currentStep) return MST_COLORS.node.default
    
    if (currentStep.inMST?.has(nodeId)) {
      return MST_COLORS.node.inMST
    }
    if (currentStep.currentEdge && 
        (currentStep.currentEdge.from === nodeId || currentStep.currentEdge.to === nodeId)) {
      return MST_COLORS.node.current
    }
    
    return MST_COLORS.node.default
  }

  const getEdgeColor = (edge, currentStep) => {
    if (!currentStep) return MST_COLORS.edge.default
    
    // Check if edge is in MST
    if (currentStep.mstEdges?.some(mstEdge => 
      (mstEdge.from === edge.from && mstEdge.to === edge.to) ||
      (mstEdge.from === edge.to && mstEdge.to === edge.from)
    )) {
      return MST_COLORS.edge.inMST
    }
    
    // Check if this is the current edge being considered
    if (currentStep.currentEdge && 
        ((currentStep.currentEdge.from === edge.from && currentStep.currentEdge.to === edge.to) ||
         (currentStep.currentEdge.from === edge.to && currentStep.currentEdge.to === edge.from))) {
      if (currentStep.phase === 'rejected') {
        return MST_COLORS.edge.rejected
      }
      return MST_COLORS.edge.current
    }
    
    return MST_COLORS.edge.default
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
          
          const isMSTEdge = currentStep?.mstEdges?.some(mstEdge => 
            (mstEdge.from === edge.from && mstEdge.to === edge.to) ||
            (mstEdge.from === edge.to && mstEdge.to === edge.from)
          )
          
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
                strokeWidth={isMSTEdge ? 4 : 2}
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
                stroke={edgeColor}
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
          const isHighlighted = currentStep?.currentEdge && 
            (currentStep.currentEdge.from === node.id || currentStep.currentEdge.to === node.id)
          
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
            <label className="block text-sm font-medium text-gray-700">MST Algorithm</label>
            <div className="space-y-2">
              <button
                onClick={() => handleAlgorithmRun('kruskal')}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedAlgorithm === 'kruskal'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Kruskal's Algorithm
              </button>
              <button
                onClick={() => handleAlgorithmRun('prim')}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedAlgorithm === 'prim'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Prim's Algorithm
              </button>
            </div>
          </div>

          {/* Parameters */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Algorithm Parameters</label>
            {selectedAlgorithm === 'prim' && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Node (Prim's)</label>
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
            )}
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Kruskal's:</strong> Sort edges, use Union-Find</div>
              <div><strong>Prim's:</strong> Grow tree from starting node</div>
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
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">Minimum Spanning Tree (MST)</h3>
        <div className="text-sm text-green-700 space-y-1">
          <div><strong>Goal:</strong> Connect all vertices with minimum total edge weight</div>
          <div><strong>Properties:</strong> Tree (no cycles), n-1 edges for n vertices</div>
          <div><strong>Applications:</strong> Network design, clustering, approximation algorithms</div>
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

        {/* Algorithm State */}
        {algorithmState.operation && (
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* MST Progress */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">MST Progress</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Edges in MST:</span>
                    <span className="font-medium">{algorithmState.mstEdges?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Weight:</span>
                    <span className="font-medium">{algorithmState.totalWeight || 0}</span>
                  </div>
                  {algorithmState.operation === 'prim' && (
                    <div className="flex justify-between">
                      <span>Nodes in MST:</span>
                      <span className="font-medium">{algorithmState.inMST?.size || 0}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Edge Info */}
              {algorithmState.currentEdge && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Current Edge</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Edge:</span>
                      <span className="font-medium">
                        {algorithmState.currentEdge.from} - {algorithmState.currentEdge.to}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weight:</span>
                      <span className="font-medium">{algorithmState.currentEdge.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium capitalize ${
                        algorithmState.phase === 'rejected' ? 'text-red-600' :
                        algorithmState.phase === 'added' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {algorithmState.phase}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Edge List for Kruskal's */}
            {algorithmState.operation === 'kruskal' && algorithmState.sortedEdges && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Sorted Edges (Kruskal's)</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {algorithmState.sortedEdges.map((edge, index) => {
                    const inMST = algorithmState.mstEdges?.some(mstEdge => 
                      (mstEdge.from === edge.from && mstEdge.to === edge.to) ||
                      (mstEdge.from === edge.to && mstEdge.to === edge.from)
                    )
                    const isCurrent = algorithmState.currentEdge &&
                      ((algorithmState.currentEdge.from === edge.from && algorithmState.currentEdge.to === edge.to) ||
                       (algorithmState.currentEdge.from === edge.to && algorithmState.currentEdge.to === edge.from))
                    
                    return (
                      <div
                        key={`${edge.from}-${edge.to}-${index}`}
                        className={`px-2 py-1 rounded text-white text-xs ${
                          inMST ? 'bg-green-500' :
                          isCurrent ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                      >
                        {edge.from}-{edge.to}({edge.weight})
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>In MST</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500"></div>
            <span>MST Edge</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500"></div>
            <span>Rejected</span>
          </div>
        </div>

        {/* Current Operation Description */}
        <AnimatePresence>
          {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && 
          state.visualizationContext?.startsWith('mst-') && (
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