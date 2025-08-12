import { Routes, Route, Link, useLocation } from 'react-router-dom'

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
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Searching Algorithms</h1>
      <div className="card">
        <p className="text-gray-600 mb-4">
          Interactive visualizations for linear search, binary search, and hash-based searching.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            🚧 This section is under development. Search algorithm visualizations coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

function SortingAlgorithms() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sorting Algorithms</h1>
      <div className="card">
        <p className="text-gray-600 mb-4">
          Step through various sorting algorithms with animated comparisons and swaps.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            🚧 This section is under development. Sorting algorithm visualizations coming soon!
          </p>
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