import { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  currentAlgorithm: null,
  visualizationData: [],
  isPlaying: false,
  currentStep: 0,
  speed: 1,
  visualizationContext: null, // tracks which type of visualization is active
  visualizationSettings: {
    showCode: true,
    showComplexity: true,
    animationEnabled: true
  }
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ALGORITHM':
      return {
        ...state,
        currentAlgorithm: action.payload,
        currentStep: 0,
        isPlaying: false
      }
    case 'SET_VISUALIZATION_DATA':
      return {
        ...state,
        visualizationData: action.payload,
        currentStep: 0,
        visualizationContext: action.context || state.visualizationContext
      }
    case 'PLAY_PAUSE':
      return {
        ...state,
        isPlaying: !state.isPlaying
      }
    case 'STEP_FORWARD':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.visualizationData.length - 1)
      }
    case 'STEP_BACKWARD':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0)
      }
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload
      }
    case 'SET_SPEED':
      return {
        ...state,
        speed: action.payload
      }
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        visualizationSettings: {
          ...state.visualizationSettings,
          ...action.payload
        }
      }
    case 'RESET':
      return {
        ...state,
        currentStep: 0,
        isPlaying: false
      }
    case 'CLEAR_DATA':
      return {
        ...state,
        visualizationData: [],
        currentStep: 0,
        isPlaying: false,
        visualizationContext: null
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = {
    state,
    dispatch,
    setAlgorithm: (algorithm) => dispatch({ type: 'SET_ALGORITHM', payload: algorithm }),
    setVisualizationData: (data, context) => dispatch({ type: 'SET_VISUALIZATION_DATA', payload: data, context }),
    playPause: () => dispatch({ type: 'PLAY_PAUSE' }),
    stepForward: () => dispatch({ type: 'STEP_FORWARD' }),
    stepBackward: () => dispatch({ type: 'STEP_BACKWARD' }),
    setStep: (step) => dispatch({ type: 'SET_STEP', payload: step }),
    setSpeed: (speed) => dispatch({ type: 'SET_SPEED', payload: speed }),
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    reset: () => dispatch({ type: 'RESET' }),
    clearData: () => dispatch({ type: 'CLEAR_DATA' })
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}