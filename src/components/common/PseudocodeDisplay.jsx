export default function PseudocodeDisplay({ title, pseudocode }) {
  return (
    <div className="mt-6 card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {title} - Pseudocode
      </h3>
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
        <pre>{pseudocode}</pre>
      </div>
    </div>
  )
}