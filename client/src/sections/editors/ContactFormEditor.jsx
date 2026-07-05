import { InlineText } from '../InlineText'

export function ContactFormEditor({ props, onChange }) {
  const { heading, subtitle, collectPhone, submitLabel, bgColor, textColor } = props

  return (
    <section className="w-full px-4 py-10 @md:px-6 @md:py-16" style={{ background: bgColor, color: textColor }}>
      <div className="max-w-md mx-auto text-center">
        <InlineText
          as="h2"
          className="text-2xl font-semibold mb-2 outline-none"
          value={heading}
          onChange={(v) => onChange('heading', v)}
        />
        <InlineText
          as="p"
          className="text-sm opacity-80 mb-6 outline-none"
          value={subtitle}
          onChange={(v) => onChange('subtitle', v)}
        />
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3 text-left">
          <input
            type="text"
            disabled
            placeholder="Your name"
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white/50"
          />
          <input
            type="email"
            disabled
            placeholder="Your email"
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white/50"
          />
          {collectPhone && (
            <input
              type="tel"
              disabled
              placeholder="Your phone number (optional)"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-white/50"
            />
          )}
          <textarea
            disabled
            placeholder="Your message"
            rows={4}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white/50"
          />
          <button
            type="submit"
            disabled
            className="rounded px-5 py-2 text-sm font-semibold text-white"
            style={{ background: textColor }}
          >
            {submitLabel}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-3">Preview only — the form works on your published site.</p>
      </div>
    </section>
  )
}
