import { useState } from 'react'
import { uploadImage } from '../../api/upload'

export function ImageField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {value && (
        <div className="mb-2 flex items-center gap-2">
          <img src={value} alt="" className="h-12 w-12 object-cover rounded border border-gray-200" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      )}
      <input
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
        onChange={handleFile}
        disabled={uploading}
        className="text-sm"
      />
      {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
