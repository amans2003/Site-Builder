export function FieldWrapper({ label, children, inline }) {
  if (inline) {
    return (
      <label className="mb-4 flex items-center gap-2 cursor-pointer select-none">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        {children}
      </label>
    )
  }
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  )
}
