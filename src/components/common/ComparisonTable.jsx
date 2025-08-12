export default function ComparisonTable({ title, headers, rows }) {
  return (
    <div className="mt-8 card">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {headers.map((header, index) => (
                <th key={index} className="text-left py-3 px-4">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex < rows.length - 1 ? "border-b" : ""}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className={`py-3 px-4 ${cellIndex === 0 ? 'font-medium' : ''}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}