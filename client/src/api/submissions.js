import { api } from './client'

export function listSubmissions(projectId) {
  return api.get(`/projects/${projectId}/submissions`).then((r) => r.data.submissions)
}
