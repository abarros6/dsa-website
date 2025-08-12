export default function SearchStats({ 
  target, 
  currentIndex, 
  comparisons, 
  foundIndex, 
  searchComplete,
  additionalStats = [] 
}) {
  return (
    <div className="flex justify-center space-x-8 text-sm mb-4 flex-wrap">
      <span>Target: <span className="font-semibold text-yellow-600">{target}</span></span>
      <span>Current Index: {currentIndex >= 0 ? currentIndex : '-'}</span>
      <span>Comparisons: {comparisons}</span>
      {additionalStats.map((stat, index) => (
        <span key={index}>{stat.label}: {stat.value}</span>
      ))}
      <span className={`font-semibold ${foundIndex >= 0 ? 'text-green-600' : searchComplete ? 'text-red-600' : 'text-gray-600'}`}>
        Status: {foundIndex >= 0 ? `Found at index ${foundIndex}` : searchComplete ? 'Not Found' : 'Searching...'}
      </span>
    </div>
  )
}