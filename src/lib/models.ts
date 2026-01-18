import mongoose from 'mongoose'

const eventLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: 'success' },
  },
  { timestamps: true }
)

const notesSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: String, default: '' },
  },
  { timestamps: true }
)

export const EventLog = mongoose.models.EventLog || mongoose.model('EventLog', eventLogSchema)
export const Note = mongoose.models.Note || mongoose.model('Note', notesSchema)
