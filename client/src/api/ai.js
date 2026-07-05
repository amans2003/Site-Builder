import { api } from './client'

export function generateSite(prompt) {
  return api.post('/ai/generate-site', { prompt }).then((r) => r.data)
}

export function generateCode(prompt, history) {
  return api.post('/ai/generate-code', { prompt, history }).then((r) => r.data)
}
