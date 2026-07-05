import { InlineText } from '../InlineText'
import { useEditorStore } from '../../store/editorStore'

export function FooterEditor({ props, onChange }) {
  const { text, links, bgColor, textColor } = props
  const goToPageByName = useEditorStore((s) => s.goToPageByName)

  return (
    <footer className="w-full px-6 py-8" style={{ background: bgColor, color: textColor }}>
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <InlineText
          as="p"
          className="text-sm outline-none m-0"
          value={text}
          onChange={(v) => onChange('text', v)}
        />
        <ul className="flex gap-4 list-none m-0 p-0">
          {(links || []).map((link, i) => (
            <li key={i}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  goToPageByName(link.target)
                }}
                className="text-inherit opacity-80 no-underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
