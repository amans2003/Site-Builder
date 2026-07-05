import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    price: { type: String, default: '' },
    image: { type: String, default: '' },
    gallery: { type: [String], default: [] },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    // Empty by default: the product grid then links each card to this product's
    // own auto-generated detail page (product-{slug}.html). Set this to override
    // that — to another page name, or a custom URL — for this product's card only.
    link: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

productSchema.index({ projectId: 1, slug: 1 }, { unique: true })

export default mongoose.model('Product', productSchema)
