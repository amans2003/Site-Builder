import { Router } from 'express'
import Project from '../models/Project.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { slugify } from 'shared'

const router = Router({ mergeParams: true })
router.use(requireAuth)

async function loadOwnedProject(req, res) {
  const project = await Project.findOne({ _id: req.params.projectId, userId: req.userId }).select('_id')
  if (!project) {
    res.status(404).json({ error: 'Project not found' })
    return null
  }
  return project
}

async function uniqueSlug(projectId, base, excludeId) {
  let slug = base
  let i = 2
  while (
    await Product.exists({ projectId, slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })
  ) {
    slug = `${base}-${i}`
    i += 1
  }
  return slug
}

router.get('/', asyncHandler(async (req, res) => {
  const project = await loadOwnedProject(req, res)
  if (!project) return

  const products = await Product.find({ projectId: project._id }).sort({ order: 1, createdAt: 1 })
  res.json({ products })
}))

router.post('/', asyncHandler(async (req, res) => {
  const project = await loadOwnedProject(req, res)
  if (!project) return

  const { name, price, image, gallery, shortDescription, description, category, link } = req.body
  if (!name || !name.trim()) return res.status(400).json({ error: 'name is required' })

  const slug = await uniqueSlug(project._id, slugify(name))
  const product = await Product.create({
    projectId: project._id,
    name: name.trim(),
    slug,
    price,
    image,
    gallery,
    shortDescription,
    description,
    category,
    link,
  })
  res.status(201).json({ product })
}))

router.put('/:productId', asyncHandler(async (req, res) => {
  const project = await loadOwnedProject(req, res)
  if (!project) return

  const product = await Product.findOne({ _id: req.params.productId, projectId: project._id })
  if (!product) return res.status(404).json({ error: 'Product not found' })

  const { name, price, image, gallery, shortDescription, description, category, link, order } = req.body

  if (name !== undefined && name.trim() && name.trim() !== product.name) {
    product.name = name.trim()
    product.slug = await uniqueSlug(project._id, slugify(name), product._id)
  }
  if (price !== undefined) product.price = price
  if (image !== undefined) product.image = image
  if (gallery !== undefined) product.gallery = gallery
  if (shortDescription !== undefined) product.shortDescription = shortDescription
  if (description !== undefined) product.description = description
  if (category !== undefined) product.category = category
  if (link !== undefined) product.link = link
  if (order !== undefined) product.order = order

  await product.save()
  res.json({ product })
}))

router.delete('/:productId', asyncHandler(async (req, res) => {
  const project = await loadOwnedProject(req, res)
  if (!project) return

  const result = await Product.deleteOne({ _id: req.params.productId, projectId: project._id })
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Product not found' })
  res.status(204).end()
}))

export default router
