import { InlineText } from '../InlineText'

export function TestimonialsEditor({ props, onChange }) {
  const { heading, items } = props

  return (
    <section className="w-full px-4 py-10 @md:px-6 @md:py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <InlineText
          as="h2"
          className="text-xl @md:text-3xl font-semibold mb-6 text-center outline-none"
          value={heading}
          onChange={(v) => onChange('heading', v)}
        />
        {(items || []).length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">
            No testimonials yet — add some from the settings panel.
          </p>
        ) : (
          <div className="grid gap-6 @md:grid-cols-2 @lg:grid-cols-3">
            {(items || []).map((item, i) => (
              <figure key={i} className="bg-white rounded-lg shadow-sm p-5 m-0">
                <blockquote className="text-sm text-gray-700 leading-relaxed mb-4">{item.quote}</blockquote>
                <figcaption className="flex flex-col">
                  <span className="font-semibold text-sm">{item.name}</span>
                  {item.role && <span className="text-xs text-gray-500">{item.role}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
