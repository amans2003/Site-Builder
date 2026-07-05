import { getByPath, getSection } from 'shared'
import { useEditorStore } from '../store/editorStore'
import { CodeField } from './fields/CodeField'
import { AiCodeGenerator } from './fields/AiCodeGenerator'
import { FieldControl } from './fields/FieldControl'
import { FieldWrapper } from './fields/FieldWrapper'

export function SettingsPanel() {
  const project = useEditorStore((s) => s.project)
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex)
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId)
  const updateSectionProp = useEditorStore((s) => s.updateSectionProp)
  const updateGlobalSectionProp = useEditorStore((s) => s.updateGlobalSectionProp)
  const removeSection = useEditorStore((s) => s.removeSection)
  const makeSectionGlobal = useEditorStore((s) => s.makeSectionGlobal)
  const unlinkGlobalSection = useEditorStore((s) => s.unlinkGlobalSection)

  const section = project.pages[currentPageIndex].sections.find((s) => s.id === selectedSectionId)

  if (!section) {
    return (
      <aside className="w-72 shrink-0 border-l border-gray-200 p-4 text-sm text-gray-400">
        Select a section to edit its settings.
      </aside>
    )
  }

  const globalEntry = section.globalId
    ? project.globalSections?.find((g) => g.id === section.globalId)
    : null
  const props = globalEntry ? globalEntry.props : section.props

  function updateProp(path, value) {
    if (section.globalId) updateGlobalSectionProp(section.globalId, path, value)
    else updateSectionProp(section.id, path, value)
  }

  const def = getSection(section.type)
  const isCustomCodeType = section.type === 'customCode'
  const overrideEnabled = !!props?._override?.enabled

  function toggleOverride(checked) {
    if (checked) {
      const customDefaults = getSection('customCode').defaultProps
      updateProp('_override', {
        enabled: true,
        html: props?._override?.html ?? customDefaults.html,
        css: props?._override?.css ?? '',
        js: props?._override?.js ?? '',
      })
    } else {
      updateProp('_override.enabled', false)
    }
  }

  return (
    <aside className="w-72 shrink-0 border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{def.label} settings</h3>
        <button
          type="button"
          onClick={() => removeSection(section.id)}
          className="text-xs text-red-500 hover:underline"
        >
          Delete section
        </button>
      </div>

      <div className="mb-4 pb-4 border-b border-gray-200">
        {section.globalId ? (
          <>
            <p className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-2.5 py-2 mb-2">
              Reusable section — editing it here updates every page it's placed on.
            </p>
            <button
              type="button"
              onClick={() => unlinkGlobalSection(section.id)}
              className="text-xs text-gray-500 hover:underline"
            >
              Unlink (make an independent copy)
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => makeSectionGlobal(section.id)}
            className="text-xs text-indigo-600 hover:underline"
          >
            Make reusable across pages
          </button>
        )}
      </div>

      {!isCustomCodeType && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <FieldWrapper label="Customize with code" inline>
            <input
              type="checkbox"
              checked={overrideEnabled}
              onChange={(e) => toggleOverride(e.target.checked)}
              className="h-4 w-4"
            />
          </FieldWrapper>
          {overrideEnabled && (
            <p className="text-xs text-gray-400 -mt-2">
              Replaces this section's normal rendering with your own HTML/CSS/JS.
            </p>
          )}
        </div>
      )}

      {overrideEnabled && !isCustomCodeType ? (
        <>
          <AiCodeGenerator
            key={section.id}
            initialMessages={props._override?._aiChat}
            onGenerated={(result, nextMessages) => {
              updateProp('_override.html', result.html)
              updateProp('_override.css', result.css)
              updateProp('_override.js', result.js)
              updateProp('_override._aiChat', nextMessages)
            }}
          />
          <CodeField
            label="HTML"
            fieldKey="html"
            value={props._override?.html}
            onChange={(v) => updateProp('_override.html', v)}
          />
          <CodeField
            label="CSS"
            fieldKey="css"
            value={props._override?.css}
            onChange={(v) => updateProp('_override.css', v)}
          />
          <CodeField
            label="JavaScript"
            fieldKey="js"
            value={props._override?.js}
            onChange={(v) => updateProp('_override.js', v)}
          />
        </>
      ) : (
        <>
          {isCustomCodeType && (
            <AiCodeGenerator
              key={section.id}
              initialMessages={props._aiChat}
              onGenerated={(result, nextMessages) => {
                updateProp('html', result.html)
                updateProp('css', result.css)
                updateProp('js', result.js)
                updateProp('_aiChat', nextMessages)
              }}
            />
          )}
          {def.fields.map((field) => (
            <FieldControl
              key={field.key}
              field={field}
              value={getByPath(props, field.key)}
              onChange={(v) => updateProp(field.key, v)}
              pages={project.pages}
            />
          ))}
        </>
      )}
    </aside>
  )
}
