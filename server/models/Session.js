import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    socketId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// 48-Hour TTL for inactive session cleanup
sessionSchema.index(
  { lastSeen: 1 },
  { expireAfterSeconds: 172800 }
);

export const Session = mongoose.model('Session', sessionSchema);
