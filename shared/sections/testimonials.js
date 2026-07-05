import { FIELD_TYPES } from '../fieldTypes.js'
import { escapeHtml } from '../utils/path.js'

export const type = 'testimonials'
export const label = 'Testimonials'

export const defaultProps = {
  heading: 'What people say',
  items: [],
}

export const fields = [
  { key: 'heading', label: 'Heading', type: FIELD_TYPES.TEXT },
  {
    key: 'items',
    label: 'Testimonials',
    type: FIELD_TYPES.REPEATER,
    itemLabel: 'testimonial',
    itemFields: [
      { key: 'quote', label: 'Quote', type: FIELD_TYPES.TEXTAREA },
      { key: 'name', label: 'Name', type: FIELD_TYPES.TEXT },
      { key: 'role', label: 'Role / Company', type: FIELD_TYPES.TEXT },
    ],
  },
]

export function renderHTML(props) {
  const p = { ...defaultProps, ...props }
  const cards = (p.items || [])
    .map(
      (item) => `
    <figure class="testimonial-card">
      <blockquote>${escapeHtml(item.quote || '')}</blockquote>
      <figcaption>
        <span class="testimonial-name">${escapeHtml(item.name || '')}</span>
        ${item.role ? `<span class="testimonial-role">${escapeHtml(item.role)}</span>` : ''}
      </figcaption>
    </figure>`,
    )
    .join('')

  return `
<section class="testimonials-section">
  <div class="testimonials-inner">
    <h2 class="testimonials-heading" data-editable="heading">${escapeHtml(p.heading)}</h2>
    <div class="testimonials-grid">${cards}</div>
  </div>
</section>`.trim()
}

export const css = `
.testimonials-section { width: 100%; padding: 64px 24px; background: #f9fafb; }
.testimonials-inner { max-width: 1024px; margin: 0 auto; }
.testimonials-heading { font-size: 32px; font-weight: 600; margin: 0 0 32px; text-align: center; }
.testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
.testimonial-card { margin: 0; background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.testimonial-card blockquote { margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #374151; }
.testimonial-card figcaption { display: flex; flex-direction: column; }
.testimonial-name { font-weight: 600; font-size: 14px; }
.testimonial-role { font-size: 13px; color: #6b7280; }
`
