export default function AlgorithmSelector({ 
  items, 
  currentItem, 
  onItemChange, 
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" 
}) {
  return (
    <div className={`grid ${gridCols} gap-4`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onItemChange(item.id)}
          className={`flex items-center space-x-3 px-4 py-4 rounded-lg border-2 transition-all duration-200 min-w-0 ${
            currentItem === item.id
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span className="text-xl flex-shrink-0">{item.icon}</span>
          <div className="text-left min-w-0 flex-1">
            <div className="font-semibold text-sm leading-tight">{item.title}</div>
            <div className="text-xs opacity-75 leading-tight">{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  )
}