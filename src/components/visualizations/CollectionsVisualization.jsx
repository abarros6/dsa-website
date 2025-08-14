import { useState } from 'react'
import { motion } from 'framer-motion'
import Quiz from '../Quiz'
import CollapsibleSection from '../common/CollapsibleSection'

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

// Collections Framework Quiz Questions
const COLLECTIONS_QUIZ_QUESTIONS = [
  {
    type: 'multiple-choice',
    question: 'What is the time complexity for accessing an element by index in an ArrayList?',
    options: [
      'O(1) - Constant time',
      'O(log n) - Logarithmic time',
      'O(n) - Linear time', 
      'O(n²) - Quadratic time'
    ],
    correctAnswer: 0,
    explanation: 'ArrayList is backed by an array, so accessing an element by index is O(1) constant time since arrays provide direct access to elements via indexing.'
  },
  {
    type: 'multiple-choice',
    question: 'Which collection is best for frequent insertions and deletions in the middle of the list?',
    options: [
      'ArrayList',
      'LinkedList',
      'Vector',
      'Stack'
    ],
    correctAnswer: 1,
    explanation: 'LinkedList is optimal for frequent insertions/deletions in the middle because it only requires updating node references (O(1) if you have the reference), while ArrayList requires shifting elements (O(n)).'
  },
  {
    type: 'code-output',
    question: 'What will be the output of this code?',
    code: `HashMap<String, Integer> map = new HashMap<>();
map.put("apple", 5);
map.put("banana", 3);
map.put("apple", 8);
System.out.println(map.get("apple"));`,
    options: [
      '5',
      '8',
      '13',
      'null'
    ],
    correctAnswer: 1,
    explanation: 'HashMap stores key-value pairs where keys are unique. When "apple" is added again with value 8, it overwrites the previous value 5, so the output is 8.'
  },
  {
    type: 'multiple-select',
    question: 'Which statements about HashMap are true? (Select all that apply)',
    options: [
      'Allows null keys and values',
      'Maintains insertion order',
      'Uses hash codes for fast lookups',
      'Thread-safe by default'
    ],
    correctAnswers: [0, 2],
    explanation: 'HashMap allows null keys and values, and uses hash codes for O(1) average lookups. It does NOT maintain insertion order (LinkedHashMap does) and is NOT thread-safe (Hashtable/ConcurrentHashMap are).'
  },
  {
    type: 'multiple-choice',
    question: 'What happens when ArrayList reaches its capacity and needs to grow?',
    options: [
      'Throws an OutOfMemoryError',
      'Creates a new array 1.5x the size and copies elements',
      'Converts to a LinkedList automatically',
      'Removes the oldest elements to make space'
    ],
    correctAnswer: 1,
    explanation: 'ArrayList grows by creating a new array approximately 1.5 times the current size and copying all existing elements to the new array. This amortizes the cost of resizing.'
  },
  {
    type: 'true-false',
    question: 'LinkedList in Java implements both List and Deque interfaces.',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation: 'True. LinkedList implements both List and Deque interfaces, allowing it to function as a list, stack, or queue with efficient operations at both ends.'
  },
  {
    type: 'multiple-choice',
    question: 'Which factor most affects HashMap performance?',
    options: [
      'The number of elements stored',
      'The load factor and hash function quality',
      'The size of keys and values',
      'The order of insertion'
    ],
    correctAnswer: 1,
    explanation: 'HashMap performance depends on load factor (ratio of elements to buckets) and hash function quality. Poor hash distribution causes clustering, degrading performance from O(1) to O(n).'
  },
  {
    type: 'multiple-choice',
    question: 'What is the primary trade-off when choosing LinkedList over ArrayList?',
    options: [
      'Memory usage vs. thread safety',
      'Memory usage vs. insertion/deletion speed',
      'Random access speed vs. insertion/deletion speed',
      'Type safety vs. performance'
    ],
    correctAnswer: 2,
    explanation: 'The main trade-off is random access speed (ArrayList O(1) vs LinkedList O(n)) versus insertion/deletion speed (ArrayList O(n) vs LinkedList O(1) with reference).'
  }
]

export default function CollectionsVisualization() {
  const [currentDemo, setCurrentDemo] = useState('arraylist')
  const [arrayListData, setArrayListData] = useState(['A', 'B', 'C'])
  const [linkedListData, setLinkedListData] = useState(['A', 'B', 'C'])
  const [hashMapData, setHashMapData] = useState({ apple: 5, banana: 3, orange: 8 })
  const [highlightedIndex, setHighlightedIndex] = useState(-1)


  const handleDemoChange = (demo) => {
    setCurrentDemo(demo)
    setHighlightedIndex(-1)
  }


  const renderArrayList = () => {
    
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
    // Static demonstration buckets
    const buckets = [
      [{ key: 'apple', value: 5 }],
      [],
      [{ key: 'banana', value: 3 }],
      [{ key: 'orange', value: 8 }]
    ]
    
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
                  className="border-2 border-gray-300 bg-gray-50 rounded-lg p-3 min-h-[120px]"
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
                          className="p-2 rounded text-xs border bg-white border-gray-200"
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
                Example: "apple" → bucket 0, "banana" → bucket 2
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
      {/* Demo Selection with Quiz Tab */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-center space-x-2 flex-wrap">
          {[
            { id: 'arraylist', label: 'ArrayList', icon: '📊', type: 'demo' },
            { id: 'linkedlist', label: 'LinkedList', icon: '🔗', type: 'demo' },
            { id: 'hashmap', label: 'HashMap', icon: '🗂️', type: 'demo' },
            { id: 'quiz', label: 'Knowledge Quiz', icon: '🧠', type: 'quiz' }
          ].map(demo => (
            <button
              key={demo.id}
              onClick={() => demo.type === 'quiz' ? setCurrentDemo('quiz') : handleDemoChange(demo.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentDemo === demo.id
                  ? demo.type === 'quiz'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                    : 'bg-blue-500 text-white'
                  : demo.type === 'quiz'
                  ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 hover:from-orange-200 hover:to-red-200 border-2 border-orange-300 animate-pulse'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } ${demo.type === 'quiz' ? 'relative overflow-hidden' : ''}`}
            >
              {demo.type === 'quiz' && currentDemo !== 'quiz' && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-20 animate-ping"></div>
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
        {currentDemo === 'arraylist' && renderArrayList()}
        {currentDemo === 'linkedlist' && renderLinkedList()}
        {currentDemo === 'hashmap' && renderHashMap()}
        {currentDemo === 'quiz' && (
          <div className="card">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🧠 Collections Framework Knowledge Quiz
              </h2>
              <p className="text-gray-600">
                Test your understanding of ArrayList, LinkedList, HashMap, and their performance characteristics with this comprehensive assessment.
              </p>
            </div>
            
            <Quiz
              title="Java Collections Framework Mastery"
              questions={COLLECTIONS_QUIZ_QUESTIONS}
              onComplete={(results) => {
                console.log('Collections Quiz completed:', results)
              }}
              showResults={true}
              allowRetake={true}
            />
          </div>
        )}
      </div>

      {/* Comprehensive Collections Education - Static Content Below */}
      <div className="mt-8 space-y-4">
        <CollapsibleSection 
          title="Java Collections Framework Architecture" 
          bgColor="bg-purple-50" 
          borderColor="border-purple-200" 
          titleColor="text-purple-800"
        >
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
        </CollapsibleSection>
        
        <CollapsibleSection 
          title="🎯 Learning Objectives" 
          bgColor="bg-blue-50" 
          borderColor="border-blue-200" 
          titleColor="text-blue-800"
        >
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
        </CollapsibleSection>
        
        <CollapsibleSection 
          title="⚡ Performance Comparison" 
          bgColor="bg-amber-50" 
          borderColor="border-amber-200" 
          titleColor="text-amber-800"
        >
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
        </CollapsibleSection>
      </div>

    </div>
  )
}