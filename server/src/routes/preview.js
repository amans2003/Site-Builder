import { Router } from 'express'
import Project from '../models/Project.js'
import Product from '../models/Product.js'
import { escapeHtml, pageFilename } from 'shared'
import { renderPageSections, cssForTypes, hydrateGlobalSections } from '../export/generateSite.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const PRODUCT_TEMPLATE_PAGE = 'product'
const PRODUCT_FILENAME_RE = /^product-(.+?)(\.html)?$/

const router = Router()

function renderDoc({ siteName, pageName, sectionsHTML, css }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(siteName)} — ${escapeHtml(pageName)}</title>
  <style>${css}</style>
</head>
<body>
${sectionsHTML}
</body>
</html>`
}

// Public by design (like the export/submission endpoints): a preview link only
// works if you know the project's id, and the content is meant to become a public
// website anyway once exported. No account data is exposed here.
router.get('/:projectId/:pageName', asyncHandler(async (req, res) => {
  const projectDoc = await Project.findById(req.params.projectId)
  if (!projectDoc) return res.status(404).send('Site not found')
  // hydrateGlobalSections spreads each page/section with `{...page}` — on a raw
  // Mongoose document that silently drops every field (they're getters, not own
  // enumerable properties), not just the ones it means to override. Same class
  // of bug as the export route; same fix: hydrate from a plain object.
  const project = projectDoc.toObject()

  const products = await Product.find({ projectId: project._id }).sort({ order: 1, createdAt: 1 })
  const pages = project.pages.map((p) => ({ name: p.name }))
  const hydratedPages = hydrateGlobalSections(project.pages, project.globalSections)
  const context = {
    pages,
    products: products.map((p) => p.toObject()),
    projectId: String(project._id),
    apiBaseUrl: process.env.PUBLIC_API_BASE_URL || '',
  }

  const productMatch = req.params.pageName.match(PRODUCT_FILENAME_RE)
  if (productMatch) {
    const product = products.find((p) => p.slug === productMatch[1])
    const templatePage = hydratedPages.find((p) => p.name === PRODUCT_TEMPLATE_PAGE)
    if (!product || !templatePage) return res.status(404).send('Product not found')

    const { sectionsHTML, usedTypes } = renderPageSections(templatePage, { ...context, product: product.toObject() })
    return res
      .type('html')
      .send(renderDoc({ siteName: project.name, pageName: product.name, sectionsHTML, css: cssForTypes(usedTypes) }))
  }

  // Accept either the raw page name (used when opening "Preview" from the toolbar)
  // or its exported filename, e.g. "index.html" (used by the in-page nav links
  // rendered via resolveLinkHref, which match the zip export's file naming).
  const page =
    hydratedPages.find((p) => p.name === req.params.pageName) ||
    hydratedPages.find((p) => pageFilename(p.name) === req.params.pageName)
  if (!page) return res.status(404).send('Page not found')

  // Unlike the zip export, a live preview is served directly by this backend, so
  // uploaded images can keep their original /uploads/... URLs — no asset renaming.
  const { sectionsHTML, usedTypes } = renderPageSections(page, context)
  res
    .type('html')
    .send(renderDoc({ siteName: project.name, pageName: page.name, sectionsHTML, css: cssForTypes(usedTypes) }))
}))

export default router
