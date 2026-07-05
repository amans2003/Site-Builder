import { api } from './client'

export function listProducts(projectId) {
  return api.get(`/projects/${projectId}/products`).then((r) => r.data.products)
}

export function createProduct(projectId, data) {
  return api.post(`/projects/${projectId}/products`, data).then((r) => r.data.product)
}

export function updateProduct(projectId, productId, data) {
  return api.put(`/projects/${projectId}/products/${productId}`, data).then((r) => r.data.product)
}

export function deleteProduct(projectId, productId) {
  return api.delete(`/projects/${projectId}/products/${productId}`)
}
