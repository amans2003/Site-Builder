export function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}

export function setByPath(obj, path, value) {
  const keys = path.split('.')
  const result = structuredClone(obj)
  let cursor = result
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (cursor[key] == null || typeof cursor[key] !== 'object') cursor[key] = {}
    cursor = cursor[key]
  }
  cursor[keys[keys.length - 1]] = value
  return result
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function slugify(text) {
  return (
    String(text)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'page'
  )
}

export function pageFilename(pageName) {
  return pageName === 'home' ? 'index.html' : `${pageName}.html`
}

export function resolveLinkHref(target, pages) {
  const isKnownPage = pages?.some((p) => p.name === target)
  if (isKnownPage) return pageFilename(target)
  return target || '#'
}

export function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
