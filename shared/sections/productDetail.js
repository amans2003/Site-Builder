import { FIELD_TYPES } from '../fieldTypes.js'
import { escapeHtml, resolveLinkHref } from '../utils/path.js'

export const type = 'productDetail'
export const label = 'Product Detail'

export const defaultProps = {
  showPrice: true,
  ctaEnabled: false,
  ctaLabel: 'Contact us about this product',
  ctaTarget: 'home',
}

export const fields = [
  { key: 'showPrice', label: 'Show price', type: FIELD_TYPES.BOOLEAN },
  { key: 'ctaEnabled', label: 'Show button', type: FIELD_TYPES.BOOLEAN },
  { key: 'ctaLabel', label: 'Button label', type: FIELD_TYPES.TEXT },
  { key: 'ctaTarget', label: 'Button links to', type: FIELD_TYPES.PAGE_LINK },
]

// Shown when this section is previewed without a specific product bound to it —
// e.g. opening the "product" template page directly rather than one of the
// generated product-{slug} pages.
const SAMPLE_PRODUCT = {
  name: 'Sample Product',
  price: '$29.00',
  image: '',
  category: '',
  description: 'This section shows each product’s real details once your product pages are generated.',
}

// This section's content isn't in section.props — it renders whichever product
// the page is currently bound to (context.product), set by the export/preview
// pipeline for the reserved "product" template page.
export function renderHTML(props, { product, pages } = {}) {
  const p = { ...defaultProps, ...props }
  const item = product || SAMPLE_PRODUCT

  const cta = p.ctaEnabled
    ? `<a class="product-detail-cta" href="${escapeHtml(resolveLinkHref(p.ctaTarget, pages))}">${escapeHtml(p.ctaLabel)}</a>`
    : ''

  return `
<section class="product-detail-section">
  <div class="product-detail-inner">
    <div class="product-detail-image">${
      item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" />` : ''
    }</div>
    <div class="product-detail-info">
      ${item.category ? `<p class="product-detail-category">${escapeHtml(item.category)}</p>` : ''}
      <h1 class="product-detail-name">${escapeHtml(item.name)}</h1>
      ${p.showPrice && item.price ? `<p class="product-detail-price">${escapeHtml(item.price)}</p>` : ''}
      <p class="product-detail-description">${escapeHtml(item.description || item.shortDescription || '')}</p>
      ${cta}
    </div>
  </div>
</section>`.trim()
}

export const css = `
.product-detail-section { width: 100%; padding: 48px 24px; }
.product-detail-inner { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
.product-detail-image { aspect-ratio: 1; background: #f3f4f6; border-radius: 12px; overflow: hidden; }
.product-detail-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.product-detail-category { font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em; color: #6b7280; margin: 0 0 8px; }
.product-detail-name { font-size: 32px; font-weight: 700; margin: 0 0 12px; }
.product-detail-price { font-size: 24px; font-weight: 600; color: #4f46e5; margin: 0 0 20px; }
.product-detail-description { font-size: 15px; line-height: 1.7; color: #374151; margin: 0 0 24px; white-space: pre-wrap; }
.product-detail-cta {
  display: inline-block; padding: 12px 28px; border-radius: 6px; background: #111827; color: #fff;
  text-decoration: none; font-weight: 600; font-size: 14px;
}
@media (max-width: 720px) {
  .product-detail-inner { grid-template-columns: 1fr; }
}
`
