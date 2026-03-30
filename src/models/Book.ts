import mongoose, { Schema, Document } from 'mongoose'

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
      type: String, 
      required: true 
    },
    base64Pdf: { 
      type: String, 
      default: '' 
    },
  },
  { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
)

export const Book = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema)
