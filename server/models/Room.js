import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user1: {
      userId: { type: String, required: true },
      username: { type: String, required: true },
      socketId: { type: String },
    },
    user2: {
      userId: { type: String, required: true },
      username: { type: String, required: true },
      socketId: { type: String },
    },
    status: {
      type: String,
      enum: ['active', 'ended'],
      default: 'active',
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const Room = mongoose.model('Room', roomSchema);
