import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import ConditionalControlPanel from '../components/ConditionalControlPanel'
import BubbleSortVisualization from '../components/visualizations/BubbleSortVisualizationClean'
import SelectionSortVisualization from '../components/visualizations/SelectionSortVisualizationClean'
import InsertionSortVisualization from '../components/visualizations/InsertionSortVisualizationClean'
import MergeSortVisualization from '../components/visualizations/MergeSortVisualizationClean'
import QuickSortVisualization from '../components/visualizations/QuickSortVisualizationClean'
import LinearSearchVisualization from '../components/visualizations/LinearSearchVisualization'
import BinarySearchVisualization from '../components/visualizations/BinarySearchVisualization'
import HashSearchVisualization from '../components/visualizations/HashSearchVisualization'
import TopicOverviewGrid from '../components/common/TopicOverviewGrid'
import BreadcrumbNavigation from '../components/common/BreadcrumbNavigation'
import PseudocodeDisplay from '../components/common/PseudocodeDisplay'
import ComparisonTable from '../components/common/ComparisonTable'
import EducationalContent from '../components/common/EducationalContent'

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

      <TopicOverviewGrid topics={topics} />
    </div>
  )
}

function getSearchPseudocode(algorithm) {
  const pseudocodes = {
    linear: `function linearSearch(array, target):
    for i = 0 to length(array)-1:
        if array[i] == target:
            return i
    return -1  // Not found`,
    
    binary: `function binarySearch(sortedArray, target):
    left = 0
    right = length(sortedArray) - 1
    
    while left <= right:
        mid = (left + right) / 2
        
        if sortedArray[mid] == target:
            return mid
        else if sortedArray[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  // Not found`,
    
    hash: `function hashSearch(hashTable, target):
    hashValue = hashFunction(target)
    
    if hashTable[hashValue] == target:
        return hashValue
    else:
        // Handle collision resolution
        return handleCollision(hashTable, target, hashValue)

function hashFunction(key):
    return key % tableSize

function handleCollision(table, key, index):
    // Linear probing example
    while table[index] != null and table[index] != key:
        index = (index + 1) % tableSize
    
    if table[index] == key:
        return index
    return -1  // Not found`
  }
  
  return pseudocodes[algorithm] || 'Pseudocode not available'
}

function SearchingAlgorithms() {
  const [currentAlgorithm, setCurrentAlgorithm] = useState('linear')
  const { clearData } = useApp()

  const handleAlgorithmChange = (newAlgorithm) => {
    if (newAlgorithm !== currentAlgorithm) {
      clearData()
      setCurrentAlgorithm(newAlgorithm)
    }
  }

  const searchingAlgorithms = [
    {
      id: 'linear',
      title: 'Linear Search',
      description: 'Sequential search through elements - O(n)',
      icon: '🔍',
      complexity: 'O(n)',
      component: LinearSearchVisualization
    },
    {
      id: 'binary',
      title: 'Binary Search',
      description: 'Divide and conquer on sorted arrays - O(log n)',
      icon: '🎯',
      complexity: 'O(log n)',
      component: BinarySearchVisualization
    },
    {
      id: 'hash',
      title: 'Hash Search',
      description: 'Direct access using hash function - O(1)',
      icon: '#️⃣',
      complexity: 'O(1)',
      component: HashSearchVisualization
    }
  ]

  const CurrentComponent = searchingAlgorithms.find(alg => alg.id === currentAlgorithm)?.component
  const currentAlgorithmInfo = searchingAlgorithms.find(alg => alg.id === currentAlgorithm)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Searching Algorithms</h1>
        <p className="text-lg text-gray-600">
          Compare and understand different search algorithms through interactive visualizations.
        </p>
      </div>

      {/* Algorithm Selection */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {searchingAlgorithms.map((algorithm) => (
            <button
              key={algorithm.id}
              onClick={() => handleAlgorithmChange(algorithm.id)}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 min-w-0 ${
                currentAlgorithm === algorithm.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-3xl mb-2">{algorithm.icon}</span>
              <div className="text-center">
                <div className="font-semibold text-sm mb-1">{algorithm.title}</div>
                <div className="text-xs opacity-75 mb-2 leading-tight">{algorithm.description}</div>
                <span className={`text-xs px-2 py-1 rounded ${
                  algorithm.complexity.includes('n') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {algorithm.complexity}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Visualization */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentAlgorithmInfo?.title}
          </h2>
          <p className="text-gray-600 mt-1">{currentAlgorithmInfo?.description}</p>
        </div>
        
        <div className="min-h-[400px]">
          {CurrentComponent && <CurrentComponent />}
        </div>
      </div>

      {/* Control Panel */}
      <ConditionalControlPanel forceHide={currentAlgorithm === 'hash'} />

      {/* Pseudocode Section */}
      {currentAlgorithmInfo && (
        <div className="card">
          <PseudocodeDisplay
            title={currentAlgorithmInfo.title}
            pseudocode={getSearchPseudocode(currentAlgorithm)}
          />
        </div>
      )}

      {/* Algorithm Comparison Table */}
      <ComparisonTable
        title="Algorithm Comparison"
        headers={['Algorithm', 'Time Complexity', 'Space Complexity', 'Prerequisites', 'Best Use Case']}
        rows={[
          ['Linear Search', 'O(n)', 'O(1)', 'None', 'Unsorted data, simple implementation'],
          ['Binary Search', 'O(log n)', 'O(1)', 'Sorted array', 'Large sorted datasets'],
          ['Hash Search', 'O(1) avg / O(n) worst', 'O(n)', 'Hash function, table', 'Fast lookups, frequent searches']
        ]}
      />

      {/* Key Concepts */}
      <EducationalContent
        leftContent={{
          title: "Key Concepts",
          content: (
            <>
              <div>
                <span className="font-medium text-blue-600">Linear Search:</span>
                <span className="text-gray-600 ml-2">Check each element sequentially</span>
              </div>
              <div>
                <span className="font-medium text-purple-600">Binary Search:</span>
                <span className="text-gray-600 ml-2">Divide search space in half each step</span>
              </div>
              <div>
                <span className="font-medium text-green-600">Hash Search:</span>
                <span className="text-gray-600 ml-2">Direct access using computed index</span>
              </div>
              <div>
                <span className="font-medium text-orange-600">Collision Resolution:</span>
                <span className="text-gray-600 ml-2">Handle hash function conflicts</span>
              </div>
            </>
          )
        }}
        rightContent={{
          title: "When to Use Each Algorithm",
          content: (
            <div className="space-y-2">
              <div>• <strong>Unsorted data:</strong> Linear Search</div>
              <div>• <strong>Large sorted arrays:</strong> Binary Search</div>
              <div>• <strong>Frequent lookups:</strong> Hash Table</div>
              <div>• <strong>Memory constrained:</strong> Binary Search</div>
              <div>• <strong>Simple implementation:</strong> Linear Search</div>
              <div>• <strong>Worst-case guarantee:</strong> Binary Search</div>
            </div>
          )
        }}
      />
    </div>
  )
}

function getSortingPseudocode(algorithm) {
  const pseudocodes = {
    bubble: `function bubbleSort(array):
    n = length(array)
    for i = 0 to n-1:
        swapped = false
        for j = 0 to n-i-2:
            if array[j] > array[j+1]:
                swap(array[j], array[j+1])
                swapped = true
        if not swapped:
            break
    return array`,
    
    selection: `function selectionSort(array):
    n = length(array)
    for i = 0 to n-1:
        minIndex = i
        for j = i+1 to n-1:
            if array[j] < array[minIndex]:
                minIndex = j
        if minIndex != i:
            swap(array[i], array[minIndex])
    return array`,
    
    insertion: `function insertionSort(array):
    for i = 1 to length(array)-1:
        key = array[i]
        j = i - 1
        while j >= 0 and array[j] > key:
            array[j+1] = array[j]
            j = j - 1
        array[j+1] = key
    return array`,
    
    merge: `function mergeSort(array):
    if length(array) <= 1:
        return array
    
    mid = length(array) / 2
    left = mergeSort(array[0...mid-1])
    right = mergeSort(array[mid...end])
    
    return merge(left, right)

function merge(left, right):
    result = []
    i = 0, j = 0
    
    while i < length(left) and j < length(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i = i + 1
        else:
            result.append(right[j])
            j = j + 1
    
    while i < length(left):
        result.append(left[i])
        i = i + 1
    
    while j < length(right):
        result.append(right[j])
        j = j + 1
    
    return result`,
    
    quick: `function quickSort(array, low, high):
    if low < high:
        pivotIndex = partition(array, low, high)
        quickSort(array, low, pivotIndex - 1)
        quickSort(array, pivotIndex + 1, high)

function partition(array, low, high):
    pivot = array[high]
    i = low - 1
    
    for j = low to high-1:
        if array[j] <= pivot:
            i = i + 1
            swap(array[i], array[j])
    
    swap(array[i+1], array[high])
    return i + 1`
  }
  
  return pseudocodes[algorithm] || 'Pseudocode not available'
}

function SortingAlgorithms() {
  const [currentAlgorithm, setCurrentAlgorithm] = useState('bubble')
  const { clearData } = useApp()

  const handleAlgorithmChange = (newAlgorithm) => {
    if (newAlgorithm !== currentAlgorithm) {
      clearData()
      setCurrentAlgorithm(newAlgorithm)
    }
  }

  const sortingAlgorithms = [
    {
      id: 'bubble',
      title: 'Bubble Sort',
      description: 'Adjacent element swapping - O(n²)',
      icon: '🫧',
      complexity: 'O(n²)',
      stable: true,
      component: BubbleSortVisualization
    },
    {
      id: 'selection',
      title: 'Selection Sort',
      description: 'Find minimum and place at beginning - O(n²)',
      icon: '🎯',
      complexity: 'O(n²)',
      stable: false,
      component: SelectionSortVisualization
    },
    {
      id: 'insertion',
      title: 'Insertion Sort',
      description: 'Insert elements into sorted portion - O(n²)',
      icon: '🔄',
      complexity: 'O(n²)',
      stable: true,
      component: InsertionSortVisualization
    },
    {
      id: 'merge',
      title: 'Merge Sort',
      description: 'Divide and conquer approach - O(n log n)',
      icon: '🔀',
      complexity: 'O(n log n)',
      stable: true,
      component: MergeSortVisualization
    },
    {
      id: 'quick',
      title: 'Quick Sort',
      description: 'Partition around pivot - O(n log n) avg',
      icon: '⚡',
      complexity: 'O(n log n)',
      stable: false,
      component: QuickSortVisualization
    }
  ]

  const CurrentComponent = sortingAlgorithms.find(alg => alg.id === currentAlgorithm)?.component
  const currentAlgorithmInfo = sortingAlgorithms.find(alg => alg.id === currentAlgorithm)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sorting Algorithms</h1>
        <p className="text-lg text-gray-600">
          Compare and understand different sorting algorithms through interactive visualizations.
        </p>
      </div>

      {/* Algorithm Selection */}
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {sortingAlgorithms.map((algorithm) => (
            <button
              key={algorithm.id}
              onClick={() => handleAlgorithmChange(algorithm.id)}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 min-w-0 ${
                currentAlgorithm === algorithm.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-3xl mb-2">{algorithm.icon}</span>
              <div className="text-center">
                <div className="font-semibold text-sm mb-1">{algorithm.title}</div>
                <div className="text-xs opacity-75 mb-2 leading-tight">{algorithm.description}</div>
                <div className="flex flex-wrap justify-center gap-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    algorithm.complexity.includes('n²') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {algorithm.complexity}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    algorithm.stable ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {algorithm.stable ? 'Stable' : 'Unstable'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Visualization */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentAlgorithmInfo?.title}
          </h2>
          <p className="text-gray-600 mt-1">{currentAlgorithmInfo?.description}</p>
        </div>
        
        <div className="min-h-[400px]">
          {CurrentComponent && <CurrentComponent />}
        </div>
      </div>

      {/* Control Panel */}
      <ConditionalControlPanel />

      {/* Pseudocode Section */}
      {currentAlgorithmInfo && (
        <div className="card">
          <PseudocodeDisplay
            title={currentAlgorithmInfo.title}
            pseudocode={getSortingPseudocode(currentAlgorithm)}
          />
        </div>
      )}

      {/* Algorithm Comparison Table */}
      <ComparisonTable
        title="Algorithm Comparison"
        headers={['Algorithm', 'Time Complexity', 'Space Complexity', 'Stable', 'Best Use Case']}
        rows={[
          ['Bubble Sort', 'O(n²) / O(n) best', 'O(1)', '✅ Yes', 'Educational, nearly sorted data'],
          ['Selection Sort', 'O(n²) all cases', 'O(1)', '❌ No', 'Memory constrained, minimize swaps'],
          ['Insertion Sort', 'O(n²) / O(n) best', 'O(1)', '✅ Yes', 'Small datasets, nearly sorted'],
          ['Merge Sort', 'O(n log n) all cases', 'O(n)', '✅ Yes', 'Large datasets, stable sorting needed'],
          ['Quick Sort', 'O(n log n) avg / O(n²) worst', 'O(log n)', '❌ No', 'General purpose, average case important']
        ]}
      />

      {/* Key Concepts */}
      <EducationalContent
        leftContent={{
          title: "Key Concepts",
          content: (
            <>
              <div>
                <span className="font-medium text-blue-600">Time Complexity:</span>
                <span className="text-gray-600 ml-2">How execution time scales with input size</span>
              </div>
              <div>
                <span className="font-medium text-purple-600">Space Complexity:</span>
                <span className="text-gray-600 ml-2">Extra memory required by the algorithm</span>
              </div>
              <div>
                <span className="font-medium text-green-600">Stability:</span>
                <span className="text-gray-600 ml-2">Preserves relative order of equal elements</span>
              </div>
              <div>
                <span className="font-medium text-orange-600">In-place:</span>
                <span className="text-gray-600 ml-2">Sorts without using extra memory</span>
              </div>
            </>
          )
        }}
        rightContent={{
          title: "When to Use Each Algorithm",
          content: (
            <div className="space-y-2">
              <div>• <strong>Small datasets (n &lt; 50):</strong> Insertion Sort</div>
              <div>• <strong>Memory limited:</strong> Selection Sort or Insertion Sort</div>
              <div>• <strong>Nearly sorted data:</strong> Insertion Sort or Bubble Sort</div>
              <div>• <strong>Stability required:</strong> Merge Sort or Insertion Sort</div>
              <div>• <strong>General purpose:</strong> Quick Sort or Merge Sort</div>
              <div>• <strong>Worst-case guarantee:</strong> Merge Sort</div>
            </div>
          )
        }}
      />
    </div>
  )
}


export default function Algorithms() {
  const location = useLocation()
  const isRootPath = location.pathname === '/algorithms' || location.pathname === '/algorithms/'

  return (
    <div>
      {!isRootPath && (
        <BreadcrumbNavigation backTo="/algorithms" backLabel="Algorithms" />
      )}
      
      <Routes>
        <Route path="/" element={<TopicOverview />} />
        <Route path="/searching" element={<SearchingAlgorithms />} />
        <Route path="/sorting" element={<SortingAlgorithms />} />
      </Routes>
    </div>
  )
}