import { InlineText } from '../InlineText'
import { useEditorStore } from '../../store/editorStore'

export function HeroEditor({ props, onChange }) {
  const { title, subtitle, bgImage, bgColor, textColor, cta } = props
  const goToPageByName = useEditorStore((s) => s.goToPageByName)

  const bgStyle = bgImage
    ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: bgColor }

  return (
    <section
      className="w-full px-4 py-10 @md:px-6 @md:py-24 text-center"
      style={{ ...bgStyle, color: textColor }}
    >
      <div className="max-w-2xl mx-auto">
        <InlineText
          as="h1"
          className="text-2xl @md:text-5xl font-bold mb-4 outline-none"
          value={title}
          onChange={(v) => onChange('title', v)}
        />
        <InlineText
          as="p"
          className="text-sm @md:text-xl opacity-85 outline-none"
          value={subtitle}
          onChange={(v) => onChange('subtitle', v)}
        />
        {cta?.enabled && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              goToPageByName(cta.target)
            }}
            className="inline-block mt-6 px-6 py-2.5 rounded bg-white text-gray-900 font-semibold no-underline"
          >
            {cta.label}
          </a>
        )}
      </div>
    </section>
  )
}
