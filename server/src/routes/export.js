import { Router } from 'express'
import archiver from 'archiver'
import path from 'node:path'
import fs from 'node:fs'
import Project from '../models/Project.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'
import { generateSite } from '../export/generateSite.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const UPLOAD_DIR = path.resolve(import.meta.dirname, '../../uploads')

const router = Router()

router.get('/:id', requireAuth, asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.userId })
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const products = await Product.find({ projectId: project._id }).sort({ order: 1, createdAt: 1 })
  const { files, assets } = generateSite(project.toObject(), products.map((p) => p.toObject()))

  res.setHeader('Content-Type', 'application/zip')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${project.name.replace(/[^a-z0-9-_]/gi, '_')}.zip"`,
  )

  const archive = archiver('zip', { zlib: { level: 9 } })
  archive.on('error', (err) => {
    if (!res.headersSent) res.status(500)
    res.end(String(err))
  })
  archive.pipe(res)

  for (const file of files) {
    archive.append(file.content, { name: file.path })
  }

  for (const [uploadFilename, assetFilename] of assets) {
    const fullPath = path.join(UPLOAD_DIR, uploadFilename)
    if (fs.existsSync(fullPath)) {
      archive.file(fullPath, { name: `assets/${assetFilename}` })
    }
  }

  await archive.finalize()
}))

export default router
