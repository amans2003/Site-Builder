import { Router } from 'express'
import Project from '../models/Project.js'
import Submission from '../models/Submission.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.use(requireAuth)

router.get('/', asyncHandler(async (req, res) => {
  const projects = await Project.find({ userId: req.userId }).select('name updatedAt createdAt')
  res.json({ projects })
}))

router.post('/', asyncHandler(async (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'name is required' })

  const project = await Project.create({ userId: req.userId, name })
  res.status(201).json({ project })
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.userId })
  if (!project) return res.status(404).json({ error: 'Project not found' })
  res.json({ project })
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const { name, pages, globalSections } = req.body
  const project = await Project.findOne({ _id: req.params.id, userId: req.userId })
  if (!project) return res.status(404).json({ error: 'Project not found' })

  if (name !== undefined) project.name = name
  if (pages !== undefined) project.pages = pages
  if (globalSections !== undefined) project.globalSections = globalSections
  await project.save()

  res.json({ project })
}))

router.get('/:id/submissions', asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.userId }).select('_id')
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const submissions = await Submission.find({ projectId: project._id }).sort({ createdAt: -1 })
  res.json({ submissions })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await Project.deleteOne({ _id: req.params.id, userId: req.userId })
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Project not found' })
  res.status(204).end()
}))

export default router
