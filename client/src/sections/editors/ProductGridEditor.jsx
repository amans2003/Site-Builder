import { useEffect, useState } from 'react'
import { InlineText } from '../InlineText'
import { useEditorStore } from '../../store/editorStore'
import { listProducts } from '../../api/products'

const COLS_CLASS = { 2: 'grid-cols-2', 3: 'grid-cols-2 @md:grid-cols-3', 4: 'grid-cols-2 @md:grid-cols-4' }

export function ProductGridEditor({ props, onChange }) {
  const { heading, columns } = props
  const projectId = useEditorStore((s) => s.project._id)
  const hasProductTemplate = useEditorStore((s) => s.project.pages.some((p) => p.name === 'product'))
  const goToPageByName = useEditorStore((s) => s.goToPageByName)
  const setPreviewProductId = useEditorStore((s) => s.setPreviewProductId)
  const [products, setProducts] = useState([])

  useEffect(() => {
    if (!projectId) return
    listProducts(projectId).then(setProducts).catch(() => {})
  }, [projectId])

  return (
    <section className="w-full px-4 py-10 @md:px-6 @md:py-16">
      <div className="max-w-4xl mx-auto">
        <InlineText
          as="h2"
          className="text-xl @md:text-3xl font-semibold mb-6 text-center outline-none"
          value={heading}
          onChange={(v) => onChange('heading', v)}
        />
        {products.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">
            No products yet — add some from the project's Products page.
          </p>
        ) : (
          <div className={`grid gap-4 ${COLS_CLASS[columns] || COLS_CLASS[3]}`}>
            {products.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (product.link) {
                    // Overridden: jump straight to the linked page (if it's a
                    // page in this project — a custom URL can't be followed
                    // from inside the editor canvas).
                    goToPageByName(product.link)
                  } else {
                    setPreviewProductId(product._id)
                    if (hasProductTemplate) goToPageByName('product')
                  }
                }}
                className="text-left border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100">
                  {product.image && (
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">{product.name}</p>
                  {product.price && <p className="text-sm text-indigo-600 font-medium">{product.price}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
        {!hasProductTemplate && products.length > 0 && (
          <p className="text-center text-xs text-amber-500 mt-4">
            Add a page named "product" with a Product Detail section to make these clickable on your published site.
          </p>
        )}
      </div>
    </section>
  )
}
