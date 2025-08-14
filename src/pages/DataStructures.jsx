import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import ConditionalControlPanel from '../components/ConditionalControlPanel'
import ArrayVisualization from '../components/visualizations/ArrayVisualization'
import StackVisualization from '../components/visualizations/StackVisualization'
import QueueVisualization from '../components/visualizations/QueueVisualization'
import LinkedListVisualization from '../components/visualizations/LinkedListVisualization'
import BSTVisualization from '../components/visualizations/BSTVisualization'
import TreeTraversalVisualization from '../components/visualizations/TreeTraversalVisualization'
import AVLTreeVisualization from '../components/visualizations/AVLTreeVisualization'
import GraphVisualization from '../components/visualizations/GraphVisualization'
import DijkstraVisualization from '../components/visualizations/DijkstraVisualization'
import MSTVisualization from '../components/visualizations/MSTVisualization'
import TopicOverviewGrid from '../components/common/TopicOverviewGrid'
import BreadcrumbNavigation from '../components/common/BreadcrumbNavigation'
import UnderDevelopmentBanner from '../components/common/UnderDevelopmentBanner'
import AlgorithmSelector from '../components/common/AlgorithmSelector'
import EducationalContent from '../components/common/EducationalContent'
import HashTableVisualization from '../components/visualizations/HashTableVisualization'

const topics = [
  {
    title: 'Linear Structures',
    path: 'linear',
    description: 'Arrays, Lists, Stacks, and Queues',
    icon: '📏'
  },
  {
    title: 'Trees',
    path: 'trees',
    description: 'BST, AVL Trees, and Heaps',
    icon: '🌳'
  },
  {
    title: 'Graphs',
    path: 'graphs',
    description: 'Graph Representations and Traversals',
    icon: '🕸️'
  },
  {
    title: 'Hash Tables & Maps',
    path: 'hash',
    description: 'HashMap, TreeMap, and Collision Resolution',
    icon: '#️⃣'
  }
]

function TopicOverview() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Structures</h1>
        <p className="text-lg text-gray-600">
          Visualize and understand fundamental data structures with interactive demonstrations
        </p>
      </div>

      <TopicOverviewGrid topics={topics} />
    </div>
  )
}

function LinearStructures() {
  const [currentVisualization, setCurrentVisualization] = useState('array')
  const { clearData } = useApp()

  const handleVisualizationChange = (newVisualization) => {
    if (newVisualization !== currentVisualization) {
      clearData()
      setCurrentVisualization(newVisualization)
    }
  }

  const linearStructures = [
    {
      id: 'array',
      title: 'Dynamic Arrays',
      description: 'Resizable arrays with indexed access',
      icon: '📊',
      component: ArrayVisualization
    },
    {
      id: 'stack',
      title: 'Stack (LIFO)',
      description: 'Last In, First Out data structure',
      icon: '📚',
      component: StackVisualization
    },
    {
      id: 'queue',
      title: 'Queue (FIFO)',
      description: 'First In, First Out data structure',
      icon: '🚶‍♂️',
      component: QueueVisualization
    },
    {
      id: 'linkedlist',
      title: 'Linked List',
      description: 'Dynamic list with node-based structure',
      icon: '🔗',
      component: LinkedListVisualization
    }
  ]

  const CurrentComponent = linearStructures.find(s => s.id === currentVisualization)?.component

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Linear Data Structures</h1>
        <p className="text-lg text-gray-600">
          Interactive visualizations for arrays, lists, stacks, and queues with step-by-step animations.
        </p>
      </div>

      {/* Structure Selection */}
      <div className="mb-8">
        <AlgorithmSelector
          items={linearStructures}
          currentItem={currentVisualization}
          onItemChange={handleVisualizationChange}
        />
      </div>

      {/* Visualization */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {linearStructures.find(s => s.id === currentVisualization)?.title}
          </h2>
        </div>
        
        <div className="min-h-[400px]">
          {CurrentComponent && <CurrentComponent />}
        </div>
      </div>

      {/* Control Panel */}
      <ConditionalControlPanel />

      {/* Educational Content */}
      <EducationalContent
        leftContent={{
          title: "Time Complexity Summary",
          content: (
            <>
              <div className="flex justify-between">
                <span className="font-medium">Array Access:</span>
                <span className="text-green-600">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Array Insert (end):</span>
                <span className="text-green-600">O(1) amortized</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Stack Push/Pop:</span>
                <span className="text-green-600">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Queue Enqueue/Dequeue:</span>
                <span className="text-green-600">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">LinkedList Insert (head):</span>
                <span className="text-green-600">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">LinkedList Search:</span>
                <span className="text-red-600">O(n)</span>
              </div>
            </>
          )
        }}
        rightContent={{
          title: "Common Applications",
          content: (
            <>
              <div>
                <span className="font-medium text-blue-600">Arrays:</span>
                <span className="text-gray-600 ml-2">Collections, matrices, lookup tables</span>
              </div>
              <div>
                <span className="font-medium text-purple-600">Stacks:</span>
                <span className="text-gray-600 ml-2">Function calls, undo operations, expression evaluation</span>
              </div>
              <div>
                <span className="font-medium text-green-600">Queues:</span>
                <span className="text-gray-600 ml-2">Process scheduling, BFS, buffering</span>
              </div>
              <div>
                <span className="font-medium text-indigo-600">Linked Lists:</span>
                <span className="text-gray-600 ml-2">Dynamic memory, implementing other structures</span>
              </div>
            </>
          )
        }}
      />
    </div>
  )
}

function Trees() {
  const [currentVisualization, setCurrentVisualization] = useState('bst')
  const { clearData } = useApp()

  const handleVisualizationChange = (newVisualization) => {
    if (newVisualization !== currentVisualization) {
      clearData()
      setCurrentVisualization(newVisualization)
    }
  }

  const treeStructures = [
    {
      id: 'bst',
      title: 'Binary Search Tree',
      description: 'Ordered tree with left < root < right property',
      icon: '🌲',
      component: BSTVisualization
    },
    {
      id: 'traversals',
      title: 'Tree Traversals',
      description: 'In-order, pre-order, and post-order traversals',
      icon: '🔄',
      component: TreeTraversalVisualization
    },
    {
      id: 'avl',
      title: 'AVL Tree',
      description: 'Self-balancing binary search tree',
      icon: '⚖️',
      component: AVLTreeVisualization
    }
  ]

  const CurrentComponent = treeStructures.find(s => s.id === currentVisualization)?.component

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tree Data Structures</h1>
        <p className="text-lg text-gray-600">
          Interactive visualizations for binary search trees, traversals, and self-balancing trees.
        </p>
      </div>

      {/* Structure Selection */}
      <div className="mb-8">
        <AlgorithmSelector
          items={treeStructures}
          currentItem={currentVisualization}
          onItemChange={handleVisualizationChange}
        />
      </div>

      {/* Visualization */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {treeStructures.find(s => s.id === currentVisualization)?.title}
          </h2>
        </div>
        
        <div className="min-h-[500px]">
          {CurrentComponent && <CurrentComponent />}
        </div>
      </div>

      {/* Control Panel */}
      <ConditionalControlPanel />

      {/* Educational Content */}
      <EducationalContent
        leftContent={{
          title: "Time Complexity Summary",
          content: (
            <>
              <div className="flex justify-between">
                <span className="font-medium">BST Search (avg):</span>
                <span className="text-green-600">O(log n)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">BST Search (worst):</span>
                <span className="text-red-600">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">BST Insert (avg):</span>
                <span className="text-green-600">O(log n)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">AVL Search:</span>
                <span className="text-green-600">O(log n)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">AVL Insert:</span>
                <span className="text-green-600">O(log n)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tree Traversal:</span>
                <span className="text-yellow-600">O(n)</span>
              </div>
            </>
          )
        }}
        rightContent={{
          title: "Common Applications",
          content: (
            <>
              <div>
                <span className="font-medium text-blue-600">Binary Search Trees:</span>
                <span className="text-gray-600 ml-2">Databases, file systems, expression parsing</span>
              </div>
              <div>
                <span className="font-medium text-purple-600">Tree Traversals:</span>
                <span className="text-gray-600 ml-2">Directory listings, serialization, calculations</span>
              </div>
              <div>
                <span className="font-medium text-green-600">AVL Trees:</span>
                <span className="text-gray-600 ml-2">Database indexing, priority queues, balanced search</span>
              </div>
              <div>
                <span className="font-medium text-indigo-600">In-Order Traversal:</span>
                <span className="text-gray-600 ml-2">Sorted output from BST</span>
              </div>
            </>
          )
        }}
      />
    </div>
  )
}

function Graphs() {
  const [currentVisualization, setCurrentVisualization] = useState('traversal')
  const { clearData } = useApp()

  const handleVisualizationChange = (newVisualization) => {
    if (newVisualization !== currentVisualization) {
      clearData()
      setCurrentVisualization(newVisualization)
    }
  }

  const graphAlgorithms = [
    {
      id: 'traversal',
      title: 'Graph Traversal',
      description: 'BFS and DFS traversal algorithms',
      icon: '🔍',
      component: GraphVisualization
    },
    {
      id: 'dijkstra',
      title: "Dijkstra's Algorithm",
      description: 'Shortest path algorithm for weighted graphs',
      icon: '📏',
      component: DijkstraVisualization
    },
    {
      id: 'mst',
      title: 'Minimum Spanning Tree',
      description: "Kruskal's and Prim's MST algorithms",
      icon: '🌳',
      component: MSTVisualization
    }
  ]

  const CurrentComponent = graphAlgorithms.find(s => s.id === currentVisualization)?.component

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Graph Algorithms</h1>
        <p className="text-lg text-gray-600">
          Interactive visualizations for graph traversal, shortest paths, and minimum spanning trees.
        </p>
      </div>

      {/* Algorithm Selection */}
      <div className="mb-8">
        <AlgorithmSelector
          items={graphAlgorithms}
          currentItem={currentVisualization}
          onItemChange={handleVisualizationChange}
        />
      </div>

      {/* Visualization */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {graphAlgorithms.find(s => s.id === currentVisualization)?.title}
          </h2>
        </div>
        
        <div className="min-h-[500px]">
          {CurrentComponent && <CurrentComponent />}
        </div>
      </div>

      {/* Control Panel */}
      <ConditionalControlPanel />

      {/* Educational Content */}
      <EducationalContent
        leftContent={{
          title: "Time Complexity Summary",
          content: (
            <>
              <div className="flex justify-between">
                <span className="font-medium">BFS/DFS:</span>
                <span className="text-yellow-600">O(V + E)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Dijkstra's:</span>
                <span className="text-orange-600">O((V + E) log V)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Kruskal's MST:</span>
                <span className="text-orange-600">O(E log E)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Prim's MST:</span>
                <span className="text-orange-600">O((V + E) log V)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Space Complexity:</span>
                <span className="text-yellow-600">O(V)</span>
              </div>
            </>
          )
        }}
        rightContent={{
          title: "Common Applications",
          content: (
            <>
              <div>
                <span className="font-medium text-blue-600">BFS/DFS:</span>
                <span className="text-gray-600 ml-2">Web crawling, social networks, maze solving</span>
              </div>
              <div>
                <span className="font-medium text-purple-600">Dijkstra's:</span>
                <span className="text-gray-600 ml-2">GPS navigation, network routing, flight connections</span>
              </div>
              <div>
                <span className="font-medium text-green-600">MST:</span>
                <span className="text-gray-600 ml-2">Network design, clustering, circuit design</span>
              </div>
              <div>
                <span className="font-medium text-indigo-600">Graph Theory:</span>
                <span className="text-gray-600 ml-2">Social media analysis, dependency resolution</span>
              </div>
            </>
          )
        }}
      />
    </div>
  )
}

function HashTables() {
  const { clearData } = useApp()

  useEffect(() => {
    clearData()
  }, [clearData])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hash Tables & Maps</h1>
        <p className="text-lg text-gray-600">
          Interactive visualizations for hash functions, collision resolution, and hash table performance characteristics.
        </p>
      </div>

      {/* Visualization */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Interactive Hash Table Demonstrations
          </h2>
        </div>
        
        <div className="min-h-[600px]">
          <HashTableVisualization />
        </div>
      </div>

      {/* Control Panel */}
      <ConditionalControlPanel />

      {/* Educational Content */}
      <EducationalContent
        leftContent={{
          title: "Time Complexity Summary",
          content: (
            <>
              <div className="flex justify-between">
                <span className="font-medium">Hash Insert (avg):</span>
                <span className="text-green-600">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Hash Search (avg):</span>
                <span className="text-green-600">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Hash Delete (avg):</span>
                <span className="text-green-600">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Worst Case:</span>
                <span className="text-red-600">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Space Complexity:</span>
                <span className="text-yellow-600">O(n)</span>
              </div>
            </>
          )
        }}
        rightContent={{
          title: "Common Applications",
          content: (
            <>
              <div>
                <span className="font-medium text-blue-600">Databases:</span>
                <span className="text-gray-600 ml-2">Indexing and fast lookups</span>
              </div>
              <div>
                <span className="font-medium text-purple-600">Caching:</span>
                <span className="text-gray-600 ml-2">Web caches, memoization</span>
              </div>
              <div>
                <span className="font-medium text-green-600">Symbol Tables:</span>
                <span className="text-gray-600 ml-2">Compilers, interpreters</span>
              </div>
              <div>
                <span className="font-medium text-indigo-600">Sets & Maps:</span>
                <span className="text-gray-600 ml-2">Java HashMap, Python dict</span>
              </div>
            </>
          )
        }}
      />
    </div>
  )
}

export default function DataStructures() {
  const location = useLocation()
  const isRootPath = location.pathname === '/data-structures' || location.pathname === '/data-structures/'
  const { clearData } = useApp()

  // Clear visualization data if coming from a different page context  
  useEffect(() => {
    clearData()
  }, [clearData])

  return (
    <div>
      {!isRootPath && (
        <BreadcrumbNavigation backTo="/data-structures" backLabel="Data Structures" />
      )}
      
      <Routes>
        <Route path="/" element={<TopicOverview />} />
        <Route path="/linear" element={<LinearStructures />} />
        <Route path="/trees" element={<Trees />} />
        <Route path="/graphs" element={<Graphs />} />
        <Route path="/hash" element={<HashTables />} />
      </Routes>
    </div>
  )
}