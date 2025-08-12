import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import SimpleControlPanel from '../components/SimpleControlPanel'
import BubbleSortVisualization from '../components/visualizations/BubbleSortVisualizationClean'
import SelectionSortVisualization from '../components/visualizations/SelectionSortVisualizationClean'
import InsertionSortVisualization from '../components/visualizations/InsertionSortVisualizationClean'
import MergeSortVisualization from '../components/visualizations/MergeSortVisualizationClean'
import QuickSortVisualization from '../components/visualizations/QuickSortVisualizationClean'
import LinearSearchVisualization from '../components/visualizations/LinearSearchVisualization'
import BinarySearchVisualization from '../components/visualizations/BinarySearchVisualization'
import HashSearchVisualization from '../components/visualizations/HashSearchVisualization'

const topics = [
  {
    title: 'Searching',
    path: 'searching',
    description: 'Linear, Binary, and Hash-based Search',
    icon: '🔍'
  },
  {
    title: 'Sorting',
    path: 'sorting',
    description: 'Bubble, Selection, Insertion, Merge, Quick Sort',
    icon: '🔄'
  },
  {
    title: 'Tree Algorithms',
    path: 'trees',
    description: 'Tree Construction, Balancing, Traversals',
    icon: '🌲'
  },
  {
    title: 'Graph Algorithms',
    path: 'graphs',
    description: 'BFS, DFS, Dijkstra, MST Algorithms',
    icon: '🕷️'
  }
]

function TopicOverview() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Algorithms</h1>
        <p className="text-lg text-gray-600">
          Step through fundamental algorithms with interactive visualizations and Java implementations
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

function SearchingAlgorithms() {
  const [currentAlgorithm, setCurrentAlgorithm] = useState('linear')

  const searchingAlgorithms = [
    {
      id: 'linear',
      title: 'Linear Search',
      description: 'Sequential search through elements - O(n)',
      icon: '🔍',
      complexity: 'O(n)',
      component: LinearSearchVisualization
    },
    {
      id: 'binary',
      title: 'Binary Search',
      description: 'Divide and conquer on sorted arrays - O(log n)',
      icon: '🎯',
      complexity: 'O(log n)',
      component: BinarySearchVisualization
    },
    {
      id: 'hash',
      title: 'Hash Search',
      description: 'Direct access using hash function - O(1)',
      icon: '#️⃣',
      complexity: 'O(1)',
      component: HashSearchVisualization
    }
  ]

  const CurrentComponent = searchingAlgorithms.find(alg => alg.id === currentAlgorithm)?.component
  const currentAlgorithmInfo = searchingAlgorithms.find(alg => alg.id === currentAlgorithm)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Searching Algorithms</h1>
        <p className="text-lg text-gray-600">
          Compare and understand different search algorithms through interactive visualizations.
        </p>
      </div>

      {/* Algorithm Selection */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          {searchingAlgorithms.map((algorithm) => (
            <button
              key={algorithm.id}
              onClick={() => setCurrentAlgorithm(algorithm.id)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
                currentAlgorithm === algorithm.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">{algorithm.icon}</span>
              <div className="text-left">
                <div className="font-semibold">{algorithm.title}</div>
                <div className="text-sm opacity-75">{algorithm.description}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    algorithm.complexity.includes('n') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {algorithm.complexity}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Visualization Area */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentAlgorithmInfo?.title}
          </h2>
          <p className="text-gray-600 mt-1">{currentAlgorithmInfo?.description}</p>
        </div>
        
        <div className="min-h-[600px]">
          {CurrentComponent && <CurrentComponent />}
        </div>
        
        {/* Simple Control Panel for Step-by-step playback */}
        {currentAlgorithm !== 'hash' && (
          <div className="mt-6">
            <SimpleControlPanel />
          </div>
        )}
      </div>

      {/* Algorithm Comparison Table */}
      <div className="mt-8 card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Algorithm Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Algorithm</th>
                <th className="text-left py-3 px-4">Time Complexity</th>
                <th className="text-left py-3 px-4">Space Complexity</th>
                <th className="text-left py-3 px-4">Prerequisites</th>
                <th className="text-left py-3 px-4">Best Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Linear Search</td>
                <td className="py-3 px-4">O(n)</td>
                <td className="py-3 px-4">O(1)</td>
                <td className="py-3 px-4">None</td>
                <td className="py-3 px-4">Unsorted data, simple implementation</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Binary Search</td>
                <td className="py-3 px-4">O(log n)</td>
                <td className="py-3 px-4">O(1)</td>
                <td className="py-3 px-4">Sorted array</td>
                <td className="py-3 px-4">Large sorted datasets</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Hash Search</td>
                <td className="py-3 px-4">O(1) avg / O(n) worst</td>
                <td className="py-3 px-4">O(n)</td>
                <td className="py-3 px-4">Hash function, table</td>
                <td className="py-3 px-4">Fast lookups, frequent searches</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Concepts */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Concepts</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-blue-600">Linear Search:</span>
              <span className="text-gray-600 ml-2">Check each element sequentially</span>
            </div>
            <div>
              <span className="font-medium text-purple-600">Binary Search:</span>
              <span className="text-gray-600 ml-2">Divide search space in half each step</span>
            </div>
            <div>
              <span className="font-medium text-green-600">Hash Search:</span>
              <span className="text-gray-600 ml-2">Direct access using computed index</span>
            </div>
            <div>
              <span className="font-medium text-orange-600">Collision Resolution:</span>
              <span className="text-gray-600 ml-2">Handle hash function conflicts</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">When to Use Each Algorithm</h3>
          <div className="space-y-2 text-sm">
            <div>• <strong>Unsorted data:</strong> Linear Search</div>
            <div>• <strong>Large sorted arrays:</strong> Binary Search</div>
            <div>• <strong>Frequent lookups:</strong> Hash Table</div>
            <div>• <strong>Memory constrained:</strong> Binary Search</div>
            <div>• <strong>Simple implementation:</strong> Linear Search</div>
            <div>• <strong>Worst-case guarantee:</strong> Binary Search</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SortingAlgorithms() {
  const [currentAlgorithm, setCurrentAlgorithm] = useState('bubble')

  const sortingAlgorithms = [
    {
      id: 'bubble',
      title: 'Bubble Sort',
      description: 'Adjacent element swapping - O(n²)',
      icon: '🫧',
      complexity: 'O(n²)',
      stable: true,
      component: BubbleSortVisualization
    },
    {
      id: 'selection',
      title: 'Selection Sort',
      description: 'Find minimum and place at beginning - O(n²)',
      icon: '🎯',
      complexity: 'O(n²)',
      stable: false,
      component: SelectionSortVisualization
    },
    {
      id: 'insertion',
      title: 'Insertion Sort',
      description: 'Insert elements into sorted portion - O(n²)',
      icon: '🔄',
      complexity: 'O(n²)',
      stable: true,
      component: InsertionSortVisualization
    },
    {
      id: 'merge',
      title: 'Merge Sort',
      description: 'Divide and conquer approach - O(n log n)',
      icon: '🔀',
      complexity: 'O(n log n)',
      stable: true,
      component: MergeSortVisualization
    },
    {
      id: 'quick',
      title: 'Quick Sort',
      description: 'Partition around pivot - O(n log n) avg',
      icon: '⚡',
      complexity: 'O(n log n)',
      stable: false,
      component: QuickSortVisualization
    }
  ]

  const CurrentComponent = sortingAlgorithms.find(alg => alg.id === currentAlgorithm)?.component
  const currentAlgorithmInfo = sortingAlgorithms.find(alg => alg.id === currentAlgorithm)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sorting Algorithms</h1>
        <p className="text-lg text-gray-600">
          Compare and understand different sorting algorithms through interactive visualizations.
        </p>
      </div>

      {/* Algorithm Selection */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          {sortingAlgorithms.map((algorithm) => (
            <button
              key={algorithm.id}
              onClick={() => setCurrentAlgorithm(algorithm.id)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
                currentAlgorithm === algorithm.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">{algorithm.icon}</span>
              <div className="text-left">
                <div className="font-semibold">{algorithm.title}</div>
                <div className="text-sm opacity-75">{algorithm.description}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    algorithm.complexity.includes('n²') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {algorithm.complexity}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    algorithm.stable ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {algorithm.stable ? 'Stable' : 'Unstable'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Visualization Area */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentAlgorithmInfo?.title}
          </h2>
          <p className="text-gray-600 mt-1">{currentAlgorithmInfo?.description}</p>
        </div>
        
        <div className="min-h-[600px]">
          {CurrentComponent && <CurrentComponent />}
        </div>
        
        {/* Simple Control Panel for Step-by-step playback */}
        <div className="mt-6">
          <SimpleControlPanel />
        </div>
      </div>

      {/* Algorithm Comparison Table */}
      <div className="mt-8 card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Algorithm Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Algorithm</th>
                <th className="text-left py-3 px-4">Time Complexity</th>
                <th className="text-left py-3 px-4">Space Complexity</th>
                <th className="text-left py-3 px-4">Stable</th>
                <th className="text-left py-3 px-4">Best Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Bubble Sort</td>
                <td className="py-3 px-4">O(n²) / O(n) best</td>
                <td className="py-3 px-4">O(1)</td>
                <td className="py-3 px-4">✅ Yes</td>
                <td className="py-3 px-4">Educational, nearly sorted data</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Selection Sort</td>
                <td className="py-3 px-4">O(n²) all cases</td>
                <td className="py-3 px-4">O(1)</td>
                <td className="py-3 px-4">❌ No</td>
                <td className="py-3 px-4">Memory constrained, minimize swaps</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Insertion Sort</td>
                <td className="py-3 px-4">O(n²) / O(n) best</td>
                <td className="py-3 px-4">O(1)</td>
                <td className="py-3 px-4">✅ Yes</td>
                <td className="py-3 px-4">Small datasets, nearly sorted</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Merge Sort</td>
                <td className="py-3 px-4">O(n log n) all cases</td>
                <td className="py-3 px-4">O(n)</td>
                <td className="py-3 px-4">✅ Yes</td>
                <td className="py-3 px-4">Large datasets, stable sorting needed</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Quick Sort</td>
                <td className="py-3 px-4">O(n log n) avg / O(n²) worst</td>
                <td className="py-3 px-4">O(log n)</td>
                <td className="py-3 px-4">❌ No</td>
                <td className="py-3 px-4">General purpose, average case important</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Concepts */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Concepts</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-blue-600">Time Complexity:</span>
              <span className="text-gray-600 ml-2">How execution time scales with input size</span>
            </div>
            <div>
              <span className="font-medium text-purple-600">Space Complexity:</span>
              <span className="text-gray-600 ml-2">Extra memory required by the algorithm</span>
            </div>
            <div>
              <span className="font-medium text-green-600">Stability:</span>
              <span className="text-gray-600 ml-2">Preserves relative order of equal elements</span>
            </div>
            <div>
              <span className="font-medium text-orange-600">In-place:</span>
              <span className="text-gray-600 ml-2">Sorts without using extra memory</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">When to Use Each Algorithm</h3>
          <div className="space-y-2 text-sm">
            <div>• <strong>Small datasets (n &lt; 50):</strong> Insertion Sort</div>
            <div>• <strong>Memory limited:</strong> Selection Sort or Insertion Sort</div>
            <div>• <strong>Nearly sorted data:</strong> Insertion Sort or Bubble Sort</div>
            <div>• <strong>Stability required:</strong> Merge Sort or Insertion Sort</div>
            <div>• <strong>General purpose:</strong> Quick Sort or Merge Sort</div>
            <div>• <strong>Worst-case guarantee:</strong> Merge Sort</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TreeAlgorithms() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tree Algorithms</h1>
      <div className="card">
        <p className="text-gray-600 mb-4">
          Explore tree construction, balancing operations, and traversal algorithms.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            🚧 This section is under development. Tree algorithm visualizations coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

function GraphAlgorithms() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Graph Algorithms</h1>
      <div className="card">
        <p className="text-gray-600 mb-4">
          Visualize graph traversals, shortest path algorithms, and minimum spanning trees.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            🚧 This section is under development. Graph algorithm visualizations coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Algorithms() {
  const location = useLocation()
  const isRootPath = location.pathname === '/algorithms' || location.pathname === '/algorithms/'

  return (
    <div>
      {!isRootPath && (
        <nav className="mb-8">
          <Link to="/algorithms" className="text-primary-600 hover:text-primary-700">
            ← Back to Algorithms
          </Link>
        </nav>
      )}
      
      <Routes>
        <Route path="/" element={<TopicOverview />} />
        <Route path="/searching" element={<SearchingAlgorithms />} />
        <Route path="/sorting" element={<SortingAlgorithms />} />
        <Route path="/trees" element={<TreeAlgorithms />} />
        <Route path="/graphs" element={<GraphAlgorithms />} />
      </Routes>
    </div>
  )
}