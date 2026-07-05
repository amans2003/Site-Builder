import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject, updateProject } from '../api/projects'
import { useEditorStore } from '../store/editorStore'
import { Toolbar } from '../components/Toolbar'
import { PagesBar } from '../components/PagesBar'
import { Sidebar } from '../components/Sidebar'
import { Canvas } from '../components/Canvas'
import { SettingsPanel } from '../components/SettingsPanel'

export function EditorPage() {
  const { projectId } = useParams()
  const loadProject = useEditorStore((s) => s.loadProject)
  const resetProject = useEditorStore((s) => s.resetProject)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getProject(projectId)
      .then(loadProject)
      .catch(() => setError('Could not load project'))
      .finally(() => setLoading(false))

    return () => {
      // Flush a pending save using a snapshot, rather than the store's saveProject()
      // action — that action mutates shared store state asynchronously, which would
      // race with the resetProject() below once the request resolves for whatever
      // project loads next.
      const state = useEditorStore.getState()
      if (state.dirty && state.project._id) {
        updateProject(state.project._id, {
          name: state.project.name,
          pages: state.project.pages,
          globalSections: state.project.globalSections,
        }).catch(() => {})
      }
      resetProject()
    }
  }, [projectId])

  useEffect(() => {
    function handleBeforeUnload(e) {
      if (useEditorStore.getState().dirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  useEffect(() => {
    function isEditingText() {
      const el = document.activeElement
      return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
    }

    function handleKeyDown(e) {
      const withModifier = e.ctrlKey || e.metaKey
      const key = e.key.toLowerCase()
      const isUndo = withModifier && !e.shiftKey && key === 'z'
      const isRedo = withModifier && ((e.shiftKey && key === 'z') || key === 'y')
      if (isEditingText()) return

      if (isUndo) {
        e.preventDefault()
        useEditorStore.getState().undo()
      } else if (isRedo) {
        e.preventDefault()
        useEditorStore.getState().redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (loading) return <div className="p-6 text-sm text-gray-400">Loading editor...</div>
  if (error) return <div className="p-6 text-sm text-red-500">{error}</div>

  return (
    <div className="h-screen flex flex-col">
      <Toolbar />
      <PagesBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Canvas />
        <SettingsPanel />
      </div>
    </div>
  )
}
