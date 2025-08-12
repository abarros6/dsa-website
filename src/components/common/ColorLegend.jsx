export default function ColorLegend({ colors }) {
  return (
    <div className="flex justify-center space-x-6 text-xs mb-6 flex-wrap">
      {colors.map((color, index) => (
        <div key={index} className="flex items-center space-x-1">
          <div 
            className="w-3 h-3 rounded" 
            style={{ backgroundColor: color.color }}
          ></div>
          <span>{color.label}</span>
        </div>
      ))}
    </div>
  )
}