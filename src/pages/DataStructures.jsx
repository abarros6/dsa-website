import { Routes, Route, Link, useLocation } from 'react-router-dom'

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
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Linear Data Structures</h1>
      <div className="card">
        <p className="text-gray-600 mb-4">
          Interactive visualizations for arrays, lists, stacks, and queues.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            🚧 This section is under development. Linear structure visualizations coming soon!
          </p>
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