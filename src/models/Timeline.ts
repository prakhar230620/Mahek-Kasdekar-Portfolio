import mongoose, { Schema, Document } from 'mongoose'

export interface ITimeline extends Document {
  title: string
  institution: string
  period: string
  description: string
  icon: string
}

const TimelineSchema = new Schema(
  {
    title: { type: String, required: true },
    institution: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: '🎓' },
  },
  { 
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true }
  }
)

// In development, ensure we don't use a stale model with old validation rules
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Timeline
}

export default mongoose.models.Timeline || mongoose.model<ITimeline>('Timeline', TimelineSchema)
