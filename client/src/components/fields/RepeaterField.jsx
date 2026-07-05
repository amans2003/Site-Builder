import { getByPath, setByPath } from 'shared'
import { FieldControl } from './FieldControl'

function makeDefaultItem(itemFields) {
  const item = {}
  for (const f of itemFields) {
    if (f.type === 'list') item[f.key] = []
    else if (f.type === 'boolean') item[f.key] = false
    else item[f.key] = ''
  }
  return item
}

export function RepeaterField({ field, value, onChange, pages }) {
  const items = value || []

  function updateItem(index, subKey, subValue) {
    const next = items.map((item, i) => (i === index ? setByPath(item, subKey, subValue) : item))
    onChange(next)
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index))
  }

  function addItem() {
    onChange([...items, makeDefaultItem(field.itemFields)])
  }

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded p-2">
            <div className="flex justify-end mb-1">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-xs text-gray-400 hover:text-red-500"
              >
                Remove
              </button>
            </div>
            {field.itemFields.map((subField) => (
              <FieldControl
                key={subField.key}
                field={subField}
                value={getByPath(item, subField.key)}
                onChange={(v) => updateItem(index, subField.key, v)}
                pages={pages}
              />
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-blue-600 hover:underline self-start"
        >
          + Add {field.itemLabel || 'item'}
        </button>
      </div>
    </div>
  )
}
