import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    senderUsername: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'sticker'],
      default: 'text',
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// 24-Hour TTL message expiration index
messageSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 86400 }
);

export const Message = mongoose.model('Message', messageSchema);
