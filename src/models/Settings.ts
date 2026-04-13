import mongoose, { Schema, Document } from 'mongoose'

export interface ISettings extends Document {
  key: string
  value: string
  createdAt: Date
  updatedAt: Date
}

const SettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

export const Settings =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema)
