import mongoose, { Schema, Document } from 'mongoose'

export interface IPortfolioItem extends Document {
  title: string
  description: string
  category: string
  aspect: string
  tag: string
  tagColor: string
  base64Image: any
}

const PortfolioItemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    aspect: { type: String, required: true, enum: ['square', 'portrait', 'landscape'] },
    tag: { type: String, required: true },
    tagColor: { type: String, required: true },
    base64Image: { 
      type: String, 
      required: true 
    },
  },
  { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
)

export const PortfolioItem =
  mongoose.models.PortfolioItem || mongoose.model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema)
