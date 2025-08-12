import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const HASH_COLORS = {
  default: '#6b7280',
  bucket: '#e5e7eb',
  target: '#f59e0b',
  found: '#10b981',
  collision: '#ef4444',
  probing: '#8b5cf6',
  empty: '#f3f4f6'
}

export default function HashSearchVisualization() {
  const { state, setVisualizationData } = useApp()
  const [hashTable, setHashTable] = useState(Array(7).fill(null))
  const [keys, setKeys] = useState([15, 25, 35, 10, 33, 12])
  const [target, setTarget] = useState(25)
  const [tableSize, setTableSize] = useState(7)
  const [hashMethod, setHashMethod] = useState('division')
  const [collisionMethod, setCollisionMethod] = useState('chaining')
  const [operations, setOperations] = useState(0)
  const [searchComplete, setSearchComplete] = useState(false)
  const [foundAt, setFoundAt] = useState(-1)

  const hashFunction = useCallback((key, size, method = 'division') => {
    switch (method) {
      case 'division':
        return key % size
      case 'multiplication':
        const A = 0.6180339887 // (sqrt(5) - 1) / 2
        return Math.floor(size * ((key * A) % 1))
      default:
        return key % size
    }
  }, [])

  const generateHashTableSteps = useCallback((inputKeys, searchTarget, size, method, collision) => {
    const steps = []
    let table = Array(size).fill(null).map(() => collision === 'chaining' ? [] : null)
    let totalOperations = 0

    steps.push({
      hashTable: JSON.parse(JSON.stringify(table)),
      keys: Array.from(inputKeys),
      target: searchTarget,
      operations: 0,
      searchComplete: false,
      foundAt: -1,
      description: `Creating hash table with size ${size} using ${method} hashing and ${collision} collision resolution`,
      operation: 'initialize'
    })

    // Insert all keys first
    for (const key of inputKeys) {
      const hash = hashFunction(key, size, method)
      totalOperations++

      if (collision === 'chaining') {
        table[hash].push(key)
        steps.push({
          hashTable: JSON.parse(JSON.stringify(table)),
          keys: Array.from(inputKeys),
          target: searchTarget,
          operations: totalOperations,
          searchComplete: false,
          foundAt: -1,
          description: `Inserted ${key} at bucket ${hash} using hash(${key}) = ${key} % ${size} = ${hash}`,
          operation: 'insert'
        })
      } else {
        let index = hash
        let probe = 0
        while (table[index] !== null) {
          probe++
          index = (hash + probe) % size
          totalOperations++
        }
        table[index] = key
        steps.push({
          hashTable: JSON.parse(JSON.stringify(table)),
          keys: Array.from(inputKeys),
          target: searchTarget,
          operations: totalOperations,
          searchComplete: false,
          foundAt: -1,
          description: probe > 0 
            ? `Inserted ${key} at index ${index} after ${probe} probes (collision resolved)`
            : `Inserted ${key} at index ${index} using hash(${key}) = ${hash}`,
          operation: 'insert'
        })
      }
    }

    // Now search for target
    const targetHash = hashFunction(searchTarget, size, method)
    totalOperations++

    steps.push({
      hashTable: JSON.parse(JSON.stringify(table)),
      keys: Array.from(inputKeys),
      target: searchTarget,
      operations: totalOperations,
      searchComplete: false,
      foundAt: -1,
      description: `Searching for ${searchTarget}. Calculated hash(${searchTarget}) = ${searchTarget} % ${size} = ${targetHash}`,
      operation: 'search-start'
    })

    if (collision === 'chaining') {
      const bucket = table[targetHash]
      let found = false
      for (let i = 0; i < bucket.length; i++) {
        totalOperations++
        if (bucket[i] === searchTarget) {
          found = true
          steps.push({
            hashTable: JSON.parse(JSON.stringify(table)),
            keys: Array.from(inputKeys),
            target: searchTarget,
            operations: totalOperations,
            searchComplete: true,
            foundAt: targetHash,
            description: `Found ${searchTarget} in bucket ${targetHash} at position ${i}`,
            operation: 'found'
          })
          break
        }
      }
      if (!found) {
        steps.push({
          hashTable: JSON.parse(JSON.stringify(table)),
          keys: Array.from(inputKeys),
          target: searchTarget,
          operations: totalOperations,
          searchComplete: true,
          foundAt: -1,
          description: `${searchTarget} not found in bucket ${targetHash}`,
          operation: 'not-found'
        })
      }
    } else {
      let index = targetHash
      let probe = 0
      let found = false
      
      while (table[index] !== null) {
        totalOperations++
        if (table[index] === searchTarget) {
          found = true
          steps.push({
            hashTable: JSON.parse(JSON.stringify(table)),
            keys: Array.from(inputKeys),
            target: searchTarget,
            operations: totalOperations,
            searchComplete: true,
            foundAt: index,
            description: `Found ${searchTarget} at index ${index}${probe > 0 ? ` after ${probe} probes` : ''}`,
            operation: 'found'
          })
          break
        }
        probe++
        index = (targetHash + probe) % size
        if (index === targetHash) break // Prevent infinite loop
      }
      
      if (!found) {
        steps.push({
          hashTable: JSON.parse(JSON.stringify(table)),
          keys: Array.from(inputKeys),
          target: searchTarget,
          operations: totalOperations,
          searchComplete: true,
          foundAt: -1,
          description: `${searchTarget} not found after ${probe} probes`,
          operation: 'not-found'
        })
      }
    }

    return steps
  }, [hashFunction])

  const handleSearch = () => {
    if (!Array.isArray(keys) || keys.length === 0) {
      return
    }
    
    try {
      const steps = generateHashTableSteps(keys, target, tableSize, hashMethod, collisionMethod)
      setVisualizationData(steps, 'search-hash')
    } catch (error) {
      console.error('Error generating hash steps:', error)
    }
  }

  const generateRandomData = () => {
    const newKeys = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100))
    setKeys(newKeys)
    setTarget(newKeys[Math.floor(Math.random() * newKeys.length)])
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && currentStep.hashTable) {
      setHashTable(currentStep.hashTable)
      setTarget(currentStep.target || target)
      setOperations(currentStep.operations || 0)
      setSearchComplete(currentStep.searchComplete || false)
      setFoundAt(currentStep.foundAt || -1)
    }
  }, [state.currentStep, state.visualizationData, target])

  const renderHashTable = () => {
    return (
      <div className="grid gap-2 justify-center">
        {hashTable.map((bucket, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-sm font-semibold">
              {index}
            </div>
            <div className="flex">
              {collisionMethod === 'chaining' ? (
                <div className="flex items-center space-x-1">
                  <div className={`w-16 h-8 border-2 rounded flex items-center justify-center text-sm ${
                    foundAt === index ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}>
                    {Array.isArray(bucket) && bucket.length === 0 ? 'null' : ''}
                  </div>
                  {Array.isArray(bucket) && bucket.map((value, valueIndex) => (
                    <div key={valueIndex} className="flex items-center">
                      <div className="w-2 h-0.5 bg-gray-400"></div>
                      <div className={`w-12 h-8 border-2 rounded flex items-center justify-center text-sm font-semibold ${
                        value === target && foundAt === index ? 'border-green-500 bg-green-100 text-green-700' : 'border-blue-300 bg-blue-50'
                      }`}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`w-16 h-8 border-2 rounded flex items-center justify-center text-sm font-semibold ${
                  foundAt === index ? 'border-green-500 bg-green-100 text-green-700' : 
                  bucket === null ? 'border-gray-300 bg-gray-50' : 'border-blue-300 bg-blue-50'
                }`}>
                  {bucket === null ? 'null' : bucket}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hash Function</label>
            <select
              value={hashMethod}
              onChange={(e) => setHashMethod(e.target.value)}
              className="w-full px-2 py-1 border rounded-md text-sm"
            >
              <option value="division">Division (k % m)</option>
              <option value="multiplication">Multiplication</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Collision Resolution</label>
            <select
              value={collisionMethod}
              onChange={(e) => setCollisionMethod(e.target.value)}
              className="w-full px-2 py-1 border rounded-md text-sm"
            >
              <option value="chaining">Chaining</option>
              <option value="linear">Linear Probing</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Table Size</label>
            <input
              type="number"
              value={tableSize}
              onChange={(e) => setTableSize(Math.max(3, Math.min(15, parseInt(e.target.value) || 7)))}
              className="w-full px-2 py-1 border rounded-md text-sm"
              min="3"
              max="15"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Search Target</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 border rounded-md text-sm"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Keys to Insert</label>
          <input
            type="text"
            value={keys.join(', ')}
            onChange={(e) => {
              const newKeys = e.target.value.split(',').map(k => parseInt(k.trim())).filter(k => !isNaN(k))
              setKeys(newKeys)
            }}
            className="w-full px-2 py-1 border rounded-md text-sm"
            placeholder="Enter comma-separated numbers"
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create Hash Table & Search
          </button>
          <button
            onClick={generateRandomData}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Generate Random Data
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-center">Hash Table (Size: {tableSize})</h3>
        {renderHashTable()}
      </div>

      <div className="flex justify-center space-x-8 text-sm mb-6">
        <span>Target: <span className="font-semibold text-yellow-600">{target}</span></span>
        <span>Operations: {operations}</span>
        <span className={`font-semibold ${foundAt >= 0 ? 'text-green-600' : searchComplete ? 'text-red-600' : 'text-gray-600'}`}>
          Status: {foundAt >= 0 ? `Found at index/bucket ${foundAt}` : searchComplete ? 'Not Found' : 'Processing...'}
        </span>
      </div>

      {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && state.visualizationContext === 'search-hash' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-800">
            {state.visualizationData[state.currentStep].description}
          </p>
        </div>
      )}

      {/* Information Panel */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Hash Table Concepts:</h4>
        <div className="text-sm space-y-1">
          <div><strong>Division Method:</strong> hash(k) = k mod m</div>
          <div><strong>Chaining:</strong> Store colliding elements in linked lists</div>
          <div><strong>Linear Probing:</strong> Find next empty slot sequentially</div>
          <div><strong>Load Factor:</strong> α = n/m (items/table size)</div>
        </div>
      </div>
    </div>
  )
}