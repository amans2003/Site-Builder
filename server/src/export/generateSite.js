import path from 'node:path'
import { getSection, sectionRegistry, pageFilename, productFilename, escapeHtml } from 'shared'

const UPLOADS_PREFIX = '/uploads/'
const PRODUCT_TEMPLATE_PAGE = 'product'

function collectAndRewriteAssets(pages, products) {
  const assets = new Map() // uploadFilename -> assetFilename
  let counter = 0

  function rewriteValue(value) {
    if (typeof value === 'string' && value.startsWith(UPLOADS_PREFIX)) {
      const filename = value.slice(UPLOADS_PREFIX.length)
      if (!assets.has(filename)) {
        counter += 1
        const ext = path.extname(filename)
        assets.set(filename, `asset-${counter}${ext}`)
      }
      return `assets/${assets.get(filename)}`
    }
    if (Array.isArray(value)) return value.map(rewriteValue)
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewriteValue(v)]))
    }
    return value
  }

  const rewrittenPages = pages.map((page) => ({
    ...page,
    sections: page.sections.map((section) => ({
      ...section,
      props: rewriteValue(section.props || {}),
    })),
  }))

  const rewrittenProducts = products.map((product) => ({
    ...product,
    image: rewriteValue(product.image || ''),
    gallery: rewriteValue(product.gallery || []),
  }))

  return { rewrittenPages, rewrittenProducts, assets }
}

// Resolves each section's globalId (if any) against the project's shared
// section definitions, so a reusable section renders with its real content
// regardless of which page(s) it's placed on. A reference to a global section
// that's since been removed is dropped rather than rendered empty.
export function hydrateGlobalSections(pages, globalSections) {
  const globalsById = new Map((globalSections || []).map((g) => [g.id, g]))
  return pages.map((page) => ({
    ...page,
    sections: page.sections
      .map((section) => {
        if (!section.globalId) return section
        const global = globalsById.get(section.globalId)
        return global ? { ...section, type: global.type, props: global.props } : null
      })
      .filter(Boolean),
  }))
}

export function buildPageHTML({ pageName, sectionsHTML, siteName }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(siteName)} — ${escapeHtml(pageName)}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
${sectionsHTML}
</body>
</html>
`
}

// Renders one page's sections to HTML, returning the CSS classes (section types)
// that were used so the caller can bundle only the relevant stylesheet rules.
export function renderPageSections(page, context) {
  const usedTypes = new Set()
  const sectionsHTML = page.sections
    .map((section) => {
      const override = section.props?._override
      if (override?.enabled) {
        usedTypes.add('customCode')
        return getSection('customCode').renderHTML(override)
      }
      const def = getSection(section.type)
      usedTypes.add(section.type)
      return def.renderHTML(section.props || {}, context)
    })
    .join('\n')

  return { sectionsHTML, usedTypes }
}

export function cssForTypes(usedTypes) {
  return [...usedTypes].map((type) => sectionRegistry[type].css).join('\n\n')
}

export function generateSite(project, products = []) {
  const hydratedPages = hydrateGlobalSections(project.pages, project.globalSections)
  const { rewrittenPages, rewrittenProducts, assets } = collectAndRewriteAssets(hydratedPages, products)
  const pages = project.pages.map((p) => ({ name: p.name }))
  const baseContext = {
    pages,
    products: rewrittenProducts,
    projectId: String(project._id),
    apiBaseUrl: process.env.PUBLIC_API_BASE_URL || '',
  }

  const allUsedTypes = new Set()
  const files = []

  // The page named "product" (if any) is a template, not a real standalone page:
  // it's rendered once per product instead of once for itself.
  const productTemplatePage = rewrittenPages.find((p) => p.name === PRODUCT_TEMPLATE_PAGE)
  const normalPages = rewrittenPages.filter((p) => p.name !== PRODUCT_TEMPLATE_PAGE)

  for (const page of normalPages) {
    const { sectionsHTML, usedTypes } = renderPageSections(page, baseContext)
    usedTypes.forEach((t) => allUsedTypes.add(t))

    files.push({
      path: pageFilename(page.name),
      content: buildPageHTML({ pageName: page.name, sectionsHTML, siteName: project.name }),
    })
  }

  if (productTemplatePage) {
    for (const product of rewrittenProducts) {
      const { sectionsHTML, usedTypes } = renderPageSections(productTemplatePage, {
        ...baseContext,
        product,
      })
      usedTypes.forEach((t) => allUsedTypes.add(t))

      files.push({
        path: productFilename(product.slug),
        content: buildPageHTML({ pageName: product.name, sectionsHTML, siteName: project.name }),
      })
    }
  }

  files.push({ path: 'styles.css', content: cssForTypes(allUsedTypes) })

  return { files, assets }
}
