import { getSection } from 'shared'
import { sectionTypes } from '../sections/editorRegistry'
import { useEditorStore } from '../store/editorStore'

function previewLabel(global) {
  const p = global.props || {}
  const text = p.heading || p.title || p.logo?.text || p.text || ''
  const label = getSection(global.type).label
  return text ? `${label}: ${text}` : label
}

export function Sidebar() {
  const addSection = useEditorStore((s) => s.addSection)
  const addGlobalSectionToPage = useEditorStore((s) => s.addGlobalSectionToPage)
  const globalSections = useEditorStore((s) => s.project.globalSections)

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 p-4 overflow-y-auto">
      {globalSections?.length > 0 && (
        <div className="mb-5 pb-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Reusable sections</h3>
          <div className="flex flex-col gap-2">
            {globalSections.map((global) => (
              <button
                key={global.id}
                type="button"
                onClick={() => addGlobalSectionToPage(global.id)}
                title="Add this reused section to the current page"
                className="text-left text-sm px-3 py-2 rounded border border-indigo-200 bg-indigo-50 hover:border-indigo-400 hover:bg-indigo-100 transition-colors truncate"
              >
                + {previewLabel(global)}
              </button>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-sm font-semibold text-gray-800 mb-3">Sections</h3>
      <div className="flex flex-col gap-2">
        {sectionTypes.map((section) => (
          <button
            key={section.type}
            type="button"
            onClick={() => addSection(section.type)}
            className="text-left text-sm px-3 py-2 rounded border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            + {section.label}
          </button>
        ))}
      </div>
    </aside>
  )
}
