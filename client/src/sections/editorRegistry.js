import { sectionList } from 'shared'
import { NavbarEditor } from './editors/NavbarEditor'
import { HeroEditor } from './editors/HeroEditor'
import { TextEditor } from './editors/TextEditor'
import { GalleryEditor } from './editors/GalleryEditor'
import { TestimonialsEditor } from './editors/TestimonialsEditor'
import { PricingEditor } from './editors/PricingEditor'
import { ProductGridEditor } from './editors/ProductGridEditor'
import { ProductDetailEditor } from './editors/ProductDetailEditor'
import { ContactFormEditor } from './editors/ContactFormEditor'
import { FooterEditor } from './editors/FooterEditor'
import { CustomCodeEditor } from './editors/CustomCodeEditor'

const editorComponents = {
  navbar: NavbarEditor,
  hero: HeroEditor,
  text: TextEditor,
  gallery: GalleryEditor,
  testimonials: TestimonialsEditor,
  pricing: PricingEditor,
  productGrid: ProductGridEditor,
  productDetail: ProductDetailEditor,
  contactForm: ContactFormEditor,
  footer: FooterEditor,
  customCode: CustomCodeEditor,
}

export const sectionTypes = sectionList.map((section) => ({
  ...section,
  Editor: editorComponents[section.type],
}))

export function getEditorComponent(type) {
  return editorComponents[type]
}
