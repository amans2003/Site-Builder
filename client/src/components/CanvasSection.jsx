import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getSection } from 'shared'
import { getEditorComponent } from '../sections/editorRegistry'
import { CustomCodeEditor } from '../sections/editors/CustomCodeEditor'
import { SectionErrorBoundary } from './SectionErrorBoundary'
import { useEditorStore } from '../store/editorStore'

export function CanvasSection({ section }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId)
  const selectSection = useEditorStore((s) => s.selectSection)
  const updateSectionProp = useEditorStore((s) => s.updateSectionProp)
  const updateGlobalSectionProp = useEditorStore((s) => s.updateGlobalSectionProp)
  const globalSections = useEditorStore((s) => s.project.globalSections)

  const Editor = getEditorComponent(section.type)
  const isSelected = selectedSectionId === section.id
  const globalEntry = section.globalId ? globalSections?.find((g) => g.id === section.globalId) : null
  const effectiveProps = globalEntry ? globalEntry.props : section.props
  const isOverridden = section.type !== 'customCode' && effectiveProps?._override?.enabled
  const rendersIframe = isOverridden || section.type === 'customCode'

  // Defends against partial/legacy data (e.g. a section saved before a schema
  // change, or Mongoose's minimize stripping an empty props object entirely) —
  // every Editor component below assumes its expected fields are present.
  const mergedProps = Editor
    ? { ...structuredClone(getSection(section.type).defaultProps), ...effectiveProps }
    : effectiveProps
  const mergedOverride = isOverridden
    ? { ...structuredClone(getSection('customCode').defaultProps), ...effectiveProps._override }
    : null

  function handleChange(path, value) {
    if (section.globalId) updateGlobalSectionProp(section.globalId, path, value)
    else updateSectionProp(section.id, path, value)
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation()
        selectSection(section.id)
      }}
      className={`relative group ${isSelected ? 'outline outline-2 outline-blue-500 outline-offset-[-2px]' : ''}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="absolute left-1 top-1 z-10 cursor-grab active:cursor-grabbing bg-white/90 border border-gray-200 rounded px-1.5 py-0.5 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Drag to reorder"
      >
        &#x2630;
      </button>
      {section.globalId && (
        <span className="absolute right-1 top-1 z-10 bg-indigo-100 text-indigo-600 text-[10px] font-medium px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          Reused
        </span>
      )}
      {rendersIframe && (
        // A same-document element to catch clicks on top of the iframe: clicks inside an
        // <iframe> land in its own document and never bubble to this div's onClick, so
        // without this overlay the section could never be re-selected by clicking on it.
        <div className="absolute inset-0 z-[5]" />
      )}
      <SectionErrorBoundary sectionType={section.type}>
        {isOverridden ? (
          <CustomCodeEditor props={mergedOverride} />
        ) : Editor ? (
          <Editor props={mergedProps} onChange={handleChange} />
        ) : (
          <div className="p-4 text-sm text-red-500">Unknown section type: {section.type}</div>
        )}
      </SectionErrorBoundary>
    </div>
  )
}
