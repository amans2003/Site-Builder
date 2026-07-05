import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import uploadRoutes from './routes/upload.js'
import exportRoutes from './routes/export.js'
import aiRoutes from './routes/ai.js'
import publicSubmissionRoutes from './routes/publicSubmissions.js'
import previewRoutes from './routes/preview.js'
import productRoutes from './routes/products.js'

const app = express()
const UPLOAD_DIR = path.resolve(import.meta.dirname, '../uploads')

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use('/uploads', express.static(UPLOAD_DIR))

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/export', exportRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/public/submissions', publicSubmissionRoutes)
app.use('/api/preview', previewRoutes)
app.use('/api/projects/:projectId/products', productRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err)
    process.exit(1)
  })
