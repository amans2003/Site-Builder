import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listProjects, createProject, deleteProject } from '../api/projects'
import { useAuthStore } from '../store/authStore'
import { AiSiteGeneratorModal } from '../components/AiSiteGeneratorModal'
import { BrandMark } from '../components/BrandMark'
import { SupportFooter } from '../components/SupportFooter'

export function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)

  useEffect(() => {
    listProjects()
      .then(setProjects)
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate() {
    setCreating(true)
    try {
      const project = await createProject(`Untitled site ${projects.length + 1}`)
      navigate(`/editor/${project._id}`)
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id) {
    await deleteProject(id)
    setProjects((prev) => prev.filter((p) => p._id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-gray-200 bg-white">
        <BrandMark />
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">{user?.name}</span>
          <button type="button" onClick={logout} className="text-gray-400 hover:text-gray-700 transition-colors">
            Log out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">My Sites</h1>
            <p className="text-sm text-gray-500 mt-0.5">Create, edit, and publish your websites.</p>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              className="bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create with AI
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {creating ? 'Creating...' : '+ New site'}
            </button>
          </div>
        </div>

        {showAiModal && <AiSiteGeneratorModal onClose={() => setShowAiModal(false)} />}

        {loading ? (
          <p className="text-sm text-gray-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-xl py-16 text-center">
            <p className="text-sm text-gray-500">No sites yet.</p>
            <p className="text-sm text-gray-400 mt-1">Create your first one with the buttons above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all"
              >
                <button type="button" onClick={() => navigate(`/editor/${project._id}`)} className="text-left w-full">
                  <div className="w-full h-20 rounded-lg bg-linear-to-br from-indigo-50 to-purple-50 mb-3 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-indigo-300">
                      {project.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="font-medium text-sm text-gray-900 mb-0.5">{project.name}</p>
                  <p className="text-xs text-gray-400">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </button>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => navigate(`/projects/${project._id}/products`)}
                    className="text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    Products
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/projects/${project._id}/submissions`)}
                    className="text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    Submissions
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project._id)}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-6">
        <SupportFooter />
      </footer>
    </div>
  )
}
