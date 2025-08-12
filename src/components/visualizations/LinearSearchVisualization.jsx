import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../../contexts/AppContext'
import SearchControls from '../common/SearchControls'
import ArrayVisualization from '../common/ArrayVisualization'
import SearchStats from '../common/SearchStats'
import ColorLegend from '../common/ColorLegend'
import StepDescription from '../common/StepDescription'

const SEARCH_COLORS = {
  default: '#6b7280',
  current: '#3b82f6',
  found: '#10b981',
  notFound: '#ef4444',
  target: '#f59e0b'
}

export default function LinearSearchVisualization() {
  const { state, setVisualizationData } = useApp()
  const [array, setArray] = useState([34, 7, 23, 32, 5, 62, 32, 12, 9, 45])
  const [target, setTarget] = useState(32)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [foundIndex, setFoundIndex] = useState(-1)
  const [comparisons, setComparisons] = useState(0)
  const [searchComplete, setSearchComplete] = useState(false)

  const generateLinearSearchSteps = useCallback((inputArray, searchTarget) => {
    if (!Array.isArray(inputArray) || inputArray.length === 0) {
      return []
    }

    const steps = []
    const workingArray = Array.from(inputArray)
    let totalComparisons = 0
    let foundAt = -1

    steps.push({
      array: Array.from(workingArray),
      target: searchTarget,
      currentIndex: -1,
      foundIndex: -1,
      comparisons: 0,
      searchComplete: false,
      description: `Starting Linear Search for ${searchTarget} in array of ${workingArray.length} elements`,
      operation: 'start'
    })

    for (let i = 0; i < workingArray.length; i++) {
      totalComparisons++
      
      steps.push({
        array: Array.from(workingArray),
        target: searchTarget,
        currentIndex: i,
        foundIndex: -1,
        comparisons: totalComparisons,
        searchComplete: false,
        description: `Checking element ${workingArray[i]} at index ${i}`,
        operation: 'compare'
      })

      if (workingArray[i] === searchTarget) {
        foundAt = i
        steps.push({
          array: Array.from(workingArray),
          target: searchTarget,
          currentIndex: i,
          foundIndex: i,
          comparisons: totalComparisons,
          searchComplete: true,
          description: `Found ${searchTarget} at index ${i}! Search completed in ${totalComparisons} comparisons`,
          operation: 'found'
        })
        break
      } else {
        steps.push({
          array: Array.from(workingArray),
          target: searchTarget,
          currentIndex: i,
          foundIndex: -1,
          comparisons: totalComparisons,
          searchComplete: false,
          description: `${workingArray[i]} ≠ ${searchTarget}, continue searching...`,
          operation: 'not-match'
        })
      }
    }

    if (foundAt === -1) {
      steps.push({
        array: Array.from(workingArray),
        target: searchTarget,
        currentIndex: -1,
        foundIndex: -1,
        comparisons: totalComparisons,
        searchComplete: true,
        description: `${searchTarget} not found in array. Searched all ${workingArray.length} elements`,
        operation: 'not-found'
      })
    }

    return steps
  }, [])

  const handleSearch = () => {
    if (!Array.isArray(array) || array.length === 0) {
      return
    }
    
    try {
      const steps = generateLinearSearchSteps(array, target)
      setVisualizationData(steps, 'search-linear')
    } catch (error) {
      console.error('Error generating search steps:', error)
    }
  }

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))
    setArray(newArray)
    setTarget(newArray[Math.floor(Math.random() * newArray.length)])
  }

  const generateRandomTarget = () => {
    if (Math.random() > 0.5 && array.length > 0) {
      setTarget(array[Math.floor(Math.random() * array.length)])
    } else {
      setTarget(Math.floor(Math.random() * 100))
    }
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && Array.isArray(currentStep.array)) {
      setArray(currentStep.array)
      setTarget(currentStep.target || target)
      setCurrentIndex(currentStep.currentIndex || -1)
      setFoundIndex(currentStep.foundIndex || -1)
      setComparisons(currentStep.comparisons || 0)
      setSearchComplete(currentStep.searchComplete || false)
    }
  }, [state.currentStep, state.visualizationData, target])

  const getBarColor = (index) => {
    if (foundIndex === index) return SEARCH_COLORS.found
    if (currentIndex === index) return SEARCH_COLORS.current
    if (searchComplete && foundIndex === -1) return SEARCH_COLORS.notFound
    return SEARCH_COLORS.default
  }

  return (
    <div className="w-full">
      <SearchControls
        target={target}
        onTargetChange={setTarget}
        onSearch={handleSearch}
        onRandomArray={generateRandomArray}
        onRandomTarget={generateRandomTarget}
        searchLabel="Start Linear Search"
      />

      <ArrayVisualization array={array} getBarColor={getBarColor} />

      <SearchStats
        target={target}
        currentIndex={currentIndex}
        comparisons={comparisons}
        foundIndex={foundIndex}
        searchComplete={searchComplete}
      />

      <ColorLegend
        colors={[
          { color: SEARCH_COLORS.current, label: 'Current' },
          { color: SEARCH_COLORS.found, label: 'Found' },
          { color: SEARCH_COLORS.default, label: 'Unchecked' }
        ]}
      />

      <StepDescription context="search-linear" />
    </div>
  )
}