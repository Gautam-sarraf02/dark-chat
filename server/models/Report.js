import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: String,
      required: true,
      index: true,
    },
    reportedUserId: {
      type: String,
      required: true,
      index: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        'Harassment',
        'Threats',
        'Sexual content',
        'Spam',
        'Illegal/harmful content',
        'Other',
      ],
    },
    details: {
      type: String,
      maxlength: 1000,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const Report = mongoose.model('Report', reportSchema);
