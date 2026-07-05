import { api } from './client'

export function listProjects() {
  return api.get('/projects').then((r) => r.data.projects)
}

export function createProject(name) {
  return api.post('/projects', { name }).then((r) => r.data.project)
}

export function getProject(id) {
  return api.get(`/projects/${id}`).then((r) => r.data.project)
}

export function updateProject(id, { name, pages, globalSections }) {
  return api.put(`/projects/${id}`, { name, pages, globalSections }).then((r) => r.data.project)
}

export function deleteProject(id) {
  return api.delete(`/projects/${id}`)
}
