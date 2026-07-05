import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { listProducts, createProduct, updateProduct, deleteProduct } from '../api/products'
import { getProject } from '../api/projects'
import { ProductFormModal } from '../components/ProductFormModal'

export function ProductsPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    refresh()
    getProject(projectId)
      .then((project) => setPages(project.pages.map((p) => ({ name: p.name }))))
      .catch(() => {})
  }, [projectId])

  function refresh() {
    setLoading(true)
    listProducts(projectId)
      .then(setProducts)
      .finally(() => setLoading(false))
  }

  async function handleSave(form) {
    if (editingProduct) {
      await updateProduct(projectId, editingProduct._id, form)
    } else {
      await createProduct(projectId, form)
    }
    setShowForm(false)
    setEditingProduct(null)
    refresh()
  }

  async function handleDelete(productId) {
    await deleteProduct(projectId, productId)
    setProducts((prev) => prev.filter((p) => p._id !== productId))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-800">
            &larr; Projects
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Products</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
          className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add product
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <p className="text-sm text-gray-500 mb-6">
          Add products here, then drop a "Product Grid" section on any page to list them, and create a page named{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">product</code> with a "Product Detail" section
          to auto-generate a detail page for each one. Each product's card links there by default — set "Link to" on
          a product to send its card somewhere else instead.
        </p>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : products.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-xl py-16 text-center">
            <p className="text-sm text-gray-500">No products yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                  {product.image && (
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">
                    {product.price || 'No price'} {product.category && `· ${product.category}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(product)
                    setShowForm(true)
                  }}
                  className="text-xs text-gray-500 hover:text-indigo-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product._id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <ProductFormModal
          product={editingProduct}
          pages={pages}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}
