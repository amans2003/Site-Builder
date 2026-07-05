import { useState } from 'react'
import { useEditorStore } from '../store/editorStore'

export function PagesBar() {
  const pages = useEditorStore((s) => s.project.pages)
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex)
  const setCurrentPageIndex = useEditorStore((s) => s.setCurrentPageIndex)
  const addPage = useEditorStore((s) => s.addPage)
  const renamePage = useEditorStore((s) => s.renamePage)
  const removePage = useEditorStore((s) => s.removePage)

  const [editingIndex, setEditingIndex] = useState(null)
  const [draftName, setDraftName] = useState('')

  function startRename(index, currentName) {
    setEditingIndex(index)
    setDraftName(currentName)
  }

  function commitRename(index) {
    if (draftName.trim()) renamePage(index, draftName.trim())
    setEditingIndex(null)
  }

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 px-4 py-1.5 bg-gray-50 overflow-x-auto">
      {pages.map((page, index) => (
        <div
          key={page.name}
          className={`group flex items-center gap-1 rounded px-2.5 py-1 text-xs cursor-pointer ${
            index === currentPageIndex ? 'bg-white shadow-sm font-medium' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {editingIndex === index ? (
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={() => commitRename(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename(index)
                if (e.key === 'Escape') setEditingIndex(null)
              }}
              className="w-20 border border-gray-300 rounded px-1 text-xs"
            />
          ) : (
            <button
              type="button"
              onClick={() => setCurrentPageIndex(index)}
              onDoubleClick={() => startRename(index, page.name)}
              title="Click to switch, double-click to rename"
              className="flex items-center gap-1.5"
            >
              {page.name}
              {page.name === 'product' && (
                <span className="text-[10px] font-medium bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
                  Template
                </span>
              )}
            </button>
          )}
          {pages.length > 1 && (
            <button
              type="button"
              onClick={() => removePage(index)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
              aria-label={`Delete page ${page.name}`}
            >
              &times;
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addPage(`page-${pages.length + 1}`)}
        className="text-xs text-indigo-600 hover:underline px-2 py-1"
      >
        + Add page
      </button>
    </div>
  )
}
