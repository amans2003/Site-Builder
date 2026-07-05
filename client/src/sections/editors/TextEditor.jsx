import { InlineText } from '../InlineText'

const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }

export function TextEditor({ props, onChange }) {
  const { heading, body, align, bgColor, textColor } = props

  return (
    <section
      className="w-full px-4 py-8 @md:px-6 @md:py-16"
      style={{ background: bgColor, color: textColor }}
    >
      <div className={`max-w-2xl mx-auto ${alignClass[align] || 'text-left'}`}>
        <InlineText
          as="h2"
          className="text-xl @md:text-3xl font-semibold mb-4 outline-none"
          value={heading}
          onChange={(v) => onChange('heading', v)}
        />
        <InlineText
          as="p"
          className="text-base leading-relaxed outline-none"
          value={body}
          onChange={(v) => onChange('body', v)}
        />
      </div>
    </section>
  )
}
