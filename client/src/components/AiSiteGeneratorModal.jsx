import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateSite } from '../api/ai'
import { createProject, updateProject } from '../api/projects'

export function AiSiteGeneratorModal({ onClose }) {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    try {
      const { name, pages } = await generateSite(prompt)
      const project = await createProject(name)
      const updated = await updateProject(project._id, { pages })
      navigate(`/editor/${updated._id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not generate the site. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-1">Create a site with AI</h2>
        <p className="text-sm text-gray-500 mb-4">
          Describe your business or site and AI will lay out the pages and sections for you.
        </p>
        <textarea
          autoFocus
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="e.g. A landing page for a boutique coffee roastery with an about page and a contact page"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3"
        />
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="text-sm px-3 py-1.5 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate site'}
          </button>
        </div>
      </div>
    </div>
  )
}
