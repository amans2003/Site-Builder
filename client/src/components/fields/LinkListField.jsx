import { PageLinkPicker } from './PageLinkPicker'

export function LinkListField({ label, value, pages, onChange }) {
  const items = value || []

  function updateItem(index, patch) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index))
  }

  function addItem() {
    onChange([...items, { label: 'New link', target: pages[0]?.name || '' }])
  }

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded p-2 flex flex-col gap-1.5">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(i, { label: e.target.value })}
                placeholder="Label"
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-gray-400 hover:text-red-500 px-1"
                aria-label={`Remove ${item.label}`}
              >
                &times;
              </button>
            </div>
            <PageLinkPicker
              value={item.target}
              pages={pages}
              onChange={(target) => updateItem(i, { target })}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-blue-600 hover:underline self-start"
        >
          + Add link
        </button>
      </div>
    </div>
  )
}
