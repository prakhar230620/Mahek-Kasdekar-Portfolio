import mongoose, { Schema, Document } from 'mongoose'

export interface IGalleryItem extends Document {
  alt: string
  aspect: string
  base64Image: string
}

const GalleryItemSchema = new Schema(
  {
    alt: { type: String, required: true },
    aspect: { type: String, required: true, enum: ['square', 'portrait', 'landscape'] },
    // base64Image stored as String ("gz:<base64>" or plain "data:..." for legacy)
    // Compression/decompression handled at the API route level
    base64Image: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

export const GalleryItem =
  mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema)
