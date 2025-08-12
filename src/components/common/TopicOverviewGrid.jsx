import { Link } from 'react-router-dom'

export default function TopicOverviewGrid({ topics }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {topics.map((topic) => (
        <Link
          key={topic.path}
          to={topic.path}
          className="card hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">{topic.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
              {topic.title}
            </h3>
            <p className="text-gray-600 text-sm">{topic.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}