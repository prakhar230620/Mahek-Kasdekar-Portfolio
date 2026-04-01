import mongoose, { Schema, Document } from 'mongoose'
import { compressData, decompressData } from '@/lib/compression'

export interface IBook extends Document {
  title: string
  description: string
  readLink: string
  base64Image: string
  base64Pdf: string
}

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    // description uses text compression (String → gz: string) — getter/setter is safe for String type
    description: { type: String, required: true, get: decompressData, set: compressData },
    readLink: { type: String, default: '' },
    // base64Image and base64Pdf stored as compressed Strings ("gz:<base64>")
    // Compression/decompression handled at the API route level — NOT in the model
    base64Image: { type: String, default: '' },
    base64Pdf: { type: String, default: '' },
  },
  {
    timestamps: true,
    // Only enable getters for text fields; binary fields handled at API level
    toJSON: { getters: true },
    toObject: { getters: true }
  }
)

export const Book = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema)
