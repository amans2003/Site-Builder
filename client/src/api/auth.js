import { api } from './client'

export function signup({ name, email, password }) {
  return api.post('/auth/signup', { name, email, password }).then((r) => r.data)
}

export function login({ email, password }) {
  return api.post('/auth/login', { email, password }).then((r) => r.data)
}
