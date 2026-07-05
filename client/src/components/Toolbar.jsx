import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEditorStore } from '../store/editorStore'
import { downloadExport } from '../api/exportSite'
import { BrandMark } from './BrandMark'

const DEVICES = [
  { id: 'desktop', label: 'Desktop' },
  { id: 'tablet', label: 'Tablet' },
  { id: 'mobile', label: 'Mobile' },
]

export function Toolbar() {
  const navigate = useNavigate()
  const project = useEditorStore((s) => s.project)
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex)
  const device = useEditorStore((s) => s.device)
  const dirty = useEditorStore((s) => s.dirty)
  const saving = useEditorStore((s) => s.saving)
  const saveError = useEditorStore((s) => s.saveError)
  const setDevice = useEditorStore((s) => s.setDevice)
  const renameProject = useEditorStore((s) => s.renameProject)
  const saveProject = useEditorStore((s) => s.saveProject)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const canUndo = useEditorStore((s) => s.past.length > 0)
  const canRedo = useEditorStore((s) => s.future.length > 0)

  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)
  const [previewing, setPreviewing] = useState(false)

  async function handleExport() {
    setExporting(true)
    setExportError(null)
    try {
      await downloadExport(project._id, `${project.name || 'site'}.zip`)
    } catch {
      setExportError('Export failed')
    } finally {
      setExporting(false)
    }
  }

  async function handlePreview() {
    setPreviewing(true)
    try {
      // The preview route reads from the database, so flush unsaved edits first —
      // otherwise "live preview" would silently show stale content.
      if (dirty) await saveProject()
      const page = project.pages[currentPageIndex]
      window.open(`/api/preview/${project._id}/${page.name}`, '_blank')
    } finally {
      setPreviewing(false)
    }
  }

  const status = saving ? 'Saving...' : dirty ? 'Unsaved changes' : 'All changes saved'
  const statusClass = saving ? 'text-gray-400' : dirty ? 'text-amber-500' : 'text-green-600'

  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-2 bg-white">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate('/')} aria-label="Back to projects" className="shrink-0">
          <BrandMark size="sm" />
        </button>
        <span className="text-gray-300">/</span>
        <input
          type="text"
          value={project.name}
          onChange={(e) => renameProject(e.target.value)}
          className="text-sm font-medium border border-transparent hover:border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-lg px-2 py-1 outline-none transition-shadow"
        />
        <div className="flex items-center gap-1 ml-1">
          <button
            type="button"
            onClick={() => undo()}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="text-sm px-2 py-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            &#8630;
          </button>
          <button
            type="button"
            onClick={() => redo()}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            className="text-sm px-2 py-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            &#8631;
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
        {DEVICES.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDevice(d.id)}
            className={`text-xs px-3 py-1.5 rounded transition-colors ${
              device === d.id ? 'bg-white shadow-sm font-medium' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {exportError && <span className="text-xs text-red-500">{exportError}</span>}
        {saveError && <span className="text-xs text-red-500">{saveError}</span>}
        <span className={`text-xs ${statusClass}`}>{status}</span>
        <button
          type="button"
          onClick={() => navigate(`/projects/${project._id}/products`)}
          disabled={!project._id}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          Products
        </button>
        <button
          type="button"
          onClick={() => navigate(`/projects/${project._id}/submissions`)}
          disabled={!project._id}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          Submissions
        </button>
        <button
          type="button"
          onClick={handlePreview}
          disabled={previewing || !project._id}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          {previewing ? 'Opening...' : 'Preview'}
        </button>
        <button
          type="button"
          onClick={() => saveProject()}
          disabled={saving}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || !project._id}
          className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 font-medium"
        >
          {exporting ? 'Exporting...' : 'Export ZIP'}
        </button>
      </div>
    </div>
  )
}
