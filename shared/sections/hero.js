import { FIELD_TYPES } from '../fieldTypes.js'
import { escapeHtml, resolveLinkHref } from '../utils/path.js'

export const type = 'hero'
export const label = 'Hero'

export const defaultProps = {
  title: 'Welcome to My Business',
  subtitle: 'We build great things',
  bgImage: '',
  bgColor: '#111827',
  textColor: '#ffffff',
  cta: { enabled: false, label: 'Learn more', target: 'home' },
}

export const fields = [
  { key: 'title', label: 'Title', type: FIELD_TYPES.TEXT },
  { key: 'subtitle', label: 'Subtitle', type: FIELD_TYPES.TEXTAREA },
  { key: 'bgImage', label: 'Background image', type: FIELD_TYPES.IMAGE },
  { key: 'bgColor', label: 'Background color', type: FIELD_TYPES.COLOR },
  { key: 'textColor', label: 'Text color', type: FIELD_TYPES.COLOR },
  { key: 'cta.enabled', label: 'Show button', type: FIELD_TYPES.BOOLEAN },
  { key: 'cta.label', label: 'Button label', type: FIELD_TYPES.TEXT },
  { key: 'cta.target', label: 'Button links to', type: FIELD_TYPES.PAGE_LINK },
]

export function renderHTML(props, { pages } = {}) {
  const p = { ...defaultProps, ...props }
  const bg = p.bgImage
    ? `background-image:url('${escapeHtml(p.bgImage)}'); background-size:cover; background-position:center;`
    : `background:${escapeHtml(p.bgColor)};`

  const cta = p.cta?.enabled
    ? `<a class="hero-cta" href="${escapeHtml(resolveLinkHref(p.cta.target, pages))}">${escapeHtml(p.cta.label)}</a>`
    : ''

  return `
<section class="hero-section" style="${bg} color:${escapeHtml(p.textColor)}">
  <div class="hero-inner">
    <h1 class="hero-title" data-editable="title">${escapeHtml(p.title)}</h1>
    <p class="hero-subtitle" data-editable="subtitle">${escapeHtml(p.subtitle)}</p>
    ${cta}
  </div>
</section>`.trim()
}

export const css = `
.hero-section { width: 100%; padding: 96px 24px; text-align: center; }
.hero-inner { max-width: 720px; margin: 0 auto; }
.hero-title { font-size: 48px; margin: 0 0 16px; font-weight: 700; }
.hero-subtitle { font-size: 20px; opacity: 0.85; margin: 0; }
.hero-cta { display: inline-block; margin-top: 24px; padding: 12px 28px; border-radius: 6px; background: #fff; color: #111827; text-decoration: none; font-weight: 600; }
@media (max-width: 768px) {
  .hero-title { font-size: 32px; }
  .hero-subtitle { font-size: 16px; }
}
@media (max-width: 480px) {
  .hero-section { padding: 56px 16px; }
  .hero-title { font-size: 26px; }
}
`
