import mongoose, { Schema, Document } from 'mongoose'

export interface IGalleryItem extends Document {
  alt: string
  aspect: string
  base64Image: any
}

const GalleryItemSchema = new Schema(
  {
    alt: { type: String, required: true },
    aspect: { type: String, required: true, enum: ['square', 'portrait', 'landscape'] },
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

export const GalleryItem =
  mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema)
