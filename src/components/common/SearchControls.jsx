export default function SearchControls({ 
  target, 
  onTargetChange, 
  onSearch, 
  onRandomArray, 
  onRandomTarget, 
  searchLabel = "Start Search" 
}) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="target" className="text-sm font-medium">
            Search for:
          </label>
          <input
            id="target"
            type="number"
            value={target}
            onChange={(e) => onTargetChange(parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 border rounded-md text-center"
          />
        </div>
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {searchLabel}
        </button>
        <button
          onClick={onRandomArray}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Random Array
        </button>
        <button
          onClick={onRandomTarget}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          Random Target
        </button>
      </div>
    </div>
  )
}