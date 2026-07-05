import { InlineText } from '../InlineText'
import { useEditorStore } from '../../store/editorStore'

export function PricingEditor({ props, onChange }) {
  const { heading, tiers } = props
  const goToPageByName = useEditorStore((s) => s.goToPageByName)

  return (
    <section className="w-full px-4 py-10 @md:px-6 @md:py-16">
      <div className="max-w-4xl mx-auto">
        <InlineText
          as="h2"
          className="text-xl @md:text-3xl font-semibold mb-6 text-center outline-none"
          value={heading}
          onChange={(v) => onChange('heading', v)}
        />
        {(tiers || []).length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">
            No plans yet — add some from the settings panel.
          </p>
        ) : (
          <div className="grid gap-6 @md:grid-cols-2 @lg:grid-cols-3 items-start">
            {(tiers || []).map((tier, i) => (
              <div
                key={i}
                className={`border rounded-lg p-6 text-center ${
                  tier.highlighted ? 'border-indigo-500 shadow-lg' : 'border-gray-200'
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                <p className="text-3xl font-bold mb-4">
                  {tier.price}
                  {tier.period && <span className="text-sm font-normal text-gray-500"> / {tier.period}</span>}
                </p>
                <ul className="text-left text-sm mb-6">
                  {(tier.features || []).map((f, fi) => (
                    <li key={fi} className="py-1.5 border-t border-gray-100 first:border-t-0">
                      {f}
                    </li>
                  ))}
                </ul>
                {tier.ctaLabel && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      goToPageByName(tier.ctaTarget)
                    }}
                    className="inline-block px-6 py-2 rounded bg-indigo-600 text-white text-sm font-semibold no-underline"
                  >
                    {tier.ctaLabel}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
