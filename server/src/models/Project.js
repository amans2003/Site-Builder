import mongoose from 'mongoose'

const sectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    props: { type: mongoose.Schema.Types.Mixed, default: {} },
    // When set, this placement's real content lives in project.globalSections
    // under this id — props above are ignored and the shared entry is used
    // instead, so editing it from any page updates every page that reuses it.
    globalId: { type: String },
  },
  // Mongoose's default `minimize: true` strips empty-object fields (props: {})
  // entirely on save, so a section can come back from the database with no
  // `props` key at all. Every consumer of section.props must already tolerate
  // that (see CanvasSection's defaultProps merge and each renderHTML's
  // `{ ...defaultProps, ...props }`), but disabling minimize here keeps what's
  // actually stored honest instead of silently vanishing.
  { _id: false, minimize: false },
)

const pageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sections: { type: [sectionSchema], default: [] },
  },
  { _id: false },
)

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    pages: { type: [pageSchema], default: () => [{ name: 'home', sections: [] }] },
    // Shared section definitions reusable across pages (see sectionSchema.globalId).
    globalSections: { type: [sectionSchema], default: [] },
  },
  { timestamps: true },
)

export default mongoose.model('Project', projectSchema)
