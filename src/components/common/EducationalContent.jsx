export default function EducationalContent({ leftContent, rightContent }) {
  return (
    <div className="mt-8 grid md:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{leftContent.title}</h3>
        <div className="space-y-2 text-sm">
          {leftContent.content}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{rightContent.title}</h3>
        <div className="space-y-3 text-sm">
          {rightContent.content}
        </div>
      </div>
    </div>
  )
}