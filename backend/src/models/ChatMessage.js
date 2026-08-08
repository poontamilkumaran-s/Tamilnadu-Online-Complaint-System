const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message text cannot be empty'],
      trim: true,
    },
    isSystemNote: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
