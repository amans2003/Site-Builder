import * as navbar from './navbar.js'
import * as hero from './hero.js'
import * as textSection from './textSection.js'
import * as gallery from './gallery.js'
import * as testimonials from './testimonials.js'
import * as pricing from './pricing.js'
import * as productGrid from './productGrid.js'
import * as productDetail from './productDetail.js'
import * as contactForm from './contactForm.js'
import * as footer from './footer.js'
import * as customCode from './customCode.js'

const modules = [
  navbar,
  hero,
  textSection,
  gallery,
  testimonials,
  pricing,
  productGrid,
  productDetail,
  contactForm,
  footer,
  customCode,
]

export const sectionRegistry = Object.fromEntries(modules.map((m) => [m.type, m]))

export const sectionList = modules.map((m) => ({
  type: m.type,
  label: m.label,
  defaultProps: m.defaultProps,
  fields: m.fields,
}))

export function getSection(type) {
  const section = sectionRegistry[type]
  if (!section) throw new Error(`Unknown section type: ${type}`)
  return section
}
