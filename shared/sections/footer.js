import { FIELD_TYPES } from '../fieldTypes.js'
import { escapeHtml, resolveLinkHref } from '../utils/path.js'

export const type = 'footer'
export const label = 'Footer'

export const defaultProps = {
  text: `© ${new Date().getFullYear()} My Business. All rights reserved.`,
  links: [
    { label: 'Privacy', target: 'home' },
    { label: 'Terms', target: 'home' },
  ],
  bgColor: '#111827',
  textColor: '#e5e7eb',
}

export const fields = [
  { key: 'text', label: 'Copyright text', type: FIELD_TYPES.TEXT },
  { key: 'links', label: 'Footer links', type: FIELD_TYPES.LINK_LIST },
  { key: 'bgColor', label: 'Background color', type: FIELD_TYPES.COLOR },
  { key: 'textColor', label: 'Text color', type: FIELD_TYPES.COLOR },
]

export function renderHTML(props, { pages } = {}) {
  const p = { ...defaultProps, ...props }
  const links = (p.links || [])
    .map((l) => `<li><a href="${escapeHtml(resolveLinkHref(l.target, pages))}">${escapeHtml(l.label)}</a></li>`)
    .join('')
  return `
<footer class="footer-section" style="background:${escapeHtml(p.bgColor)}; color:${escapeHtml(p.textColor)}">
  <div class="footer-inner">
    <p class="footer-text" data-editable="text">${escapeHtml(p.text)}</p>
    <ul class="footer-links">${links}</ul>
  </div>
</footer>`.trim()
}

export const css = `
.footer-section { width: 100%; padding: 32px 24px; }
.footer-inner { max-width: 960px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.footer-text { margin: 0; font-size: 14px; }
.footer-links { display: flex; gap: 16px; list-style: none; margin: 0; padding: 0; }
.footer-links a { color: inherit; text-decoration: none; opacity: 0.8; }
@media (max-width: 640px) {
  .footer-inner { flex-direction: column; text-align: center; }
}
`
