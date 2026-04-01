import mongoose, { Schema, Document } from 'mongoose'
import { compressData, decompressData } from '@/lib/compression'

export interface IMessage extends Document {
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
}

const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true, get: decompressData, set: compressData },
    message: { type: String, required: true, get: decompressData, set: compressData },
    isRead: { type: Boolean, default: false },
  },
  { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
)

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)
