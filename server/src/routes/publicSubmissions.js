import { Router } from 'express'
import Project from '../models/Project.js'
import Submission from '../models/Submission.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const MAX_FIELD_LENGTH = 200
const MAX_MESSAGE_LENGTH = 5000

const router = Router()

function parseRedirectTarget(candidate) {
  if (!candidate) return null
  try {
    const url = new URL(candidate)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

router.post('/:projectId', asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId).select('_id')
  if (!project) return res.status(404).json({ error: 'Unknown site' })

  const { name, email, phone, message, _redirect } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' })
  }

  await Submission.create({
    projectId: project._id,
    name: String(name).slice(0, MAX_FIELD_LENGTH),
    email: String(email).slice(0, MAX_FIELD_LENGTH),
    phone: phone ? String(phone).slice(0, MAX_FIELD_LENGTH) : undefined,
    message: String(message).slice(0, MAX_MESSAGE_LENGTH),
  })

  // Plain HTML form submissions expect a full-page response, not JSON — send the
  // visitor back to the page they came from with a flag the section's inline script
  // uses to swap the form for the "thanks" message.
  //
  // The form field takes priority over the Referer header: browsers only send the
  // request Origin (no path) as Referer for a cross-origin POST like this one — the
  // site and this API are different origins — so Referer alone can't reconstruct
  // which page to return to.
  const redirectUrl = parseRedirectTarget(_redirect) || parseRedirectTarget(req.get('Referer'))
  if (redirectUrl) {
    redirectUrl.searchParams.set('submitted', 'true')
    return res.redirect(303, redirectUrl.toString())
  }
  res.status(201).json({ ok: true })
}))

export default router
