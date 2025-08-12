import { motion } from 'framer-motion'

export default function ArrayVisualization({ array, getBarColor }) {
  if (!Array.isArray(array) || array.length === 0) {
    return (
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No data to display</p>
        </div>
      </div>
    )
  }

  const maxValue = Math.max(...array)

  return (
    <div className="flex justify-center mb-6">
      <div className="flex items-end space-x-1 p-4 bg-white rounded-lg shadow-sm">
        {array.map((value, index) => (
          <motion.div key={`bar-${index}`} className="flex flex-col items-center">
            <div
              className="w-10 rounded-t-md flex items-end justify-center text-white text-xs font-semibold pb-1"
              style={{
                height: `${(value / maxValue) * 150 + 30}px`,
                backgroundColor: getBarColor(index)
              }}
            >
              {value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{index}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}