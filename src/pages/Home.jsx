import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  {
    title: 'Java & OOP Review',
    description: 'Explore object-oriented principles with interactive visualizations of inheritance, polymorphism, and encapsulation.',
    icon: '☕',
    path: '/java-oop',
    color: 'bg-amber-100 text-amber-800'
  },
  {
    title: 'Data Structures',
    description: 'Visualize arrays, lists, stacks, queues, trees, graphs, and hash tables with step-by-step operations.',
    icon: '📊',
    path: '/data-structures',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    title: 'Algorithm Analysis',
    description: 'Understand complexity analysis, performance measurement, and algorithmic trade-offs.',
    icon: '📈',
    path: '/algorithm-analysis',
    color: 'bg-green-100 text-green-800'
  },
  {
    title: 'Algorithms',
    description: 'Interactive implementations of searching, sorting, tree, and graph algorithms.',
    icon: '🔄',
    path: '/algorithms',
    color: 'bg-purple-100 text-purple-800'
  }
]

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.section 
        className="text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            SE2205A Algorithm Visualizer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Interactive visualizations for Algorithms and Data Structures in Object-Oriented Design. 
            Learn through exploration with Java-focused implementations and real-time animations.
          </p>
          <Link
            to="/data-structures"
            className="btn-primary text-lg px-8 py-3 inline-block"
          >
            Start Exploring
          </Link>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Learning Tools
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to master algorithms and data structures for SE2205A
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={feature.path} className="block group">
                <div className="card h-full hover:shadow-lg transition-shadow duration-200">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${feature.color}`}>
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Course Alignment Section */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Aligned with SE2205A Learning Objectives
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Learning Outcomes</h3>
              <p className="text-gray-600 text-sm">Directly mapped to course objectives and CEAB graduate attributes</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interactive Learning</h3>
              <p className="text-gray-600 text-sm">Hands-on exploration with immediate visual feedback</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Java Focus</h3>
              <p className="text-gray-600 text-sm">All examples use Java with OOP best practices</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}