import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PseudocodeDisplay({ title, pseudocode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-6 card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left hover:bg-gray-50 -m-6 p-6 rounded-lg transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">
          {title} - Pseudocode
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{pseudocode}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}