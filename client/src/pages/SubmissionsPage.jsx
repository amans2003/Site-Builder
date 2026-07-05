import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { listSubmissions } from '../api/submissions'

export function SubmissionsPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    listSubmissions(projectId)
      .then(setSubmissions)
      .catch(() => setError('Could not load submissions'))
      .finally(() => setLoading(false))
  }, [projectId])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white">
        <button type="button" onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-800">
          &larr; Projects
        </button>
        <h1 className="text-lg font-semibold">Contact form submissions</h1>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-gray-400">
            No submissions yet. They'll show up here once someone fills out a contact form on your published site.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {submissions.map((s) => (
              <div key={s._id} className="bg-white border border-gray-200 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">
                    {s.name} <span className="text-gray-400 font-normal">&lt;{s.email}&gt;</span>
                    {s.phone && <span className="text-gray-400 font-normal"> &middot; {s.phone}</span>}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{s.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
