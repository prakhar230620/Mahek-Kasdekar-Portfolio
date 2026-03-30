import mongoose, { Schema, Document } from 'mongoose'
import { compressToBuffer, decompressFromBuffer } from '@/lib/compression'

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
      type: Buffer, 
      required: true, 
      get: (v: any) => decompressFromBuffer(v, 'image/jpeg'), 
      set: compressToBuffer 
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
