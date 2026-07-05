import { FIELD_TYPES } from '../fieldTypes.js'
import { escapeHtml, resolveLinkHref } from '../utils/path.js'

export const type = 'pricing'
export const label = 'Pricing'

export const defaultProps = {
  heading: 'Pricing',
  tiers: [],
}

export const fields = [
  { key: 'heading', label: 'Heading', type: FIELD_TYPES.TEXT },
  {
    key: 'tiers',
    label: 'Plans',
    type: FIELD_TYPES.REPEATER,
    itemLabel: 'plan',
    itemFields: [
      { key: 'name', label: 'Plan name', type: FIELD_TYPES.TEXT },
      { key: 'price', label: 'Price', type: FIELD_TYPES.TEXT },
      { key: 'period', label: 'Billing period', type: FIELD_TYPES.TEXT },
      { key: 'features', label: 'Features', type: FIELD_TYPES.LIST },
      { key: 'highlighted', label: 'Highlight this plan', type: FIELD_TYPES.BOOLEAN },
      { key: 'ctaLabel', label: 'Button label', type: FIELD_TYPES.TEXT },
      { key: 'ctaTarget', label: 'Button links to', type: FIELD_TYPES.PAGE_LINK },
    ],
  },
]

export function renderHTML(props, { pages } = {}) {
  const p = { ...defaultProps, ...props }
  const tiers = (p.tiers || [])
    .map((tier) => {
      const features = (tier.features || [])
        .map((f) => `<li>${escapeHtml(f)}</li>`)
        .join('')
      const cta = tier.ctaLabel
        ? `<a class="pricing-cta" href="${escapeHtml(resolveLinkHref(tier.ctaTarget, pages))}">${escapeHtml(tier.ctaLabel)}</a>`
        : ''
      return `
    <div class="pricing-tier ${tier.highlighted ? 'pricing-tier--highlighted' : ''}">
      <h3 class="pricing-tier-name">${escapeHtml(tier.name || '')}</h3>
      <p class="pricing-tier-price">${escapeHtml(tier.price || '')}<span class="pricing-tier-period">${tier.period ? ` / ${escapeHtml(tier.period)}` : ''}</span></p>
      <ul class="pricing-tier-features">${features}</ul>
      ${cta}
    </div>`
    })
    .join('')

  return `
<section class="pricing-section">
  <div class="pricing-inner">
    <h2 class="pricing-heading" data-editable="heading">${escapeHtml(p.heading)}</h2>
    <div class="pricing-grid">${tiers}</div>
  </div>
</section>`.trim()
}

export const css = `
.pricing-section { width: 100%; padding: 64px 24px; }
.pricing-inner { max-width: 1024px; margin: 0 auto; }
.pricing-heading { font-size: 32px; font-weight: 600; margin: 0 0 32px; text-align: center; }
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; align-items: start; }
.pricing-tier { border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; text-align: center; }
.pricing-tier--highlighted { border-color: #6366f1; box-shadow: 0 4px 12px rgba(99,102,241,0.15); }
.pricing-tier-name { font-size: 18px; font-weight: 600; margin: 0 0 8px; }
.pricing-tier-price { font-size: 32px; font-weight: 700; margin: 0 0 16px; }
.pricing-tier-period { font-size: 14px; font-weight: 400; color: #6b7280; }
.pricing-tier-features { list-style: none; margin: 0 0 24px; padding: 0; text-align: left; }
.pricing-tier-features li { padding: 6px 0; border-top: 1px solid #f3f4f6; font-size: 14px; }
.pricing-tier-features li:first-child { border-top: none; }
.pricing-cta { display: inline-block; padding: 10px 24px; border-radius: 6px; background: #6366f1; color: #fff; text-decoration: none; font-weight: 600; font-size: 14px; }
`
