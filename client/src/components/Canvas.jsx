import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEditorStore } from '../store/editorStore'
import { CanvasSection } from './CanvasSection'

const DEVICE_WIDTHS = { desktop: '100%', tablet: '768px', mobile: '375px' }

export function Canvas() {
  const project = useEditorStore((s) => s.project)
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex)
  const device = useEditorStore((s) => s.device)
  const reorderSections = useEditorStore((s) => s.reorderSections)
  const selectSection = useEditorStore((s) => s.selectSection)

  const page = project.pages[currentPageIndex]
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = page.sections.findIndex((s) => s.id === active.id)
    const newIndex = page.sections.findIndex((s) => s.id === over.id)
    reorderSections(oldIndex, newIndex)
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-100 p-6" onClick={() => selectSection(null)}>
      <div
        className="@container relative mx-auto bg-white shadow-sm min-h-[400px] transition-[width] duration-200"
        // `transform` makes this the containing block for any `position: fixed`
        // descendant (e.g. the navbar's mobile drawer) — without it, a fixed drawer
        // would cover the real browser viewport instead of staying inside this
        // simulated device frame.
        style={{ width: DEVICE_WIDTHS[device], maxWidth: '100%', transform: 'translateZ(0)' }}
      >
        {page.sections.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-sm">
            Add a section from the sidebar to get started.
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={page.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {page.sections.map((section) => (
                <CanvasSection key={section.id} section={section} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
