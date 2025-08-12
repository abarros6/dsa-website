import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import JavaOOPReview from './pages/JavaOOPReview'
import DataStructures from './pages/DataStructures'
import AlgorithmAnalysis from './pages/AlgorithmAnalysis'
import Algorithms from './pages/Algorithms'
import { AppProvider } from './contexts/AppContext'

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/java-oop/*" element={<JavaOOPReview />} />
            <Route path="/data-structures/*" element={<DataStructures />} />
            <Route path="/algorithm-analysis/*" element={<AlgorithmAnalysis />} />
            <Route path="/algorithms/*" element={<Algorithms />} />
          </Routes>
        </main>
      </div>
    </AppProvider>
  )
}

export default App