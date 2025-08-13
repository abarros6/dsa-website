import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import SimpleControlPanel from '../components/SimpleControlPanel'
import BigOVisualization from '../components/visualizations/BigOVisualization'
import AlgorithmBenchmark from '../components/visualizations/AlgorithmBenchmark'
import TopicOverviewGrid from '../components/common/TopicOverviewGrid'
import BreadcrumbNavigation from '../components/common/BreadcrumbNavigation'
import EducationalContent from '../components/common/EducationalContent'

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
          Understand algorithm efficiency, complexity analysis, and performance comparison
        </p>
      </div>

      <TopicOverviewGrid topics={topics} />

      {/* Key Concepts */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">Time Complexity</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <div><strong>O(1)</strong> - Constant time, independent of input size</div>
            <div><strong>O(log n)</strong> - Logarithmic, divides problem in half</div>
            <div><strong>O(n)</strong> - Linear, grows proportionally with input</div>
            <div><strong>O(n²)</strong> - Quadratic, nested operations</div>
            <div><strong>O(2ⁿ)</strong> - Exponential, computationally expensive</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 mb-3">Analysis Goals</h3>
          <div className="text-sm text-green-700 space-y-2">
            <div>• Predict algorithm scalability</div>
            <div>• Compare different approaches</div>
            <div>• Identify performance bottlenecks</div>
            <div>• Make informed design decisions</div>
            <div>• Optimize critical code paths</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ComplexityAnalysis() {
  const { clearData } = useApp()

  useEffect(() => {
    clearData()
  }, [clearData])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Complexity Analysis</h1>
        <p className="text-lg text-gray-600">
          Visualize and compare algorithm complexity functions to understand performance characteristics.
        </p>
      </div>

      {/* Visualization Area */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Algorithm Complexity Visualization
          </h2>
        </div>
        
        <div className="min-h-[600px]">
          <BigOVisualization />
        </div>
      </div>

      {/* Educational Content */}
      <EducationalContent
        leftContent={{
          title: "Big O Fundamentals",
          content: (
            <>
              <div className="space-y-2">
                <div><strong>Purpose:</strong> Describes algorithm growth rate</div>
                <div><strong>Focus:</strong> Worst-case performance</div>
                <div><strong>Ignores:</strong> Constants and lower-order terms</div>
                <div><strong>Compares:</strong> Relative performance at scale</div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <strong>Example:</strong> O(3n² + 2n + 1) → O(n²)
              </div>
            </>
          )
        }}
        rightContent={{
          title: "Common Patterns",
          content: (
            <>
              <div className="space-y-2">
                <div><strong>O(1):</strong> Hash table lookup, array access</div>
                <div><strong>O(log n):</strong> Binary search, balanced trees</div>
                <div><strong>O(n):</strong> Linear search, single loop</div>
                <div><strong>O(n log n):</strong> Merge sort, heap sort</div>
                <div><strong>O(n²):</strong> Bubble sort, nested loops</div>
                <div><strong>O(2ⁿ):</strong> Recursive Fibonacci, subset generation</div>
              </div>
            </>
          )
        }}
      />
    </div>
  )
}

function PerformanceMeasurement() {
  const { clearData } = useApp()

  useEffect(() => {
    clearData()
  }, [clearData])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Performance Measurement</h1>
        <p className="text-lg text-gray-600">
          Compare actual runtime performance of different algorithms with varying input sizes.
        </p>
      </div>

      {/* Visualization Area */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Performance Benchmarking Tool
          </h2>
        </div>
        
        <div className="min-h-[600px]">
          <AlgorithmBenchmark />
        </div>
        
        {/* Simple Control Panel for Step-by-step playback */}
        <div className="mt-6">
          <SimpleControlPanel />
        </div>
      </div>

      {/* Educational Content */}
      <EducationalContent
        leftContent={{
          title: "Benchmarking Principles",
          content: (
            <>
              <div className="space-y-2">
                <div><strong>Methodology:</strong> Consistent test conditions</div>
                <div><strong>Input Data:</strong> Random, representative datasets</div>
                <div><strong>Metrics:</strong> Execution time & operation count</div>
                <div><strong>Environment:</strong> Browser JavaScript runtime</div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded">
                <strong>Note:</strong> Results vary by hardware and browser
              </div>
            </>
          )
        }}
        rightContent={{
          title: "Practical Insights",
          content: (
            <>
              <div className="space-y-2">
                <div><strong>Small Inputs:</strong> Simple algorithms often fastest</div>
                <div><strong>Large Inputs:</strong> Complexity matters most</div>
                <div><strong>Memory:</strong> Cache effects impact performance</div>
                <div><strong>Real World:</strong> Consider implementation overhead</div>
                <div><strong>Trade-offs:</strong> Time vs space vs code complexity</div>
              </div>
            </>
          )
        }}
      />
    </div>
  )
}

function TradeOffs() {
  const { clearData } = useApp()

  useEffect(() => {
    clearData()
  }, [clearData])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Algorithm Trade-offs</h1>
        <p className="text-lg text-gray-600">
          Explore the trade-offs between space and time complexity in algorithm design.
        </p>
      </div>

      {/* Combined Visualization Area */}
      <div className="space-y-8">
        {/* Big O Comparison */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Complexity Trade-offs Visualization
            </h2>
            <p className="text-gray-600 mt-2">
              Compare different algorithms to understand time vs space trade-offs
            </p>
          </div>
          
          <div className="min-h-[400px]">
            <BigOVisualization />
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Real-World Performance Trade-offs
            </h2>
            <p className="text-gray-600 mt-2">
              Benchmark different algorithms to see practical performance differences
            </p>
          </div>
          
          <div className="min-h-[400px]">
            <AlgorithmBenchmark />
          </div>
          
          <div className="mt-6">
            <SimpleControlPanel />
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <EducationalContent
        leftContent={{
          title: "Common Trade-offs",
          content: (
            <>
              <div className="space-y-2">
                <div><strong>Time vs Space:</strong> Faster algorithms often use more memory</div>
                <div><strong>Simplicity vs Performance:</strong> Complex optimizations vs readable code</div>
                <div><strong>Best vs Worst Case:</strong> Average performance vs guaranteed bounds</div>
                <div><strong>Memory vs CPU:</strong> Caching vs recalculation strategies</div>
              </div>
              <div className="mt-4 p-3 bg-orange-50 rounded">
                <strong>Rule:</strong> Optimize based on your specific constraints and use case
              </div>
            </>
          )
        }}
        rightContent={{
          title: "Design Decisions",
          content: (
            <>
              <div className="space-y-2">
                <div><strong>Small Data:</strong> Simple algorithms often sufficient</div>
                <div><strong>Large Data:</strong> Complexity dominates performance</div>
                <div><strong>Memory Limited:</strong> Favor space-efficient algorithms</div>
                <div><strong>Real-time:</strong> Consistent performance over average case</div>
                <div><strong>Development Time:</strong> Balance optimization effort vs benefit</div>
              </div>
            </>
          )
        }}
      />
    </div>
  )
}

export default function AlgorithmAnalysis() {
  const location = useLocation()
  const isRootPath = location.pathname === '/algorithm-analysis' || location.pathname === '/algorithm-analysis/'
  const { clearData } = useApp()

  // Clear visualization data if coming from a different page context  
  useEffect(() => {
    clearData()
  }, [clearData])

  return (
    <div>
      {!isRootPath && (
        <BreadcrumbNavigation backTo="/algorithm-analysis" backLabel="Algorithm Analysis" />
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