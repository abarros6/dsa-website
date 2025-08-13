import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const TREE_COLORS = {
  default: '#e2e8f0',
  highlight: '#3b82f6',
  searching: '#f59e0b',
  inserting: '#10b981',
  deleting: '#ef4444',
  found: '#059669',
  path: '#8b5cf6'
}

class TreeNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

class BST {
  constructor() {
    this.root = null
  }

  insert(value, steps = []) {
    if (this.root === null) {
      this.root = new TreeNode(value)
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [value],
        description: `Inserted ${value} as root node`,
        operation: 'insert',
        completed: true
      })
      return steps
    }

    this._insertRecursive(this.root, value, steps, [])
    return steps
  }

  _insertRecursive(node, value, steps, path) {
    const currentPath = [...path, node.value]
    
    steps.push({
      tree: this.copyTree(),
      highlightedNodes: [node.value],
      path: currentPath,
      description: `Comparing ${value} with ${node.value}`,
      operation: 'insert',
      comparing: true
    })

    if (value < node.value) {
      if (node.left === null) {
        node.left = new TreeNode(value)
        steps.push({
          tree: this.copyTree(),
          highlightedNodes: [value],
          path: [...currentPath, value],
          description: `Inserted ${value} to the left of ${node.value}`,
          operation: 'insert',
          completed: true
        })
      } else {
        this._insertRecursive(node.left, value, steps, currentPath)
      }
    } else if (value > node.value) {
      if (node.right === null) {
        node.right = new TreeNode(value)
        steps.push({
          tree: this.copyTree(),
          highlightedNodes: [value],
          path: [...currentPath, value],
          description: `Inserted ${value} to the right of ${node.value}`,
          operation: 'insert',
          completed: true
        })
      } else {
        this._insertRecursive(node.right, value, steps, currentPath)
      }
    } else {
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [node.value],
        path: currentPath,
        description: `Value ${value} already exists in the tree`,
        operation: 'insert',
        duplicate: true
      })
    }
  }

  search(value, steps = []) {
    if (this.root === null) {
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [],
        description: 'Tree is empty',
        operation: 'search',
        found: false
      })
      return steps
    }

    this._searchRecursive(this.root, value, steps, [])
    return steps
  }

  delete(value, steps = []) {
    if (this.root === null) {
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [],
        description: 'Tree is empty',
        operation: 'delete',
        found: false
      })
      return steps
    }

    this.root = this._deleteRecursive(this.root, value, steps, [])
    return steps
  }

  _deleteRecursive(node, value, steps, path) {
    if (node === null) {
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [],
        path: path,
        description: `Value ${value} not found in the tree`,
        operation: 'delete',
        found: false
      })
      return null
    }

    const currentPath = [...path, node.value]
    
    steps.push({
      tree: this.copyTree(),
      highlightedNodes: [node.value],
      path: currentPath,
      description: `Searching for ${value}, currently at ${node.value}`,
      operation: 'delete',
      searching: true
    })

    if (value < node.value) {
      node.left = this._deleteRecursive(node.left, value, steps, currentPath)
    } else if (value > node.value) {
      node.right = this._deleteRecursive(node.right, value, steps, currentPath)
    } else {
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [node.value],
        path: currentPath,
        description: `Found ${value}, preparing to delete`,
        operation: 'delete',
        found: true
      })

      // Node with only right child or no child
      if (node.left === null) {
        steps.push({
          tree: this.copyTree(),
          highlightedNodes: node.right ? [node.right.value] : [],
          description: node.right ? `Replacing ${value} with right child ${node.right.value}` : `Removing leaf node ${value}`,
          operation: 'delete',
          completed: true
        })
        return node.right
      }
      
      // Node with only left child
      if (node.right === null) {
        steps.push({
          tree: this.copyTree(),
          highlightedNodes: [node.left.value],
          description: `Replacing ${value} with left child ${node.left.value}`,
          operation: 'delete',
          completed: true
        })
        return node.left
      }

      // Node with two children
      const successor = this._findMin(node.right)
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [successor.value],
        description: `Found inorder successor ${successor.value} to replace ${value}`,
        operation: 'delete',
        successor: true
      })

      node.value = successor.value
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [node.value],
        description: `Replaced ${value} with ${successor.value}`,
        operation: 'delete',
        replaced: true
      })

      node.right = this._deleteRecursive(node.right, successor.value, steps, currentPath)
    }
    
    return node
  }

  _findMin(node) {
    while (node.left !== null) {
      node = node.left
    }
    return node
  }

  _searchRecursive(node, value, steps, path) {
    if (node === null) {
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [],
        path: path,
        description: `Value ${value} not found in the tree`,
        operation: 'search',
        found: false
      })
      return false
    }

    const currentPath = [...path, node.value]
    
    steps.push({
      tree: this.copyTree(),
      highlightedNodes: [node.value],
      path: currentPath,
      description: `Comparing ${value} with ${node.value}`,
      operation: 'search',
      comparing: true
    })

    if (value === node.value) {
      steps.push({
        tree: this.copyTree(),
        highlightedNodes: [node.value],
        path: currentPath,
        description: `Found ${value}!`,
        operation: 'search',
        found: true
      })
      return true
    } else if (value < node.value) {
      return this._searchRecursive(node.left, value, steps, currentPath)
    } else {
      return this._searchRecursive(node.right, value, steps, currentPath)
    }
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

export default function BSTVisualization() {
  const { state, setVisualizationData } = useApp()
  const [bst] = useState(() => new BST())
  const [currentTree, setCurrentTree] = useState(null)
  const [highlightedNodes, setHighlightedNodes] = useState([])
  const [searchPath, setSearchPath] = useState([])

  const generateVisualizationData = useCallback((operation, value) => {
    const steps = []
    
    switch (operation) {
      case 'insert':
        return bst.insert(value, steps)
      case 'search':
        return bst.search(value, steps)
      case 'delete':
        return bst.delete(value, steps)
      default:
        return steps
    }
  }, [bst])

  const handleInsert = (value) => {
    if (!value || isNaN(value)) return
    const steps = generateVisualizationData('insert', parseInt(value))
    setVisualizationData(steps, 'bst-insert')
  }

  const handleSearch = (value) => {
    if (!value || isNaN(value)) return
    const steps = generateVisualizationData('search', parseInt(value))
    setVisualizationData(steps, 'bst-search')
  }

  const handleDelete = (value) => {
    if (!value || isNaN(value)) return
    const steps = generateVisualizationData('delete', parseInt(value))
    setVisualizationData(steps, 'bst-delete')
  }

  const generateRandomTree = () => {
    const newBst = new BST()
    const values = []
    
    for (let i = 0; i < 7; i++) {
      let value
      do {
        value = Math.floor(Math.random() * 100) + 1
      } while (values.includes(value))
      
      values.push(value)
      newBst.insert(value)
    }
    
    bst.root = newBst.root
    setCurrentTree(bst.copyTree())
    setHighlightedNodes([])
    setSearchPath([])
  }

  const clearTree = () => {
    bst.root = null
    setCurrentTree(null)
    setHighlightedNodes([])
    setSearchPath([])
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && state.visualizationContext?.startsWith('bst-')) {
      setCurrentTree(currentStep.tree)
      setHighlightedNodes(currentStep.highlightedNodes || [])
      setSearchPath(currentStep.path || [])
    }
  }, [state.currentStep, state.visualizationData, state.visualizationContext])

  const renderTree = (node, x = 400, y = 50, level = 0) => {
    if (!node) return null

    const spacing = Math.max(120 / (level + 1), 40)
    const leftX = x - spacing
    const rightX = x + spacing
    const childY = y + 80

    const isHighlighted = highlightedNodes.includes(node.value)
    const isInPath = searchPath.includes(node.value)

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
            stroke={isInPath ? TREE_COLORS.path : '#6b7280'}
            strokeWidth={isInPath ? 3 : 2}
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
            stroke={isInPath ? TREE_COLORS.path : '#6b7280'}
            strokeWidth={isInPath ? 3 : 2}
          />
        )}

        {/* Node circle */}
        <motion.circle
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: isHighlighted ? 1.2 : 1, 
            opacity: 1 
          }}
          transition={{ duration: 0.5 }}
          cx={x}
          cy={y}
          r={15}
          fill={isHighlighted ? TREE_COLORS.highlight : 
                isInPath ? TREE_COLORS.path : TREE_COLORS.default}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Insert Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Insert Node</label>
            <input
              type="number"
              id="insert-value"
              placeholder="Value (1-100)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              min="1"
              max="100"
            />
            <button
              onClick={() => {
                const value = document.getElementById('insert-value').value
                if (value !== '') {
                  handleInsert(value)
                  document.getElementById('insert-value').value = ''
                }
              }}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
            >
              Insert
            </button>
          </div>

          {/* Search Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search Node</label>
            <input
              type="number"
              id="search-value"
              placeholder="Value to search"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={() => {
                const value = document.getElementById('search-value').value
                if (value !== '') {
                  handleSearch(value)
                  document.getElementById('search-value').value = ''
                }
              }}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Search
            </button>
          </div>

          {/* Delete Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Delete Node</label>
            <input
              type="number"
              id="delete-value"
              placeholder="Value to delete"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={() => {
                const value = document.getElementById('delete-value').value
                if (value !== '') {
                  handleDelete(value)
                  document.getElementById('delete-value').value = ''
                }
              }}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </div>

          {/* Utility Controls */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tree Operations</label>
            <div className="space-y-2">
              <button
                onClick={generateRandomTree}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
              >
                Generate Random
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
                <p className="text-lg mb-2">Binary Search Tree is empty</p>
                <p className="text-sm">Insert values or generate a random tree to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* Tree Info */}
        <div className="flex space-x-6 text-sm text-gray-600">
          <span>Nodes: <span className="font-medium text-gray-900">{currentTree ? bst.toArray().length : 0}</span></span>
          <span>In-order: <span className="font-medium text-gray-900">[{bst.toArray().join(', ')}]</span></span>
        </div>

        {/* Current Operation Description */}
        <AnimatePresence>
          {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && 
          state.visualizationContext?.startsWith('bst-') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-lg text-center"
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