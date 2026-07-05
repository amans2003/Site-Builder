import { InlineText } from '../InlineText'

const COLS_CLASS = { 2: 'grid-cols-2', 3: 'grid-cols-2 @md:grid-cols-3', 4: 'grid-cols-2 @md:grid-cols-4' }

export function GalleryEditor({ props, onChange }) {
  const { heading, columns, images } = props

  return (
    <section className="w-full px-4 py-10 @md:px-6 @md:py-16">
      <div className="max-w-4xl mx-auto">
        <InlineText
          as="h2"
          className="text-xl @md:text-3xl font-semibold mb-6 text-center outline-none"
          value={heading}
          onChange={(v) => onChange('heading', v)}
        />
        <div className={`grid gap-4 ${COLS_CLASS[columns] || COLS_CLASS[3]}`}>
          {(images || []).length === 0 ? (
            <p className="col-span-full text-center text-sm text-gray-400 py-8">
              No images yet — add some from the settings panel.
            </p>
          ) : (
            (images || []).map((img, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {img.src && <img src={img.src} alt={img.alt || ''} className="w-full h-full object-cover" />}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
