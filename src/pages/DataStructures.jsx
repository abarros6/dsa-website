import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import SimpleControlPanel from '../components/SimpleControlPanel'
import ArrayVisualization from '../components/visualizations/ArrayVisualization'
import StackVisualization from '../components/visualizations/StackVisualization'
import QueueVisualization from '../components/visualizations/QueueVisualization'
import LinkedListVisualization from '../components/visualizations/LinkedListVisualization'
import TopicOverviewGrid from '../components/common/TopicOverviewGrid'
import BreadcrumbNavigation from '../components/common/BreadcrumbNavigation'
import UnderDevelopmentBanner from '../components/common/UnderDevelopmentBanner'
import AlgorithmSelector from '../components/common/AlgorithmSelector'
import EducationalContent from '../components/common/EducationalContent'

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

      {/* Visualization Area */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {linearStructures.find(s => s.id === currentVisualization)?.title}
          </h2>
        </div>
        
        <div className="min-h-[400px]">
          {CurrentComponent && <CurrentComponent />}
        </div>
        
        {/* Simple Control Panel for Step-by-step playback */}
        {/* need to only render this if the user attempts a search */}
        <div className="mt-6">
          <SimpleControlPanel />
        </div>
      </div>

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
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tree Data Structures</h1>
      <div className="card">
        <p className="text-gray-600 mb-4">
          Explore binary search trees, AVL trees, and heap operations.
        </p>
        <UnderDevelopmentBanner feature="Tree visualizations" />
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
        <UnderDevelopmentBanner feature="Graph visualizations" />
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
        <UnderDevelopmentBanner feature="Hash table visualizations" />
      </div>
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