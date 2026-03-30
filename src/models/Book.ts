import mongoose, { Schema, Document } from 'mongoose'
import { base64ToBuffer, bufferToBase64 } from '@/lib/imageUtils'

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
    description: { type: String, required: true },
    readLink: { type: String, default: '' },
    base64Image: { 
      type: Buffer, 
      required: true,
      get: (v: any) => bufferToBase64(v, 'image/jpeg'),
      set: base64ToBuffer
    },
    base64Pdf: { 
      type: Buffer, 
      default: '',
      get: (v: any) => bufferToBase64(v, 'application/pdf'),
      set: base64ToBuffer
    },
  },
  { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
)

export const Book = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema)
