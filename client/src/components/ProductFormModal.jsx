import { useState } from 'react'
import { ImageField } from './fields/ImageField'

const emptyForm = { name: '', price: '', category: '', shortDescription: '', description: '', image: '', link: '' }

const LINK_DEFAULT = '__default__'
const LINK_CUSTOM = '__custom__'

function ProductLinkField({ value, pages, onChange }) {
  const isKnownPage = pages.some((p) => p.name === value)
  const [mode, setMode] = useState(!value ? LINK_DEFAULT : isKnownPage ? 'page' : LINK_CUSTOM)

  function handleSelect(e) {
    const next = e.target.value
    if (next === LINK_DEFAULT) {
      setMode(LINK_DEFAULT)
      onChange('')
    } else if (next === LINK_CUSTOM) {
      setMode(LINK_CUSTOM)
      onChange('')
    } else {
      setMode('page')
      onChange(next)
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Link to</label>
      <select
        value={mode === 'page' ? value : mode}
        onChange={handleSelect}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-1.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value={LINK_DEFAULT}>Default — its own product page</option>
        {pages.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name}
          </option>
        ))}
        <option value={LINK_CUSTOM}>Custom URL...</option>
      </select>
      {mode === LINK_CUSTOM && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      )}
    </div>
  )
}

export function ProductFormModal({ product, pages = [], onSave, onClose }) {
  const [form, setForm] = useState(product ? { ...emptyForm, ...product } : emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save product')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{product ? 'Edit product' : 'Add product'}</h2>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
        <input
          type="text"
          required
          autoFocus
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
            <input
              type="text"
              placeholder="$29.00"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1.5">Short description</label>
        <input
          type="text"
          placeholder="Shown on the product grid card"
          value={form.shortDescription}
          onChange={(e) => set('shortDescription', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full description</label>
        <textarea
          rows={4}
          placeholder="Shown on the product's own detail page"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <ImageField label="Image" value={form.image} onChange={(v) => set('image', v)} />

        <ProductLinkField value={form.link} pages={pages} onChange={(v) => set('link', v)} />

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
