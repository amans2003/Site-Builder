import { FIELD_TYPES } from '../fieldTypes.js'
import { escapeHtml } from '../utils/path.js'

export const type = 'text'
export const label = 'Text / About'

export const defaultProps = {
  heading: 'About Us',
  body: 'Tell your story here. Describe what makes your business unique.',
  align: 'left',
  bgColor: '#ffffff',
  textColor: '#111827',
}

export const fields = [
  { key: 'heading', label: 'Heading', type: FIELD_TYPES.TEXT },
  { key: 'body', label: 'Body text', type: FIELD_TYPES.TEXTAREA },
  {
    key: 'align',
    label: 'Text alignment',
    type: FIELD_TYPES.SELECT,
    options: ['left', 'center', 'right'],
  },
  { key: 'bgColor', label: 'Background color', type: FIELD_TYPES.COLOR },
  { key: 'textColor', label: 'Text color', type: FIELD_TYPES.COLOR },
]

export function renderHTML(props) {
  const p = { ...defaultProps, ...props }
  return `
<section class="text-section text-section--${p.align}" style="background:${escapeHtml(p.bgColor)}; color:${escapeHtml(p.textColor)}">
  <div class="text-inner">
    <h2 class="text-heading" data-editable="heading">${escapeHtml(p.heading)}</h2>
    <p class="text-body" data-editable="body">${escapeHtml(p.body)}</p>
  </div>
</section>`.trim()
}

export const css = `
.text-section { width: 100%; padding: 64px 24px; }
.text-inner { max-width: 720px; margin: 0 auto; }
.text-section--left .text-inner { text-align: left; }
.text-section--center .text-inner { text-align: center; }
.text-section--right .text-inner { text-align: right; }
.text-heading { font-size: 32px; margin: 0 0 16px; font-weight: 600; }
.text-body { font-size: 16px; line-height: 1.6; margin: 0; }
@media (max-width: 640px) {
  .text-section { padding: 40px 16px; }
  .text-heading { font-size: 24px; }
}
`
