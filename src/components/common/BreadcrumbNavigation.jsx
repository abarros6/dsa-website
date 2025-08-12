import { Link } from 'react-router-dom'

export default function BreadcrumbNavigation({ backTo, backLabel }) {
  return (
    <nav className="mb-8">
      <Link to={backTo} className="text-primary-600 hover:text-primary-700">
        ← Back to {backLabel}
      </Link>
    </nav>
  )
}