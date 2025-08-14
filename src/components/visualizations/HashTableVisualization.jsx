import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'
import Quiz from '../Quiz'
import CollapsibleSection from '../common/CollapsibleSection'

const HASH_COLORS = {
  empty: '#f3f4f6',
  filled: '#3b82f6',
  collision: '#ef4444',
  highlight: '#10b981',
  chainNode: '#8b5cf6'
}

// Hash table operations for chaining
const CHAINING_OPERATIONS = [
  { operation: 'insert', key: 'apple', value: 25, hash: 1, description: 'Insert ("apple", 25) → hash(apple) = 1' },
  { operation: 'insert', key: 'banana', value: 12, hash: 3, description: 'Insert ("banana", 12) → hash(banana) = 3' },
  { operation: 'insert', key: 'orange', value: 8, hash: 1, description: 'Insert ("orange", 8) → hash(orange) = 1 [COLLISION!]' },
  { operation: 'insert', key: 'grape', value: 15, hash: 2, description: 'Insert ("grape", 15) → hash(grape) = 2' },
  { operation: 'search', key: 'orange', hash: 1, description: 'Search for "orange" → check bucket 1 chain' },
  { operation: 'delete', key: 'banana', hash: 3, description: 'Delete "banana" → remove from bucket 3' }
]


// Hash Tables Quiz Questions
const HASH_QUIZ_QUESTIONS = [
  {
    type: 'multiple-choice',
    question: 'What is the primary advantage of hash tables over arrays for lookups?',
    options: [
      'Hash tables use less memory',
      'Hash tables provide O(1) average time lookup',
      'Hash tables maintain sorted order',
      'Hash tables handle any data type'
    ],
    correctAnswer: 1,
    explanation: 'Hash tables provide O(1) average time complexity for lookups by using a hash function to compute direct indices, while arrays require O(n) linear search for unsorted data.'
  },
  {
    type: 'multiple-choice',
    question: 'What happens when two keys hash to the same index?',
    options: [
      'The second key overwrites the first',
      'A collision occurs and must be resolved',
      'The hash table automatically resizes',
      'An error is thrown'
    ],
    correctAnswer: 1,
    explanation: 'When two different keys hash to the same index, a collision occurs. This must be resolved using techniques like chaining (linked lists) where multiple values are stored in the same bucket.'
  },
  {
    type: 'code-output',
    question: 'What will happen when we insert keys that collide in a hash table using separate chaining?',
    code: `HashMap with separate chaining, size 5:
hash("apple") = 1
hash("orange") = 1  // collision!

insert("apple", 25)
insert("orange", 8)`,
    options: [
      'orange overwrites apple',
      'Both apple and orange are stored in bucket 1 as a chain',
      'orange is rejected and not stored',
      'The hash table automatically resizes'
    ],
    correctAnswer: 1,
    explanation: 'With separate chaining, collisions are handled by storing multiple key-value pairs in the same bucket using a linked list or similar structure.'
  },
  {
    type: 'multiple-choice',
    question: 'What is the load factor of a hash table?',
    options: [
      'The maximum number of elements that can be stored',
      'The ratio of filled slots to total slots',
      'The number of collisions that have occurred',
      'The size of the hash table array'
    ],
    correctAnswer: 1,
    explanation: 'Load factor = (number of elements) / (table size). It measures how full the hash table is. Higher load factors increase collision probability and degrade performance.'
  },
  {
    type: 'true-false',
    question: 'A good hash function should distribute keys uniformly across the hash table.',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation: 'True. A good hash function minimizes collisions by distributing keys uniformly across all available slots, which maintains the O(1) average performance of hash table operations.'
  },
  {
    type: 'multiple-choice',
    question: 'In separate chaining, what happens to the worst-case time complexity when all keys hash to the same bucket?',
    options: [
      'Remains O(1)',
      'Becomes O(log n)',
      'Becomes O(n)',
      'Becomes O(n²)'
    ],
    correctAnswer: 2,
    explanation: 'When all keys hash to the same bucket in separate chaining, the bucket becomes a linked list with all n elements, making search, insert, and delete operations O(n) in the worst case.'
  },
  {
    type: 'multiple-choice',
    question: 'What is the main advantage of separate chaining over other collision resolution methods?',
    options: [
      'It uses less memory',
      'It guarantees O(1) access time',
      'It can handle any load factor and is simple to implement',
      'It provides better cache performance'
    ],
    correctAnswer: 2,
    explanation: 'Separate chaining can handle load factors greater than 1.0 and is conceptually simple to implement using linked lists or arrays for each bucket.'
  }
]

export default function HashTableVisualization() {
  const { state, setVisualizationData } = useApp()
  const [currentDemo, setCurrentDemo] = useState('chaining')
  const [chainingTable, setChainingTable] = useState([])
  const [highlightedBucket, setHighlightedBucket] = useState(-1)
  const [highlightedKey, setHighlightedKey] = useState('')

  const generateVisualizationSteps = useCallback((demo) => {
    const steps = []
    const tableSize = 5 // Always use 5 for chaining
    
    if (demo === 'chaining') {
      steps.push({
        demo: 'chaining',
        step: 0,
        description: 'Hash Table with Separate Chaining - Empty State',
        operation: 'hash-demo',
        table: Array(tableSize).fill([]),
        tableSize
      })
      
      let currentTable = Array(tableSize).fill(null).map(() => [])
      
      CHAINING_OPERATIONS.forEach((op, index) => {
        if (op.operation === 'insert') {
          const bucket = currentTable[op.hash]
          currentTable[op.hash] = [...bucket, { key: op.key, value: op.value }]
        } else if (op.operation === 'delete') {
          currentTable[op.hash] = currentTable[op.hash].filter(item => item.key !== op.key)
        }
        
        steps.push({
          demo: 'chaining',
          step: index + 1,
          description: op.description,
          operation: 'hash-demo',
          table: currentTable.map(bucket => [...bucket]),
          tableSize,
          highlightedBucket: op.hash,
          highlightedKey: op.key,
          operationType: op.operation
        })
      })
    }
    
    return steps
  }, [])

  const handleDemoChange = (demo) => {
    setCurrentDemo(demo)
    const steps = generateVisualizationSteps(demo)
    setVisualizationData(steps, `hash-${demo}`)
    
    // Reset state
    setChainingTable([])
    setHighlightedBucket(-1)
    setHighlightedKey('')
  }

  // Initialize the first demo on mount
  useEffect(() => {
    const steps = generateVisualizationSteps('chaining')
    setVisualizationData(steps, 'hash-chaining')
  }, [generateVisualizationSteps, setVisualizationData]) // Run only when these dependencies change

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && state.visualizationContext?.startsWith('hash-')) {
      if (currentStep.demo === 'chaining') {
        setChainingTable(currentStep.table || [])
        setHighlightedBucket(currentStep.highlightedBucket ?? -1)
      }
      setHighlightedKey(currentStep.highlightedKey || '')
    }
  }, [state.currentStep, state.visualizationData, state.visualizationContext])

  const renderSeparateChaining = () => {
    const currentStep = state.visualizationData[state.currentStep]
    const tableSize = currentStep?.tableSize || 5
    
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Separate Chaining</h3>
        
        <div className="max-w-4xl mx-auto">
          {/* Hash Table Visualization */}
          <div className="mb-6">
            <div className="space-y-3">
              {Array(tableSize).fill(null).map((_, bucketIndex) => (
                <div key={bucketIndex} className="flex items-center">
                  {/* Bucket Index */}
                  <div className="w-12 text-center text-sm font-medium text-gray-700 mr-4">
                    [{bucketIndex}]
                  </div>
                  
                  {/* Bucket Container */}
                  <motion.div
                    className={`min-w-[100px] min-h-[50px] border-2 rounded-lg p-2 flex items-center ${
                      highlightedBucket === bucketIndex
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                    animate={{
                      borderColor: highlightedBucket === bucketIndex ? '#f59e0b' : '#d1d5db'
                    }}
                  >
                    {chainingTable[bucketIndex]?.length > 0 ? (
                      <div className="flex space-x-2 overflow-x-auto">
                        {chainingTable[bucketIndex].map((item, itemIndex) => (
                          <motion.div
                            key={`${item.key}-${itemIndex}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`flex-shrink-0 p-2 rounded border ${
                              highlightedKey === item.key
                                ? 'bg-green-200 border-green-400'
                                : 'bg-blue-100 border-blue-300'
                            }`}
                          >
                            <div className="text-xs font-medium">{item.key}</div>
                            <div className="text-xs text-gray-600">→ {item.value}</div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">null</div>
                    )}
                  </motion.div>
                  
                  {/* Chain indicator */}
                  {chainingTable[bucketIndex]?.length > 1 && (
                    <div className="ml-2 text-sm text-blue-600">
                      → chain of {chainingTable[bucketIndex].length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hash Function */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-semibold mb-2 text-blue-800">Hash Function</h5>
            <div className="text-sm text-blue-700">
              <code>hash(key) = key.hashCode() % {tableSize}</code>
              {highlightedKey && (
                <div className="mt-2">
                  <strong>Current operation: "{highlightedKey}"</strong>
                </div>
              )}
            </div>
          </div>

          {/* Properties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold">Total Elements</div>
              <div className="text-2xl text-purple-600">
                {chainingTable.reduce((sum, bucket) => sum + bucket.length, 0)}
              </div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="font-semibold">Load Factor</div>
              <div className="text-2xl text-orange-600">
                {(chainingTable.reduce((sum, bucket) => sum + bucket.length, 0) / tableSize).toFixed(2)}
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold">Collisions</div>
              <div className="text-2xl text-green-600">
                {chainingTable.filter(bucket => bucket.length > 1).length}
              </div>
            </div>
          </div>

          {/* Current Operation */}
          {currentStep?.operationType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-gray-100 rounded-lg text-center"
            >
              <span className="font-medium">Current Operation: </span>
              <span className={`px-2 py-1 rounded text-sm ${
                currentStep.operationType === 'insert' ? 'bg-green-100 text-green-800' :
                currentStep.operationType === 'search' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentStep.operationType.toUpperCase()}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    )
  }


  return (
    <div className="w-full">
      {/* Demo Selection with Quiz Tab */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-center space-x-2 flex-wrap">
          {[
            { id: 'chaining', label: 'Separate Chaining', icon: '🔗', type: 'demo' },
            { id: 'quiz', label: 'Hash Tables Quiz', icon: '🧠', type: 'quiz' }
          ].map(demo => (
            <button
              key={demo.id}
              onClick={() => demo.type === 'quiz' ? setCurrentDemo('quiz') : handleDemoChange(demo.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentDemo === demo.id
                  ? demo.type === 'quiz'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg scale-105'
                    : 'bg-blue-500 text-white'
                  : demo.type === 'quiz'
                  ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 hover:from-purple-200 hover:to-indigo-200 border-2 border-purple-300 animate-pulse'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } ${demo.type === 'quiz' ? 'relative overflow-hidden' : ''}`}
            >
              {demo.type === 'quiz' && currentDemo !== 'quiz' && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-20 animate-ping"></div>
              )}
              <span className="relative z-10">
                {demo.icon} {demo.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Demo - Interactive Content First */}
      <div className="space-y-6">
        {currentDemo === 'chaining' && renderSeparateChaining()}
        {currentDemo === 'quiz' && (
          <div className="card">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🧠 Hash Tables & Maps Knowledge Quiz
              </h2>
              <p className="text-gray-600">
                Test your understanding of hash functions, collision resolution, and hash table performance with this comprehensive assessment.
              </p>
            </div>
            
            <Quiz
              title="Hash Tables & Maps Mastery"
              questions={HASH_QUIZ_QUESTIONS}
              onComplete={(results) => {
                console.log('Hash Tables Quiz completed:', results)
              }}
              showResults={true}
              allowRetake={true}
            />
          </div>
        )}
      </div>

      {/* Comprehensive Hash Tables Education - Static Content Below */}
      <div className="mt-8 space-y-4">
        <CollapsibleSection 
          title="Hash Table Fundamentals" 
          bgColor="bg-blue-50" 
          borderColor="border-blue-200" 
          titleColor="text-blue-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">🔧 Core Components</h4>
              <div className="text-blue-700 space-y-1">
                <div><strong>Hash Function:</strong> Maps keys to array indices</div>
                <div><strong>Buckets/Slots:</strong> Array positions for storing data</div>
                <div><strong>Load Factor:</strong> Ratio of elements to table size</div>
                <div><strong>Collision Resolution:</strong> Handling hash conflicts</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">⚡ Performance</h4>
              <div className="text-blue-700 space-y-1">
                <div><strong>Average Case:</strong> O(1) for all operations</div>
                <div><strong>Worst Case:</strong> O(n) when many collisions</div>
                <div><strong>Space:</strong> O(n) where n is number of elements</div>
                <div><strong>Load Factor:</strong> Keep below 0.75 for good performance</div>
              </div>
            </div>
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection 
          title="🔗 Separate Chaining Benefits" 
          bgColor="bg-green-50" 
          borderColor="border-green-200" 
          titleColor="text-green-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
            <div>
              <h5 className="font-semibold mb-1">Advantages:</h5>
              <ul className="space-y-1">
                <li>• Simple to implement and understand</li>
                <li>• Can handle load factors &gt; 1.0</li>
                <li>• Easy deletion (no special markers needed)</li>
                <li>• Performance degrades gracefully</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-1">Considerations:</h5>
              <ul className="space-y-1">
                <li>• Extra memory for pointers/references</li>
                <li>• Cache performance can be worse</li>
                <li>• Need to manage dynamic memory</li>
                <li>• Chain length varies with hash quality</li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection 
          title="🎯 Hash Function Design" 
          bgColor="bg-amber-50" 
          borderColor="border-amber-200" 
          titleColor="text-amber-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700">
            <div>
              <h5 className="font-semibold mb-1">Good Hash Function Properties:</h5>
              <ul className="space-y-1">
                <li>• Uniform distribution across table</li>
                <li>• Fast to compute</li>
                <li>• Deterministic (same input → same output)</li>
                <li>• Minimizes clustering</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-1">Common Hash Functions:</h5>
              <ul className="space-y-1">
                <li>• Division: key % tableSize</li>
                <li>• Multiplication: (key × A) mod 1</li>
                <li>• Cryptographic: SHA, MD5 (overkill for tables)</li>
                <li>• String hashing: polynomial rolling hash</li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection 
          title="🗺️ Hash Maps vs Other Data Structures" 
          bgColor="bg-purple-50" 
          borderColor="border-purple-200" 
          titleColor="text-purple-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="font-semibold text-purple-800">HashMap vs Array</h5>
              <div className="text-purple-700 space-y-1">
                <div>✅ Faster lookups for large data</div>
                <div>✅ Dynamic keys (not just indices)</div>
                <div>❌ More memory overhead</div>
                <div>❌ No guaranteed order</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-purple-800">HashMap vs TreeMap</h5>
              <div className="text-purple-700 space-y-1">
                <div>✅ Faster operations O(1) vs O(log n)</div>
                <div>❌ No sorted iteration</div>
                <div>❌ No range queries</div>
                <div>❌ Worse worst-case performance</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-purple-800">When to Use HashMap</h5>
              <div className="text-purple-700 space-y-1">
                <div>• Fast lookups needed</div>
                <div>• Keys are not ordered</div>
                <div>• Frequent insert/delete operations</div>
                <div>• Good hash function available</div>
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* Current Operation Description */}
      <AnimatePresence>
        {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && 
        state.visualizationContext?.startsWith('hash-') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center"
          >
            <p className="text-blue-800 font-medium">
              {state.visualizationData[state.currentStep].description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}