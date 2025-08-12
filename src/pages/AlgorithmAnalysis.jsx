import { Routes, Route, Link, useLocation } from 'react-router-dom'

const topics = [
  {
    title: 'Complexity Analysis',
    path: 'complexity',
    description: 'Big O, Best/Average/Worst Case Analysis',
    icon: '📊'
  },
  {
    title: 'Performance Measurement',
    path: 'performance',
    description: 'Empirical Testing and Benchmarking',
    icon: '⏱️'
  },
  {
    title: 'Trade-offs',
    path: 'tradeoffs',
    description: 'Space vs Time Complexity Decisions',
    icon: '⚖️'
  }
]

function TopicOverview() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Algorithm Analysis</h1>
        <p className="text-lg text-gray-600">
          Master the art of analyzing algorithm performance and making informed design decisions
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Link
            key={topic.path}
            to={topic.path}
            className="card hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">{topic.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                {topic.title}
              </h3>
              <p className="text-gray-600">{topic.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ComplexityAnalysis() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Complexity Analysis</h1>
      <div className="card">
        <p className="text-gray-600 mb-4">
          Interactive tools for understanding Big O notation and complexity analysis.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            🚧 This section is under development. Complexity analysis tools coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

function PerformanceMeasurement() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Performance Measurement</h1>
      <div className="card">
        <p className="text-gray-600 mb-4">
          Tools for empirical performance testing and benchmarking algorithms.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            🚧 This section is under development. Performance measurement tools coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

function TradeOffs() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Algorithm Trade-offs</h1>
      <div className="card">
        <p className="text-gray-600 mb-4">
          Explore the trade-offs between space and time complexity in algorithm design.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            🚧 This section is under development. Trade-off analysis tools coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AlgorithmAnalysis() {
  const location = useLocation()
  const isRootPath = location.pathname === '/algorithm-analysis' || location.pathname === '/algorithm-analysis/'

  return (
    <div>
      {!isRootPath && (
        <nav className="mb-8">
          <Link to="/algorithm-analysis" className="text-primary-600 hover:text-primary-700">
            ← Back to Algorithm Analysis
          </Link>
        </nav>
      )}
      
      <Routes>
        <Route path="/" element={<TopicOverview />} />
        <Route path="/complexity" element={<ComplexityAnalysis />} />
        <Route path="/performance" element={<PerformanceMeasurement />} />
        <Route path="/tradeoffs" element={<TradeOffs />} />
      </Routes>
    </div>
  )
}