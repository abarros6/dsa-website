import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const COLLECTIONS_COLORS = {
  arraylist: '#3b82f6',
  linkedlist: '#10b981',
  hashmap: '#f59e0b',
  treemap: '#8b5cf6',
  node: '#6b7280',
  bucket: '#ef4444',
  highlight: '#fbbf24'
}

// ArrayList visualization data
const ARRAYLIST_OPERATIONS = [
  { operation: 'add', value: 'A', index: 0, description: 'Adding "A" to the end' },
  { operation: 'add', value: 'B', index: 1, description: 'Adding "B" to the end' },
  { operation: 'add', value: 'C', index: 2, description: 'Adding "C" to the end' },
  { operation: 'insert', value: 'X', index: 1, description: 'Inserting "X" at index 1' },
  { operation: 'remove', index: 2, description: 'Removing element at index 2' }
]

// LinkedList visualization data
const LINKEDLIST_OPERATIONS = [
  { operation: 'addFirst', value: 'A', description: 'Adding "A" at the beginning' },
  { operation: 'addLast', value: 'B', description: 'Adding "B" at the end' },
  { operation: 'addLast', value: 'C', description: 'Adding "C" at the end' },
  { operation: 'addAfter', value: 'X', afterValue: 'A', description: 'Adding "X" after "A"' },
  { operation: 'removeFirst', description: 'Removing first element' }
]

// HashMap visualization data
const HASHMAP_OPERATIONS = [
  { operation: 'put', key: 'apple', value: 5, hash: 1, description: 'put("apple", 5)' },
  { operation: 'put', key: 'banana', value: 3, hash: 2, description: 'put("banana", 3)' },
  { operation: 'put', key: 'orange', value: 8, hash: 1, description: 'put("orange", 8) - collision!' },
  { operation: 'get', key: 'apple', description: 'get("apple")' },
  { operation: 'remove', key: 'banana', description: 'remove("banana")' }
]

export default function CollectionsVisualization() {
  const { state, setVisualizationData } = useApp()
  const [currentDemo, setCurrentDemo] = useState('arraylist')
  const [arrayListData, setArrayListData] = useState([])
  const [linkedListData, setLinkedListData] = useState([])
  const [hashMapData, setHashMapData] = useState({})
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const generateVisualizationSteps = useCallback((demo) => {
    const steps = []
    
    switch (demo) {
      case 'arraylist':
        steps.push({
          demo: 'arraylist',
          step: 0,
          description: 'ArrayList - Dynamic Array Implementation',
          operation: 'collections-demo',
          data: []
        })
        
        let currentArray = []
        ARRAYLIST_OPERATIONS.forEach((op, index) => {
          if (op.operation === 'add') {
            currentArray.push(op.value)
          } else if (op.operation === 'insert') {
            currentArray.splice(op.index, 0, op.value)
          } else if (op.operation === 'remove') {
            currentArray.splice(op.index, 1)
          }
          
          steps.push({
            demo: 'arraylist',
            step: index + 1,
            description: op.description,
            operation: 'collections-demo',
            data: [...currentArray],
            highlightIndex: op.operation === 'insert' ? op.index : op.operation === 'remove' ? op.index : currentArray.length - 1,
            operationType: op.operation
          })
        })
        break
        
      case 'linkedlist':
        steps.push({
          demo: 'linkedlist',
          step: 0,
          description: 'LinkedList - Doubly Linked List Implementation',
          operation: 'collections-demo',
          data: []
        })
        
        let currentList = []
        LINKEDLIST_OPERATIONS.forEach((op, index) => {
          if (op.operation === 'addFirst') {
            currentList.unshift(op.value)
          } else if (op.operation === 'addLast') {
            currentList.push(op.value)
          } else if (op.operation === 'addAfter') {
            const afterIndex = currentList.indexOf(op.afterValue)
            if (afterIndex !== -1) {
              currentList.splice(afterIndex + 1, 0, op.value)
            }
          } else if (op.operation === 'removeFirst') {
            currentList.shift()
          }
          
          steps.push({
            demo: 'linkedlist',
            step: index + 1,
            description: op.description,
            operation: 'collections-demo',
            data: [...currentList],
            operationType: op.operation,
            highlightValue: op.value || currentList[0]
          })
        })
        break
        
      case 'hashmap':
        steps.push({
          demo: 'hashmap',
          step: 0,
          description: 'HashMap - Hash Table Implementation',
          operation: 'collections-demo',
          data: {},
          buckets: Array(4).fill([])
        })
        
        let currentMap = {}
        let buckets = [[], [], [], []]
        
        HASHMAP_OPERATIONS.forEach((op, index) => {
          if (op.operation === 'put') {
            currentMap[op.key] = op.value
            const bucketIndex = op.hash % 4
            if (!buckets[bucketIndex].some(item => item.key === op.key)) {
              buckets[bucketIndex] = [...buckets[bucketIndex], { key: op.key, value: op.value }]
            } else {
              buckets[bucketIndex] = buckets[bucketIndex].map(item => 
                item.key === op.key ? { key: op.key, value: op.value } : item
              )
            }
          } else if (op.operation === 'remove') {
            delete currentMap[op.key]
            buckets = buckets.map(bucket => bucket.filter(item => item.key !== op.key))
          }
          
          steps.push({
            demo: 'hashmap',
            step: index + 1,
            description: op.description,
            operation: 'collections-demo',
            data: { ...currentMap },
            buckets: buckets.map(bucket => [...bucket]),
            operationType: op.operation,
            highlightKey: op.key,
            highlightBucket: op.operation === 'put' ? op.hash % 4 : undefined
          })
        })
        break
    }
    
    return steps
  }, [])

  const handleDemoChange = (demo) => {
    setCurrentDemo(demo)
    const steps = generateVisualizationSteps(demo)
    setVisualizationData(steps, `collections-${demo}`)
    
    // Reset data
    setArrayListData([])
    setLinkedListData([])
    setHashMapData({})
    setHighlightedIndex(-1)
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && state.visualizationContext?.startsWith('collections-')) {
      if (currentStep.demo === 'arraylist') {
        setArrayListData(currentStep.data || [])
        setHighlightedIndex(currentStep.highlightIndex ?? -1)
      } else if (currentStep.demo === 'linkedlist') {
        setLinkedListData(currentStep.data || [])
      } else if (currentStep.demo === 'hashmap') {
        setHashMapData(currentStep.data || {})
      }
    }
  }, [state.currentStep, state.visualizationData, state.visualizationContext])

  const renderArrayList = () => {
    const currentStep = state.visualizationData[state.currentStep]
    
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">ArrayList - Dynamic Array</h3>
        
        <div className="max-w-4xl mx-auto">
          {/* Array Visualization */}
          <div className="mb-6">
            <h5 className="font-semibold mb-3 text-center">Internal Array Structure</h5>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {Array(Math.max(8, arrayListData.length + 2)).fill(null).map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-12 h-12 border-2 flex items-center justify-center text-sm font-medium ${
                      index < arrayListData.length
                        ? index === highlightedIndex
                          ? 'bg-yellow-200 border-yellow-500'
                          : 'bg-blue-100 border-blue-300'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                    animate={{
                      scale: index === highlightedIndex ? 1.1 : 1,
                      backgroundColor: index === highlightedIndex ? '#fef3c7' : undefined
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {index < arrayListData.length ? arrayListData[index] : ''}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Index labels */}
            <div className="flex justify-center mt-1">
              <div className="flex space-x-1">
                {Array(Math.max(8, arrayListData.length + 2)).fill(null).map((_, index) => (
                  <div key={index} className="w-12 text-center text-xs text-gray-500">
                    {index}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Properties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold">Size</div>
              <div className="text-2xl text-blue-600">{arrayListData.length}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold">Capacity</div>
              <div className="text-2xl text-green-600">{Math.max(8, arrayListData.length + 2)}</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold">Time Complexity</div>
              <div className="text-sm text-purple-600">
                Add: O(1)*<br />
                Insert: O(n)<br />
                Access: O(1)
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
                currentStep.operationType === 'add' ? 'bg-green-100 text-green-800' :
                currentStep.operationType === 'insert' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentStep.operationType.toUpperCase()}
              </span>
            </motion.div>
          )}
          
          {/* Comprehensive ArrayList Education */}
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-gray-900 text-gray-100 rounded-lg">
              <h5 className="font-semibold text-yellow-400 mb-2">ArrayList Implementation Details:</h5>
              <pre className="text-sm overflow-x-auto">
                <code>{`// Simplified ArrayList implementation
public class ArrayList<E> implements List<E> {
    private static final int DEFAULT_CAPACITY = 10;
    private Object[] elementData;
    private int size;
    
    public ArrayList() {
        this.elementData = new Object[DEFAULT_CAPACITY];
    }
    
    public boolean add(E element) {
        ensureCapacity(size + 1);
        elementData[size++] = element;
        return true;
    }
    
    public void add(int index, E element) {
        rangeCheckForAdd(index);
        ensureCapacity(size + 1);
        
        // Shift elements to the right
        System.arraycopy(elementData, index, 
                        elementData, index + 1, 
                        size - index);
        elementData[index] = element;
        size++;
    }
    
    @SuppressWarnings("unchecked")
    public E get(int index) {
        rangeCheck(index);
        return (E) elementData[index];
    }
    
    public E remove(int index) {
        rangeCheck(index);
        E oldValue = (E) elementData[index];
        
        int numMoved = size - index - 1;
        if (numMoved > 0) {
            System.arraycopy(elementData, index + 1,
                           elementData, index, numMoved);
        }
        elementData[--size] = null; // Let GC work
        return oldValue;
    }
    
    private void ensureCapacity(int minCapacity) {
        if (minCapacity > elementData.length) {
            grow(minCapacity);
        }
    }
    
    private void grow(int minCapacity) {
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1); // 1.5x growth
        if (newCapacity < minCapacity) {
            newCapacity = minCapacity;
        }
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
}`}</code>
              </pre>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">✅ ArrayList Best Practices</h5>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• Initialize with estimated capacity: <code>new ArrayList&lt;&gt;(1000)</code></div>
                  <div>• Use enhanced for-loop for read-only iteration</div>
                  <div>• Prefer <code>addAll()</code> for bulk operations</div>
                  <div>• Use <code>trimToSize()</code> to reduce memory after bulk removal</div>
                  <div>• Consider <code>Vector</code> for thread-safe operations</div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-semibold text-yellow-800 mb-2">🔧 When to Use ArrayList</h5>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div><strong>✅ Good for:</strong></div>
                  <div>• Random access by index</div>
                  <div>• Adding elements at the end</div>
                  <div>• Iterating through all elements</div>
                  <div>• When size is relatively stable</div>
                  <div><strong>❌ Avoid for:</strong></div>
                  <div>• Frequent insertions/deletions in middle</div>
                  <div>• Unknown size with frequent growth</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2">🔍 ArrayList vs Array</h5>
              <div className="text-sm text-blue-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h6 className="font-semibold">Arrays:</h6>
                  <div>• Fixed size</div>
                  <div>• Better memory efficiency</div>
                  <div>• Primitive type support</div>
                  <div>• Direct memory access</div>
                </div>
                <div>
                  <h6 className="font-semibold">ArrayList:</h6>
                  <div>• Dynamic resizing</div>
                  <div>• Rich API methods</div>
                  <div>• Only object types</div>
                  <div>• Automatic memory management</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderLinkedList = () => {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">LinkedList - Doubly Linked List</h3>
        
        <div className="max-w-4xl mx-auto">
          {/* Linked List Visualization */}
          <div className="mb-6">
            <div className="flex justify-center items-center space-x-2 overflow-x-auto">
              {linkedListData.length === 0 ? (
                <div className="text-gray-500 italic">Empty List</div>
              ) : (
                <>
                  {/* Head pointer */}
                  <div className="text-sm text-gray-600">head</div>
                  <div className="text-sm text-gray-600">→</div>
                  
                  {linkedListData.map((value, index) => (
                    <div key={`${value}-${index}`} className="flex items-center space-x-2">
                      {/* Node */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex"
                      >
                        {/* Previous pointer */}
                        <div className="w-6 h-12 bg-gray-200 border border-gray-400 flex items-center justify-center text-xs">
                          ←
                        </div>
                        {/* Data */}
                        <div className="w-12 h-12 bg-green-100 border border-green-300 flex items-center justify-center font-medium">
                          {value}
                        </div>
                        {/* Next pointer */}
                        <div className="w-6 h-12 bg-gray-200 border border-gray-400 flex items-center justify-center text-xs">
                          →
                        </div>
                      </motion.div>
                      
                      {/* Arrow to next node */}
                      {index < linkedListData.length - 1 && (
                        <div className="text-gray-600">→</div>
                      )}
                    </div>
                  ))}
                  
                  {/* Tail pointer */}
                  {linkedListData.length > 0 && (
                    <>
                      <div className="text-sm text-gray-600">←</div>
                      <div className="text-sm text-gray-600">tail</div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Properties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold">Size</div>
              <div className="text-2xl text-green-600">{linkedListData.length}</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold">Memory</div>
              <div className="text-sm text-blue-600">
                Non-contiguous<br />
                Dynamic allocation
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold">Time Complexity</div>
              <div className="text-sm text-purple-600">
                Add First/Last: O(1)<br />
                Insert Middle: O(n)<br />
                Access: O(n)
              </div>
            </div>
          </div>

          {/* LinkedList vs ArrayList Comparison */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold mb-2">LinkedList Advantages:</h5>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Efficient insertion/deletion at beginning and end</li>
              <li>• Dynamic size without array copying</li>
              <li>• Good for frequent insertions/deletions</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const renderHashMap = () => {
    const currentStep = state.visualizationData[state.currentStep]
    const buckets = currentStep?.buckets || [[], [], [], []]
    
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">HashMap - Hash Table with Chaining</h3>
        
        <div className="max-w-4xl mx-auto">
          {/* Hash Table Visualization */}
          <div className="mb-6">
            <h5 className="font-semibold mb-3 text-center">Internal Bucket Array</h5>
            <div className="grid grid-cols-4 gap-2 max-w-2xl mx-auto">
              {buckets.map((bucket, bucketIndex) => (
                <motion.div
                  key={bucketIndex}
                  className={`border-2 rounded-lg p-3 min-h-[120px] ${
                    currentStep?.highlightBucket === bucketIndex 
                      ? 'border-yellow-500 bg-yellow-50' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  animate={{
                    borderColor: currentStep?.highlightBucket === bucketIndex ? '#f59e0b' : '#d1d5db'
                  }}
                >
                  <div className="text-center font-medium mb-2">Bucket {bucketIndex}</div>
                  <div className="space-y-1">
                    {bucket.length === 0 ? (
                      <div className="text-gray-400 text-xs text-center">empty</div>
                    ) : (
                      bucket.map((item, itemIndex) => (
                        <motion.div
                          key={`${item.key}-${itemIndex}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`p-2 rounded text-xs border ${
                            currentStep?.highlightKey === item.key
                              ? 'bg-yellow-200 border-yellow-400'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="font-medium">{item.key}</div>
                          <div className="text-gray-600">→ {item.value}</div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hash Function */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-semibold mb-2 text-blue-800">Hash Function</h5>
            <div className="text-sm text-blue-700">
              <code>bucketIndex = key.hashCode() % buckets.length</code>
              <div className="mt-2">
                {currentStep?.highlightKey && (
                  <div>
                    Current: "{currentStep.highlightKey}" → bucket {currentStep.highlightBucket}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Properties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="font-semibold">Size</div>
              <div className="text-2xl text-yellow-600">{Object.keys(hashMapData).length}</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="font-semibold">Load Factor</div>
              <div className="text-2xl text-red-600">
                {(Object.keys(hashMapData).length / 4).toFixed(2)}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold">Time Complexity</div>
              <div className="text-sm text-purple-600">
                Average: O(1)<br />
                Worst: O(n)<br />
                Space: O(n)
              </div>
            </div>
          </div>

          {/* Collision Handling */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold mb-2">Collision Handling: Chaining</h5>
            <div className="text-sm text-gray-700">
              When multiple keys hash to the same bucket, they are stored in a linked structure (chain) within that bucket.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Demo Selection */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-center space-x-2">
          {[
            { id: 'arraylist', label: 'ArrayList', icon: '📊' },
            { id: 'linkedlist', label: 'LinkedList', icon: '🔗' },
            { id: 'hashmap', label: 'HashMap', icon: '🗂️' }
          ].map(demo => (
            <button
              key={demo.id}
              onClick={() => handleDemoChange(demo.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentDemo === demo.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {demo.icon} {demo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Demo - Interactive Content First */}
      <div className="space-y-6">
        {currentDemo === 'arraylist' && renderArrayList()}
        {currentDemo === 'linkedlist' && renderLinkedList()}
        {currentDemo === 'hashmap' && renderHashMap()}
      </div>

      {/* Comprehensive Collections Education - Static Content Below */}
      <div className="mt-8 space-y-4">
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-3">Java Collections Framework Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">📋 Collection Hierarchy</h4>
              <div className="text-purple-700 space-y-1">
                <div><strong>Collection</strong> (interface)</div>
                <div className="ml-4">├── <strong>List</strong> - Ordered, allows duplicates</div>
                <div className="ml-8">├── ArrayList - Resizable array</div>
                <div className="ml-8">├── LinkedList - Doubly-linked list</div>
                <div className="ml-8">└── Vector - Synchronized ArrayList</div>
                <div className="ml-4">├── <strong>Set</strong> - No duplicates</div>
                <div className="ml-8">├── HashSet - Hash table</div>
                <div className="ml-8">└── TreeSet - Sorted set</div>
                <div className="ml-4">└── <strong>Queue</strong> - FIFO operations</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">🗺️ Map Hierarchy</h4>
              <div className="text-purple-700 space-y-1">
                <div><strong>Map</strong> (interface) - Key-value pairs</div>
                <div className="ml-4">├── <strong>HashMap</strong> - Hash table implementation</div>
                <div className="ml-4">├── <strong>TreeMap</strong> - Sorted by keys</div>
                <div className="ml-4">├── <strong>LinkedHashMap</strong> - Insertion order</div>
                <div className="ml-4">└── <strong>Hashtable</strong> - Synchronized HashMap</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🎯 Learning Objectives</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <ul className="space-y-1">
              <li>• Understand time complexity trade-offs</li>
              <li>• Choose appropriate data structures</li>
              <li>• Master iteration and manipulation</li>
            </ul>
            <ul className="space-y-1">
              <li>• Implement custom comparison logic</li>
              <li>• Handle hash collisions effectively</li>
              <li>• Use generics with collections safely</li>
            </ul>
            <ul className="space-y-1">
              <li>• Apply collections in real algorithms</li>
              <li>• Optimize for memory and performance</li>
              <li>• Understand concurrent collections</li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-semibold text-amber-800 mb-2">⚡ Performance Comparison</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Operation</th>
                  <th className="text-left p-2">ArrayList</th>
                  <th className="text-left p-2">LinkedList</th>
                  <th className="text-left p-2">HashMap</th>
                </tr>
              </thead>
              <tbody className="text-amber-700">
                <tr><td className="p-2">Access</td><td>O(1)</td><td>O(n)</td><td>O(1) avg</td></tr>
                <tr><td className="p-2">Insert (end)</td><td>O(1) amortized</td><td>O(1)</td><td>O(1) avg</td></tr>
                <tr><td className="p-2">Insert (middle)</td><td>O(n)</td><td>O(1)*</td><td>N/A</td></tr>
                <tr><td className="p-2">Delete</td><td>O(n)</td><td>O(1)*</td><td>O(1) avg</td></tr>
                <tr><td className="p-2">Search</td><td>O(n)</td><td>O(n)</td><td>O(1) avg</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-amber-600 mt-2">* If you have a reference to the node</p>
          </div>
        </div>
      </div>

      {/* Current Operation Description */}
      <AnimatePresence>
        {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && 
        state.visualizationContext?.startsWith('collections-') && (
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