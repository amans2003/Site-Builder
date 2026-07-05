import { FIELD_TYPES } from '../fieldTypes.js'
import { escapeHtml, resolveLinkHref } from '../utils/path.js'

export const type = 'productGrid'
export const label = 'Product Grid'

export const defaultProps = {
  heading: 'Our Products',
  columns: '3',
}

export const fields = [
  { key: 'heading', label: 'Heading', type: FIELD_TYPES.TEXT },
  {
    key: 'columns',
    label: 'Columns',
    type: FIELD_TYPES.SELECT,
    options: ['2', '3', '4'],
  },
]

// Product filenames mirror pageFilename's "index.html for home" convention: a
// fixed "product-" prefix keeps them from ever colliding with a real page name.
export function productFilename(slug) {
  return `product-${slug}.html`
}

// Unlike other sections, this one's content isn't in section.props — it lists
// whatever is in the project's Products collection (context.products), kept in
// sync automatically as products are added/removed/edited.
export function renderHTML(props, { products, pages } = {}) {
  const p = { ...defaultProps, ...props }
  const items = (products || [])
    .map((product) => {
      // Empty by default: falls back to the product's own auto-generated detail
      // page. Set on the product itself to send this card somewhere else instead.
      const href = product.link ? resolveLinkHref(product.link, pages) : productFilename(product.slug)
      return `
    <a class="product-card" href="${escapeHtml(href)}">
      <div class="product-card-image">${
        product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" />` : ''
      }</div>
      <div class="product-card-body">
        <h3 class="product-card-name">${escapeHtml(product.name)}</h3>
        ${product.price ? `<p class="product-card-price">${escapeHtml(product.price)}</p>` : ''}
        ${product.shortDescription ? `<p class="product-card-desc">${escapeHtml(product.shortDescription)}</p>` : ''}
      </div>
    </a>`
    })
    .join('')

  return `
<section class="product-grid-section">
  <div class="product-grid-inner">
    <h2 class="product-grid-heading" data-editable="heading">${escapeHtml(p.heading)}</h2>
    ${
      items
        ? `<div class="product-grid product-grid--cols-${escapeHtml(p.columns)}">${items}</div>`
        : `<p class="product-grid-empty">No products yet.</p>`
    }
  </div>
</section>`.trim()
}

export const css = `
.product-grid-section { width: 100%; padding: 64px 24px; }
.product-grid-inner { max-width: 1024px; margin: 0 auto; }
.product-grid-heading { font-size: 32px; font-weight: 600; margin: 0 0 32px; text-align: center; }
.product-grid-empty { text-align: center; color: #9ca3af; font-size: 14px; }
.product-grid { display: grid; gap: 20px; }
.product-grid--cols-2 { grid-template-columns: repeat(2, 1fr); }
.product-grid--cols-3 { grid-template-columns: repeat(3, 1fr); }
.product-grid--cols-4 { grid-template-columns: repeat(4, 1fr); }
.product-card {
  display: block; color: inherit; text-decoration: none; border: 1px solid #e5e7eb; border-radius: 10px;
  overflow: hidden; transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.product-card:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
.product-card-image { aspect-ratio: 1; background: #f3f4f6; }
.product-card-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.product-card-body { padding: 14px 16px; }
.product-card-name { font-size: 15px; font-weight: 600; margin: 0 0 4px; }
.product-card-price { font-size: 14px; font-weight: 600; color: #4f46e5; margin: 0 0 6px; }
.product-card-desc { font-size: 13px; color: #6b7280; margin: 0; }
@media (max-width: 640px) {
  .product-grid--cols-2, .product-grid--cols-3, .product-grid--cols-4 { grid-template-columns: repeat(2, 1fr); }
}
`
