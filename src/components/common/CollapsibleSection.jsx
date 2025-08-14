import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false, 
  bgColor = "bg-blue-50", 
  borderColor = "border-blue-200", 
  titleColor = "text-blue-800" 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`p-4 ${bgColor} border ${borderColor} rounded-lg`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left hover:opacity-75 transition-opacity"
      >
        <h3 className={`font-semibold ${titleColor}`}>{title}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={titleColor}
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
            <div className="mt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}