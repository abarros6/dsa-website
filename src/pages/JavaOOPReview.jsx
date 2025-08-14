import { Routes, Route, Link, useLocation } from 'react-router-dom'
import OOPPrinciplesVisualization from '../components/visualizations/OOPPrinciplesVisualization'
import JavaFeaturesVisualization from '../components/visualizations/JavaFeaturesVisualization'
import CollectionsVisualization from '../components/visualizations/CollectionsVisualization'

const topics = [
  {
    title: 'OOP Principles',
    path: 'principles',
    description: 'Inheritance, Polymorphism, Encapsulation, and Abstraction',
    icon: '🏗️'
  },
  {
    title: 'Java Features',
    path: 'features',
    description: 'Generics, Exception Handling, Recursion, and More',
    icon: '⚙️'
  },
  {
    title: 'Collections Framework',
    path: 'collections',
    description: 'ArrayList, LinkedList, HashMap, TreeMap, and More',
    icon: '📦'
  }
]

function TopicOverview() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Java & OOP Review</h1>
        <p className="text-lg text-gray-600">
          Revisit fundamental object-oriented programming concepts with interactive visualizations
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

function OOPPrinciples() {

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">OOP Principles</h1>
        <p className="text-lg text-gray-600">
          Explore the fundamental principles of object-oriented programming through interactive visualizations.
        </p>
      </div>

      {/* Visualization */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Interactive OOP Demonstrations
          </h2>
        </div>
        
        <div className="min-h-[600px]">
          <OOPPrinciplesVisualization />
        </div>
      </div>
    </div>
  )
}

function JavaFeatures() {

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Java Features</h1>
        <p className="text-lg text-gray-600">
          Explore advanced Java features including generics, exception handling, and recursion through interactive visualizations.
        </p>
      </div>

      {/* Visualization */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Interactive Java Feature Demonstrations
          </h2>
        </div>
        
        <div className="min-h-[600px]">
          <JavaFeaturesVisualization />
        </div>
      </div>
    </div>
  )
}

function Collections() {

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Collections Framework</h1>
        <p className="text-lg text-gray-600">
          Interactive exploration of Java's Collections Framework and its key implementations.
        </p>
      </div>

      {/* Visualization */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Interactive Collections Demonstrations
          </h2>
        </div>
        
        <div className="min-h-[600px]">
          <CollectionsVisualization />
        </div>
      </div>
    </div>
  )
}

export default function JavaOOPReview() {
  const location = useLocation()
  const isRootPath = location.pathname === '/java-oop' || location.pathname === '/java-oop/'

  return (
    <div>
      {/* Breadcrumb navigation for sub-pages */}
      {!isRootPath && (
        <nav className="mb-8">
          <Link to="/java-oop" className="text-primary-600 hover:text-primary-700">
            ← Back to Java & OOP Review
          </Link>
        </nav>
      )}
      
      <Routes>
        <Route path="/" element={<TopicOverview />} />
        <Route path="/principles" element={<OOPPrinciples />} />
        <Route path="/features" element={<JavaFeatures />} />
        <Route path="/collections" element={<Collections />} />
      </Routes>
    </div>
  )
}