import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import AlgorithmVisualization from '../components/AlgorithmVisualization'
import ControlPanel from '../components/ControlPanel'
import ArrayVisualization from '../components/visualizations/ArrayVisualization'
import StackVisualization from '../components/visualizations/StackVisualization'
import QueueVisualization from '../components/visualizations/QueueVisualization'
import LinkedListVisualization from '../components/visualizations/LinkedListVisualization'

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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic) => (
          <Link
            key={topic.path}
            to={topic.path}
            className="card hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">{topic.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                {topic.title}
              </h3>
              <p className="text-gray-600 text-sm">{topic.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function LinearStructures() {
  const [currentVisualization, setCurrentVisualization] = useState('array')

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
        <div className="flex flex-wrap gap-4">
          {linearStructures.map((structure) => (
            <button
              key={structure.id}
              onClick={() => setCurrentVisualization(structure.id)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
                currentVisualization === structure.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">{structure.icon}</span>
              <div className="text-left">
                <div className="font-semibold">{structure.title}</div>
                <div className="text-sm opacity-75">{structure.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Visualization Area */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {linearStructures.find(s => s.id === currentVisualization)?.title}
          </h2>
          <ControlPanel />
        </div>
        
        <div className="min-h-[500px]">
          {CurrentComponent && <CurrentComponent />}
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Time Complexity Summary</h3>
          <div className="space-y-2 text-sm">
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
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Applications</h3>
          <div className="space-y-3 text-sm">
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
          </div>
        </div>
      </div>
    </div>
  )
}

function Trees() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tree Data Structures</h1>
      <div className="card">
        <p className="text-gray-600 mb-4">
          Explore binary search trees, AVL trees, and heap operations.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            🚧 This section is under development. Tree visualizations coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

function Graphs() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Graph Data Structures</h1>
      <div className="card">
        <p className="text-gray-600 mb-4">
          Understand graph representations, traversals, and algorithms.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            🚧 This section is under development. Graph visualizations coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

function HashTables() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Hash Tables & Maps</h1>
      <div className="card">
        <p className="text-gray-600 mb-4">
          Learn about hash functions, collision resolution, and map implementations.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            🚧 This section is under development. Hash table visualizations coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

export default function DataStructures() {
  const location = useLocation()
  const isRootPath = location.pathname === '/data-structures' || location.pathname === '/data-structures/'

  return (
    <div>
      {!isRootPath && (
        <nav className="mb-8">
          <Link to="/data-structures" className="text-primary-600 hover:text-primary-700">
            ← Back to Data Structures
          </Link>
        </nav>
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