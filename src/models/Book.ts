import mongoose, { Schema, Document } from 'mongoose'
import { compressData, decompressData, compressToBuffer, decompressFromBuffer } from '@/lib/compression'

export interface IBook extends Document {
  title: string
  description: string
  readLink: string
  base64Image: any
  base64Pdf: any
}

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true, get: decompressData, set: compressData },
    readLink: { type: String, default: '' },
    base64Image: { 
      type: Buffer, 
      required: true, 
      get: (v: any) => decompressFromBuffer(v, 'image/jpeg'), 
      set: compressToBuffer 
    },
    base64Pdf: { 
      type: Buffer, 
      default: '', 
      get: (v: any) => decompressFromBuffer(v, 'application/pdf'), 
      set: compressToBuffer 
    },
  },
  { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
)

export const Book = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema)
