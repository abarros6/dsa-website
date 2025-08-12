export default function VisualizationControls({ 
  children, 
  className = 'mb-6 p-4 bg-gray-50 rounded-lg' 
}) {
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-4">
        {children}
      </div>
    </div>
  )
}

// Common button component
export function ControlButton({ 
  onClick, 
  disabled = false, 
  variant = 'primary',
  children,
  className = ''
}) {
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white'
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        variants[variant]
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

// Common input component  
export function ControlInput({ 
  type = 'number',
  placeholder,
  className = 'flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm',
  ...props 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  )
}