import mongoose, { Schema, Document } from 'mongoose'
import { compressData, decompressData } from '@/lib/compression'

export interface IPortfolioItem extends Document {
  title: string
  description: string
  category: string
  aspect: string
  tag: string
  tagColor: string
  base64Image: string
}

const PortfolioItemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true, get: decompressData, set: compressData },
    category: { type: String, required: true },
    aspect: { type: String, required: true, enum: ['square', 'portrait', 'landscape'] },
    tag: { type: String, required: true },
    tagColor: { type: String, required: true },
    // base64Image stored as String ("gz:<base64>" or plain "data:..." for legacy)
    // Compression/decompression handled at the API route level
    base64Image: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
)

export const PortfolioItem =
  mongoose.models.PortfolioItem || mongoose.model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema)
