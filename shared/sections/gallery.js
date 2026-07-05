import { FIELD_TYPES } from '../fieldTypes.js'
import { escapeHtml } from '../utils/path.js'

export const type = 'gallery'
export const label = 'Gallery'

export const defaultProps = {
  heading: 'Our Gallery',
  columns: '3',
  images: [],
}

export const fields = [
  { key: 'heading', label: 'Heading', type: FIELD_TYPES.TEXT },
  {
    key: 'columns',
    label: 'Columns',
    type: FIELD_TYPES.SELECT,
    options: ['2', '3', '4'],
  },
  {
    key: 'images',
    label: 'Images',
    type: FIELD_TYPES.REPEATER,
    itemLabel: 'image',
    itemFields: [
      { key: 'src', label: 'Image', type: FIELD_TYPES.IMAGE },
      { key: 'alt', label: 'Alt text', type: FIELD_TYPES.TEXT },
    ],
  },
]

export function renderHTML(props) {
  const p = { ...defaultProps, ...props }
  const items = (p.images || [])
    .map(
      (img) =>
        `<figure class="gallery-item">${
          img.src ? `<img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || '')}" />` : ''
        }</figure>`,
    )
    .join('')

  return `
<section class="gallery-section">
  <div class="gallery-inner">
    <h2 class="gallery-heading" data-editable="heading">${escapeHtml(p.heading)}</h2>
    <div class="gallery-grid gallery-grid--cols-${escapeHtml(p.columns)}">${items}</div>
  </div>
</section>`.trim()
}

export const css = `
.gallery-section { width: 100%; padding: 64px 24px; }
.gallery-inner { max-width: 1024px; margin: 0 auto; }
.gallery-heading { font-size: 32px; font-weight: 600; margin: 0 0 32px; text-align: center; }
.gallery-grid { display: grid; gap: 16px; }
.gallery-grid--cols-2 { grid-template-columns: repeat(2, 1fr); }
.gallery-grid--cols-3 { grid-template-columns: repeat(3, 1fr); }
.gallery-grid--cols-4 { grid-template-columns: repeat(4, 1fr); }
.gallery-item { margin: 0; aspect-ratio: 1; background: #f3f4f6; border-radius: 8px; overflow: hidden; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
@media (max-width: 640px) {
  .gallery-grid--cols-2, .gallery-grid--cols-3, .gallery-grid--cols-4 { grid-template-columns: repeat(2, 1fr); }
}
`
