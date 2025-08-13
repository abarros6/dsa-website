import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const TRAVERSAL_COLORS = {
  default: '#e2e8f0',
  current: '#3b82f6',
  visited: '#10b981',
  processing: '#f59e0b',
  output: '#8b5cf6'
}

class TreeNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

class BinaryTree {
  constructor() {
    this.root = null
  }

  insert(value) {
    if (this.root === null) {
      this.root = new TreeNode(value)
      return
    }
    this._insertRecursive(this.root, value)
  }

  _insertRecursive(node, value) {
    if (value < node.value) {
      if (node.left === null) {
        node.left = new TreeNode(value)
      } else {
        this._insertRecursive(node.left, value)
      }
    } else if (value > node.value) {
      if (node.right === null) {
        node.right = new TreeNode(value)
      } else {
        this._insertRecursive(node.right, value)
      }
    }
  }

  inOrderTraversal(steps = []) {
    const result = []
    steps.push({
      tree: this.copyTree(),
      currentNode: null,
      visitedNodes: [],
      outputArray: [],
      description: 'Starting In-Order Traversal (Left → Root → Right)',
      operation: 'inorder',
      phase: 'start'
    })
    
    this._inOrderRecursive(this.root, result, steps, [])
    
    steps.push({
      tree: this.copyTree(),
      currentNode: null,
      visitedNodes: result.slice(),
      outputArray: result.slice(),
      description: `In-Order Traversal Complete! Result: [${result.join(', ')}]`,
      operation: 'inorder',
      phase: 'complete'
    })
    
    return steps
  }

  _inOrderRecursive(node, result, steps, visitedSoFar) {
    if (node === null) return

    steps.push({
      tree: this.copyTree(),
      currentNode: node.value,
      visitedNodes: visitedSoFar.slice(),
      outputArray: result.slice(),
      description: `Processing node ${node.value} - going to left child first`,
      operation: 'inorder',
      phase: 'processing'
    })

    // Traverse left subtree
    this._inOrderRecursive(node.left, result, steps, visitedSoFar)

    // Process current node
    result.push(node.value)
    visitedSoFar.push(node.value)
    steps.push({
      tree: this.copyTree(),
      currentNode: node.value,
      visitedNodes: visitedSoFar.slice(),
      outputArray: result.slice(),
      description: `Visiting node ${node.value} and adding to result`,
      operation: 'inorder',
      phase: 'visiting'
    })

    // Traverse right subtree
    this._inOrderRecursive(node.right, result, steps, visitedSoFar)
  }

  preOrderTraversal(steps = []) {
    const result = []
    steps.push({
      tree: this.copyTree(),
      currentNode: null,
      visitedNodes: [],
      outputArray: [],
      description: 'Starting Pre-Order Traversal (Root → Left → Right)',
      operation: 'preorder',
      phase: 'start'
    })
    
    this._preOrderRecursive(this.root, result, steps, [])
    
    steps.push({
      tree: this.copyTree(),
      currentNode: null,
      visitedNodes: result.slice(),
      outputArray: result.slice(),
      description: `Pre-Order Traversal Complete! Result: [${result.join(', ')}]`,
      operation: 'preorder',
      phase: 'complete'
    })
    
    return steps
  }

  _preOrderRecursive(node, result, steps, visitedSoFar) {
    if (node === null) return

    // Process current node first
    result.push(node.value)
    visitedSoFar.push(node.value)
    steps.push({
      tree: this.copyTree(),
      currentNode: node.value,
      visitedNodes: visitedSoFar.slice(),
      outputArray: result.slice(),
      description: `Visiting node ${node.value} and adding to result`,
      operation: 'preorder',
      phase: 'visiting'
    })

    steps.push({
      tree: this.copyTree(),
      currentNode: node.value,
      visitedNodes: visitedSoFar.slice(),
      outputArray: result.slice(),
      description: `Processing node ${node.value} - going to left child`,
      operation: 'preorder',
      phase: 'processing'
    })

    // Traverse left subtree
    this._preOrderRecursive(node.left, result, steps, visitedSoFar)

    if (node.right) {
      steps.push({
        tree: this.copyTree(),
        currentNode: node.value,
        visitedNodes: visitedSoFar.slice(),
        outputArray: result.slice(),
        description: `Processing node ${node.value} - going to right child`,
        operation: 'preorder',
        phase: 'processing'
      })
    }

    // Traverse right subtree
    this._preOrderRecursive(node.right, result, steps, visitedSoFar)
  }

  postOrderTraversal(steps = []) {
    const result = []
    steps.push({
      tree: this.copyTree(),
      currentNode: null,
      visitedNodes: [],
      outputArray: [],
      description: 'Starting Post-Order Traversal (Left → Right → Root)',
      operation: 'postorder',
      phase: 'start'
    })
    
    this._postOrderRecursive(this.root, result, steps, [])
    
    steps.push({
      tree: this.copyTree(),
      currentNode: null,
      visitedNodes: result.slice(),
      outputArray: result.slice(),
      description: `Post-Order Traversal Complete! Result: [${result.join(', ')}]`,
      operation: 'postorder',
      phase: 'complete'
    })
    
    return steps
  }

  _postOrderRecursive(node, result, steps, visitedSoFar) {
    if (node === null) return

    steps.push({
      tree: this.copyTree(),
      currentNode: node.value,
      visitedNodes: visitedSoFar.slice(),
      outputArray: result.slice(),
      description: `Processing node ${node.value} - going to left child first`,
      operation: 'postorder',
      phase: 'processing'
    })

    // Traverse left subtree
    this._postOrderRecursive(node.left, result, steps, visitedSoFar)

    if (node.right) {
      steps.push({
        tree: this.copyTree(),
        currentNode: node.value,
        visitedNodes: visitedSoFar.slice(),
        outputArray: result.slice(),
        description: `Processing node ${node.value} - going to right child`,
        operation: 'postorder',
        phase: 'processing'
      })
    }

    // Traverse right subtree
    this._postOrderRecursive(node.right, result, steps, visitedSoFar)

    // Process current node last
    result.push(node.value)
    visitedSoFar.push(node.value)
    steps.push({
      tree: this.copyTree(),
      currentNode: node.value,
      visitedNodes: visitedSoFar.slice(),
      outputArray: result.slice(),
      description: `Visiting node ${node.value} and adding to result`,
      operation: 'postorder',
      phase: 'visiting'
    })
  }

  copyTree() {
    return this._copyNode(this.root)
  }

  _copyNode(node) {
    if (node === null) return null
    const copy = new TreeNode(node.value)
    copy.left = this._copyNode(node.left)
    copy.right = this._copyNode(node.right)
    return copy
  }
}

export default function TreeTraversalVisualization() {
  const { state, setVisualizationData } = useApp()
  const [tree] = useState(() => new BinaryTree())
  const [currentTree, setCurrentTree] = useState(null)
  const [currentNode, setCurrentNode] = useState(null)
  const [visitedNodes, setVisitedNodes] = useState([])
  const [outputArray, setOutputArray] = useState([])
  const [selectedTraversal, setSelectedTraversal] = useState('inorder')

  const generateVisualizationData = useCallback((traversalType) => {
    switch (traversalType) {
      case 'inorder':
        return tree.inOrderTraversal()
      case 'preorder':
        return tree.preOrderTraversal()
      case 'postorder':
        return tree.postOrderTraversal()
      default:
        return []
    }
  }, [tree])

  const handleTraversal = (traversalType) => {
    setSelectedTraversal(traversalType)
    const steps = generateVisualizationData(traversalType)
    setVisualizationData(steps, `traversal-${traversalType}`)
  }

  const generateRandomTree = () => {
    const newTree = new BinaryTree()
    const values = []
    
    for (let i = 0; i < 7; i++) {
      let value
      do {
        value = Math.floor(Math.random() * 50) + 10
      } while (values.includes(value))
      
      values.push(value)
      newTree.insert(value)
    }
    
    tree.root = newTree.root
    setCurrentTree(tree.copyTree())
    setCurrentNode(null)
    setVisitedNodes([])
    setOutputArray([])
  }

  const clearTree = () => {
    tree.root = null
    setCurrentTree(null)
    setCurrentNode(null)
    setVisitedNodes([])
    setOutputArray([])
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && state.visualizationContext?.startsWith('traversal-')) {
      setCurrentTree(currentStep.tree)
      setCurrentNode(currentStep.currentNode || null)
      setVisitedNodes(currentStep.visitedNodes || [])
      setOutputArray(currentStep.outputArray || [])
    }
  }, [state.currentStep, state.visualizationData, state.visualizationContext])

  const renderTree = (node, x = 400, y = 50, level = 0) => {
    if (!node) return null

    const spacing = Math.max(120 / (level + 1), 40)
    const leftX = x - spacing
    const rightX = x + spacing
    const childY = y + 80

    const isCurrent = currentNode === node.value
    const isVisited = visitedNodes.includes(node.value)

    return (
      <g key={`node-${node.value}-${x}-${y}`}>
        {/* Lines to children */}
        {node.left && (
          <motion.line
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            x1={x}
            y1={y + 15}
            x2={leftX}
            y2={childY - 15}
            stroke="#6b7280"
            strokeWidth={2}
          />
        )}
        {node.right && (
          <motion.line
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            x1={x}
            y1={y + 15}
            x2={rightX}
            y2={childY - 15}
            stroke="#6b7280"
            strokeWidth={2}
          />
        )}

        {/* Node circle */}
        <motion.circle
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: isCurrent ? 1.3 : 1, 
            opacity: 1 
          }}
          transition={{ duration: 0.5 }}
          cx={x}
          cy={y}
          r={15}
          fill={isCurrent ? TRAVERSAL_COLORS.current : 
                isVisited ? TRAVERSAL_COLORS.visited : TRAVERSAL_COLORS.default}
          stroke="#374151"
          strokeWidth={isCurrent ? 3 : 2}
        />

        {/* Node value */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          x={x}
          y={y + 5}
          textAnchor="middle"
          className="text-sm font-bold fill-gray-800"
        >
          {node.value}
        </motion.text>

        {/* Render children */}
        {node.left && renderTree(node.left, leftX, childY, level + 1)}
        {node.right && renderTree(node.right, rightX, childY, level + 1)}
      </g>
    )
  }

  useEffect(() => {
    generateRandomTree()
  }, [])

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Traversal Controls */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">Tree Traversal Methods</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleTraversal('inorder')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTraversal === 'inorder'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                In-Order
              </button>
              <button
                onClick={() => handleTraversal('preorder')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTraversal === 'preorder'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Pre-Order
              </button>
              <button
                onClick={() => handleTraversal('postorder')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTraversal === 'postorder'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Post-Order
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <div className="space-y-1">
                <div><strong>In-Order:</strong> Left → Root → Right (gives sorted order for BST)</div>
                <div><strong>Pre-Order:</strong> Root → Left → Right (good for copying tree)</div>
                <div><strong>Post-Order:</strong> Left → Right → Root (good for deleting tree)</div>
              </div>
            </div>
          </div>

          {/* Utility Controls */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tree Operations</label>
            <div className="space-y-2">
              <button
                onClick={generateRandomTree}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
              >
                Generate Random Tree
              </button>
              <button
                onClick={clearTree}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Clear Tree
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
          <svg 
            width="800" 
            height="350" 
            className="w-full h-80"
            viewBox="0 0 800 350"
            preserveAspectRatio="xMidYMid meet"
          >
            <AnimatePresence>
              {currentTree && renderTree(currentTree)}
            </AnimatePresence>
          </svg>
          
          {!currentTree && (
            <div className="flex items-center justify-center h-80 text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">No tree to traverse</p>
                <p className="text-sm">Generate a random tree to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* Output Array Visualization */}
        {outputArray.length > 0 && (
          <div className="w-full max-w-4xl">
            <h3 className="text-lg font-semibold text-center mb-3">Traversal Output</h3>
            <div className="flex justify-center space-x-2 p-4 bg-purple-50 rounded-lg">
              {outputArray.map((value, index) => (
                <motion.div
                  key={`output-${index}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="w-12 h-12 bg-purple-500 text-white flex items-center justify-center rounded-lg font-bold shadow-sm"
                >
                  {value}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Current Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
            <span>Unvisited</span>
          </div>
        </div>

        {/* Current Operation Description */}
        <AnimatePresence>
          {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && 
          state.visualizationContext?.startsWith('traversal-') && (
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