export function ListField({ label, value, onChange }) {
  const items = value || []

  function updateItem(index, newValue) {
    const next = [...items]
    next[index] = newValue
    onChange(next)
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index))
  }

  function addItem() {
    onChange([...items, 'New item'])
  }

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-gray-400 hover:text-red-500 px-2"
              aria-label={`Remove ${item}`}
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-blue-600 hover:underline self-start"
        >
          + Add item
        </button>
      </div>
    </div>
  )
}
