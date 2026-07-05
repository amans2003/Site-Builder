import { useEffect, useState } from 'react'
import { useEditorStore } from '../../store/editorStore'
import { listProducts } from '../../api/products'

export function ProductDetailEditor({ props }) {
  const { showPrice, ctaEnabled, ctaLabel, ctaTarget } = props
  const projectId = useEditorStore((s) => s.project._id)
  const currentPageName = useEditorStore((s) => s.project.pages[s.currentPageIndex].name)
  const goToPageByName = useEditorStore((s) => s.goToPageByName)
  const previewProductId = useEditorStore((s) => s.previewProductId)
  const [products, setProducts] = useState(null)

  useEffect(() => {
    if (!projectId) return
    listProducts(projectId).then(setProducts).catch(() => setProducts([]))
  }, [projectId])

  // Show whichever product the user actually clicked through from the grid,
  // falling back to the first product so the section still previews something
  // when opened directly (e.g. by clicking the "product" page tab itself).
  const sample = (previewProductId && products?.find((p) => p._id === previewProductId)) || products?.[0]

  return (
    <section className="w-full px-4 py-8 @md:px-6 @md:py-12">
      {currentPageName !== 'product' && (
        <p className="text-center text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-4 max-w-xl mx-auto">
          This section only generates real pages on a page named "product". Rename this page to "product" for it to
          work on your published site.
        </p>
      )}
      <div className="max-w-3xl mx-auto grid grid-cols-1 @md:grid-cols-2 gap-8 items-start">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          {sample?.image && <img src={sample.image} alt="" className="w-full h-full object-cover" />}
        </div>
        <div>
          {sample?.category && <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">{sample.category}</p>}
          <h1 className="text-2xl @md:text-3xl font-bold mb-3">{sample?.name || 'Sample Product'}</h1>
          {showPrice && (
            <p className="text-xl font-semibold text-indigo-600 mb-4">{sample?.price || '$29.00'}</p>
          )}
          <p className="text-sm text-gray-600 leading-relaxed mb-5 whitespace-pre-wrap">
            {sample?.description ||
              sample?.shortDescription ||
              'This section shows each product’s real details once your product pages are generated.'}
          </p>
          {ctaEnabled && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                goToPageByName(ctaTarget)
              }}
              className="inline-block px-6 py-2.5 rounded bg-gray-900 text-white text-sm font-semibold no-underline"
            >
              {ctaLabel}
            </a>
          )}
          {!products?.length && (
            <p className="text-xs text-gray-400 mt-4">
              Showing placeholder text — add products from the project's Products page to preview real data.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
