import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'
import { requireAuth } from '../middleware/auth.js'

const UPLOAD_DIR = path.resolve(import.meta.dirname, '../../uploads')
const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'])

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${crypto.randomUUID()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error('Unsupported file type'))
    }
    cb(null, true)
  },
})

const router = Router()

router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  // Absolute so it renders correctly from the client even when the frontend
  // and backend are separate deployments (e.g. Vercel + Render) — a root-
  // relative path would resolve against the frontend's own origin instead.
  const base = process.env.PUBLIC_API_BASE_URL || ''
  res.status(201).json({ url: `${base}/uploads/${req.file.filename}` })
})

export default router
