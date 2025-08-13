import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const AVL_COLORS = {
  default: '#e2e8f0',
  highlight: '#3b82f6',
  balancing: '#f59e0b',
  rotated: '#10b981',
  imbalanced: '#ef4444',
  height: '#8b5cf6'
}

class AVLNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.height = 1
  }
}

class AVLTree {
  constructor() {
    this.root = null
  }

  getHeight(node) {
    return node ? node.height : 0
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0
  }

  updateHeight(node) {
    if (node) {
      node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
    }
  }

  rotateRight(y, steps) {
    steps.push({
      tree: this.copyTree(),
      highlightedNodes: [y.value],
      description: `Performing right rotation on node ${y.value}`,
      operation: 'rotate',
      rotationType: 'right',
      rotatingNode: y.value
    })

    const x = y.left
    const T2 = x.right

    x.right = y
    y.left = T2

    this.updateHeight(y)
    this.updateHeight(x)

    steps.push({
      tree: this.copyTree(),
      highlightedNodes: [x.value],
      description: `Right rotation complete - ${x.value} is now the root of this subtree`,
      operation: 'rotate',
      rotationType: 'right',
      completed: true
    })

    return x
  }

  rotateLeft(x, steps) {
    steps.push({
      tree: this.copyTree(),
      highlightedNodes: [x.value],
      description: `Performing left rotation on node ${x.value}`,
      operation: 'rotate',
      rotationType: 'left',
      rotatingNode: x.value
    })

    const y = x.right
    const T2 = y.left

    y.left = x
    x.right = T2

    this.updateHeight(x)
    this.updateHeight(y)

    steps.push({
      tree: this.copyTree(),
      highlightedNodes: [y.value],
      description: `Left rotation complete - ${y.value} is now the root of this subtree`,
      operation: 'rotate',
      rotationType: 'left',
      completed: true
    })

    return y
  }

  insert(value, steps = []) {
    steps.push({
      tree: this.copyTree(),
      highlightedNodes: [],
      description: `Starting AVL insertion of ${value}`,
      operation: 'insert',
      phase: 'start'
    })

    this.root = this._insertRecursive(this.root, value, steps)
    return steps
  }

  _insertRecursive(node, value, steps) {
    // Standard BST insertion
    if (node === null) {
      const newNode = new AVLNode(value)
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [value],
        description: `Inserted ${value} as new leaf node`,
        operation: 'insert',
        phase: 'inserted'
      })
      return newNode
    }

    steps.push({
      tree: this.copyTree(),
      highlightedNodes: [node.value],
      description: `Comparing ${value} with ${node.value}`,
      operation: 'insert',
      phase: 'comparing'
    })

    if (value < node.value) {
      node.left = this._insertRecursive(node.left, value, steps)
    } else if (value > node.value) {
      node.right = this._insertRecursive(node.right, value, steps)
    } else {
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [node.value],
        description: `Value ${value} already exists - no insertion needed`,
        operation: 'insert',
        phase: 'duplicate'
      })
      return node
    }

    // Update height
    this.updateHeight(node)

    // Get balance factor
    const balance = this.getBalance(node)

    steps.push({
      tree: this.copyTree(),
      highlightedNodes: [node.value],
      description: `Node ${node.value}: height=${node.height}, balance=${balance}`,
      operation: 'balance-check',
      balance: balance,
      nodeHeight: node.height
    })

    // Check if node is unbalanced and perform rotations
    if (Math.abs(balance) > 1) {
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [node.value],
        description: `Node ${node.value} is unbalanced (balance=${balance}). Need to rebalance!`,
        operation: 'imbalanced',
        balance: balance
      })

      // Left Left Case
      if (balance > 1 && value < node.left.value) {
        steps.push({
          tree: this.copyTree(),
          highlightedNodes: [node.value, node.left.value],
          description: `Left-Left case detected. Performing right rotation.`,
          operation: 'rotation-case',
          case: 'LL'
        })
        return this.rotateRight(node, steps)
      }

      // Right Right Case
      if (balance < -1 && value > node.right.value) {
        steps.push({
          tree: this.copyTree(),
          highlightedNodes: [node.value, node.right.value],
          description: `Right-Right case detected. Performing left rotation.`,
          operation: 'rotation-case',
          case: 'RR'
        })
        return this.rotateLeft(node, steps)
      }

      // Left Right Case
      if (balance > 1 && value > node.left.value) {
        steps.push({
          tree: this.copyTree(),
          highlightedNodes: [node.value, node.left.value],
          description: `Left-Right case detected. Performing left-right rotation.`,
          operation: 'rotation-case',
          case: 'LR'
        })
        node.left = this.rotateLeft(node.left, steps)
        return this.rotateRight(node, steps)
      }

      // Right Left Case
      if (balance < -1 && value < node.right.value) {
        steps.push({
          tree: this.copyTree(),
          highlightedNodes: [node.value, node.right.value],
          description: `Right-Left case detected. Performing right-left rotation.`,
          operation: 'rotation-case',
          case: 'RL'
        })
        node.right = this.rotateRight(node.right, steps)
        return this.rotateLeft(node, steps)
      }
    } else {
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [node.value],
        description: `Node ${node.value} is balanced. No rotation needed.`,
        operation: 'balanced'
      })
    }

    return node
  }

  copyTree() {
    return this._copyNode(this.root)
  }

  _copyNode(node) {
    if (node === null) return null
    const copy = new AVLNode(node.value)
    copy.height = node.height
    copy.left = this._copyNode(node.left)
    copy.right = this._copyNode(node.right)
    return copy
  }

  toArray() {
    const result = []
    this._inOrderTraversal(this.root, result)
    return result
  }

  _inOrderTraversal(node, result) {
    if (node !== null) {
      this._inOrderTraversal(node.left, result)
      result.push(node.value)
      this._inOrderTraversal(node.right, result)
    }
  }
}

export default function AVLTreeVisualization() {
  const { state, setVisualizationData } = useApp()
  const [avlTree] = useState(() => new AVLTree())
  const [currentTree, setCurrentTree] = useState(null)
  const [highlightedNodes, setHighlightedNodes] = useState([])
  const [showHeights, setShowHeights] = useState(true)
  const [showBalanceFactors, setShowBalanceFactors] = useState(true)

  const generateVisualizationData = useCallback((operation, value) => {
    const steps = []
    
    switch (operation) {
      case 'insert':
        return avlTree.insert(value, steps)
      default:
        return steps
    }
  }, [avlTree])

  const handleInsert = (value) => {
    if (!value || isNaN(value)) return
    const steps = generateVisualizationData('insert', parseInt(value))
    setVisualizationData(steps, 'avl-insert')
  }

  const generateRandomTree = () => {
    const newAvlTree = new AVLTree()
    const values = []
    
    // Generate a sequence that will likely cause rotations
    const testValues = [10, 20, 30, 40, 50, 25]
    for (const value of testValues) {
      if (!values.includes(value)) {
        values.push(value)
        newAvlTree.insert(value)
      }
    }
    
    avlTree.root = newAvlTree.root
    setCurrentTree(avlTree.copyTree())
    setHighlightedNodes([])
  }

  const clearTree = () => {
    avlTree.root = null
    setCurrentTree(null)
    setHighlightedNodes([])
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && state.visualizationContext?.startsWith('avl-')) {
      setCurrentTree(currentStep.tree)
      setHighlightedNodes(currentStep.highlightedNodes || [])
    }
  }, [state.currentStep, state.visualizationData, state.visualizationContext])

  const getNodeColor = (node, currentStep) => {
    if (!currentStep) return AVL_COLORS.default
    
    const isHighlighted = highlightedNodes.includes(node.value)
    
    if (currentStep.operation === 'imbalanced' && isHighlighted) {
      return AVL_COLORS.imbalanced
    }
    if (currentStep.operation === 'rotate' && isHighlighted) {
      return AVL_COLORS.balancing
    }
    if (currentStep.operation === 'balanced' && isHighlighted) {
      return AVL_COLORS.rotated
    }
    if (isHighlighted) {
      return AVL_COLORS.highlight
    }
    
    return AVL_COLORS.default
  }

  const renderTree = (node, x = 400, y = 60, level = 0) => {
    if (!node) return null

    const spacing = Math.max(100 / (level + 1), 30)
    const leftX = x - spacing
    const rightX = x + spacing
    const childY = y + 90

    const currentStep = state.visualizationData[state.currentStep]
    const nodeColor = getNodeColor(node, currentStep)
    const balance = avlTree.getBalance(node)

    return (
      <g key={`avl-node-${node.value}-${x}-${y}`}>
        {/* Lines to children */}
        {node.left && (
          <motion.line
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            x1={x}
            y1={y + 20}
            x2={leftX}
            y2={childY - 20}
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
            y1={y + 20}
            x2={rightX}
            y2={childY - 20}
            stroke="#6b7280"
            strokeWidth={2}
          />
        )}

        {/* Node circle */}
        <motion.circle
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: highlightedNodes.includes(node.value) ? 1.2 : 1, 
            opacity: 1 
          }}
          transition={{ duration: 0.5 }}
          cx={x}
          cy={y}
          r={20}
          fill={nodeColor}
          stroke="#374151"
          strokeWidth={2}
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

        {/* Height display */}
        {showHeights && (
          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            x={x + 25}
            y={y - 15}
            textAnchor="middle"
            className="text-xs font-medium fill-purple-600"
          >
            h:{node.height}
          </motion.text>
        )}

        {/* Balance factor display */}
        {showBalanceFactors && (
          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            x={x - 25}
            y={y - 15}
            textAnchor="middle"
            className={`text-xs font-medium ${
              Math.abs(balance) > 1 ? 'fill-red-600' : 'fill-blue-600'
            }`}
          >
            b:{balance}
          </motion.text>
        )}

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
          {/* Insert Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Insert Node</label>
            <input
              type="number"
              id="avl-insert-value"
              placeholder="Value (1-100)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              min="1"
              max="100"
            />
            <button
              onClick={() => {
                const value = document.getElementById('avl-insert-value').value
                if (value !== '') {
                  handleInsert(value)
                  document.getElementById('avl-insert-value').value = ''
                }
              }}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
            >
              Insert & Balance
            </button>
          </div>

          {/* Display Options */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Display Options</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showHeights}
                  onChange={(e) => setShowHeights(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Show Heights</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showBalanceFactors}
                  onChange={(e) => setShowBalanceFactors(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Show Balance Factors</span>
              </label>
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
                Load Example Tree
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

      {/* AVL Tree Properties */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">AVL Tree Properties</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div><strong>Balance Factor:</strong> height(left) - height(right), must be -1, 0, or 1</div>
          <div><strong>Height:</strong> Longest path from node to leaf + 1</div>
          <div><strong>Self-balancing:</strong> Automatically rotates to maintain balance after insertions</div>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
          <svg 
            width="800" 
            height="400" 
            className="w-full h-96"
            viewBox="0 0 800 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <AnimatePresence>
              {currentTree && renderTree(currentTree)}
            </AnimatePresence>
          </svg>
          
          {!currentTree && (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">AVL Tree is empty</p>
                <p className="text-sm">Insert values or load example to see auto-balancing</p>
              </div>
            </div>
          )}
        </div>

        {/* Tree Info */}
        <div className="flex space-x-6 text-sm text-gray-600">
          <span>Nodes: <span className="font-medium text-gray-900">{currentTree ? avlTree.toArray().length : 0}</span></span>
          <span>Height: <span className="font-medium text-gray-900">{currentTree ? avlTree.getHeight(avlTree.root) : 0}</span></span>
          <span>In-order: <span className="font-medium text-gray-900">[{avlTree.toArray().join(', ')}]</span></span>
        </div>

        {/* Legend */}
        <div className="flex justify-center flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Imbalanced</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span>Rotating</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Balanced</span>
          </div>
        </div>

        {/* Current Operation Description */}
        <AnimatePresence>
          {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && 
          state.visualizationContext?.startsWith('avl-') && (
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