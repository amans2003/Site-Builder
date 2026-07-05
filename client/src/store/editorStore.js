import { create } from 'zustand'
import { getSection, setByPath, uid, slugify } from 'shared'
import { updateProject } from '../api/projects'

const MAX_HISTORY = 50

const emptyProject = () => ({
  _id: null,
  name: 'Untitled site',
  pages: [{ name: 'home', sections: [] }],
  globalSections: [],
})

function pushHistory(state) {
  return { past: [...state.past, state.project].slice(-MAX_HISTORY), future: [] }
}

export const useEditorStore = create((set, get) => ({
  project: emptyProject(),
  currentPageIndex: 0,
  selectedSectionId: null,
  device: 'desktop',
  dirty: false,
  saving: false,
  saveError: null,
  past: [],
  future: [],
  previewProductId: null,

  loadProject(project) {
    clearTimeout(autosaveTimer)
    set({
      project,
      currentPageIndex: 0,
      selectedSectionId: null,
      dirty: false,
      saving: false,
      saveError: null,
      past: [],
      future: [],
    })
  },

  resetProject() {
    clearTimeout(autosaveTimer)
    set({
      project: emptyProject(),
      currentPageIndex: 0,
      selectedSectionId: null,
      dirty: false,
      saving: false,
      saveError: null,
      past: [],
      future: [],
    })
  },

  setDevice(device) {
    set({ device })
  },

  selectSection(id) {
    set({ selectedSectionId: id })
  },

  renameProject(name) {
    set((state) => ({ project: { ...state.project, name }, dirty: true, ...pushHistory(state) }))
  },

  addSection(type, atIndex) {
    const def = getSection(type)
    const section = { id: uid('section'), type, props: structuredClone(def.defaultProps) }

    set((state) => {
      const pages = structuredClone(state.project.pages)
      const sections = pages[state.currentPageIndex].sections
      const insertAt = atIndex ?? sections.length
      sections.splice(insertAt, 0, section)
      return {
        project: { ...state.project, pages },
        selectedSectionId: section.id,
        dirty: true,
        ...pushHistory(state),
      }
    })
  },

  removeSection(sectionId) {
    set((state) => {
      const pages = structuredClone(state.project.pages)
      const page = pages[state.currentPageIndex]
      page.sections = page.sections.filter((s) => s.id !== sectionId)
      const selectedSectionId = state.selectedSectionId === sectionId ? null : state.selectedSectionId
      return { project: { ...state.project, pages }, selectedSectionId, dirty: true, ...pushHistory(state) }
    })
  },

  reorderSections(oldIndex, newIndex) {
    set((state) => {
      const pages = structuredClone(state.project.pages)
      const sections = pages[state.currentPageIndex].sections
      const [moved] = sections.splice(oldIndex, 1)
      sections.splice(newIndex, 0, moved)
      return { project: { ...state.project, pages }, dirty: true, ...pushHistory(state) }
    })
  },

  updateSectionProp(sectionId, path, value) {
    set((state) => {
      const pages = structuredClone(state.project.pages)
      const page = pages[state.currentPageIndex]
      const section = page.sections.find((s) => s.id === sectionId)
      if (!section) return {}
      section.props = setByPath(section.props, path, value)
      return { project: { ...state.project, pages }, dirty: true, ...pushHistory(state) }
    })
  },

  // Converts a page-local section into a reusable one: its content moves into
  // project.globalSections under a new id, and this placement becomes a
  // reference to it. Editing it afterward (from any page it's placed on)
  // updates the shared definition, so every placement stays in sync.
  makeSectionGlobal(sectionId) {
    set((state) => {
      const pages = structuredClone(state.project.pages)
      const section = pages[state.currentPageIndex].sections.find((s) => s.id === sectionId)
      if (!section || section.globalId) return {}

      const globalId = uid('global')
      const globalSections = [
        ...structuredClone(state.project.globalSections || []),
        { id: globalId, type: section.type, props: section.props },
      ]
      section.globalId = globalId
      section.props = {}

      return { project: { ...state.project, pages, globalSections }, dirty: true, ...pushHistory(state) }
    })
  },

  // Detaches a placement from its shared definition, turning it back into an
  // independent local copy (the shared definition itself is left untouched,
  // in case other pages still use it).
  unlinkGlobalSection(sectionId) {
    set((state) => {
      const pages = structuredClone(state.project.pages)
      const section = pages[state.currentPageIndex].sections.find((s) => s.id === sectionId)
      if (!section || !section.globalId) return {}

      const global = (state.project.globalSections || []).find((g) => g.id === section.globalId)
      section.props = global ? structuredClone(global.props) : {}
      delete section.globalId

      return { project: { ...state.project, pages }, dirty: true, ...pushHistory(state) }
    })
  },

  updateGlobalSectionProp(globalId, path, value) {
    set((state) => {
      const globalSections = structuredClone(state.project.globalSections || [])
      const global = globalSections.find((g) => g.id === globalId)
      if (!global) return {}
      global.props = setByPath(global.props, path, value)
      return { project: { ...state.project, globalSections }, dirty: true, ...pushHistory(state) }
    })
  },

  // Places an existing reusable section onto the current page.
  addGlobalSectionToPage(globalId, atIndex) {
    set((state) => {
      const global = (state.project.globalSections || []).find((g) => g.id === globalId)
      if (!global) return {}

      const pages = structuredClone(state.project.pages)
      const sections = pages[state.currentPageIndex].sections
      const insertAt = atIndex ?? sections.length
      const section = { id: uid('section'), type: global.type, props: {}, globalId }
      sections.splice(insertAt, 0, section)

      return {
        project: { ...state.project, pages },
        selectedSectionId: section.id,
        dirty: true,
        ...pushHistory(state),
      }
    })
  },

  setCurrentPageIndex(index) {
    set((state) => {
      if (index < 0 || index >= state.project.pages.length) return {}
      return { currentPageIndex: index, selectedSectionId: null }
    })
  },

  goToPageByName(name) {
    const state = get()
    const index = state.project.pages.findIndex((p) => p.name === name)
    if (index === -1) return
    set({ currentPageIndex: index, selectedSectionId: null })
  },

  setPreviewProductId(productId) {
    set({ previewProductId: productId })
  },

  addPage(label) {
    set((state) => {
      const existingNames = new Set(state.project.pages.map((p) => p.name))
      let base = slugify(label || 'page')
      let name = base
      let i = 2
      while (existingNames.has(name)) {
        name = `${base}-${i}`
        i += 1
      }
      const pages = [...structuredClone(state.project.pages), { name, sections: [] }]
      return {
        project: { ...state.project, pages },
        currentPageIndex: pages.length - 1,
        selectedSectionId: null,
        dirty: true,
        ...pushHistory(state),
      }
    })
  },

  renamePage(index, label) {
    set((state) => {
      const pages = structuredClone(state.project.pages)
      const page = pages[index]
      if (!page) return {}
      const existingNames = new Set(pages.filter((_, i) => i !== index).map((p) => p.name))
      let base = slugify(label || page.name)
      let name = base
      let i = 2
      while (existingNames.has(name)) {
        name = `${base}-${i}`
        i += 1
      }
      page.name = name
      return { project: { ...state.project, pages }, dirty: true, ...pushHistory(state) }
    })
  },

  removePage(index) {
    set((state) => {
      if (state.project.pages.length <= 1) return {}
      const pages = structuredClone(state.project.pages)
      pages.splice(index, 1)
      const currentPageIndex = Math.min(state.currentPageIndex, pages.length - 1)
      return {
        project: { ...state.project, pages },
        currentPageIndex,
        selectedSectionId: null,
        dirty: true,
        ...pushHistory(state),
      }
    })
  },

  getCurrentPage() {
    const state = get()
    return state.project.pages[state.currentPageIndex]
  },

  markSaved(savedProject) {
    set({ project: savedProject ?? get().project, dirty: false })
  },

  undo() {
    set((state) => {
      if (state.past.length === 0) return {}
      const previous = state.past[state.past.length - 1]
      const past = state.past.slice(0, -1)
      const future = [state.project, ...state.future].slice(0, MAX_HISTORY)
      const currentPageIndex = Math.min(state.currentPageIndex, previous.pages.length - 1)
      return { project: previous, past, future, dirty: true, selectedSectionId: null, currentPageIndex }
    })
  },

  redo() {
    set((state) => {
      if (state.future.length === 0) return {}
      const next = state.future[0]
      const future = state.future.slice(1)
      const past = [...state.past, state.project].slice(-MAX_HISTORY)
      const currentPageIndex = Math.min(state.currentPageIndex, next.pages.length - 1)
      return { project: next, past, future, dirty: true, selectedSectionId: null, currentPageIndex }
    })
  },

  async saveProject() {
    if (get().saving) {
      clearTimeout(autosaveTimer)
      autosaveTimer = setTimeout(() => get().saveProject(), 500)
      return
    }
    const { project } = get()
    if (!project._id) return

    set({ saving: true, saveError: null })
    try {
      const saved = await updateProject(project._id, {
        name: project.name,
        pages: project.pages,
        globalSections: project.globalSections,
      })
      set({ project: saved, dirty: false, saving: false })
    } catch (err) {
      set({ saving: false, saveError: err.response?.data?.error || 'Save failed' })
    }
  },
}))

let autosaveTimer = null

useEditorStore.subscribe((state) => {
  if (state.dirty) {
    clearTimeout(autosaveTimer)
    autosaveTimer = setTimeout(() => {
      useEditorStore.getState().saveProject()
    }, 1500)
  }
})
