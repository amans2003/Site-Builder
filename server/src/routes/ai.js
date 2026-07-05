import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { askForJSON } from '../ai/provider.js'
import { sectionList, getSection, slugify, uid } from 'shared'

const MAX_PROMPT_LENGTH = 4000
const MAX_HISTORY_TURNS = 8
const MAX_HISTORY_ENTRY_LENGTH = 6000

const router = Router()
router.use(requireAuth)

function validatePrompt(req, res) {
  const { prompt } = req.body
  if (!prompt || !prompt.trim()) {
    res.status(400).json({ error: 'prompt is required' })
    return null
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    res.status(400).json({ error: `prompt must be under ${MAX_PROMPT_LENGTH} characters` })
    return null
  }
  return prompt.trim()
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return []
  return history
    .filter((turn) => turn && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.content === 'string')
    .slice(-MAX_HISTORY_TURNS)
    .map((turn) => ({ role: turn.role, content: turn.content.slice(0, MAX_HISTORY_ENTRY_LENGTH) }))
}

function sectionTypeExists(type) {
  try {
    getSection(type)
    return true
  } catch {
    return false
  }
}

function buildSectionCatalog() {
  return sectionList
    .map((s) => {
      const fieldSummary = s.fields.map((f) => `${f.key} (${f.type})`).join(', ')
      return `- "${s.type}" (${s.label}). Editable fields: ${fieldSummary}. Shape example: ${JSON.stringify(s.defaultProps)}`
    })
    .join('\n')
}

router.post('/generate-site', asyncHandler(async (req, res) => {
  const prompt = validatePrompt(req, res)
  if (!prompt) return

  const systemPrompt = `You design website content for a drag-and-drop page builder. Respond ONLY with a JSON object of this exact shape:
{"name": string, "pages": [{"name": string, "sections": [{"type": string, "props": object}]}]}

Available section types and their editable props:
${buildSectionCatalog()}

Rules:
- The first page's name must be "home".
- Every page should include a "navbar" section first and a "footer" section last, unless the user explicitly asks otherwise.
- Only use the section types listed above, and only include prop keys listed for that type.
- Write real, on-topic marketing copy based on the user's request — never placeholder lorem ipsum.
- Default to 2-4 pages unless the user asks for a specific number.`

  const parsed = await askForJSON(systemPrompt, prompt)
  if (!parsed || !Array.isArray(parsed.pages)) {
    return res.status(502).json({ error: 'AI returned an invalid response. Please try again.' })
  }

  const pages = parsed.pages
    .map((page, index) => {
      const name = index === 0 ? 'home' : slugify(page?.name || `page-${index + 1}`)
      const sections = (Array.isArray(page?.sections) ? page.sections : [])
        .filter((s) => s && typeof s.type === 'string' && sectionTypeExists(s.type))
        .map((s) => {
          const def = getSection(s.type)
          return {
            id: uid('section'),
            type: s.type,
            props: { ...structuredClone(def.defaultProps), ...(s.props && typeof s.props === 'object' ? s.props : {}) },
          }
        })
      return { name, sections }
    })
    .filter((page) => page.sections.length > 0)

  if (pages.length === 0) {
    return res.status(502).json({ error: 'AI did not return any usable sections. Please try again.' })
  }

  res.json({ name: typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : 'AI Generated Site', pages })
}))

router.post('/generate-code', asyncHandler(async (req, res) => {
  const prompt = validatePrompt(req, res)
  if (!prompt) return
  const history = sanitizeHistory(req.body.history)

  const systemPrompt = `You write self-contained HTML/CSS/JS snippets for a website page builder's custom code block.
Respond ONLY with a JSON object of this exact shape: {"html": string, "css": string, "js": string}.

Rules:
- HTML must be a fragment only (no <html>, <head>, or <body> tags).
- Scope CSS to classes used in the HTML fragment; avoid IDs that might collide with the rest of the page.
- JS must be vanilla JS with no external dependencies and must not use document.write.
- Keep it concise and directly address the user's request. Omit css or js entirely (empty string) if not needed.
- If earlier turns in this conversation already produced HTML/CSS/JS, treat the new request as a follow-up that refines or extends that existing code rather than starting over, unless the user clearly asks for something unrelated.`

  const parsed = await askForJSON(systemPrompt, prompt, history)
  if (!parsed) {
    return res.status(502).json({ error: 'AI returned an invalid response. Please try again.' })
  }

  res.json({
    html: typeof parsed.html === 'string' ? parsed.html : '',
    css: typeof parsed.css === 'string' ? parsed.css : '',
    js: typeof parsed.js === 'string' ? parsed.js : '',
  })
}))

export default router
