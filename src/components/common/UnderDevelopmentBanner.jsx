export default function UnderDevelopmentBanner({ feature = "This section" }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p className="text-yellow-800">
        🚧 {feature} is under development. Coming soon!
      </p>
    </div>
  )
}